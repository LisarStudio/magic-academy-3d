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

  // Reusable static vector math to avoid GC pressure
  private static readonly TEMP_START = new THREE.Vector3();
  private static readonly TEMP_TARGET = new THREE.Vector3();
  private static readonly TEMP_CURR = new THREE.Vector3();

  // Reusable pooled geometries
  private static ringGeo = new THREE.TorusGeometry(0.24, 0.07, 12, 24);
  private static shaftGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12);
  private static tooth1Geo = new THREE.BoxGeometry(0.16, 0.1, 0.05);
  private static tooth2Geo = new THREE.BoxGeometry(0.12, 0.08, 0.05);
  private static particleGeo = new THREE.OctahedronGeometry(0.035, 0);
  private static burstRingGeo = new THREE.RingGeometry(0.1, 0.6, 24);

  /**
   * Warmup function called during level load to pre-compile key shaders into WebGL
   */
  public static precompileShaders(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): void {
    const dummyKeyMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xffaa00,
      emissiveIntensity: 1.2,
      metalness: 0.85,
      roughness: 0.2,
    });
    const dummyMesh = new THREE.Mesh(this.ringGeo, dummyKeyMat);
    dummyMesh.position.set(0, -999, 0);
    const dummyLight = new THREE.PointLight(0xffaa00, 4.0, 6.0);
    dummyMesh.add(dummyLight);
    scene.add(dummyMesh);

    renderer.compile(scene, camera);

    scene.remove(dummyMesh);
    dummyKeyMat.dispose();
  }

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

    const ring = new THREE.Mesh(this.ringGeo, keyMat);
    ring.rotation.x = Math.PI / 2;

    const shaft = new THREE.Mesh(this.shaftGeo, keyMat);
    shaft.position.y = -0.32;

    const tooth1 = new THREE.Mesh(this.tooth1Geo, keyMat);
    tooth1.position.set(0.1, -0.5, 0);

    const tooth2 = new THREE.Mesh(this.tooth2Geo, keyMat);
    tooth2.position.set(0.08, -0.38, 0);

    keyGroup.add(ring, shaft, tooth1, tooth2);

    // Matching dynamic PointLight
    const keyLight = new THREE.PointLight(keyData.emissiveColor, 4.0, 6.0);
    keyLight.position.set(0, 0, 0);
    keyGroup.add(keyLight);

    // Matching color particles
    const particleCount = 12;
    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < particleCount; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: keyData.color,
        transparent: true,
        opacity: 0.9,
      });
      const p = new THREE.Mesh(this.particleGeo, pMat);
      const angle = (i / particleCount) * Math.PI * 2;
      p.position.set(Math.cos(angle) * 0.35, (Math.random() - 0.5) * 0.4, Math.sin(angle) * 0.35);
      keyGroup.add(p);
      particles.push(p);
    }

    scene.add(keyGroup);

    // ── FASE 3: Interpolated flight curve towards Wukong ──
    console.log(`[KEY] Flying to player...`);
    const flightDuration = 1.3; // seconds
    let flightElapsed = 0;

    this.TEMP_START.copy(startPos);
    
    await new Promise<void>((resolve) => {
      let lastTime = performance.now();
      const flyStep = (now: number) => {
        const delta = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        flightElapsed += delta;

        const t = Math.min(1.0, flightElapsed / flightDuration);
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        this.TEMP_TARGET.copy(player.mesh.position).add(new THREE.Vector3(0, 1.2, 0));
        const midY = Math.max(this.TEMP_START.y, this.TEMP_TARGET.y) + 1.2;

        this.TEMP_CURR.x = THREE.MathUtils.lerp(this.TEMP_START.x, this.TEMP_TARGET.x, easeT);
        this.TEMP_CURR.z = THREE.MathUtils.lerp(this.TEMP_START.z, this.TEMP_TARGET.z, easeT);
        this.TEMP_CURR.y = (1 - easeT) * (1 - easeT) * this.TEMP_START.y + 2 * (1 - easeT) * easeT * midY + easeT * easeT * this.TEMP_TARGET.y;

        keyGroup.position.copy(this.TEMP_CURR);
        keyGroup.rotation.y += 0.08;

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
    console.log(`[KEY] Attached to hand '${keyData.id}'`);
    scene.remove(keyGroup);

    const handNode = ItemPickupVFX.findHandNode(player);
    handNode.add(keyGroup); // ATTACH TO PLAYER HAND BONE

    keyGroup.position.set(0.0, 0.18, 0.08);
    keyGroup.rotation.set(0, Math.PI / 2, Math.PI / 4);
    keyGroup.scale.setScalar(1.2);

    // Burst ring shockwave in exact key color
    const burstRingMat = new THREE.MeshBasicMaterial({
      color: keyData.color,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const burstRing = new THREE.Mesh(this.burstRingGeo, burstRingMat);
    burstRing.position.copy(player.mesh.position).add(new THREE.Vector3(0, 1.2, 0));
    burstRing.rotation.x = -Math.PI / 2;
    scene.add(burstRing);

    // Dynamic light illuminating Wukong's torso/face in matching key color
    const heroLight = new THREE.PointLight(keyData.emissiveColor, 6.0, 7.0);
    heroLight.position.set(0, 0.3, 0.3);
    keyGroup.add(heroLight);

    // Play Wukong TakeItem animation
    player.animationController.playTakeItemAnimation(() => {});

    // ── FASE 5: Store gesture -> register in inventory -> cleanup ──
    let holdElapsed = 0;
    const holdDuration = 1.7; // seconds matching TakeItem pose

    await new Promise<void>((resolve) => {
      let lastTime = performance.now();
      const holdStep = (now: number) => {
        const delta = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        holdElapsed += delta;

        const t = Math.min(1.0, holdElapsed / holdDuration);

        burstRing.scale.setScalar(1.0 + t * 8.0);
        burstRingMat.opacity = Math.max(0, 1.0 - t * 2.5);

        keyGroup.rotation.z += 0.04;
        heroLight.intensity = (5.0 + Math.sin(holdElapsed * 10) * 2.0) * (1.0 - Math.max(0, (t - 0.7) / 0.3));

        particles.forEach((p) => {
          (p.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1.0 - t * 1.3);
        });

        if (t < 1.0) {
          requestAnimationFrame(holdStep);
        } else {
          // Detach from hand safely
          scene.remove(burstRing);
          burstRingMat.dispose();

          handNode.remove(keyGroup);
          keyMat.dispose();
          particles.forEach(p => (p.material as THREE.MeshBasicMaterial).dispose());

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

    if (onComplete) onComplete();
  }
}
