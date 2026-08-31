import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ALIVE → PATROL/CHASE/ATTACK → FLIPPED/STUNNED → DYING → DEAD
// STUNNED and FLIPPED both accept damage (not immune).
// Only DYING and DEAD block damage — that's the crash guard.
export type EnemyState = 'IDLE' | 'PATROL' | 'CHASE' | 'ATTACK' | 'STUNNED' | 'FLIPPED' | 'DYING' | 'DEAD';

export class EnemyController {
  public mesh: THREE.Group;
  public state: EnemyState = 'IDLE';
  public health = 3;
  public maxHealth = 3;
  public id: string;
  public isDead = false;
  public isPaused = false;
  public arenaCenter: THREE.Vector3 | null = null;
  public arenaRadius = 15.0;

  public patrolWaypoints: THREE.Vector3[] = [];
  private currentWaypointIndex = 0;
  private moveSpeed = 2.0;
  private chaseSpeed = 3.5;
  private detectionRadius = 10.0;
  private attackRadius = 1.8;

  private stunTimer = 0;
  private hitFlashTimer = 0;
  private knockbackVelocity = new THREE.Vector3();

  private crabModel: THREE.Object3D | null = null;
  private proceduralTime = 0;
  private attackCooldown = 0;

  // Death VFX state
  private dyingTimer = 0;
  private dyingDuration = 0.65; // Total death sequence duration
  private deathVfxSpawned = false;
  private dyingScaleStart = 1.0;
  private scene: THREE.Scene | null = null; // Set externally for VFX

  // Boss Battle variables
  private bossChargeTimer = 0;
  private bossLungeTimer = 0;
  private bossLungeDir = new THREE.Vector3();

  public onAttackPlayer?: (damage: number) => void;
  public onDeath?: (enemy: EnemyController) => void;

  // Shared Master GLTF Template & Texture Pool
  private static masterTemplate: THREE.Object3D | null = null;
  private static masterPromise: Promise<THREE.Object3D | null> | null = null;
  private static sharedSwordTexture: THREE.CanvasTexture | null = null;

  // Reusable static vectors to eliminate per-frame allocations
  private static readonly TEMP_ORIGIN = new THREE.Vector3();
  private static readonly TEMP_DOWN = new THREE.Vector3(0, -1, 0);
  private static readonly TEMP_DIR = new THREE.Vector3();
  private static readonly TEMP_NORM = new THREE.Vector3();

  // Cached materials for zero-traverse hit flash
  private meshMaterials: THREE.MeshStandardMaterial[] = [];
  private proceduralMeshes: THREE.Object3D[] = [];

  // Procedural legs for spider-crab animation
  private legs: THREE.Object3D[] = [];

  constructor(id: string, startPos: THREE.Vector3, waypoints: THREE.Vector3[] = []) {
    this.id = id;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(startPos);
    this.patrolWaypoints = waypoints.length > 0 ? waypoints : [startPos.clone()];
    this.createProceduralCrab();
  }

  public isAlive(): boolean {
    return this.state !== 'DYING' && this.state !== 'DEAD' && !this.isDead && this.health > 0;
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  public setScene(scene: THREE.Scene): void {
    this.scene = scene;
  }

  public static async preloadMasterTemplate(): Promise<void> {
    if (this.masterTemplate || this.masterPromise) return;
    this.masterPromise = (async () => {
      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/enemies/crab.glb');
        const model = gltf.scene;

        const bbox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0.001 ? (0.8 / maxDim) : 1.0;
        model.scale.setScalar(scale);
        model.updateMatrixWorld(true);

        const scaledBBox = new THREE.Box3().setFromObject(model);
        model.position.set(0, -scaledBBox.min.y, 0);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        this.masterTemplate = model;
        console.log('[EnemyController] ✅ Master crab.glb template cached successfully');
        return model;
      } catch (err) {
        console.warn('[EnemyController] Could not preload master crab.glb template', err);
        return null;
      }
    })();
    await this.masterPromise;
  }

