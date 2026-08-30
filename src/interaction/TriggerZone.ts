import * as THREE from 'three';

export class TriggerZone {
  public boundingBox: THREE.Box3;
  public id: string;
  public isTriggered = false;
  public onTrigger: () => void;
  public debugMesh: THREE.Mesh | null = null;

  constructor(id: string, min: THREE.Vector3, max: THREE.Vector3, onTrigger: () => void) {
    this.id = id;
    this.boundingBox = new THREE.Box3(min, max);
    this.onTrigger = onTrigger;
  }

  public check(position: THREE.Vector3): boolean {
    if (this.isTriggered) return false;

    if (this.boundingBox.containsPoint(position)) {
      this.isTriggered = true;
      console.log(`[TriggerZone] Triggered zone '${this.id}'`);
      this.onTrigger();
      return true;
    }
    return false;
  }

  public createDebugMesh(scene: THREE.Scene): void {
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    this.boundingBox.getSize(size);
    this.boundingBox.getCenter(center);

    const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    this.debugMesh = new THREE.Mesh(geo, mat);
    this.debugMesh.position.copy(center);
    scene.add(this.debugMesh);
  }
}
