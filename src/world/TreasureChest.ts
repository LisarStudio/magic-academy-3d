import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
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

    // Compact beveled proportions sit cleanly on the pavilion's round table.
    const bodyGeo = new RoundedBoxGeometry(1.04, 0.52, 0.72, 3, 0.065);
    const body = new THREE.Mesh(bodyGeo, woodMat);
    body.position.y = 0.26;
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // Brass bindings follow the softened body instead of forming sharp cubes.
    const strapL = new THREE.Mesh(new RoundedBoxGeometry(0.075, 0.54, 0.735, 2, 0.025), brassMat);
    strapL.position.set(-0.43, 0.26, 0);
    const strapR = strapL.clone();
    strapR.position.x = 0.43;
    this.mesh.add(strapL, strapR);

    // Hinged Lid Group
    this.lidMesh = new THREE.Group();
    this.lidMesh.position.set(0, 0.51, -0.34); // Hinge pivot at back

    const lidTop = new THREE.Mesh(new RoundedBoxGeometry(1.08, 0.34, 0.72, 4, 0.11), woodMat);
    lidTop.position.set(0, 0.16, 0.36);
    lidTop.castShadow = true;
    lidTop.receiveShadow = true;
    this.lidMesh.add(lidTop);

    this.mesh.add(this.lidMesh);

    // Glowing Alohomora Padlock
    const lockGeo = new THREE.TorusGeometry(0.1, 0.03, 8, 16);
    this.lockMesh = new THREE.Mesh(lockGeo, brassMat);
    this.lockMesh.position.set(0, 0.39, 0.375);
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

  /** Restore the already-open state from a saved game without replaying audio or animation. */
  public restoreOpen(): void {
    this.isUnlocked = true;
    this.lockMesh.visible = false;
    this.lockLight.color.setHex(0x3df3ff);
    this.lidMesh.rotation.x = -Math.PI * 0.55;
  }
}

