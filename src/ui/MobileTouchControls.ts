import { InputManager } from '../core/InputManager';
import { usesTouchControls } from '../core/ControlMode';

export class MobileTouchControls {
  private inputManager: InputManager;
  private container: HTMLElement | null = null;
  private joystickBase: HTMLElement | null = null;
  private joystickStick: HTMLElement | null = null;

  private btnJump: HTMLButtonElement | null = null;
  private btnAttack: HTMLButtonElement | null = null;
  private btnAction: HTMLButtonElement | null = null;
  private btnRun: HTMLButtonElement | null = null;
  private gameplayEnabled = false;


  // Joystick touch tracking
  private joystickTouchId: number | null = null;
  private joystickCenter = { x: 0, y: 0 };
  private maxRadius = 55; // pixels
  private deadZone = 0.12;

  // Camera touch tracking
  private cameraTouchId: number | null = null;
  private lastCameraPos = { x: 0, y: 0 };
  private readonly activeButtonPointers = new Map<number, HTMLButtonElement>();
  private readonly onCameraPointerDown = (event: PointerEvent): void => {
    if (!this.gameplayEnabled || this.cameraTouchId !== null || event.pointerType === 'mouse') return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('.touch-btn, .touch-joystick-zone, .hud-panel, #spell-hotbar, button, input, .modal-screen')) return;
    if (event.clientX <= window.innerWidth * 0.35) return;
    this.cameraTouchId = event.pointerId;
    this.lastCameraPos = { x: event.clientX, y: event.clientY };
  };
  private readonly onCameraPointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.cameraTouchId || !this.gameplayEnabled) return;
    const dx = event.clientX - this.lastCameraPos.x;
    const dy = event.clientY - this.lastCameraPos.y;
    this.lastCameraPos = { x: event.clientX, y: event.clientY };
    this.inputManager.mouseDeltaX += dx * 1.8;
    this.inputManager.mouseDeltaY += dy * 1.8;
  };
  private readonly onCameraPointerEnd = (event: PointerEvent): void => {
    if (event.pointerId === this.cameraTouchId) this.cameraTouchId = null;
    this.releaseButtonPointer(event.pointerId);
  };
  private readonly onWindowBlur = (): void => this.releaseAllControls();
  private readonly onVisibilityChange = (): void => {
    if (document.visibilityState !== 'visible') this.releaseAllControls();
  };

  constructor(inputManager: InputManager) {
    this.inputManager = inputManager;

    if (this.isTouchDevice()) {
      this.init();
    } else {
      console.log('[MobileTouchControls] Desktop mode detected. Touch controls hidden.');
    }
  }

  public isTouchDevice(): boolean {
    return usesTouchControls();
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
      <div id="touch-joystick-zone" class="touch-joystick-zone" aria-label="Movimiento">
        <div id="touch-joystick-base" class="touch-joystick-base">
          <div class="joystick-arrow arrow-n">&#9650;</div>
          <div class="joystick-arrow arrow-s">&#9660;</div>
          <div class="joystick-arrow arrow-w">&#9664;</div>
          <div class="joystick-arrow arrow-e">&#9654;</div>
          <div id="touch-joystick-stick" class="touch-joystick-stick"></div>
        </div>
      </div>
      <div id="touch-action-zone" class="touch-action-zone">
        <button type="button" id="touch-btn-jump" class="touch-btn touch-btn-jump" aria-label="Saltar">
          <span class="btn-icon">&#9650;</span><span class="btn-subtext">SALTO</span>
        </button>
        <button type="button" id="touch-btn-attack" class="touch-btn touch-btn-attack" aria-label="Golpe">
          <span class="btn-icon">&#9889;</span><span class="btn-subtext">GOLPE</span>
        </button>
        <button type="button" id="touch-btn-action" class="touch-btn touch-btn-action" aria-label="Acci&#243;n">
          <span class="btn-icon">&#9995;</span><span class="btn-subtext">ACCI&#211;N</span>
        </button>
        <button type="button" id="touch-btn-run" class="touch-btn touch-btn-run" aria-label="Correr">
          <span class="btn-icon">&#127939;</span><span class="btn-subtext">CORRER</span>
        </button>
      </div>`;

    document.body.appendChild(this.container);

    this.joystickBase = document.getElementById('touch-joystick-base');
    this.joystickStick = document.getElementById('touch-joystick-stick');
    this.btnJump = document.getElementById('touch-btn-jump') as HTMLButtonElement | null;
    this.btnAttack = document.getElementById('touch-btn-attack') as HTMLButtonElement | null;
    this.btnAction = document.getElementById('touch-btn-action') as HTMLButtonElement | null;
    this.btnRun = document.getElementById('touch-btn-run') as HTMLButtonElement | null;
  }

  public setGameplayEnabled(enabled: boolean): void {
    if (this.gameplayEnabled === enabled) return;
    this.gameplayEnabled = enabled;
    this.container?.classList.toggle('gameplay-active', enabled);
    for (const button of [this.btnJump, this.btnAttack, this.btnAction, this.btnRun]) {
      if (button) button.disabled = !enabled;
    }
    if (!enabled) {
      this.releaseAllControls();
    }
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
    zone.addEventListener('pointerdown', (event: PointerEvent) => {
      if (!this.gameplayEnabled || event.button !== 0 || this.joystickTouchId !== null) return;
      event.preventDefault();
      const rect = this.joystickBase!.getBoundingClientRect();
      this.joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      this.maxRadius = Math.min(55, rect.width * 0.34);
      this.joystickTouchId = event.pointerId;
      zone.setPointerCapture(event.pointerId);
      this.joystickBase!.classList.add('active');
      this.updateJoystickPosition(event.clientX, event.clientY);
    });
    zone.addEventListener('pointermove', (event: PointerEvent) => {
      if (event.pointerId !== this.joystickTouchId) return;
      event.preventDefault();
      this.updateJoystickPosition(event.clientX, event.clientY);
    });
    const release = (event: PointerEvent) => {
      if (event.pointerId === this.joystickTouchId) this.resetJoystick();
    };
    zone.addEventListener('pointerup', release);
    zone.addEventListener('pointercancel', release);
    zone.addEventListener('lostpointercapture', release);
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
    const actions: Array<[HTMLButtonElement | null, () => void]> = [
      [this.btnJump, () => this.inputManager.triggerJump()],
      [this.btnAttack, () => this.inputManager.triggerAttack()],
      [this.btnAction, () => this.inputManager.triggerInteract()],
    ];
    for (const [button, action] of actions) {
      if (!button) continue;
      button.addEventListener('pointerdown', (event: PointerEvent) => {
        if (!this.gameplayEnabled || event.button !== 0 || button.disabled) return;
        event.preventDefault();
        event.stopPropagation();
        if ([...this.activeButtonPointers.values()].includes(button)) return;
        this.activeButtonPointers.set(event.pointerId, button);
        button.setPointerCapture(event.pointerId);
        button.classList.add('pressed');
        action();
      });
      const release = (event: PointerEvent) => this.releaseButtonPointer(event.pointerId);
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      button.addEventListener('lostpointercapture', release);
    }

    const runButton = this.btnRun;
    runButton?.addEventListener('pointerdown', (event: PointerEvent) => {
      if (!this.gameplayEnabled || event.button !== 0 || runButton.disabled) return;
      event.preventDefault();
      event.stopPropagation();
      if ([...this.activeButtonPointers.values()].includes(runButton)) return;
      this.activeButtonPointers.set(event.pointerId, runButton);
      runButton.setPointerCapture(event.pointerId);
      runButton.classList.add('active');
      this.inputManager.touchIsRunning = true;
    });
    const releaseRun = (event: PointerEvent) => this.releaseButtonPointer(event.pointerId);
    runButton?.addEventListener('pointerup', releaseRun);
    runButton?.addEventListener('pointercancel', releaseRun);
    runButton?.addEventListener('lostpointercapture', releaseRun);
  }
  private bindCameraEvents(): void {
    window.addEventListener('pointerdown', this.onCameraPointerDown, { passive: true });
    window.addEventListener('pointermove', this.onCameraPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onCameraPointerEnd, { passive: true });
    window.addEventListener('pointercancel', this.onCameraPointerEnd, { passive: true });
    window.addEventListener('blur', this.onWindowBlur);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private releaseButtonPointer(pointerId: number): void {
    const button = this.activeButtonPointers.get(pointerId);
    if (!button) return;
    this.activeButtonPointers.delete(pointerId);
    const stillHeld = [...this.activeButtonPointers.values()].includes(button);
    if (!stillHeld) button.classList.remove('pressed', 'active');
    if (button === this.btnRun && !stillHeld) this.inputManager.touchIsRunning = false;
  }

  private releaseAllControls(): void {
    this.resetJoystick();
    this.cameraTouchId = null;
    for (const pointerId of [...this.activeButtonPointers.keys()]) this.releaseButtonPointer(pointerId);
    this.activeButtonPointers.clear();
    this.inputManager.touchIsRunning = false;
    for (const button of [this.btnJump, this.btnAttack, this.btnAction, this.btnRun]) {
      button?.classList.remove('active', 'pressed');
    }
  }

  public destroy(): void {
    this.releaseAllControls();
    window.removeEventListener('pointerdown', this.onCameraPointerDown);
    window.removeEventListener('pointermove', this.onCameraPointerMove);
    window.removeEventListener('pointerup', this.onCameraPointerEnd);
    window.removeEventListener('pointercancel', this.onCameraPointerEnd);
    window.removeEventListener('blur', this.onWindowBlur);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.container?.remove();
    this.container = null;
  }
}