import * as THREE from 'three';
import { AudioManager } from '../core/AudioManager';
import { HUD } from '../ui/HUD';
import { PlayerController } from '../player/PlayerController';
import { CameraController } from '../camera/CameraController';
import { SubtitleSystem } from '../ui/SubtitleSystem';
import { InputManager } from '../core/InputManager';

export interface RunicPortalConfig {
  id: string;
  pairId: string;
  displayName: string;
  position: THREE.Vector3;
  rotationY: number;
  exitPoint: THREE.Vector3;
  exitYaw: number;
  unlockedByDefault?: boolean;
}

export class RunicPortal {
  public id: string;
  public pairId: string;
  public displayName: string;
  public position: THREE.Vector3;
  public rotationY: number;
  public exitPoint: THREE.Vector3;
  public exitYaw: number;
  public isUnlocked = false;
  public cooldownTimer = 0.0;
  public linkedPortal: RunicPortal | null = null;

  public mesh: THREE.Group;
  private runeMaterials: THREE.MeshStandardMaterial[] = [];
  private vortexMesh: THREE.Mesh;
  private vortexMat: THREE.MeshStandardMaterial;
  private particlesMesh: THREE.Points;
  private particlePositions: Float32Array;
  private particleCount = 24;

  private isActivating = false;
  private activationTime = 0.0;
  private readonly ACTIVATION_DURATION = 1.2;

