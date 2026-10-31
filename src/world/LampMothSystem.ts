import * as THREE from 'three';

interface MothAgent {
  anchor: THREE.Vector3;
  phase: number;
  speed: number;
  radius: number;
  height: number;
}

/** Small instanced moths orbit selected lanterns without per-frame allocations. */
export class LampMothSystem {
  private readonly agents: MothAgent[] = [];
  private readonly bodyMesh: THREE.InstancedMesh;
  private readonly wingMesh: THREE.InstancedMesh;
  private readonly glowMesh: THREE.InstancedMesh;
  private readonly helper = new THREE.Object3D();
  private elapsed = 0;
  private lastUpdate = 0;
  private readonly interval = 1 / 30;

  constructor(scene: THREE.Scene, anchors: THREE.Vector3[], mobile: boolean) {
    const perAnchor = mobile ? 12 : 18;
    const count = anchors.length * perAnchor;
    const bodyGeometry = new THREE.SphereGeometry(0.065, 8, 6);
    // Two small flattened wings read as fluttering insects, not as a large
    // translucent oval around the lantern.
    const wingGeometry = new THREE.SphereGeometry(0.052, 8, 5);
    const glowGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const bodyMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffdc,
      toneMapped: false,
    });
    const wingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffedaa,
      transparent: true,
      opacity: 0.94,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcf51,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });

    this.bodyMesh = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, count);
    this.wingMesh = new THREE.InstancedMesh(wingGeometry, wingMaterial, count * 2);
    this.glowMesh = new THREE.InstancedMesh(glowGeometry, glowMaterial, count);
    this.bodyMesh.name = 'lantern_moth_bodies';
    this.wingMesh.name = 'lantern_moth_wings';
    this.glowMesh.name = 'lantern_moth_warm_halos';
    this.bodyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.wingMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.glowMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // Fixed per-lantern bounds allow renderer frustum culling while retaining
    // one draw call for each moth layer.
    this.bodyMesh.frustumCulled = false;
    this.wingMesh.frustumCulled = false;
    this.glowMesh.frustumCulled = false;
    this.glowMesh.renderOrder = 1;
    this.bodyMesh.renderOrder = 2;
    this.wingMesh.renderOrder = 2;
    scene.add(this.glowMesh, this.bodyMesh, this.wingMesh);

    anchors.forEach((anchor, anchorIndex) => {
      for (let i = 0; i < perAnchor; i++) {
        this.agents.push({
          anchor: anchor.clone(),
          phase: anchorIndex * 1.37 + i * 2.41,
          speed: 0.62 + ((i * 13 + anchorIndex * 7) % 9) * 0.045,
          radius: 0.48 + (i % 3) * 0.17,
          height: 0.38 + (i % 3) * 0.24,
        });
      }
    });
    this.updateMatrices();
  }

  update(delta: number): void {
    this.elapsed += Math.min(delta, 0.1);
    this.lastUpdate += Math.min(delta, 0.1);
    if (this.lastUpdate < this.interval) return;
    this.lastUpdate %= this.interval;
    this.updateMatrices();
  }

  dispose(): void {
    this.bodyMesh.removeFromParent();
    this.wingMesh.removeFromParent();
    this.glowMesh.removeFromParent();
    this.bodyMesh.geometry.dispose();
    this.wingMesh.geometry.dispose();
    this.glowMesh.geometry.dispose();
    (this.bodyMesh.material as THREE.Material).dispose();
    (this.wingMesh.material as THREE.Material).dispose();
    (this.glowMesh.material as THREE.Material).dispose();
  }

  private updateMatrices(): void {
    const time = this.elapsed;
    for (let i = 0; i < this.agents.length; i++) {
      const agent = this.agents[i];
      const phase = time * agent.speed + agent.phase;
      const flutter = Math.sin(time * 12 + agent.phase);
      const x = agent.anchor.x + Math.sin(phase) * agent.radius;
      const y = agent.anchor.y + agent.height + Math.sin(phase * 1.71) * 0.18;
      const z = agent.anchor.z + Math.cos(phase * 0.83) * agent.radius * 0.7;

      this.helper.position.set(x, y, z);
      this.helper.rotation.set(flutter * 0.18, phase, 0);
      this.helper.scale.set(1, 1, 1);
      this.helper.updateMatrix();
      this.bodyMesh.setMatrixAt(i, this.helper.matrix);

      const haloPulse = 0.72 + (Math.sin(time * 2.4 + agent.phase) + 1) * 0.2;
      this.helper.position.set(x, y, z);
      this.helper.rotation.set(0, phase * 0.35, 0);
      this.helper.scale.setScalar(haloPulse);
      this.helper.updateMatrix();
      this.glowMesh.setMatrixAt(i, this.helper.matrix);

      for (let side = 0; side < 2; side++) {
        const wingIndex = i * 2 + side;
        const sign = side === 0 ? -1 : 1;
        this.helper.position.set(x + sign * 0.03, y + 0.012, z);
        this.helper.rotation.set(0, phase, sign * (0.5 + flutter * 0.35));
        this.helper.scale.set(1.15, 0.34, 0.62);
        this.helper.updateMatrix();
        this.wingMesh.setMatrixAt(wingIndex, this.helper.matrix);
      }
    }
    this.bodyMesh.instanceMatrix.needsUpdate = true;
    this.wingMesh.instanceMatrix.needsUpdate = true;
    this.glowMesh.instanceMatrix.needsUpdate = true;
  }
}
