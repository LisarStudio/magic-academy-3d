import * as THREE from 'three';

/** Lightweight, self-contained ambush serpent dropped by selected pine trees. */
export class TreeSnakeEnemy {
  readonly mesh = new THREE.Group();
  private readonly body: THREE.Mesh[] = [];
  private readonly head: THREE.Group;
  private health = 3;
  private hitCooldown = 0;
  private elapsed = 0;
  private alive = true;
  private heading = 0;
  private fallRemaining = 0;
  private knockbackRemaining = 0;
  private readonly knockbackVelocity = new THREE.Vector3();
  private flashRemaining = 0;
  private readonly landingY: number;
  private readonly scene: THREE.Scene;
  private readonly darkGreen = new THREE.MeshStandardMaterial({ color: 0x285947, roughness: 0.82, flatShading: true });
  private readonly belly = new THREE.MeshStandardMaterial({ color: 0xb5a95e, roughness: 0.9, flatShading: true });

  constructor(position: THREE.Vector3, scene: THREE.Scene) {
    this.scene = scene;
    this.mesh.name = 'tree_ambush_snake';
    this.landingY = position.y + 0.16;
    this.mesh.position.copy(position);
    const segmentGeo = new THREE.SphereGeometry(0.19, 8, 6);
    for (let i = 0; i < 8; i++) {
      const segment = new THREE.Mesh(segmentGeo, i % 2 ? this.darkGreen : this.belly);
      segment.scale.set(1.05, 0.68, 1.2);
      segment.castShadow = false;
      this.mesh.add(segment);
      this.body.push(segment);
    }
    this.head = new THREE.Group();
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.27, 10, 8), this.darkGreen);
    headMesh.scale.set(1.18, 0.84, 1.24);
    this.head.add(headMesh);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffc34d });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1a1110 });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 6), eyeMat);
      eye.position.set(side * 0.19, 0.105, 0.19);
      this.head.add(eye);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 4), pupilMat);
      pupil.position.set(side * 0.2, 0.1, 0.245);
      this.head.add(pupil);
    }
    const tongue = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.22, 5), new THREE.MeshBasicMaterial({ color: 0xff6257 }));
    tongue.rotation.x = Math.PI / 2;
    tongue.position.set(0, -0.06, 0.35);
    this.head.add(tongue);
    this.mesh.add(this.head);
    this.mesh.visible = false;
    this.scene.add(this.mesh);
  }

  isAlive(): boolean { return this.alive; }
  getPosition(): THREE.Vector3 { return this.mesh.position; }

  /** Begin the visible drop in sync with Wukong's surprise reaction. */
  startFall(): void {
    if (!this.alive || this.mesh.visible) return;
    this.mesh.position.y = this.landingY + 2.5;
    this.fallRemaining = 0.52;
    this.mesh.visible = true;
  }

  takeHit(damage: number, origin: THREE.Vector3, forward: THREE.Vector3): void {
    if (!this.alive || !this.mesh.visible) return;
    this.health -= damage;
    const away = this.mesh.position.clone().sub(origin);
    away.y = 0;
    if (away.lengthSq() < 0.001) away.copy(forward).setY(0);
    if (away.lengthSq() < 0.001) away.set(0, 0, 1);
    away.normalize();
    // A clear, crab-like launch reaction: horizontal knockback, a short hop,
    // and a brief stun before pursuit resumes.
    this.knockbackVelocity.set(away.x * 5.8, 4.1, away.z * 5.8);
    this.knockbackRemaining = 0.58;
    this.flashRemaining = 0.2;
    this.darkGreen.emissive.setHex(0x914515);
    this.darkGreen.emissiveIntensity = 0.6;
    this.belly.emissive.setHex(0x65400d);
    this.belly.emissiveIntensity = 0.35;
    if (this.health <= 0) this.alive = false;
  }

  update(delta: number, playerPosition: THREE.Vector3, getGroundY: (x: number, z: number) => number, damagePlayer: (amount: number) => void): void {
    if (!this.alive) return;
    const dt = Math.min(delta, 0.05);
    this.elapsed += dt;
    this.hitCooldown = Math.max(0, this.hitCooldown - dt);
    this.flashRemaining = Math.max(0, this.flashRemaining - dt);
    if (this.flashRemaining === 0) {
      this.darkGreen.emissive.setHex(0x000000);
      this.darkGreen.emissiveIntensity = 0;
      this.belly.emissive.setHex(0x000000);
      this.belly.emissiveIntensity = 0;
    }
    if (this.fallRemaining > 0) {
      this.fallRemaining = Math.max(0, this.fallRemaining - dt);
      const t = 1 - this.fallRemaining / 0.52;
      const eased = t * t * (3 - 2 * t);
      this.mesh.position.y = THREE.MathUtils.lerp(this.landingY + 2.5, this.landingY, eased);
      this.mesh.rotation.z = Math.sin(this.elapsed * 24) * (1 - eased) * 0.22;
      if (this.fallRemaining > 0) {
        for (let i = 0; i < this.body.length; i++) {
          const phase = this.elapsed * 10 - i * 0.68;
          this.body[i].position.set(Math.sin(phase) * 0.16, 0.12 + Math.abs(Math.sin(phase)) * 0.035, -(0.28 + i * 0.22));
        }
        this.head.position.set(0, 0.2 + Math.sin(this.elapsed * 11) * 0.04, 0.08);
        return;
      }
      this.mesh.rotation.z = 0;
    }
    const dx = playerPosition.x - this.mesh.position.x;
    const dz = playerPosition.z - this.mesh.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 0.001) {
      const target = Math.atan2(dx, dz);
      let turn = target - this.heading;
      while (turn > Math.PI) turn -= Math.PI * 2;
      while (turn < -Math.PI) turn += Math.PI * 2;
      this.heading += THREE.MathUtils.clamp(turn, -dt * 3.2, dt * 3.2);
    }
    if (this.knockbackRemaining > 0) {
      this.knockbackRemaining = Math.max(0, this.knockbackRemaining - dt);
      this.mesh.position.x += this.knockbackVelocity.x * dt;
      this.mesh.position.z += this.knockbackVelocity.z * dt;
      this.knockbackVelocity.y -= 11.5 * dt;
      this.mesh.position.y += this.knockbackVelocity.y * dt;
      const floorY = getGroundY(this.mesh.position.x, this.mesh.position.z) + 0.16;
      if (this.mesh.position.y <= floorY) {
        this.mesh.position.y = floorY;
        this.knockbackVelocity.y = Math.max(0, -this.knockbackVelocity.y * 0.12);
      }
      this.mesh.rotation.z = Math.sin((0.58 - this.knockbackRemaining) * 13) * 0.16;
    } else if (distance > 0.82) {
      const speed = distance < 3.5 ? 2.25 : 1.55;
      this.mesh.position.x += Math.sin(this.heading) * speed * dt;
      this.mesh.position.z += Math.cos(this.heading) * speed * dt;
    } else if (this.hitCooldown <= 0) {
      damagePlayer(7);
      this.hitCooldown = 1.25;
    }
    if (this.knockbackRemaining <= 0) {
      this.mesh.position.y = getGroundY(this.mesh.position.x, this.mesh.position.z) + 0.16;
      this.mesh.rotation.z *= Math.max(0, 1 - dt * 8);
    }
    this.mesh.rotation.y = this.heading;
    for (let i = 0; i < this.body.length; i++) {
      const phase = this.elapsed * 8 - i * 0.68;
      const back = 0.28 + i * 0.22;
      this.body[i].position.set(Math.sin(phase) * 0.16, Math.abs(Math.sin(phase)) * 0.035, -back);
      this.body[i].rotation.y = Math.sin(phase) * 0.38;
    }
    this.head.position.set(0, 0.04 + Math.sin(this.elapsed * 7) * 0.035, 0.08);
  }

  dispose(): void {
    this.scene.remove(this.mesh);
    const geometries = new Set<THREE.BufferGeometry>();
    this.mesh.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) geometries.add(mesh.geometry);
    });
    geometries.forEach((geometry) => geometry.dispose());
    this.darkGreen.dispose();
    this.belly.dispose();
    this.alive = false;
  }
}
