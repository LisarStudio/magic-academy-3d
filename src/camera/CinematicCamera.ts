import * as THREE from 'three';

export class CinematicCamera {
  private camera: THREE.PerspectiveCamera;
  private isCinematicActive = false;

  private startPos = new THREE.Vector3();
  private targetPos = new THREE.Vector3();
  private startLookAt = new THREE.Vector3();
  private targetLookAt = new THREE.Vector3();

  private duration = 1.0;
  private elapsedTime = 0;
  private onCompleteCallback: (() => void) | null = null;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  public moveCamera(
    fromPos: THREE.Vector3,
    toPos: THREE.Vector3,
    fromLookAt: THREE.Vector3,
    toLookAt: THREE.Vector3,
    durationSeconds: number
  ): Promise<void> {
    // Abort any previous in-flight cinematic to prevent orphaned Promise leaks
    if (this.isCinematicActive && this.onCompleteCallback) {
      const prevCb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      prevCb();
    }

    return new Promise((resolve) => {
      this.isCinematicActive = true;
      this.startPos.copy(fromPos);
      this.targetPos.copy(toPos);
      this.startLookAt.copy(fromLookAt);
      this.targetLookAt.copy(toLookAt);

      this.duration = Math.max(0.1, durationSeconds);
      this.elapsedTime = 0;
      this.onCompleteCallback = resolve;
    });
  }

  private static readonly TEMP_POS = new THREE.Vector3();
  private static readonly TEMP_LOOKAT = new THREE.Vector3();

  public update(delta: number): void {
    if (!this.isCinematicActive) return;

    this.elapsedTime += delta;
    const progress = Math.min(1.0, this.elapsedTime / this.duration);
    
    // Smooth cubic ease-in-out curve
    const t = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    CinematicCamera.TEMP_POS.lerpVectors(this.startPos, this.targetPos, t);
    CinematicCamera.TEMP_LOOKAT.lerpVectors(this.startLookAt, this.targetLookAt, t);

    this.camera.position.copy(CinematicCamera.TEMP_POS);
    this.camera.lookAt(CinematicCamera.TEMP_LOOKAT);

    if (progress >= 1.0) {
      this.isCinematicActive = false;
      if (this.onCompleteCallback) {
        const cb = this.onCompleteCallback;
        this.onCompleteCallback = null;
        cb();
      }
    }
  }

  public abort(): void {
    this.isCinematicActive = false;
    if (this.onCompleteCallback) {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb();
    }
  }

  public isActive(): boolean {
    return this.isCinematicActive;
  }

  public stop(): void {
    this.isCinematicActive = false;
    this.onCompleteCallback = null;
  }
}
