import * as THREE from 'three';

export class MovingPlatform {
  public mesh: THREE.Mesh;
  public velocity = new THREE.Vector3();

  private startPos: THREE.Vector3;
  private endPos: THREE.Vector3;
  private speed: number;
  private progress = 0;
  private direction = 1;

  constructor(start: THREE.Vector3, end: THREE.Vector3, speed = 2.0, width = 2.5, depth = 2.5) {
    this.startPos = start.clone();
    this.endPos = end.clone();
    this.speed = speed;

    const geo = new THREE.BoxGeometry(width, 0.4, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x5a5078,
      roughness: 0.5,
      metalness: 0.2
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.copy(start);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Glowing cyan runes on edges
    const runeGeo = new THREE.BoxGeometry(width * 0.9, 0.05, depth * 0.9);
    const runeMat = new THREE.MeshBasicMaterial({ color: 0x3df3ff });
    const rune = new THREE.Mesh(runeGeo, runeMat);
    rune.position.y = 0.21;
    this.mesh.add(rune);
  }

  public update(delta: number): void {
    const totalDist = this.startPos.distanceTo(this.endPos);
    if (totalDist < 0.01) return;

    this.progress += (this.speed * delta / totalDist) * this.direction;

    if (this.progress >= 1.0) {
      this.progress = 1.0;
      this.direction = -1;
    } else if (this.progress <= 0) {
      this.progress = 0;
      this.direction = 1;
    }

    const prevPos = this.mesh.position.clone();
    this.mesh.position.lerpVectors(this.startPos, this.endPos, this.progress);
    this.velocity.subVectors(this.mesh.position, prevPos);
  }
}
