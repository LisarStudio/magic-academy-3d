import * as THREE from 'three';

export class AttackAuraEffect {
  public mesh: THREE.Group;
  private auraTube: THREE.Mesh;
  private auraTubeMat: THREE.MeshBasicMaterial;
  private auraSparks: THREE.Points;
  private sparkPositions: Float32Array;
  private sparkCount = 14;

  private state: 'OFF' | 'FADE_IN' | 'ACTIVE' | 'FADE_OUT' = 'OFF';
  private timer = 0;
  private currentOpacity = 0;

  private readonly FADE_IN_DURATION = 0.10;
  private readonly ACTIVE_DURATION = 0.35;
  private readonly FADE_OUT_DURATION = 0.20;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'staff_attack_aura';
    this.mesh.visible = false;

    // 1. Sleek Radiant Martial Energy Sheath along the Staff (1.20m length)
    const tubeGeo = new THREE.CylinderGeometry(0.032, 0.032, 1.22, 12, 1, true);
    this.auraTubeMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    this.auraTube = new THREE.Mesh(tubeGeo, this.auraTubeMat);
    this.mesh.add(this.auraTube);

    // 2. Trailing Spark Particles along the Staff Shaft
    const sparkGeo = new THREE.BufferGeometry();
    this.sparkPositions = new Float32Array(this.sparkCount * 3);
    for (let i = 0; i < this.sparkCount; i++) {
      const y = ((i / (this.sparkCount - 1)) - 0.5) * 1.15;
      this.sparkPositions[i * 3] = (Math.random() - 0.5) * 0.06;
      this.sparkPositions[i * 3 + 1] = y;
      this.sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(this.sparkPositions, 3));

    const sparkMat = new THREE.PointsMaterial({
      color: 0xfff099,
      size: 0.08,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.auraSparks = new THREE.Points(sparkGeo, sparkMat);
    this.mesh.add(this.auraSparks);
  }

  public trigger(): void {
    this.state = 'FADE_IN';
    this.timer = 0;
    this.currentOpacity = 0.0;
    this.mesh.visible = true;
  }

  public stop(): void {
    this.state = 'OFF';
    this.timer = 0;
    this.currentOpacity = 0.0;
    this.mesh.visible = false;
    this.auraTubeMat.opacity = 0.0;
    (this.auraSparks.material as THREE.PointsMaterial).opacity = 0.0;
  }

  public update(delta: number): void {
    if (this.state === 'OFF') return;

    this.timer += delta;

    if (this.state === 'FADE_IN') {
      const progress = Math.min(1.0, this.timer / this.FADE_IN_DURATION);
      this.currentOpacity = progress * 0.60;
      if (progress >= 1.0) {
        this.state = 'ACTIVE';
        this.timer = 0;
      }
    } else if (this.state === 'ACTIVE') {
      this.currentOpacity = 0.60 + Math.sin(this.timer * 20.0) * 0.08;
      if (this.timer >= this.ACTIVE_DURATION) {
        this.state = 'FADE_OUT';
        this.timer = 0;
      }
    } else if (this.state === 'FADE_OUT') {
      const progress = Math.min(1.0, this.timer / this.FADE_OUT_DURATION);
      this.currentOpacity = (1.0 - progress) * 0.60;
      if (progress >= 1.0) {
        this.stop();
        return;
      }
    }

    // Apply smooth opacity to tube and sparks
    this.auraTubeMat.opacity = this.currentOpacity;
    (this.auraSparks.material as THREE.PointsMaterial).opacity = this.currentOpacity * 1.4;

    // Gentle shimmer along the staff shaft
    const pArr = this.sparkPositions;
    for (let i = 0; i < this.sparkCount; i++) {
      const y = ((i / (this.sparkCount - 1)) - 0.5) * 1.15;
      const angle = this.timer * 12.0 + i;
      pArr[i * 3] = Math.cos(angle) * 0.035;
      pArr[i * 3 + 1] = y + Math.sin(this.timer * 8.0 + i) * 0.02;
      pArr[i * 3 + 2] = Math.sin(angle) * 0.035;
    }
    this.auraSparks.geometry.attributes.position.needsUpdate = true;
  }
}
