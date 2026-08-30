import * as THREE from 'three';
import type { SpellType } from './SpellProjectile';

export class TargetReticle3D {
  public mesh: THREE.Group;
  private ringMesh: THREE.Mesh;
  private iconMesh: THREE.Mesh;
  private ringMat: THREE.MeshBasicMaterial;
  private iconMat: THREE.MeshBasicMaterial;

  public targetObject: THREE.Object3D | null = null;
  public isVisible = false;

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.name = 'TargetReticle3D';
    this.mesh.visible = false;

    // Outer rotating glowing ring
    const ringGeo = new THREE.RingGeometry(0.5, 0.65, 32);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0x3df3ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    this.ringMesh = new THREE.Mesh(ringGeo, this.ringMat);
    this.mesh.add(this.ringMesh);

    // Inner symbol emblem
    const iconGeo = new THREE.PlaneGeometry(0.6, 0.6);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const tex = new THREE.CanvasTexture(canvas);

    this.iconMat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    this.iconMesh = new THREE.Mesh(iconGeo, this.iconMat);
    this.iconMesh.position.z = 0.02;
    this.mesh.add(this.iconMesh);

    this.updateIcon('FLIPENDO');
  }

  public updateIcon(spellType: SpellType | 'TARGET'): void {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 128, 128);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let colorHex = 0x3df3ff;

    if (spellType === 'FLIPENDO') {
      colorHex = 0x3df3ff;
      ctx.fillStyle = '#3df3ff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('✋', 64, 64);
    } else if (spellType === 'ALOHOMORA') {
      colorHex = 0xffd700;
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('🔑', 64, 64);
    } else if (spellType === 'LUMOS') {
      colorHex = 0xffffaa;
      ctx.fillStyle = '#ffffaa';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('💡', 64, 64);
    } else {
      colorHex = 0xff4422;
      ctx.fillStyle = '#ff4422';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('🎯', 64, 64);
    }

    this.ringMat.color.setHex(colorHex);
    const tex = new THREE.CanvasTexture(canvas);
    this.iconMat.map = tex;
    this.iconMat.needsUpdate = true;
  }

  public attachTo(object: THREE.Object3D, spellType: SpellType | 'TARGET'): void {
    this.targetObject = object;
    this.updateIcon(spellType);
    this.mesh.visible = true;
    this.isVisible = true;
  }

  public detach(): void {
    this.targetObject = null;
    this.mesh.visible = false;
    this.isVisible = false;
  }

  public update(cameraPosition: THREE.Vector3): void {
    if (!this.isVisible || !this.targetObject) return;

    // Follow target world position
    const worldPos = new THREE.Vector3();
    this.targetObject.getWorldPosition(worldPos);
    worldPos.y += 0.8; // Floating slightly above object
    this.mesh.position.copy(worldPos);

    // Billboarding: face camera
    this.mesh.lookAt(cameraPosition);

    // Rotate outer ring
    this.ringMesh.rotation.z += 0.03;
  }
}
