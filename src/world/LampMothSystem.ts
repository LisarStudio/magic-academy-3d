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
  private readonly helper = new THREE.Object3D();
  private elapsed = 0;
  private lastUpdate = 0;
  private readonly interval = 1 / 30;

  constructor(scene: THREE.Scene, anchors: THREE.Vector3[], mobile: boolean) {
    const perAnchor = mobile ? 2 : 4;
    const count = anchors.length * perAnchor;
    const bodyGeometry = new THREE.SphereGeometry(0.025, 6, 5);
    const wingGeometry = new THREE.SphereGeometry(0.042, 6, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x453326,
      roughness: 0.9,
      emissive: 0x1c1008,
      emissiveIntensity: 0.5,
    });
    const wingMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdda0,
      roughness: 0.8,
      emissive: 0x9b5b20,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
    });

    this.bodyMesh = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, count);
    this.wingMesh = new THREE.InstancedMesh(wingGeometry, wingMaterial, count * 2);
    this.bodyMesh.name = 'lantern_moth_bodies';
    this.wingMesh.name = 'lantern_moth_wings';
    this.bodyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.wingMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.bodyMesh.frustumCulled = false;
    this.wingMesh.frustumCulled = false;
    scene.add(this.bodyMesh, this.wingMesh);

    anchors.forEach((anchor, anchorIndex) => {
      for (let i = 0; i < perAnchor; i++) {
        this.agents.push({
          anchor: anchor.clone(),
          phase: anchorIndex * 1.37 + i * 2.41,
          speed: 0.62 + ((i * 13 + anchorIndex * 7) % 9) * 0.045,
          radius: 0.28 + (i % 3) * 0.13,
          height: 0.25 + (i % 2) * 0.22,
        });
      }
    });
    this.updateMatrices();
  }

  update(delta: number, playerPosition: THREE.Vector3): void {
    const maxDistance = window.innerWidth <= 1024 || navigator.maxTouchPoints > 0 ? 42 : 78;
    const inRange = this.agents.some(agent => agent.anchor.distanceToSquared(playerPosition) < maxDistance * maxDistance);
    this.bodyMesh.visible = this.wingMesh.visible = inRange;
    if (!inRange) return;

    this.elapsed += Math.min(delta, 0.1);
    this.lastUpdate += Math.min(delta, 0.1);
    if (this.lastUpdate < this.interval) return;
    this.lastUpdate %= this.interval;
    this.updateMatrices();
  }

  dispose(): void {
    this.bodyMesh.removeFromParent();
    this.wingMesh.removeFromParent();
    this.bodyMesh.geometry.dispose();
    this.wingMesh.geometry.dispose();
    (this.bodyMesh.material as THREE.Material).dispose();
    (this.wingMesh.material as THREE.Material).dispose();
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

      for (let side = 0; side < 2; side++) {
        const wingIndex = i * 2 + side;
        const sign = side === 0 ? -1 : 1;
        this.helper.position.set(x + sign * 0.035, y + 0.012, z);
        this.helper.rotation.set(0, phase, sign * (0.5 + flutter * 0.35));
        this.helper.scale.set(1.2, 0.42, 0.75);
        this.helper.updateMatrix();
        this.wingMesh.setMatrixAt(wingIndex, this.helper.matrix);
      }
    }
    this.bodyMesh.instanceMatrix.needsUpdate = true;
    this.wingMesh.instanceMatrix.needsUpdate = true;
  }
}
