export class InputManager {
  public keys: { [key: string]: boolean } = {};
  public mouseDeltaX = 0;
  public mouseDeltaY = 0;
  public isPointerLocked = false;
  
  public onLeftClick: (() => void) | null = null;
  public onKick: (() => void) | null = null;
  public onJumpPress: (() => void) | null = null;
  public onInteract: (() => void) | null = null;
  public onSkipSubtitle: (() => void) | null = null;
  public onToggleDebug: (() => void) | null = null;
  public onSelectSpell: ((spellIndex: number) => void) | null = null;
  public onPointerLockChange: ((isLocked: boolean) => void) | null = null;
  public onPauseToggle: (() => void) | null = null;

  private ctrlDown = false;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initListeners();
  }

  public resetInputs(): void {
    this.keys = {};
    this.touchAnalogX = 0;
    this.touchAnalogZ = 0;
    this.touchIsRunning = false;
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
  }

  private initListeners(): void {
    window.addEventListener('keydown', (e) => {
      // Toggle Pause with KeyP or Escape only (Enter is reserved for dialogue & skipping)
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.onPauseToggle) {
          e.preventDefault();
          this.onPauseToggle();
          return;
        }
      }

      this.keys[e.code] = true;

      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        this.onSelectSpell?.(0);
      }
      if (e.code === 'Digit2' || e.code === 'Numpad2') {
        this.onSelectSpell?.(1);
      }
      if (e.code === 'Digit3' || e.code === 'Numpad3') {
        this.onSelectSpell?.(2);
      }

      if (e.code === 'Space') {
        if (this.onJumpPress) this.onJumpPress();
      }

      if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        if (!this.ctrlDown) {
          this.ctrlDown = true;
          console.log('[InputManager] Control key down, firing onKick callback');
          if (this.onKick) this.onKick();
        }
      }

      if (e.code === 'KeyE') {
        if (this.onInteract) this.onInteract();
      }

      if (e.code === 'Space' || e.code === 'Escape') {
        if (this.onSkipSubtitle) this.onSkipSubtitle();
      }

      if (e.code === 'F3') {
        e.preventDefault();
        if (this.onToggleDebug) this.onToggleDebug();
      }
    });

    window.addEventListener('wheel', (e) => {
      if (this.isPointerLocked && this.onSelectSpell) {
        this.onSelectSpell(e.deltaY > 0 ? 1 : 0);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        this.ctrlDown = false;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.mouseDeltaX += e.movementX;
        this.mouseDeltaY += e.movementY;
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvas;
      if (this.onPointerLockChange) this.onPointerLockChange(this.isPointerLocked);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.isPointerLocked) {
        this.requestPointerLock();
        return;
      }

      if (e.button === 0) { // Left Click
        if (this.onLeftClick) this.onLeftClick();
      }
    });
  }

  public requestPointerLock(): void {
    this.canvas.requestPointerLock();
  }

  public exitPointerLock(): void {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  public consumeMouseDelta(): { x: number; y: number } {
    const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }

  // Touch / Mobile Analog inputs
  public touchAnalogX = 0;
  public touchAnalogZ = 0;
  public touchIsRunning = false;

  public triggerKick(): void {
    if (this.onKick) this.onKick();
  }

  public triggerMagicSpell(): void {
    if (this.onLeftClick) this.onLeftClick();
  }

  public triggerAttack(): void {
    if (this.onLeftClick) {
      this.onLeftClick();
    } else if (this.onKick) {
      this.onKick();
    }
  }

  public triggerJump(): void {
    if (this.onJumpPress) this.onJumpPress();
  }

  public triggerInteract(): void {
    if (this.onInteract) this.onInteract();
  }

  // Key getters (combined Keyboard + Touch Analog)
  public get moveForward(): boolean {
    return !!(this.keys['KeyW'] || this.keys['ArrowUp']) || this.touchAnalogZ > 0.15;
  }

  public get moveBackward(): boolean {
    return !!(this.keys['KeyS'] || this.keys['ArrowDown']) || this.touchAnalogZ < -0.15;
  }

  public get moveLeft(): boolean {
    return !!(this.keys['KeyA'] || this.keys['ArrowLeft']) || this.touchAnalogX < -0.15;
  }

  public get moveRight(): boolean {
    return !!(this.keys['KeyD'] || this.keys['ArrowRight']) || this.touchAnalogX > 0.15;
  }

  public get isRunning(): boolean {
    return !!(this.keys['ShiftLeft'] || this.keys['ShiftRight']) || this.touchIsRunning;
  }

  public get isJumping(): boolean {
    return !!this.keys['Space'];
  }
}
