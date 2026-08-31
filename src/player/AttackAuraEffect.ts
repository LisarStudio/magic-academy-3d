import * as THREE from 'three';

export class AttackAuraEffect {
  public mesh: THREE.Group;
  private glowRing: THREE.Mesh;
  private glowRingMat: THREE.MeshBasicMaterial;
  private auraParticles: THREE.Points;
  private particlePositions: Float32Array;
  private particleCount = 16;

  private state: 'OFF' | 'FADE_IN' | 'ACTIVE' | 'FADE_OUT' = 'OFF';
  private timer = 0;
  private currentOpacity = 0;

  private readonly FADE_IN_DURATION = 0.15;
  private readonly ACTIVE_DURATION = 0.35;
  private readonly FADE_OUT_DURATION = 0.25;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'wukong_attack_aura';
    this.mesh.visible = false;

    // 1. Subtle Golden/Celestial Concentric Swirl Rings around Wukong
    const ringGeo = new THREE.TorusGeometry(0.55, 0.03, 8, 24);
    this.glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.glowRing = new THREE.Mesh(ringGeo, this.glowRingMat);
    this.glowRing.rotation.x = Math.PI / 2;
    this.glowRing.position.y = 0.65;
    this.mesh.add(this.glowRing);

    // 2. Swirling Lightweight Spark Particles
    const pGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      const angle = (i / this.particleCount) * Math.PI * 2;
      const rad = 0.35 + Math.random() * 0.35;
      this.particlePositions[i * 3] = Math.cos(angle) * rad;
      this.particlePositions[i * 3 + 1] = 0.3 + Math.random() * 0.8;
      this.particlePositions[i * 3 + 2] = Math.sin(angle) * rad;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xffea00,
      size: 0.10,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.auraParticles = new THREE.Points(pGeo, pMat);
    this.mesh.add(this.auraParticles);
  }

  public trigger(): void {
    this.state = 'FADE_IN';
    this.timer = 0;
    this.currentOpacity = 0.0;
    this.mesh.visible = true;
  }

  public stop(): void {
    if (this.state !== 'OFF' && this.state !== 'FADE_OUT') {
      this.state = 'FADE_OUT';
      this.timer = 0;
    }
  }

  public update(delta: number): void {
    if (this.state === 'OFF') return;

    this.timer += delta;

    if (this.state === 'FADE_IN') {
      const progress = Math.min(1.0, this.timer / this.FADE_IN_DURATION);
      this.currentOpacity = progress * 0.45;
      if (progress >= 1.0) {
        this.state = 'ACTIVE';
        this.timer = 0;
      }
    } else if (this.state === 'ACTIVE') {
      this.currentOpacity = 0.45 + Math.sin(this.timer * 15.0) * 0.08;
      if (this.timer >= this.ACTIVE_DURATION) {
        this.state = 'FADE_OUT';
        this.timer = 0;
      }
    } else if (this.state === 'FADE_OUT') {
      const progress = Math.min(1.0, this.timer / this.FADE_OUT_DURATION);
      this.currentOpacity = (1.0 - progress) * 0.45;
      if (progress >= 1.0) {
        this.state = 'OFF';
        this.currentOpacity = 0.0;
        this.mesh.visible = false;
      }
    }

    // Apply smooth opacity
    this.glowRingMat.opacity = this.currentOpacity;
    (this.auraParticles.material as THREE.PointsMaterial).opacity = this.currentOpacity * 1.5;

    // Rotate ring and swirl particles
    this.glowRing.rotation.z += delta * 4.0;
    this.glowRing.position.y = 0.65 + Math.sin(this.timer * 8.0) * 0.05;

    const pArr = this.particlePositions;
    for (let i = 0; i < this.particleCount; i++) {
      const speed = 3.5 + (i % 3) * 0.5;
      const angle = this.timer * speed + (i / this.particleCount) * Math.PI * 2;
      const rad = 0.35 + ((i * 3) % 5) * 0.06;
      pArr[i * 3] = Math.cos(angle) * rad;
      pArr[i * 3 + 1] += delta * 0.4;
      if (pArr[i * 3 + 1] > 1.2) pArr[i * 3 + 1] = 0.25;
      pArr[i * 3 + 2] = Math.sin(angle) * rad;
    }
    this.auraParticles.geometry.attributes.position.needsUpdate = true;
  }
}
