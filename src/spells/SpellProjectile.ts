import * as THREE from 'three';

export type SpellType = 'FLIPENDO' | 'ALOHOMORA' | 'LUMOS';

export class SpellProjectile {
  public mesh: THREE.Group;
  public velocity: THREE.Vector3;
  public isDead = false;
  public spellType: SpellType;

  private lifetime = 4.0;
  private age = 0;
  private light: THREE.PointLight;
  private particles: THREE.Points;
  private particlePositions: Float32Array;

  constructor(position: THREE.Vector3, direction: THREE.Vector3, spellType: SpellType = 'FLIPENDO', speed: number = 35.0) {
    this.spellType = spellType;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    let mainColor = 0x3df3ff; // Flipendo Cyan
    let trailColor = 0x88f5ff;
    let radius = 0.14;

    if (spellType === 'ALOHOMORA') {
      mainColor = 0xffd700; // Gold
      trailColor = 0xffea88;
      radius = 0.16;
    } else if (spellType === 'LUMOS') {
      mainColor = 0xffffcc; // Lumos bright star
      trailColor = 0xffffff;
      radius = 0.2;
    }

    this.velocity = direction.clone().multiplyScalar(speed);

    // Core sphere
    const coreGeo = new THREE.SphereGeometry(radius, 12, 12);
    const coreMat = new THREE.MeshBasicMaterial({ color: mainColor });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.mesh.add(core);

    // Light
    this.light = new THREE.PointLight(mainColor, 3.5, 7.0);
    this.mesh.add(this.light);

    // Particle Trail
    const particleCount = 25;
    const trailGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * 0.12;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: trailColor,
      size: 0.1,
      transparent: true,
      opacity: 0.85
    });
    this.particles = new THREE.Points(trailGeo, trailMat);
    this.mesh.add(this.particles);
  }

  public update(delta: number): void {
    this.age += delta;
    if (this.age >= this.lifetime) {
      this.isDead = true;
      return;
    }

    // Move forward
    this.mesh.position.addScaledVector(this.velocity, delta);

    // Animate particle trail
    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 2] -= delta * 2.0; // Trail behind projectile
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
