import { InputManager } from '../core/InputManager';

export class MobileTouchControls {
  private inputManager: InputManager;
  private container: HTMLElement | null = null;
  private joystickBase: HTMLElement | null = null;
  private joystickStick: HTMLElement | null = null;

  private btnJump: HTMLElement | null = null;
  private btnAttack: HTMLElement | null = null;
  private btnAction: HTMLElement | null = null;
  private btnRun: HTMLElement | null = null;

  // Joystick touch tracking
  private joystickTouchId: number | null = null;
  private joystickCenter = { x: 0, y: 0 };
  private maxRadius = 55; // pixels
  private deadZone = 0.12;

  // Camera touch tracking
  private cameraTouchId: number | null = null;
  private lastCameraPos = { x: 0, y: 0 };

  constructor(inputManager: InputManager) {
    this.inputManager = inputManager;

    if (this.isTouchDevice()) {
      this.init();
    } else {
      console.log('[MobileTouchControls] Desktop mode detected. Touch controls hidden.');
    }
  }

  public isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 1024
    );
  }

  private init(): void {
    console.log('[MobileTouchControls] Initializing mobile touch interface...');
    this.createControlsHTML();
    this.bindJoystickEvents();
    this.bindButtonEvents();
    this.bindCameraEvents();
  }

  private createControlsHTML(): void {
    let el = document.getElementById('lisar-mobile-touch-overlay');
    if (el) el.remove();

    this.container = document.createElement('div');
    this.container.id = 'lisar-mobile-touch-overlay';
    this.container.className = 'lisar-touch-overlay';

    this.container.innerHTML = `
      <!-- LEFT: 360° Virtual Analog Joystick -->
      <div id="touch-joystick-zone" class="touch-joystick-zone">
        <div id="touch-joystick-base" class="touch-joystick-base">
          <div class="joystick-arrow arrow-n">▲</div>
          <div class="joystick-arrow arrow-s">▼</div>
          <div class="joystick-arrow arrow-w">◀</div>
          <div class="joystick-arrow arrow-e">▶</div>
          <div id="touch-joystick-stick" class="touch-joystick-stick"></div>
        </div>
      </div>

      <!-- RIGHT: Ergonomic Action Buttons Diamond/Arc -->
      <div id="touch-action-zone" class="touch-action-zone">
        <!-- JUMP BUTTON (Top) -->
        <button id="touch-btn-jump" class="touch-btn touch-btn-jump" aria-label="Saltar">
          <span class="btn-icon">▲</span>
          <span class="btn-subtext">SALTO</span>
        </button>

        <!-- ATTACK BUTTON (Left/Center) -->
        <button id="touch-btn-attack" class="touch-btn touch-btn-attack" aria-label="Atacar">
          <span class="btn-icon">⚡</span>
          <span class="btn-subtext">ATAQUE</span>
        </button>

        <!-- ACTION / INTERACT BUTTON (Right/Center) -->
        <button id="touch-btn-action" class="touch-btn touch-btn-action" aria-label="Acción">
          <span class="btn-icon">✋</span>
          <span class="btn-subtext">ACCIÓN</span>
        </button>

        <!-- RUN BUTTON (Bottom) -->
        <button id="touch-btn-run" class="touch-btn touch-btn-run" aria-label="Correr">
          <span class="btn-icon">🏃</span>
          <span class="btn-subtext">CORRER</span>
        </button>
      </div>
    `;

    document.body.appendChild(this.container);

    this.joystickBase = document.getElementById('touch-joystick-base');
    this.joystickStick = document.getElementById('touch-joystick-stick');
    this.btnJump = document.getElementById('touch-btn-jump');
    this.btnAttack = document.getElementById('touch-btn-attack');
    this.btnAction = document.getElementById('touch-btn-action');
    this.btnRun = document.getElementById('touch-btn-run');
  }

  public setActionHighlight(active: boolean): void {
    if (!this.btnAction) return;
    if (active) {
      this.btnAction.classList.add('context-active');
    } else {
      this.btnAction.classList.remove('context-active');
    }
  }

  private bindJoystickEvents(): void {
    if (!this.joystickBase || !this.joystickStick) return;

    const zone = document.getElementById('touch-joystick-zone');
    if (!zone) return;

    const handleStart = (e: TouchEvent) => {
      e.preventDefault();
      if (this.joystickTouchId !== null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const rect = this.joystickBase!.getBoundingClientRect();
        this.joystickCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        this.joystickTouchId = touch.identifier;
        this.joystickBase!.classList.add('active');
        this.updateJoystickPosition(touch.clientX, touch.clientY);
        break;
      }
    };

    const handleMove = (e: TouchEvent) => {
      e.preventDefault();
      if (this.joystickTouchId === null) return;

      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === this.joystickTouchId) {
          this.updateJoystickPosition(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleEnd = (e: TouchEvent) => {
      if (this.joystickTouchId === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.joystickTouchId) {
          this.resetJoystick();
          break;
        }
      }
    };

    zone.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd, { passive: false });
    window.addEventListener('touchcancel', handleEnd, { passive: false });
  }

  private updateJoystickPosition(clientX: number, clientY: number): void {
    if (!this.joystickStick) return;

    let dx = clientX - this.joystickCenter.x;
    let dy = clientY - this.joystickCenter.y;
    const distance = Math.hypot(dx, dy);

    if (distance > this.maxRadius) {
      dx = (dx / distance) * this.maxRadius;
      dy = (dy / distance) * this.maxRadius;
    }

    // Move visual stick
    this.joystickStick.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

    // Calculate normalized vector (-1.0 to +1.0)
    let normX = dx / this.maxRadius;
    let normY = dy / this.maxRadius;
    const normMag = Math.hypot(normX, normY);

    if (normMag < this.deadZone) {
      this.inputManager.touchAnalogX = 0;
      this.inputManager.touchAnalogZ = 0;
    } else {
      // Re-map beyond deadZone for smooth gradient
      const scale = (normMag - this.deadZone) / (1 - this.deadZone);
      normX = (normX / normMag) * scale;
      normY = (normY / normMag) * scale;

      this.inputManager.touchAnalogX = normX;
      this.inputManager.touchAnalogZ = -normY; // Invert Y (up on screen = forward/positive Z)
    }
  }

  private resetJoystick(): void {
    this.joystickTouchId = null;
    this.inputManager.touchAnalogX = 0;
    this.inputManager.touchAnalogZ = 0;

    if (this.joystickStick) {
      this.joystickStick.style.transform = `translate3d(0px, 0px, 0)`;
    }
    if (this.joystickBase) {
      this.joystickBase.classList.remove('active');
    }
  }

  private bindButtonEvents(): void {
    // ── JUMP BUTTON ──────────────────────────────────────────────────────────
    if (this.btnJump) {
      const triggerJump = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.animateButtonPress(this.btnJump!);
        this.inputManager.triggerJump();
      };
      this.btnJump.addEventListener('touchstart', triggerJump, { passive: false });
    }

    // ── ATTACK BUTTON ────────────────────────────────────────────────────────
    if (this.btnAttack) {
      const triggerAttack = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.animateButtonPress(this.btnAttack!);
        this.inputManager.triggerAttack();
      };
      this.btnAttack.addEventListener('touchstart', triggerAttack, { passive: false });
    }

    // ── ACTION / INTERACT BUTTON ─────────────────────────────────────────────
    if (this.btnAction) {
      const triggerAction = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.animateButtonPress(this.btnAction!);
        this.inputManager.triggerInteract();
      };
      this.btnAction.addEventListener('touchstart', triggerAction, { passive: false });
    }

    // ── RUN BUTTON (HOLD SUPPORT) ────────────────────────────────────────────
    if (this.btnRun) {
      const startRun = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.btnRun!.classList.add('active');
        this.inputManager.touchIsRunning = true;
      };

      const stopRun = (e: Event) => {
        e.preventDefault();
        this.btnRun!.classList.remove('active');
        this.inputManager.touchIsRunning = false;
      };

      this.btnRun.addEventListener('touchstart', startRun, { passive: false });
      this.btnRun.addEventListener('touchend', stopRun, { passive: false });
      this.btnRun.addEventListener('touchcancel', stopRun, { passive: false });
    }
  }

  private animateButtonPress(btn: HTMLElement): void {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 140);
  }

  private bindCameraEvents(): void {
    // Touch camera dragging on screen area outside UI buttons
    window.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        if (this.cameraTouchId !== null) return;

        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const targetEl = touch.target as HTMLElement;

          // Ignore if touch started on UI overlay elements
          if (targetEl.closest('.touch-btn') || targetEl.closest('.touch-joystick-zone') || targetEl.closest('.hud-panel')) {
            continue;
          }

          // Must start in right 65% of screen
          if (touch.clientX > window.innerWidth * 0.35) {
            this.cameraTouchId = touch.identifier;
            this.lastCameraPos = { x: touch.clientX, y: touch.clientY };
            break;
          }
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (this.cameraTouchId === null) return;

        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          if (touch.identifier === this.cameraTouchId) {
            const dx = touch.clientX - this.lastCameraPos.x;
            const dy = touch.clientY - this.lastCameraPos.y;
            this.lastCameraPos = { x: touch.clientX, y: touch.clientY };

            // Feed camera rotation delta directly into InputManager
            this.inputManager.mouseDeltaX += dx * 1.8;
            this.inputManager.mouseDeltaY += dy * 1.8;
            break;
          }
        }
      },
      { passive: true }
    );

    const stopCamera = (e: TouchEvent) => {
      if (this.cameraTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.cameraTouchId) {
          this.cameraTouchId = null;
          break;
        }
      }
    };

    window.addEventListener('touchend', stopCamera, { passive: true });
    window.addEventListener('touchcancel', stopCamera, { passive: true });
  }
}
