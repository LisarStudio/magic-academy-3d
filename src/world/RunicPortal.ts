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
  templeStyle?: boolean;
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
  private energyRings: THREE.Mesh[] = [];
  private energyRingMaterials: THREE.MeshStandardMaterial[] = [];
  private runeOrbit: THREE.Group;
  private readonly templeStyle: boolean;

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
    this.templeStyle = !!config.templeStyle;

    this.mesh = new THREE.Group();
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotationY;
    this.mesh.name = `runic_portal_${this.id}`;

    if (this.templeStyle) {
      // The central sanctuary uses a floor-bound circular manifestation over
      // the existing yin-yang. It adds no steps or collision geometry, leaving
      // the original floor and its walking surface untouched.
      const inactiveGold = new THREE.MeshStandardMaterial({
        color: 0x9c7934, emissive: 0x674714, emissiveIntensity: 0.3,
        metalness: 0.82, roughness: 0.3, transparent: true, opacity: 0.38
      });
      const inactiveTeal = new THREE.MeshStandardMaterial({
        color: 0x247f79, emissive: 0x0b504e, emissiveIntensity: 0.26,
        metalness: 0.72, roughness: 0.32, transparent: true, opacity: 0.3
      });
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(3.18, 0.035, 8, 96), inactiveGold);
      outerRing.rotation.x = Math.PI / 2;
      outerRing.position.y = 0.018;
      this.mesh.add(outerRing);
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(2.72, 0.024, 8, 96), inactiveTeal);
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.y = 0.024;
      this.mesh.add(innerRing);
      this.energyRings.push(outerRing, innerRing);
      this.energyRingMaterials.push(inactiveGold, inactiveTeal);

      // A translucent, finely etched energy field becomes visible only when
      // activated; its disk stays inside the yin-yang's bronze perimeter.
      const fieldTexture = this.createTempleFieldTexture();
      this.vortexMat = new THREE.MeshStandardMaterial({
        map: fieldTexture, color: 0x9ee8d7, emissive: 0x0a6462,
        emissiveIntensity: this.isUnlocked ? 1.1 : 0.06,
        transparent: true, opacity: this.isUnlocked ? 0.64 : 0.015,
        side: THREE.DoubleSide, roughness: 0.24, metalness: 0.28,
        depthWrite: false
      });
      this.vortexMesh = new THREE.Mesh(new THREE.CircleGeometry(2.58, 96), this.vortexMat);
      this.vortexMesh.rotation.x = -Math.PI / 2;
      this.vortexMesh.position.y = 0.03;
      this.mesh.add(this.vortexMesh);

      // Floating runes orbit in the horizontal plane, not in a doorway.
      this.runeOrbit = new THREE.Group();
      this.runeOrbit.position.y = 0.12;
      const runeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdf87, emissive: 0xa66a1a,
        emissiveIntensity: this.isUnlocked ? 1.45 : 0.18,
        metalness: 0.62, roughness: 0.28
      });
      const runes = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.105, 0), runeMaterial, 12);
      const transform = new THREE.Object3D();
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        transform.position.set(Math.cos(angle) * 2.95, 0, Math.sin(angle) * 2.95);
        transform.rotation.set(0, angle, Math.PI / 4);
        transform.updateMatrix();
        runes.setMatrixAt(i, transform.matrix);
      }
      runes.instanceMatrix.needsUpdate = true;
      this.runeOrbit.add(runes);
      this.mesh.add(this.runeOrbit);

      const pGeo = new THREE.BufferGeometry();
      this.particlePositions = new Float32Array(this.particleCount * 3);
      for (let i = 0; i < this.particleCount; i++) {
        const angle = (i / this.particleCount) * Math.PI * 2;
        const radius = 0.45 + Math.random() * 1.8;
        this.particlePositions[i * 3] = Math.cos(angle) * radius;
        this.particlePositions[i * 3 + 1] = 0.16 + Math.random() * 0.52;
        this.particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
      this.particlesMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0x9fffe6, size: 0.075, transparent: true,
        opacity: this.isUnlocked ? 0.72 : 0.24,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      this.mesh.add(this.particlesMesh);
    } else {
    // ── 1. Architectural Stone Framework (existing non-temple portal) ──
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: config.templeStyle ? 0x54211b : 0x22262c,
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

    if (config.templeStyle) {
      // Lacquered eaves and a gold ridge tie this gate into the central temple
      // architecture while keeping its original portal frame and triggers.
      const eave = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.18, 1.5), darkStoneMat);
      eave.position.set(0, 4.84, 0);
      eave.castShadow = true;
      const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.14, 1.35), darkStoneMat);
      leftWing.position.set(-1.95, 4.75, 0);
      leftWing.rotation.z = -0.12;
      const rightWing = leftWing.clone();
      rightWing.position.x = 1.95;
      rightWing.rotation.z = 0.12;
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.13, 0.2), goldTrimMat);
      ridge.position.set(0, 4.98, 0);
      this.mesh.add(eave, leftWing, rightWing, ridge);
    }

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
    this.energyRingMaterials.push(innerRingMat);

    // Floating celestial bands give the old runic gate a distinctly mystical
    // silhouette while reusing the portal's existing animation/update loop.
    // Three modest rings cost three draws and no per-frame allocations.
    for (let i = 0; i < 2; i++) {
      const ringMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0xe9b94b : 0x42d9c4,
        emissive: i === 0 ? 0xb57920 : 0x087f85,
        emissiveIntensity: this.isUnlocked ? 1.15 : 0.08,
        metalness: 0.68,
        roughness: 0.3,
        transparent: true,
        opacity: this.isUnlocked ? 0.76 : 0.14,
        depthWrite: false
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(i === 0 ? 1.43 : 1.57, 0.025, 6, 32), ringMat);
      ring.position.set(0, 2.05, 0.02 + i * 0.015);
      ring.rotation.set(i === 0 ? 0.16 : -0.18, 0, i === 0 ? 0.23 : -0.2);
      this.mesh.add(ring);
      this.energyRings.push(ring);
      this.energyRingMaterials.push(ringMat);
    }

    // One instanced draw call for the orbiting celestial runes.
    this.runeOrbit = new THREE.Group();
    this.runeOrbit.position.set(0, 2.05, 0.08);
    const runeOrbit = new THREE.InstancedMesh(
      new THREE.OctahedronGeometry(0.095, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffdf87,
        emissive: 0xa66a1a,
        emissiveIntensity: this.isUnlocked ? 1.6 : 0.12,
        metalness: 0.55,
        roughness: 0.28
      }),
      8
    );
    const runeTransform = new THREE.Object3D();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      runeTransform.position.set(Math.cos(angle) * 1.36, Math.sin(angle) * 1.36, 0);
      runeTransform.rotation.z = angle;
      runeTransform.updateMatrix();
      runeOrbit.setMatrixAt(i, runeTransform.matrix);
    }
    runeOrbit.instanceMatrix.needsUpdate = true;
    this.runeOrbit.add(runeOrbit);
    this.mesh.add(this.runeOrbit);

    // Small gold celestial pearl crowns the lintel and links it to the temple.
    const pearl = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.16, 1),
      new THREE.MeshStandardMaterial({ color: 0xffd878, emissive: 0x9d5a12, emissiveIntensity: 0.75, metalness: 0.6, roughness: 0.25 })
    );
    pearl.position.set(0, 4.98, 0.2);
    this.mesh.add(pearl);

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
    }

    scene.add(this.mesh);
  }

  private createTempleFieldTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const center = 128;
    const glow = ctx.createRadialGradient(center, center, 4, center, center, 126);
    glow.addColorStop(0, 'rgba(57,210,190,0.14)');
    glow.addColorStop(0.58, 'rgba(24,156,150,0.20)');
    glow.addColorStop(0.88, 'rgba(205,165,77,0.22)');
    glow.addColorStop(1, 'rgba(13,67,77,0.02)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(center, center, 18 + i * 15, 0, Math.PI * 2);
      ctx.strokeStyle = i % 2 ? 'rgba(66,222,200,0.28)' : 'rgba(255,211,113,0.3)';
      ctx.lineWidth = i % 3 === 0 ? 2 : 1;
      ctx.stroke();
    }
    // Fine curved traces make the field read as flowing water when the disk turns.
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(center, center, 42 + (i % 6) * 11, angle, angle + 0.42);
      ctx.strokeStyle = i % 2 ? 'rgba(128,255,224,0.34)' : 'rgba(255,222,142,0.3)';
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
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
    const runeColor = this.templeStyle
      ? (progress > 0.5 ? 0x55e8cc : 0x4a3718)
      : (progress > 0.5 ? 0x00e5ff : 0x004466);

    for (const mat of this.runeMaterials) {
      mat.emissive.setHex(runeColor);
      mat.emissiveIntensity = emissiveIntensity;
    }

    this.vortexMat.emissive.setHex(this.templeStyle ? 0x128f7d : (progress > 0.5 ? 0x00d4ff : 0x001122));
    this.vortexMat.emissiveIntensity = THREE.MathUtils.lerp(this.templeStyle ? 0.06 : 0.08, this.templeStyle ? 1.15 : 1.8, progress);
    this.vortexMat.opacity = THREE.MathUtils.lerp(this.templeStyle ? 0.015 : 0.06, this.templeStyle ? 0.64 : 0.82, progress);

    for (let i = 0; i < this.energyRingMaterials.length; i++) {
      const mat = this.energyRingMaterials[i];
      mat.emissiveIntensity = THREE.MathUtils.lerp(this.templeStyle ? 0.22 : 0.08, i === 0 ? (this.templeStyle ? 1.65 : 1.7) : (this.templeStyle ? 1.35 : 1.15), progress);
      mat.opacity = THREE.MathUtils.lerp(this.templeStyle ? 0.3 : 0.12, this.templeStyle ? 0.92 : 0.78, progress);
    }
    const runes = this.runeOrbit.children[0] as THREE.InstancedMesh;
    (runes.material as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.lerp(0.12, 1.6, progress);

    const pMat = this.particlesMesh.material as THREE.PointsMaterial;
    pMat.opacity = THREE.MathUtils.lerp(this.templeStyle ? 0.24 : 0.0, this.templeStyle ? 0.8 : 0.85, progress);
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

    // A few quiet motes drift above the yin-yang even before activation.
    // Keep this on the portal's existing update loop and reuse its buffer.
    if (this.templeStyle && !this.isUnlocked && !this.isActivating) {
      this.runeOrbit.rotation.y = Math.sin(time * 0.22) * 0.025;
      for (let i = 0; i < this.particleCount; i++) {
        const angle = (i / this.particleCount) * Math.PI * 2 + time * 0.12;
        const radius = 0.55 + ((i * 7) % 10) * 0.18;
        this.particlePositions[i * 3] = Math.cos(angle) * radius;
        this.particlePositions[i * 3 + 1] = 0.15 + (0.5 + 0.5 * Math.sin(time * 0.7 + i)) * 0.42;
        this.particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      this.particlesMesh.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Active Pulsing Energy Shader & Particles
    if (this.isUnlocked) {
      const pulse = Math.sin(time * 3.0) * 0.35 + 1.85;
      for (let i = 0; i < this.runeMaterials.length; i++) {
        // Subtle offset wave along glyphs
        const wave = Math.sin(time * 3.5 + i * 0.45) * 0.3;
        this.runeMaterials[i].emissiveIntensity = pulse + wave;
      }

      this.vortexMat.emissiveIntensity = (this.templeStyle ? 1.05 : 1.4) + Math.sin(time * 2.5) * (this.templeStyle ? 0.18 : 0.3);
      if (this.templeStyle) {
        this.vortexMesh.rotation.z += delta * 0.035;
        this.energyRings[0].rotation.z += delta * 0.12;
        this.energyRings[1].rotation.z -= delta * 0.08;
        this.runeOrbit.rotation.y += delta * 0.14;
      } else {
        this.energyRings[0].rotation.z += delta * 0.16;
        this.energyRings[1].rotation.z -= delta * 0.11;
        this.runeOrbit.rotation.z += delta * 0.2;
      }

      // Swirl particles in vertical elliptical orbit
      const pArr = this.particlePositions;
      for (let i = 0; i < this.particleCount; i++) {
        const speed = 1.4 + (i % 3) * 0.3;
        const currentAngle = time * speed + (i / this.particleCount) * Math.PI * 2;
        const radX = 0.5 + ((i * 7) % 10) * 0.05;
        const radY = 0.9 + ((i * 5) % 10) * 0.04;
        if (this.templeStyle) {
          const angle = currentAngle * 0.42;
          const radius = 0.55 + ((i * 7) % 10) * 0.18;
          pArr[i * 3] = Math.cos(angle) * radius;
          pArr[i * 3 + 1] = 0.12 + Math.abs(Math.sin(currentAngle)) * 0.62;
          pArr[i * 3 + 2] = Math.sin(angle) * radius;
        } else {
          pArr[i * 3] = Math.cos(currentAngle) * radX;
          pArr[i * 3 + 1] = 2.05 + Math.sin(currentAngle) * radY;
          pArr[i * 3 + 2] = Math.sin(currentAngle * 2.0) * 0.15;
        }
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
      hud.showInteractionPrompt(hud.isTouchDevice() ? `Activar ${nearestPortal.displayName} · Acción` : `Activar ${nearestPortal.displayName} [E]`);

      if (inputManager.consumeInteractPress()) {
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
