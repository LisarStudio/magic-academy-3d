import * as THREE from 'three';
import { PlayerController } from './PlayerController';
import { ItemPickupVFX } from './ItemPickupVFX';

export interface KeyData {
  id: string;
  name: string;
  color: number;          // e.g. 0xff2200 for Red, 0x00ff88 for Emerald Green
  emissiveColor: number;  // e.g. 0xff4400 for Red, 0x00cc66 for Emerald Green
  obtained: boolean;
}

export class KeyPickupSequence {
  private static isSequenceRunning = false;

  /**
   * Executes the full 5-Phase AAA Nintendo-style Key Pickup Sequence:
   * Phase 1: Defeat / Origin contextual pause.
   * Phase 2: Key materializes at origin with glow matching key.color.
   * Phase 3: Smooth interpolated flight curve towards Wukong.
   * Phase 4: Key attaches physically to Wukong's RightHand bone during TakeItem pose.
   * Phase 5: Wukong performs store gesture -> key added to inventory -> cleanup.
   */
  public static async runSequence(
    keyData: KeyData,
    startPos: THREE.Vector3,
    player: PlayerController,
    scene: THREE.Scene,
    onComplete?: () => void
  ): Promise<void> {
    if (this.isSequenceRunning) {
      console.warn(`[KEY] Sequence already running, skipping duplicate call for '${keyData.id}'`);
      return;
    }
    this.isSequenceRunning = true;

    console.log(`[KEY] KeyPickupSequence started for '${keyData.id}' (${keyData.name}) at`, startPos);

    // Lock player during sequence
    player.isControlsLocked = true;
    player.isMovementLocked = true;
    player.velocity.set(0, 0, 0);

    // ── FASE 1 & 2: Build Key mesh with matching emissive, pointlight, & particles ──
    const keyGroup = new THREE.Group();
    keyGroup.name = `cinematic_key_${keyData.id}`;
    keyGroup.position.copy(startPos);

    const keyMat = new THREE.MeshStandardMaterial({
      color: keyData.color,
      emissive: keyData.emissiveColor,
      emissiveIntensity: 1.2,
      metalness: 0.85,
      roughness: 0.2,
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.07, 12, 24), keyMat);
    ring.rotation.x = Math.PI / 2;

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), keyMat);
    shaft.position.y = -0.32;

    const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.05), keyMat);
    tooth1.position.set(0.1, -0.5, 0);

    const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.05), keyMat);
    tooth2.position.set(0.08, -0.38, 0);

    keyGroup.add(ring, shaft, tooth1, tooth2);

    // Matching dynamic PointLight
    const keyLight = new THREE.PointLight(keyData.emissiveColor, 4.0, 6.0);
    keyLight.position.set(0, 0, 0);
    keyGroup.add(keyLight);

    // Matching color particles
    const particleCount = 14;
    const particles: THREE.Mesh[] = [];
    const pGeo = new THREE.OctahedronGeometry(0.035, 0);
    for (let i = 0; i < particleCount; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: keyData.color,
        transparent: true,
        opacity: 0.9,
      });
      const p = new THREE.Mesh(pGeo, pMat);
      const angle = (i / particleCount) * Math.PI * 2;
      p.position.set(Math.cos(angle) * 0.35, (Math.random() - 0.5) * 0.4, Math.sin(angle) * 0.35);
      keyGroup.add(p);
      particles.push(p);
    }

    scene.add(keyGroup);

    // ── FASE 3: Interpolated flight curve towards Wukong ──
    console.log(`[KEY] Flying to player...`);
    const flightDuration = 1.4; // seconds
    let flightElapsed = 0;

    const initialPos = startPos.clone();
    
    await new Promise<void>((resolve) => {
      const flyStep = () => {
        flightElapsed += 0.016;
        const t = Math.min(1.0, flightElapsed / flightDuration);

        // Smooth cubic ease-in-out
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Target position: player hand height (~1.2m above feet)
        const targetPos = player.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 0));

        // Arc height control point
        const midY = Math.max(initialPos.y, targetPos.y) + 1.2;
        const currentPos = new THREE.Vector3();
        currentPos.x = THREE.MathUtils.lerp(initialPos.x, targetPos.x, easeT);
        currentPos.z = THREE.MathUtils.lerp(initialPos.z, targetPos.z, easeT);
        // Parabolic arc for Y
        currentPos.y = (1 - easeT) * (1 - easeT) * initialPos.y + 2 * (1 - easeT) * easeT * midY + easeT * easeT * targetPos.y;

        keyGroup.position.copy(currentPos);
        keyGroup.rotation.y += 0.08;

        // Swirl particles
        particles.forEach((p, idx) => {
          p.rotation.x += 0.1;
          p.rotation.y += 0.1;
          p.position.y += Math.sin(flightElapsed * 8 + idx) * 0.005;
        });

        if (t < 1.0) {
          requestAnimationFrame(flyStep);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(flyStep);
    });

    // ── FASE 4: Attach physically to Wukong's RightHand bone ──
    console.log(`[KEY] Attached to hand`);
    scene.remove(keyGroup); // Remove from world scene

    const handNode = ItemPickupVFX.findHandNode(player);
    handNode.add(keyGroup); // ATTACH TO PLAYER HAND BONE

    // Reset local transform relative to hand
    keyGroup.position.set(0.02, 0.08, 0.04);
    keyGroup.rotation.set(0, Math.PI / 2, Math.PI / 4);
    keyGroup.scale.setScalar(0.9);

    // Dynamic light illuminating Wukong's torso/face
    const heroLight = new THREE.PointLight(keyData.emissiveColor, 4.5, 6.0);
    heroLight.position.set(0, 0.2, 0.2);
    keyGroup.add(heroLight);

    // Play Wukong TakeItem animation
    player.animationController.playTakeItemAnimation(() => {});

    // ── FASE 5: Store gesture -> register in inventory -> cleanup ──
    let holdElapsed = 0;
    const holdDuration = 1.8; // seconds matching TakeItem pose

    await new Promise<void>((resolve) => {
      const holdStep = () => {
        holdElapsed += 0.016;
        const t = Math.min(1.0, holdElapsed / holdDuration);

        // Rotate key slowly in hand
        keyGroup.rotation.z += 0.04;

        // Pulse light
        heroLight.intensity = (4.0 + Math.sin(holdElapsed * 10) * 1.5) * (1.0 - Math.max(0, (t - 0.7) / 0.3));

        // Particles fade out as key is stored
        particles.forEach((p) => {
          (p.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1.0 - t * 1.3);
        });

        if (t < 1.0) {
          requestAnimationFrame(holdStep);
        } else {
          // Detach from hand and dispose local resources
          handNode.remove(keyGroup);
          keyGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              (child as THREE.Mesh).geometry.dispose();
              const mat = (child as THREE.Mesh).material;
              if (Array.isArray(mat)) mat.forEach(m => m.dispose());
              else mat.dispose();
            }
          });
          resolve();
        }
      };
      requestAnimationFrame(holdStep);
    });

    // Mark key as obtained & register in inventory
    keyData.obtained = true;
    console.log(`[KEY] Added to inventory: '${keyData.id}'`);

    // Restore player controls
    player.isControlsLocked = false;
    player.isMovementLocked = false;
    this.isSequenceRunning = false;

    console.log(`[KEY] KeyPickupSequence completed for '${keyData.id}'`);

    // Execute completion callback
    if (onComplete) onComplete();
  }
}
