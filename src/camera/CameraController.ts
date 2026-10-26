import * as THREE from 'three';
import { InputManager } from '../core/InputManager';

/**
 * Optimized Third-Person Camera with smooth follow and camera collision avoidance.
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
  private overviewRemaining = 0;
  private readonly overviewDuration = 4.2;
  private scriptedPan: { fromYaw: number; toYaw: number; fromPitch: number; toPitch: number; elapsed: number; duration: number } | null = null;

  // Auto-recenter
  private idleTimer = 0;
  private readonly RECENTER_DELAY = 0.8;
  private isManual = false;

  // Camera collision
  private collisionRaycaster = new THREE.Raycaster();
  private collisionObjects: THREE.Object3D[] = [];

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  public setTarget(target: THREE.Object3D): void {
    this.target = target;
    if (this.target) {
      this.currentLookAt.copy(this.target.position);
      this.currentLookAt.y += this.heightOffset;
      this.updatePosition(1.0, null);
    }
  }

  public snapBehindTarget(showTempleOverview = false): void {
    if (!this.target) return;
    // The character faces -Z at a new-game spawn, so +Z is behind them.
    this.yaw = this.target.rotation.y + Math.PI;
    this.pitch = showTempleOverview ? 0.18 : 0.22;
    this.distance = showTempleOverview ? 16.5 : 5.5;
    this.currentDistance = this.distance;
    this.overviewRemaining = showTempleOverview ? this.overviewDuration : 0;
    const overviewFov = window.innerWidth < window.innerHeight ? 70 : 64;
    if (showTempleOverview && Math.abs(this.camera.fov - overviewFov) > 0.05) {
      this.camera.fov = overviewFov;
      this.camera.updateProjectionMatrix();
    }
    this.currentLookAt.copy(this.target.position).add(new THREE.Vector3(0, this.heightOffset, 0));
    
    const dir = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );
    this.currentPosition.copy(this.currentLookAt).addScaledVector(dir, this.currentDistance);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public resumeAfterCinematic(): void {
    if (!this.target) return;
    this.currentLookAt.copy(this.target.position);
    this.currentLookAt.y += this.heightOffset;
    CameraController.TEMP_DIR.subVectors(this.camera.position, this.currentLookAt);
    const distance = Math.max(3.5, Math.min(9, CameraController.TEMP_DIR.length()));
    if (CameraController.TEMP_DIR.lengthSq() < 0.0001) CameraController.TEMP_DIR.set(0, 0.25, 1);
    CameraController.TEMP_DIR.normalize();
    this.yaw = Math.atan2(CameraController.TEMP_DIR.x, CameraController.TEMP_DIR.z);
    this.pitch = THREE.MathUtils.clamp(Math.asin(THREE.MathUtils.clamp(CameraController.TEMP_DIR.y, -1, 1)), this.minPitch, this.maxPitch);
    this.distance = distance;
    this.currentDistance = distance;
    this.currentPosition.copy(this.camera.position);
    this.idleTimer = 0;
    this.isManual = false;
  }

  /** Smoothly glance toward a nearby landmark for a one-time traversal tutorial. */
  public panToward(point: THREE.Vector3, duration = 1.5): void {
    if (!this.target) return;
    const dx = point.x - this.target.position.x;
    const dy = point.y - (this.target.position.y + this.heightOffset);
    const dz = point.z - this.target.position.z;
    const toYaw = Math.atan2(-dx, -dz);
    const fromYaw = this.yaw;
    let diff = toYaw - fromYaw;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.scriptedPan = {
      fromYaw,
      toYaw: fromYaw + diff,
      fromPitch: this.pitch,
      toPitch: THREE.MathUtils.clamp(Math.atan2(dy, Math.hypot(dx, dz)), this.minPitch, this.maxPitch),
      elapsed: 0,
      duration: Math.max(0.2, duration),
    };
  }

  public setCollisionObjects(objects: THREE.Object3D[]): void {
    // Only store major solid structural meshes (filter out small sub-children)
    this.collisionObjects = objects.filter(o => o.type === 'Mesh' && (o as THREE.Mesh).geometry);
  }

  public update(delta: number, input: InputManager): void {
    if (!this.target) return;

    // ── 1. Mouse/touch input ──────────────────────────────────────────────────
    const mouseDelta  = input.consumeMouseDelta();
    const sensitivity = 0.0024;
    this.isManual = Math.hypot(mouseDelta.x, mouseDelta.y) > 0.5;

    if (this.overviewRemaining > 0) {
      this.overviewRemaining = Math.max(0, this.overviewRemaining - delta);
      const progress = 1 - this.overviewRemaining / this.overviewDuration;
      const eased = progress * progress * (3 - 2 * progress);
      this.distance = THREE.MathUtils.lerp(16.5, 5.5, eased);
      if (this.isManual || (input.moveForward || input.moveBackward || input.moveLeft || input.moveRight)) {
        this.overviewRemaining = 0;
        this.distance = 5.5;
      }
    }

    if (this.isManual) {
      this.scriptedPan = null;
      this.yaw   -= mouseDelta.x * sensitivity;
      this.pitch -= mouseDelta.y * sensitivity;
      this.pitch  = THREE.MathUtils.clamp(this.pitch, this.minPitch, this.maxPitch);
      this.idleTimer = 0;
    } else {
      this.idleTimer += delta;
      if (this.scriptedPan) {
        const pan = this.scriptedPan;
        pan.elapsed = Math.min(pan.duration, pan.elapsed + delta);
        const progress = pan.elapsed / pan.duration;
        const eased = progress * progress * (3 - 2 * progress);
        this.yaw = THREE.MathUtils.lerp(pan.fromYaw, pan.toYaw, eased);
        this.pitch = THREE.MathUtils.lerp(pan.fromPitch, pan.toPitch, eased);
        if (pan.elapsed >= pan.duration) this.scriptedPan = null;
      }
    }

    // ── 2. Passive recenter ──────────────────────────────────────────
    const isMoving = input.moveForward || input.moveBackward || input.moveLeft || input.moveRight;
    if (!this.isManual && this.idleTimer > this.RECENTER_DELAY && isMoving) {
      const targetYaw = this.target.rotation.y + Math.PI;
      let diff = targetYaw - this.yaw;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff >  Math.PI) diff -= Math.PI * 2;

      const alignSpeed = Math.min(1.0, delta * 3.0);
      this.yaw += diff * alignSpeed;
    }

    // ── 3. Position + collision ───────────────────────────────────────────────
    this.updatePosition(delta, input);
  }

  // Static preallocated vectors for zero-allocation performance
  private static readonly TEMP_FOCUS = new THREE.Vector3();
  private static readonly TEMP_DIR = new THREE.Vector3();
  private static readonly TEMP_IDEAL = new THREE.Vector3();
  private static readonly TEMP_FORWARD = new THREE.Vector3();
  private static readonly TEMP_RIGHT = new THREE.Vector3();

  private updatePosition(delta: number, input: InputManager | null): void {
    if (!this.target) return;

    CameraController.TEMP_FOCUS.copy(this.target.position);
    CameraController.TEMP_FOCUS.y += this.heightOffset;

    // Smooth position tracking
    const lerpSpeed = Math.min(1.0, delta * 18.0);
    this.currentLookAt.lerp(CameraController.TEMP_FOCUS, lerpSpeed);

    // Camera direction from yaw/pitch
    CameraController.TEMP_DIR.set(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );

    // ── Fast Collision avoidance ────────────────────────────────────────────────
    let targetDist = this.distance;
    if (this.collisionObjects.length > 0) {
      this.collisionRaycaster.set(this.currentLookAt, CameraController.TEMP_DIR);
      // Non-recursive raycast against top-level meshes for maximum performance!
      const hits = this.collisionRaycaster.intersectObjects(this.collisionObjects, false);
      if (hits.length > 0 && hits[0].distance < this.distance) {
        targetDist = Math.max(0.8, hits[0].distance - 0.3);
      }
    }

    const pushIn  = targetDist < this.currentDistance;
    const dLerp   = Math.min(1.0, delta * (pushIn ? 28.0 : 8.0));
    this.currentDistance = THREE.MathUtils.lerp(this.currentDistance, targetDist, dLerp);

    CameraController.TEMP_IDEAL.copy(this.currentLookAt).addScaledVector(CameraController.TEMP_DIR, this.currentDistance);
    this.currentPosition.lerp(CameraController.TEMP_IDEAL, lerpSpeed);

    // ── Dynamic FOV (Only update matrix when FOV changes) ────────────────────
    const isRunning = input
      ? (input.isRunning && (input.moveForward || input.moveBackward || input.moveLeft || input.moveRight))
      : false;
    const targetFov = this.overviewRemaining > 0
      ? (window.innerWidth < window.innerHeight ? 70 : 64)
      : isRunning ? 65 : 60;
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, Math.min(1.0, delta * 6.0));
      this.camera.updateProjectionMatrix();
    }

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public getForwardVector(): THREE.Vector3 {
    return CameraController.TEMP_FORWARD.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
  }

  public getRightVector(): THREE.Vector3 {
    return CameraController.TEMP_RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
  }
}

