import * as THREE from 'three';
import { AudioManager } from '../core/AudioManager';
import { CollectibleSystem } from '../collectibles/CollectibleSystem';

export class TreasureChest {
  public mesh: THREE.Group;
  public isUnlocked = false;
  public position: THREE.Vector3;

  private lidMesh: THREE.Group;
  private lockLight: THREE.PointLight;
  private lockMesh: THREE.Mesh;

  constructor(position: THREE.Vector3, rotationY = 0) {
    this.position = position.clone();
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;

    // Wood & Brass materials
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, metalness: 0.8, roughness: 0.3 });

    // Chest Body Base
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    const body = new THREE.Mesh(bodyGeo, woodMat);
    body.position.y = 0.3;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // Brass corner straps
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.82), brassMat);
    strapL.position.set(-0.5, 0.3, 0);
    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.82), brassMat);
    strapR.position.set(0.5, 0.3, 0);
    this.mesh.add(strapL, strapR);

    // Hinged Lid Group
    this.lidMesh = new THREE.Group();
    this.lidMesh.position.set(0, 0.6, -0.4); // Hinge pivot at back

    const lidTop = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.2, 12, 1, false, 0, Math.PI), woodMat);
    lidTop.rotation.z = Math.PI / 2;
    lidTop.position.set(0, 0, 0.4);
    this.lidMesh.add(lidTop);

    this.mesh.add(this.lidMesh);

    // Glowing Alohomora Padlock
    const lockGeo = new THREE.TorusGeometry(0.1, 0.03, 8, 16);
    this.lockMesh = new THREE.Mesh(lockGeo, brassMat);
    this.lockMesh.position.set(0, 0.45, 0.43);
    this.mesh.add(this.lockMesh);

    this.lockLight = new THREE.PointLight(0xffd700, 1.2, 2.5);
    this.lockLight.position.copy(this.lockMesh.position);
    this.mesh.add(this.lockLight);
  }

  public unlock(audioManager: AudioManager, _collectibleSystem: CollectibleSystem, onCollectStaff?: () => void): void {
    // isUnlocked flag is now set by ChestCinematic before calling unlock(),
    // so we skip the guard here and allow the lid animation to play.
    audioManager.playChestOpen();
    this.lockMesh.visible = false;
    this.lockLight.color.setHex(0x3df3ff);

    // Smooth lid open animation — exactly 0.8 seconds
    const start = Date.now();
    const animateLid = () => {
      const elapsed = (Date.now() - start) / 1000;
      const progress = Math.min(1.0, elapsed / 0.8);
      this.lidMesh.rotation.x = -progress * (Math.PI * 0.55);

      if (progress < 1.0) {
        requestAnimationFrame(animateLid);
      } else {
        // Only fire callback if provided (legacy path — ChestCinematic passes undefined)
        if (onCollectStaff) {
          onCollectStaff();
        }
      }
    };
    animateLid();
  }
}