  constructor(config: RunicPortalConfig, scene: THREE.Scene, levelColliders: THREE.Object3D[]) {
    this.id = config.id;
    this.pairId = config.pairId;
    this.displayName = config.displayName;
    this.position = config.position.clone();
    this.rotationY = config.rotationY;
    this.exitPoint = config.exitPoint.clone();
    this.exitYaw = config.exitYaw;
    this.isUnlocked = config.unlockedByDefault || false;

    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotationY;
    this.mesh.name = `runic_portal_${this.id}`;

    // ── 1. Architectural Stone Framework (Ancient Carved Chinese/Gothic Gateway) ──
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.85,
      metalness: 0.2
    });
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.85
    });

    // Circular Runic Foundation Dais
    const daisGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.25, 16);
    const dais = new THREE.Mesh(daisGeo, darkStoneMat);
    dais.position.y = 0.12;
    dais.receiveShadow = true;
    this.mesh.add(dais);
    levelColliders.push(dais);

    // Left & Right Carved Gate Pillars
    const pillarGeo = new THREE.BoxGeometry(0.65, 3.8, 0.65);
    const leftPillar = new THREE.Mesh(pillarGeo, darkStoneMat);
    leftPillar.position.set(-1.4, 2.0, 0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;

    const rightPillar = new THREE.Mesh(pillarGeo, darkStoneMat);
    rightPillar.position.set(1.4, 2.0, 0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;

    // Pillar Gold Tops & Bottom Caps
    const capGeo = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const lCapTop = new THREE.Mesh(capGeo, goldTrimMat);
    lCapTop.position.set(-1.4, 3.95, 0);
    const rCapTop = new THREE.Mesh(capGeo, goldTrimMat);
    rCapTop.position.set(1.4, 3.95, 0);

    // Monumental Carved Lintel Arch
    const archGeo = new THREE.BoxGeometry(3.6, 0.65, 0.85);
    const arch = new THREE.Mesh(archGeo, darkStoneMat);
    arch.position.set(0, 4.2, 0);
    arch.castShadow = true;

    const roofCrestGeo = new THREE.BoxGeometry(4.0, 0.25, 1.1);
    const roofCrest = new THREE.Mesh(roofCrestGeo, goldTrimMat);
    roofCrest.position.set(0, 4.6, 0);

    this.mesh.add(leftPillar, rightPillar, lCapTop, rCapTop, arch, roofCrest);
    levelColliders.push(leftPillar, rightPillar, arch);

    // ── 2. Inset Glowing Runic Glyphs ──
    const runeOffsets = [
      { pos: new THREE.Vector3(-1.4, 1.2, 0.35), rotY: 0 },
      { pos: new THREE.Vector3(-1.4, 2.2, 0.35), rotY: 0 },
      { pos: new THREE.Vector3(-1.4, 3.2, 0.35), rotY: 0 },
      { pos: new THREE.Vector3(1.4, 1.2, 0.35), rotY: 0 },
      { pos: new THREE.Vector3(1.4, 2.2, 0.35), rotY: 0 },
      { pos: new THREE.Vector3(1.4, 3.2, 0.35), rotY: 0 },
      { pos: new THREE.Vector3(-0.7, 4.2, 0.45), rotY: 0 },
      { pos: new THREE.Vector3(0.7, 4.2, 0.45), rotY: 0 },
    ];

    const runeGeo = new THREE.BoxGeometry(0.22, 0.42, 0.04);
    runeOffsets.forEach((r, idx) => {
      const runeMat = new THREE.MeshStandardMaterial({
        color: 0x1a2634,
        emissive: this.isUnlocked ? 0x00e5ff : 0x003355,
        emissiveIntensity: this.isUnlocked ? 1.8 : 0.15,
        roughness: 0.3,
        metalness: 0.5
      });
      this.runeMaterials.push(runeMat);
      const runeMesh = new THREE.Mesh(runeGeo, runeMat);
      runeMesh.position.copy(r.pos);
      runeMesh.rotation.y = r.rotY;
      runeMesh.name = `rune_glyph_${idx}`;
      this.mesh.add(runeMesh);
    });

    // ── 3. Mystical Portal Aperture / Vortex Core ──
    const vortexGeo = new THREE.PlaneGeometry(2.1, 3.2);
    this.vortexMat = new THREE.MeshStandardMaterial({
      color: 0x051b2c,
      emissive: this.isUnlocked ? 0x00d4ff : 0x001122,
      emissiveIntensity: this.isUnlocked ? 1.5 : 0.08,
      transparent: true,
      opacity: this.isUnlocked ? 0.78 : 0.06,
      side: THREE.DoubleSide,
      roughness: 0.1,
      metalness: 0.2
    });
    this.vortexMesh = new THREE.Mesh(vortexGeo, this.vortexMat);
    this.vortexMesh.position.set(0, 2.05, 0);
    this.mesh.add(this.vortexMesh);

    // Inner Concentric Energy Ring
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: this.isUnlocked ? 2.0 : 0.1,
      transparent: true,
      opacity: this.isUnlocked ? 0.8 : 0.05
    });
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 8, 24), innerRingMat);
    innerRing.position.set(0, 2.05, 0);
    this.mesh.add(innerRing);

    // ── 4. Swirling Ethereal Particle Whirlpool (Zero-Allocation Buffer Geometry) ──
    const pGeo = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(this.particleCount * 3);
    for (let i = 0; i < this.particleCount; i++) {
      const angle = (i / this.particleCount) * Math.PI * 2;
      const rad = 0.4 + Math.random() * 0.65;
      this.particlePositions[i * 3] = Math.cos(angle) * rad;
      this.particlePositions[i * 3 + 1] = 2.05 + Math.sin(angle) * 1.1;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.12,
      transparent: true,
      opacity: this.isUnlocked ? 0.85 : 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.particlesMesh = new THREE.Points(pGeo, pMat);
    this.mesh.add(this.particlesMesh);

    scene.add(this.mesh);
  }

  public activate(): void {
    if (this.isUnlocked || this.isActivating) return;
    this.isActivating = true;
    this.activationTime = 0.0;
  }

  public setUnlockedInstant(unlocked: boolean): void {
    this.isUnlocked = unlocked;
    this.isActivating = false;
    this.applyActiveVisuals(unlocked ? 1.0 : 0.0);
  }

  private applyActiveVisuals(progress: number): void {
    const emissiveIntensity = THREE.MathUtils.lerp(0.15, 2.2, progress);
    const runeColor = progress > 0.5 ? 0x00e5ff : 0x004466;

    for (const mat of this.runeMaterials) {
      mat.emissive.setHex(runeColor);
      mat.emissiveIntensity = emissiveIntensity;
    }

    this.vortexMat.emissive.setHex(progress > 0.5 ? 0x00d4ff : 0x001122);
    this.vortexMat.emissiveIntensity = THREE.MathUtils.lerp(0.08, 1.8, progress);
    this.vortexMat.opacity = THREE.MathUtils.lerp(0.06, 0.82, progress);

    const pMat = this.particlesMesh.material as THREE.PointsMaterial;
    pMat.opacity = THREE.MathUtils.lerp(0.0, 0.85, progress);
  }

  public update(delta: number, time: number): void {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer = Math.max(0, this.cooldownTimer - delta);
    }

    // 1. Activation Animation Transition (1.2s progressive awakening)
    if (this.isActivating) {
      this.activationTime += delta;
      const progress = Math.min(1.0, this.activationTime / this.ACTIVATION_DURATION);
      this.applyActiveVisuals(progress);

      if (progress >= 1.0) {
        this.isActivating = false;
        this.isUnlocked = true;
      }
    }

    // 2. Active Pulsing Energy Shader & Particles
    if (this.isUnlocked) {
      const pulse = Math.sin(time * 3.0) * 0.35 + 1.85;
      for (let i = 0; i < this.runeMaterials.length; i++) {
        // Subtle offset wave along glyphs
        const wave = Math.sin(time * 3.5 + i * 0.45) * 0.3;
        this.runeMaterials[i].emissiveIntensity = pulse + wave;
      }

      this.vortexMat.emissiveIntensity = 1.4 + Math.sin(time * 2.5) * 0.3;

      // Swirl particles in vertical elliptical orbit
      const pArr = this.particlePositions;
      for (let i = 0; i < this.particleCount; i++) {
        const speed = 1.4 + (i % 3) * 0.3;
        const currentAngle = time * speed + (i / this.particleCount) * Math.PI * 2;
        const radX = 0.5 + ((i * 7) % 10) * 0.05;
        const radY = 0.9 + ((i * 5) % 10) * 0.04;
        pArr[i * 3] = Math.cos(currentAngle) * radX;
        pArr[i * 3 + 1] = 2.05 + Math.sin(currentAngle) * radY;
        pArr[i * 3 + 2] = Math.sin(currentAngle * 2.0) * 0.15;
      }
      this.particlesMesh.geometry.attributes.position.needsUpdate = true;
    }
  }
}

