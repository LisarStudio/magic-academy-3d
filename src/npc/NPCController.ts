import * as THREE from 'three';

export class NPCController {
  public mesh: THREE.Group;
  public id: string;
  public name: string;

  private waypoints: THREE.Vector3[] = [];
  private currentWaypointIndex = 0;
  private moveSpeed = 2.0;

  constructor(id: string, name: string, startPos: THREE.Vector3, isProfessor = false) {
    this.id = id;
    this.name = name;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(startPos);

    if (isProfessor) {
      this.createProfessorMesh();
    } else {
      this.createStudentMesh();
    }
  }

  private createProfessorMesh(): void {
    // Professor with majestic crimson/gold wizard robe & long white beard
    const robeMat = new THREE.MeshStandardMaterial({ color: 0x801828, roughness: 0.5 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xf3c644, metalness: 0.8 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd3b6 });
    const beardMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.9 });

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.5, 1.4, 12);
    const body = new THREE.Mesh(bodyGeo, robeMat);
    body.position.y = 0.7;
    body.castShadow = true;
    this.mesh.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.25, 12, 12);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.55;
    this.mesh.add(head);

    // Beard
    const beardGeo = new THREE.ConeGeometry(0.2, 0.6, 8);
    const beard = new THREE.Mesh(beardGeo, beardMat);
    beard.position.set(0, 1.35, 0.2);
    beard.rotation.x = Math.PI / 6;
    this.mesh.add(beard);

    // Tall Arch-Mage Hat
    const hatGeo = new THREE.ConeGeometry(0.4, 0.9, 16);
    const hat = new THREE.Mesh(hatGeo, robeMat);
    hat.position.y = 2.1;
    hat.castShadow = true;
    this.mesh.add(hat);

    // Hat gold trim
    const bandGeo = new THREE.CylinderGeometry(0.38, 0.39, 0.08, 16);
    const band = new THREE.Mesh(bandGeo, trimMat);
    band.position.y = 1.75;
    this.mesh.add(band);
  }

  private createStudentMesh(): void {
    // Student NPC with teal robe
    const robeMat = new THREE.MeshStandardMaterial({ color: 0x1b4958, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd3b6 });

    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.38, 1.1, 10);
    const body = new THREE.Mesh(bodyGeo, robeMat);
    body.position.y = 0.55;
    body.castShadow = true;
    this.mesh.add(body);

    const headGeo = new THREE.SphereGeometry(0.22, 10, 10);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.25;
    this.mesh.add(head);
  }

  public setWaypoints(waypoints: THREE.Vector3[]): void {
    this.waypoints = waypoints;
    this.currentWaypointIndex = 0;
  }

  public update(delta: number): void {
    if (this.waypoints.length === 0) return;

    const target = this.waypoints[this.currentWaypointIndex];
    const dist = this.mesh.position.distanceTo(target);

    if (dist < 0.3) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.waypoints.length;
    } else {
      const dir = new THREE.Vector3().subVectors(target, this.mesh.position).normalize();
      this.mesh.position.addScaledVector(dir, this.moveSpeed * delta);
      this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
    }
  }

  public moveTowards(target: THREE.Vector3, delta: number, speed = 2.0): boolean {
    const dist = this.mesh.position.distanceTo(target);
    if (dist < 0.2) return true;

    const dir = new THREE.Vector3().subVectors(target, this.mesh.position).normalize();
    this.mesh.position.addScaledVector(dir, speed * delta);
    this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
    return false;
  }

  public lookAt(point: THREE.Vector3): void {
    const dir = new THREE.Vector3().subVectors(point, this.mesh.position);
    this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
  }
}
