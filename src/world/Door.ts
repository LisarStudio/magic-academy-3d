import * as THREE from 'three';
import { AudioManager } from '../core/AudioManager';

export class Door {
  public mesh: THREE.Group;
  public isOpen = false;
  public isLocked = false;
  public id: string;

  private leftWing: THREE.Mesh;
  private rightWing: THREE.Mesh;
  private targetOpenAmount = 0;
  private currentOpenAmount = 0;

  constructor(id: string, position: THREE.Vector3, rotationY: number = 0, isLocked = false) {
    this.id = id;
    this.isLocked = isLocked;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;

    // Door Frame
    const frameGeo = new THREE.BoxGeometry(3.2, 4.2, 0.4);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a3645, roughness: 0.8 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 2.1;
    frame.castShadow = true;
    this.mesh.add(frame);

    // Left & Right Wooden Wings
    const wingGeo = new THREE.BoxGeometry(1.4, 3.8, 0.2);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });

    this.leftWing = new THREE.Mesh(wingGeo, woodMat);
    this.leftWing.position.set(-0.7, 2.0, 0);
    this.leftWing.castShadow = true;

    this.rightWing = new THREE.Mesh(wingGeo, woodMat);
    this.rightWing.position.set(0.7, 2.0, 0);
    this.rightWing.castShadow = true;

    // Metal ornaments / handles
    const handleGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 12);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf3c644, metalness: 0.8 });

    const handleL = new THREE.Mesh(handleGeo, goldMat);
    handleL.position.set(0.5, 0, 0.12);
    this.leftWing.add(handleL);

    const handleR = new THREE.Mesh(handleGeo, goldMat);
    handleR.position.set(-0.5, 0, 0.12);
    this.rightWing.add(handleR);

    this.mesh.add(this.leftWing, this.rightWing);
  }

  public open(audioManager?: AudioManager): void {
    if (this.isOpen) return;
    this.isOpen = true;
    this.targetOpenAmount = 1.0;
    if (audioManager) audioManager.playDoorOpen();
  }

  public close(): void {
    this.isOpen = false;
    this.targetOpenAmount = 0;
  }

  public update(delta: number): void {
    if (Math.abs(this.currentOpenAmount - this.targetOpenAmount) > 0.001) {
      this.currentOpenAmount = THREE.MathUtils.lerp(
        this.currentOpenAmount,
        this.targetOpenAmount,
        delta * 3.0
      );

      // Rotate wings outward
      const openAngle = Math.PI * 0.45 * this.currentOpenAmount;
      this.leftWing.rotation.y = -openAngle;
      this.rightWing.rotation.y = openAngle;
    }
  }
}