  public async loadModel(scaleMultiplier = 1.0): Promise<void> {
    try {
      if (!EnemyController.masterTemplate) {
        await EnemyController.preloadMasterTemplate();
      }

      if (!EnemyController.masterTemplate) return;

      const model = EnemyController.masterTemplate.clone(true);
      if (scaleMultiplier !== 1.0) {
        model.scale.multiplyScalar(scaleMultiplier);
        const scaledBBox = new THREE.Box3().setFromObject(model);
        model.position.set(0, -scaledBBox.min.y, 0);
      }

      // Remove redundant procedural placeholder meshes to save memory and draw calls
      for (const pMesh of this.proceduralMeshes) {
        this.mesh.remove(pMesh);
      }
      this.proceduralMeshes = [];

      this.crabModel = model;
      this.mesh.add(model);

      this.legs = [];
      this.meshMaterials = [];
      model.traverse((child) => {
        const n = child.name.toLowerCase();
        if (n.includes('leg') || n.includes('arm') || n.includes('claw') || n.includes('limb')) {
          this.legs.push(child);
        }
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material;
          if (Array.isArray(mat)) {
            this.meshMaterials.push(...(mat as THREE.MeshStandardMaterial[]));
          } else {
            this.meshMaterials.push(mat as THREE.MeshStandardMaterial);
          }
        }
      });

      this.initCombatSwordIcon();
      console.log(`[EnemyController] Cloned master crab template for '${this.id}' (${this.legs.length} leg nodes, scale: ${scaleMultiplier})`);
    } catch (err) {
      console.warn(`[EnemyController] Could not instantiate crab model for '${this.id}'`, err);
    }
  }

  private combatSprite: THREE.Sprite | null = null;

  private initCombatSwordIcon(): void {
    if (!EnemyController.sharedSwordTexture) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw glowing red circular badge with gold border
        ctx.beginPath();
        ctx.arc(64, 64, 52, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 20, 20, 0.88)';
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#ffd700';
        ctx.stroke();

        // Draw crossed swords ⚔️ emoji icon
        ctx.font = 'bold 60px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚔️', 64, 66);

        EnemyController.sharedSwordTexture = new THREE.CanvasTexture(canvas);
      }
    }

    if (EnemyController.sharedSwordTexture) {
      const spriteMat = new THREE.SpriteMaterial({
        map: EnemyController.sharedSwordTexture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
      });
      this.combatSprite = new THREE.Sprite(spriteMat);
      const iconHeight = this.id === 'crab_boss' ? 2.5 : 0.85;
      const iconScale = this.id === 'crab_boss' ? 1.4 : 0.65;
      this.combatSprite.position.set(0, iconHeight, 0);
      this.combatSprite.scale.set(iconScale, iconScale, 1);
      this.combatSprite.visible = false;
      this.mesh.add(this.combatSprite);
    }
  }

  private createProceduralCrab(): void {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x8b2500, roughness: 0.6, metalness: 0.3 });
    const legMat  = new THREE.MeshStandardMaterial({ color: 0x6b1d00, roughness: 0.7 });
    const eyeMat  = new THREE.MeshBasicMaterial({ color: 0xff3333 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 8), bodyMat);
    body.scale.set(1.2, 0.6, 1.0);
    body.position.y = 0.24;
    body.castShadow = true;
    body.name = 'crab_body';
    this.mesh.add(body);
    this.proceduralMeshes.push(body);
    this.meshMaterials.push(bodyMat);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
    eyeL.position.set(-0.15, 0.5, 0.3);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
    eyeR.position.set(0.15, 0.5, 0.3);
    this.mesh.add(eyeL, eyeR);
    this.proceduralMeshes.push(eyeL, eyeR);

    this.legs = [];
    for (let i = 0; i < 6; i++) {
      const side = i < 3 ? -1 : 1;
      const idx = i % 3;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.5, 6), legMat);
      leg.position.set(side * (0.35 + idx * 0.1), 0.1, -0.15 + idx * 0.15);
      leg.rotation.z = side * 0.6;
      leg.name = `leg_${i}`;
      this.mesh.add(leg);
      this.legs.push(leg);
      this.proceduralMeshes.push(leg);
    }
    this.meshMaterials.push(legMat);

    const clawGeo = new THREE.BoxGeometry(0.15, 0.06, 0.2);
    const clawL = new THREE.Mesh(clawGeo, bodyMat);
    clawL.position.set(-0.55, 0.25, 0.3);
    clawL.name = 'claw_L';
    const clawR = new THREE.Mesh(clawGeo, bodyMat);
    clawR.position.set(0.55, 0.25, 0.3);
    clawR.name = 'claw_R';
    this.mesh.add(clawL, clawR);
    this.legs.push(clawL, clawR);
    this.proceduralMeshes.push(clawL, clawR);
  }

  private safeNormalize(vec: THREE.Vector3, fallback = new THREE.Vector3(0, 0, 1)): THREE.Vector3 {
    const lenSq = vec.lengthSq();
    if (lenSq > 0.000001) vec.divideScalar(Math.sqrt(lenSq));
    else vec.copy(fallback);
    return vec;
  }

  // ─────────────────────────────────────────────────────────────────
  // takeHit — STUNNED/FLIPPED accept damage, DYING/DEAD are immune
  // ─────────────────────────────────────────────────────────────────
  public takeHit(fromPos?: THREE.Vector3, damageAmount: number = 1): void {
    // Only block if already dying or dead
    if (this.state === 'DYING' || this.state === 'DEAD') return;

    if (this.id === 'crab_boss') {
      this.health = Math.max(0, this.health - damageAmount);
      this.hitFlashTimer = 0.35;
      console.log(`[Boss] Hit with damage ${damageAmount}! HP: ${this.health}/${this.maxHealth}`);

      if (fromPos) {
        EnemyController.TEMP_DIR.subVectors(this.mesh.position, fromPos);
        EnemyController.TEMP_DIR.y = 0;
        this.safeNormalize(EnemyController.TEMP_DIR);
        this.mesh.position.addScaledVector(EnemyController.TEMP_DIR, 0.6);
      }

      if (this.health <= 0) {
        this.triggerDeath();
      } else {
        // Enrage and prepare counter attack!
        this.state = 'ATTACK';
        this.bossChargeTimer = 0.4;
      }
      return;
    }

    // Regular crabs — accept damage in ANY non-dying state
    this.health = Math.max(0, this.health - damageAmount);
    this.hitFlashTimer = 0.25;
    console.log(`[Enemy ${this.id}] Hit with damage ${damageAmount}! HP: ${this.health}/${this.maxHealth}`);

    if (this.health <= 0) {
      this.triggerDeath();
      return;
    }

    // Knockback + FLIPPED
    if (fromPos) {
      EnemyController.TEMP_DIR.subVectors(this.mesh.position, fromPos);
      EnemyController.TEMP_DIR.y = 0;
      this.safeNormalize(EnemyController.TEMP_DIR);
      this.knockbackVelocity.copy(EnemyController.TEMP_DIR).multiplyScalar(6.5);
    } else {
      EnemyController.TEMP_DIR.set(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y);
      this.knockbackVelocity.copy(EnemyController.TEMP_DIR).multiplyScalar(-3.0);
    }

    this.state = 'FLIPPED';
    this.stunTimer = 2.5;
    console.log(`[Enemy ${this.id}] FLIPPED!`);
  }

  // ─────────────────────────────────────────────────────────────────
  // triggerDeath — called ONCE, idempotent via DYING guard
  // ─────────────────────────────────────────────────────────────────
  private triggerDeath(): void {
    if (this.state === 'DYING' || this.state === 'DEAD') return; // Double-fire guard

    this.state = 'DYING';
    this.isDead = true;
    this.hitFlashTimer = 0;
    this.dyingTimer = this.dyingDuration;
    this.dyingScaleStart = this.mesh.scale.x;
    this.deathVfxSpawned = false;

    // Disable AI immediately
    this.knockbackVelocity.set(0, 0, 0);
    this.onAttackPlayer = undefined;

    // Fire death callback ONCE, then nullify
    const cb = this.onDeath;
    this.onDeath = undefined;
    console.log(`[Enemy ${this.id}] DYING — triggering death sequence`);

    // Small upward impulse for "pop" feel
    this.mesh.position.y += 0.05;

    cb?.(this);
  }

  // ─────────────────────────────────────────────────────────────────
  // Spawn Nintendo-style death explosion VFX
  // ─────────────────────────────────────────────────────────────────
  private spawnDeathVFX(): void {
    if (!this.scene) return;
    const origin = this.mesh.position.clone().add(new THREE.Vector3(0, 0.35, 0));

    // ── 1. Burst Flash (bright sphere that expands and fades) ──
    const flashGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });
    const flash = new THREE.Mesh(flashGeo, flashMat);
    flash.position.copy(origin);
    this.scene.add(flash);

    // ── 2. Expanding shockwave ring ──
    const ringGeo = new THREE.RingGeometry(0.1, 0.45, 16);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(origin);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);

    // ── 3. Geometric fragment shards ──
    const shardCount = 8;
    const shardMeshes: THREE.Mesh[] = [];
    const shardPositions: THREE.Vector3[] = [];
    const shardVelocities: THREE.Vector3[] = [];
    const colors = [0xff4400, 0xff8800, 0xffcc00, 0x882200];

    for (let i = 0; i < shardCount; i++) {
      const size = 0.06 + Math.random() * 0.07;
      const geo = Math.random() > 0.5 ? new THREE.BoxGeometry(size, size, size) : new THREE.TetrahedronGeometry(size);
      const angle = (i / shardCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 2.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        2.5 + Math.random() * 3.5,
        Math.sin(angle) * speed,
      );
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 1.0,
        depthWrite: false,
      });
      const shard = new THREE.Mesh(geo, mat);
      shard.position.copy(origin);
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      this.scene.add(shard);
      shardMeshes.push(shard);
      shardPositions.push(origin.clone());
      shardVelocities.push(vel);
    }

    // ── 4. Smoke puff (3 large translucent spheres) ──
    const smokeCount = 3;
    const smokeMeshes: THREE.Mesh[] = [];
    const smokeVels: THREE.Vector3[] = [];
    for (let i = 0; i < smokeCount; i++) {
      const sGeo = new THREE.SphereGeometry(0.18, 6, 6);
      const sMat = new THREE.MeshBasicMaterial({
        color: 0xccccaa,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const smoke = new THREE.Mesh(sGeo, sMat);
      smoke.position.copy(origin).addScaledVector(
        new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.5, Math.random() - 0.5).normalize(),
        0.15,
      );
      this.scene.add(smoke);
      smokeMeshes.push(smoke);
      smokeVels.push(new THREE.Vector3((Math.random() - 0.5) * 1.2, 0.8 + Math.random() * 0.6, (Math.random() - 0.5) * 1.2));
    }

    // ── Animate all VFX ──
    let age = 0;
    const totalDuration = 0.65;
    const gravity = -6.0;

    const animate = () => {
      try {
        age += 0.016;
        const t = age / totalDuration;
        const tClamped = Math.min(1.0, t);

        // Flash: expand fast, fade
        flash.scale.setScalar(1.0 + tClamped * 7.0);
        (flashMat as THREE.MeshBasicMaterial).opacity = Math.max(0, 1.0 - tClamped * 2.5);

        // Ring: expand outward, fade
        const ringScale = 1.0 + tClamped * 12.0;
        ring.scale.setScalar(ringScale);
        (ringMat as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 - tClamped * 1.8);

        // Shards
        for (let i = 0; i < shardMeshes.length; i++) {
          const vel = shardVelocities[i];
          vel.y += gravity * 0.016;
          shardMeshes[i].position.addScaledVector(vel, 0.016);
          shardMeshes[i].rotation.x += 0.1;
          shardMeshes[i].rotation.z += 0.08;
          const shardFade = Math.max(0, 1.0 - Math.max(0, (t - 0.35) / 0.65));
          (shardMeshes[i].material as THREE.MeshBasicMaterial).opacity = shardFade;
        }

        // Smoke
        for (let i = 0; i < smokeMeshes.length; i++) {
          smokeMeshes[i].position.addScaledVector(smokeVels[i], 0.016);
          smokeMeshes[i].scale.addScalar(0.016 * 2.5);
          const smokeFade = Math.max(0, 0.55 - tClamped * 0.9);
          (smokeMeshes[i].material as THREE.MeshBasicMaterial).opacity = smokeFade;
        }

        if (age < totalDuration + 0.1) {
          requestAnimationFrame(animate);
        } else {
          // Safe scene removal
          if (this.scene) {
            this.scene.remove(flash);
            this.scene.remove(ring);
            shardMeshes.forEach(s => this.scene?.remove(s));
            smokeMeshes.forEach(s => this.scene?.remove(s));
          }
        }
      } catch (err) {
        console.warn('[EnemyController] VFX cleanup safe catch:', err);
      }
    };
    requestAnimationFrame(animate);
  }

  private groundRaycaster = new THREE.Raycaster();

  public update(delta: number, playerPos: THREE.Vector3, colliders?: THREE.Object3D[]): void {
    if (this.isPaused) return;
    // Fully dead and sequence done — skip
    if (this.state === 'DEAD') return;

    this.proceduralTime += delta * 6;

    // ── DYING sequence ──
    if (this.state === 'DYING') {
      // Spawn VFX on first frame of dying
      if (!this.deathVfxSpawned) {
        this.deathVfxSpawned = true;
        this.spawnDeathVFX();
        console.log(`[Enemy ${this.id}] Entering DYING — defeat sequence started`);
      }

      this.dyingTimer -= delta;

      if (this.id === 'crab_boss') {
        // Boss Defeat Pose: falls upside down onto back, remains VISUALLY PRESENT on arena floor
        this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, Math.PI, delta * 5.0);
        this.mesh.visible = true; // Remained present for cinematic!
        if (this.dyingTimer <= 0) {
          this.state = 'DEAD';
          this.isDead = true;
          console.log(`[BOSS] Death sequence completed — lying defeated on floor`);
        }
        return;
      }

      // Regular crabs: squash, spin, shrink safely
      const t = Math.max(0, this.dyingTimer / this.dyingDuration); // 1→0
      const phase1 = Math.min(1, (1 - t) * 3);
      const squashY = Math.max(0.1, 1.0 - phase1 * 0.6);
      const squashXZ = Math.max(0.1, 1.0 + phase1 * 0.3);
      const shrink = Math.max(0.01, t);
      this.mesh.scale.set(
        Math.max(0.01, this.dyingScaleStart * squashXZ * shrink),
        Math.max(0.01, this.dyingScaleStart * squashY * shrink),
        Math.max(0.01, this.dyingScaleStart * squashXZ * shrink),
      );
      this.mesh.rotation.y += delta * 8.0;
      this.mesh.rotation.z += delta * 5.0;

      if (this.dyingTimer <= 0) {
        this.mesh.visible = false;
        this.state = 'DEAD';
        this.isDead = true;
      }
      return;
    }

    // ── Fast O(1) Hit flash without expensive hierarchy traversal ──
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      for (let i = 0; i < this.meshMaterials.length; i++) {
        if (this.meshMaterials[i].emissive) this.meshMaterials[i].emissive.setHex(0xff2200);
      }
    } else if (this.meshMaterials.length > 0) {
      for (let i = 0; i < this.meshMaterials.length; i++) {
        if (this.meshMaterials[i].emissive && this.meshMaterials[i].emissive.getHex() !== 0x000000) {
          this.meshMaterials[i].emissive.setHex(0x000000);
        }
      }
    }

    const distToPlayer = Math.hypot(this.mesh.position.x - playerPos.x, this.mesh.position.z - playerPos.z);

    // ── Ground Snapping (Slabs, Stairs, and Terrain with Normal Validation) ──
    const isSelfChild = (obj: THREE.Object3D): boolean => {
      let curr: THREE.Object3D | null = obj;
      while (curr) {
        if (curr === this.mesh) return true;
        curr = curr.parent;
      }
      return false;
    };

    const levelInst = (window as any).gameInstance?.level01;
    let targetGroundY = levelInst ? levelInst.getTerrainHeight(this.mesh.position.x, this.mesh.position.z) : 0.0;

    // Distance Culling Optimization: Only raycast colliders if enemy is within 35m of player
    if (distToPlayer <= 35.0 && colliders && colliders.length > 0) {
      EnemyController.TEMP_ORIGIN.set(this.mesh.position.x, this.mesh.position.y + 1.2, this.mesh.position.z);
      this.groundRaycaster.set(EnemyController.TEMP_ORIGIN, EnemyController.TEMP_DOWN);
      this.groundRaycaster.far = 4.0;
      const rawHits = this.groundRaycaster.intersectObjects(colliders, true);
      for (const hit of rawHits) {
        if (isSelfChild(hit.object)) continue;
        if (!hit.face) continue;
        EnemyController.TEMP_NORM.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
        // Valid floor slab or terrain must be walkable and vertically accessible
        if (EnemyController.TEMP_NORM.y >= 0.45 && hit.point.y <= this.mesh.position.y + 0.8 && hit.point.y >= this.mesh.position.y - 2.5) {
          targetGroundY = hit.point.y;
          break;
        }
      }
    }

    if (this.id === 'crab_boss') {
      targetGroundY = 0.2; // Perfectly flush on the Sand Arena floor
    } else {
      // Ensure regular crabs NEVER enter the Boss Arena
      const distToArena = Math.hypot(this.mesh.position.x - 45, this.mesh.position.z - (-40));
      if (distToArena < 16.5) {
        const pushDir = new THREE.Vector3(this.mesh.position.x - 45, 0, this.mesh.position.z - (-40)).normalize();
        this.mesh.position.x = 45 + pushDir.x * 17.2;
        this.mesh.position.z = -40 + pushDir.z * 17.2;
        this.state = 'PATROL';
      }
    }

    if (this.state === 'FLIPPED') targetGroundY += 0.15;
    this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, targetGroundY, delta * 15);

    if (this.state !== 'FLIPPED') {
      this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, 0, delta * 8);
    }

    // ── Update 3D Crossed-Swords Combat Icon (⚔️) ──
    if (this.combatSprite) {
      if (this.isAlive() && distToPlayer < 8.0) {
        this.combatSprite.visible = true;
        const pulse = 1.0 + Math.sin(this.proceduralTime * 3.5) * 0.12;
        const baseScale = this.id === 'crab_boss' ? 1.4 : 0.65;
        this.combatSprite.scale.set(baseScale * pulse, baseScale * pulse, 1);
      } else {
        this.combatSprite.visible = false;
      }
    }

    // ── Boss arena constraint ──
    if (this.arenaCenter) {
      const playerDistToArena = playerPos.distanceTo(this.arenaCenter);
      if (playerDistToArena > this.arenaRadius) {
        // Player is outside arena -> Boss stays passively idle waiting at arena center!
        this.state = 'IDLE';
        this.mesh.position.set(this.arenaCenter.x, 0.2, this.arenaCenter.z);
        this.mesh.rotation.set(0, 0, 0);
        return;
      }

      // Constrain Boss inside circular sand arena
      const bossDistToCenter = Math.hypot(this.mesh.position.x - this.arenaCenter.x, this.mesh.position.z - this.arenaCenter.z);
      if (bossDistToCenter > 13.0) {
        const clampDir = new THREE.Vector3(this.mesh.position.x - this.arenaCenter.x, 0, this.mesh.position.z - this.arenaCenter.z).normalize();
        this.mesh.position.x = this.arenaCenter.x + clampDir.x * 12.8;
        this.mesh.position.z = this.arenaCenter.z + clampDir.z * 12.8;
      }
    }

    switch (this.state) {
      case 'FLIPPED':
        this.stunTimer -= delta;
        if (this.knockbackVelocity.lengthSq() > 0.01) {
          this.mesh.position.addScaledVector(this.knockbackVelocity, delta);
          this.knockbackVelocity.multiplyScalar(Math.exp(-4.0 * delta));
        }
        this.mesh.rotation.z = THREE.MathUtils.lerp(this.mesh.rotation.z, Math.PI, delta * 8);
        this.proceduralTime += delta * 15;
        for (let i = 0; i < this.legs.length; i++) {
          const phase = i * 0.8;
          this.legs[i].rotation.x = Math.sin(this.proceduralTime + phase) * 0.45;
          this.legs[i].rotation.z = Math.cos(this.proceduralTime + phase) * 0.45;
        }
        if (this.stunTimer <= 0) {
          this.state = 'CHASE';
          for (let i = 0; i < this.legs.length; i++) {
            this.legs[i].rotation.x = 0;
            this.legs[i].rotation.z = 0;
          }
        }
        break;

      case 'STUNNED':
        this.stunTimer -= delta;
        this.mesh.rotation.z = Math.sin(this.proceduralTime * 4) * 0.25;
        for (let i = 0; i < this.legs.length; i++) {
          this.legs[i].rotation.x = Math.sin(this.proceduralTime + i) * 0.5;
        }
        if (this.stunTimer <= 0) {
          this.state = 'CHASE';
          this.mesh.rotation.z = 0;
          for (let i = 0; i < this.legs.length; i++) this.legs[i].rotation.x = 0;
        }
        break;

      case 'IDLE':
      case 'PATROL':
        if (distToPlayer <= this.detectionRadius) {
          this.state = 'CHASE';
        } else {
          this.patrolBehavior(delta);
        }
        break;

      case 'CHASE':
        if (distToPlayer <= (this.id === 'crab_boss' ? 4.8 : this.attackRadius)) {
          this.state = 'ATTACK';
        } else if (distToPlayer > this.detectionRadius * 2) {
          this.state = 'PATROL';
        } else {
          this.chaseBehavior(delta, playerPos);
        }
        break;

      case 'ATTACK':
        if (this.id === 'crab_boss') {
          if (this.bossChargeTimer > 0) {
            this.bossChargeTimer -= delta;
            this.mesh.rotation.y += Math.sin(performance.now() * 0.05) * 0.1;
            this.hitFlashTimer = 0.05;
            if (this.bossChargeTimer <= 0) {
              this.bossLungeTimer = 0.6;
              this.bossLungeDir.subVectors(playerPos, this.mesh.position);
              this.bossLungeDir.y = 0;
              this.safeNormalize(this.bossLungeDir);
              this.mesh.rotation.y = Math.atan2(this.bossLungeDir.x, this.bossLungeDir.z);
            }
          } else if (this.bossLungeTimer > 0) {
            this.bossLungeTimer -= delta;
            this.mesh.position.addScaledVector(this.bossLungeDir, 14.0 * delta);
            if (distToPlayer < 3.2) {
              this.onAttackPlayer?.(25);
              this.bossLungeTimer = 0;
            }
            if (this.bossLungeTimer <= 0) {
              this.state = 'STUNNED';
              this.stunTimer = 3.0;
            }
          } else {
            this.bossChargeTimer = 0.8;
          }
        } else {
          // Normal crabs: Keep tracking player, maintain clean combat margin (1.35m - 1.85m)
          const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
          dir.y = 0;
          this.safeNormalize(dir);
          this.mesh.rotation.y = Math.atan2(dir.x, dir.z);

          const minCombatMargin = 1.35;
          const maxAttackRange = 2.4;

          if (distToPlayer > maxAttackRange) {
            // Player retreated -> switch back to CHASE
            this.state = 'CHASE';
          } else if (distToPlayer < minCombatMargin) {
            // Player or crab got too close -> step back to maintain striking distance
            this.mesh.position.addScaledVector(dir, -this.moveSpeed * 1.2 * delta);
          } else if (distToPlayer > minCombatMargin + 0.35) {
            // Approach slowly to reach ideal strike zone
            this.mesh.position.addScaledVector(dir, this.chaseSpeed * 0.4 * delta);
          }

          // Active pinch attack while in range
          if (distToPlayer <= maxAttackRange) {
            this.attackCooldown -= delta;
            if (this.attackCooldown <= 0) {
              this.attackCooldown = 1.1;
              console.log(`[Enemy ${this.id}] 💥 Crab Pinched Player! (dist: ${distToPlayer.toFixed(2)}m)`);
              this.onAttackPlayer?.(12);
            }
          }
        }
        break;
    }

    this.animateLegs(delta);
  }

  private animateLegs(_delta: number): void {
    if (this.state === 'FLIPPED' || this.state === 'DYING' || this.state === 'DEAD') return;
    const isMoving = this.state === 'CHASE' || this.state === 'PATROL' || this.state === 'ATTACK';
    const legSpeed = this.state === 'CHASE' ? 12 : 6;
    for (let i = 0; i < this.legs.length; i++) {
      const leg = this.legs[i];
      if (isMoving) {
        const phase = (i % 2 === 0) ? 0 : Math.PI;
        leg.rotation.x = Math.sin(this.proceduralTime * legSpeed + phase + i * 0.8) * 0.4;
      } else {
        leg.rotation.x = Math.sin(this.proceduralTime * 1.5 + i * 0.5) * 0.05;
      }
    }
    if (isMoving && this.crabModel) {
      this.crabModel.position.y = Math.abs(Math.sin(this.proceduralTime * 8)) * 0.03;
    }
  }

  private patrolBehavior(delta: number): void {
    if (this.patrolWaypoints.length === 0) return;
    const target = this.patrolWaypoints[this.currentWaypointIndex];
    const dist = this.mesh.position.distanceTo(target);
    if (dist < 0.5) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
    } else {
      const dir = new THREE.Vector3().subVectors(target, this.mesh.position);
      dir.y = 0;
      this.safeNormalize(dir);
      this.mesh.position.addScaledVector(dir, this.moveSpeed * delta);
      this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
    }
  }

  private chaseBehavior(delta: number, playerPos: THREE.Vector3): void {
    const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
    dir.y = 0;
    const dist = dir.length();
    this.safeNormalize(dir);
    this.mesh.rotation.y = Math.atan2(dir.x, dir.z);

    const minMargin = this.id === 'crab_boss' ? 3.6 : 1.40;
    if (dist > minMargin) {
      this.mesh.position.addScaledVector(dir, this.chaseSpeed * delta);
    } else if (dist < minMargin - 0.15) {
      // Step back to keep respectful combat spacing
      this.mesh.position.addScaledVector(dir, -this.moveSpeed * delta);
    }

    // Enforce terrain grounding height per-frame for enemy feet
    const level = (window as any).gameInstance?.level01;
    if (level && level.getTerrainHeight) {
      const terrainY = level.getTerrainHeight(this.mesh.position.x, this.mesh.position.z);
      if (this.id === 'crab_boss') {
        this.mesh.position.y = terrainY + 0.1;
      } else if (this.mesh.position.y < terrainY) {
        this.mesh.position.y = terrainY;
      }
    }
  }

  public dispose(): void {
    this.isDead = true;
    this.state = 'DEAD';
    this.mesh.visible = false;
    this.onDeath = undefined;
    this.onAttackPlayer = undefined;
  }
}
