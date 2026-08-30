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

  public snapBehindTarget(): void {
    if (!this.target) return;
    this.yaw = Math.PI; // Look along -Z
    this.pitch = 0.22;
    this.distance = 5.5;
    this.currentDistance = 5.5;
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

    if (this.isManual) {
      this.yaw   -= mouseDelta.x * sensitivity;
      this.pitch -= mouseDelta.y * sensitivity;
      this.pitch  = THREE.MathUtils.clamp(this.pitch, this.minPitch, this.maxPitch);
      this.idleTimer = 0;
    } else {
      this.idleTimer += delta;
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

  private updatePosition(delta: number, input: InputManager | null): void {
    if (!this.target) return;

    const targetFocus = new THREE.Vector3()
      .copy(this.target.position)
      .add(new THREE.Vector3(0, this.heightOffset, 0));

    // Smooth position tracking
    const lerpSpeed = Math.min(1.0, delta * 18.0);
    this.currentLookAt.lerp(targetFocus, lerpSpeed);

    // Camera direction from yaw/pitch
    const dir = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );

    // ── Fast Collision avoidance ────────────────────────────────────────────────
    let targetDist = this.distance;
    if (this.collisionObjects.length > 0) {
      this.collisionRaycaster.set(this.currentLookAt, dir);
      // Non-recursive raycast against top-level meshes for maximum performance!
      const hits = this.collisionRaycaster.intersectObjects(this.collisionObjects, false);
      if (hits.length > 0 && hits[0].distance < this.distance) {
        targetDist = Math.max(0.8, hits[0].distance - 0.3);
      }
    }

    const pushIn  = targetDist < this.currentDistance;
    const dLerp   = Math.min(1.0, delta * (pushIn ? 28.0 : 8.0));
    this.currentDistance = THREE.MathUtils.lerp(this.currentDistance, targetDist, dLerp);

    const idealPos = new THREE.Vector3()
      .copy(this.currentLookAt)
      .addScaledVector(dir, this.currentDistance);

    this.currentPosition.lerp(idealPos, lerpSpeed);

    // ── Dynamic FOV (Only update matrix when FOV changes) ────────────────────
    const isRunning = input
      ? (input.isRunning && (input.moveForward || input.moveBackward || input.moveLeft || input.moveRight))
      : false;
    const targetFov = isRunning ? 65 : 60;
    if (Math.abs(this.camera.fov - targetFov) > 0.05) {
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, Math.min(1.0, delta * 6.0));
      this.camera.updateProjectionMatrix();
    }

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

