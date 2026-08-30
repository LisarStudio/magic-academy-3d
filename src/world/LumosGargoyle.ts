import * as THREE from 'three';
import { AudioManager } from '../core/AudioManager';

export class LumosGargoyle {
  public mesh: THREE.Group;
  public isLit = false;
  public position: THREE.Vector3;
  public ghostPlatforms: THREE.Mesh[] = [];

  private eyesLight: THREE.PointLight;
  private headMesh: THREE.Mesh;
  private mat: THREE.MeshStandardMaterial;

  constructor(position: THREE.Vector3, scene: THREE.Scene, platformPositions: THREE.Vector3[]) {
    this.position = position.clone();
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    // Stone Gargoyle geometry
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x4a475a, roughness: 0.9 });
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), pedestalMat);
    pedestal.position.y = 0.6;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    this.mesh.add(pedestal);

    this.mat = new THREE.MeshStandardMaterial({ color: 0x383545, roughness: 0.8 });
    this.headMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.4), this.mat);
    this.headMesh.position.set(0, 1.4, 0);
    this.mesh.add(this.headMesh);

    // Wings
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x2a2838 });
    const wingL = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 4), wingMat);
    wingL.rotation.z = Math.PI / 3;
    wingL.position.set(-0.5, 1.4, 0);
    const wingR = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 4), wingMat);
    wingR.rotation.z = -Math.PI / 3;
    wingR.position.set(0.5, 1.4, 0);
    this.mesh.add(wingL, wingR);

    // Lumos Light
    this.eyesLight = new THREE.PointLight(0xffffff, 0, 8.0);
    this.eyesLight.position.set(0, 1.5, 0.3);
    this.mesh.add(this.eyesLight);

    // Create Transparent Ghost Platforms across gap
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x88f5ff,
      emissive: 0x3df3ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.0, // Invisible until Lumos is cast!
      roughness: 0.1
    });

    platformPositions.forEach(pos => {
      const plat = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 3.5), ghostMat.clone());
      plat.position.copy(pos);
      plat.visible = false;
      scene.add(plat);
      this.ghostPlatforms.push(plat);
    });

    scene.add(this.mesh);
  }

  public activateLumos(audioManager: AudioManager, collidersList: THREE.Object3D[]): void {
    if (this.isLit) return;
    this.isLit = true;

    audioManager.playLumosGargoyle();
    this.mat.emissive.setHex(0xffff88);
    this.mat.emissiveIntensity = 0.8;
    this.eyesLight.color.setHex(0xffffaa);
    this.eyesLight.intensity = 4.0;

    // Reveal Ghost Platforms
    this.ghostPlatforms.forEach(plat => {
      plat.visible = true;
      collidersList.push(plat);

      // Fade opacity tween
      const mat = plat.material as THREE.MeshStandardMaterial;
      let opacity = 0;
      const fadeIn = () => {
        opacity += 0.05;
        mat.opacity = Math.min(0.75, opacity);
        if (opacity < 0.75) {
          requestAnimationFrame(fadeIn);
        }
      };
      fadeIn();
    });
  }
}
