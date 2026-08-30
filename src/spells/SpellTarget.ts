import * as THREE from 'three';

export class SpellTarget {
  public mesh: THREE.Group;
  public isActivated = false;
  public id: string;
  public onActivate: (() => void) | null = null;

  private symbolMesh: THREE.Mesh;
  private glowLight: THREE.PointLight;
  private symbolMat: THREE.MeshStandardMaterial;

  constructor(id: string, position: THREE.Vector3, isStatue = false) {
    this.id = id;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    if (isStatue) {
      // Ancient wizard statue target
      const pedestalGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.4, 8);
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x4a4a58, roughness: 0.8 });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = 0.2;
      pedestal.castShadow = true;
      this.mesh.add(pedestal);

      const statueGeo = new THREE.ConeGeometry(0.4, 1.2, 6);
      const statueMat = new THREE.MeshStandardMaterial({ color: 0x5a5a6a, roughness: 0.7 });
      const statue = new THREE.Mesh(statueGeo, statueMat);
      statue.position.y = 1.0;
      statue.castShadow = true;
      this.mesh.add(statue);

      // Symbol orb atop statue
      const orbGeo = new THREE.SphereGeometry(0.2, 12, 12);
      this.symbolMat = new THREE.MeshStandardMaterial({
        color: 0x334466,
        emissive: 0x112244,
        emissiveIntensity: 0.2
      });
      this.symbolMesh = new THREE.Mesh(orbGeo, this.symbolMat);
      this.symbolMesh.position.y = 1.8;
      this.mesh.add(this.symbolMesh);
    } else {
      // Floating wall target emblem
      const frameGeo = new THREE.TorusGeometry(0.4, 0.06, 8, 16);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xc69425, metalness: 0.8 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      this.mesh.add(frame);

      const emblemGeo = new THREE.OctahedronGeometry(0.25);
      this.symbolMat = new THREE.MeshStandardMaterial({
        color: 0x334466,
        emissive: 0x112244,
        emissiveIntensity: 0.2
      });
      this.symbolMesh = new THREE.Mesh(emblemGeo, this.symbolMat);
      this.mesh.add(this.symbolMesh);
    }

    // Glow PointLight
    this.glowLight = new THREE.PointLight(0x3df3ff, 0, 4.0);
    this.glowLight.position.copy(this.symbolMesh.position);
    this.mesh.add(this.glowLight);
  }

  public activate(): void {
    if (this.isActivated) return;
    this.isActivated = true;

    // Visual change: glow bright cyan
    this.symbolMat.color.setHex(0x3df3ff);
    this.symbolMat.emissive.setHex(0x3df3ff);
    this.symbolMat.emissiveIntensity = 2.0;
    this.glowLight.intensity = 3.0;

    if (this.onActivate) {
      this.onActivate();
    }
  }

  public update(delta: number): void {
    // Slow rotation of symbol orb/emblem
    this.symbolMesh.rotation.y += delta * 1.5;
    if (this.isActivated) {
      this.symbolMesh.position.y += Math.sin(Date.now() * 0.005) * 0.001;
    }
  }
}
