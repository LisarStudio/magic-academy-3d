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

  /** Gameplay-only vertical limits, in radians. Positive pitch raises the camera. */
  public minPitch = -0.22;
  public maxPitch = 0.62;

  private currentPosition = new THREE.Vector3();
  private currentLookAt   = new THREE.Vector3();
  private currentDistance = 5.5;
  private overviewRemaining = 0;
  private readonly overviewDuration = 4.2;
  private scriptedPan: { fromYaw: number; toYaw: number; fromPitch: number; toPitch: number; elapsed: number; duration: number } | null = null;

  // Auto-recenter
  private idleTimer = 0;
  private readonly RECENTER_DELAY = 0.8;
  private readonly TOUCH_RECENTER_DELAY = 2.2;
  private readonly touchFirstInput = (navigator.maxTouchPoints ?? 0) > 0 &&
    (window.matchMedia?.('(pointer: coarse)').matches ?? false) &&
    !(window.matchMedia?.('(pointer: fine)').matches ?? false);
  private isManual = false;

  // Camera collision
  private readonly collisionRaycaster = new THREE.Raycaster();
  private readonly collisionObjects: THREE.Mesh[] = [];
  private readonly collisionBounds: THREE.Sphere[] = [];
  private readonly nearbyCollisionObjects: THREE.Mesh[] = [];
  private readonly cameraCollisionMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  private static readonly CAMERA_CLEARANCE = 0.24;
  private static readonly CAMERA_COLLISION_PADDING = 0.08;
  private static readonly MIN_CAMERA_DISTANCE = 0.025;
  private static readonly TERRAIN_CLEARANCE = 0.22;
  private static readonly TERRAIN_SAMPLE_STEP = 0.24;
  private terrainHeightAt: ((x: number, z: number) => number) | null = null;
  private readonly defaultNearPlane: number;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.defaultNearPlane = camera.near;
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
    this.overviewRemaining = showTempleOverview ? this.overviewDuration : 0;
    const overviewFov = window.innerWidth < window.innerHeight ? 70 : 64;
    if (showTempleOverview && Math.abs(this.camera.fov - overviewFov) > 0.05) {
      this.camera.fov = overviewFov;
      this.camera.updateProjectionMatrix();
    }
    this.currentLookAt.copy(this.target.position).add(new THREE.Vector3(0, this.heightOffset, 0));
    
    const dir = CameraController.TEMP_DIR.set(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );
    const safeDistance = this.collisionObjects.length || this.terrainHeightAt
      ? this.getSafeBoomDistance(
        this.currentLookAt,
        dir,
        this.distance,
        CameraController.TEMP_RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)),
      )
      : this.distance;
    this.currentDistance = safeDistance;
    this.currentPosition.copy(this.currentLookAt).addScaledVector(dir, safeDistance);
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
    CameraController.TEMP_DIR.set(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    );
    this.currentDistance = this.collisionObjects.length || this.terrainHeightAt
      ? this.getSafeBoomDistance(
        this.currentLookAt,
        CameraController.TEMP_DIR,
        distance,
        CameraController.TEMP_RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)),
      )
      : distance;
    this.currentPosition.copy(this.currentLookAt).addScaledVector(CameraController.TEMP_DIR, this.currentDistance);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
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
    // Level collision entries often wrap their solids in Groups (temple wall
    // proxies, pavilions and the bridge). Flatten once at registration time.
    this.collisionObjects.length = 0;
    this.collisionBounds.length = 0;
    const seen = new Set<THREE.Mesh>();
    for (const object of objects) {
      object.updateWorldMatrix(true, true);
      object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry || seen.has(mesh)) return;
        seen.add(mesh);
        if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
        const proxy = new THREE.Mesh(mesh.geometry, this.cameraCollisionMaterial);
        proxy.name = `camera_collision:${mesh.name || mesh.uuid}`;
        proxy.matrixAutoUpdate = false;
        proxy.matrixWorldAutoUpdate = false;
        proxy.frustumCulled = false;
        proxy.matrixWorld.copy(mesh.matrixWorld);
        this.collisionObjects.push(proxy);
        const sphere = mesh.geometry.boundingSphere!.clone();
        sphere.center.applyMatrix4(mesh.matrixWorld);
        sphere.radius *= mesh.matrixWorld.getMaxScaleOnAxis();
        this.collisionBounds.push(sphere);
      });
    }
  }

  /** Supplies the level's procedural ground height without raycasting its full terrain mesh. */
  public setTerrainHeightProvider(provider: ((x: number, z: number) => number) | null): void {
    this.terrainHeightAt = provider;
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
        this.pitch = THREE.MathUtils.clamp(
          THREE.MathUtils.lerp(pan.fromPitch, pan.toPitch, eased),
          this.minPitch,
          this.maxPitch,
        );
        if (pan.elapsed >= pan.duration) this.scriptedPan = null;
      }
    }

    // ── 2. Passive recenter ──────────────────────────────────────────
    const isMoving = input.moveForward || input.moveBackward || input.moveLeft || input.moveRight;
    // Touch camera drags can leave the player facing away from the view. On
    // touch-first devices, recenter after a short pause even while stationary;
    // requiring movement (the old behavior) left the camera stuck indefinitely.
    // Desktop keeps its familiar behavior: follow behind only while moving.
    const shouldTouchRecenter = this.touchFirstInput &&
      !this.scriptedPan && this.overviewRemaining <= 0 &&
      this.idleTimer > this.TOUCH_RECENTER_DELAY;
    const shouldDesktopRecenter = !this.touchFirstInput &&
      this.idleTimer > this.RECENTER_DELAY && isMoving;
    if (!this.isManual && (shouldTouchRecenter || shouldDesktopRecenter)) {
      const targetYaw = this.target.rotation.y + Math.PI;
      let diff = targetYaw - this.yaw;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff >  Math.PI) diff -= Math.PI * 2;

      // Exponential damping keeps the recovery smooth and frame-rate
      // independent instead of snapping after a missed touch gesture.
      const alignBlend = 1 - Math.exp(-2.2 * delta);
      this.yaw += diff * alignBlend;
      if (shouldTouchRecenter) {
        this.pitch = THREE.MathUtils.damp(this.pitch, 0.25, 1.8, delta);
      }
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
  private static readonly TEMP_UP = new THREE.Vector3();
  private static readonly TEMP_RAY_ORIGIN = new THREE.Vector3();
  private static readonly TEMP_SEGMENT_CENTER = new THREE.Vector3();
  private static readonly TEMP_FINAL_OFFSET = new THREE.Vector3();
  private static readonly CAMERA_RAY_OFFSETS = Array.from({ length: 5 }, () => new THREE.Vector3());

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
    if (this.collisionObjects.length > 0 || this.terrainHeightAt) {
      targetDist = this.getSafeBoomDistance(
        this.currentLookAt,
        CameraController.TEMP_DIR,
        this.distance,
        CameraController.TEMP_RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)),
      );
    }

    const pushIn = targetDist < this.currentDistance;
    if (pushIn) {
      // Resolve obstruction immediately; smoothing inward can leave the camera
      // on the far side of a wall for several frames.
      this.currentDistance = targetDist;
    } else {
      this.currentDistance = THREE.MathUtils.damp(this.currentDistance, targetDist, 8.0, delta);
    }

    CameraController.TEMP_IDEAL.copy(this.currentLookAt).addScaledVector(CameraController.TEMP_DIR, this.currentDistance);
    if (pushIn) this.currentPosition.copy(CameraController.TEMP_IDEAL);
    else this.currentPosition.lerp(CameraController.TEMP_IDEAL, lerpSpeed);

    // Position smoothing can arc through a corner while yaw changes. Validate
    // the interpolated camera point too, not only the ideal boom endpoint.
    const finalOffset = CameraController.TEMP_FINAL_OFFSET.subVectors(this.currentPosition, this.currentLookAt);
    const finalDistance = finalOffset.length();
    if (finalDistance > 0.001 && (this.collisionObjects.length > 0 || this.terrainHeightAt)) {
      finalOffset.multiplyScalar(1 / finalDistance);
      const safeDistance = this.getSafeBoomDistance(
        this.currentLookAt,
        finalOffset,
        finalDistance,
        CameraController.TEMP_RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)),
      );
      if (safeDistance < finalDistance) {
        this.currentPosition.copy(this.currentLookAt).addScaledVector(finalOffset, safeDistance);
      }
    }

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
    this.updateNearPlane(this.currentPosition.distanceTo(this.currentLookAt));
  }

  public getForwardVector(): THREE.Vector3 {
    return CameraController.TEMP_FORWARD.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
  }

  public getRightVector(): THREE.Vector3 {
    return CameraController.TEMP_RIGHT.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
  }

  /** Five parallel rays approximate a small swept camera sphere along the boom. */
  private getSafeBoomDistance(origin: THREE.Vector3, direction: THREE.Vector3, desiredDistance: number, right: THREE.Vector3): number {
    const up = CameraController.TEMP_UP.crossVectors(direction, right).normalize();
    const radius = CameraController.CAMERA_CLEARANCE;
    const offsets = CameraController.CAMERA_RAY_OFFSETS;
    offsets[0].set(0, 0, 0);
    offsets[1].copy(right).multiplyScalar(radius);
    offsets[2].copy(right).multiplyScalar(-radius);
    offsets[3].copy(up).multiplyScalar(radius);
    offsets[4].copy(up).multiplyScalar(-radius);

    this.collectNearbyCollisionObjects(origin, direction, desiredDistance, radius);
    let safeDistance = desiredDistance;
    if (this.nearbyCollisionObjects.length) {
      this.collisionRaycaster.near = 0;
      this.collisionRaycaster.far = desiredDistance;
      for (const offset of offsets) {
        CameraController.TEMP_RAY_ORIGIN.copy(origin).add(offset);
        this.collisionRaycaster.set(CameraController.TEMP_RAY_ORIGIN, direction);
        const hits = this.collisionRaycaster.intersectObjects(this.nearbyCollisionObjects, false);
        if (hits.length) safeDistance = Math.min(safeDistance, hits[0].distance - CameraController.CAMERA_COLLISION_PADDING);
      }
    }

    // The world ground is generated from a height function rather than entered
    // in levelColliders. Sample only a downward boom, avoiding a per-frame
    // raycast against the entire terrain mesh and leaving underground rooms valid.
    if (this.terrainHeightAt && direction.y < -0.001) {
      const groundAtTarget = this.terrainHeightAt(origin.x, origin.z);
      const targetIsAboveGround = origin.y >= groundAtTarget + 0.75;
      if (targetIsAboveGround) {
        const sampleEnd = Math.min(desiredDistance, safeDistance);
        const sampleCount = Math.ceil(sampleEnd / CameraController.TERRAIN_SAMPLE_STEP);
        for (let i = 1; i <= sampleCount; i++) {
          const distance = Math.min(sampleEnd, i * CameraController.TERRAIN_SAMPLE_STEP);
          const sampleX = origin.x + direction.x * distance;
          const sampleZ = origin.z + direction.z * distance;
          const sampleY = origin.y + direction.y * distance;
          const groundY = this.terrainHeightAt(sampleX, sampleZ);
          if (sampleY < groundY + CameraController.TERRAIN_CLEARANCE) {
            safeDistance = Math.min(safeDistance, distance - CameraController.CAMERA_COLLISION_PADDING);
            break;
          }
        }
      }
    }
    return safeDistance < desiredDistance
      ? Math.max(CameraController.MIN_CAMERA_DISTANCE, safeDistance)
      : desiredDistance;
  }

  /** Keep the near plane ahead of very close collision-corrected camera positions. */
  private updateNearPlane(distance: number): void {
    const near = Math.min(this.defaultNearPlane, Math.max(0.01, distance * 0.45));
    if (Math.abs(this.camera.near - near) < 0.001) return;
    this.camera.near = near;
    this.camera.updateProjectionMatrix();
  }

  private collectNearbyCollisionObjects(origin: THREE.Vector3, direction: THREE.Vector3, distance: number, radius: number): void {
    const midpoint = CameraController.TEMP_SEGMENT_CENTER.copy(origin).addScaledVector(direction, distance * 0.5);
    const broadRadius = distance * 0.5 + radius;
    this.nearbyCollisionObjects.length = 0;
    for (let i = 0; i < this.collisionObjects.length; i++) {
      const bounds = this.collisionBounds[i];
      if (bounds.distanceToPoint(midpoint) > broadRadius + bounds.radius) continue;
      const proxy = this.collisionObjects[i];
      this.nearbyCollisionObjects.push(proxy);
    }
  }
}

