import * as THREE from 'three';

type FirePhase = 'safe' | 'warning' | 'flight';

/** A readable, repeating fire-crossing hazard for the hidden volcanic route. */
export class VolcanicDragonRun {
  private readonly scene: THREE.Scene;
  private readonly onHit: (damage: number) => void;
  private readonly axis: THREE.Vector3;
  private readonly across: THREE.Vector3;
  private readonly routeStart: THREE.Vector3;
  private readonly routeEnd: THREE.Vector3;
  private readonly warningBeam: THREE.Mesh;
  private readonly fireball: THREE.Mesh;
  private readonly emitters: Array<{ position: THREE.Vector3; direction: number }> = [];
  private phase: FirePhase = 'safe';
  private phaseTime = 1.2;
  private emitterIndex = 0;
  private volleyCount = 0;
  private hitCooldown = 0;
  private from = new THREE.Vector3();
  private to = new THREE.Vector3();
  private active = true;

  constructor(
    scene: THREE.Scene,
    start: THREE.Vector3,
    end: THREE.Vector3,
    terrainHeight: (x: number, z: number) => number,
    colliders: THREE.Object3D[],
    onHit: (damage: number) => void
  ) {
    this.scene = scene;
    this.onHit = onHit;
    this.routeStart = start.clone();
    this.routeEnd = end.clone();
    this.axis = end.clone().sub(start).setY(0).normalize();
    this.across = new THREE.Vector3(-this.axis.z, 0, this.axis.x).normalize();
    const stone = new THREE.MeshStandardMaterial({ color: 0x55515a, roughness: 0.88, metalness: 0.05 });
    const horn = new THREE.MeshStandardMaterial({ color: 0x9e7445, roughness: 0.72 });
    const eye = new THREE.MeshStandardMaterial({ color: 0xff8b24, emissive: 0xff4c08, emissiveIntensity: 2.6, roughness: 0.25 });
    const jaw = new THREE.MeshStandardMaterial({ color: 0x312c33, roughness: 0.78 });
    const plinthGeo = new THREE.CylinderGeometry(0.72, 0.9, 0.42, 8);
    const skullGeo = new THREE.SphereGeometry(0.47, 12, 10);
    const snoutGeo = new THREE.SphereGeometry(0.34, 10, 8);
    const hornGeo = new THREE.ConeGeometry(0.14, 0.58, 7);
    const eyeGeo = new THREE.SphereGeometry(0.09, 8, 6);
    const addDragon = (along: number, side: number) => {
      const center = start.clone().lerp(end, along);
      const position = center.addScaledVector(this.across, side * 2.7);
      const ground = terrainHeight(position.x, position.z);
      position.y = ground;
      const statue = new THREE.Group();
      statue.name = `volcanic_chinese_dragon_statue_${this.emitters.length}`;
      statue.position.copy(position);
      statue.rotation.y = Math.atan2(-side * this.across.x, -side * this.across.z);

      const plinth = new THREE.Mesh(plinthGeo, stone);
      plinth.position.y = -position.y + ground + 0.22;
      plinth.castShadow = plinth.receiveShadow = true;
      statue.add(plinth);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.74, 9), stone);
      body.position.y = 0.68;
      body.castShadow = true;
      statue.add(body);
      const head = new THREE.Mesh(skullGeo, stone);
      head.position.set(0, 1.12, 0.02);
      head.castShadow = true;
      statue.add(head);
      const muzzle = new THREE.Mesh(snoutGeo, stone);
      muzzle.scale.set(0.84, 0.72, 1.55);
      muzzle.position.set(0, 0.99, 0.49);
      statue.add(muzzle);
      const lowerJaw = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.16, 0.62), jaw);
      lowerJaw.position.set(0, 0.78, 0.58);
      statue.add(lowerJaw);
      for (const sideEye of [-1, 1]) {
        const hornMesh = new THREE.Mesh(hornGeo, horn);
        hornMesh.position.set(sideEye * 0.3, 1.55, -0.08);
        hornMesh.rotation.z = sideEye * -0.38;
        hornMesh.rotation.x = -0.2;
        statue.add(hornMesh);
        const eyeMesh = new THREE.Mesh(eyeGeo, eye);
        eyeMesh.position.set(sideEye * 0.29, 1.22, 0.38);
        statue.add(eyeMesh);
        const whisker = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.06, 0.75, 6), horn);
        whisker.position.set(sideEye * 0.48, 0.91, 0.66);
        whisker.rotation.z = sideEye * 0.62;
        whisker.rotation.x = -0.65;
        statue.add(whisker);
      }
      const crest = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.62, 7), horn);
      crest.position.set(0, 1.58, -0.28);
      crest.rotation.x = -0.35;
      statue.add(crest);
      const statueCollider = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.7, 1.9, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      statueCollider.name = 'volcanic_dragon_statue_collision';
      statueCollider.position.y = 1.02;
      statue.add(statueCollider);
      this.scene.add(statue);
      colliders.push(plinth, statueCollider);
      const facing = this.across.clone().multiplyScalar(-side);
      this.emitters.push({ position: position.clone().addScaledVector(facing, 0.82).add(new THREE.Vector3(0, 1.02, 0)), direction: side });
    };

    addDragon(0.27, -1);
    addDragon(0.27, 1);
    addDragon(0.69, -1);
    addDragon(0.69, 1);

    const warningMaterial = new THREE.MeshBasicMaterial({ color: 0xffa321, transparent: true, opacity: 0.65, depthWrite: false });
    this.warningBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1, 6), warningMaterial);
    this.warningBeam.name = 'volcanic_fire_warning_beam';
    this.warningBeam.visible = false;
    this.scene.add(this.warningBeam);
    this.fireball = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 12, 10),
      new THREE.MeshBasicMaterial({ color: 0xff6b16, toneMapped: false })
    );
    this.fireball.name = 'volcanic_dragon_fireball';
    this.fireball.visible = false;
    this.scene.add(this.fireball);
    this.fireball.userData.terrainHeight = terrainHeight;
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    if (!this.active) return;
    this.hitCooldown = Math.max(0, this.hitCooldown - delta);
    const midpoint = this.routeStart.clone().add(this.routeEnd).multiplyScalar(0.5);
    if (playerPos.distanceTo(midpoint) > 34) {
      this.phase = 'safe';
      this.phaseTime = 1.2;
      this.warningBeam.visible = this.fireball.visible = false;
      return;
    }

    this.phaseTime -= delta;
    if (this.phase === 'safe' && this.phaseTime <= 0) this.beginWarning();
    else if (this.phase === 'warning' && this.phaseTime <= 0) this.beginFlight();
    else if (this.phase === 'flight') this.updateFlight(delta, playerPos);
  }

  public dispose(): void {
    this.active = false;
    this.scene.remove(this.warningBeam, this.fireball);
    this.warningBeam.geometry.dispose();
    this.fireball.geometry.dispose();
    (this.warningBeam.material as THREE.Material).dispose();
    (this.fireball.material as THREE.Material).dispose();
  }

  private beginWarning(): void {
    const emitter = this.emitters[this.emitterIndex % this.emitters.length];
    const along = this.emitterIndex % 4 < 2 ? 0.27 : 0.69;
    const center = this.routeStart.clone().lerp(this.routeEnd, along);
    const terrainHeight = this.fireball.userData.terrainHeight as (x: number, z: number) => number;
    const ground = terrainHeight(center.x, center.z);
    const side = -emitter.direction;
    this.from.copy(emitter.position);
    this.from.y = ground + 1.16;
    this.to.copy(center).addScaledVector(this.across, side * 2.7);
    this.to.y = ground + 1.16;
    const beamMid = this.from.clone().add(this.to).multiplyScalar(0.5);
    const beamVector = this.to.clone().sub(this.from);
    this.warningBeam.position.copy(beamMid);
    this.warningBeam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamVector.clone().normalize());
    this.warningBeam.scale.set(1, beamVector.length(), 1);
    this.warningBeam.visible = true;
    this.fireball.visible = false;
    this.phase = 'warning';
    this.phaseTime = 0.9;
  }

  private beginFlight(): void {
    this.fireball.position.copy(this.from);
    this.fireball.visible = true;
    this.phase = 'flight';
    this.phaseTime = 0;
  }

  private updateFlight(delta: number, playerPos: THREE.Vector3): void {
    this.phaseTime += delta;
    const progress = THREE.MathUtils.clamp(this.phaseTime / 0.85, 0, 1);
    this.fireball.position.lerpVectors(this.from, this.to, progress);
    const dx = playerPos.x - this.fireball.position.x;
    const dz = playerPos.z - this.fireball.position.z;
    const dy = playerPos.y + 0.9 - this.fireball.position.y;
    if (this.hitCooldown <= 0 && dx * dx + dy * dy + dz * dz < 0.85 * 0.85) {
      this.hitCooldown = 1.25;
      this.onHit(16);
    }
    if (progress >= 1) {
      this.fireball.visible = false;
      this.warningBeam.visible = false;
      this.phase = 'safe';
      this.volleyCount++;
      this.emitterIndex++;
      // The cadence tightens slightly after the player has seen the first two
      // pairs, while leaving a clear recovery window after each crossing.
      this.phaseTime = Math.max(0.85, 1.35 - Math.floor(this.volleyCount / 4) * 0.12);
    }
  }
}
