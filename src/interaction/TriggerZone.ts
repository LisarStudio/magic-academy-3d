import * as THREE from 'three';

export class TriggerZone {
  public boundingBox: THREE.Box3;
  public id: string;
  public isTriggered = false;
  public onTrigger: () => void;
  public debugMesh: THREE.Mesh | null = null;
  public repeatable = false;
  private wasInside = false;
  private cooldownTimer = 0;
  private static readonly COOLDOWN = 2.0; // seconds before re-triggering

  constructor(id: string, min: THREE.Vector3, max: THREE.Vector3, onTrigger: () => void, repeatable = false) {
    this.id = id;
    this.boundingBox = new THREE.Box3(min, max);
    this.onTrigger = onTrigger;
    this.repeatable = repeatable;
  }

  public check(position: THREE.Vector3, delta?: number): boolean {
    // Tick cooldown
    if (delta && this.cooldownTimer > 0) {
      this.cooldownTimer -= delta;
    }

    const inside = this.boundingBox.containsPoint(position);

    if (this.repeatable) {
      // For repeatable zones: trigger on fresh entry or after cooldown expires
      if (inside && !this.wasInside && this.cooldownTimer <= 0) {
        this.wasInside = true;
        this.cooldownTimer = TriggerZone.COOLDOWN;
        console.log(`[TriggerZone] Triggered repeatable zone '${this.id}'`);
        this.onTrigger();
        return true;
      }
      if (!inside && this.cooldownTimer <= 0) {
        this.wasInside = false;
      }
      return false;
    }

    // Non-repeatable: original one-shot behavior
    if (this.isTriggered) return false;

    if (inside) {
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
