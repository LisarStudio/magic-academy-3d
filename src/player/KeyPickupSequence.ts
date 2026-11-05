import * as THREE from 'three';
import { PlayerController } from './PlayerController';
import { ItemPickupVFX } from './ItemPickupVFX';
import { loadKeyModel } from '../collectibles/KeyAssetCatalog';

export interface KeyData {
  id: string;
  name: string;
  color: number;
  emissiveColor: number;
  obtained: boolean;
  modelUrl?: string;
}

export type KeyRewardPresentation = 'quest' | 'boss-celestial';

export class KeyPickupSequence {
  private static isSequenceRunning = false;
  private static readonly particleGeo = new THREE.OctahedronGeometry(0.035, 0);
  private static readonly rewardColors = [0xffd76a, 0x73e8ff, 0xff9dd7, 0xb99aff, 0x8dffd2, 0xffffff];
  private static readonly rewardMaterials = this.rewardColors.map((color) => new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false,
  }));

  public static async precompileShaders(renderer: THREE.WebGLRenderer, camera: THREE.Camera, targetScene: THREE.Scene): Promise<void> {
    const warmScene = new THREE.Scene();
    warmScene.add(new THREE.Mesh(this.particleGeo, this.rewardMaterials[0]));
    try {
      await renderer.compileAsync(warmScene, camera, targetScene);
    } finally {
      warmScene.clear();
    }
  }

  public static async runSequence(
    keyData: KeyData,
    startPos: THREE.Vector3,
    player: PlayerController,
    scene: THREE.Scene,
    onComplete?: () => void,
    presentation: KeyRewardPresentation = 'quest',
  ): Promise<void> {
    if (this.isSequenceRunning || keyData.obtained) return;

    let keyModel: THREE.Group;
    try {
      keyModel = await loadKeyModel(keyData.id);
    } catch (error) {
      console.error(`[KEY] Approved model for '${keyData.id}' failed to load; reward sequence cancelled.`, error);
      keyData.obtained = true;
      onComplete?.();
      return;
    }

    if (this.isSequenceRunning || keyData.obtained) return;
    this.isSequenceRunning = true;
    player.isControlsLocked = true;
    player.isMovementLocked = true;
    player.velocity.set(0, 0, 0);

    const keyGroup = new THREE.Group();
    keyGroup.name = `reward_key_${keyData.id}`;
    keyGroup.position.copy(startPos);
    keyGroup.add(keyModel);
    scene.add(keyGroup);

    const particleCount = presentation === 'boss-celestial' ? 18 : 10;
    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < particleCount; i++) {
      const material = presentation === 'boss-celestial'
        ? this.rewardMaterials[i % this.rewardMaterials.length]
        : this.rewardMaterials[1];
      const particle = new THREE.Mesh(this.particleGeo, material);
      const angle = (i / particleCount) * Math.PI * 2;
      particle.position.set(Math.cos(angle) * 0.42, (i % 3) * 0.12, Math.sin(angle) * 0.42);
      keyGroup.add(particle);
      particles.push(particle);
    }

    const burstMaterial = new THREE.MeshBasicMaterial({
      color: presentation === 'boss-celestial' ? 0xc7a6ff : keyData.color,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
    });
    const burst = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.45, 24), burstMaterial);
    burst.position.copy(startPos);
    burst.rotation.x = -Math.PI / 2;
    scene.add(burst);

    let skipped = false;
    const skip = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'Space' || event.code === 'Escape') skipped = true;
    };
    if (presentation === 'boss-celestial') window.addEventListener('keydown', skip);

    try {
      const facing = new THREE.Vector3(0, 0, 1).applyQuaternion(player.mesh.quaternion).setY(0).normalize();
      if (facing.lengthSq() < 0.001) facing.set(0, 0, 1);
      const target = player.mesh.position.clone().addScaledVector(facing, 0.32).add(new THREE.Vector3(0, 1.45, 0));
      const duration = presentation === 'boss-celestial' ? 3.25 : 0.9;
      const from = startPos.clone();
      const clockStart = performance.now();

      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          const rawT = skipped ? 1 : Math.min(1, (now - clockStart) / (duration * 1000));
          const t = rawT * rawT * (3 - 2 * rawT);
          keyGroup.position.lerpVectors(from, target, t);
          keyGroup.position.y += Math.sin(Math.PI * rawT) * (presentation === 'boss-celestial' ? 0.24 : 0.32);
          keyGroup.rotation.y += 0.018;
          particles.forEach((particle, index) => {
            const angle = now * 0.0008 + index * Math.PI * 2 / particleCount;
            particle.position.set(Math.cos(angle) * 0.42, Math.sin(angle * 1.4) * 0.16, Math.sin(angle) * 0.42);
            particle.rotation.x += 0.03;
          });
          burst.scale.setScalar(0.7 + rawT * 1.6);
          burstMaterial.opacity = Math.max(0, 0.7 * (1 - rawT));
          if (rawT < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      const handNode = ItemPickupVFX.findHandNode(player);
      scene.remove(keyGroup);
      handNode.add(keyGroup);
      keyGroup.position.set(0, 0.18, 0.08);
      keyGroup.rotation.set(0, Math.PI / 2, Math.PI / 4);

      await new Promise<void>((resolve) => {
        const started = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / (skipped ? 80 : 260));
          keyModel.scale.setScalar(0.72 * (1 - t));
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });

      handNode.remove(keyGroup);
      keyData.obtained = true;
      onComplete?.();
    } finally {
      window.removeEventListener('keydown', skip);
      scene.remove(keyGroup, burst);
      burst.geometry.dispose();
      burstMaterial.dispose();
      particles.length = 0;
      player.isControlsLocked = false;
      player.isMovementLocked = false;
      player.isInvulnerable = false;
      player.velocity.set(0, 0, 0);
      player.forceIdle();
      this.isSequenceRunning = false;
    }
  }
}
