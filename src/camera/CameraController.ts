import * as THREE from 'three';
import { InputManager } from '../core/InputManager';

/**
 * Third-person camera with:
 * - Passive auto-recenter behind the player (after 0.8s idle)
 * - Manual override that disables auto-follow until input stops
 * - Camera collision avoidance (raycast from target to camera)
 * - Dynamic FOV based on speed
 * - Screen-space motion blur via canvas 2D overlay (angular velocity → blur opacity)
 */
export class CameraController {
  public camera: THREE.PerspectiveCamera;
  public target: THREE.Object3D | null = null;

  public yaw   = 0;
  public pitch = 0.25;
  public distance = 5.5;
  public heightOffset = 1.65;

  private minPitch = -0.45;
  private maxPitch = 1.15;

  private currentPosition = new THREE.Vector3();
  private currentLookAt   = new THREE.Vector3();
  private currentDistance = 5.5;

  // Auto-recenter
  private idleTimer = 0;
  private readonly RECENTER_DELAY = 0.8; // seconds before auto-recenter starts
  private isManual = false;

  // Camera collision
  private collisionRaycaster = new THREE.Raycaster();
  private collisionObjects: THREE.Object3D[] = [];

  // Motion blur
  private prevYaw = 0;
  private prevPitch = 0;
  private angularSpeed = 0;   // radians/second (smoothed)
  private blurCanvas: HTMLCanvasElement | null = null;
  private blurCtx: CanvasRenderingContext2D | null = null;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.initMotionBlur();
  }

  private initMotionBlur(): void {
    // Overlay canvas for screen-space directional blur
    const canvas = document.createElement('canvas');
    canvas.id = 'motion-blur-overlay';
    canvas.style.cssText = [
      'position:fixed', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:10', 'opacity:0',
    ].join(';');
    document.body.appendChild(canvas);
    this.blurCanvas = canvas;
    this.blurCtx    = canvas.getContext('2d');
    this.resizeBlurCanvas();
    window.addEventListener('resize', () => this.resizeBlurCanvas());
  }

  private resizeBlurCanvas(): void {
    if (!this.blurCanvas) return;
    this.blurCanvas.width  = window.innerWidth;
    this.blurCanvas.height = window.innerHeight;
  }

  private updateMotionBlur(delta: number): void {
    if (!this.blurCtx || !this.blurCanvas) return;

    const rawAngular = Math.hypot(this.yaw - this.prevYaw, this.pitch - this.prevPitch) / delta;
    this.prevYaw   = this.yaw;
    this.prevPitch = this.pitch;

    // Smooth angular velocity so blur fades gracefully
    this.angularSpeed = THREE.MathUtils.lerp(this.angularSpeed, rawAngular, Math.min(1.0, delta * 12.0));

    // Threshold: below 0.8 rad/s = no blur. Max at 4 rad/s.
    const blurStrength = THREE.MathUtils.clamp((this.angularSpeed - 0.8) / 3.2, 0, 1.0);

    const ctx = this.blurCtx;
    const w   = this.blurCanvas.width;
    const h   = this.blurCanvas.height;

    ctx.clearRect(0, 0, w, h);

    if (blurStrength > 0.01) {
      // Radial gradient from center outward — edges blur more
      const numPasses = Math.ceil(blurStrength * 5);
      const maxOffset = blurStrength * 18;  // max pixel spread

      for (let i = 0; i < numPasses; i++) {
        const frac   = (i + 1) / numPasses;
        const offset = frac * maxOffset;
        const alpha  = (blurStrength * 0.06) / numPasses;

        // Black vignette streaks radiating outward from center
        const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.15, w / 2, h / 2, h * 0.72);
        grad.addColorStop(0, `rgba(0,0,0,0)`);
        grad.addColorStop(1, `rgba(0,0,0,${alpha.toFixed(3)})`);

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(1.0 + offset * 0.004, 1.0 + offset * 0.004);
        ctx.translate(-w / 2, -h / 2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    }

    // Set overall canvas opacity
    this.blurCanvas.style.opacity = (blurStrength * 0.85).toFixed(3);
  }

  public setTarget(target: THREE.Object3D): void {
    this.target = target;
    if (this.target) {
      this.currentLookAt.copy(this.target.position);
      this.currentLookAt.y += this.heightOffset;
      this.updatePosition(1.0, null);
    }
  }

  public setCollisionObjects(objects: THREE.Object3D[]): void {
    this.collisionObjects = objects;
  }

  public update(delta: number, input: InputManager): void {
    if (!this.target) return;

    // ── 1. Mouse/touch input ──────────────────────────────────────────────────
    const mouseDelta  = input.consumeMouseDelta();
    const sensitivity = 0.0024;
    this.isManual = Math.hypot(mouseDelta.x, mouseDelta.y) > 0.5;

    if (this.isManual) {
      this.yaw   -= mouseDelta.x * sensitivity;
      this.pitch -= mouseDelta.y * sensitivity;
      this.pitch  = THREE.MathUtils.clamp(this.pitch, this.minPitch, this.maxPitch);
      this.idleTimer = 0;
    } else {
      this.idleTimer += delta;
    }

    // ── 2. Passive recenter (after RECENTER_DELAY of no mouse input) ──────────
    const isMoving = input.moveForward || input.moveBackward || input.moveLeft || input.moveRight;
    if (!this.isManual && this.idleTimer > this.RECENTER_DELAY && isMoving) {
      // Align yaw to behind-player direction
      const targetYaw = this.target.rotation.y + Math.PI;
      let diff = targetYaw - this.yaw;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff >  Math.PI) diff -= Math.PI * 2;

      // Stronger recenter when moving fast, gentler when almost aligned
      const alignSpeed = Math.min(1.0, delta * 2.2);
      this.yaw += diff * alignSpeed;
    }

    // ── 3. Position + collision ───────────────────────────────────────────────
    this.updatePosition(delta, input);

    // ── 4. Motion blur ────────────────────────────────────────────────────────
    this.updateMotionBlur(delta);
  }

  private updatePosition(delta: number, input: InputManager | null): void {
    if (!this.target) return;

    const targetFocus = new THREE.Vector3()
      .copy(this.target.position)
      .add(new THREE.Vector3(0, this.heightOffset, 0));

    const lerpSpeed = Math.min(1.0, delta * 13.0);
    this.currentLookAt.lerp(targetFocus, lerpSpeed);

    // Camera direction from yaw/pitch
    const dir = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );

    // ── Collision avoidance ────────────────────────────────────────────────
    let targetDist = this.distance;
    if (this.collisionObjects.length > 0) {
      this.collisionRaycaster.set(this.currentLookAt, dir);
      const hits = this.collisionRaycaster.intersectObjects(this.collisionObjects, true);
      if (hits.length > 0 && hits[0].distance < this.distance) {
        targetDist = Math.max(0.7, hits[0].distance - 0.3);
      }
    }

    // Fast push-in, slow pop-out
    const pushIn  = targetDist < this.currentDistance;
    const dLerp   = Math.min(1.0, delta * (pushIn ? 28.0 : 5.5));
    this.currentDistance = THREE.MathUtils.lerp(this.currentDistance, targetDist, dLerp);

    const idealPos = new THREE.Vector3()
      .copy(this.currentLookAt)
      .addScaledVector(dir, this.currentDistance);

    this.currentPosition.lerp(idealPos, lerpSpeed);

    // ── Dynamic FOV ────────────────────────────────────────────────────────
    const isRunning = input
      ? (input.isRunning && (input.moveForward || input.moveBackward || input.moveLeft || input.moveRight))
      : false;
    const targetFov = isRunning ? 65 : 60;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, Math.min(1.0, delta * 6.0));
    this.camera.updateProjectionMatrix();

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public getForwardVector(): THREE.Vector3 {
    return new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
  }

  public getRightVector(): THREE.Vector3 {
    return new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
  }
}
