import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ALIVE → PATROL/CHASE/ATTACK → FLIPPED/STUNNED → DYING → DEAD
// STUNNED and FLIPPED both accept damage (not immune).
// DYING, DISSOLVING, DEAD and DEFEATED block damage — that's the crash guard.
export type EnemyState = 'IDLE' | 'PATROL' | 'CHASE' | 'ATTACK' | 'STUNNED' | 'FLIPPED' | 'DYING' | 'DISSOLVING' | 'DEAD' | 'DEFEATED';

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
  /** Crypt-only grounding: the chamber floor is below the outdoor terrain plane. */
  public groundHeightOverride: number | null = null;
  /** Optional validated walkable surfaces; prevents ceiling/roof hits for crypt enemies. */
  public groundSnapSurfaces: THREE.Object3D[] | null = null;
  /** Optional planar bounds for enemies that must remain inside a room. */
  public movementBounds: THREE.Box2 | null = null;

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
  private readonly meshMaterialEmissionBases = new Map<THREE.MeshStandardMaterial, { color: THREE.Color; intensity: number }>();
  private readonly bossRedEmissionMaterials: Array<{ material: THREE.MeshStandardMaterial; baseIntensity: number }> = [];
  private readonly bossOwnedMaterials = new Set<THREE.Material>();
  private bossEyeWindup = 0;
  private bossHitReactionTimer = 0;
  private bossAlertTimer = 0;
  private bossCombatPoseState: 'IDLE' | 'ALERT' | 'CHASE' | 'ATTACK_PREP' | 'ATTACK' | 'RECOVERY' | 'HIT_REACTION' | 'DEATH' = 'IDLE';
  private bossEyeGlow: THREE.Mesh | null = null;
  private bossEyeLight: THREE.PointLight | null = null;
  private bossGeneratedGeometry: THREE.BufferGeometry[] = [];
  private bossLegPivots: Array<{ pivot: THREE.Group; phase: number; restX: number }> = [];
  private bossArmPivots: Array<{ pivot: THREE.Group; phase: number; restX: number; restZ: number; side?: number }> = [];

  // Death VFX state
  private dyingTimer = 0;
  private dyingDuration = 0.65; // Total death sequence duration
  private deathVfxSpawned = false;
  private dyingScaleStart = 1.0;
  private scene: THREE.Scene | null = null; // Set externally for VFX
  private bossDeathElapsed = 0;
  private bossDeathDissolveElapsed = 0;
  private bossDeathStartRotation = new THREE.Euler();
  private bossDeathStartModelY = 0;
  private bossFadeMaterials: Array<{ material: THREE.Material; opacity: number; transparent: boolean; depthWrite: boolean }> = [];
  private bossDeathParticles: THREE.Points | null = null;
  private bossDeathParticleOrigins: THREE.Vector3[] = [];
  private bossDeathParticleVelocities: THREE.Vector3[] = [];
  private static readonly BOSS_DEATH_FALL_DURATION = 0.82;
  private static readonly BOSS_DEATH_DISSOLVE_DURATION = 1.25;
  private static readonly BOSS_DEATH_PARTICLE_COUNT = 12;

  // Boss Battle variables
  private bossPatternIndex = 0;
  private bossPattern: 'CLAW' | 'VOLLEY' | 'CHARGE' | 'SLAM' | 'ROCK_THROW' = 'CLAW';
  private bossAttackPhase: 'READY' | 'SEEK_ROCK' | 'TELEGRAPH' | 'EXECUTE' | 'RECOVERY' = 'READY';
  private bossPhaseTimer = 0;
  private bossAttackCooldown = 0;
  private bossAttackHitApplied = false;
  private bossDefenseCueTimer = 0;
  private bossDefenseCueShown = false;
  private readonly bossAttackDirection = new THREE.Vector3();
  private readonly bossImpactPoint = new THREE.Vector3();
  private bossArenaRocks: THREE.Mesh[] = [];
  private bossRockTarget: THREE.Mesh | null = null;
  private readonly bossRockHome = new THREE.Vector3();
  private readonly bossRockVelocity = new THREE.Vector3();
  private bossRockInFlight = false;
  private bossRockFlightLife = 0;
  private readonly bossRockStart = new THREE.Vector3();
  private readonly bossRockEnd = new THREE.Vector3();
  private readonly bossRockSegment = new THREE.Vector3();
  private readonly bossRockToPlayer = new THREE.Vector3();
  private readonly bossRockClosest = new THREE.Vector3();
  private bossTelegraphRoot: THREE.Group | null = null;
  private bossWarningFill: THREE.Mesh | null = null;
  private bossWarningRing: THREE.Mesh | null = null;
  private bossChargeLane: THREE.Group | null = null;
  private bossProjectileGroup: THREE.Group | null = null;
  private readonly bossProjectiles: Array<{ ownerId: string; mesh: THREE.Mesh; velocity: THREE.Vector3; life: number; active: boolean }> = [];
  private bossVolleyShotsRemaining = 0;
  private bossVolleyShotTimer = 0;
  private bossVolleyFinishTimer = 0;
  private bossClaws: THREE.Object3D[] = [];
  private bossClawRestRotations = new Map<THREE.Object3D, THREE.Euler>();
  private bossModelBaseY = 0;
  private readonly bossModelBaseRotation = new THREE.Euler();
  private readonly bossHurtboxLocal = new THREE.Box3();
  private readonly bossHurtboxFromLocal = new THREE.Vector3();
  private readonly bossHurtboxToLocal = new THREE.Vector3();
  private readonly bossHurtboxClosest = new THREE.Vector3();
  private readonly bossHurtboxWorldToLocal = new THREE.Matrix4();
  private readonly bossHurtboxInterval = { enter: 0, exit: 1 };
  private readonly bossDebugEnabled: boolean;
  private debugLastBossState: EnemyState | null = null;
  private debugLastBossPhase: string | null = null;

  public onAttackPlayer?: (damage: number) => void;
  public onDeath?: (enemy: EnemyController) => void;
  public onHealthChange?: (health: number, maxHealth: number) => void;

  public get isBossVulnerable(): boolean {
    return this.id !== 'crab_boss' || (this.state === 'STUNNED' && this.bossAttackPhase === 'RECOVERY');
  }
  public get isAttackWindup(): boolean { return this.id === 'crab_boss' && this.bossAttackPhase === 'TELEGRAPH'; }

  // Shared Master GLTF Template & Texture Pool
  private static masterTemplate: THREE.Object3D | null = null;
  private static masterPromise: Promise<THREE.Object3D | null> | null = null;
  private static bossTemplate: THREE.Object3D | null = null;
  private static sharedSwordTexture: THREE.CanvasTexture | null = null;

  // Reusable static vectors to eliminate per-frame allocations
  private static readonly TEMP_ORIGIN = new THREE.Vector3();
  private static readonly TEMP_DOWN = new THREE.Vector3(0, -1, 0);
  private static readonly TEMP_DIR = new THREE.Vector3();
  private static readonly TEMP_NORM = new THREE.Vector3();
  private static readonly BOSS_PROJECTILE_START = new THREE.Vector3();
  private static readonly BOSS_PROJECTILE_END = new THREE.Vector3();
  private static readonly BOSS_PROJECTILE_SEGMENT = new THREE.Vector3();
  private static readonly BOSS_PROJECTILE_TO_PLAYER = new THREE.Vector3();
  private static readonly BOSS_PROJECTILE_CLOSEST = new THREE.Vector3();
  private static readonly HIT_FLASH_EMISSION = new THREE.Color(0xff2200);
  private static readonly BOSS_LEG_MESH_NAMES = ['Cube.005', 'Cube.006', 'Cube.007', 'Cube.008', 'Cube.009'];

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
    this.bossDebugEnabled = id === 'crab_boss'
      && import.meta.env.DEV
      && typeof window !== 'undefined'
      && new URLSearchParams(window.location.search).has('debugBoss');
    this.createProceduralCrab();
    if (this.bossDebugEnabled) {
      console.info('[BossDebug] ENTITY_CREATED', { id, asset: 'assets/enemies/crab.glb', hp: this.health, maxHp: this.maxHealth });
    }
  }

  public debugBossEvent(event: string, details: Record<string, unknown> = {}): void {
    if (this.bossDebugEnabled) console.info(`[BossDebug] ${event}`, { id: this.id, ...details });
  }

  public get hasBossHurtbox(): boolean {
    return this.id === 'crab_boss' && this.isAlive() && !!this.crabModel && !this.bossHurtboxLocal.isEmpty();
  }

  public isAlive(): boolean {
    return this.state !== 'DYING' && this.state !== 'DISSOLVING' && this.state !== 'DEAD' && this.state !== 'DEFEATED' && !this.isDead && this.health > 0;
  }

  public getPosition(): THREE.Vector3 {
    return this.mesh.position;
  }

  /** Closest distance to the loaded boss model's actual bounds, not its ground pivot. */
  public distanceToBossHurtbox(worldPosition: THREE.Vector3): number {
    if (this.id !== 'crab_boss' || !this.crabModel || this.bossHurtboxLocal.isEmpty()) return worldPosition.distanceTo(this.mesh.position);
    this.mesh.updateMatrixWorld(true);
    this.bossHurtboxWorldToLocal.copy(this.mesh.matrixWorld).invert();
    this.bossHurtboxClosest.copy(worldPosition);
    this.bossHurtboxClosest.applyMatrix4(this.bossHurtboxWorldToLocal);
    this.bossHurtboxClosest.clamp(this.bossHurtboxLocal.min, this.bossHurtboxLocal.max);
    this.bossHurtboxFromLocal.copy(worldPosition).applyMatrix4(this.bossHurtboxWorldToLocal);
    return this.bossHurtboxClosest.distanceTo(this.bossHurtboxFromLocal);
  }

  /** Segment test for fast spell projectiles against the boss model bounds. */
  public intersectsBossHurtbox(fromWorld: THREE.Vector3, toWorld: THREE.Vector3, padding = 0.18): boolean {
    if (this.id !== 'crab_boss' || !this.isAlive() || !this.crabModel || this.bossHurtboxLocal.isEmpty()) return false;
    this.mesh.updateMatrixWorld(true);
    this.bossHurtboxWorldToLocal.copy(this.mesh.matrixWorld).invert();
    this.bossHurtboxFromLocal.copy(fromWorld);
    this.bossHurtboxToLocal.copy(toWorld);
    this.bossHurtboxFromLocal.applyMatrix4(this.bossHurtboxWorldToLocal);
    this.bossHurtboxToLocal.applyMatrix4(this.bossHurtboxWorldToLocal);

    const min = this.bossHurtboxLocal.min;
    const max = this.bossHurtboxLocal.max;
    const interval = this.bossHurtboxInterval;
    interval.enter = 0;
    interval.exit = 1;
    const ax = this.bossHurtboxFromLocal.x, ay = this.bossHurtboxFromLocal.y, az = this.bossHurtboxFromLocal.z;
    const dx = this.bossHurtboxToLocal.x - ax, dy = this.bossHurtboxToLocal.y - ay, dz = this.bossHurtboxToLocal.z - az;
    return this.intersectBossHurtboxAxis(ax, dx, min.x - padding, max.x + padding, interval)
      && this.intersectBossHurtboxAxis(ay, dy, min.y - padding, max.y + padding, interval)
      && this.intersectBossHurtboxAxis(az, dz, min.z - padding, max.z + padding, interval);
  }

  private intersectBossHurtboxAxis(origin: number, delta: number, low: number, high: number, interval: { enter: number; exit: number }): boolean {
    if (Math.abs(delta) < 1e-8) return origin >= low && origin <= high;
    let a = (low - origin) / delta;
    let b = (high - origin) / delta;
    if (a > b) { const swap = a; a = b; b = swap; }
    interval.enter = Math.max(interval.enter, a);
    interval.exit = Math.min(interval.exit, b);
    return interval.enter <= interval.exit;
  }

  public setScene(scene: THREE.Scene): void {
    this.scene = scene;
    if (this.id !== 'crab_boss' || this.bossTelegraphRoot) return;
    this.bossTelegraphRoot = new THREE.Group();
    this.bossTelegraphRoot.name = 'crab_boss_attack_warnings';
    const fillMaterial = new THREE.MeshBasicMaterial({ color: 0xffa332, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide });
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffd369, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide });
    this.bossWarningFill = new THREE.Mesh(new THREE.CircleGeometry(3.45, 48), fillMaterial);
    this.bossWarningFill.rotation.x = -Math.PI / 2;
    this.bossWarningRing = new THREE.Mesh(new THREE.RingGeometry(3.38, 3.55, 48), ringMaterial);
    this.bossWarningRing.rotation.x = -Math.PI / 2;
    this.bossWarningFill.visible = false;
    this.bossWarningRing.visible = false;
    this.bossTelegraphRoot.add(this.bossWarningFill, this.bossWarningRing);

    this.bossChargeLane = new THREE.Group();
    const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xff5638, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide });
    const lane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 8.5), laneMaterial);
    lane.rotation.x = Math.PI / 2;
    lane.position.y = 0.28;
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.2, 3), laneMaterial.clone());
    arrow.rotation.x = Math.PI / 2;
    arrow.position.set(0, 0.3, 4.6);
    this.bossChargeLane.add(lane, arrow);
    this.bossChargeLane.visible = false;
    this.bossTelegraphRoot.add(this.bossChargeLane);

    // Reused low-poly projectile meshes; no per-shot geometry/material creation.
    this.bossProjectileGroup = new THREE.Group();
    this.bossProjectileGroup.name = 'crab_boss_volley_projectiles';
    this.bossProjectileGroup.userData.ownerId = this.id;
    const projectileGeometry = new THREE.SphereGeometry(0.38, 12, 10);
    const projectileMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      emissive: 0xff3300,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.1
    });
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
      mesh.name = `crab_boss_volley_projectile_${i + 1}`;
      mesh.visible = false;
      mesh.frustumCulled = true;
      this.bossProjectileGroup.add(mesh);
      mesh.userData.ownerId = this.id;
      this.bossProjectiles.push({ ownerId: this.id, mesh, velocity: new THREE.Vector3(), life: 0, active: false });
    }
    this.bossTelegraphRoot.add(this.bossProjectileGroup);
    scene.add(this.bossTelegraphRoot);
  }

  /** The arena's actual rubble meshes are reused by the boss rock-throw move. */
  public setBossArenaRocks(rocks: THREE.Mesh[]): void {
    if (this.id !== 'crab_boss') return;
    this.bossArenaRocks = rocks;
  }

  public static async preloadMasterTemplate(): Promise<void> {
    if (this.masterTemplate) return;
    if (!this.masterPromise) {
      this.masterPromise = (async () => {
       try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/enemies/crab.glb?v=0.0.34');
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
        this.masterPromise = null;
        console.warn('[EnemyController] Could not preload master crab.glb template', err);
        return null;
      }
      })();
    }
    // All concurrently-created enemies must await this same in-flight GLB load.
    await this.masterPromise;
  }

  /** The exclusive demonic boss model (assets/enemies/boss-crab.glb). */
  private static async preloadBossTemplate(): Promise<void> {
    if (this.bossTemplate) return;
    try {
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(import.meta.env.BASE_URL + `assets/enemies/boss-crab.glb?v=${__APP_VERSION__}`);
      const model = gltf.scene;

      // Uniformly scale the exclusive boss model by width to ~5.2 m (3x Wukong)
      const currentBounds = new THREE.Box3().setFromObject(model);
      const currentSize = currentBounds.getSize(new THREE.Vector3());
      const targetBossWidth = 5.2;
      const largestAxis = Math.max(currentSize.x, currentSize.z);
      const scale = targetBossWidth / Math.max(0.001, largestAxis);
      model.scale.setScalar(scale);
      model.updateMatrixWorld(true);

      // Align vertical offset so feet (lowest vertex) sit strictly at y = 0
      const scaledBBox = new THREE.Box3().setFromObject(model);
      model.position.set(0, -scaledBBox.min.y, 0);

      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.bossTemplate = model;
      console.info('[EnemyController] ✅ Exclusive boss-crab.glb template loaded and grounded successfully');
    } catch (err) {
      console.warn('[EnemyController] Could not load boss-crab.glb, falling back to master crab.glb', err);
      await this.preloadMasterTemplate();
      this.bossTemplate = this.masterTemplate;
    }
  }

  public async loadModel(scaleMultiplier = 1.0): Promise<void> {
    try {
      if (this.id === 'crab_boss') {
        await EnemyController.preloadBossTemplate();
      } else if (!EnemyController.masterTemplate) {
        await EnemyController.preloadMasterTemplate();
      }

      const template = this.id === 'crab_boss' ? EnemyController.bossTemplate : EnemyController.masterTemplate;
      if (!template) return;

      const model = template.clone(true);
      if (this.id === 'crab_boss') {
        const scaledBBox = new THREE.Box3().setFromObject(model);
        model.position.set(0, -scaledBBox.min.y, 0);
      } else if (scaleMultiplier !== 1.0) {
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
      this.bossModelBaseY = model.position.y;
      this.bossModelBaseRotation.copy(model.rotation);
      if (this.id === 'crab_boss') {
        model.updateMatrixWorld(true);
        this.mesh.updateMatrixWorld(true);
        // setFromObject returns a world-space bound. Convert it back into the
        // boss root's local space because all hit queries below transform the
        // player/projectile positions through this root's inverse matrix.
        this.bossHurtboxLocal.setFromObject(model);
        this.bossHurtboxWorldToLocal.copy(this.mesh.matrixWorld).invert();
        this.bossHurtboxLocal.applyMatrix4(this.bossHurtboxWorldToLocal);
        this.debugBossEvent('MODEL_READY', {
          asset: 'assets/enemies/boss-crab.glb',
          bounds: this.bossHurtboxLocal.getSize(new THREE.Vector3()).toArray(),
          hp: this.health,
          maxHp: this.maxHealth,
        });
      }

      this.legs = [];
      this.meshMaterials = [];
      this.meshMaterialEmissionBases.clear();
      this.bossRedEmissionMaterials.length = 0;
      this.bossOwnedMaterials.clear();
      this.bossEyeWindup = 0;
      this.bossEyeGlow = null;
      this.bossEyeLight = null;
      this.bossClaws = [];
      this.bossClawRestRotations.clear();
      const bossMaterialCopies = new Map<THREE.Material, THREE.Material>();
      const seenMaterials = new Set<THREE.MeshStandardMaterial>();
      model.traverse((child) => {
        const n = child.name.toLowerCase();
        if (this.id === 'crab_boss') {
          // The GLB is a set of named hard-surface parts, not a skeleton.
          // Don't rotate the face/eye meshes as limbs; the appendage rig is
          // built from the actual leg and arm meshes below.
        } else {
          if (n.includes('leg') || n.includes('arm') || n.includes('claw') || n.includes('limb')) {
            this.legs.push(child);
          }
          if (n.includes('claw')) {
            this.bossClaws.push(child);
            this.bossClawRestRotations.set(child, child.rotation.clone());
          }
        }
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const mesh = child as THREE.Mesh;
          const currentMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const materials = this.id === 'crab_boss'
            ? currentMaterials.map((source) => {
              let local = bossMaterialCopies.get(source);
              if (!local) {
                local = source.clone();
                bossMaterialCopies.set(source, local);
                this.bossOwnedMaterials.add(local);
              }
              return local;
            })
            : currentMaterials;
          if (this.id === 'crab_boss') {
            mesh.material = Array.isArray(mesh.material) ? materials : materials[0];
          }
          for (const material of materials) {
            const standard = material as THREE.MeshStandardMaterial;
            if (!standard.isMeshStandardMaterial || seenMaterials.has(standard)) continue;
            seenMaterials.add(standard);
            this.meshMaterials.push(standard);
            this.meshMaterialEmissionBases.set(standard, {
              color: standard.emissive.clone(),
              intensity: standard.emissiveIntensity,
            });
          }
        }
      });

      if (this.id === 'crab_boss') {
        this.bossGeneratedGeometry = [];
        this.installBossAppendageRig(model);
        const movedEye = this.moveBossThirdEye(model);
        if (movedEye) {
        // Use the original emissive eye material, but find its centre from
        // the eye's triangle group instead of the bounds of the whole face.
        this.bossRedEmissionMaterials.push({ material: movedEye.mesh.material as THREE.MeshStandardMaterial, baseIntensity: (movedEye.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity });
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 12, 8),
          new THREE.MeshBasicMaterial({ color: 0xff2440, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
        );
        glow.position.copy(movedEye.position);
        glow.renderOrder = 3;
        model.add(glow);
        this.bossEyeGlow = glow;
        const light = new THREE.PointLight(0xff263f, 0, 2.4, 2);
        light.position.copy(movedEye.position);
        model.add(light);
        this.bossEyeLight = light;
        }
        this.cacheBossDissolveMaterials(model);
        this.createBossDeathParticles();
      }

      this.initCombatSwordIcon();
      console.log(`[EnemyController] Loaded model for '${this.id}' (${this.legs.length} legs, ${this.bossClaws.length} claws)`);
    } catch (err) {
      console.warn(`[EnemyController] Could not instantiate crab model for '${this.id}'`, err);
    }
  }

  /** Split mirrored hard-surface parts so each side can pivot independently. */
  private splitMeshByBossSide(source: THREE.Mesh, model: THREE.Object3D, centerX: number): [THREE.BufferGeometry | null, THREE.BufferGeometry | null] {
    const sourceGeometry = source.geometry;
    const position = sourceGeometry.getAttribute('position');
    if (!position) return [null, null];
    source.updateWorldMatrix(true, false);
    model.updateWorldMatrix(true, true);
    const worldToModel = model.matrixWorld.clone().invert();
    const index = sourceGeometry.index;
    const ranges = sourceGeometry.groups.length
      ? sourceGeometry.groups
      : [{ start: 0, count: index?.count ?? position.count, materialIndex: 0 }];
    const sideValues: Array<Map<string, number[]>> = [new Map(), new Map()];
    const sideGroupCounts: Array<Map<number, number>> = [new Map(), new Map()];
    const localA = new THREE.Vector3();
    const localB = new THREE.Vector3();
    const localC = new THREE.Vector3();
    const modelA = new THREE.Vector3();
    const modelB = new THREE.Vector3();
    const modelC = new THREE.Vector3();

    for (const range of ranges) {
      for (let start = range.start; start + 2 < range.start + range.count; start += 3) {
        const materialIndex = range.materialIndex ?? 0;
        const ia = index ? index.getX(start) : start;
        const ib = index ? index.getX(start + 1) : start + 1;
        const ic = index ? index.getX(start + 2) : start + 2;
        localA.fromBufferAttribute(position, ia);
        localB.fromBufferAttribute(position, ib);
        localC.fromBufferAttribute(position, ic);
        modelA.copy(localA).applyMatrix4(source.matrixWorld).applyMatrix4(worldToModel);
        modelB.copy(localB).applyMatrix4(source.matrixWorld).applyMatrix4(worldToModel);
        modelC.copy(localC).applyMatrix4(source.matrixWorld).applyMatrix4(worldToModel);
        const side = (modelA.x + modelB.x + modelC.x) / 3 < centerX ? 0 : 1;
        for (const vertexIndex of [ia, ib, ic]) {
          for (const [name, attribute] of Object.entries(sourceGeometry.attributes)) {
            let attributeValues = sideValues[side].get(`${materialIndex}:${name}`);
            if (!attributeValues) {
              attributeValues = [];
              sideValues[side].set(`${materialIndex}:${name}`, attributeValues);
            }
            const array = attribute.array as ArrayLike<number>;
            for (let component = 0; component < attribute.itemSize; component++) {
              attributeValues.push(array[vertexIndex * attribute.itemSize + component]);
            }
          }
        }
        sideGroupCounts[side].set(materialIndex, (sideGroupCounts[side].get(materialIndex) ?? 0) + 3);
      }
    }

    const geometries: Array<THREE.BufferGeometry | null> = [null, null];
    for (let side = 0; side < 2; side++) {
      const materialIndices = [...sideGroupCounts[side].keys()].sort((a, b) => a - b);
      if (!materialIndices.length) continue;
      const result = new THREE.BufferGeometry();
      for (const [name, attribute] of Object.entries(sourceGeometry.attributes)) {
        const combined: number[] = [];
        for (const materialIndex of materialIndices) combined.push(...(sideValues[side].get(`${materialIndex}:${name}`) ?? []));
        const ArrayType = attribute.array.constructor as new (values: number[]) => typeof attribute.array;
        const copied = new THREE.BufferAttribute(new ArrayType(combined), attribute.itemSize, attribute.normalized);
        result.setAttribute(name, copied);
      }
      let groupStart = 0;
      for (const materialIndex of materialIndices) {
        const count = sideGroupCounts[side].get(materialIndex) ?? 0;
        if (count > 0) result.addGroup(groupStart, count, materialIndex);
        groupStart += count;
      }
      result.computeBoundingBox();
      result.computeBoundingSphere();
      geometries[side] = result;
      this.bossGeneratedGeometry.push(result);
    }
    return geometries as [THREE.BufferGeometry | null, THREE.BufferGeometry | null];
  }

  private installBossAppendageRig(model: THREE.Object3D): void {
    this.bossLegPivots = [];
    this.bossArmPivots = [];
    this.legs = [];
    this.bossClaws = [];
    this.bossClawRestRotations.clear();

    const sides = [-1, 1] as const;
    const legPivots = sides.map((side, index) => {
      const pivot = new THREE.Group();
      pivot.name = `nezha_x_leg_pivot_${side < 0 ? 'left' : 'right'}`;
      pivot.position.set(side * 0.52, 2.55, 0.02);
      model.add(pivot);
      const entry = { pivot, phase: index * Math.PI, restX: pivot.rotation.x, restZ: pivot.rotation.z };
      this.bossLegPivots.push(entry);
      return entry;
    });
    const modelCenterX = 0;
    for (const name of EnemyController.BOSS_LEG_MESH_NAMES) {
      const source = model.getObjectByName(name) as THREE.Mesh | null;
      if (!source?.isMesh || source.parent !== model) continue;
      const split = this.splitMeshByBossSide(source, model, modelCenterX);
      for (let side = 0; side < 2; side++) {
        const geometry = split[side];
        if (!geometry) continue;
        const pivot = legPivots[side]?.pivot;
        if (!pivot) continue;
        const part = new THREE.Mesh(geometry, source.material);
        part.name = `${name}_${side === 0 ? 'left' : 'right'}_gait_part`;
        part.position.copy(source.position).sub(pivot.position);
        part.quaternion.copy(source.quaternion);
        part.scale.copy(source.scale);
        part.castShadow = source.castShadow;
        part.receiveShadow = source.receiveShadow;
        pivot.add(part);
      }
      model.remove(source);
    }

    const armSource = model.getObjectByName('Sphere') as THREE.Mesh | null;
    if (armSource?.isMesh && armSource.parent === model) {
      const split = this.splitMeshByBossSide(armSource, model, modelCenterX);
      for (let side = 0; side < 2; side++) {
        const geometry = split[side];
        if (!geometry) continue;
        const sign = sides[side] ?? 1;
        const pivot = new THREE.Group();
        pivot.name = `nezha_x_arm_pivot_${sign < 0 ? 'left' : 'right'}`;
        pivot.position.set(sign * 1.02, 4.25, 0.38);
        model.add(pivot);
        const part = new THREE.Mesh(geometry, armSource.material);
        part.name = `nezha_x_arm_${sign < 0 ? 'left' : 'right'}`;
        part.position.copy(armSource.position).sub(pivot.position);
        part.quaternion.copy(armSource.quaternion);
        part.scale.copy(armSource.scale);
        part.castShadow = armSource.castShadow;
        part.receiveShadow = armSource.receiveShadow;
        pivot.add(part);
        const entry = { pivot, phase: side * Math.PI, restX: pivot.rotation.x, restZ: pivot.rotation.z, side };
        this.bossArmPivots.push(entry);
        this.bossClaws.push(pivot);
        this.bossClawRestRotations.set(pivot, pivot.rotation.clone());
      }
      model.remove(armSource);
    }
  }

  private moveBossThirdEye(model: THREE.Object3D): { mesh: THREE.Mesh; position: THREE.Vector3 } | null {
    const face = model.getObjectByName('Cube.001') as THREE.Mesh | null;
    if (!face?.isMesh || !Array.isArray(face.material) || !face.geometry.groups.length) return null;
    const faceMaterials = face.material as THREE.Material[];
    const eyeGroup = face.geometry.groups.find((group) => {
      const material = faceMaterials[group.materialIndex ?? 0] as THREE.MeshStandardMaterial | undefined;
      return !!material?.isMeshStandardMaterial && material.emissive.r > 0.75 && material.emissive.g < 0.08 && material.emissive.b < 0.08 && material.emissiveIntensity > 0;
    });
    if (!eyeGroup) return null;
    const eyeMaterialIndex = eyeGroup.materialIndex ?? 0;
    const eyeMaterial = faceMaterials[eyeMaterialIndex] as THREE.MeshStandardMaterial;
    const darkMaterial = faceMaterials.find((material, index) => index !== eyeMaterialIndex && (material as THREE.MeshStandardMaterial).isMeshStandardMaterial) as THREE.Material | undefined;
    if (!darkMaterial) return null;
    const eyeGeometry = face.geometry.clone();
    eyeGeometry.clearGroups();
    eyeGeometry.addGroup(eyeGroup.start, eyeGroup.count, 0);
    this.bossGeneratedGeometry.push(eyeGeometry);

    const vertex = face.geometry.getAttribute('position');
    const index = face.geometry.index;
    const center = new THREE.Vector3();
    let count = 0;
    for (let i = eyeGroup.start; i < eyeGroup.start + eyeGroup.count; i++) {
      const vertexIndex = index ? index.getX(i) : i;
      center.add(new THREE.Vector3().fromBufferAttribute(vertex, vertexIndex));
      count++;
    }
    if (count) center.multiplyScalar(1 / count);

    const oldMaterials = faceMaterials.slice();
    oldMaterials[eyeMaterialIndex] = darkMaterial;
    face.material = oldMaterials;
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.name = 'nezha_x_third_eye_at_marked_position';
    eye.position.copy(face.position);
    eye.quaternion.copy(face.quaternion);
    eye.scale.copy(face.scale);
    // The red square marks the centre of the dark face plate, well below the
    // original forehead socket. In the source GLB's local units this shift
    // maps to about 1.8 m after the boss normalization scale.
    eye.position.y -= 1.7;
    eye.renderOrder = 3;
    eye.castShadow = false;
    eye.receiveShadow = false;
    model.add(eye);
    model.updateMatrixWorld(true);
    const eyePosition = center.clone();
    eye.localToWorld(eyePosition);
    model.worldToLocal(eyePosition);
    return { mesh: eye, position: eyePosition };
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
    if (this.state === 'DYING' || this.state === 'DISSOLVING' || this.state === 'DEAD' || this.state === 'DEFEATED') return;

    if (this.id === 'crab_boss') {
      if (!this.isBossVulnerable) {
        this.debugBossEvent('BOSS_INVULNERABLE', { state: this.state, hp: this.health, maxHp: this.maxHealth });
        return;
      }
      this.health = Math.max(0, this.health - damageAmount);
      this.hitFlashTimer = 0.35;
      this.onHealthChange?.(this.health, this.maxHealth);
      this.debugBossEvent('DAMAGE_APPLIED', { damage: damageAmount, hp: this.health, maxHp: this.maxHealth });
      console.log(`[Boss] Hit with damage ${damageAmount}! HP: ${this.health}/${this.maxHealth}`);

      if (fromPos) {
        EnemyController.TEMP_DIR.subVectors(this.mesh.position, fromPos);
        EnemyController.TEMP_DIR.y = 0;
        this.safeNormalize(EnemyController.TEMP_DIR);
        this.mesh.position.addScaledVector(EnemyController.TEMP_DIR, 0.6);
      }
      this.bossHitReactionTimer = 0.42;

      if (this.health <= 0) {
        this.triggerDeath();
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
    if (this.state === 'DYING' || this.state === 'DISSOLVING' || this.state === 'DEAD' || this.state === 'DEFEATED') return; // Double-fire guard

    this.state = 'DYING';
    this.bossCombatPoseState = 'DEATH';
    this.bossHitReactionTimer = 0;
    this.isDead = true;
    this.hitFlashTimer = 0;
    this.dyingTimer = this.dyingDuration;
    this.dyingScaleStart = this.mesh.scale.x;
    this.deathVfxSpawned = false;
    this.hideBossTelegraph();

    // Disable AI immediately
    this.knockbackVelocity.set(0, 0, 0);
    if (this.id !== 'crab_boss') this.onAttackPlayer = undefined;

    if (this.id === 'crab_boss') {
      // Stop all boss-owned attacks before the next simulation/update pass.
      this.bossDeathElapsed = 0;
      this.bossDeathDissolveElapsed = 0;
      this.bossDeathStartRotation.copy(this.mesh.rotation);
      this.bossDeathStartModelY = this.crabModel?.position.y ?? this.bossModelBaseY;
      this.bossAttackPhase = 'READY';
      this.bossAttackCooldown = 0;
      this.bossPhaseTimer = 0;
      this.bossAttackHitApplied = true;
      this.bossVolleyShotsRemaining = 0;
      this.bossVolleyShotTimer = 0;
      this.bossVolleyFinishTimer = 0;
      this.clearBossProjectiles();
      this.restoreBossRock();
      this.bossEyeWindup = 0;
      if (this.bossEyeGlow) (this.bossEyeGlow.material as THREE.MeshBasicMaterial).opacity = 0;
      if (this.bossEyeLight) this.bossEyeLight.intensity = 0;
      if (this.bossDeathParticles) this.bossDeathParticles.visible = false;
    }

    // Invoke the callback once for this life; the state guard prevents repeats.
    const cb = this.onDeath;
    console.log(`[Enemy ${this.id}] DYING — triggering death sequence`);

    // Keep the boss planted at its final hit position for a stable fall pose.
    if (this.id !== 'crab_boss') this.mesh.position.y += 0.05;

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

  private cacheBossDissolveMaterials(model: THREE.Object3D): void {
    this.bossFadeMaterials = [];
    const seen = new Set<THREE.Material>();
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        if (seen.has(material)) continue;
        seen.add(material);
        this.bossFadeMaterials.push({
          material,
          opacity: material.opacity,
          transparent: material.transparent,
          depthWrite: material.depthWrite,
        });
      }
    });
  }

  private createBossDeathParticles(): void {
    this.bossDeathParticleOrigins = [];
    this.bossDeathParticleVelocities = [];
    const bounds = this.bossHurtboxLocal;
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const positions = new Float32Array(EnemyController.BOSS_DEATH_PARTICLE_COUNT * 3);
    for (let i = 0; i < EnemyController.BOSS_DEATH_PARTICLE_COUNT; i++) {
      const origin = new THREE.Vector3(
        center.x + (Math.random() - 0.5) * size.x * 0.82,
        bounds.min.y + Math.random() * Math.max(0.5, size.y),
        center.z + (Math.random() - 0.5) * size.z * 0.82,
      );
      this.bossDeathParticleOrigins.push(origin);
      this.bossDeathParticleVelocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 1.3,
        0.45 + Math.random() * 1.15,
        (Math.random() - 0.5) * 1.3,
      ));
      positions.set([origin.x, origin.y, origin.z], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xff8a24,
      size: 0.12,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(geometry, material);
    particles.name = 'nezha_x_dissolve_energy_particles';
    particles.visible = false;
    particles.frustumCulled = false;
    this.mesh.add(particles);
    this.bossDeathParticles = particles;
  }

  private beginBossDissolve(): void {
    this.state = 'DISSOLVING';
    this.bossDeathDissolveElapsed = 0;
    this.deathVfxSpawned = true;
    for (const entry of this.bossFadeMaterials) {
      if (!entry.material.transparent) {
        entry.material.transparent = true;
        entry.material.needsUpdate = true;
      }
      entry.material.depthWrite = false;
    }
    if (this.bossDeathParticles) {
      this.bossDeathParticles.visible = true;
      (this.bossDeathParticles.material as THREE.PointsMaterial).opacity = 0.9;
    }
    this.debugBossEvent('DISSOLVING_STARTED', { durationSeconds: EnemyController.BOSS_DEATH_DISSOLVE_DURATION });
  }

  private updateBossDeathSequence(delta: number): void {
    if (this.state === 'DYING') {
      this.bossDeathElapsed += delta;
      const t = THREE.MathUtils.smoothstep(this.bossDeathElapsed / EnemyController.BOSS_DEATH_FALL_DURATION, 0, 1);
      this.mesh.rotation.x = THREE.MathUtils.lerp(this.bossDeathStartRotation.x, this.bossDeathStartRotation.x - 0.16, t);
      this.mesh.rotation.y = this.bossDeathStartRotation.y;
      this.mesh.rotation.z = THREE.MathUtils.lerp(this.bossDeathStartRotation.z, this.bossDeathStartRotation.z + 0.72, t);
      if (this.crabModel) {
        this.crabModel.position.y = THREE.MathUtils.lerp(this.bossDeathStartModelY, this.bossModelBaseY - 0.26, t);
      }
      for (const arm of this.bossArmPivots) arm.pivot.rotation.x = THREE.MathUtils.lerp(arm.restX, arm.restX + 0.85, t);
      for (const leg of this.bossLegPivots) leg.pivot.rotation.x = THREE.MathUtils.lerp(leg.restX, leg.restX + (leg.phase === 0 ? 0.28 : -0.22), t);
      if (this.bossDeathElapsed >= EnemyController.BOSS_DEATH_FALL_DURATION) {
        this.beginBossDissolve();
      }
      return;
    }

    if (this.state !== 'DISSOLVING') return;
    this.bossDeathDissolveElapsed += delta;
    const t = THREE.MathUtils.clamp(this.bossDeathDissolveElapsed / EnemyController.BOSS_DEATH_DISSOLVE_DURATION, 0, 1);
    const alpha = 1 - t;
    for (const entry of this.bossFadeMaterials) entry.material.opacity = entry.opacity * alpha;
    if (this.bossDeathParticles) {
      const attribute = this.bossDeathParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < this.bossDeathParticleOrigins.length; i++) {
        const origin = this.bossDeathParticleOrigins[i]!;
        const velocity = this.bossDeathParticleVelocities[i]!;
        const age = this.bossDeathDissolveElapsed;
        attribute.setXYZ(i,
          origin.x + velocity.x * age,
          origin.y + velocity.y * age + 0.28 * age * age,
          origin.z + velocity.z * age,
        );
      }
      attribute.needsUpdate = true;
      (this.bossDeathParticles.material as THREE.PointsMaterial).opacity = 0.9 * alpha;
    }
    if (t >= 1) {
      this.mesh.visible = false;
      if (this.bossDeathParticles) this.bossDeathParticles.visible = false;
      this.state = 'DEFEATED';
      this.isDead = true;
      this.debugBossEvent('DEFEATED', { alpha: 0, projectilesActive: this.bossProjectiles.some((entry) => entry.ownerId === this.id && entry.active) });
    }
  }

  private restoreBossDissolveMaterials(): void {
    for (const entry of this.bossFadeMaterials) {
      entry.material.opacity = entry.opacity;
      entry.material.depthWrite = entry.depthWrite;
      if (entry.material.transparent !== entry.transparent) {
        entry.material.transparent = entry.transparent;
        entry.material.needsUpdate = true;
      }
    }
  }

  public update(delta: number, playerPos: THREE.Vector3, colliders?: THREE.Object3D[]): void {
    if (this.isPaused) return;
    // Fully dead and sequence done — skip
    if (this.state === 'DEAD' || this.state === 'DEFEATED') return;

    if (this.id === 'crab_boss' && this.bossDebugEnabled) {
      if (this.state !== this.debugLastBossState || this.bossAttackPhase !== this.debugLastBossPhase) {
        this.debugLastBossState = this.state;
        this.debugLastBossPhase = this.bossAttackPhase;
        this.debugBossEvent('STATE', { state: this.state, phase: this.bossAttackPhase, vulnerable: this.isBossVulnerable, hp: this.health, maxHp: this.maxHealth });
      }
    }

    if (this.id === 'crab_boss' && (this.state === 'DYING' || this.state === 'DISSOLVING')) {
      this.updateBossDeathSequence(delta);
      return;
    }

    this.proceduralTime += delta * 6;
    this.updateBossEyeEmission(delta);
    if (this.id === 'crab_boss') {
      this.updateBossProjectiles(delta, playerPos);
      this.updateBossThrownRock(delta, playerPos);
    }

    // ── Standard enemy DYING sequence ──
    if (this.state === 'DYING') {
      // Spawn VFX on first frame of dying
      if (!this.deathVfxSpawned) {
        this.deathVfxSpawned = true;
        this.spawnDeathVFX();
        console.log(`[Enemy ${this.id}] Entering DYING — defeat sequence started`);
      }

      this.dyingTimer -= delta;

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
        const material = this.meshMaterials[i];
        if (material.emissive) {
          const base = this.meshMaterialEmissionBases.get(material);
          if (base) material.emissive.copy(base.color).lerp(EnemyController.HIT_FLASH_EMISSION, 0.78);
          else material.emissive.copy(EnemyController.HIT_FLASH_EMISSION);
        }
      }
    } else if (this.meshMaterials.length > 0) {
      for (let i = 0; i < this.meshMaterials.length; i++) {
        const material = this.meshMaterials[i];
        const base = this.meshMaterialEmissionBases.get(material);
        if (material.emissive && base) {
          material.emissive.copy(base.color);
          material.emissiveIntensity = base.intensity;
        } else if (material.emissive && material.emissive.getHex() !== 0x000000) {
          material.emissive.setHex(0x000000);
        }
      }
    }

    const distToPlayer = Math.hypot(this.mesh.position.x - playerPos.x, this.mesh.position.z - playerPos.z);
    if (this.id === 'crab_boss' && this.bossAttackCooldown > 0 && this.state !== 'ATTACK' && this.state !== 'STUNNED') {
      this.bossAttackCooldown = Math.max(0, this.bossAttackCooldown - delta);
    }

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
    let targetGroundY = this.groundHeightOverride ??
      (levelInst ? levelInst.getTerrainHeight(this.mesh.position.x, this.mesh.position.z) : 0.0);

    // Distance Culling Optimization: Only raycast colliders if enemy is within 35m of player
    const groundCandidates = this.groundSnapSurfaces ?? colliders;
    if (distToPlayer <= 35.0 && groundCandidates && groundCandidates.length > 0) {
      EnemyController.TEMP_ORIGIN.set(this.mesh.position.x, this.mesh.position.y + 1.2, this.mesh.position.z);
      this.groundRaycaster.set(EnemyController.TEMP_ORIGIN, EnemyController.TEMP_DOWN);
      this.groundRaycaster.far = 4.0;
      const rawHits = this.groundRaycaster.intersectObjects(groundCandidates, true);
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
      if (this.id === 'crab_boss') this.bossDefenseCueTimer = Math.max(0, this.bossDefenseCueTimer - delta);
      const bossCueActive = this.id !== 'crab_boss' || this.isBossVulnerable || this.bossDefenseCueTimer > 0;
      const cueDistance = this.id === 'crab_boss' ? 16.0 : 8.0;
      if (this.isAlive() && distToPlayer < cueDistance && bossCueActive) {
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
        if (this.id === 'crab_boss') {
          this.bossPhaseTimer -= delta;
          this.mesh.rotation.z = 0;
          if (this.crabModel) {
            this.crabModel.position.y = THREE.MathUtils.lerp(this.crabModel.position.y, this.bossModelBaseY - 0.2, delta * 4.0);
          }
          this.raiseBossClaws(-0.4);
          if (this.bossPhaseTimer <= 0) {
            this.bossAttackPhase = 'READY';
            this.bossAttackCooldown = 0.85;
            this.mesh.rotation.z = 0;
            if (this.crabModel) {
              this.crabModel.position.y = this.bossModelBaseY;
            }
            this.restoreBossClaws();
            this.state = 'CHASE';
          }
          break;
        }
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
          if (this.id === 'crab_boss') this.bossAlertTimer = 0.34;
          this.state = 'CHASE';
        } else {
          this.patrolBehavior(delta);
        }
        break;

      case 'CHASE':
        if (this.id === 'crab_boss' && distToPlayer <= 10 && this.bossAttackCooldown <= 0 && this.bossAttackPhase === 'READY') {
          this.beginBossAttack(playerPos);
        } else if (this.id !== 'crab_boss' && distToPlayer <= this.attackRadius) {
          this.state = 'ATTACK';
        } else if (distToPlayer > this.detectionRadius * 2) {
          this.state = 'PATROL';
        } else {
          this.chaseBehavior(delta, playerPos);
        }
        break;

      case 'ATTACK':
        if (this.id === 'crab_boss') {
          this.updateBossAttack(delta, playerPos);
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

    if (this.movementBounds) {
      this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, this.movementBounds.min.x, this.movementBounds.max.x);
      this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, this.movementBounds.min.y, this.movementBounds.max.y);
    }

    if (this.id === 'crab_boss') this.animateBossTell(delta);
    this.animateLegs(delta);
  }

  public resetBossEncounter(): void {
    if (this.id !== 'crab_boss' || !this.arenaCenter) return;
    this.health = this.maxHealth;
    this.isDead = false;
    this.state = 'IDLE';
    this.mesh.visible = true;
    this.mesh.position.copy(this.arenaCenter);
    this.mesh.scale.setScalar(1);
    this.mesh.rotation.set(0, 0, 0);
    if (this.crabModel) {
      this.crabModel.visible = true;
      this.crabModel.position.y = this.bossModelBaseY;
      this.crabModel.rotation.set(0, 0, 0);
    }
    this.restoreBossDissolveMaterials();
    this.bossDeathElapsed = 0;
    this.bossDeathDissolveElapsed = 0;
    this.deathVfxSpawned = false;
    if (this.bossDeathParticles) {
      const positions = this.bossDeathParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
      this.bossDeathParticleOrigins.forEach((origin, index) => positions.setXYZ(index, origin.x, origin.y, origin.z));
      positions.needsUpdate = true;
      this.bossDeathParticles.visible = false;
      (this.bossDeathParticles.material as THREE.PointsMaterial).opacity = 0;
    }
    this.bossPatternIndex = 0;
    this.bossCombatPoseState = 'IDLE';
    this.bossHitReactionTimer = 0;
    this.bossAlertTimer = 0;
    this.bossAttackPhase = 'READY';
    this.bossPhaseTimer = 0;
    this.bossAttackCooldown = 0;
    this.bossAttackHitApplied = false;
    this.clearBossProjectiles();
    this.restoreBossRock();
    this.bossVolleyShotsRemaining = 0;
    this.bossVolleyShotTimer = 0;
    this.bossVolleyFinishTimer = 0;
    this.bossDefenseCueTimer = 0;
    this.bossDefenseCueShown = false;
    this.restoreBossClaws();
    this.hideBossTelegraph();
    this.onHealthChange?.(this.health, this.maxHealth);
  }

  private beginBossAttack(playerPos: THREE.Vector3): void {
    this.bossPattern = (['ROCK_THROW', 'CLAW', 'VOLLEY', 'CHARGE', 'SLAM'] as const)[this.bossPatternIndex % 5];
    this.bossPatternIndex++;
    if (this.bossPattern === 'ROCK_THROW') {
      let nearest: THREE.Mesh | null = null;
      let nearestDistanceSq = Infinity;
      for (const rock of this.bossArenaRocks) {
        if (!rock.visible || rock.userData.ownerId !== this.id || rock === this.bossRockTarget) continue;
        const distanceSq = rock.position.distanceToSquared(this.mesh.position);
        if (distanceSq < nearestDistanceSq) { nearest = rock; nearestDistanceSq = distanceSq; }
      }
      if (nearest) {
        this.bossRockTarget = nearest;
        const home = nearest.userData.homePosition;
        this.bossRockHome.copy(home instanceof THREE.Vector3 ? home : nearest.position);
        this.bossAttackPhase = 'SEEK_ROCK';
        this.state = 'ATTACK';
        this.bossPhaseTimer = 3.8;
        this.bossAttackHitApplied = false;
        this.hideBossTelegraph();
        this.debugBossEvent('ROCK_SEEK_STARTED', { rock: nearest.name });
        return;
      }
      // A depleted prop pool never stalls combat; use a standard move.
      this.bossPattern = 'CLAW';
    }
    this.debugBossEvent('ATTACK_TELEGRAPH', { pattern: this.bossPattern, index: this.bossPatternIndex });
    this.bossAttackPhase = 'TELEGRAPH';
    // The attack updater only runs in ATTACK. Without this transition the boss
    // stayed in CHASE with a warning that never advanced into its strike.
    this.state = 'ATTACK';
    this.bossPhaseTimer = this.bossPattern === 'VOLLEY' ? 1.1 : 0.95;
    this.bossAttackHitApplied = false;
    if (!this.bossDefenseCueShown) {
      this.bossDefenseCueShown = true;
      this.bossDefenseCueTimer = 1.8;
    }
    this.bossAttackDirection.subVectors(playerPos, this.mesh.position);
    this.bossAttackDirection.y = 0;
    this.safeNormalize(this.bossAttackDirection);
    this.mesh.rotation.y = Math.atan2(this.bossAttackDirection.x, this.bossAttackDirection.z);
    if (this.bossPattern === 'SLAM' || this.bossPattern === 'VOLLEY') this.bossImpactPoint.copy(playerPos);
    this.showBossTelegraph();
  }

  private updateBossAttack(delta: number, playerPos: THREE.Vector3): void {
    if (this.bossAttackPhase === 'READY') {
      this.bossAttackCooldown = Math.max(0, this.bossAttackCooldown - delta);
      if (this.bossAttackCooldown <= 0) this.beginBossAttack(playerPos);
      return;
    }

    if (this.bossAttackPhase === 'SEEK_ROCK') {
      const rock = this.bossRockTarget;
      if (!rock?.visible) { this.bossAttackPhase = 'READY'; this.state = 'CHASE'; return; }
      this.bossPhaseTimer -= delta;
      const toRock = EnemyController.TEMP_DIR.subVectors(rock.position, this.mesh.position);
      toRock.y = 0;
      const distance = toRock.length();
      if (distance > 1e-5) {
        toRock.multiplyScalar(1 / distance);
        this.mesh.rotation.y = Math.atan2(toRock.x, toRock.z);
        this.mesh.position.addScaledVector(toRock, Math.min(Math.max(0, distance - 2.15), 5.2 * delta));
      }
      if (distance <= 2.35) {
        this.bossPattern = 'ROCK_THROW';
        this.bossAttackPhase = 'TELEGRAPH';
        this.bossPhaseTimer = 0.78;
        this.bossAttackDirection.subVectors(playerPos, this.mesh.position);
        this.bossAttackDirection.y = 0;
        this.safeNormalize(this.bossAttackDirection);
        this.bossImpactPoint.copy(playerPos);
        this.showBossTelegraph();
        this.debugBossEvent('ROCK_GRAB_TELEGRAPH', { rock: rock.name });
      } else if (this.bossPhaseTimer <= 0) {
        this.restoreBossRock();
        this.bossAttackPhase = 'READY';
        this.state = 'CHASE';
      }
      return;
    }

    this.bossPhaseTimer -= delta;
    if (this.bossAttackPhase === 'TELEGRAPH') {
      if (this.bossPattern === 'CLAW') this.raiseBossClaws(0.85);
      if (this.bossPattern === 'ROCK_THROW') this.updateBossRockHeld(delta);
      if (this.bossPhaseTimer <= 0) {
        this.bossAttackPhase = 'EXECUTE';
        if (this.bossPattern === 'VOLLEY') {
          this.bossVolleyShotsRemaining = 3;
          this.bossVolleyShotTimer = 0;
          this.bossVolleyFinishTimer = -1;
        }
        this.bossPhaseTimer = this.bossPattern === 'CHARGE' ? 0.58 : this.bossPattern === 'VOLLEY' ? 0 : this.bossPattern === 'ROCK_THROW' ? 0.48 : 0.36;
        this.hideBossTelegraph();
      }
      return;
    }

    if (this.bossAttackPhase === 'EXECUTE') {
      if (this.bossPattern === 'CHARGE') {
        this.mesh.position.addScaledVector(this.bossAttackDirection, 9.5 * delta);
        this.checkBossAttackHit(playerPos, 2.8, false);
      } else if (this.bossPattern === 'CLAW') {
        this.raiseBossClaws(-0.45);
        this.checkBossAttackHit(playerPos, 3.7, true);
      } else if (this.bossPattern === 'VOLLEY') {
        this.updateBossVolley(delta, playerPos);
      } else if (this.bossPattern === 'ROCK_THROW') {
        this.updateBossRockHeld(delta);
      } else if (this.mesh.position.distanceTo(playerPos) <= 3.6 && this.bossImpactPoint.distanceTo(playerPos) <= 3.6) {
        this.applyBossAttackHit();
      }

      if (this.bossPattern !== 'VOLLEY' && this.bossPhaseTimer <= 0) {
        if (this.bossPattern === 'ROCK_THROW') this.launchBossRock(playerPos);
        this.bossAttackPhase = 'RECOVERY';
        this.bossPhaseTimer = 2.55;
        this.state = 'STUNNED';
        this.debugBossEvent('VULNERABLE_WINDOW', { durationSeconds: 2.55, pattern: this.bossPattern });
        this.mesh.rotation.z = Math.PI * 0.55;
        this.restoreBossClaws();
      }
    }
  }

  private checkBossAttackHit(playerPos: THREE.Vector3, reach: number, frontal: boolean): void {
    if (this.bossAttackHitApplied) return;
    const deltaToPlayer = EnemyController.TEMP_DIR.subVectors(playerPos, this.mesh.position);
    deltaToPlayer.y = 0;
    if (deltaToPlayer.length() > reach) return;
    if (frontal && deltaToPlayer.normalize().dot(this.bossAttackDirection) < 0.25) return;
    this.applyBossAttackHit();
  }

  private applyBossAttackHit(): void {
    if (this.bossAttackHitApplied) return;
    this.bossAttackHitApplied = true;
    this.onAttackPlayer?.(this.bossPattern === 'SLAM' ? 14 : 12);
  }

  private updateBossVolley(delta: number, playerPos: THREE.Vector3): void {
    if (this.bossVolleyShotsRemaining > 0) {
      this.bossVolleyShotTimer -= delta;
      if (this.bossVolleyShotTimer > 0) return;

      const projectile = this.bossProjectiles.find((entry) => entry.ownerId === this.id && !entry.active);
      if (!projectile) {
        // Pool saturation should never trap the boss in ATTACK.
        this.bossVolleyShotsRemaining = 0;
        this.bossVolleyFinishTimer = 0;
        return;
      }

      projectile.mesh.position.copy(this.mesh.position);
      projectile.mesh.position.y += 1.15;
      projectile.mesh.position.addScaledVector(this.bossAttackDirection, 1.45);
      projectile.velocity.subVectors(playerPos, projectile.mesh.position);
      projectile.velocity.y = 0;
      this.safeNormalize(projectile.velocity, this.bossAttackDirection);
      projectile.velocity.multiplyScalar(9.0);
      projectile.life = 2.5;
      projectile.active = true;
      projectile.mesh.visible = true;
      this.debugBossEvent('VOLLEY_PROJECTILE_FIRED', { remaining: this.bossVolleyShotsRemaining - 1 });
      this.bossVolleyShotsRemaining--;
      this.bossVolleyShotTimer = 0.48;
      if (this.bossVolleyShotsRemaining === 0) this.bossVolleyFinishTimer = 0.72;
      return;
    }

    this.bossVolleyFinishTimer -= delta;
    if (this.bossVolleyFinishTimer <= 0) this.finishBossAttack();
  }

  private updateBossProjectiles(delta: number, playerPos: THREE.Vector3): void {
    for (const projectile of this.bossProjectiles) {
      if (projectile.ownerId !== this.id || !projectile.active) continue;
      const start = EnemyController.BOSS_PROJECTILE_START.copy(projectile.mesh.position);
      const end = EnemyController.BOSS_PROJECTILE_END.copy(start).addScaledVector(projectile.velocity, delta);
      const segment = EnemyController.BOSS_PROJECTILE_SEGMENT.subVectors(end, start);
      const toPlayer = EnemyController.BOSS_PROJECTILE_TO_PLAYER.subVectors(playerPos, start);
      const segmentLengthSq = segment.lengthSq();
      const t = segmentLengthSq > 1e-8 ? THREE.MathUtils.clamp(toPlayer.dot(segment) / segmentLengthSq, 0, 1) : 0;
      const closest = EnemyController.BOSS_PROJECTILE_CLOSEST.copy(start).addScaledVector(segment, t);
      if (closest.distanceToSquared(playerPos) <= 0.78 * 0.78) {
        this.onAttackPlayer?.(6);
        this.debugBossEvent('VOLLEY_PROJECTILE_HIT', { damage: 6 });
        projectile.active = false;
        projectile.mesh.visible = false;
        continue;
      }

      projectile.mesh.position.copy(end);
      projectile.life -= delta;
      if (projectile.life <= 0) {
        projectile.active = false;
        projectile.mesh.visible = false;
      }
    }
  }

  private updateBossRockHeld(delta: number): void {
    const rock = this.bossRockTarget;
    if (!rock || this.bossRockInFlight) return;
    // Keep the lifted boulder at the claw line in world space while the
    // existing hard-surface arm pivots perform the grab and wind-up.
    const hand = this.bossRockStart.copy(this.mesh.position)
      .addScaledVector(this.bossAttackDirection, 1.25);
    hand.y += 1.65;
    rock.position.lerp(hand, 1 - Math.exp(-7.5 * delta));
    rock.rotation.x += delta * 1.4;
    rock.rotation.z += delta * 0.8;
  }

  private launchBossRock(playerPos: THREE.Vector3): void {
    const rock = this.bossRockTarget;
    if (!rock || this.bossRockInFlight) return;
    rock.position.y += 0.12;
    this.bossRockVelocity.subVectors(playerPos, rock.position);
    this.bossRockVelocity.y += 2.2;
    this.safeNormalize(this.bossRockVelocity);
    this.bossRockVelocity.multiplyScalar(12.5);
    this.bossRockFlightLife = 2.2;
    this.bossRockInFlight = true;
    this.bossAttackHitApplied = false;
    this.debugBossEvent('ARENA_ROCK_THROWN', { rock: rock.name });
  }

  private updateBossThrownRock(delta: number, playerPos: THREE.Vector3): void {
    const rock = this.bossRockTarget;
    if (!rock || !this.bossRockInFlight) return;
    this.bossRockStart.copy(rock.position);
    this.bossRockVelocity.y -= 8.5 * delta;
    this.bossRockEnd.copy(this.bossRockStart).addScaledVector(this.bossRockVelocity, delta);
    this.bossRockSegment.subVectors(this.bossRockEnd, this.bossRockStart);
    this.bossRockToPlayer.subVectors(playerPos, this.bossRockStart);
    const lengthSq = this.bossRockSegment.lengthSq();
    const t = lengthSq > 1e-8
      ? THREE.MathUtils.clamp(this.bossRockToPlayer.dot(this.bossRockSegment) / lengthSq, 0, 1)
      : 0;
    this.bossRockClosest.copy(this.bossRockStart).addScaledVector(this.bossRockSegment, t);
    const hit = !this.bossAttackHitApplied && this.bossRockClosest.distanceToSquared(playerPos) < 1.0;
    rock.position.copy(this.bossRockEnd);
    rock.rotation.x += delta * 6.0;
    rock.rotation.z += delta * 4.3;
    this.bossRockFlightLife -= delta;
    if (hit) {
      this.bossAttackHitApplied = true;
      this.onAttackPlayer?.(10);
      this.debugBossEvent('ARENA_ROCK_HIT', { damage: 10 });
    }
    if (hit || this.bossRockFlightLife <= 0 || rock.position.y <= this.bossRockHome.y) {
      this.restoreBossRock();
    }
  }

  private restoreBossRock(): void {
    const rock = this.bossRockTarget;
    if (rock) {
      rock.position.copy(this.bossRockHome);
      const homeRotation = rock.userData.homeRotation;
      if (homeRotation instanceof THREE.Euler) rock.rotation.copy(homeRotation);
      rock.visible = true;
    }
    this.bossRockTarget = null;
    this.bossRockInFlight = false;
    this.bossRockFlightLife = 0;
    this.bossRockVelocity.set(0, 0, 0);
  }

  private clearBossProjectiles(): void {
    for (const projectile of this.bossProjectiles) {
      if (projectile.ownerId !== this.id) continue;
      projectile.active = false;
      projectile.life = 0;
      projectile.velocity.set(0, 0, 0);
      projectile.mesh.visible = false;
    }
  }

  private finishBossAttack(): void {
    this.bossAttackPhase = 'RECOVERY';
    this.bossPhaseTimer = 2.55;
    this.state = 'STUNNED';
    this.debugBossEvent('VULNERABLE_WINDOW', { durationSeconds: 2.55, pattern: this.bossPattern });
    this.mesh.rotation.z = Math.PI * 0.55;
    this.restoreBossClaws();
  }

  private showBossTelegraph(): void {
    if (!this.bossWarningFill || !this.bossWarningRing || !this.bossChargeLane) return;
    const useLane = this.bossPattern === 'CHARGE';
    this.bossWarningFill.visible = !useLane;
    this.bossWarningRing.visible = !useLane;
    this.bossChargeLane.visible = useLane;
    if (useLane) {
      this.bossChargeLane.position.copy(this.mesh.position).addScaledVector(this.bossAttackDirection, 4.1);
      this.bossChargeLane.position.y = 0;
      this.bossChargeLane.rotation.y = Math.atan2(this.bossAttackDirection.x, this.bossAttackDirection.z);
      return;
    }
    const center = this.bossPattern === 'SLAM' || this.bossPattern === 'VOLLEY' || this.bossPattern === 'ROCK_THROW'
      ? this.bossImpactPoint
      : this.mesh.position.clone().addScaledVector(this.bossAttackDirection, 2.2);
    this.bossWarningFill.position.set(center.x, 0.28, center.z);
    this.bossWarningRing.position.set(center.x, 0.29, center.z);
    const color = this.bossPattern === 'SLAM' ? 0xff4d3c : 0xffbe45;
    (this.bossWarningFill.material as THREE.MeshBasicMaterial).color.setHex(color);
    (this.bossWarningRing.material as THREE.MeshBasicMaterial).color.setHex(color);
  }

  private hideBossTelegraph(): void {
    if (this.bossWarningFill) this.bossWarningFill.visible = false;
    if (this.bossWarningRing) this.bossWarningRing.visible = false;
    if (this.bossChargeLane) this.bossChargeLane.visible = false;
  }

  private raiseBossClaws(amount: number): void {
    for (const claw of this.bossClaws) {
      const rest = this.bossClawRestRotations.get(claw);
      if (rest) claw.rotation.x = rest.x + amount;
    }
  }

  private restoreBossClaws(): void {
    for (const claw of this.bossClaws) {
      const rest = this.bossClawRestRotations.get(claw);
      if (rest) claw.rotation.copy(rest);
    }
  }

  private updateBossEyeEmission(delta: number): void {
    if (this.id !== 'crab_boss' || this.bossRedEmissionMaterials.length === 0) return;
    const dangerousWindup = this.isAlive()
      && this.bossAttackPhase === 'TELEGRAPH'
      && (this.bossPattern === 'CHARGE' || this.bossPattern === 'SLAM');
    this.bossEyeWindup = THREE.MathUtils.damp(this.bossEyeWindup, dangerousWindup ? 1 : 0, dangerousWindup ? 7 : 4, delta);
    const softPulse = 0.4 + 0.14 * (0.5 + 0.5 * Math.sin(this.proceduralTime * 1.7));
    const gain = this.bossEyeWindup * softPulse;
    for (const entry of this.bossRedEmissionMaterials) {
      entry.material.emissiveIntensity = entry.baseIntensity * (1 + gain);
    }
    if (this.bossEyeGlow) {
      const material = this.bossEyeGlow.material as THREE.MeshBasicMaterial;
      material.opacity = this.bossEyeWindup * (0.12 + softPulse * 0.28);
      const scale = 1 + this.bossEyeWindup * softPulse * 0.55;
      this.bossEyeGlow.scale.setScalar(scale);
    }
    if (this.bossEyeLight) this.bossEyeLight.intensity = this.bossEyeWindup * (1.1 + softPulse * 1.6);
  }

  private animateBossTell(delta: number): void {
    if (!this.crabModel || this.state === 'DYING' || this.state === 'DEAD') return;
    this.bossHitReactionTimer = Math.max(0, this.bossHitReactionTimer - delta);
    this.bossAlertTimer = Math.max(0, this.bossAlertTimer - delta);
    const attacking = this.state === 'ATTACK';
    const recovering = this.state === 'STUNNED' || this.bossAttackPhase === 'RECOVERY';
    const pursuing = this.state === 'CHASE' || this.state === 'PATROL';
    const pose = this.bossHitReactionTimer > 0 ? 'HIT_REACTION'
      : attacking && this.bossAttackPhase === 'TELEGRAPH' ? 'ATTACK_PREP'
      : attacking && this.bossAttackPhase === 'EXECUTE' ? 'ATTACK'
      : recovering ? 'RECOVERY'
      : this.bossAlertTimer > 0 ? 'ALERT'
      : pursuing ? 'CHASE' : 'IDLE';
    this.bossCombatPoseState = pose;

    // The supplied boss GLB is a hard-surface part rig rather than a skinned
    // animation rig. Pose its existing model and appendage pivots by combat
    // phase so tells, movement, impact and recovery read as one state machine.
    const lift = pose === 'ATTACK_PREP' && this.bossPattern === 'CLAW' ? 0.2 : 0;
    const gaitBob = pursuing ? Math.abs(Math.sin(this.proceduralTime * 1.35)) * 0.045 : 0;
    const idleBreath = pose === 'IDLE' ? Math.sin(this.proceduralTime * 0.72) * 0.025 : 0;
    const hitDip = pose === 'HIT_REACTION' ? -0.13 : 0;
    const poseLift = pose === 'ATTACK_PREP' ? 0.08 : pose === 'RECOVERY' ? -0.08 : 0;
    this.crabModel.position.y = this.bossModelBaseY + lift + gaitBob + idleBreath + hitDip + poseLift;
    const pitch = pose === 'ATTACK_PREP' ? -0.14 : pose === 'ATTACK' ? 0.25
      : pose === 'RECOVERY' ? 0.18 : pose === 'HIT_REACTION' ? -0.25
      : pose === 'ALERT' ? -0.09 : pose === 'CHASE' ? 0.035 : Math.sin(this.proceduralTime * 0.72) * 0.012;
    const roll = pose === 'HIT_REACTION' ? 0.12 * Math.sin(this.proceduralTime * 22) : 0;
    this.crabModel.rotation.x = THREE.MathUtils.damp(this.crabModel.rotation.x, this.bossModelBaseRotation.x + pitch, 10, delta);
    this.crabModel.rotation.z = THREE.MathUtils.damp(this.crabModel.rotation.z, this.bossModelBaseRotation.z + roll, 9, delta);
  }

  private animateLegs(delta: number): void {
    if (this.state === 'FLIPPED' || this.state === 'DYING' || this.state === 'DEAD') return;
    if (this.id === 'crab_boss') {
      const pursuing = this.state === 'CHASE' || this.state === 'PATROL';
      const gaitPhase = this.proceduralTime * 1.6;
      for (const leg of this.bossLegPivots) {
        const target = leg.restX + (pursuing ? Math.sin(gaitPhase + leg.phase) * 0.34 : Math.sin(this.proceduralTime * 0.55 + leg.phase) * 0.025);
        leg.pivot.rotation.x = THREE.MathUtils.damp(leg.pivot.rotation.x, target, pursuing ? 13 : 5, delta);
      }
      // The original GLB combines each hand and arm into one mesh. We split
      // its mirrored sides at load and pivot them at the shoulders so the
      // pursuit reads as a playful, reaching robot rather than a rigid sign.
      for (const arm of this.bossArmPivots) {
        const side = arm.side ?? (Math.sin(arm.phase) < 0 ? -1 : 1);
        const phase = this.bossCombatPoseState;
        const gait = Math.sin(this.proceduralTime * (pursuing ? 1.8 : 0.55) + arm.phase);
        let targetX = arm.restX + gait * (pursuing ? 0.24 : 0.035);
        let targetZ = arm.restZ + Math.sin(this.proceduralTime * 0.7 + arm.phase) * (pursuing ? 0.045 : 0.012);
        if (phase === 'ALERT') { targetX = arm.restX - 0.28; targetZ = arm.restZ + side * 0.12; }
        else if (phase === 'ATTACK_PREP' && this.bossPattern === 'ROCK_THROW') { targetX = arm.restX - 0.9; targetZ = arm.restZ - side * 0.22; }
        else if (phase === 'ATTACK_PREP') { targetX = arm.restX - 0.82; targetZ = arm.restZ + side * 0.2; }
        else if (phase === 'ATTACK' && this.bossPattern === 'ROCK_THROW') { targetX = arm.restX + 1.15; targetZ = arm.restZ + side * 0.24; }
        else if (phase === 'ATTACK') { targetX = arm.restX + (side < 0 ? 0.95 : -0.65); targetZ = arm.restZ - side * 0.16; }
        else if (phase === 'RECOVERY') { targetX = arm.restX + 0.2; targetZ = arm.restZ + side * 0.08; }
        else if (phase === 'HIT_REACTION') { targetX = arm.restX + side * 0.72; targetZ = arm.restZ + side * 0.3; }
        arm.pivot.rotation.x = THREE.MathUtils.damp(arm.pivot.rotation.x, targetX, phase === 'ATTACK' ? 20 : 9, delta);
        arm.pivot.rotation.z = THREE.MathUtils.damp(arm.pivot.rotation.z, targetZ, 10, delta);
      }
      return;
    }
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
    if (this.groundHeightOverride !== null) {
      // Do not let the outdoor terrain resolver lift underground enemies onto
      // the surface while they chase Wukong.
      this.mesh.position.y = this.groundHeightOverride;
    } else if (level && level.getTerrainHeight) {
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
    for (const material of this.bossOwnedMaterials) material.dispose();
    this.bossOwnedMaterials.clear();
    this.bossEyeGlow?.geometry.dispose();
    (this.bossEyeGlow?.material as THREE.Material | undefined)?.dispose();
    this.bossDeathParticles?.geometry.dispose();
    (this.bossDeathParticles?.material as THREE.Material | undefined)?.dispose();
    this.bossDeathParticles = null;
    this.bossDeathParticleOrigins.length = 0;
    this.bossDeathParticleVelocities.length = 0;
    for (const geometry of this.bossGeneratedGeometry) geometry.dispose();
    this.bossGeneratedGeometry.length = 0;
    this.bossLegPivots.length = 0;
    this.bossArmPivots.length = 0;
    this.bossEyeGlow = null;
    this.bossEyeLight = null;
    this.bossRedEmissionMaterials.length = 0;
    this.meshMaterialEmissionBases.clear();
    this.onDeath = undefined;
    this.onAttackPlayer = undefined;
  }
}