export class PortalManager {
  private portals: RunicPortal[] = [];
  private totalElapsedTime = 0;
  private isTeleporting = false;

  public registerPortal(portal: RunicPortal): void {
    this.portals.push(portal);
  }

  public linkPair(portalA: RunicPortal, portalB: RunicPortal): void {
    portalA.linkedPortal = portalB;
    portalB.linkedPortal = portalA;
  }

  public getPortalById(id: string): RunicPortal | undefined {
    return this.portals.find(p => p.id === id);
  }

  public update(
    delta: number,
    playerPos: THREE.Vector3,
    inputManager: InputManager,
    hud: HUD,
    audioManager: AudioManager,
    player: PlayerController,
    cameraController: CameraController,
    subtitleSystem: SubtitleSystem
  ): void {
    this.totalElapsedTime += delta;

    for (const portal of this.portals) {
      portal.update(delta, this.totalElapsedTime);
    }

    if (this.isTeleporting) return;

    // Proximity check against all portals
    let nearestPortal: RunicPortal | null = null;
    let minDistance = Infinity;

    for (const portal of this.portals) {
      const dist = portal.position.distanceTo(playerPos);
      if (dist < 3.2 && dist < minDistance) {
        minDistance = dist;
        nearestPortal = portal;
      }
    }

    if (!nearestPortal) return;

    // ── A. LOCKED STATE: Interaction Prompt to awaken the pair ──
    if (!nearestPortal.isUnlocked) {
      hud.showInteractionPrompt(`Activar ${nearestPortal.displayName} [E]`);

      const ePressed = inputManager.keys['KeyE'];
      const isTouch = hud.isTouchDevice() && minDistance < 1.8;

      if (ePressed || isTouch) {
        hud.hideInteractionPrompt();
        const linked = nearestPortal.linkedPortal;

        // Activate BOTH portals in the pair simultaneously!
        nearestPortal.activate();
        if (linked) linked.activate();

        audioManager.playPortalActivate();
        subtitleSystem.show('Puertas Rúnicas', `¡Has activado la red de teletransporte! (${nearestPortal.displayName} ↔ ${linked?.displayName || 'Destino'})`, 3500);
      }
      return;
    }

    // ── B. UNLOCKED STATE: Fast Bidirectional Teleportation ──
    const targetPortal = nearestPortal.linkedPortal;
    if (!targetPortal) return;

    // Trigger zone (standing directly in front of or passing through the archway)
    const inTriggerRadius = minDistance < 1.45 && Math.abs(playerPos.y - nearestPortal.position.y) < 2.0;

    if (inTriggerRadius && nearestPortal.cooldownTimer <= 0 && targetPortal.cooldownTimer <= 0) {
      this.executeTeleport(nearestPortal, targetPortal, player, cameraController, hud, audioManager, subtitleSystem);
    }
  }

  private async executeTeleport(
    fromPortal: RunicPortal,
    toPortal: RunicPortal,
    player: PlayerController,
    cameraController: CameraController,
    hud: HUD,
    audioManager: AudioManager,
    subtitleSystem: SubtitleSystem
  ): Promise<void> {
    this.isTeleporting = true;
    console.log(`[PortalManager] Teleporting: ${fromPortal.id} -> ${toPortal.id}`);

    audioManager.playPortalTeleport();

    // Fast 0.2s magical flash (NO long 3-second black screens!)
    await hud.triggerTeleportFlash(220);

    // 1. Move Player smoothly to the destination Exit Point
    player.mesh.position.copy(toPortal.exitPoint);
    player.mesh.rotation.set(0, toPortal.exitYaw, 0);
    player.velocity.set(0, 0, 0);

    // 2. Camera snaps smoothly behind player looking out into the world
    cameraController.snapBehindTarget();

    // 3. Anti-Loop Protection: Set destination cooldown timer (0.8s)
    toPortal.cooldownTimer = 0.8;
    fromPortal.cooldownTimer = 0.8;

    // 4. Zero-Lag Handover: Full controls immediately active
    player.isControlsLocked = false;
    player.isMovementLocked = false;
    this.isTeleporting = false;

    subtitleSystem.show('Viaje Rúnico', `Has viajado hacia: ${toPortal.displayName}`, 1800);
  }
}
