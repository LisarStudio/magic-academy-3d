import * as THREE from 'three';
import { isLowPowerDevice, isMobileDevice } from '../core/DevicePerformance';
import { SceneManager } from '../core/SceneManager';
import { CameraController } from '../camera/CameraController';
import { PlayerController } from '../player/PlayerController';
import { InputManager } from '../core/InputManager';
import { TextureGenerator } from '../world/TextureGenerator';
import { Door } from '../world/Door';
import { DestructiblePot } from '../world/DestructiblePot';
import { TreasureChest } from '../world/TreasureChest';
import { LumosGargoyle } from '../world/LumosGargoyle';
import { SpellSystem } from '../spells/SpellSystem';
import { CheckpointManager } from '../world/CheckpointManager';
import { CollectibleSystem } from '../collectibles/CollectibleSystem';
import { TriggerZone } from '../interaction/TriggerZone';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ChestCinematic } from './ChestCinematic';
import { SubtitleSystem } from '../ui/SubtitleSystem';
import { AudioManager } from '../core/AudioManager';
import { EnemyController } from '../enemies/EnemyController';
import { GekkoNPC } from '../npc/GekkoNPC';
import { MovingPlatform } from '../world/MovingPlatform';
import { KeyPickupSequence, type KeyData } from '../player/KeyPickupSequence';
import { RunicPortal, PortalManager } from '../world/RunicPortal';
import { DayNightCycle } from '../world/DayNightCycle';
import { WorldWindController } from '../world/WorldWindController';
import { applyGoldenTempleLut } from '../world/GoldenTempleLut';
import { SkyPanoramaSystem, skyBlendForHour } from '../world/SkyPanoramaSystem';
import { ConstellationSystem } from '../world/ConstellationSystem';
import { VolcanicDragonRun } from './VolcanicDragonRun';
import { PowerOrbSystem, type StaffUpgradeInfo } from '../collectibles/PowerOrbSystem';
import { TreeSnakeEnemy } from '../enemies/TreeSnakeEnemy';
import { getKeyAsset, loadKeyModel, preloadKeyModel } from '../collectibles/KeyAssetCatalog';
import { TwinCatsChallenge } from './TwinCatsChallenge';
import { projectDialogueFocus } from '../ui/CinematicDialogueUI';

const keyHaloGeometry = new THREE.TorusGeometry(0.27, 0.012, 6, 24);
const keySparkGeometry = new THREE.OctahedronGeometry(0.026, 0);

export class LevelToyStory {
  private sceneManager: SceneManager;
  private cameraController: CameraController;
  private player: PlayerController;
  private inputManager: InputManager;
  private spellSystem: SpellSystem;
  private checkpointManager: CheckpointManager;
  private collectibleSystem: CollectibleSystem;
  private subtitleSystem: SubtitleSystem;
  private audioManager: AudioManager;
  private onResourceProgress?: (loaded: number, total: number, url: string) => void;
  public dayNightCycle!: DayNightCycle;

  public levelColliders: THREE.Object3D[] = [];
  // Shared invisible material for exact, detached instanced mountain meshes.
  // They are raycast-only and never enter the render list.
  private readonly horizonRockCollisionMaterial = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  // Exact walkable outline of world-terrain (160 x 160, centered at z=-40).
  // Do not extend this polygon into the old western annex: there is no terrain
  // mesh there, so it let Wukong walk off the field beneath the mountain ring.
  private readonly worldBoundaryXZ: readonly [number, number][] = [
    [-80, -120], [80, -120], [80, 40], [-80, 40],
  ];
  public triggerZones: TriggerZone[] = [];
  public doors: Door[] = [];
  public pots: DestructiblePot[] = [];
  public chests: TreasureChest[] = [];
  public enemies: EnemyController[] = [];
  public gargoyles: LumosGargoyle[] = [];
  public movingPlatforms: MovingPlatform[] = [];
  public portalManager = new PortalManager();

  // Key tracking
  public collectedKeys = {
    key1_gekko: false, // 50 coins quest
    key2_boss: false,  // boss arena
    key3_platform: false, // existing third-key slot, now awarded as the Qi key in the tree challenge
    key4_curiosity: false,
    key5_pots: false,
    key6_gargoyles: false,
  };
  public totalKeysCount = 0;

  // Level Entities
  private staffChest!: TreasureChest;
  public exitDoor!: Door;
  private gekkoNPC!: GekkoNPC;
  private gekkoModelsReady: Promise<void> = Promise.resolve();
  private twinCatsChallenge!: TwinCatsChallenge;
  public letterChallengeCompleted = false;
  public manekiNekoCollected = false;
  private floatingCoinMesh!: THREE.Group;
  private dragonSwitchMesh!: THREE.Group;
  private dragonLeverStick!: THREE.Mesh;
  public isLavaVaultOpen = false;
  public isTeleportingToCrypt = false;
  private lavaVaultHatch!: THREE.Mesh;
  private curiosityCryptMouth!: THREE.Group;
  private portalAsset: THREE.Group | null = null;
  private curiosityCryptTrail!: THREE.Group;
  private grassUniforms: any = null;
  private readonly worldWind = new WorldWindController();
  // Reused scratch transforms for the rare animated-tree gust path. The old
  // loop allocated several matrices per affected tree on every frame.
  private readonly treeSwayPivot = new THREE.Matrix4();
  private readonly treeSwayUnpivot = new THREE.Matrix4();
  private readonly treeSwayRotation = new THREE.Matrix4();
  private readonly treeSwayTransform = new THREE.Matrix4();
  private readonly treeSwayEuler = new THREE.Euler();
  private grassSectors: THREE.InstancedMesh[] = [];
  private terrainGroundMaterial: THREE.MeshStandardMaterial | null = null;
  private worldTerrainMesh: THREE.Mesh | null = null;
  /** World-space center lines and safe widths for every authored stone route. */
  private vegetationPathMasks: Array<{ points: THREE.Vector2[]; halfWidth: number }> = [];
  private grassLoadStarted = false;
  private grassLoadPromise: Promise<void> | null = null;
  private grassCullElapsed = 0;
  private grassQuality = 0.85;
  private centralTempleObject: THREE.Object3D | null = null;
  private structureColliderCandidates: Array<{ root: THREE.Object3D; center: THREE.Vector3; radius: number; active: boolean }> = [];
  private cloudsUniforms: any = null;
  private skyAnchor: THREE.Group | null = null;
  private horizonPaletteMaterials: THREE.MeshBasicMaterial[] = [];
  private readonly horizonDayTintScratch = new THREE.Color();
  private readonly horizonDuskTintScratch = new THREE.Color();
  private readonly horizonTintScratch = new THREE.Color();
  private horizonPaletteElapsed = 0;
  private moonMaterial: THREE.MeshBasicMaterial | null = null;
  private starMaterial: THREE.ShaderMaterial | null = null;
  private cryptPortalMaterial: THREE.ShaderMaterial | null = null;
  private cryptEntranceGlow: THREE.PointLight | null = null;
  private arenaMoonFill: THREE.PointLight | null = null;
  private exteriorMoonlightGroup: THREE.Group | null = null;
  private exteriorMoonBeamMaterial: THREE.ShaderMaterial | null = null;
  private templeWindowGlowMaterial: THREE.ShaderMaterial | null = null;
  private exteriorMoonBeams: Array<{ root: THREE.Group; start: THREE.Vector3; end: THREE.Vector3; phase: number; yaw: number }> = [];
  private exteriorMoonTime = 0;
  private exteriorMoonOrbs: THREE.Points | null = null;
  private exteriorMoonOrbBase: Float32Array | null = null;
  private exteriorMoonOrbPhase: Float32Array | null = null;
  private exteriorMoonOrbElapsed = 0;
  private readonly templeInteriorLights: THREE.PointLight[] = [];
  private constellationSystem: ConstellationSystem | null = null;
  private skyPanorama: SkyPanoramaSystem | null = null;
  private skyDebugPanel: HTMLElement | null = null;
  private skyDebugElapsed = 0;
  private optionalArchitectureStarted = false;
  private optionalArchitectureLoading = false;
  private optionalHouseFloorCollider: THREE.Mesh | null = null;
  private optionalHouseLightingGroup: THREE.Group | null = null;
  private readonly highHouseCenter = new THREE.Vector3(38, 0, -92);
  // The GLB has a walkable ground-floor plane at local Y=0.10 and an upper
  // deck at local Y=6.10. Its lowest vertex is Y=-0.0364, so these offsets
  // align collision tops with the measured surfaces after terrain placement.
  private readonly abandonedHouseDeckHeight = 0.1364;
  private readonly abandonedHouseUpperDeckHeight = 6.1364;
  private centralTempleFloorTopY: number | null = null;
  private centralTempleFloorWidth = 0;
  private centralTempleFloorDepth = 0;
  private centralTempleFloorCenterZ = -40;
  private lavaUniforms: { uTime: { value: number } } | null = null;
  private lavaEmberUniforms: { uTime: { value: number } } | null = null;
  private lavaLight: THREE.PointLight | null = null;
  private lavaBubbles: Array<{ mesh: THREE.Mesh; phase: number; baseY: number }> = [];
  private dragonRun: VolcanicDragonRun | null = null;
  private powerOrbSystem: PowerOrbSystem | null = null;
  private curiosityChest!: TreasureChest;
  private cryptLightingGroup: THREE.Group | null = null;
  private cryptDust: THREE.Points | null = null;
  private cryptDustBasePositions: Float32Array | null = null;
  private cryptDustPhases: Float32Array | null = null;
  private cryptDustTime = 0;
  private cryptWalkableSurfaces: THREE.Mesh[] = [];
  private cryptGuardians: EnemyController[] = [];
  private cryptGuardiansCleared = false;
  private curiosityKeyPreloadStarted = false;
  private curiosityKeyRetryAt = 0;
  private curiosityKeyRewardReady = false;
  private lifePickupSource: THREE.Object3D | null = null;
  private lifePickups: Array<{
    id: string; root: THREE.Group; item: THREE.Object3D;
    groundY: number; phase: number; collected: boolean; fade: number;
  }> = [];
  private collectedLifePickupIds = new Set<string>();
  private lifeSparkles: THREE.InstancedMesh | null = null;
  private lifePickupElapsed = 0;
  public curiosityChestOpen = false;
  private curiosityKeySpawned = false;
  private hatchPivot!: THREE.Group;
  private hatchOpenProgress = 0;
  private hatchTarget = 0;
  // Set the crypt away from the paved route so its reveal never obstructs the
  // approach to the temple or its stair landing.
  // Keep the entrance inside the playable boundary. The old x=-75 anchor sat
  // only 5 m from the western edge, underneath the inward reach of the rocks.
  private readonly curiosityCryptSurface = new THREE.Vector3(-61, 0, -110);
  private readonly curiosityCryptFloorY = -5.9;
  private readonly npcGazePoint = new THREE.Vector3();
  private readonly gekkoLookTarget = new THREE.Vector3();
  private readonly curiosityCryptRoomEntry = new THREE.Vector3(-22.25, -5.9, -40);
  private readonly curiosityCryptReturnPoint = new THREE.Vector3(-10.0, -5.9, -40);
  private isInsideCuriosityCrypt = false;
  private curiosityCryptTransitioning = false;
  /** Set only for a lethal hit from a crypt guardian; death returns Wukong to the surface entrance. */
  private respawnFromCuriosityCrypt = false;
  private canopyTrial: {
    base: THREE.Vector3;
    top: THREE.Vector3;
    middle: THREE.Vector3;
    landing: THREE.Vector3;
    firstPath: THREE.QuadraticBezierCurve3;
    secondPath: THREE.QuadraticBezierCurve3;
    treeBases: THREE.Vector3[];
    routePoints: THREE.Vector3[];
    routePaths: THREE.QuadraticBezierCurve3[];
  } | null = null;
  private canopyTutorialShown = false;
  private canopyRewardClaimed = false;
  private canopyChest: TreasureChest | null = null;
  private canopyChestOpen = false;
  private canopyRewardHint: THREE.Object3D | null = null;
  private canopyTrialActivated = false;
  private canopyTrialCompleted = false;
  private canopyActivationProgress = 0;
  private canopyPlatformsMaterial: THREE.MeshStandardMaterial | null = null;
  private canopyRouteVisuals: THREE.Object3D[] = [];
  private canopyPlatformColliders: THREE.Mesh[] = [];
  private canopyFireflies: Array<{ mesh: THREE.Mesh; phase: number; radius: number }> = [];
  private canopyTraversal: 'climb' | 'top' | 'swing' | null = null;
  private canopyTraversalCurve: THREE.QuadraticBezierCurve3 | null = null;
  private canopyTraversalElapsed = 0;
  private canopyTraversalDuration = 1.2;
  private canopyRouteIndex = -1;
  private introKeyCelebrationInProgress = false;
  private leverTarget = Math.PI / 4;
  private readonly secretLavaCenter = new THREE.Vector2(66, -105);
  private secretLavaY = -11.2;

  public getTerrainHeight(x: number, z: number): number {
    const naturalHeight = this.getUnmodifiedTerrainHeight(x, z);

    // Remote eastern volcanic basin: the same terrain function drives the
    // visible surface, foliage placement, and the player ground ray.
    const lavaDistance = Math.hypot(x - 66, z + 105);
    const basinBlend = 1 - THREE.MathUtils.smoothstep(lavaDistance, 15, 36);
    let finalHeight = THREE.MathUtils.lerp(naturalHeight, -13.2, basinBlend);

    // Apply the cabin footprint after the remote basin blend. The old order
    // flattened first and then let the volcanic depression re-slope the east
    // side of the house through its lower floor and post bases.
    const houseEdgeDistance = Math.max(
      Math.abs(x - this.highHouseCenter.x) - 8.95,
      Math.abs(z - this.highHouseCenter.z) - 10.25,
    );
    if (houseEdgeDistance < 3.0) {
      const cabinBaseHeight = this.getUnmodifiedTerrainHeight(this.highHouseCenter.x, this.highHouseCenter.z);
      const slopeBlend = THREE.MathUtils.smoothstep(houseEdgeDistance, 0, 3.0);
      finalHeight = THREE.MathUtils.lerp(cabinBaseHeight, finalHeight, slopeBlend);
    }
    return finalHeight;
  }

  private getUnmodifiedTerrainHeight(x: number, z: number): number {
    // Gameplay zones (Castle fortress, arena, front entrance road) are strictly flat at y = 0.0
    const castleDist = Math.max(Math.abs(x) - 14, Math.abs(z + 40) - 15);
    const arenaDist = Math.hypot(x - 45, z + 40) - 15;

    let blend = 1.0;
    if (castleDist < 8) blend *= Math.max(0, castleDist / 8);
    if (arenaDist < 8) blend *= Math.max(0, arenaDist / 8);
    if (z > -22 && Math.abs(x) < 9) blend *= Math.max(0, Math.abs(x) / 9);

    const hill1 = Math.sin(x * 0.05 + z * 0.04) * 2.2;
    const hill2 = Math.cos(x * 0.09 - z * 0.07) * 1.4;
    const knoll = Math.sin(x * 0.15) * Math.sin(z * 0.15) * 0.8;
    return (hill1 + hill2 + knoll) * blend;
  }

  private getAbandonedHouseFloorTopY(): number {
    return this.getTerrainHeight(this.highHouseCenter.x, this.highHouseCenter.z) + this.abandonedHouseDeckHeight;
  }

  private getAbandonedHouseUpperFloorTopY(): number {
    return this.getTerrainHeight(this.highHouseCenter.x, this.highHouseCenter.z) + this.abandonedHouseUpperDeckHeight;
  }

  /** Keep the player ground resolver on the crypt floor during transitions. */
  public isPlayerInsideCuriosityCrypt(): boolean {
    return this.isInsideCuriosityCrypt || this.curiosityCryptTransitioning;
  }

  /** Explicit fallback floor for the enclosed chamber when a ray misses its thin floor collider. */
  public getCuriosityCryptFloorY(): number {
    return this.curiosityCryptFloorY;
  }

  /** Only the three low altar surfaces need extra ground sampling underground. */
  public getCuriosityCryptWalkableSurfaces(): THREE.Mesh[] {
    return this.cryptWalkableSurfaces;
  }

  private isVegetationNearPath(x: number, z: number, clearance = 1.8): boolean {
    for (const path of this.vegetationPathMasks) {
      for (let i = 0; i < path.points.length - 1; i++) {
        const a = path.points[i], b = path.points[i + 1];
        const dx = b.x - a.x, dz = b.y - a.y;
        const lengthSq = dx * dx + dz * dz || 1;
        const t = THREE.MathUtils.clamp(((x - a.x) * dx + (z - a.y) * dz) / lengthSq, 0, 1);
        if (Math.hypot(x - (a.x + dx * t), z - (a.y + dz * t)) < path.halfWidth + clearance) return true;
      }
    }
    return false;
  }

  /** Applies the same quality choice as the renderer to vegetation LOD ranges. */
  public setGrassQuality(quality: number): void {
    this.grassQuality = [0.65, 0.85, 1].includes(quality) ? quality : 0.85;
    this.grassCullElapsed = 0;
  }

  // Quest states & Gekko Mission State Machine
  public gekkoMissionState: 'NOT_STARTED' | 'MISSION_ACTIVE' | 'MISSION_COMPLETE' | 'REWARD_GIVEN' = 'NOT_STARTED';
  private isCinematicPlaying = false;
  private coinsExchanged = false;
  private litGargoylesCount = 0;
  private specialPotsSmashed = 0;
  private totalSpecialPots = 5;
  private combatTutorialShown = false;

  // Generic Key Registry with Color Data
  public keyDefinitions: Record<string, KeyData> = {
    key1_gekko: { id: 'key1_gekko', name: 'Llave de la Riqueza (Gekko)', color: 0xffc94e, emissiveColor: 0xffb51b, obtained: false, modelUrl: getKeyAsset('key1_gekko')?.modelUrl },
    key2_boss: { id: 'key2_boss', name: 'Llave de la Valentía (Jefe Cangrejo)', color: 0x62dfff, emissiveColor: 0x248ccc, obtained: false, modelUrl: getKeyAsset('key2_boss')?.modelUrl },
    key3_platform: { id: 'key3_platform', name: 'Llave del Qi Celestial', color: 0x62dfff, emissiveColor: 0x2fb8ed, obtained: false, modelUrl: getKeyAsset('key3_platform')?.modelUrl },
    key4_curiosity: { id: 'key4_curiosity', name: 'Llave de la Curiosidad', color: 0xc49aff, emissiveColor: 0x7748bd, obtained: false, modelUrl: getKeyAsset('key4_curiosity')?.modelUrl },
    key6_gargoyles: { id: 'key6_gargoyles', name: 'Llave del Secreto (Gargolas)', color: 0xffbd70, emissiveColor: 0xbf6b2b, obtained: false, modelUrl: getKeyAsset('key6_gargoyles')?.modelUrl },
    key5_pots: { id: 'key5_pots', name: 'Llave de Destrucción (Gemas)', color: 0xff493c, emissiveColor: 0xff5533, obtained: false, modelUrl: getKeyAsset('key5_pots')?.modelUrl },
  };

  // Visual markers for keys
  private keysMeshes: THREE.Group[] = [];

  // Boss reference
  private bossEnemy!: EnemyController;
  private bossEncounterActive = false;

  public stateFlags = {
    introCompleted: false,
    staffFound: false,
    gekkoTalked: false,
    bossCinematicPlayed: false,
    bossDefeated: false,
    levelCompleted: false,
    introKeysCelebrated: false
  };

  constructor(
    sceneManager: SceneManager,
    cameraController: CameraController,
    player: PlayerController,
    inputManager: InputManager,
    spellSystem: SpellSystem,
    checkpointManager: CheckpointManager,
    collectibleSystem: CollectibleSystem,
    subtitleSystem: SubtitleSystem,
    audioManager: AudioManager,
    onResourceProgress?: (loaded: number, total: number, url: string) => void
  ) {
    this.sceneManager = sceneManager;
    this.cameraController = cameraController;
    this.player = player;
    this.inputManager = inputManager;
    this.spellSystem = spellSystem;
    this.checkpointManager = checkpointManager;
    this.collectibleSystem = collectibleSystem;
    this.subtitleSystem = subtitleSystem;
    this.audioManager = audioManager;
    this.onResourceProgress = onResourceProgress;
    this.player.onRespawn = () => {
      if (this.respawnFromCuriosityCrypt) {
        this.respawnFromCuriosityCrypt = false;
        // The guardian's lethal hit respawns at the outdoor mouth. Restore the
        // surface world before the next player ground-resolution frame so the
        // underground floor cannot leave Wukong suspended beneath the map.
        this.isInsideCuriosityCrypt = false;
        this.curiosityCryptTransitioning = false;
        this.isTeleportingToCrypt = false;
        if (this.worldTerrainMesh) this.worldTerrainMesh.visible = true;
        for (const guardian of this.cryptGuardians) guardian.mesh.visible = false;
        this.player.isGrounded = false;
        this.player.jumpCount = 0;
        this.player.velocity.set(0, 0, 0);
        this.player.mesh.updateMatrixWorld(true);
        this.cameraController.snapBehindTarget();
      }
      queueMicrotask(() => this.handleBossPlayerRespawn());
    };
  }

  public async init(): Promise<void> {
    const portalAssetPromise = this.loadCelestialPortalAsset();
    this.buildToyStoryLevelGeometry();
    this.buildWorldPerimeter();
    this.buildMountainBackdrop();
    this.powerOrbSystem = new PowerOrbSystem(this.sceneManager.scene, (count) => {
      const equipment = (window as any).gameInstance?.hud?.equipmentViewer;
      equipment?.refreshProgression();
      if (count > 0) this.audioManager.playCardPickup();
    });
    this.setupCheckpoints();
    this.setupInteractiveProps();
    this.setupCollectibles();
    this.setupEnemies();
    this.setupNPCs();
    this.setupTriggers();
    
    // Add nightly ambient, hemisphere, and moon lighting
    const scene = this.sceneManager.scene;
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.007);

    // Broad moonlit fill keeps authored temple textures legible without
    // adding per-object lights or another shadow pass.
    const ambientLight = new THREE.AmbientLight(0x7183a6, 0.78);
    const hemiLight = new THREE.HemisphereLight(0xa8c4e8, 0x272b25, 0.78);
    
    const moonLight = new THREE.DirectionalLight(0xc5dcff, 1.45);
    moonLight.position.set(40, 80, -60);
    // SceneManager's main directional light already provides the gameplay
    // shadow map. A second 2048² shadow pass doubled mobile shadow work without
    // adding meaningful contact detail.
    moonLight.castShadow = false;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 200;
    const d = 60;
    moonLight.shadow.camera.left = -d;
    moonLight.shadow.camera.right = d;
    moonLight.shadow.camera.top = d;
    moonLight.shadow.camera.bottom = -d;
    moonLight.shadow.bias = -0.0003;

    // Subtle Rim Light from rear for separation of Wukong and Castle silhouettes
    const rimLight = new THREE.DirectionalLight(0x55c5e8, 0.9);
    rimLight.position.set(-30, 20, -80);

    scene.add(ambientLight, hemiLight, moonLight, rimLight);

    // Anchor distant sky objects to the level's player position so the dome,
    // moon and stars remain at a consistent distance throughout exploration.
    const skyAnchor = new THREE.Group();
    skyAnchor.name = 'world_sky_anchor';
    this.skyAnchor = skyAnchor;

    // A small procedural albedo gives the existing moon readable crater
    // relief without adding another image download or draw call.
    const moonCanvas = document.createElement('canvas');
    moonCanvas.width = 512;
    moonCanvas.height = 256;
    const moonContext = moonCanvas.getContext('2d');
    if (moonContext) {
      moonContext.fillStyle = '#c8d0dc';
      moonContext.fillRect(0, 0, moonCanvas.width, moonCanvas.height);
      let moonSeed = 173;
      const moonRandom = () => {
        moonSeed = (moonSeed * 16807) % 2147483647;
        return (moonSeed - 1) / 2147483646;
      };
      for (let i = 0; i < 170; i++) {
        const x = moonRandom() * moonCanvas.width;
        const y = moonRandom() * moonCanvas.height;
        const radius = 2 + moonRandom() * 13;
        const shade = Math.floor(132 + moonRandom() * 73);
        moonContext.beginPath();
        moonContext.arc(x, y, radius, 0, Math.PI * 2);
        moonContext.fillStyle = `rgba(${shade},${shade + 4},${shade + 10},${0.12 + moonRandom() * 0.23})`;
        moonContext.fill();
        moonContext.beginPath();
        moonContext.arc(x - radius * 0.12, y - radius * 0.18, radius * 0.82, Math.PI * 1.05, Math.PI * 1.9);
        moonContext.strokeStyle = 'rgba(246,249,255,0.18)';
        moonContext.lineWidth = Math.max(1, radius * 0.12);
        moonContext.stroke();
      }
    }
    const moonTexture = new THREE.CanvasTexture(moonCanvas);
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    const moonGeo = new THREE.SphereGeometry(5.5, 32, 24);
    const moonMat = new THREE.MeshBasicMaterial({ map: moonTexture, color: 0xe7edf7, transparent: true });
    this.moonMaterial = moonMat;
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.name = 'world_moon';
    moonMesh.position.set(-47, 76, -92);

    const glowGeo = new THREE.SphereGeometry(7.5, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    moonMesh.add(glowMesh);
    // The supplied night panorama already contains a moon disk. Showing this
    // procedural sphere at the same time creates an obvious double moon.
    moonMesh.visible = false;
    skyAnchor.add(moonMesh);

    // Create Procedural AAA Stylized Clouds Dome
    const cloudDomeGeo = new THREE.SphereGeometry(140, 32, 24);
    const cloudMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uNightIntensity: { value: 1 },
        // Mobile uses a single cloud octave; desktop retains the layered field.
        // Keep the choice fixed per device instead of branching on every frame.
        uCloudDetail: { value: isLowPowerDevice() ? 0.45 : 1.0 },
        uSkyColor: { value: new THREE.Color(0x020617) },
        uCloudColor: { value: new THREE.Color(0x52698a) },
        uMoonColor: { value: new THREE.Color(0x93c5fd) },
        uMoonPos: { value: new THREE.Vector3(-47, 76, -92).normalize() }
      },
      vertexShader: `
        varying vec3 vSkyDirection;
        void main() {
          vSkyDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uNightIntensity;
        uniform vec3 uSkyColor;
        uniform vec3 uCloudColor;
        uniform vec3 uMoonColor;
        uniform vec3 uMoonPos;

        varying vec3 vSkyDirection;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        uniform float uCloudDetail;

        // Two inexpensive samples create broad cloud masses. The lower-cost
        // mobile path skips fine detail while keeping the same cloud coverage.
        float cloudNoise(vec2 p) {
          float broad = noise(p);
          if (uCloudDetail < 0.75) return broad;
          return broad * 0.72 + noise(p * 2.03) * 0.28;
        }

        void main() {
          vec3 dir = normalize(vSkyDirection);
          if (dir.y < -0.05) discard;

          vec2 uv1 = dir.xz * 3.1 + vec2(uTime * 0.012, uTime * 0.008);
          vec2 uv2 = dir.xz * 5.1 + vec2(-uTime * 0.016, uTime * 0.012);
          float broadClouds = cloudNoise(uv1);
          float fineClouds = uCloudDetail < 0.75 ? broadClouds : noise(uv2);
          float cloudDensity = smoothstep(0.39, 0.68, broadClouds * 0.76 + fineClouds * 0.24);
          
          float horizonFade = smoothstep(-0.02, 0.3, dir.y);
          cloudDensity *= horizonFade;

          vec3 moonDir = normalize(uMoonPos);
          float moonRim = max(0.0, dot(dir, moonDir));
          float moonGlow = pow(moonRim, 8.0) * 0.34;

          // A subtle galactic band follows a fixed celestial great circle.
          // It is part of the sky shader, not a camera-facing overlay.
          vec3 galaxyNormal = normalize(vec3(-0.29, 0.88, 0.37));
          float galaxyBand = exp(-pow(abs(dot(dir, galaxyNormal)) * 8.4, 2.0));
          float galaxyTexture = 0.52 + 0.48 * noise(dir.xz * 12.0 + vec2(dir.y * 4.0));
          vec3 galaxyColor = mix(vec3(0.035, 0.075, 0.22), vec3(0.11, 0.17, 0.39), galaxyTexture);
          vec3 finalColor = mix(uSkyColor, uCloudColor, cloudDensity * 0.82);
          finalColor += galaxyColor * galaxyBand * (0.22 + 0.24 * galaxyTexture);
          finalColor += vec3(0.018, 0.035, 0.095) * pow(galaxyBand, 2.5);
          finalColor += uMoonColor * moonGlow;

          float galaxyAlpha = galaxyBand * 0.48 * uNightIntensity;
          gl_FragColor = vec4(finalColor, clamp(max(cloudDensity * 0.78, max(moonGlow * 0.35, galaxyAlpha)) * horizonFade, 0.0, 0.88));
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    const skyDome = new THREE.Mesh(cloudDomeGeo, cloudMat);
    skyDome.name = 'world_cloud_dome';
    skyDome.renderOrder = -3;
    // The approved four panoramas provide their own clouds and horizon.
    skyDome.visible = false;
    skyAnchor.add(skyDome);
    this.cloudsUniforms = cloudMat.uniforms;

    // Constellation points are appended to the ordinary distant star field.
    // A fixed seed keeps the sky stable between loads and across devices.
    const ambientStarCount = 640;
    const constellationStarCount = 22;
    const starCount = ambientStarCount + constellationStarCount;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starPhases = new Float32Array(starCount);
    let skySeed = 0x6d2b79f5;
    const skyRandom = () => {
      skySeed = (Math.imul(skySeed ^ (skySeed >>> 15), skySeed | 1) + 0x3d) | 0;
      skySeed ^= skySeed + Math.imul(skySeed ^ (skySeed >>> 7), skySeed | 61);
      return ((skySeed ^ (skySeed >>> 14)) >>> 0) / 4294967296;
    };
    const skyPalette = [
      new THREE.Color(0xe2edff),
      new THREE.Color(0xffffff),
      new THREE.Color(0x9cc7ff),
      new THREE.Color(0xffe5b2),
    ];

    for (let i = 0; i < ambientStarCount; i++) {
      const theta = skyRandom() * Math.PI * 2;
      const yFraction = 0.035 + skyRandom() * 0.94;
      const radius = 132 + skyRandom() * 7;
      const ring = Math.sqrt(1 - yFraction * yFraction);
      const x = radius * ring * Math.cos(theta);
      const y = radius * yFraction;
      const z = radius * ring * Math.sin(theta);
      
      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      const palette = skyPalette[Math.floor(skyRandom() * skyPalette.length)];
      const intensity = 0.68 + skyRandom() * 0.32;
      starColors[i * 3] = palette.r * intensity;
      starColors[i * 3 + 1] = palette.g * intensity;
      starColors[i * 3 + 2] = palette.b * intensity;
      // Most stars stay tiny pinpoints; only a few become gentle highlights.
      starSizes[i] = skyRandom() < 0.035 ? 1.25 + skyRandom() * 0.42 : 0.42 + skyRandom() * 0.55;
      starPhases[i] = skyRandom() * Math.PI * 2;
    }

    for (let i = ambientStarCount; i < starCount; i++) {
      starColors[i * 3] = 0.76;
      starColors[i * 3 + 1] = 0.76;
      starColors[i * 3 + 2] = 0.82;
      starSizes[i] = 1.45;
      starPhases[i] = skyRandom() * Math.PI * 2;
    }
    this.constellationSystem = new ConstellationSystem(starPositions);
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starColorAttribute = new THREE.BufferAttribute(starColors, 3);
    starGeo.setAttribute('color', starColorAttribute);
    starGeo.setAttribute('aStarSize', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aTwinklePhase', new THREE.BufferAttribute(starPhases, 1));
    this.constellationSystem.attachStarColors(starColorAttribute);

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: this.sceneManager.renderer.getPixelRatio() }, uOpacity: { value: 0.9 } },
      vertexShader: `
        attribute float aStarSize;
        attribute float aTwinklePhase;
        attribute vec3 color;
        uniform float uTime;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          float twinkleRate = 0.55 + fract(aTwinklePhase * 0.13) * 0.65;
          vTwinkle = 0.84 + 0.16 * sin(uTime * twinkleRate + aTwinklePhase);
          vColor = color;
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = clamp(aStarSize * 360.0 / max(1.0, -viewPosition.z), 1.3, 5.2) * uPixelRatio;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          float radius = length(gl_PointCoord - vec2(0.5)) * 2.0;
          float core = 1.0 - smoothstep(0.06, 0.40, radius);
          float halo = 1.0 - smoothstep(0.16, 1.0, radius);
          float alpha = (core * 0.9 + halo * 0.18) * vTwinkle * uOpacity;
          vec3 tint = mix(vColor, vec3(0.48, 0.68, 1.0), halo * 0.13);
          gl_FragColor = vec4(tint, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false
    });
    this.starMaterial = starMat;

    const starField = new THREE.Points(starGeo, starMat);
    starField.name = 'world_star_field';
    starField.renderOrder = -2;
    skyAnchor.add(starField);
    scene.add(skyAnchor);

    // One 24-minute game clock drives sky, lighting, lanterns and constellation
    // night-window presentation. World updates already stop while gameplay is paused.
    this.dayNightCycle = new DayNightCycle(
      scene,
      this.sceneManager.dirLight,
      this.sceneManager.ambientLight,
      this.cloudsUniforms,
      {
        realSecondsPerGameHour: 60,
        initialHour: 21,
        renderer: this.sceneManager.renderer,
        moonLight,
        hemisphereLight: hemiLight,
        rimLight
      }
    );
    this.skyPanorama = new SkyPanoramaSystem(skyAnchor);
    // The procedural sky is already valid on frame one. Do not hold the
    // playable transition while two panorama images download and upload; the
    // panorama replaces it as soon as its initial pair is ready.
    void this.skyPanorama.loadInitial(this.sceneManager.renderer, skyBlendForHour(this.dayNightCycle.hour))
      .catch((error) => console.error('[Sky] Initial panorama could not be prepared; the procedural sky remains active.', error));
    this.createSkyDebugPanel();
    // The portal is not needed to move, collect or fight. Load it without
    // blocking the level's playable handoff.
    void portalAssetPromise.then((portalAsset) => {
      if (portalAsset) this.installCelestialPortal(portalAsset);
    });

    // Warm only the key/reward materials against the real light configuration.
    // Do this before gameplay on every device so first collection never pays
    // shader compilation or GPU resource creation costs.
    // Shader warmup is useful, but awaiting it here keeps even the intro
    // transition behind GPU compilation. Schedule it after the first playable
    // frame so it can no longer extend the loading screen.
    const powerOrbSystem = this.powerOrbSystem;
    const warmPickups = () => {
      if (!powerOrbSystem) return;
      void Promise.allSettled([
        KeyPickupSequence.precompileShaders(this.sceneManager.renderer, this.sceneManager.camera, scene),
        powerOrbSystem.precompileShaders(this.sceneManager.renderer, this.sceneManager.camera, scene),
      ]).then((results) => results.forEach((result) => {
        if (result.status === 'rejected') console.warn('[Level] Pickup shader warmup failed; runtime compilation remains available.', result.reason);
      }));
    };
    const idleWindow = window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number };
    if (idleWindow.requestIdleCallback) idleWindow.requestIdleCallback(warmPickups, { timeout: 1800 });
    else window.setTimeout(warmPickups, 900);

    this.checkpointManager.respawnPlayer(this.player);
    // Load the visual identity before play so the in-game loader can report real
    // resource progress and the first playable frame includes the temple assets.
    await this.loadIntroEnvironmentAssets();
    // Original grass is deferred until the browser has gameplay idle time.
    // Starting its GLB decode/instancing here overlaps the level handoff and
    // caused avoidable memory and frame-time spikes on mobile GPUs.
  }

  /** Adds the pavilion and a subtle green ground texture as scenery only. */
  private async loadIntroEnvironmentAssets(): Promise<void> {
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    const version = `?v=${__APP_VERSION__}`;
    // Phones and tablets need the mobile-authored scene assets even when the
    // browser reports a modern CPU and ample RAM. Capability-only detection
    // loaded the full desktop temple on recent devices and inflated decode,
    // upload and GPU costs on the very platforms with the tightest budgets.
    const mobileTextures = isMobileDevice() || isLowPowerDevice();
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = (url, loaded, total) => this.onResourceProgress?.(loaded, total, url);
    const loader = new GLTFLoader(loadingManager);
    const [pavilionResult, templeResult, lionResult, lampResult] = await Promise.allSettled([
      loader.loadAsync(`${base}${mobileTextures ? 'chinese-pavilion-mobile.glb' : 'chinese-pavilion.glb'}${version}`),
      // Restored PBR maps exported from the supplied Blender source; the legacy
      // GLB had materials but zero image textures and rendered almost white.
      loader.loadAsync(`${base}${mobileTextures ? 'wukong-chinese-temple-mobile.glb' : 'wukong-chinese-temple-textured.glb'}?v=temple-pbr-2`),
      loader.loadAsync(`${base}wukong-porcelain-lion.glb${version}`),
      loader.loadAsync(`${base}wukong-red-lamp.glb${version}`),
    ]);

    // Life rewards do not participate in the first playable route. Keep their
    // model download and parse out of the critical path while preserving the
    // existing placements and collection rules once ready.
    void loader.loadAsync(`${import.meta.env.BASE_URL}assets/collectibles/teara-wukong-vida.glb${version}`)
      .then((gltf) => {
        this.lifePickupSource = gltf.scene;
        this.createLifePickups();
      })
      .catch((error) => console.warn('[LevelToyStory] Life pickup asset could not be loaded.', error));

    const terrain = this.sceneManager.scene.getObjectByName('world-terrain') as THREE.Mesh | null;
    if (terrain && terrain.material instanceof THREE.MeshStandardMaterial) {
      const ground = this.createGrassGroundTexture();
      ground.repeat.set(6, 6);
      ground.anisotropy = Math.min(8, this.sceneManager.renderer.capabilities.getMaxAnisotropy());
      terrain.material.map = ground;
      terrain.material.color.setHex(0x9eac63);
      terrain.material.emissive.setHex(0x18200a);
      terrain.material.emissiveIntensity = 0.12;
      terrain.material.needsUpdate = true;
    }

    const scene = this.sceneManager.scene;
    const placeAsset = (source: THREE.Object3D, name: string, targetWidth: number, x: number, z: number, rotationY = 0): THREE.Object3D => {
      const asset = source.clone(true);
      asset.name = name;
      const rawBounds = new THREE.Box3().setFromObject(asset);
      const rawSize = rawBounds.getSize(new THREE.Vector3());
      const horizontalWidth = Math.max(rawSize.x, rawSize.z, 0.001);
      asset.scale.setScalar(targetWidth / horizontalWidth);
      asset.rotation.y = rotationY;
      asset.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(asset);
      const center = bounds.getCenter(new THREE.Vector3());
      const groundY = this.getTerrainHeight(x, z);
      asset.position.set(x - center.x, groundY - bounds.min.y, z - center.z);
      asset.updateMatrixWorld(true);
      asset.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = false;
          // Detailed static GLBs already carry authored texture shading.
          // Receiving the real-time shadow over every submesh adds avoidable
          // fragment work when the temple or pavilion fills the camera view.
          child.receiveShadow = false;
        }
      });
      scene.add(asset);
      return asset;
    };

    if (pavilionResult.status === 'fulfilled') {
      const pavilion = pavilionResult.value.scene;
      const mainPavilion = placeAsset(pavilion, 'chinese_pavilion_intro_reference', 8.5, 20, 24);
      const westPavilion = placeAsset(pavilion, 'chinese_pavilion_west_landmark', 8.5, -55, -75);
      applyGoldenTempleLut(mainPavilion);
      applyGoldenTempleLut(westPavilion);
      this.addPavilionCollision(mainPavilion);
      this.addPavilionCollision(westPavilion);
      this.alignStaffChestToPavilionTable(mainPavilion, 20, 24);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Pavilion asset.', pavilionResult.reason);
    }

    if (templeResult.status === 'fulfilled') {
      const temple = templeResult.value.scene;
      // One temple anchors the route beyond Gekko. The duplicate eastern
      // sanctuary was removed; its staff reward now lives in the pavilion.
      // The source asset's open entrance faces opposite the spawn-facing
      // perimeter, so rotate the visual temple to match its actual access.
      const routeTemple = placeAsset(temple, 'chinese_temple_gekko_route', 24, 0, -40, Math.PI);
      this.centralTempleObject = routeTemple;
      applyGoldenTempleLut(routeTemple);
      this.addTempleCollision(routeTemple);
      this.addTempleStoneFloor(routeTemple);
      this.addTempleInteriorLighting(routeTemple);
      this.addExteriorMoonlightEffects();
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Temple asset.', templeResult.reason);
    }

    if (lionResult.status === 'fulfilled') {
      // Frame the stair flight at the two lawn positions shown in the user's
      // reference. Derive the centerline and side axis from the transformed
      // temple itself; the temple is rotated 180 degrees, so assuming world X/Z
      // placed the statues inconsistently as the entrance changed.
      const temple = this.centralTempleObject;
      const stairTop = temple?.localToWorld(new THREE.Vector3(0, 0, -5.4))
        ?? new THREE.Vector3(0, 0, this.centralTempleFloorCenterZ + this.centralTempleFloorDepth * 0.5);
      const stairFoot = temple?.localToWorld(new THREE.Vector3(0, 0, -7.55))
        ?? stairTop.clone().add(new THREE.Vector3(0, 0, 2.15));
      const stairRun = stairFoot.clone().sub(stairTop);
      const stairSide = temple
        ? new THREE.Vector3(1, 0, 0).transformDirection(temple.matrixWorld).setY(0).normalize()
        : new THREE.Vector3(1, 0, 0);
      const stairDirection = stairRun.clone().setY(0).normalize();
      const stairCenter = stairTop.clone().lerp(stairFoot, 0.55);
      const stairWidth = Math.max(7.2, Math.min(9.6, 6.1 * (temple?.scale.x ?? 1.4)));
      const guardians = placeAsset(lionResult.value.scene, 'chinese_porcelain_guardian_pair', 7.0, stairCenter.x, stairCenter.z, Math.PI);
      guardians.updateMatrixWorld(true);
      // GLTFLoader keeps Blender's object names verbatim. The shipped asset
      // names these meshes `Chinese_Porcelain_Lion001/002` (underscores and no
      // dot), so the former spaced names returned an empty array and left both
      // statues at the center of the stair flight.
      const normalizeNodeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const lionNodes: THREE.Object3D[] = [];
      guardians.traverse((node) => {
        const normalized = normalizeNodeName(node.name);
        if (/chineseporcelainlion0?01$/.test(normalized) || /chineseporcelainlion0?02$/.test(normalized)) {
          lionNodes.push(node);
        }
      });
      lionNodes.sort((a, b) => normalizeNodeName(a.name).localeCompare(normalizeNodeName(b.name)));
      if (lionNodes.length !== 2) {
        console.warn(`[LevelToyStory] Expected two named porcelain lions; found ${lionNodes.length}. Keeping source placement rather than applying guessed offsets.`);
      }
      // Measure each statue's actual projected width along the stair's side
      // axis. A world-AABB X width was too small for the rotated temple/lion
      // meshes, so the plinths could overlap the outer treads.
      const projectedHalfWidths = lionNodes.map((node) => {
        const bounds = new THREE.Box3().setFromObject(node);
        const corners = [
          new THREE.Vector3(bounds.min.x, bounds.min.y, bounds.min.z),
          new THREE.Vector3(bounds.min.x, bounds.min.y, bounds.max.z),
          new THREE.Vector3(bounds.min.x, bounds.max.y, bounds.min.z),
          new THREE.Vector3(bounds.min.x, bounds.max.y, bounds.max.z),
          new THREE.Vector3(bounds.max.x, bounds.min.y, bounds.min.z),
          new THREE.Vector3(bounds.max.x, bounds.min.y, bounds.max.z),
          new THREE.Vector3(bounds.max.x, bounds.max.y, bounds.min.z),
          new THREE.Vector3(bounds.max.x, bounds.max.y, bounds.max.z)
        ];
        const projections = corners.map((corner) => corner.dot(stairSide));
        return (Math.max(...projections) - Math.min(...projections)) * 0.5;
      });
      // The stair proxy is 8.54 m wide at this temple scale. Add a visible
      // grassy gap so the guardian plinths sit beside the stair, never on it.
      // Keep the bases immediately outside the stair's outer edge, matching
      // the marked lawn positions. The former extra 0.72 m gap pushed each
      // guardian too far away and, depending on the source pair's bounds,
      // could also leave them visually overlapping the stair rails.
      const guardianClearance = 0.18;
      const guardianOffset = stairWidth * 0.5 + Math.max(1.35, ...projectedHalfWidths) + guardianClearance;
      const guardianBounds: THREE.Box3[] = [];
      lionNodes.forEach((node, index) => {
        const side = index === 0 ? -1 : 1;
        const targetPosition = stairCenter.clone().addScaledVector(stairSide, side * guardianOffset);
        const targetX = targetPosition.x;
        const targetZ = targetPosition.z;
        // Keep the plinth on natural ground beside (never over) the treads.
        const ground = this.getTerrainHeight(targetX, targetZ);
        // Face the statues diagonally toward the outdoor approach and the
        // player, rather than turning them along the stair rail.
        const approach = stairFoot.clone().addScaledVector(stairDirection, 4.5);
        const facing = approach.sub(new THREE.Vector3(targetX, ground, targetZ));
        // Preserve the asset-authored facing of each lion. These two meshes
        // have intentionally different local rotations; replacing rotation.y
        // erased that orientation and left the statues looking sideways/back.
        // Turn the existing world orientation by the smallest yaw delta.
        const currentWorldQuaternion = node.getWorldQuaternion(new THREE.Quaternion());
        const currentForward = new THREE.Vector3(0, 0, 1)
          .applyQuaternion(currentWorldQuaternion).setY(0).normalize();
        const desiredForward = new THREE.Vector3(facing.x, 0, facing.z).normalize();
        const yawDelta = Math.atan2(
          currentForward.z * desiredForward.x - currentForward.x * desiredForward.z,
          currentForward.dot(desiredForward)
        );
        const parentWorldQuaternion = node.parent?.getWorldQuaternion(new THREE.Quaternion()) ?? new THREE.Quaternion();
        const desiredWorldQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawDelta)
          .multiply(currentWorldQuaternion);
        node.quaternion.copy(parentWorldQuaternion.invert().multiply(desiredWorldQuaternion));
        node.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(node);
        const current = bounds.getCenter(new THREE.Vector3());
        const target = new THREE.Vector3(targetX, ground + (bounds.max.y - bounds.min.y) * 0.5, targetZ);
        if (node.parent) {
          const localDelta = node.parent.worldToLocal(target.clone()).sub(node.parent.worldToLocal(current.clone()));
          node.position.add(localDelta);
        }
        node.updateMatrixWorld(true);
        guardianBounds.push(new THREE.Box3().setFromObject(node));
        node.traverse((part) => { if ((part as THREE.Mesh).isMesh) (part as THREE.Mesh).castShadow = false; });
      });
      guardians.updateMatrixWorld(true);
      const lionColliders = new THREE.Group();
      lionColliders.name = 'porcelain_guardian_low_cost_colliders';
      // Keep blockers in the raycast set from frame one. Material visibility
      // can make ray picking skip these proxies on some Three.js versions, so
      // hide only color/depth writes while leaving the mesh raycastable.
      const invisible = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
      guardianBounds.forEach((bounds) => {
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        // Match the visible statue's body, not its full decorative plinth.
        // Keep the blocker grounded at the final statue bounds (not at the
        // old shared spawn height), and cover the body without a wide invisible
        // barrier extending across the stair approach.
        const blockerHeight = Math.max(1.65, Math.min(2.25, size.y * 0.86));
        const blocker = new THREE.Mesh(new THREE.BoxGeometry(
          Math.max(1.4, size.x * 0.9), blockerHeight, Math.max(1.4, size.z * 0.9)
        ), invisible);
        blocker.position.set(center.x, bounds.min.y + blockerHeight * 0.5, center.z);
        blocker.name = 'porcelain_guardian_blocker';
        blocker.userData.solidPlayerBlocker = true;
        lionColliders.add(blocker);
      });
      this.sceneManager.scene.add(lionColliders);
      this.levelColliders.push(lionColliders);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Porcelain Lion asset.', lionResult.reason);
    }

    if (lampResult.status === 'fulfilled') {
      // Reuse the original lantern GLB. Determine the two eave footprints from
      // upward-facing triangles in the loaded temple mesh (rather than the
      // smaller collision footprint), then ray-check all eight corner anchors.
      const temple = this.centralTempleObject;
      if (temple) temple.updateMatrixWorld(true);
      const templeBounds = temple ? new THREE.Box3().setFromObject(temple) : null;
      const localTempleBounds = new THREE.Box3();
      if (temple) {
        const worldToTemple = temple.matrixWorld.clone().invert();
        temple.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
          if (!mesh.geometry.boundingBox) return;
          const meshToTemple = worldToTemple.clone().multiply(mesh.matrixWorld);
          localTempleBounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(meshToTemple));
        });
      }
      const templeHeight = localTempleBounds.max.y - localTempleBounds.min.y;
      const roofBands = [
        { name: 'lower-eave', minY: localTempleBounds.min.y + templeHeight * 0.29, maxY: localTempleBounds.min.y + templeHeight * 0.51 },
        { name: 'upper-roof', minY: localTempleBounds.min.y + templeHeight * 0.71, maxY: localTempleBounds.max.y + 0.05 },
      ];
      const roofCornerAnchors = new Map<string, THREE.Vector3>();
      const roofSurfaceBoundsByTier = new Map(roofBands.map((band) => [band.name, new THREE.Box3()]));
      const down = new THREE.Vector3(0, -1, 0);
      const up = new THREE.Vector3(0, 1, 0);
      if (temple && templeBounds && templeHeight > 1) {
        const worldToTemple = temple.matrixWorld.clone().invert();
        const raycaster = new THREE.Raycaster();
        const cornerInsetFractions = [0.92, 0.88, 0.84, 0.80, 0.76];
        // Walk the original static mesh once and collect the two roof tiers.
        // Keeping this one-time audit to a single pass avoids a load-time hitch.
        temple.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const geometry = mesh.geometry;
          const position = geometry.getAttribute('position');
          if (!position) return;
          const index = geometry.getIndex();
          const groups = geometry.groups.length
            ? geometry.groups
            : [{ start: 0, count: index?.count ?? position.count, materialIndex: 0 }];
          const meshToTemple = worldToTemple.clone().multiply(mesh.matrixWorld);
          const a = new THREE.Vector3();
          const b = new THREE.Vector3();
          const c = new THREE.Vector3();
          const edgeAB = new THREE.Vector3();
          const edgeAC = new THREE.Vector3();
          const normal = new THREE.Vector3();
          groups.forEach((group) => {
            const end = Math.min(group.start + group.count, index?.count ?? position.count);
            for (let offset = group.start; offset + 2 < end; offset += 3) {
              const ia = index ? index.getX(offset) : offset;
              const ib = index ? index.getX(offset + 1) : offset + 1;
              const ic = index ? index.getX(offset + 2) : offset + 2;
              a.fromBufferAttribute(position, ia).applyMatrix4(meshToTemple);
              b.fromBufferAttribute(position, ib).applyMatrix4(meshToTemple);
              c.fromBufferAttribute(position, ic).applyMatrix4(meshToTemple);
              const centerY = (a.y + b.y + c.y) / 3;
              const band = roofBands.find((candidate) => centerY >= candidate.minY && centerY <= candidate.maxY);
              if (!band) continue;
              normal.crossVectors(edgeAB.subVectors(b, a), edgeAC.subVectors(c, a)).normalize();
              if (normal.y < 0.18) continue;
              roofSurfaceBoundsByTier.get(band.name)?.expandByPoint(a).expandByPoint(b).expandByPoint(c);
            }
          });
        });
        roofBands.forEach((band) => {
          const roofSurfaceBounds = roofSurfaceBoundsByTier.get(band.name)!;
          if (roofSurfaceBounds.isEmpty()) {
            console.warn(`[LevelToyStory] Could not derive ${band.name} lamp anchors from the original temple roof mesh.`);
            return;
          }
          const centerX = (roofSurfaceBounds.min.x + roofSurfaceBounds.max.x) * 0.5;
          const centerZ = (roofSurfaceBounds.min.z + roofSurfaceBounds.max.z) * 0.5;
          const halfX = (roofSurfaceBounds.max.x - roofSurfaceBounds.min.x) * 0.5;
          const halfZ = (roofSurfaceBounds.max.z - roofSurfaceBounds.min.z) * 0.5;
          ([-1, 1] as const).forEach((signZ) => ([-1, 1] as const).forEach((signX) => {
            const key = `${band.name}:${signX}:${signZ}`;
            for (const inset of cornerInsetFractions) {
              const localTarget = new THREE.Vector3(centerX + signX * halfX * inset, 0, centerZ + signZ * halfZ * inset);
              const worldTarget = temple.localToWorld(localTarget.clone());
              raycaster.set(new THREE.Vector3(worldTarget.x, templeBounds.max.y + 3, worldTarget.z), down);
              raycaster.far = templeBounds.max.y - templeBounds.min.y + 6;
              const hit = raycaster.intersectObject(temple, true).find((candidate) => {
                if (candidate.point.y <= this.getTerrainHeight(candidate.point.x, candidate.point.z) + 3) return false;
                const localPoint = temple.worldToLocal(candidate.point.clone());
                const normalY = candidate.face?.normal.clone().transformDirection(candidate.object.matrixWorld).y ?? 0;
                return localPoint.y >= band.minY && localPoint.y <= band.maxY && normalY > 0.12;
              });
              if (!hit) continue;
              // The downward ray identifies the actual roof footprint. Find
              // its underside from below so the lantern body hangs in view
              // beneath the eave instead of being embedded in the roof shell.
              const startLocalY = band.name === 'lower-eave'
                ? localTempleBounds.min.y + templeHeight * 0.18
                : localTempleBounds.min.y + templeHeight * 0.67;
              const undersideStart = temple.localToWorld(new THREE.Vector3(localTarget.x, startLocalY, localTarget.z));
              raycaster.set(undersideStart, up);
              raycaster.far = templeBounds.max.y - undersideStart.y + 1;
              const undersideHit = raycaster.intersectObject(temple, true).find((candidate) => {
                const localPoint = temple.worldToLocal(candidate.point.clone());
                const normalY = candidate.face?.normal.clone().transformDirection(candidate.object.matrixWorld).y ?? 0;
                return localPoint.y >= band.minY && localPoint.y <= band.maxY && normalY < -0.12;
              });
              if (!undersideHit) continue;
              roofCornerAnchors.set(key, temple.worldToLocal(undersideHit.point.clone()));
              break;
            }
            if (!roofCornerAnchors.has(key)) console.warn(`[LevelToyStory] No verified roof surface for ${key}; its lantern was skipped.`);
          }));
        });
      }
      const layoutForSide = (tier: string, side: 'front' | 'rear') => ({
        name: `${tier}-${side}`,
        anchors: ([-1, 1] as const)
          .map((signX) => roofCornerAnchors.get(`${tier}:${signX}:${side === 'front' ? -1 : 1}`))
          .filter((point): point is THREE.Vector3 => !!point)
          .map((point) => temple!.localToWorld(point.clone())) as THREE.Vector3[],
      });
      const lampLayouts = roofBands.flatMap((band) => [
        layoutForSide(band.name, 'front'),
        layoutForSide(band.name, 'rear'),
      ]).filter((layout) => {
        if (layout.anchors.length === 2) return true;
        if (layout.anchors.length) console.warn(`[LevelToyStory] Incomplete corner pair for ${layout.name}; both lamps were skipped to preserve symmetry.`);
        return false;
      });
      const cordGeometry = new THREE.CylinderGeometry(0.026, 0.026, 1, 8);
      const brassGeometry = new THREE.SphereGeometry(0.075, 8, 6);
      const cordMaterial = new THREE.MeshStandardMaterial({ color: 0x68432d, roughness: 0.88, metalness: 0.08 });
      const anchorMaterial = new THREE.MeshStandardMaterial({ color: 0xb7833c, roughness: 0.38, metalness: 0.64, emissive: 0x4a2605, emissiveIntensity: 0.16 });
      const warmLanternMaterials = new Map<THREE.Material, THREE.Material>();
      // Keep every practical source at the measured center of its actual
      // lantern mesh. The previous pair-center and facade-fill lights sat in
      // empty space, which read as detached orange blobs on the temple.
      const lanternLightAnchors: Array<{ node: THREE.Object3D; position: THREE.Vector3 }> = [];
      let placedLanterns = 0;
      lampLayouts.forEach((layout) => {
        if (!this.centralTempleObject || !templeBounds) return;
        const anchors = layout.anchors;
        const pairCenter = anchors[0].clone().add(anchors[1]).multiplyScalar(0.5);
        const pairRoot = placeAsset(
          lampResult.value.scene,
          `chinese_red_lamp_${layout.name}_pair`,
          3.4,
          pairCenter.x,
          pairCenter.z,
        );
        pairRoot.rotation.y = this.centralTempleObject.rotation.y;
        pairRoot.updateMatrixWorld(true);
        pairRoot.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (!mesh.isMesh) return;
          const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          const nightMaterials = sourceMaterials.map((source) => {
            let material = warmLanternMaterials.get(source);
            if (!material) {
              material = source.clone();
              if (material instanceof THREE.MeshStandardMaterial) {
                material.emissive.set(0xff5b1c);
                material.emissiveIntensity = 0.95;
                this.dayNightCycle?.registerNightEmissiveMaterial(material);
              }
              warmLanternMaterials.set(source, material);
            }
            return material;
          });
          mesh.material = Array.isArray(mesh.material) ? nightMaterials : nightMaterials[0];
        });
        const namedLampNodes = ['lantern', 'lantern.001']
          .map((name) => pairRoot.getObjectByName(name))
          .filter((node): node is THREE.Object3D => !!node);
        // GLTFLoader may expose the authored scene wrapper as an extra Group;
        // in that case the two lamp objects are the wrapper's direct children.
        const authoredPairRoot = pairRoot.children.length === 1 && pairRoot.children[0].children.length === 2
          ? pairRoot.children[0]
          : pairRoot;
        const lampNodes = namedLampNodes.length === 2
          ? namedLampNodes
          : authoredPairRoot.children.slice(0, 2);
        if (lampNodes.length !== 2) {
          pairRoot.removeFromParent();
          console.warn(`[LevelToyStory] Original lamp asset is missing a lantern node for ${layout.name}.`);
          return;
        }
        const pairPositions: THREE.Vector3[] = [];
        lampNodes.forEach((node, index) => {
          let bounds = new THREE.Box3().setFromObject(node);
          const target = anchors[index];
          const current = bounds.getCenter(new THREE.Vector3());
          if (node.parent) {
            const from = node.parent.worldToLocal(current.clone());
            const to = node.parent.worldToLocal(new THREE.Vector3(target.x, current.y, target.z));
            node.position.add(to.sub(from));
            node.updateWorldMatrix(true, true);
            bounds = new THREE.Box3().setFromObject(node);
          }
          // `target` is the verified underside hit for this corner.
          const desiredTop = target.y - 0.20;
          const lift = desiredTop - bounds.max.y;
          if (node.parent) {
            const currentCenter = bounds.getCenter(new THREE.Vector3());
            const bodyCenter = new THREE.Vector3(target.x, currentCenter.y, target.z);
            const from = node.parent.worldToLocal(bodyCenter.clone());
            const to = node.parent.worldToLocal(bodyCenter.clone().add(new THREE.Vector3(0, lift, 0)));
            node.position.add(to.sub(from));
          }
          node.updateWorldMatrix(true, true);
          const placedBounds = new THREE.Box3().setFromObject(node);
          const body = placedBounds.getCenter(new THREE.Vector3());
          const cordStart = new THREE.Vector3(body.x, placedBounds.max.y + 0.015, body.z);
          const cordEnd = new THREE.Vector3(target.x, target.y - 0.025, target.z);
          const cordVector = cordEnd.clone().sub(cordStart);
          if (cordVector.y <= 0.08) {
            node.visible = false;
            console.warn(`[LevelToyStory] Original lamp would intersect the roof at ${layout.name}:${index}; skipped.`);
            return;
          }
          const cord = new THREE.Mesh(cordGeometry, cordMaterial);
          cord.name = `lantern_roof_hanging_cord_${layout.name}_${index}`;
          cord.position.copy(cordStart).addScaledVector(cordVector, 0.5);
          cord.scale.y = cordVector.length();
          cord.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cordVector.normalize());
          cord.castShadow = false;
          scene.add(cord);
          const ceilingEye = new THREE.Mesh(brassGeometry, anchorMaterial);
          ceilingEye.name = `lantern_ceiling_brass_anchor_${layout.name}_${index}`;
          ceilingEye.position.copy(cordEnd);
          ceilingEye.castShadow = false;
          scene.add(ceilingEye);
          pairPositions.push(body.clone());
          lanternLightAnchors.push({ node, position: body.clone() });
          placedLanterns++;
        });
        if (!pairPositions.length) pairRoot.removeFromParent();
      });
      // A no-shadow practical is attached to each verified lantern body. The
      // short range localizes its effect; removing the free-standing facade
      // fills/spots and moth glows reduces the previous scene light budget.
      const mobileLighting = isLowPowerDevice() || (navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches);
      lanternLightAnchors.forEach(({ node, position }, index) => {
        const light = new THREE.PointLight(0xffad53, mobileLighting ? 5.5 : 8.5, 6.5, 2);
        light.name = `central_temple_lantern_practical_${index + 1}`;
        light.position.copy(node.worldToLocal(position.clone()));
        light.castShadow = false;
        node.add(light);
        this.dayNightCycle?.registerNightLight(light);
      });
      console.info(`[LevelToyStory] Placed ${placedLanterns} original red lanterns from measured roof geometry; ${roofCornerAnchors.size} corner anchors verified across both eaves.`);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese red lamp asset.', lampResult.reason);
    }

    // No free-standing temple fill/spot lights here: the lantern bodies above
    // are the only local warm sources. The existing moon and ambient lighting
    // retain the cool night contrast across the rest of the level.
    this.player.setColliders(this.levelColliders);
    this.player.setWorldBoundary(this.worldBoundaryXZ);
    this.cameraController.setCollisionObjects(this.levelColliders);
    this.cameraController.setTerrainHeightProvider((x, z) => this.getTerrainHeight(x, z));

  }

  /** Compile the crypt's already-loaded materials during the loading screen,
   * so its first hidden-room frame does not trigger GPU shader work on entry. */
  public async precompileCuriosityCrypt(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera
  ): Promise<void> {
    const warmGroup = new THREE.Group();
    warmGroup.name = 'curiosity_crypt_shader_warmup';
    this.sceneManager.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      let parent: THREE.Object3D | null = mesh;
      let belongsToCrypt = false;
      while (parent && parent !== this.sceneManager.scene) {
        if (parent.name.startsWith('curiosity_')) {
          belongsToCrypt = true;
          break;
        }
        parent = parent.parent;
      }
      if (!belongsToCrypt) return;
      const shaderProxy = mesh.clone(false);
      shaderProxy.frustumCulled = false;
      warmGroup.add(shaderProxy);
    });

    if (warmGroup.children.length === 0) return;
    const compileStartedAt = performance.now();
    try {
      // Compile both the hidden-room materials and the exact point-light
      // variant that becomes active on entry. Flip visibility only within this
      // synchronous call setup so no rendered frame leaks the lights outdoors.
      const previousLightVisibility = this.cryptLightingGroup?.visible ?? false;
      let compilation: Promise<THREE.Object3D>;
      try {
        if (this.cryptLightingGroup) this.cryptLightingGroup.visible = true;
        compilation = renderer.compileAsync(warmGroup, camera, this.sceneManager.scene);
      } finally {
        if (this.cryptLightingGroup) this.cryptLightingGroup.visible = previousLightVisibility;
      }
      await compilation;
      console.info(`[CuriosityVaultPerf] Precompiled ${warmGroup.children.length} crypt mesh materials in ${(performance.now() - compileStartedAt).toFixed(1)} ms.`);
    } finally {
      warmGroup.clear();
    }
  }

  /** Use a small set of architectural proxies instead of per-frame raycasts
   * against the 100k-triangle pavilion render mesh. */
  private addPavilionCollision(asset: THREE.Object3D): void {
    asset.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(asset);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const terrainY = this.getTerrainHeight(center.x, center.z);
    const root = new THREE.Group();
    root.name = 'pavilion_low_cost_collision';
    const invisible = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
    // Sample upward-facing surfaces directly from the loaded pavilion mesh.
    // Do not estimate the deck from a handful of points: on this asset those
    // points can hit a low base/trim piece, which previously rejected the real
    // stair and deck tops and left only an incorrectly placed flat fallback.
    // This one-time load work produces a single low-poly support mesh; there is
    // no per-frame vegetation/geometry generation.
    const patchStep = 0.28;
    const patchHalf = patchStep * 0.56;
    const floorVertices: number[] = [];
    const stairVertices: number[] = [];
    const chestPlatformVertices: number[] = [];
    const chestPlatformBounds = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity, topY: -Infinity };
    const supportX0 = Math.floor((bounds.min.x + patchStep * 0.5) / patchStep) * patchStep;
    const supportZ0 = Math.floor((bounds.min.z + patchStep * 0.5) / patchStep) * patchStep;
    const supportYMin = terrainY - 0.12;
    const supportYMax = terrainY + 2.35;
    const columns = Math.floor((bounds.max.x - supportX0) / patchStep) + 1;
    const rows = Math.floor((bounds.max.z - supportZ0) / patchStep) + 1;
    const heights = new Float32Array(columns * rows);
    const lowerHeights = new Float32Array(columns * rows);
    heights.fill(-Infinity);
    lowerHeights.fill(-Infinity);
    // Rasterize upward-facing source triangles into the height grid in one
    // linear pass. Calling Raycaster.intersectObject for every grid point made
    // this 100k-triangle GLB cost ~5 s per pavilion on the main thread.
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    asset.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || !mesh.geometry?.attributes.position) return;
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const indices = geometry.index;
      mesh.updateWorldMatrix(true, false);
      const e = mesh.matrixWorld.elements;
      const transformVertex = (index: number, target: THREE.Vector3): THREE.Vector3 => {
        const px = positions.getX(index), py = positions.getY(index), pz = positions.getZ(index);
        return target.set(
          e[0] * px + e[4] * py + e[8] * pz + e[12],
          e[1] * px + e[5] * py + e[9] * pz + e[13],
          e[2] * px + e[6] * py + e[10] * pz + e[14]
        );
      };
      const triangleCount = indices ? Math.floor(indices.count / 3) : Math.floor(positions.count / 3);
      const ab = new THREE.Vector3(), ac = new THREE.Vector3();
      for (let triangle = 0; triangle < triangleCount; triangle++) {
        const offset = triangle * 3;
        const ia = indices ? indices.getX(offset) : offset;
        const ib = indices ? indices.getX(offset + 1) : offset + 1;
        const ic = indices ? indices.getX(offset + 2) : offset + 2;
        transformVertex(ia, a); transformVertex(ib, b); transformVertex(ic, c);
        ab.subVectors(b, a); ac.subVectors(c, a);
        const normalY = ab.z * ac.x - ab.x * ac.z;
        const normalX = ab.y * ac.z - ab.z * ac.y;
        const normalZ = ab.x * ac.y - ab.y * ac.x;
        const normalLength = Math.hypot(normalX, normalY, normalZ);
        if (normalLength < 1e-8 || normalY / normalLength <= 0.82) continue;
        const triMinY = Math.min(a.y, b.y, c.y), triMaxY = Math.max(a.y, b.y, c.y);
        if (triMaxY < supportYMin || triMinY > supportYMax) continue;
        const minX = Math.min(a.x, b.x, c.x), maxX = Math.max(a.x, b.x, c.x);
        const minZ = Math.min(a.z, b.z, c.z), maxZ = Math.max(a.z, b.z, c.z);
        const colMin = Math.max(0, Math.ceil((minX - supportX0) / patchStep));
        const colMax = Math.min(columns - 1, Math.floor((maxX - supportX0) / patchStep));
        const rowMin = Math.max(0, Math.ceil((minZ - supportZ0) / patchStep));
        const rowMax = Math.min(rows - 1, Math.floor((maxZ - supportZ0) / patchStep));
        const denominator = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
        if (Math.abs(denominator) < 1e-8) continue;
        for (let row = rowMin; row <= rowMax; row++) {
          const z = supportZ0 + row * patchStep;
          for (let col = colMin; col <= colMax; col++) {
            const x = supportX0 + col * patchStep;
            const wa = ((b.z - c.z) * (x - c.x) + (c.x - b.x) * (z - c.z)) / denominator;
            const wb = ((c.z - a.z) * (x - c.x) + (a.x - c.x) * (z - c.z)) / denominator;
            const wc = 1 - wa - wb;
            if (wa < -1e-5 || wb < -1e-5 || wc < -1e-5) continue;
            const y = wa * a.y + wb * b.y + wc * c.y;
            const cell = row * columns + col;
            if (y < supportYMin || y > supportYMax) continue;
            const currentTop = heights[cell];
            if (y > currentTop) {
              if (Number.isFinite(currentTop) && y - currentTop >= 0.08) {
                lowerHeights[cell] = Math.max(lowerHeights[cell], currentTop);
              }
              heights[cell] = y;
            } else if (currentTop - y >= 0.08 && y > lowerHeights[cell]) {
              // Preserve the lower deck beneath a high table/chest top. The
              // top platform must never mask the floor support underneath it.
              lowerHeights[cell] = y;
            }
          }
        }
      }
    });
    // The broad flat height cluster is the pavilion deck. Lower surfaces in
    // the front approach zone are stair treads; the small high island under
    // the chest is retained as its own platform collider.
    const heightBands = new Map<number, number>();
    for (let row = 0; row < rows; row++) {
      const z = supportZ0 + row * patchStep;
      for (let col = 0; col < columns; col++) {
        const y = heights[row * columns + col];
        if (!Number.isFinite(y) || Math.hypot(supportX0 + col * patchStep - center.x, z - center.z) < 1.35) continue;
        const band = Math.round(y * 20);
        heightBands.set(band, (heightBands.get(band) ?? 0) + 1);
      }
    }
    let deckBand = Math.round((terrainY + 0.58) * 20), deckBandCount = -1;
    for (const [band, count] of heightBands) {
      if (count > deckBandCount) { deckBand = band; deckBandCount = count; }
    }
    const deckY = deckBand / 20;
    const addCellSupport = (x: number, z: number, y: number): void => {
      if (!Number.isFinite(y)) return;
      const top = y + 0.012;
      const left = x - patchHalf, right = x + patchHalf;
      const near = z - patchHalf, far = z + patchHalf;
      const target = Math.hypot(x - center.x, z - center.z) < 1.35 && y > terrainY + 0.9
        ? chestPlatformVertices
        : (z > center.z + 0.9 && y < deckY - 0.06 ? stairVertices : floorVertices);
      target.push(
        left, top, near, right, top, far, right, top, near,
        left, top, near, left, top, far, right, top, far
      );
      if (target === chestPlatformVertices) {
        chestPlatformBounds.minX = Math.min(chestPlatformBounds.minX, left);
        chestPlatformBounds.maxX = Math.max(chestPlatformBounds.maxX, right);
        chestPlatformBounds.minZ = Math.min(chestPlatformBounds.minZ, near);
        chestPlatformBounds.maxZ = Math.max(chestPlatformBounds.maxZ, far);
        chestPlatformBounds.topY = Math.max(chestPlatformBounds.topY, top);
      }
    };
    for (let row = 0; row < rows; row++) {
      const z = supportZ0 + row * patchStep;
      for (let col = 0; col < columns; col++) {
        const y = heights[row * columns + col];
        const x = supportX0 + col * patchStep;
        addCellSupport(x, z, y);
        addCellSupport(x, z, lowerHeights[row * columns + col]);
      }
    }
    const addSupport = (name: string, vertices: number[], recoverySurface: boolean): void => {
      if (!vertices.length) return;
      const supportGeometry = new THREE.BufferGeometry();
      supportGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      supportGeometry.computeBoundingSphere();
      const support = new THREE.Mesh(supportGeometry, invisible);
      support.name = name;
      // Deck and stair surfaces can recover a missed landing. The tabletop is
      // a separate collider and deliberately uses the normal, small step-up.
      if (recoverySurface) support.userData.walkableSupport = true;
      support.userData.pavilionWalkableSurface = true;
      support.frustumCulled = false;
      root.add(support);
    };
    if (floorVertices.length || stairVertices.length || chestPlatformVertices.length) {
      addSupport('pavilion_main_floor_walkable_support', floorVertices, true);
      addSupport('pavilion_stair_treads_walkable_support', stairVertices, true);
      addSupport('pavilion_chest_table_platform', chestPlatformVertices, false);
    } else {
      // Keep a diagnostic warning instead of creating a guessed invisible slab
      // at the bounds center: that slab caused hovering on some pavilion files.
      console.warn(`[LevelToyStory] No walkable pavilion faces sampled for ${asset.name}; leaving its decorative mesh non-walkable.`);
    }
    const footprintX = Math.min(size.x * 0.68, 7.4);
    const footprintZ = Math.min(size.z * 0.68, 7.4);
    if (Number.isFinite(chestPlatformBounds.topY)) {
      const platformSpan = Math.max(
        chestPlatformBounds.maxX - chestPlatformBounds.minX,
        chestPlatformBounds.maxZ - chestPlatformBounds.minZ
      );
      const tableRadius = THREE.MathUtils.clamp(platformSpan * 0.42, 0.62, 1.0);
      const tableHeight = Math.max(0.25, chestPlatformBounds.topY - deckY);
      const tableBlocker = new THREE.Mesh(new THREE.CylinderGeometry(tableRadius, tableRadius, tableHeight, 12), invisible);
      tableBlocker.name = 'pavilion_chest_table_side_collision';
      tableBlocker.userData.solidPlayerBlocker = true;
      tableBlocker.position.set(
        (chestPlatformBounds.minX + chestPlatformBounds.maxX) * 0.5,
        deckY + tableHeight * 0.5,
        (chestPlatformBounds.minZ + chestPlatformBounds.maxZ) * 0.5
      );
      root.add(tableBlocker);
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, Math.min(5.2, size.y * 0.74), 6), invisible);
      pillar.name = `pavilion_column_collision_${sx > 0 ? 'east' : 'west'}_${sz > 0 ? 'front' : 'rear'}`;
      pillar.userData.solidPlayerBlocker = true;
      pillar.position.set(center.x + sx * footprintX * 0.42, terrainY + Math.min(5.2, size.y * 0.74) * 0.5, center.z + sz * footprintZ * 0.42);
      root.add(pillar);
    }
    // Keep these as local half-extents. Adding `center.x` to the half-width
    // made the subsequent rail widths/positions use world coordinates as
    // dimensions (for the eastern pavilion this created a ~45 m invisible
    // rear rail and displaced both side rails far outside the building).
    const railHalfWidth = footprintX * 0.42;
    const railHalfDepth = footprintZ * 0.42;
    const railBackZ = center.z - railHalfDepth;
    const railFrontZ = center.z + railHalfDepth;
    const deckRailY = deckY + 0.52;
    const railHeight = 1.04;
    const railThickness = 0.16;
    const addRail = (name: string, width: number, depth: number, x: number, z: number): void => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(width, railHeight, depth), invisible);
      rail.name = name;
      rail.userData.solidPlayerBlocker = true;
      rail.position.set(x, deckRailY, z);
      root.add(rail);
    };
    addRail('pavilion_rear_railing_collision', railHalfWidth * 2, railThickness, center.x, railBackZ);
    for (const side of [-1, 1]) {
      addRail(`pavilion_side_railing_collision_${side < 0 ? 'west' : 'east'}`, railThickness, railFrontZ - railBackZ, center.x + side * railHalfWidth, center.z);
      // Preserve the central opening aligned with the authored front stairs.
      const frontSegmentWidth = Math.max(0, railHalfWidth - 1.15);
      addRail(`pavilion_front_railing_collision_${side < 0 ? 'west' : 'east'}`, frontSegmentWidth, railThickness,
        center.x + side * (1.15 + frontSegmentWidth * 0.5), railFrontZ);
    }
    this.sceneManager.scene.add(root);
    this.structureColliderCandidates.push({
      // Enable support well before Wukong can reach the visible structure so
      // collider-cache updates never race the first approach frame.
      root, center, radius: 30, active: false
    });
  }

  /** Two restrained, non-shadowing practicals make the temple interiors read
   * warmly through their existing openings while leaving the authored shell intact. */
  private addTempleInteriorLighting(temple: THREE.Object3D): void {
    temple.updateMatrixWorld(true);
    const lowerFloorY = this.centralTempleFloorTopY ?? temple.position.y + 1.35;
    const bounds = new THREE.Box3().setFromObject(temple);
    const localBounds = new THREE.Box3();
    const inverseRoot = temple.matrixWorld.clone().invert();
    temple.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      if (!mesh.geometry.boundingBox) return;
      localBounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(inverseRoot.clone().multiply(mesh.matrixWorld)));
    });

    // Measure the upper walkable deck from the original GLB instead of
    // guessing a world-space height. Sample a small interior grid once at load.
    const localHeight = localBounds.max.y - localBounds.min.y;
    const upperCandidates: number[] = [];
    const raycaster = new THREE.Raycaster();
    const down = new THREE.Vector3(0, -1, 0);
    for (const x of [-2.5, 0, 2.5]) for (const z of [-2.5, 0, 2.5]) {
      const sample = temple.localToWorld(new THREE.Vector3(x, 0, z));
      raycaster.set(new THREE.Vector3(sample.x, bounds.max.y + 1, sample.z), down);
      raycaster.far = bounds.max.y - bounds.min.y + 2;
      const hit = raycaster.intersectObject(temple, true).find((candidate) => {
        if (!candidate.face) return false;
        const localPoint = temple.worldToLocal(candidate.point.clone());
        const normalY = candidate.face.normal.clone().transformDirection(candidate.object.matrixWorld).y;
        return normalY > 0.82 && localPoint.y > localBounds.min.y + localHeight * 0.22 &&
          localPoint.y < localBounds.min.y + localHeight * 0.70;
      });
      if (hit) upperCandidates.push(hit.point.y);
    }
    upperCandidates.sort((a, b) => a - b);
    const upperFloorY = upperCandidates.length >= 3
      ? upperCandidates[Math.floor(upperCandidates.length / 2)]
      : lowerFloorY + Math.max(4.4, localHeight * temple.scale.y * 0.34);

    const lowPower = isLowPowerDevice() || (navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches);
    // Put the warm practicals inside the real footprint, near its windowed
    // facades. The former single center light per level sat too far from the
    // openings to read outdoors. Four lights total on desktop, two on mobile;
    // all share the scene's existing no-shadow lighting path.
    const floorLights = [
      { floor: 'first', y: lowerFloorY + 2.65, localY: 3.0, intensity: lowPower ? 7.5 : 5.2, range: 14.5 },
      { floor: 'upper', y: upperFloorY + 2.2, localY: 9.2, intensity: lowPower ? 7.0 : 4.8, range: 13.5 },
    ];
    for (const practical of floorLights) {
      const sides = lowPower ? [[0, 0]] : [[-2.15, -1.75], [2.15, 1.75]];
      for (let i = 0; i < sides.length; i++) {
        const [localX, localZ] = sides[i];
        const local = new THREE.Vector3(localX, practical.localY, localZ);
        const position = temple.localToWorld(local);
        // Preserve the measured deck height if the asset root has a small
        // vertical offset; calculate local X/Z from the actual temple matrix.
        position.y = practical.y;
        const light = new THREE.PointLight(0xffbc79, practical.intensity, practical.range, 1.7);
        light.name = `central_temple_${practical.floor}_warm_window_fill_${i + 1}`;
        light.position.copy(position);
        light.castShadow = false;
        this.sceneManager.scene.add(light);
        this.dayNightCycle?.registerNightLight(light);
        this.templeInteriorLights.push(light);
      }
    }

    // Subtle, soft-window radiance makes the existing interior practicals
    // readable from a distance even where the authored lattice uses opaque
    // textured panels. It is a single transparent draw, attached to the GLB;
    // it neither edits the source materials nor adds architectural geometry.
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const addWindow = (center: THREE.Vector3, tangent: THREE.Vector3, width: number, height: number) => {
      const halfW = tangent.clone().multiplyScalar(width * 0.5);
      const halfH = new THREE.Vector3(0, height * 0.5, 0);
      const baseIndex = positions.length / 3;
      const corners = [center.clone().sub(halfW).sub(halfH), center.clone().add(halfW).sub(halfH), center.clone().add(halfW).add(halfH), center.clone().sub(halfW).add(halfH)];
      for (const corner of corners) positions.push(corner.x, corner.y, corner.z);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      indices.push(baseIndex, baseIndex + 1, baseIndex + 2, baseIndex, baseIndex + 2, baseIndex + 3);
    };
    // A slight exterior bias keeps the glow clear of the source wall surface
    // while remaining within the original window openings and lattice bays.
    const facadeOffset = 5.66;
    for (const y of [3.05, 9.15]) {
      // Three lit bays per facade, leaving the ground-floor entrance clear.
      for (const x of [-3.45, 3.45]) {
        addWindow(new THREE.Vector3(x, y, -facadeOffset), new THREE.Vector3(1, 0, 0), 1.35, 1.85);
        addWindow(new THREE.Vector3(x, y, facadeOffset), new THREE.Vector3(1, 0, 0), 1.35, 1.85);
      }
      for (const z of [-3.1, 3.1]) {
        addWindow(new THREE.Vector3(-facadeOffset, y, z), new THREE.Vector3(0, 0, 1), 1.35, 1.85);
        addWindow(new THREE.Vector3(facadeOffset, y, z), new THREE.Vector3(0, 0, 1), 1.35, 1.85);
      }
    }
    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    glowGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    glowGeometry.setIndex(indices);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: { uGlow: { value: 1 }, uTime: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: `
        uniform float uGlow; uniform float uTime; varying vec2 vUv;
        void main(){
          float x=abs(vUv.x-0.5)*2.0;
          float y=abs(vUv.y-0.5)*2.0;
          float soft=pow(1.0-smoothstep(0.12,1.0,x),0.8)*(1.0-smoothstep(0.68,1.0,y));
          float slats=0.88+0.12*step(0.35,fract(vUv.x*7.0));
          float pulse=0.94+0.06*sin(uTime*0.7+vUv.x*4.0);
          float alpha=soft*slats*pulse*0.40*uGlow;
          gl_FragColor=vec4(vec3(1.0,0.42,0.12),alpha);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const windowGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    windowGlow.name = 'central_temple_existing_window_warm_glow';
    windowGlow.userData.noPlayerCollision = true;
    windowGlow.frustumCulled = false;
    windowGlow.renderOrder = 2;
    temple.add(windowGlow);
    this.templeWindowGlowMaterial = glowMaterial;
  }

  /** Low-cost moon shafts and a tiny drifting-orb field for the open exterior.
   * These are decorative meshes/points only: no extra shadow maps or lights. */
  private addExteriorMoonlightEffects(): void {
    if (this.exteriorMoonlightGroup) return;
    const lowPower = isLowPowerDevice() || (navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches);
    const group = new THREE.Group();
    group.name = 'exterior_moonlight_shafts_and_orbs';
    group.userData.noPlayerCollision = true;

    const beamMaterial = new THREE.ShaderMaterial({
      uniforms: { uNightIntensity: { value: this.dayNightCycle?.nightAmount ?? 1 }, uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uNightIntensity; uniform float uTime; varying vec2 vUv;
        void main(){
          float edge=abs(vUv.x-0.5)*2.0;
          float radial=1.0-smoothstep(0.04,1.0,edge);
          float ends=smoothstep(0.0,0.18,vUv.y)*(1.0-smoothstep(0.80,1.0,vUv.y));
          float softBand=0.91+0.09*sin(vUv.y*20.0-uTime*0.38);
          float alpha=radial*ends*softBand*0.16*uNightIntensity;
          gl_FragColor=vec4(vec3(0.43,0.58,0.92),alpha);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    this.exteriorMoonBeamMaterial = beamMaterial;
    const beamGeometry = new THREE.PlaneGeometry(3.0, 16);
    // Sweep very slowly along the already-authored western/eastern stone
    // approaches. This keeps the moon pools on navigable ground instead of
    // creating arbitrary glowing spots in the grass.
    const paths = [
      [new THREE.Vector3(-17, 0, -40), new THREE.Vector3(-27, 0, -50), new THREE.Vector3(-39, 0, -62)],
      [new THREE.Vector3(17, 0, -40), new THREE.Vector3(27, 0, -50), new THREE.Vector3(39, 0, -62)],
    ];
    const beamCount = lowPower ? 1 : paths.length;
    for (let i = 0; i < beamCount; i++) {
      const points = paths[i];
      const start = points[0].clone();
      const end = points[points.length - 1].clone();
      start.y = this.getTerrainHeight(start.x, start.z);
      end.y = this.getTerrainHeight(end.x, end.z);
      const initial = start.clone().lerp(end, 0.5);
      const shaft = new THREE.Group();
      shaft.name = `exterior_moon_shaft_${i + 1}`;
      shaft.position.set(initial.x, initial.y + 7.6, initial.z);
      for (let crossed = 0; crossed < 2; crossed++) {
        const plane = new THREE.Mesh(beamGeometry, beamMaterial);
        plane.rotation.set(0.27, crossed * Math.PI * 0.5, 0);
        plane.frustumCulled = false;
        shaft.add(plane);
      }
      const pathDirection = new THREE.Vector3().subVectors(end, start).setY(0).normalize();
      const yaw = Math.atan2(pathDirection.x, pathDirection.z) + Math.PI * 0.5;
      shaft.rotation.y = yaw;
      this.exteriorMoonBeams.push({ root: shaft, start, end, phase: i * Math.PI, yaw });
      group.add(shaft);
    }

    const orbCount = lowPower ? 20 : 42;
    const positions = new Float32Array(orbCount * 3);
    const base = new Float32Array(orbCount * 3);
    const phases = new Float32Array(orbCount);
    for (let i = 0; i < orbCount; i++) {
      const lane = i % beamCount;
      const anchor = paths[lane][1];
      const seed = (i * 16807 % 2147483647) / 2147483647;
      const seed2 = ((i + 37) * 48271 % 2147483647) / 2147483647;
      const offset = i * 3;
      base[offset] = anchor.x + (seed - 0.5) * 2.8;
      base[offset + 1] = this.getTerrainHeight(anchor.x, anchor.z) + 0.7 + seed2 * 11.2;
      base[offset + 2] = anchor.z + (seed2 - 0.5) * 1.4;
      positions[offset] = base[offset];
      positions[offset + 1] = base[offset + 1];
      positions[offset + 2] = base[offset + 2];
      phases[i] = seed * Math.PI * 2;
    }
    const orbGeometry = new THREE.BufferGeometry();
    orbGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const orbCanvas = document.createElement('canvas');
    orbCanvas.width = orbCanvas.height = 32;
    const ctx = orbCanvas.getContext('2d');
    if (ctx) {
      const glow = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      glow.addColorStop(0, 'rgba(235,246,255,1)');
      glow.addColorStop(0.22, 'rgba(176,211,255,0.8)');
      glow.addColorStop(1, 'rgba(105,157,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 32, 32);
    }
    const orbTexture = new THREE.CanvasTexture(orbCanvas);
    orbTexture.colorSpace = THREE.SRGBColorSpace;
    const orbMaterial = new THREE.PointsMaterial({
      color: 0xc7ddff,
      map: orbTexture,
      size: lowPower ? 0.24 : 0.21,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      toneMapped: false,
    });
    const orbs = new THREE.Points(orbGeometry, orbMaterial);
    orbs.name = 'exterior_moonlight_tiny_orbs';
    orbs.frustumCulled = false;
    group.add(orbs);
    this.exteriorMoonOrbBase = base;
    this.exteriorMoonOrbPhase = phases;
    this.exteriorMoonOrbs = orbs;
    this.exteriorMoonlightGroup = group;
    this.sceneManager.scene.add(group);
  }

  private updateExteriorMoonlightEffects(delta: number, nightAmount: number): void {
    if (!this.exteriorMoonlightGroup) return;
    const visible = nightAmount > 0.035 && !this.isInsideCuriosityCrypt;
    this.exteriorMoonlightGroup.visible = visible;
    this.exteriorMoonTime += Math.min(delta, 0.1);
    if (this.exteriorMoonBeamMaterial) {
      this.exteriorMoonBeamMaterial.uniforms.uNightIntensity.value = nightAmount;
      this.exteriorMoonBeamMaterial.uniforms.uTime.value = this.exteriorMoonTime;
    }
    if (this.templeWindowGlowMaterial) {
      this.templeWindowGlowMaterial.uniforms.uGlow.value = nightAmount;
      this.templeWindowGlowMaterial.uniforms.uTime.value = this.exteriorMoonTime;
    }
    if (visible) {
      for (const beam of this.exteriorMoonBeams) {
        // Move the paired light sheets gently along route segments. The sweep
        // is deterministic, low frequency and transform-only (no allocations
        // or extra light/shadow work in the frame loop).
        const travel = 0.5 + 0.22 * Math.sin(this.exteriorMoonTime * 0.12 + beam.phase);
        beam.root.position.lerpVectors(beam.start, beam.end, travel);
        beam.root.position.y += 7.6;
        const moon = this.dayNightCycle?.moonDirection;
        if (moon) beam.root.rotation.y = beam.yaw + Math.atan2(moon.x, moon.z) * 0.025;
      }
    }
    if (!this.exteriorMoonOrbs || !this.exteriorMoonOrbBase || !this.exteriorMoonOrbPhase) return;
    const material = this.exteriorMoonOrbs.material as THREE.PointsMaterial;
    material.opacity = 0.72 * nightAmount;
    if (!visible) return;
    this.exteriorMoonOrbElapsed += delta;
    if (this.exteriorMoonOrbElapsed < 1 / 24) return;
    this.exteriorMoonOrbElapsed = 0;
    const positions = this.exteriorMoonOrbs.geometry.getAttribute('position') as THREE.BufferAttribute;
    const values = positions.array as Float32Array;
    for (let i = 0; i < this.exteriorMoonOrbPhase.length; i++) {
      const offset = i * 3;
      const phase = this.exteriorMoonOrbPhase[i] + performance.now() * 0.00022;
      values[offset] = this.exteriorMoonOrbBase[offset] + Math.sin(phase) * 0.16;
      values[offset + 1] = this.exteriorMoonOrbBase[offset + 1] + Math.sin(phase * 0.71) * 0.28;
      values[offset + 2] = this.exteriorMoonOrbBase[offset + 2] + Math.cos(phase * 0.83) * 0.12;
    }
    positions.needsUpdate = true;
  }

  private addTempleCollision(asset: THREE.Object3D): void {
    asset.updateMatrixWorld(true);
    // Build collision in the temple asset's local coordinates. Do not derive
    // the wall perimeter from the whole merged GLB: its roof/eaves and stair
    // landing extend to about ±7.9 source units, which placed an invisible
    // front wall across the outside stairs and made the entrance look closed.
    // The authored wall shell is ±5.4 units; its front doorway is at z=-4.7.
    const localFootprint = new THREE.Box3();
    localFootprint.set(new THREE.Vector3(-5.4, 0, -5.4), new THREE.Vector3(5.4, 8.5, 5.4));
    const localCenterX = 0;
    const localCenterZ = 0;
    const halfW = 5.4;
    const halfD = 5.4;
    asset.userData.templeLocalFootprint = { minX: localFootprint.min.x, maxX: localFootprint.max.x, minZ: localFootprint.min.z, maxZ: localFootprint.max.z, centerX: localCenterX, centerZ: localCenterZ, halfW, halfD };
    const proxy = new THREE.Group();
    proxy.name = 'central_temple_open_entrance_collision';
    // `visible:false` also disables Mesh.raycast in Three.js. Keep the proxies
    // raycastable while suppressing every framebuffer write.
    const material = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
    const wallHeight = 12.2;
    const thickness = 0.34;
    const scene = this.sceneManager.scene;
    const addWall = (name: string, sx: number, sz: number, x: number, y: number, z: number) => {
      // Build these proxies in world space. The GLB root is translated to
      // center its rendered bounds, so child-local assumptions can drift from
      // the visible shell; world-converting each authored wall keeps collision
      // aligned with the actual temple after scaling and rotation.
      const localCenter = new THREE.Vector3(x, y, z);
      const worldCenter = asset.localToWorld(localCenter);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(
        sx * Math.abs(asset.scale.x),
        wallHeight * Math.abs(asset.scale.y),
        sz * Math.abs(asset.scale.z)
      ), material);
      wall.name = name;
      wall.userData.solidPlayerBlocker = true;
      wall.frustumCulled = false;
      wall.position.copy(worldCenter);
      wall.rotation.y = asset.rotation.y;
      proxy.add(wall);
    };
    const wallY = wallHeight * 0.5;
    // The actual façade is at local z=-4.7. The temple is rotated by π, so that
    // side faces the outdoor approach. The stairs/roof at z≈-7.9 are not a wall.
    const openingHalf = 2.35;
    const frontZ = -4.7;
    const rearZ = localFootprint.max.z;
    const frontSegmentWidth = Math.max(0.5, halfW - openingHalf);
    addWall('temple_west_wall', thickness, halfD * 2, localFootprint.min.x, wallY, localCenterZ);
    addWall('temple_east_wall', thickness, halfD * 2, localFootprint.max.x, wallY, localCenterZ);
    addWall('temple_rear_wall', halfW * 2, thickness, localCenterX, wallY, rearZ);
    addWall('temple_front_wall_left', frontSegmentWidth, thickness, localCenterX - (halfW + openingHalf) * 0.5, wallY, frontZ);
    addWall('temple_front_wall_right', frontSegmentWidth, thickness, localCenterX + (halfW + openingHalf) * 0.5, wallY, frontZ);
    // This proxy is intentionally a scene-level group: it must not inherit the
    // temple root's scale/translation a second time after its boxes were
    // converted to world-space dimensions and positions.
    scene.add(proxy);
    proxy.updateMatrixWorld(true);
    // Five inexpensive box colliders stay active from the start. Distance
    // activation caused a race where a fast approach or a respawn could enter
    // the temple before the walls were added to PlayerController's cache.
    this.levelColliders.push(proxy);
    this.openTempleEntrance(asset);
    this.addTempleBalconyCollision(asset);
  }

  /** Add collision only to the narrow exterior balcony strips. The central
   * deck and entrance stairs are handled by addTempleStoneFloor and are left
   * untouched here. Supports are sampled from the real asset so they cannot
   * create a guessed slab over grass or furniture. */
  private addTempleBalconyCollision(asset: THREE.Object3D): void {
    const startedAt = performance.now();
    asset.updateMatrixWorld(true);
    const root = new THREE.Group();
    root.name = 'central_temple_exterior_balcony_collision';
    const invisible = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
    const vertices: number[] = [];
    const normals: number[] = [];
    const step = 0.24;
    const half = step * 0.53;
    // Two side galleries outside the temple wall shell. The front stair and
    // central floor are excluded. The previous implementation cast one full
    // ray through the complete 318k-vertex GLB for every 24 cm patch; several
    // hundred repeated whole-mesh raycasts stalled the main thread on entry.
    // Instead, scan the source triangles once, rasterize only upward-facing
    // balcony faces into a small local height grid, then emit the same patches.
    const xMin = -7.05;
    const xMax = 7.05;
    const zMin = -4.25;
    const xCount = Math.ceil((xMax - xMin) / step);
    const zCount = Math.ceil((4.25 - zMin) / step);
    const leftHeights = new Float32Array(xCount * zCount);
    const rightHeights = new Float32Array(xCount * zCount);
    leftHeights.fill(-Infinity);
    rightHeights.fill(-Infinity);
    const inverseAssetWorld = asset.matrixWorld.clone().invert();
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    const edge1 = new THREE.Vector3(), edge2 = new THREE.Vector3(), faceNormal = new THREE.Vector3();
    const geometryToTemple = new THREE.Matrix4();
    let inspectedTriangles = 0;
    let accepted = 0;
    asset.traverse((object) => {
      const mesh = object as THREE.Mesh;
      const geometry = mesh.isMesh ? mesh.geometry : undefined;
      const position = geometry?.getAttribute('position');
      if (!geometry || !position) return;
      geometryToTemple.copy(inverseAssetWorld).multiply(mesh.matrixWorld);
      const index = geometry.getIndex();
      const sourceCount = index?.count ?? position.count;
      const groups = geometry.groups.length
        ? geometry.groups.map(({ start, count }) => ({ start, count }))
        : [{ start: 0, count: sourceCount }];
      for (const group of groups) {
        const end = Math.min(sourceCount, group.start + group.count);
        for (let i = group.start; i + 2 < end; i += 3) {
          inspectedTriangles++;
          a.fromBufferAttribute(position, index ? index.getX(i) : i).applyMatrix4(geometryToTemple);
          b.fromBufferAttribute(position, index ? index.getX(i + 1) : i + 1).applyMatrix4(geometryToTemple);
          c.fromBufferAttribute(position, index ? index.getX(i + 2) : i + 2).applyMatrix4(geometryToTemple);
          faceNormal.crossVectors(edge1.subVectors(b, a), edge2.subVectors(c, a)).normalize();
          if (faceNormal.y < 0.82) continue;
          const minY = Math.min(a.y, b.y, c.y);
          const maxY = Math.max(a.y, b.y, c.y);
          const minX = Math.min(a.x, b.x, c.x);
          const maxX = Math.max(a.x, b.x, c.x);
          const minZ = Math.min(a.z, b.z, c.z);
          const maxZ = Math.max(a.z, b.z, c.z);
          if (maxY < 0.88 || minY > 1.16 || minZ > 4.25 || maxZ < -4.25) continue;
          for (const side of [-1, 1] as const) {
            const sideMin = side < 0 ? -7.05 : 5.45;
            const sideMax = side < 0 ? -5.45 : 7.05;
            if (maxX < sideMin || minX > sideMax) continue;
            const heights = side < 0 ? leftHeights : rightHeights;
            const firstX = Math.max(0, Math.floor((Math.max(minX, sideMin) - xMin) / step));
            const lastX = Math.min(xCount - 1, Math.floor((Math.min(maxX, sideMax) - xMin) / step));
            const firstZ = Math.max(0, Math.floor((Math.max(minZ, zMin) - zMin) / step));
            const lastZ = Math.min(zCount - 1, Math.floor((Math.min(maxZ, 4.25) - zMin) / step));
            const denominator = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
            if (Math.abs(denominator) < 1e-7) continue;
            for (let gx = firstX; gx <= lastX; gx++) {
              const px = xMin + (gx + 0.5) * step;
              if (px < sideMin || px > sideMax) continue;
              for (let gz = firstZ; gz <= lastZ; gz++) {
                const pz = zMin + (gz + 0.5) * step;
                const wa = ((b.z - c.z) * (px - c.x) + (c.x - b.x) * (pz - c.z)) / denominator;
                const wb = ((c.z - a.z) * (px - c.x) + (a.x - c.x) * (pz - c.z)) / denominator;
                const wc = 1 - wa - wb;
                if (wa < -1e-4 || wb < -1e-4 || wc < -1e-4) continue;
                const y = wa * a.y + wb * b.y + wc * c.y;
                if (y < 0.88 || y > 1.16) continue;
                const cell = gx * zCount + gz;
                if (y > heights[cell]!) heights[cell] = y;
              }
            }
          }
        }
      }
    });
    for (const side of [-1, 1] as const) {
      const heights = side < 0 ? leftHeights : rightHeights;
      const sideMin = side < 0 ? -7.05 : 5.45;
      const sideMax = side < 0 ? -5.45 : 7.05;
      for (let gx = 0; gx < xCount; gx++) {
        const x = xMin + (gx + 0.5) * step;
        if (x < sideMin || x > sideMax) continue;
        for (let gz = 0; gz < zCount; gz++) {
          const y = heights[gx * zCount + gz]!;
          if (!Number.isFinite(y)) continue;
          const z = zMin + (gz + 0.5) * step;
          const localCorners = [
            new THREE.Vector3(x - half, y + 0.014, z - half),
            new THREE.Vector3(x + half, y + 0.014, z - half),
            new THREE.Vector3(x + half, y + 0.014, z + half),
            new THREE.Vector3(x - half, y + 0.014, z + half),
          ];
          const [p0, p1, p2, p3] = localCorners.map((point) => asset.localToWorld(point));
          vertices.push(p0!.x, p0!.y, p0!.z, p1!.x, p1!.y, p1!.z, p2!.x, p2!.y, p2!.z,
            p0!.x, p0!.y, p0!.z, p2!.x, p2!.y, p2!.z, p3!.x, p3!.y, p3!.z);
          for (let i = 0; i < 6; i++) normals.push(0, 1, 0);
          accepted++;
        }
      }
    }
    if (!vertices.length) {
      console.info(`[Performance] Temple balcony scan: ${inspectedTriangles} triangles, 0 support patches after ${(performance.now() - startedAt).toFixed(1)} ms; existing floor/stair supports remain unchanged.`);
      return;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.computeBoundingSphere();
    const support = new THREE.Mesh(geometry, invisible);
    support.name = 'central_temple_balcony_walkable_support';
    support.userData.walkableSupport = true;
    support.frustumCulled = false;
    root.add(support);

    // Invisible safety rails follow the outside edges of the two galleries.
    // They stop falls while preserving the passage from the stair landing.
    for (const side of [-1, 1]) {
      const localCenter = new THREE.Vector3(side * 7.12, 1.58, 0);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(
        0.16 * Math.abs(asset.scale.x), 1.05 * Math.abs(asset.scale.y), 8.35 * Math.abs(asset.scale.z)
      ), invisible);
      rail.name = `central_temple_balcony_outer_limit_${side < 0 ? 'left' : 'right'}`;
      rail.userData.solidPlayerBlocker = true;
      rail.position.copy(asset.localToWorld(localCenter));
      rail.rotation.y = asset.rotation.y;
      rail.frustumCulled = false;
      root.add(rail);
    }
    this.sceneManager.scene.add(root);
    root.updateMatrixWorld(true);
    this.levelColliders.push(root);
    console.info(`[Performance] Temple balcony support: ${inspectedTriangles} triangles scanned once, ${accepted} surface patches, ${(performance.now() - startedAt).toFixed(1)} ms.`);
  }

  /** Clear the authored central entrance: this temple has an open passage, not
   * a door leaf. The GLB is merged, so remove only the lower front-facing
   * triangles inside the measured doorway and preserve its columns/façade. */
  private openTempleEntrance(asset: THREE.Object3D): void {
    asset.updateMatrixWorld(true);
    const inverseAssetWorld = asset.matrixWorld.clone().invert();
    const footprint = asset.userData.templeLocalFootprint;
    const doorwayCenterX = footprint?.centerX ?? 0;
    const doorwayFrontZ = -4.7;
    asset.traverse((object) => {
      const mesh = object as THREE.Mesh;
      const geometry = mesh.isMesh ? mesh.geometry : undefined;
      const position = geometry?.getAttribute('position');
      const index = geometry?.getIndex();
      if (!geometry || !position || geometry.userData.openTempleDoorCut) return;
      // Some door trim in the textured export is non-indexed. Process its
      // sequential triangle vertices too, otherwise those thin pieces survive
      // even though the main indexed panel was removed.
      const sourceCount = index?.count ?? position.count;
      const sourceGroups = geometry.groups.length ? geometry.groups.map((group) => ({ ...group })) : [{ start: 0, count: sourceCount, materialIndex: 0 }];
      const output: number[] = [];
      const groups: Array<{ start: number; count: number; materialIndex: number }> = [];
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
      // Imported models can have nested mesh transforms. Evaluate each face in
      // the temple root's local coordinates so the cut remains aligned to the
      // real doorway after the model's scale, origin and rotation are applied.
      const geometryToTemple = inverseAssetWorld.clone().multiply(mesh.matrixWorld);
      for (const group of sourceGroups) {
        const start = output.length;
        const end = group.start + group.count;
        for (let i = group.start; i + 2 < end; i += 3) {
          const ia = index ? index.getX(i) : i;
          const ib = index ? index.getX(i + 1) : i + 1;
          const ic = index ? index.getX(i + 2) : i + 2;
          a.fromBufferAttribute(position, ia).applyMatrix4(geometryToTemple);
          b.fromBufferAttribute(position, ib).applyMatrix4(geometryToTemple);
          c.fromBufferAttribute(position, ic).applyMatrix4(geometryToTemple);
          // The merged export triangulates the door/panel and its narrow frame
          // into separate pieces. Cutting only front-facing triangles leaves
          // the side faces and thin jamb shards visible across the opening.
          const centerX = (a.x + b.x + c.x) / 3;
          const centerY = (a.y + b.y + c.y) / 3;
          const centerZ = (a.z + b.z + c.z) / 3;
          const doorwayHalfWidth = 2.52;
          const doorwayHalfDepth = 0.92;
          const doorwayTop = 4.78;
          const triMinX = Math.min(a.x, b.x, c.x);
          const triMaxX = Math.max(a.x, b.x, c.x);
          const triMinY = Math.min(a.y, b.y, c.y);
          const triMaxY = Math.max(a.y, b.y, c.y);
          const triMinZ = Math.min(a.z, b.z, c.z);
          const triMaxZ = Math.max(a.z, b.z, c.z);
          const doorway = Math.abs(centerX - doorwayCenterX) < doorwayHalfWidth &&
            centerY < doorwayTop && centerY > 0.12 &&
            centerZ < doorwayFrontZ + doorwayHalfDepth && centerZ > doorwayFrontZ - doorwayHalfDepth &&
            triMinX < doorwayCenterX + doorwayHalfWidth && triMaxX > doorwayCenterX - doorwayHalfWidth &&
            triMinY < doorwayTop && triMaxY > 0.12 &&
            triMinZ < doorwayFrontZ + doorwayHalfDepth && triMaxZ > doorwayFrontZ - doorwayHalfDepth;
          if (!doorway) output.push(ia, ib, ic);
        }
        const count = output.length - start;
        if (count) groups.push({ start, count, materialIndex: group.materialIndex ?? 0 });
      }
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(output), 1));
      geometry.clearGroups();
      groups.forEach((group) => geometry.addGroup(group.start, group.count, group.materialIndex));
      geometry.userData.openTempleDoorCut = true;
      geometry.computeBoundingSphere();
    });
  }

  private alignStaffChestToPavilionTable(pavilion: THREE.Object3D, x: number, z: number): void {
    if (!this.staffChest) return;
    const ground = this.getTerrainHeight(x, z);
    const ray = new THREE.Raycaster(new THREE.Vector3(x, ground + 5, z), new THREE.Vector3(0, -1, 0), 0, 8);
    const tabletop = ray.intersectObject(pavilion, true)
      .filter((hit) => hit.face && hit.point.y > ground + 0.8 && hit.point.y < ground + 3.5)
      .sort((a, b) => b.point.y - a.point.y)[0];
    if (!tabletop) {
      console.warn('[LevelToyStory] Pavilion table surface was not found; keeping the authored chest placement.');
      return;
    }
    const position = new THREE.Vector3(x, tabletop.point.y + 0.025, z);
    this.staffChest.position.copy(position);
    this.staffChest.mesh.position.copy(position);
    this.staffChest.mesh.scale.setScalar(0.74);
    console.info('[LevelToyStory] Staff chest aligned to the visible pavilion tabletop.');
  }

  private syncStructureColliders(playerPos: THREE.Vector3): void {
    // These are only a few distance checks; update immediately so proxies do
    // not linger as ghost barriers after leaving the temple area.
    let changed = false;
    for (const candidate of this.structureColliderCandidates) {
      const dx = playerPos.x - candidate.center.x;
      const dz = playerPos.z - candidate.center.z;
      const distanceSq = dx * dx + dz * dz;
      const shouldBeActive = distanceSq <= candidate.radius * candidate.radius;
      if (shouldBeActive === candidate.active) continue;
      candidate.active = shouldBeActive;
      if (shouldBeActive) this.levelColliders.push(candidate.root);
      else {
        const index = this.levelColliders.indexOf(candidate.root);
        if (index >= 0) this.levelColliders.splice(index, 1);
      }
      changed = true;
    }
    if (changed) {
      this.player.setColliders(this.levelColliders);
      this.cameraController.setCollisionObjects(this.levelColliders);
    }
  }

  /** Follow the authored GLB treads on temple stair flights other than the
   * carefully fitted main entrance. Thin support patches do not span doorways
   * or add collision to wall panels. */
  private addTempleSecondaryStairSupports(temple: THREE.Object3D, deckY: number, terrainY: number): void {
    temple.updateMatrixWorld(true);
    const footprint = temple.userData.templeLocalFootprint;
    const halfW = footprint?.halfW ?? 5.4;
    const halfD = footprint?.halfD ?? 5.4;
    const vertices: number[] = [];
    const normals: number[] = [];
    let accepted = 0;
    const worldA = new THREE.Vector3();
    const worldB = new THREE.Vector3();
    const worldC = new THREE.Vector3();
    const localA = new THREE.Vector3();
    const localB = new THREE.Vector3();
    const localC = new THREE.Vector3();
    const centroid = new THREE.Vector3();
    const faceNormal = new THREE.Vector3();
    const edgeA = new THREE.Vector3();
    const edgeB = new THREE.Vector3();

    // Extract the authored upward-facing GLB triangles once at load. The old
    // horizontal sampling grid missed narrow stair treads, causing sinking.
    temple.traverse((object) => {
      const mesh = object as THREE.Mesh;
      const position = mesh.geometry?.attributes.position;
      if (!mesh.isMesh || !position) return;
      const index = mesh.geometry.index;
      const triangleCount = index ? index.count / 3 : position.count / 3;
      for (let triangle = 0; triangle < triangleCount; triangle++) {
        const ia = index ? index.getX(triangle * 3) : triangle * 3;
        const ib = index ? index.getX(triangle * 3 + 1) : triangle * 3 + 1;
        const ic = index ? index.getX(triangle * 3 + 2) : triangle * 3 + 2;
        worldA.fromBufferAttribute(position, ia).applyMatrix4(mesh.matrixWorld);
        worldB.fromBufferAttribute(position, ib).applyMatrix4(mesh.matrixWorld);
        worldC.fromBufferAttribute(position, ic).applyMatrix4(mesh.matrixWorld);
        edgeA.subVectors(worldB, worldA);
        edgeB.subVectors(worldC, worldA);
        faceNormal.crossVectors(edgeA, edgeB).normalize();
        if (faceNormal.y < 0.82) continue;
        localA.copy(worldA); temple.worldToLocal(localA);
        localB.copy(worldB); temple.worldToLocal(localB);
        localC.copy(worldC); temple.worldToLocal(localC);
        centroid.copy(localA).add(localB).add(localC).multiplyScalar(1 / 3);
        // Only low exterior stair flights; central deck, balconies, roof,
        // furniture and walls retain their existing collision treatment.
        if (centroid.y < -0.12 || centroid.y > 2.25) continue;
        if (Math.max(Math.abs(centroid.x) - halfW * 0.94, Math.abs(centroid.z) - halfD * 0.94) <= 0) continue;
        if (Math.abs(centroid.x) > 8.25 || Math.abs(centroid.z) > 8.25) continue;
        if (Math.min(worldA.y, worldB.y, worldC.y) < terrainY - 0.18) continue;
        if (Math.max(worldA.y, worldB.y, worldC.y) > deckY + 0.3) continue;
        for (const point of [worldA, worldB, worldC]) vertices.push(point.x, point.y + 0.012, point.z);
        for (let i = 0; i < 3; i++) normals.push(0, 1, 0);
        accepted++;
      }
    });
    if (!vertices.length) {
      console.info('[LevelToyStory] No secondary temple stair treads found; main entrance supports remain active.');
      return;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.computeBoundingSphere();
    const support = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      colorWrite: false, depthWrite: false, side: THREE.DoubleSide
    }));
    support.name = 'central_temple_secondary_stairs_walkable_support';
    support.userData.walkableSupport = true;
    support.frustumCulled = false;
    this.sceneManager.scene.add(support);
    this.levelColliders.push(support);
    console.info(`[LevelToyStory] Added ${accepted} exact walkable triangles for secondary temple stairs.`);
  }

  private addTempleStoneFloor(temple?: THREE.Object3D): void {
    // The outdoor terrain is y=0 here. Keep the walkable temple surface within
    // the player's step height and put the collider's top at the same y as the
    // visible mosaic, avoiding the old 46 cm floor lip that hid Wukong's legs.
    const groundY = this.getTerrainHeight(0, -40);
    let topY = groundY + 0.16;
    let frontZ = -31.8;
    let rearZ = -48.2;
    let floorCenterX = 0;
    let floorCenterZ = -40;
    let localFrontZ = -5.4;
    let localCenterX = 0;
    let localCenterZ = 0;
    let mainStairHalfWidth = 4.8;
    if (temple) {
      temple.updateMatrixWorld(true);
      const footprint = temple.userData.templeLocalFootprint;
      const centerLocal = new THREE.Vector3(footprint?.centerX ?? 0, 0, footprint?.centerZ ?? 0);
      const worldCenter = temple.localToWorld(centerLocal.clone());
      floorCenterX = worldCenter.x;
      floorCenterZ = worldCenter.z;
      localCenterX = footprint?.centerX ?? 0;
      localCenterZ = footprint?.centerZ ?? 0;
      localFrontZ = footprint?.minZ ?? -5.4;
      const frontWorld = temple.localToWorld(new THREE.Vector3(localCenterX, 0, localFrontZ));
      const rearWorld = temple.localToWorld(new THREE.Vector3(localCenterX, 0, footprint?.maxZ ?? 5.4));
      frontZ = frontWorld.z;
      rearZ = rearWorld.z;
      const surfaceRay = new THREE.Raycaster();
      const rayOrigin = new THREE.Vector3();
      const down = new THREE.Vector3(0, -1, 0);
      // Sample only the authored deck's top surface. The GLB has several
      // walkable-looking horizontal pieces at different elevations (stairs,
      // ledges and furniture); mixing those hits lifted the whole floor and
      // buried Wukong in the entrance.
      const walkableHeights: number[] = [];
      const deckHalfX = 5.02;
      const deckHalfZ = 5.02;
      const sampleHalfX = deckHalfX * 0.72;
      const sampleHalfZ = deckHalfZ * 0.72;
      for (const z of [-0.72, -0.48, 0.48, 0.72].map((v) => (footprint?.centerZ ?? 0) + sampleHalfZ * Math.sign(v)))
        for (const x of [-1, 1].map((v) => (footprint?.centerX ?? 0) + sampleHalfX * v)) {
        const sample = temple.localToWorld(new THREE.Vector3(x, 0, z));
        rayOrigin.set(sample.x, groundY + 8, sample.z);
        surfaceRay.set(rayOrigin, down);
        surfaceRay.far = 10;
        const hit = surfaceRay.intersectObject(temple, true).find((candidate) => {
          if (!candidate.face || candidate.point.y < groundY + 0.35 || candidate.point.y > groundY + 2.5) return false;
          if (candidate.face.normal.clone().transformDirection(candidate.object.matrixWorld).y <= 0.82) return false;
          const localHit = temple.worldToLocal(candidate.point.clone());
          return localHit.y >= 0.90 && localHit.y <= 1.06;
        });
        if (hit) walkableHeights.push(hit.point.y);
      }
      if (walkableHeights.length >= 4) {
        walkableHeights.sort((a, b) => a - b);
        const middle = Math.floor(walkableHeights.length / 2);
        const median = walkableHeights.length % 2
          ? walkableHeights[middle]
          : (walkableHeights[middle - 1] + walkableHeights[middle]) * 0.5;
        topY = median + 0.008;
      } else {
        // The deck surface is authored at local Y≈0.98; the root is grounded
        // at local Y≈0.025. Keep the world-space platform tied to that surface.
        topY = temple.position.y + (0.98 - 0.025) * temple.scale.y + 0.008;
      }
    }
    // Keep the added finish strictly over the temple's ~18.5 m foundation.
    // Scanning every roof/stair vertex at this height accidentally included
    // the approach and made a large square pad spill into the surrounding land.
    // Fit the floor to the actual wall footprint (±5.4 model units), rather
    // than clipping it to a fixed 16 m square. The roof eaves are wider, so
    // this keeps the finish inside the building while covering its walkable
    // interior without a second drop at the stair landing.
    // Match the deck mesh itself (about ±5.2 source units), not the wider
    // eaves or guessed wall footprint. This closes the walkable deck without
    // laying a visible slab over the stairs, grass or exterior foundation.
    const floorWidth = temple ? 2 * 5.02 * Math.abs(temple.scale.x) : 16;
    const floorDepth = temple ? 2 * 5.02 * Math.abs(temple.scale.z) : 16;
    floorCenterZ = temple ? (frontZ + rearZ) * 0.5 : -40;
    this.centralTempleFloorWidth = floorWidth;
    this.centralTempleFloorDepth = floorDepth;
    this.centralTempleFloorCenterZ = floorCenterZ;
    // The textured temple export has gaps in the interior deck. A hidden
    // support plane alone made the outdoor grass show through and Wukong look
    // half buried. Render one lightweight tiled stone surface over the exact
    // same walkable plane so appearance and grounding share a single height.
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: this.createTempleFloorTexture(),
        color: 0xc3c5ca,
        roughness: 0.72,
        metalness: 0.08,
        emissive: 0x101923,
        emissiveIntensity: 0.14,
        side: THREE.DoubleSide
      });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth, floorDepth), floorMaterial);
    floor.name = 'central_temple_walkable_floor_surface';
    floor.userData.walkableSupport = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(floorCenterX, topY + 0.006, floorCenterZ);
    floor.receiveShadow = true;
    floor.renderOrder = 1;
    this.sceneManager.scene.add(floor);
    // Keep a separate raycastable collider at the precise visual top. It is
    // intentionally invisible but remains in the player's collision list.
    const support = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth, floorDepth), new THREE.MeshBasicMaterial({
      colorWrite: false, depthWrite: false, side: THREE.DoubleSide
    }));
    support.name = 'central_temple_walkable_floor_support';
    support.userData.walkableSupport = true;
    support.rotation.x = -Math.PI / 2;
    support.position.set(floorCenterX, topY + 0.006, floorCenterZ);
    support.receiveShadow = false;
    this.sceneManager.scene.add(support);
    this.levelColliders.push(support);
    this.centralTempleFloorTopY = topY;

    // The GLB stairs are decorative render meshes. Their authored run is
    // 2.15 source units (local z -5.4 to -7.55); the old 4.4-unit guess made
    // the invisible ramp overshoot the visible steps and create a bad landing.
    if (temple) {
      const stairWidth = Math.max(7.2, Math.min(9.6, 6.1 * temple.scale.x));
      mainStairHalfWidth = stairWidth * 0.5;
      const stairTop = temple.localToWorld(new THREE.Vector3(localCenterX, 0, localFrontZ));
      const stairFoot = temple.localToWorld(new THREE.Vector3(localCenterX, 0, localFrontZ - 2.15));
      const footY = this.getTerrainHeight(stairFoot.x, stairFoot.z) + 0.015;
      const stairRun = stairFoot.clone().sub(stairTop);
      const stairLength = stairRun.length();
      const stairDirection = stairRun.clone().normalize();
      const stairYaw = Math.atan2(stairDirection.x, stairDirection.z);
      const treadCount = 4;
      const treadDepth = stairLength / treadCount + 0.09;
      let firstTreadTopY = topY;
      const stairDown = new THREE.Vector3(0, -1, 0);
      const stairMat = new THREE.MeshBasicMaterial({
        colorWrite: false, depthWrite: false, side: THREE.DoubleSide
      });
      const stairProbe = new THREE.Raycaster();
      // Match one support slab to each visible tread. The old single sloped
      // plane left the character below the tread tops and let the feet sink
      // through the visible staircase. Sample the actual GLB once at load.
      for (let i = 0; i < treadCount; i++) {
        const t = (i + 0.5) / treadCount;
        const sample = stairTop.clone().addScaledVector(stairRun, t);
        stairProbe.set(new THREE.Vector3(sample.x, topY + 1.5, sample.z), stairDown);
        stairProbe.far = Math.max(3, topY - footY + 3);
        const treadHit = stairProbe.intersectObject(temple, true).find((hit) => {
          if (!hit.face || hit.point.y < footY - 0.15 || hit.point.y > topY + 0.25) return false;
          return hit.face.normal.clone().transformDirection(hit.object.matrixWorld).y > 0.72;
        });
        const treadY = treadHit?.point.y ?? THREE.MathUtils.lerp(topY, footY, t);
        if (i === 0) firstTreadTopY = treadY;
        const tread = new THREE.Mesh(new THREE.BoxGeometry(stairWidth, 0.14, treadDepth), stairMat);
        tread.name = `central_temple_stair_tread_support_${i + 1}`;
        tread.userData.walkableSupport = true;
        tread.position.set(sample.x, treadY - 0.07, sample.z);
        tread.rotation.y = stairYaw;
        tread.frustumCulled = false;
        this.sceneManager.scene.add(tread);
        this.levelColliders.push(tread);
      }

      // The measured deck edge is at local z -5.02, while the inner lip of
      // the first authored tread begins around local z -5.37. That left a
      // roughly 0.53 m opening between the visible floor and stair support.
      // Rebuild only that strip as visible matching stone and use the same
      // triangles for grounding, so there is no invisible platform over a gap.
      const deckEdgeLocalZ = localCenterZ - floorDepth / (2 * Math.abs(temple.scale.z));
      const firstTreadCenter = stairTop.clone().addScaledVector(stairRun, 0.5 / treadCount);
      const firstTreadInnerEdge = firstTreadCenter.clone().addScaledVector(stairDirection, -treadDepth * 0.5);
      const firstTreadInnerLocal = temple.worldToLocal(firstTreadInnerEdge.clone());
      const bridgeRunLocal = deckEdgeLocalZ - firstTreadInnerLocal.z;
      const entranceWidth = Math.min(stairWidth, 2 * 2.35 * Math.abs(temple.scale.x) - 0.08);
      if (bridgeRunLocal > 0.04 && bridgeRunLocal < 1.25 && entranceWidth > 1) {
        const halfEntranceWidthLocal = entranceWidth / (2 * Math.abs(temple.scale.x));
        const toWorld = (x: number, z: number, y: number) => {
          const point = temple.localToWorld(new THREE.Vector3(localCenterX + x, 0, z));
          point.y = y;
          return point;
        };
        const backLeft = toWorld(-halfEntranceWidthLocal, deckEdgeLocalZ, topY + 0.006);
        const backRight = toWorld(halfEntranceWidthLocal, deckEdgeLocalZ, topY + 0.006);
        const frontLeft = toWorld(-halfEntranceWidthLocal, firstTreadInnerLocal.z, firstTreadTopY + 0.004);
        const frontRight = toWorld(halfEntranceWidthLocal, firstTreadInnerLocal.z, firstTreadTopY + 0.004);
        const bridgeGeometry = new THREE.BufferGeometry();
        bridgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
          ...backLeft.toArray(), ...frontRight.toArray(), ...frontLeft.toArray(),
          ...backLeft.toArray(), ...backRight.toArray(), ...frontRight.toArray()
        ], 3));
        const backV = 1;
        const frontV = 1 + (bridgeRunLocal * Math.abs(temple.scale.z)) / floorDepth;
        bridgeGeometry.setAttribute('uv', new THREE.Float32BufferAttribute([
          0, backV, entranceWidth / floorWidth, frontV, 0, frontV,
          0, backV, entranceWidth / floorWidth, backV, entranceWidth / floorWidth, frontV
        ], 2));
        bridgeGeometry.computeVertexNormals();
        bridgeGeometry.computeBoundingSphere();
        const bridge = new THREE.Mesh(bridgeGeometry, floorMaterial);
        bridge.name = 'central_temple_entrance_stone_transition';
        bridge.receiveShadow = true;
        bridge.renderOrder = 1;
        this.sceneManager.scene.add(bridge);

        const bridgeSupport = new THREE.Mesh(bridgeGeometry.clone(), new THREE.MeshBasicMaterial({
          colorWrite: false, depthWrite: false, side: THREE.DoubleSide
        }));
        bridgeSupport.name = 'central_temple_entrance_stone_transition_support';
        bridgeSupport.userData.walkableSupport = true;
        bridgeSupport.frustumCulled = false;
        this.sceneManager.scene.add(bridgeSupport);
        this.levelColliders.push(bridgeSupport);
        console.info(`[LevelToyStory] Reconstructed visible stone landing between deck and first stair tread (${(bridgeRunLocal * Math.abs(temple.scale.z)).toFixed(2)} m).`);
      } else {
        console.info('[LevelToyStory] Temple deck already meets the first stair tread; no transition strip was necessary.');
      }
      this.addTempleSecondaryStairSupports(temple, topY, groundY);
    }

    // Coins are created before environment GLBs finish loading. Re-seat temple
    // coins after the actual stair/deck height is known so none are buried.
    const stairRay = new THREE.Raycaster();
    const stairOrigin = new THREE.Vector3();
    const down = new THREE.Vector3(0, -1, 0);
    for (const item of this.collectibleSystem.collectibles) {
      if (item.type !== 'COIN' || item.isCollected) continue;
      const pos = item.mesh.position;
      if (pos.x >= floorCenterX - floorWidth * 0.5 && pos.x <= floorCenterX + floorWidth * 0.5 &&
          pos.z >= floorCenterZ - floorDepth * 0.5 && pos.z <= floorCenterZ + floorDepth * 0.5) {
        pos.y = topY + 0.6;
      } else if (temple && Math.abs(pos.x - floorCenterX) <= mainStairHalfWidth + 0.25 && pos.z >= frontZ - 1 && pos.z <= frontZ + 10) {
        stairOrigin.set(pos.x, groundY + 8, pos.z);
        stairRay.set(stairOrigin, down);
        stairRay.far = 10;
        const stairHit = stairRay.intersectObject(temple, true).find((hit) =>
          !!hit.face && hit.face.normal.clone().transformDirection(hit.object.matrixWorld).y > 0.82 &&
          hit.point.y >= groundY - 0.15 && hit.point.y <= topY + 0.2
        );
        pos.y = (stairHit?.point.y ?? this.getTerrainHeight(pos.x, pos.z)) + 0.6;
      }
    }

    // Recessed-looking stone medallion with an actual yin-yang S curve, not a
    // flat image. Its top sits only a few millimeters above the tiled floor.
    const scene = this.sceneManager.scene;
    const medallion = new THREE.Mesh(
      new THREE.CircleGeometry(3.7, 64),
      new THREE.MeshStandardMaterial({ color: 0xd6cbb5, roughness: 0.42, metalness: 0.1, emissive: 0x173d35, emissiveIntensity: 0.045 })
    );
    medallion.name = 'temple_yinyang_mosaic_base';
    medallion.rotation.x = -Math.PI / 2;
    medallion.position.set(0, topY + 0.012, -40);
    scene.add(medallion);
    const yinShape = new THREE.Shape();
    const r = 3.15;
    yinShape.moveTo(0, r);
    yinShape.bezierCurveTo(r, r, r, -r, 0, -r);
    yinShape.absarc(0, 0, r, -Math.PI / 2, -3 * Math.PI / 2, true);
    yinShape.closePath();
    const yinStone = new THREE.Mesh(
      new THREE.ShapeGeometry(yinShape, 48),
      new THREE.MeshStandardMaterial({ color: 0x292d37, roughness: 0.4, metalness: 0.14, emissive: 0x0b3938, emissiveIntensity: 0.055, side: THREE.DoubleSide })
    );
    yinStone.name = 'temple_yinyang_dark_stone';
    yinStone.rotation.x = -Math.PI / 2;
    yinStone.position.set(0, topY + 0.014, -40);
    scene.add(yinStone);
    const dotGeometry = new THREE.CircleGeometry(0.48, 24);
    const bronze = new THREE.MeshStandardMaterial({ color: 0xb27635, roughness: 0.48, metalness: 0.52 });
    const dotLight = new THREE.Mesh(dotGeometry, new THREE.MeshStandardMaterial({ color: 0xe4d7bd, roughness: 0.55 }));
    const dotDark = new THREE.Mesh(dotGeometry, new THREE.MeshStandardMaterial({ color: 0x282a32, roughness: 0.55 }));
    dotLight.rotation.x = dotDark.rotation.x = -Math.PI / 2;
    dotLight.position.set(0, topY + 0.016, -40 - 1.55);
    dotDark.position.set(0, topY + 0.016, -40 + 1.55);
    scene.add(dotLight, dotDark);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.65, 0.045, 8, 96), bronze);
    ring.name = 'temple_yinyang_bronze_inlay';
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, topY + 0.018, -40);
    scene.add(ring);
    // Fine secondary inlays refine the existing medallion edge without
    // changing its footprint, height, collision, or yin-yang placement.
    const inlayMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0bd69, emissive: 0x3e2910, emissiveIntensity: 0.22,
      roughness: 0.3, metalness: 0.78
    });
    const innerInlay = new THREE.Mesh(new THREE.TorusGeometry(3.42, 0.018, 6, 96), inlayMaterial);
    innerInlay.name = 'temple_yinyang_inner_gold_inlay';
    innerInlay.rotation.x = Math.PI / 2;
    innerInlay.position.set(0, topY + 0.019, -40);
    const outerInlay = new THREE.Mesh(new THREE.TorusGeometry(3.82, 0.016, 6, 96), inlayMaterial);
    outerInlay.name = 'temple_yinyang_outer_gold_inlay';
    outerInlay.rotation.x = Math.PI / 2;
    outerInlay.position.set(0, topY + 0.019, -40);
    scene.add(innerInlay, outerInlay);
  }

  /** A small, reusable slate atlas that fills missing deck triangles without
   * adding per-tile meshes or any per-frame work. */
  private createTempleFloorTexture(): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create the temple floor texture.');
    context.fillStyle = '#202a36';
    context.fillRect(0, 0, size, size);
    let seed = 481516;
    const random = () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; };
    const cell = size / 4;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * cell + 3 + (row % 2 ? cell * 0.08 : 0);
        const y = row * cell + 3;
        const w = cell - 7;
        const h = cell - 7;
        const tone = Math.round(66 + random() * 22);
        context.fillStyle = `rgb(${tone},${tone + 4},${tone + 9})`;
        context.fillRect(x, y, w, h);
        context.strokeStyle = 'rgba(8,14,22,0.72)';
        context.lineWidth = 3;
        context.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
        context.strokeStyle = 'rgba(190,199,208,0.13)';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x + 5, y + 5);
        context.lineTo(x + w - 6, y + 5);
        context.stroke();
        for (let i = 0; i < 24; i++) {
          const px = x + 8 + random() * (w - 16);
          const py = y + 8 + random() * (h - 16);
          const shade = random() > 0.5 ? 'rgba(195,205,215,0.08)' : 'rgba(4,9,16,0.08)';
          context.fillStyle = shade;
          context.fillRect(px, py, 2 + random() * 5, 1 + random() * 2);
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // Four stone courses per atlas; repeat at roughly one metre per slab.
    texture.repeat.set(this.centralTempleFloorWidth / 4, this.centralTempleFloorDepth / 4);
    texture.anisotropy = Math.min(4, this.sceneManager.renderer.capabilities.getMaxAnisotropy());
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  private createGrassGroundTexture(): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not create the grass ground texture.');

    // Low-contrast olive noise reads as covered soil instead of dark bare dirt.
    const gridSize = 17;
    let seed = 98317;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const grid = Array.from({ length: gridSize * gridSize }, () => random() * 2 - 1);
    const pixels = context.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      const gy = y / size * (gridSize - 1);
      const iy = Math.floor(gy), fy = gy - iy;
      for (let x = 0; x < size; x++) {
        const gx = x / size * (gridSize - 1);
        const ix = Math.floor(gx), fx = gx - ix;
        const a = grid[iy * gridSize + ix], b = grid[iy * gridSize + ix + 1];
        const c = grid[(iy + 1) * gridSize + ix], d = grid[(iy + 1) * gridSize + ix + 1];
        const noise = THREE.MathUtils.lerp(THREE.MathUtils.lerp(a, b, fx), THREE.MathUtils.lerp(c, d, fx), fy) * 9 + (random() - 0.5) * 5;
        const i = (y * size + x) * 4;
        pixels.data[i] = 87 + noise;
        pixels.data[i + 1] = 112 + noise;
        pixels.data[i + 2] = 45 + noise * 0.55;
        pixels.data[i + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  /**
   * Instances the authored Grass It! low-detail meshes exported from Blender.
   * The compact asset keeps the exact geometry used by the live distance bands
   * and the source albedo maps, while avoiding a second full-size GLB decode.
   */
  public loadGrassInBackground(): Promise<void> {
    if (this.grassLoadStarted) return this.grassLoadPromise ?? Promise.resolve();
    this.grassLoadStarted = true;
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    const loader = new GLTFLoader();
    this.grassLoadPromise = loader.loadAsync(`${base}wukong-grass-clumps-lod-textured.glb?v=${__APP_VERSION__}`)
      .then(async (grassLod) => {
        this.applyOriginalGrassGroundTexture(grassLod.scene);
        await this.buildOriginalGrass(grassLod.scene, grassLod.scene);
      })
      .catch((error: unknown) => {
      console.error('[Grass] Background load of the authored Grass It! LOD failed; no substitute grass was generated.', error);
        this.grassSectors.forEach((sector) => this.sceneManager.scene.remove(sector));
        this.grassSectors = [];
        this.grassUniforms = null;
        this.grassLoadStarted = false;
        this.grassLoadPromise = null;
      });
    return this.grassLoadPromise;
  }

  private applyOriginalGrassGroundTexture(sourceRoot: THREE.Object3D): void {
    if (!this.terrainGroundMaterial) return;
    const named = sourceRoot.getObjectByName('Grass_Lush') ?? sourceRoot.getObjectByName('Grass_Lush_LOD');
    let sourceMaterial: THREE.Material | undefined;
    named?.traverse((child) => {
      if (!sourceMaterial && (child as THREE.Mesh).isMesh) {
        const material = (child as THREE.Mesh).material;
        sourceMaterial = Array.isArray(material) ? material[0] : material;
      }
    });
    const sourceTexture = (sourceMaterial as THREE.MeshStandardMaterial | undefined)?.map;
    if (!sourceTexture) return;
    const groundTexture = sourceTexture.clone();
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    // The same Blender grass albedo provides a subtle continuous carpet under
    // the instanced blades, hiding distance-LOD cutoffs without a new asset.
    // Avoid the tiny, high-contrast repeat that read as a noisy checkerboard.
    groundTexture.repeat.set(58, 58);
    groundTexture.anisotropy = Math.min(4, this.sceneManager.renderer.capabilities.getMaxAnisotropy());
    groundTexture.needsUpdate = true;
    this.terrainGroundMaterial.map = groundTexture;
    this.terrainGroundMaterial.color.setHex(0x657442);
    this.terrainGroundMaterial.needsUpdate = true;
  }

  private async buildOriginalGrass(sourceRoot: THREE.Object3D, lodRoot: THREE.Object3D): Promise<void> {
    const sourceNames = ['Grass_Short', 'Grass_Lush', 'Grass_Tall'] as const;
    const weights = [0.55, 0.39, 0.06];
    // Keep the source clumps recognizable and under Wukong's ankles. The old
    // 2.3x lush range made some clumps several times taller and wider.
    const scaleRanges: Array<[number, number]> = [[0.78, 1.04], [0.68, 1.08], [0.48, 0.82]];
    this.player.visualModel.updateMatrixWorld(true);
    const characterBounds = new THREE.Box3().setFromObject(this.player.visualModel);
    const characterHeight = Math.max(0.1, characterBounds.max.y - characterBounds.min.y);
    // The 1.7 m player scale is measured from the loaded Wukong model. Keep
    // the original blade silhouette and texture, but cap its tallest tip at
    // ankle height instead of uniformly shrinking the clump's width.
    const ankleGrassHeight = Math.min(0.12, characterHeight * 0.072);
    this.grassUniforms = {
      uTime: { value: 0 },
      uPlayerPos: { value: new THREE.Vector3(999, 999, 999) },
      uWindDirection: { value: new THREE.Vector2(1, 0) },
      uWindStrength: { value: 0.12 },
    };
    sourceRoot.updateMatrixWorld(true);
    lodRoot.updateMatrixWorld(true);

    // GLTF exports Blender mesh objects as named parent Groups, with the
    // actual mesh nested below (often named Plane.003, Plane.004, etc.).
    // Resolve the named object first, then find its renderable mesh instead
    // of assuming the named node itself is a Mesh.
    const findMesh = (root: THREE.Object3D, objectName: string): THREE.Mesh | null => {
      const named = root.getObjectByName(objectName);
      if (!named) return null;
      if ((named as THREE.Mesh).isMesh) return named as THREE.Mesh;
      let mesh: THREE.Mesh | null = null;
      named.traverse((child) => {
        if (!mesh && (child as THREE.Mesh).isMesh) mesh = child as THREE.Mesh;
      });
      return mesh;
    };

    const templates = sourceNames.map((name) => {
      const source = findMesh(sourceRoot, name) ?? findMesh(sourceRoot, `${name}_LOD`);
      if (!source) throw new Error(`Original grass GLB is missing mesh under ${name}`);
      // The Blender source was exported Z-up (its blade height is on the
      // asset Z axis). Three.js places the field on an XZ ground plane with
      // Y up, so convert the original geometry once before calculating its
      // bounds or instances. Without this, the real blades lie almost flat
      // and the gameplay field appears bare even though instances exist.
      const geometry = source.geometry.clone().applyMatrix4(source.matrixWorld);
      geometry.rotateX(-Math.PI / 2);
      geometry.computeBoundingBox();
      const sourceBounds = geometry.boundingBox!;
      const height = Math.max(0.05, sourceBounds.max.y - sourceBounds.min.y);
      const centerX = (sourceBounds.min.x + sourceBounds.max.x) * 0.5;
      const centerZ = (sourceBounds.min.z + sourceBounds.max.z) * 0.5;
      geometry.translate(-centerX, -sourceBounds.min.y, -centerZ);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      const lodSource = findMesh(lodRoot, `${name}_LOD`);
      const lodGeometry = lodSource
        ? lodSource.geometry.clone().applyMatrix4(lodSource.matrixWorld)
        : geometry.clone();
      if (lodSource) lodGeometry.rotateX(-Math.PI / 2);
      lodGeometry.computeBoundingBox();
      const lodBounds = lodGeometry.boundingBox!;
      lodGeometry.translate(
        -(lodBounds.min.x + lodBounds.max.x) * 0.5,
        -lodBounds.min.y,
        -(lodBounds.min.z + lodBounds.max.z) * 0.5
      );
      lodGeometry.computeBoundingBox();
      const fullSize = geometry.boundingBox!.getSize(new THREE.Vector3());
      const lodSize = lodGeometry.boundingBox!.getSize(new THREE.Vector3());
      lodGeometry.scale(fullSize.x / Math.max(lodSize.x, 0.001), fullSize.y / Math.max(lodSize.y, 0.001), fullSize.z / Math.max(lodSize.z, 0.001));
      lodGeometry.computeBoundingBox();
      lodGeometry.computeBoundingSphere();
      // The supplied Blender LOD is already authored for silhouette quality.
      // Striding arbitrary triangles through it created broken, spiky blades.
      const lowGeometry = lodGeometry;
      const mediumGeometry = lodGeometry;
      const farGeometry = lodGeometry;

      const sourceMaterials = Array.isArray(source.material) ? source.material : [source.material];
      const materials = sourceMaterials.map((original) => {
        const material = original.clone() as THREE.MeshStandardMaterial;
        const previousCompile = material.onBeforeCompile.bind(material);
        const previousCacheKey = material.customProgramCacheKey.bind(material);
        material.customProgramCacheKey = () => `wukong-grassit-wind-v2-${height.toFixed(3)}-${previousCacheKey()}`;
        material.onBeforeCompile = (shader, renderer) => {
          previousCompile(shader, renderer);
          shader.uniforms.uTime = this.grassUniforms.uTime;
          shader.uniforms.uPlayerPos = this.grassUniforms.uPlayerPos;
          shader.uniforms.uWindDirection = this.grassUniforms.uWindDirection;
          shader.uniforms.uWindStrength = this.grassUniforms.uWindStrength;
          shader.vertexShader = `uniform float uTime;\nuniform vec3 uPlayerPos;\nuniform vec2 uWindDirection;\nuniform float uWindStrength;\n${shader.vertexShader}`;
          shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
            #include <begin_vertex>
            #ifdef USE_INSTANCING
              vec3 grassWorld = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
            #else
              vec3 grassWorld = vec3(0.0);
            #endif
            float grassTip = clamp(position.y / ${height.toFixed(4)}, 0.0, 1.0);
            float grassWave = sin(uTime * 1.15 + grassWorld.x * 0.12 + grassWorld.z * 0.09) * (0.045 + uWindStrength * 0.11)
              + sin(uTime * 0.63 - grassWorld.x * 0.07 + grassWorld.z * 0.11) * 0.04;
            transformed.x += grassWave * grassTip * grassTip;
            vec2 windDir = normalize(uWindDirection);
            vec2 localWindDir = windDir;
            #ifdef USE_INSTANCING
              vec3 instanceRight = instanceMatrix[0].xyz;
              localWindDir = vec2(instanceRight.x * windDir.x + instanceRight.z * windDir.y,
                                  -instanceRight.z * windDir.x + instanceRight.x * windDir.y);
            #endif
            float broadGust = sin(uTime * 0.42 + dot(grassWorld.xz, windDir) * 0.075);
            transformed.xz += localWindDir * broadGust * uWindStrength * 0.11 * grassTip * grassTip;
            vec2 fromPlayer = grassWorld.xz - uPlayerPos.xz;
            float playerDistance = length(fromPlayer);
            if (playerDistance < 1.25 && playerDistance > 0.001) {
              transformed.xz += normalize(fromPlayer) * (1.25 - playerDistance) * 0.24 * grassTip;
            }
          `);
        };
        material.needsUpdate = true;
        return material;
      });
      return {
        name,
        geometry,
        lodGeometry,
        lowGeometry,
        mediumGeometry,
        farGeometry,
        material: materials.length === 1 ? materials[0] : materials,
        minScale: scaleRanges[sourceNames.indexOf(name)][0],
        maxScale: scaleRanges[sourceNames.indexOf(name)][1],
        heightFactor: ankleGrassHeight / Math.max(0.01, height * scaleRanges[sourceNames.indexOf(name)][1]),
      };
    });

    // Compile the instanced LOD material variants before the field starts
    // appearing around the player. Otherwise the first visible LOD can trigger
    // shader compilation during active play on mobile browsers.
    const warmupStartedAt = performance.now();
    const warmupScene = new THREE.Scene();
    for (const template of templates) {
      const materials = Array.isArray(template.material) ? template.material : [template.material];
      for (const material of materials) {
        warmupScene.add(new THREE.InstancedMesh(template.lodGeometry, material, 1));
      }
    }
    try {
      const warmups = [...warmupScene.children];
      const variantScene = new THREE.Scene();
      for (const object of warmups) {
        variantScene.add(object);
        await this.sceneManager.renderer.compileAsync(variantScene, this.sceneManager.camera, this.sceneManager.scene);
        variantScene.remove(object);
        // Limit shader work to one material variant per frame on devices that
        // compile synchronously inside the driver.
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
      console.info(`[Performance] Grass instanced LOD shaders ready in ${(performance.now() - warmupStartedAt).toFixed(1)} ms.`);
    } catch (error) {
      console.warn('[Grass] Shader warmup failed; the browser will compile visible variants on demand.', error);
    } finally {
      warmupScene.clear();
    }

    let seed = 709391;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3();
    const slopeRotation = new THREE.Quaternion();
    const yawRotation = new THREE.Quaternion();
    const excluded = (x: number, z: number): boolean => {
      if (Math.abs(x) < 14.2 && Math.abs(z + 40) < 14.2) return true;
      if (Math.hypot(x - 45, z + 40) < 16.2) return true;
      if (Math.hypot(x + 55, z + 75) < 11.2 || Math.hypot(x - 55, z + 75) < 19.2) return true;
      if (Math.hypot(x - 20, z - 24) < 7.5) return true;
      if (Math.hypot(x + 30, z - 10) < 9 || Math.hypot(x + 45, z + 40) < 9) return true;
      if (Math.hypot(x - this.secretLavaCenter.x, z - this.secretLavaCenter.y) < 16.8) return true;
      if (Math.hypot(x - 53.5, z + 89.5) < 3.2) return true;
      if (Math.abs(x) < 4.2 && z > -27 && z < 17) return true;
      if (this.isVegetationNearPath(x, z, 1.9)) return true;
      return false;
    };

    // Mobile GPUs need the mobile instance spacing even when the browser does
    // not expose deviceMemory/hardwareConcurrency (common on iOS). Previously
    // newer phones could get the denser desktop field and overwhelm the first
    // gameplay frames despite the lower render pixel ratio.
    const isMobile = isMobileDevice() || isLowPowerDevice();
    // Smaller spatial chunks keep the high-poly source clumps close to Wukong
    // instead of rendering an entire 40 m tile at full detail.
    const sectorSize = 20;
    // The original Geometry Nodes field used far more than one clump per m².
    // Four-ish randomized source clumps per square meter closes the gaps while
    // instancing keeps the distribution compact on the GPU.
    // Source clumps contain many fine blades already. A wider mobile sampling
    // interval retains the carpet while reducing instance preparation and draws.
    const spacing = isMobile ? 0.92 : 0.72;
    // Offset the X grid so the normal spawn point lies near a cell center,
    // rather than exactly on a seam that would activate two full-detail tiles.
    const xSectorOrigin = -90;
    const zSectorOrigin = -120;
    const rowsPerYield = isMobile ? 1 : 2;
    const sectorsX = Math.ceil(180 / sectorSize);
    const sectorsZ = Math.ceil(160 / sectorSize);
    let placedTotal = 0;
    const playerAtLoad = this.player.mesh.position;
    const sectorOrder: Array<[number, number]> = [];
    for (let sx = 0; sx < sectorsX; sx++) {
      for (let sz = 0; sz < sectorsZ; sz++) sectorOrder.push([sx, sz]);
    }
    const sectorDistanceSq = ([sx, sz]: [number, number]) => {
      const cx = xSectorOrigin + sx * sectorSize + sectorSize * 0.5;
      const cz = zSectorOrigin + sz * sectorSize + sectorSize * 0.5;
      return (cx - playerAtLoad.x) ** 2 + (cz - playerAtLoad.z) ** 2;
    };
    sectorOrder.sort((a, b) => sectorDistanceSq(a) - sectorDistanceSq(b));
    for (const [sx, sz] of sectorOrder) {
        const x0 = xSectorOrigin + sx * sectorSize;
        const z0 = zSectorOrigin + sz * sectorSize;
        const matrices = templates.map(() => [] as THREE.Matrix4[]);
        const steps = Math.ceil(sectorSize / spacing);
        for (let gx = 0; gx < steps; gx++) {
          for (let gz = 0; gz < steps; gz++) {
          const x = x0 + (gx + 0.12 + random() * 0.76) * spacing;
          const z = z0 + (gz + 0.12 + random() * 0.76) * spacing;
          if (x < -80 || x > 80 || z > 40 || excluded(x, z)) continue;
          const roll = random();
          const variant = roll < weights[0] ? 0 : roll < weights[0] + weights[1] ? 1 : 2;
          const groundY = this.getTerrainHeight(x, z);
          const slopeX = (this.getTerrainHeight(x + 0.18, z) - this.getTerrainHeight(x - 0.18, z)) / 0.36;
          const slopeZ = (this.getTerrainHeight(x, z + 0.18) - this.getTerrainHeight(x, z - 0.18)) / 0.36;
          normal.set(-slopeX, 1, -slopeZ).normalize();
          slopeRotation.setFromUnitVectors(up, normal);
          yawRotation.setFromAxisAngle(normal, random() * Math.PI * 2);
          const template = templates[variant];
          const scale = THREE.MathUtils.lerp(template.minScale, template.maxScale, random());
          dummy.position.set(x, groundY + 0.008, z);
          dummy.quaternion.copy(slopeRotation).multiply(yawRotation);
          dummy.scale.set(scale, scale * template.heightFactor, scale);
          dummy.updateMatrix();
          matrices[variant].push(dummy.matrix.clone());
          }
          // Keep the render/input loop responsive on mobile and desktop while
          // sampling the same original grass field at the selected density.
          if (gx > 0 && gx % rowsPerYield === 0) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          }
        }

        matrices.forEach((instances, variant) => {
          if (!instances.length) return;
          const template = templates[variant];
          const sector = new THREE.InstancedMesh(template.lodGeometry, template.material, instances.length);
          sector.name = `grassit-${template.name.toLowerCase()}-sector-${sx}-${sz}`;
          const center = new THREE.Vector2(x0 + sectorSize * 0.5, z0 + sectorSize * 0.5);
          sector.userData.grassCenter = center;
          sector.userData.grassHalfSize = sectorSize * 0.5;
          sector.userData.grassLodGeometry = template.lodGeometry;
          sector.userData.grassLowGeometry = template.lowGeometry;
          sector.userData.grassMediumGeometry = template.mediumGeometry;
          sector.userData.grassFarGeometry = template.farGeometry;
          sector.boundingSphere = new THREE.Sphere(
            new THREE.Vector3(x0 + sectorSize * 0.5, 0, z0 + sectorSize * 0.5),
            Math.hypot(sectorSize * 0.7072, 4.8 + ankleGrassHeight)
          );
          sector.castShadow = false;
          sector.receiveShadow = false;
          sector.instanceMatrix.setUsage(THREE.StaticDrawUsage);
          instances.forEach((matrix, index) => sector.setMatrixAt(index, matrix));
          sector.instanceMatrix.needsUpdate = true;
          this.sceneManager.scene.add(sector);
          this.grassSectors.push(sector);
          placedTotal += instances.length;
        });
        // Give input, camera and rendering a frame between sector batches.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    // A randomized fringe of the project's own tall grass softens the hard
    // terrain/mountain seam. It is one instanced draw and has no collision.
    const boundaryPolygon = this.worldBoundaryXZ;
    const boundaryArea = boundaryPolygon.reduce((area, [x, z], index) => {
      const [nextX, nextZ] = boundaryPolygon[(index + 1) % boundaryPolygon.length]!;
      return area + x * nextZ - nextX * z;
    }, 0) * 0.5;
    const boundaryInwardSign = boundaryArea >= 0 ? 1 : -1;
    const weedTemplate = templates[2]!;
    const weedMatrices: THREE.Matrix4[] = [];
    for (let edge = 0; edge < boundaryPolygon.length; edge++) {
      const [x0, z0] = boundaryPolygon[edge]!;
      const [x1, z1] = boundaryPolygon[(edge + 1) % boundaryPolygon.length]!;
      const dx = x1 - x0;
      const dz = z1 - z0;
      const length = Math.hypot(dx, dz) || 1;
      const inwardX = (-dz / length) * boundaryInwardSign;
      const inwardZ = (dx / length) * boundaryInwardSign;
      for (let distance = random() * 0.85; distance < length; distance += 0.85 + random() * 0.8) {
        const along = THREE.MathUtils.clamp(distance + (random() - 0.5) * 0.8, 0, length);
        const offset = 0.65 + random() * 3.0;
        const x = x0 + dx / length * along + inwardX * offset;
        const z = z0 + dz / length * along + inwardZ * offset;
        if (x < -80 || x > 80 || z < -120 || z > 40 || excluded(x, z)) continue;
        const groundY = this.getTerrainHeight(x, z);
        const slopeX = (this.getTerrainHeight(x + 0.18, z) - this.getTerrainHeight(x - 0.18, z)) / 0.36;
        const slopeZ = (this.getTerrainHeight(x, z + 0.18) - this.getTerrainHeight(x, z - 0.18)) / 0.36;
        normal.set(-slopeX, 1, -slopeZ).normalize();
        slopeRotation.setFromUnitVectors(up, normal);
        yawRotation.setFromAxisAngle(normal, random() * Math.PI * 2);
        const scale = 0.85 + random() * 0.7;
        const heightBoost = 4.2 + random() * 2.8;
        dummy.position.set(x, groundY + 0.012, z);
        dummy.quaternion.copy(slopeRotation).multiply(yawRotation);
        dummy.scale.set(scale, scale * weedTemplate.heightFactor * heightBoost, scale);
        dummy.updateMatrix();
        weedMatrices.push(dummy.matrix.clone());
      }
    }
    if (weedMatrices.length) {
      const boundaryWeeds = new THREE.InstancedMesh(weedTemplate.lodGeometry, weedTemplate.material, weedMatrices.length);
      boundaryWeeds.name = 'randomized_original_grass_mountain_edge_fringe';
      boundaryWeeds.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      weedMatrices.forEach((matrix, index) => boundaryWeeds.setMatrixAt(index, matrix));
      boundaryWeeds.instanceMatrix.needsUpdate = true;
      boundaryWeeds.castShadow = false;
      boundaryWeeds.receiveShadow = false;
      boundaryWeeds.computeBoundingSphere();
      this.sceneManager.scene.add(boundaryWeeds);
    }

    // Full source meshes are no longer referenced after placement: the runtime
    // uses the Blender-authored LOD, plus its derived distance variants.
    templates.forEach((template) => template.geometry.dispose());
    console.info(`[Grass] ${placedTotal} original Grass It! clumps from ${sourceNames.join(', ')} in ${sectorSize}m sectors (${isMobile ? 'mobile' : 'desktop'} spacing ${spacing}m); Wukong ${characterHeight.toFixed(2)}m, grass cap ${ankleGrassHeight.toFixed(2)}m`);
  }

  private buildToyStoryLevelGeometry(): void {
    const scene = this.sceneManager.scene;

    // Generate Textures
    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.colorSpace = THREE.SRGBColorSpace;
    stoneTex.repeat.set(4, 4);
    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.65, bumpScale: 0.04 });
    const groundBaseMat = new THREE.MeshStandardMaterial({ color: 0x526b32, roughness: 0.98 }); // Warm green distant ground LOD
    this.terrainGroundMaterial = groundBaseMat;


    // 1. Rolling Undulating Terrain Mesh (160 x 160, 64x64 segments)
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2); // Orient horizontally

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i) - 40; // Center world coordinate
      posAttr.setZ(i, z);
      posAttr.setY(i, this.getTerrainHeight(x, z));
    }
    // Keep the terrain continuous beneath the bridge. Cutting this low
    // resolution mesh by triangle centroid created jagged holes at the shore.
    terrainGeo.computeVertexNormals();

    const worldFloor = new THREE.Mesh(terrainGeo, groundBaseMat);
    worldFloor.name = 'world-terrain';
    worldFloor.position.set(0, 0, 0);
    worldFloor.receiveShadow = true;
    scene.add(worldFloor);
    this.worldTerrainMesh = worldFloor;
    this.createBridgePond();
    // PlayerController uses this same terrain-height function when no built
    // surface is hit. Raycasting the render mesh (8,192 triangles) on every
    // ground check and every airborne wall probe caused avoidable CPU spikes.
    // Keep it visual; temple floors, steps and ramps remain explicit colliders.

    // ═══════════════════════════════════════════════════════════════════════════════
    // Grass It! mesh variants are instanced from the original exported GLB after async asset loading.

    // ▓▓▓  HIGH-PERFORMANCE INSTANCED 3D GLTF FOLIAGE & NATURE MANAGER  ▓▓▓
    // Combines 350+ individual meshes into 3 single InstancedMesh draw calls!
    // ═══════════════════════════════════════════════════════════════════════════════
    (() => {
      const gltfLoader = new GLTFLoader();
      const treeColliderMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });

      // 1. Original Botaniq pine exported from the user's CameraSuave Blender scene.
      // One InstancedMesh shares its source geometry across every tree; each
      // instance is planted on the terrain and gets only a compact trunk collider.
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/wukong-pinus-original.glb', (gltf) => {
        const root = gltf.scene;
        root.updateMatrixWorld(true);
        const rootInverse = root.matrixWorld.clone().invert();
        const meshes: THREE.Mesh[] = [];
        root.traverse((part) => { if ((part as THREE.Mesh).isMesh) meshes.push(part as THREE.Mesh); });
        const positions: [number, number, number][] = [
          [-45, 0, 15], [-55, 0, -20], [-60, 0, -55], [55, 0, 10], [60, 0, -20],
          [-25, 0, -90], [25, 0, -90], [-40, 0, -80], [45, 0, -80], [0, 0, -105],
          [-35, 0, -10], [35, 0, -15], [-20, 0, -84], [20, 0, -84], [-50, 0, -45]
        ];
        // The Qi route uses the exact same authored blossom trees as the rest
        // of the map. Keep these as visual-only instances so the established
        // staircase, perches and liana collision remain untouched.
        const qiCanopyTreePositions: [number, number, number][] = [
          [30, 0, 0], [38, 0, -10], [46, 0, 1], [54, 0, -9], [62, 0, 0],
        ];
        // The paths are built synchronously before these async assets resolve.
        // Do not let a trunk or its collider intrude into a walkable corridor.
        const safePositions = positions.filter(([x, , z]) => !this.isVegetationNearPath(x, z, 3.2));
        this.treeReactionTrees = safePositions.map(([x, , z]) => new THREE.Vector3(x, this.getTerrainHeight(x, z), z));
        this.treeSwayTimers = safePositions.map(() => -1);
        // Assign rewards only after exclusions, so each one belongs to a
        // pine tree that really exists in the playable scene.
        this.treeRewards = safePositions.map((_, index) => index % 5 === 1 ? 'snake' : index % 5 === 3 ? 'apple' : null);
        const dummy = new THREE.Object3D();
        const seed = 81271;
        let randomSeed = seed;
        const rand = () => { randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0; return randomSeed / 4294967296; };
        const blossomPalette = [
          new THREE.Color('#e9a2c6'), // cherry pink
          new THREE.Color('#f2c1d8'), // warm white-pink
          new THREE.Color('#c9a8df'), // soft lilac
          new THREE.Color('#dc8eb9'), // deeper rose
        ];
        for (const mesh of meshes) {
          const relative = rootInverse.clone().multiply(mesh.matrixWorld);
          const treeMaterials = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((sourceMaterial) => {
            const material = sourceMaterial.clone() as THREE.MeshStandardMaterial;
            const looksLikeFoliage = /leaf|leaves|foliage|needle|hoja|foliage/i.test(material.name)
              || (material.color.r > 0.68 && material.color.g > 0.68 && material.color.b > 0.68);
            if (looksLikeFoliage) {
              // Retain the source leaf geometry while tinting it as soft,
              // stylized cherry blossom. Per-instance colors below vary whole
              // crowns, keeping the existing instanced draw-call count.
              material.color.set(0xffffff);
              material.vertexColors = true;
              material.roughness = 0.9;
              material.metalness = 0;
              material.emissive.set(0x000000);
              material.emissiveIntensity = 0;
            } else if (/bark|trunk|wood/i.test(material.name)) {
              // Keep bark texture and relief; a mild warm bias keeps the
              // trunk readable under the existing moon and lantern lighting.
              material.color.multiply(new THREE.Color(1.06, 0.94, 0.84));
              material.roughness = Math.max(material.roughness, 0.84);
              material.metalness = 0;
            }
            return material;
          });
          const treeMaterial = Array.isArray(mesh.material) ? treeMaterials : treeMaterials[0];
          const instances = new THREE.InstancedMesh(mesh.geometry, treeMaterial, safePositions.length + qiCanopyTreePositions.length);
          instances.name = 'original_pinus_tree_instances';
          instances.castShadow = false;
          instances.receiveShadow = false;
          const baseMatrices: THREE.Matrix4[] = [];
          safePositions.forEach(([x, , z], i) => {
            const ground = this.getTerrainHeight(x, z);
            const scale = 0.78 + rand() * 0.15;
            dummy.position.set(x, ground, z);
            dummy.rotation.set(0, rand() * Math.PI * 2, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            const baseMatrix = dummy.matrix.clone().multiply(relative);
            baseMatrices.push(baseMatrix.clone());
            instances.setMatrixAt(i, baseMatrix);
            instances.setColorAt(i, blossomPalette[Math.floor(rand() * blossomPalette.length)]!);
          });
          qiCanopyTreePositions.forEach(([x, , z], routeIndex) => {
            const i = safePositions.length + routeIndex;
            const ground = this.getTerrainHeight(x, z);
            // Slightly lighter/smaller crowns frame each landing rather than
            // engulfing the walkable boards, chest or key pickup.
            const scale = 0.64 + (routeIndex % 3) * 0.025;
            dummy.position.set(x, ground, z);
            dummy.rotation.set(0, [-0.35, 0.65, 1.15, -0.8, 0.25][routeIndex]!, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            const baseMatrix = dummy.matrix.clone().multiply(relative);
            baseMatrices.push(baseMatrix.clone());
            instances.setMatrixAt(i, baseMatrix);
            instances.setColorAt(i, blossomPalette[(routeIndex + 1) % blossomPalette.length]!);
          });
          instances.instanceMatrix.needsUpdate = true;
          if (instances.instanceColor) instances.instanceColor.needsUpdate = true;
          instances.computeBoundingBox();
          instances.computeBoundingSphere();
          scene.add(instances);
          this.treeInstanceBatches.push({ mesh: instances, baseMatrices });
        }
        safePositions.forEach(([x, , z]) => {
          const terrainY = this.getTerrainHeight(x, z);
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.2, 7), treeColliderMaterial);
          trunk.name = 'pinus_trunk_collision';
          trunk.position.set(x, terrainY + 1.1, z);
          scene.add(trunk);
          this.levelColliders.push(trunk);
        });
      });

      // 2. Authored Chinese Croton meshes, instanced densely as low shrubs.
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/wukong-chinese-croton-original.glb', (gltf) => {
        let bushMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((part) => { if (!bushMesh && (part as THREE.Mesh).isMesh) bushMesh = part as THREE.Mesh; });
        const bushSource = bushMesh as THREE.Mesh | null;
        if (!bushSource) return;
        const shrubGeometry = bushSource.geometry.clone();
        shrubGeometry.computeBoundingBox();
        const shrubBounds = shrubGeometry.boundingBox!;
        const shrubCenter = shrubBounds.getCenter(new THREE.Vector3());
        shrubGeometry.translate(-shrubCenter.x, -shrubBounds.min.y, -shrubCenter.z);
        const bushPositions: [number, number, number][] = [
          [-28, 0, 8], [-32, 0, 12], [-42, 0, -38], [-48, 0, -42],
          [28, 0, -12], [32, 0, -18], [-15, 0, -85], [15, 0, -85],
          [-8, 0, -22], [8, 0, -22], [-14, 0, -12], [14, 0, -12]
        ];
        const safeBushPositions = bushPositions.filter(([x, , z]) => !this.isVegetationNearPath(x, z, 2.2));
        const shrubMaterial = (Array.isArray(bushSource.material) ? bushSource.material : [bushSource.material]).map((m) => {
          const material = m.clone() as THREE.MeshStandardMaterial;
          material.roughness = Math.max(material.roughness, 0.76);
          return material;
        });
        const instances = new THREE.InstancedMesh(shrubGeometry, Array.isArray(bushSource.material) ? shrubMaterial : shrubMaterial[0], safeBushPositions.length);
        instances.name = 'original_chinese_croton_instances';
        const dummy = new THREE.Object3D();
        let seed = 32471;
        const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        safeBushPositions.forEach(([x, , z], i) => {
          const scale = 0.72 + rand() * 0.22;
          dummy.position.set(x, this.getTerrainHeight(x, z), z);
          dummy.rotation.set(0, rand() * Math.PI * 2, 0);
          dummy.scale.set(scale, scale, scale);
          dummy.updateMatrix();
          instances.setMatrixAt(i, dummy.matrix);
          instances.setColorAt(i, new THREE.Color().setHSL(0.25 + rand() * 0.08, 0.55, 0.38 + rand() * 0.14));
        });
        instances.instanceMatrix.needsUpdate = true;
        if (instances.instanceColor) instances.instanceColor.needsUpdate = true;
        instances.castShadow = false;
        instances.receiveShadow = false;
        instances.computeBoundingBox();
        instances.computeBoundingSphere();
        scene.add(instances);
      });

      // Replace the thin white flower stems that read as stray markers in-game
      // with the existing green meadow plant asset. Keep the same authored
      // vegetation patches and path exclusions; GPU instancing keeps it to one
      // draw call while matching the curved shoots shown in the reference.
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/bush_meadow.gltf', (gltf) => {
        let meadowMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((part) => {
          if (!meadowMesh && (part as THREE.Mesh).isMesh) meadowMesh = part as THREE.Mesh;
        });
        const source = meadowMesh as THREE.Mesh | null;
        if (!source) return;

        const patches = [
          { center: [-15, -15], count: 35, radius: 6.0 },
          { center: [15, -15], count: 35, radius: 6.0 },
          { center: [-25, 5], count: 40, radius: 6.0 },
          { center: [20, -65], count: 40, radius: 6.0 },
          { center: [-20, -65], count: 40, radius: 6.0 },
          { center: [-10, 5], count: 30, radius: 5.0 },
          { center: [10, 5], count: 30, radius: 5.0 },
          { center: [-35, -30], count: 35, radius: 5.0 },
          { center: [35, -30], count: 35, radius: 5.0 },
        ];
        const capacity = patches.reduce((sum, patch) => sum + patch.count, 0);
        const vegetation = new THREE.InstancedMesh(source.geometry, source.material, capacity);
        vegetation.name = 'meadow_curved_shoots_replacing_white_stems';
        vegetation.castShadow = false;
        vegetation.receiveShadow = false;
        const dummy = new THREE.Object3D();
        let seed = 57031;
        const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        let index = 0;
        patches.forEach((patch) => {
          for (let i = 0; i < patch.count; i++) {
            const angle = rand() * Math.PI * 2;
            const distance = Math.sqrt(rand()) * patch.radius;
            const x = patch.center[0] + Math.cos(angle) * distance;
            const z = patch.center[1] + Math.sin(angle) * distance;
            if (this.isVegetationNearPath(x, z, 0.45) || Math.hypot(x, z + 40) < 17 || Math.hypot(x - 45, z + 40) < 17) continue;
            const scale = 0.34 + rand() * 0.09;
            dummy.position.set(x, this.getTerrainHeight(x, z) + 0.01, z);
            dummy.rotation.set((rand() - 0.5) * 0.12, rand() * Math.PI * 2, (rand() - 0.5) * 0.12);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            vegetation.setMatrixAt(index++, dummy.matrix);
            vegetation.setColorAt(index - 1, new THREE.Color().setHSL(0.27 + rand() * 0.055, 0.58, 0.29 + rand() * 0.12));
          }
        });
        vegetation.count = index;
        vegetation.instanceMatrix.needsUpdate = true;
        if (vegetation.instanceColor) vegetation.instanceColor.needsUpdate = true;
        vegetation.computeBoundingSphere();
        scene.add(vegetation);
        console.info(`[Vegetation] ${index} meadow shoots replace white flower stems (one instanced draw call).`);
      });

      // 4. The nine map boulders use the supplied Mossy Boulder Rock asset.
      // Each copy is bottom-snapped to the same terrain height provider as
      // Gekko and has a simple invisible blocker for reliable player collision.
      const rockClusters: [number, number, number, number][] = [
        // South Ruins rubble base cluster
        [-32, 0, 8, 1.2], [-28, 0, 14, 0.9], [-34, 0, 12, 1.4],
        // West Library cliff knoll cluster
        [-48, 0, -38, 1.5], [-44, 0, -42, 1.1], [-50, 0, -44, 1.3],
        // North Arena rock outcrop cluster
        [58, 0, -38, 1.6], [62, 0, -42, 1.2], [55, 0, -44, 1.0]
      ];
      gltfLoader.load(
        import.meta.env.BASE_URL + 'assets/environment/mossy-boulder-rock.glb',
        (gltf) => {
          const source = gltf.scene;
          source.updateMatrixWorld(true);
          const sourceBounds = new THREE.Box3().setFromObject(source);
          const sourceSize = sourceBounds.getSize(new THREE.Vector3());
          const sourceCenter = sourceBounds.getCenter(new THREE.Vector3());
          if (!Number.isFinite(sourceSize.y) || sourceSize.y <= 0.001) {
            console.error('[Boulders] Mossy Boulder Rock has invalid dimensions; props were not spawned.');
            return;
          }

          const blockerMaterial = new THREE.MeshBasicMaterial({
            colorWrite: false,
            depthWrite: false,
            side: THREE.DoubleSide
          });
          const positions = rockClusters.map(([x, , z, size], index) => ({
            x, z, size,
            yaw: (index * 2.399963229728653) % (Math.PI * 2)
          }));

          positions.forEach(({ x, z, size, yaw }, index) => {
            const groundY = this.getTerrainHeight(x, z);
            // Match the old placeholder's approximate visible height while
            // scaling from the real GLB bounds (which are Y-up in Three.js).
            const targetHeight = 1.12 * size;
            const modelScale = targetHeight / sourceSize.y;
            const rockRoot = new THREE.Group();
            rockRoot.name = `mossy_boulder_${index + 1}`;
            rockRoot.position.set(x, groundY, z);
            rockRoot.rotation.y = yaw;

            const visual = source.clone(true);
            visual.scale.setScalar(modelScale);
            visual.position.set(
              -sourceCenter.x * modelScale,
              -sourceBounds.min.y * modelScale,
              -sourceCenter.z * modelScale
            );
            visual.traverse((part) => {
              const mesh = part as THREE.Mesh;
              if (!mesh.isMesh) return;
              mesh.castShadow = false;
              mesh.receiveShadow = true;
            });
            rockRoot.add(visual);

            const blocker = new THREE.Mesh(
              new THREE.BoxGeometry(
                sourceSize.x * modelScale * 0.78,
                targetHeight,
                sourceSize.z * modelScale * 0.78
              ),
              blockerMaterial
            );
            blocker.name = `mossy_boulder_${index + 1}_solid_blocker`;
            blocker.position.y = targetHeight * 0.5;
            blocker.userData.solidPlayerBlocker = true;
            blocker.castShadow = false;
            blocker.receiveShadow = false;
            rockRoot.add(blocker);

            scene.add(rockRoot);
            rockRoot.updateMatrixWorld(true);
            this.levelColliders.push(rockRoot);
          });

          // The same original mossy boulder model forms a distant, non-solid
          // rocky skyline. Instancing keeps this outside-the-map scenery to
          // one draw call per source mesh and adds no gameplay colliders.
          this.addHorizonRockforms(source, sourceBounds, sourceCenter);

          // The GLB loads asynchronously, so refresh the already-initialized
          // collision and camera systems once these grounded blockers exist.
          this.player.setColliders(this.levelColliders);
          this.cameraController.setCollisionObjects(this.levelColliders);
          console.info(`[Boulders] Planted ${positions.length} original Mossy Boulder Rock assets on the terrain with solid blockers.`);
        },
        undefined,
        (error) => console.error('[Boulders] Could not load Mossy Boulder Rock:', error)
      );
    })();

    // The procedural palace blockout is superseded by the Chinese temple GLB.
    const castleCenterZ = -40;
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c842, metalness: 0.8, roughness: 0.2 });

    const switchGroup = new THREE.Group();
    // The secret mechanism now belongs to the west pavilion's table; the
    // revealed hatch remains across the map in the underground curiosity vault.
    switchGroup.name = 'west_pavilion_curiosity_switch';
    switchGroup.position.set(-55.0, this.getTerrainHeight(-55.0, -75.0) + 1.08, -75.0);

    const switchPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.9, 8), stoneMat);
    switchPedestal.position.y = 0.45;
    switchPedestal.castShadow = true;
    switchGroup.add(switchPedestal);
    switchPedestal.name = 'west_pavilion_secret_switch_base';
    this.levelColliders.push(switchPedestal);

    const dragonHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18), goldMat);
    dragonHead.position.set(0, 0.95, 0);
    switchGroup.add(dragonHead);

    this.dragonLeverStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), goldMat);
    this.dragonLeverStick.position.set(0, 1.15, 0);
    this.dragonLeverStick.rotation.x = Math.PI / 4; // Upright forward angle
    switchGroup.add(this.dragonLeverStick);

    const leverOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xffaa00, emissiveIntensity: 1.5 })
    );
    leverOrb.position.set(0, 0.28, 0);
    this.dragonLeverStick.add(leverOrb);

    const switchLight = new THREE.PointLight(0xffaa00, 2.5, 4.0);
    switchLight.position.set(0, 1.2, 0);
    switchLight.castShadow = false;
    switchGroup.add(switchLight);

    scene.add(switchGroup);
    this.dragonSwitchMesh = switchGroup;


    // ── SUBTERRANEAN LAVA VAULT & TRAPDOOR (x = -10.0 to -35.0, z = -26.0 to -54.0, y = -6.0) ──
    this.buildCuriosityVault(scene, stoneMat, castleCenterZ);


    // 4. Combat Boss Arena (to the East, broad dark rock circular area)
    const textureLoader = new THREE.TextureLoader();
    const darkRockDiff = textureLoader.load(import.meta.env.BASE_URL + `assets/environment/arena-dark-rock/dark_rock_diff_2k.jpg?v=${__APP_VERSION__}`);
    const darkRockNor = textureLoader.load(import.meta.env.BASE_URL + `assets/environment/arena-dark-rock/dark_rock_nor_2k.webp?v=${__APP_VERSION__}`);
    const darkRockRough = textureLoader.load(import.meta.env.BASE_URL + `assets/environment/arena-dark-rock/dark_rock_rough_2k.jpg?v=${__APP_VERSION__}`);

    darkRockDiff.colorSpace = THREE.SRGBColorSpace;
    darkRockDiff.wrapS = darkRockDiff.wrapT = THREE.RepeatWrapping;
    darkRockDiff.repeat.set(6, 6);

    darkRockNor.wrapS = darkRockNor.wrapT = THREE.RepeatWrapping;
    darkRockNor.repeat.set(6, 6);

    darkRockRough.wrapS = darkRockRough.wrapT = THREE.RepeatWrapping;
    darkRockRough.repeat.set(6, 6);

    const darkRockMat = new THREE.MeshStandardMaterial({
      map: darkRockDiff,
      normalMap: darkRockNor,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughnessMap: darkRockRough,
      roughness: 0.92,
      metalness: 0.04,
    });

    const arenaCenter = new THREE.Vector3(45, 0.1, -40);
    const arenaFloor = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 0.2, 32), darkRockMat);
    arenaFloor.position.copy(arenaCenter);
    arenaFloor.receiveShadow = true;
    scene.add(arenaFloor);
    this.levelColliders.push(arenaFloor);

    // A single low-cost, shadowless cool bounce supplements the shared moon
    // key only in the boss arena; it reveals the existing stone normal map
    // and keeps the combatants readable without another shadow render pass.
    this.arenaMoonFill = new THREE.PointLight(0x9db8ec, 64, 27, 2);
    this.arenaMoonFill.name = 'boss_arena_cool_moon_bounce';
    this.arenaMoonFill.position.set(arenaCenter.x - 3.5, 6.5, arenaCenter.z - 2.5);
    this.arenaMoonFill.castShadow = false;
    scene.add(this.arenaMoonFill);

    // Low boundaries for the arena
    const boundaryGeo = new THREE.BoxGeometry(4, 1.5, 1);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
      const boundary = new THREE.Mesh(boundaryGeo, stoneMat);
      boundary.position.set(
        arenaCenter.x + Math.cos(angle) * 15,
        arenaCenter.y + 0.6,
        arenaCenter.z + Math.sin(angle) * 15
      );
      boundary.rotation.y = -angle;
      scene.add(boundary);
      this.levelColliders.push(boundary);
    }

    // The four-key exit remains the same door; its destination is now hidden
    // behind a traversable volcanic route at the eastern edge of the map.
    this.buildSecretLavaRoute(scene);

    // 6. Ancient Ruins & Landmarks (Expanded Map)
    this.buildAncientRuinsAndLandmarks();
    this.buildCanopyTrial();

    // Configure collision objects in controllers
    this.cameraController.setCollisionObjects(this.levelColliders);
    this.cameraController.setTerrainHeightProvider((x, z) => this.getTerrainHeight(x, z));
    this.player.setColliders(this.levelColliders);
    this.player.setWorldBoundary(this.worldBoundaryXZ);
  }

  /** A compact, muted creek crossing beneath the bridge, never a broad cyan overlay. */
  private createBridgePond(): void {
    const scene = this.sceneManager.scene;
    const centerX = -41.5, centerZ = -63;
    const yaw = Math.atan2(13, 10);
    const axisX = Math.sin(yaw), axisZ = Math.cos(yaw);
    // The water crosses the bridge at right angles. The previous 11.5 x 6.2 m
    // sheet covered the landscape and read as a flat blue platform.
    const halfLength = 1.35, halfWidth = 3.65;
    const radialSegments = 56, rings = 7;
    const positions: number[] = [centerX, this.getTerrainHeight(centerX, centerZ) + 0.012, centerZ];
    const indices: number[] = [];
    for (let ring = 1; ring <= rings; ring++) {
      const radius = ring / rings;
      for (let segment = 0; segment < radialSegments; segment++) {
        const angle = segment / radialSegments * Math.PI * 2;
        const u = Math.cos(angle) * halfLength * radius;
        const v = Math.sin(angle) * halfWidth * radius;
        const x = centerX + axisX * u + axisZ * v;
        const z = centerZ + axisZ * u - axisX * v;
        positions.push(x, this.getTerrainHeight(x, z) + 0.012, z);
      }
    }
    for (let segment = 0; segment < radialSegments; segment++) {
      const next = (segment + 1) % radialSegments;
      indices.push(0, 1 + segment, 1 + next);
    }
    for (let ring = 1; ring < rings; ring++) {
      const innerStart = 1 + (ring - 1) * radialSegments;
      const outerStart = 1 + ring * radialSegments;
      for (let segment = 0; segment < radialSegments; segment++) {
        const next = (segment + 1) % radialSegments;
        const a = innerStart + segment, b = innerStart + next;
        const c = outerStart + segment, d = outerStart + next;
        indices.push(a, c, b, b, c, d);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0x54796d, roughness: 0.48, metalness: 0.025,
      emissive: 0x06100d, emissiveIntensity: 0.035,
      transparent: true, opacity: 0.56, depthWrite: false, side: THREE.DoubleSide,
    });
    const uniforms = { uTime: { value: 0 } };
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.y += 0.0012 * sin(position.x * 1.6 + uTime * 0.55) * cos(position.z * 1.35 - uTime * 0.42);');
    };
    material.customProgramCacheKey = () => 'bridge-creek-soft-ripple-v2';
    const water = new THREE.Mesh(geometry, material);
    water.name = 'bridge_pond_water';
    water.frustumCulled = true;
    water.castShadow = false;
    water.receiveShadow = true;
    scene.add(water);
    this.bridgeWaterUniforms = uniforms;

    // Small flattened stones frame just the two creek banks; instanced so the
    // detail costs one draw call and leaves the bridge approaches clear.
    const rockGeometry = new THREE.IcosahedronGeometry(0.34, 1);
    const rockPositions = rockGeometry.getAttribute('position');
    for (let i = 0; i < rockPositions.count; i++) {
      const wobble = 0.82 + ((i * 37) % 23) / 100;
      rockPositions.setXYZ(i, rockPositions.getX(i) * wobble, rockPositions.getY(i) * (0.58 + (i % 5) * 0.055), rockPositions.getZ(i) * (0.9 + (i % 3) * 0.04));
    }
    rockGeometry.computeVertexNormals();
    const rocks = new THREE.InstancedMesh(
      rockGeometry,
      new THREE.MeshStandardMaterial({ color: 0x77776b, roughness: 0.95, metalness: 0.01, vertexColors: true }),
      12,
    );
    rocks.name = 'bridge_pond_bank_rocks';
    rocks.castShadow = false;
    rocks.receiveShadow = true;
    const dummy = new THREE.Object3D();
    const tints = [0x858276, 0x74766e, 0x8b8171, 0x6f7771];
    for (let i = 0; i < 12; i++) {
      const side = i < 6 ? -1 : 1;
      const sideIndex = i % 6;
      const u = -0.98 + sideIndex * 0.39 + (sideIndex % 2) * 0.1;
      const v = side * (halfWidth + 0.17 + (sideIndex % 3) * 0.1);
      const x = centerX + axisX * u + axisZ * v;
      const z = centerZ + axisZ * u - axisX * v;
      dummy.position.set(x, this.getTerrainHeight(x, z) - 0.015, z);
      dummy.rotation.set(((i * 17) % 13) * 0.035, i * 1.73, ((i * 11) % 9) * 0.04);
      const scale = 0.65 + ((i * 7) % 5) * 0.15;
      dummy.scale.set(scale * 1.2, scale * 0.58, scale * 0.9);
      dummy.updateMatrix();
      rocks.setMatrixAt(i, dummy.matrix);
      rocks.setColorAt(i, new THREE.Color(tints[i % tints.length]));
    }
    rocks.instanceMatrix.needsUpdate = true;
    if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
    scene.add(rocks);
  }

  /** Scenic, texture-based 360? horizon. It has no collision and leaves the HDRI independent. */
  private buildMountainBackdrop(): void {
    const scene = this.sceneManager.scene;
    const base = import.meta.env.BASE_URL + 'assets/horizon-kit/';
    const loader = new THREE.TextureLoader();
    const group = new THREE.Group();
    group.name = 'wukong_horizon_360_decorative_layers';
    this.horizonPaletteMaterials = [];

    const loadTexture = (name: string): THREE.Texture => {
      const texture = loader.load(base + name);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(2, this.sceneManager.renderer.capabilities.getMaxAnisotropy());
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    };
    const makeMaterial = (file: string, opacity = 1, depthWrite = false): THREE.MeshBasicMaterial => {
      const material = new THREE.MeshBasicMaterial({
        map: loadTexture(file), color: 0xffffff, transparent: true,
        opacity, alphaTest: 0.012, depthTest: true, depthWrite,
        side: THREE.DoubleSide, fog: true, toneMapped: false,
      });
      this.horizonPaletteMaterials.push(material);
      return material;
    };

    // The kit provides transparent 2D artwork, not 3D mountain models. Wrap
    // each authored layer on a world-space cylinder so it remains fixed while
    // the camera turns. Feathered source edges prevent a visible 360? seam.
    const addMountainLayer = (file: string, radius: number, height: number, baseY: number, nightTint: number, order: number, opacity: number): void => {
      const geometry = new THREE.CylinderGeometry(radius, radius, height, 96, 1, true);
      // Keep the prototype silhouettes subtle; the textured original rocks
      // supply the visible foreground relief rather than a flat wall.
      const material = makeMaterial(file, opacity, false);
      material.userData.horizonNightTint = nightTint;
      material.userData.horizonDayTint = 0xcbd6e3;
      material.userData.horizonDuskTint = 0xb99baa;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = `horizon_${file.replace(/[^a-z0-9]/gi, '_')}`;
      mesh.position.y = baseY + height * 0.5;
      mesh.renderOrder = order;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      group.add(mesh);
    };
    // Keep scenic layers outside the complete playable footprint (the canopy
    // route reaches radius ~148). The old 165/198 radii overlapped that route
    // and made the crypt-side rocks read as an impassable wall at the entrance.
    addMountainLayer('01_montanas_lejanas-seamless.png', 310, 130, -4, 0x7188ae, 1, 0.34);
    addMountainLayer('02_montanas_medias-seamless.png', 265, 150, -8, 0x536c91, 2, 0.32);

    const fog = new THREE.Mesh(
      new THREE.CylinderGeometry(245, 245, 25, 96, 1, true),
      makeMaterial('04_niebla_valle.png', 0.72),
    );
    fog.name = 'horizon_valley_mist_360';
    fog.position.y = 22;
    fog.renderOrder = 3;
    fog.frustumCulled = false;
    fog.castShadow = false;
    fog.receiveShadow = false;
    group.add(fog);
    addMountainLayer('03_montanas_cercanas-seamless.png', 220, 160, -12, 0x435d7e, 4, 0.28);

    const addWorldSprite = (file: string, angle: number, radius: number, width: number, height: number, baseY: number, name: string, order: number, opacity = 1): void => {
      const material = makeMaterial(file, opacity);
      material.userData.horizonNightTint = 0x7482a4;
      material.userData.horizonDayTint = 0xd7d5d1;
      material.userData.horizonDuskTint = 0xd3a5a1;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
      mesh.name = name;
      mesh.position.set(Math.sin(angle) * radius, baseY + height * 0.5, Math.cos(angle) * radius);
      mesh.rotation.y = angle + Math.PI;
      mesh.renderOrder = order;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      group.add(mesh);
    };
    // Use the kit's individual skyline assets; never place its HUD concept image in the scene.
    addWorldSprite('05_pagoda_lejana.png', 0.63, 286, 20, 25, 4, 'horizon_distant_pagoda', 2.5, 0.88);
    addWorldSprite('06_cascada.png', 3.65, 252, 9, 26, 10, 'horizon_distant_waterfall_west', 3.5, 0.82);
    addWorldSprite('06_cascada.png', 5.42, 274, 7, 23, 12, 'horizon_distant_waterfall_east', 3.5, 0.72);
    [0.08, 1.55, 2.95, 4.35, 5.55].forEach((angle, index) => {
      const scale = [1, 0.82, 1.08, 0.9, 0.96][index];
      addWorldSprite('07_sakura_lejano.png', angle, 202 + (index % 2) * 7, 10 * scale, 17 * scale, 9, `horizon_sakura_${index + 1}`, 5, 0.86);
    });

    scene.add(group);
    this.updateHorizonPalette(this.dayNightCycle?.hour ?? 21);
  }

  /** Collision perimeter derived from the terrain outline and canopy wing. */
  private buildWorldPerimeter(): void {
    const scene = this.sceneManager.scene;
    const polygon = this.worldBoundaryXZ;
    const signedArea = polygon.reduce((area, [x, z], index) => {
      const [nextX, nextZ] = polygon[(index + 1) % polygon.length];
      return area + x * nextZ - nextX * z;
    }, 0) * 0.5;
    const inwardSign = signedArea >= 0 ? 1 : -1;
    const inset = 1.6;
    const wallHeight = 38;
    const wallThickness = 2.2;
    const debugEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get('debugWorldBoundary') === '1';
    const wallMaterial = debugEnabled
      ? new THREE.MeshBasicMaterial({ color: 0xff5d35, transparent: true, opacity: 0.14, wireframe: true, depthWrite: false, side: THREE.DoubleSide })
      : new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
    const debugGroup = debugEnabled ? new THREE.Group() : null;
    if (debugGroup) debugGroup.name = 'world_boundary_development_debug';
    const edgePoints: THREE.Vector3[] = [];
    const barrierPoints: THREE.Vector3[] = [];

    for (let index = 0; index < polygon.length; index++) {
      const [x0, z0] = polygon[index];
      const [x1, z1] = polygon[(index + 1) % polygon.length];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const length = Math.hypot(dx, dz);
      if (length < 0.01) continue;
      // For this CCW contour, the left-hand edge normal points into the map.
      const inwardX = (-dz / length) * inwardSign;
      const inwardZ = (dx / length) * inwardSign;
      const sampleCount = Math.max(1, Math.ceil(length / 3));
      for (let sample = 0; sample <= sampleCount; sample++) {
        if (index > 0 && sample === 0) continue;
        const t = sample / sampleCount;
        const x = THREE.MathUtils.lerp(x0, x1, t);
        const z = THREE.MathUtils.lerp(z0, z1, t);
        const groundY = this.getTerrainHeight(x, z);
        edgePoints.push(new THREE.Vector3(x, groundY + 0.1, z));
        barrierPoints.push(new THREE.Vector3(x + inwardX * inset, groundY + 1.4, z + inwardZ * inset));
      }

      const midX = (x0 + x1) * 0.5 + inwardX * inset;
      const midZ = (z0 + z1) * 0.5 + inwardZ * inset;
      const groundY = this.getTerrainHeight((x0 + x1) * 0.5, (z0 + z1) * 0.5);
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(length + wallThickness * 0.55, wallHeight, wallThickness),
        wallMaterial,
      );
      wall.name = `world_perimeter_invisible_${String(index + 1).padStart(2, '0')}`;
      wall.position.set(midX, groundY + wallHeight * 0.5 - 0.6, midZ);
      wall.rotation.y = Math.atan2(-dz, dx);
      wall.userData.solidPlayerBlocker = true;
      wall.userData.worldBoundarySegment = index;
      wall.visible = debugEnabled;
      wall.castShadow = false;
      wall.receiveShadow = false;
      scene.add(wall);
      this.levelColliders.push(wall);
    }

    // Continue the ground behind the mountain bases so the camera never sees
    // the HDRI through gaps at the edge of the playable terrain. This skirt is
    // visual-only, follows the measured terrain edge, and slopes down behind
    // the rocks instead of creating an artificial raised platform.
    if (this.terrainGroundMaterial) {
      const skirtWidth = 88;
      const outerCorners = polygon.map(([x, z], index) => {
        const [prevX, prevZ] = polygon[(index + polygon.length - 1) % polygon.length]!;
        const [nextX, nextZ] = polygon[(index + 1) % polygon.length]!;
        const prevLength = Math.hypot(x - prevX, z - prevZ) || 1;
        const nextLength = Math.hypot(nextX - x, nextZ - z) || 1;
        const prevOutX = ((z - prevZ) / prevLength) * inwardSign;
        const prevOutZ = (-(x - prevX) / prevLength) * inwardSign;
        const nextOutX = ((nextZ - z) / nextLength) * inwardSign;
        const nextOutZ = (-(nextX - x) / nextLength) * inwardSign;
        let miterX = prevOutX + nextOutX;
        let miterZ = prevOutZ + nextOutZ;
        const miterLength = Math.hypot(miterX, miterZ);
        if (miterLength < 0.001) { miterX = nextOutX; miterZ = nextOutZ; }
        else { miterX /= miterLength; miterZ /= miterLength; }
        const denominator = Math.max(0.38, miterX * nextOutX + miterZ * nextOutZ);
        const offset = Math.min(skirtWidth * 1.8, skirtWidth / denominator);
        return [x + miterX * offset, z + miterZ * offset] as const;
      });
      const skirtPositions: number[] = [];
      const skirtUvs: number[] = [];
      const skirtIndices: number[] = [];
      let vertexCount = 0;
      for (let edge = 0; edge < polygon.length; edge++) {
        const [x0, z0] = polygon[edge]!;
        const [x1, z1] = polygon[(edge + 1) % polygon.length]!;
        const [ox0, oz0] = outerCorners[edge]!;
        const [ox1, oz1] = outerCorners[(edge + 1) % polygon.length]!;
        const length = Math.hypot(x1 - x0, z1 - z0);
        const steps = Math.max(1, Math.ceil(length / 4));
        for (let step = 0; step <= steps; step++) {
          const t = step / steps;
          const x = THREE.MathUtils.lerp(x0, x1, t);
          const z = THREE.MathUtils.lerp(z0, z1, t);
          const y = this.getTerrainHeight(x, z) - 0.06;
          const ox = THREE.MathUtils.lerp(ox0, ox1, t);
          const oz = THREE.MathUtils.lerp(oz0, oz1, t);
          skirtPositions.push(x, y, z, ox, y - 7.5, oz);
          skirtUvs.push((edge * length + t * length) / 160, 0, (edge * length + t * length) / 160, skirtWidth / 160);
          if (step > 0) {
            const a = vertexCount - 2;
            const b = vertexCount - 1;
            const c = vertexCount;
            const d = vertexCount + 1;
            skirtIndices.push(a, c, b, c, d, b);
          }
          vertexCount += 2;
        }
      }
      const skirtGeometry = new THREE.BufferGeometry();
      skirtGeometry.setAttribute('position', new THREE.Float32BufferAttribute(skirtPositions, 3));
      skirtGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(skirtUvs, 2));
      skirtGeometry.setIndex(skirtIndices);
      skirtGeometry.computeVertexNormals();
      const skirtMaterial = this.terrainGroundMaterial.clone();
      skirtMaterial.side = THREE.DoubleSide;
      const skirt = new THREE.Mesh(skirtGeometry, skirtMaterial);
      skirt.name = 'terrain_boundary_ground_skirt_visual_only';
      skirt.receiveShadow = true;
      skirt.castShadow = false;
      skirt.frustumCulled = false;
      scene.add(skirt);
    }

    if (debugGroup && edgePoints.length > 1) {
      const addLoop = (name: string, points: THREE.Vector3[], color: number) => {
        const positions: number[] = [];
        for (let i = 0; i < points.length; i++) {
          const a = points[i];
          const b = points[(i + 1) % points.length];
          positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, toneMapped: false, depthTest: false }));
        line.name = name;
        line.renderOrder = 1000;
        debugGroup!.add(line);
      };
      addLoop('debug_terrain_edge_green', edgePoints, 0x43ff55);
      addLoop('debug_collision_barrier_orange', barrierPoints, 0xff9a35);
      scene.add(debugGroup);
      console.info('[WorldBoundary] Development overlay enabled: green=terrain edge, orange=collision inset, yellow=mountain bases.');
    }
  }

  /** Retint the unlit panorama layers with the existing world clock. */
  private updateHorizonPalette(hour: number): void {
    const h = ((hour % 24) + 24) % 24;
    const daylight = this.dayNightCycle?.daylight ?? 0;
    const ramp = (a: number, b: number, value: number) => THREE.MathUtils.smoothstep(value, a, b);
    const dawn = ramp(5.2, 6.5, h) * (1 - ramp(7.1, 8, h));
    const dusk = ramp(17.1, 18.1, h) * (1 - ramp(18.8, 20, h));
    const warm = Math.max(dawn, dusk);
    for (const material of this.horizonPaletteMaterials) {
      const data = material.userData;
      this.horizonTintScratch
        .setHex(data.horizonNightTint ?? 0x536b91)
        .lerp(this.horizonDayTintScratch.setHex(data.horizonDayTint ?? 0xcbd6e3), daylight)
        .lerp(this.horizonDuskTintScratch.setHex(data.horizonDuskTint ?? 0xc79a97), warm * 0.72);
      material.color.copy(this.horizonTintScratch);
    }
  }

  /** Instance the project's original mossy rock GLB as distant skyline relief. */
  private addHorizonRockforms(source: THREE.Object3D, sourceBounds: THREE.Box3, sourceCenter: THREE.Vector3): void {
    const meshes: THREE.Mesh[] = [];
    source.updateMatrixWorld(true);
    source.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry && mesh.material) meshes.push(mesh);
    });
    if (!meshes.length) return;

    const placements: Array<{ x: number; z: number; y: number; scale: number; yaw: number; tint: THREE.Color }> = [];
    let seed = 0x5eeda11;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const sourceSize = sourceBounds.getSize(new THREE.Vector3());
    const polygon = this.worldBoundaryXZ;
    const signedArea = polygon.reduce((area, [x, z], index) => {
      const [nextX, nextZ] = polygon[(index + 1) % polygon.length];
      return area + x * nextZ - nextX * z;
    }, 0) * 0.5;
    const inwardSign = signedArea >= 0 ? 1 : -1;
    const mountainDebug = import.meta.env.DEV && new URLSearchParams(window.location.search).get('debugWorldBoundary') === '1'
      ? new THREE.Group()
      : null;
    if (mountainDebug) mountainDebug.name = 'world_boundary_mountain_debug';
    const debugBases: THREE.Matrix4[] = [];
    const sourceHeight = Math.max(0.001, sourceSize.y);

    // Sample every contour segment, derive its outward normal, and bottom-snap
    // the original rock asset to the terrain profile. Two staggered sizes make
    // a continuous natural ridgeline while keeping every instance behind the
    // player collision line. Instancing retains the original low draw-call cost.
    polygon.forEach(([x0, z0], edgeIndex) => {
      const [x1, z1] = polygon[(edgeIndex + 1) % polygon.length];
      const dx = x1 - x0;
      const dz = z1 - z0;
      const length = Math.hypot(dx, dz);
      if (length < 0.01) return;
      const inwardX = (-dz / length) * inwardSign;
      const inwardZ = (dx / length) * inwardSign;
      const outwardX = -inwardX;
      const outwardZ = -inwardZ;
      // Tighter, staggered spacing closes the daylight holes between the
      // original boulder silhouettes without creating a solid artificial wall.
      const count = Math.max(1, Math.ceil(length / 8.5));
      for (let segment = 0; segment < count; segment++) {
        const t = (segment + 0.5) / count;
        const edgeX = THREE.MathUtils.lerp(x0, x1, t);
        const edgeZ = THREE.MathUtils.lerp(z0, z1, t);
        const baseY = this.getTerrainHeight(edgeX, edgeZ) - 0.75;
        const height = 21 + random() * 15;
        const scale = height / sourceHeight;
        const tint = new THREE.Color().setHSL(0.59 + random() * 0.055, 0.12 + random() * 0.1, 0.42 + random() * 0.12);
        const halfWidth = sourceSize.x * scale * 0.5;
        const majorOffset = Math.max(0, halfWidth - 1.0);
        const yaw = Math.atan2(dz, dx) + (random() - 0.5) * 0.55;
        placements.push({
          x: edgeX + outwardX * majorOffset,
          z: edgeZ + outwardZ * majorOffset,
          y: baseY,
          scale,
          yaw,
          tint,
        });
        if (mountainDebug) debugBases.push(new THREE.Matrix4().makeTranslation(edgeX, this.getTerrainHeight(edgeX, edgeZ) + 0.14, edgeZ));

        // A smaller, overlapping shoulder hides seams along the hillside.
        if (segment % 2 === 0) {
          const shoulderHeight = 9 + random() * 9;
          const shoulderScale = shoulderHeight / sourceHeight;
          const shoulderHalfWidth = sourceSize.x * shoulderScale * 0.5;
          const along = (random() - 0.5) * Math.min(4.0, length / count * 0.32);
          const shoulderOffset = Math.max(0, shoulderHalfWidth - 0.45);
          placements.push({
            x: edgeX + dx / length * along + outwardX * shoulderOffset,
            z: edgeZ + dz / length * along + outwardZ * shoulderOffset,
            y: baseY - 0.18,
            scale: shoulderScale,
            yaw: yaw + (random() - 0.5) * 0.8,
            tint: tint.clone().multiplyScalar(0.88 + random() * 0.14),
          });
          if (mountainDebug) debugBases.push(new THREE.Matrix4().makeTranslation(edgeX, this.getTerrainHeight(edgeX, edgeZ) + 0.14, edgeZ));
        }
      }
    });

    if (mountainDebug && debugBases.length) {
      const markerGeometry = new THREE.SphereGeometry(0.24, 7, 5);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffd84a, toneMapped: false, depthTest: false });
      const markers = new THREE.InstancedMesh(markerGeometry, markerMaterial, debugBases.length);
      markers.name = 'debug_decorative_mountain_footings_yellow';
      debugBases.forEach((matrix, index) => markers.setMatrixAt(index, matrix));
      markers.instanceMatrix.needsUpdate = true;
      markers.renderOrder = 1001;
      mountainDebug.add(markers);
      this.sceneManager.scene.add(mountainDebug);
    }

    const sourceRootInverse = source.matrixWorld.clone().invert();
    const pivot = new THREE.Matrix4().makeTranslation(
      -sourceCenter.x, -sourceBounds.min.y, -sourceCenter.z,
    );
    const mountainSurfaceColliders: THREE.InstancedMesh[] = [];
    const collisionChunkSize = 8;
    for (let meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
      const sourceMesh = meshes[meshIndex];
      // Keep the exact original rock mesh and placement, but split the ring
      // into bounded render batches. A single full-world InstancedMesh with
      // frustum culling disabled sent every mountain through the GPU from all
      // camera angles (over three million triangles in the mobile profile).
      // Small spatial batches let Three.js skip the mountains behind the view;
      // the invisible collision chunks below remain independent and unchanged.
      const visibleChunkSize = 8;
      const sourceRelative = sourceRootInverse.clone().multiply(sourceMesh.matrixWorld);
      const rotation = new THREE.Matrix4();
      const scale = new THREE.Matrix4();
      const translation = new THREE.Matrix4();
      const placementMatrix = new THREE.Matrix4();
      const placementMatrices: THREE.Matrix4[] = [];
      placements.forEach((placement) => {
        rotation.makeRotationY(placement.yaw);
        scale.makeScale(placement.scale, placement.scale, placement.scale);
        translation.makeTranslation(placement.x, placement.y, placement.z);
        placementMatrix.copy(translation)
          .multiply(rotation)
          .multiply(scale)
          .multiply(pivot)
          .multiply(sourceRelative);
        placementMatrices.push(placementMatrix.clone());
      });
      // Mirror the visible GLB instances into small detached chunks. Their
      // matrices and source triangles match the render mesh exactly, while
      // each chunk's measured bounds let PlayerController raycast only rocks
      // near Wukong instead of testing the entire mountain ring every frame.
      for (let start = 0; start < placements.length; start += collisionChunkSize) {
        const count = Math.min(collisionChunkSize, placements.length - start);
        const collisionChunk = new THREE.InstancedMesh(sourceMesh.geometry, this.horizonRockCollisionMaterial, count);
        collisionChunk.name = `horizon_mountain_surface_collision_${meshIndex + 1}_${Math.floor(start / collisionChunkSize) + 1}`;
        collisionChunk.userData.horizonMountainSurface = true;
        collisionChunk.frustumCulled = false;
        for (let localIndex = 0; localIndex < count; localIndex++) {
          collisionChunk.setMatrixAt(localIndex, placementMatrices[start + localIndex]!);
        }
        collisionChunk.instanceMatrix.needsUpdate = true;
        collisionChunk.updateMatrixWorld(true);
        collisionChunk.computeBoundingBox();
        collisionChunk.computeBoundingSphere();
        mountainSurfaceColliders.push(collisionChunk);
      }
      for (let start = 0; start < placements.length; start += visibleChunkSize) {
        const count = Math.min(visibleChunkSize, placements.length - start);
        const visibleChunk = new THREE.InstancedMesh(sourceMesh.geometry, sourceMesh.material, count);
        visibleChunk.name = `horizon_original_mossy_rock_instances_${meshIndex + 1}_chunk_${Math.floor(start / visibleChunkSize) + 1}`;
        visibleChunk.instanceMatrix.setUsage(THREE.StaticDrawUsage);
        visibleChunk.castShadow = false;
        visibleChunk.receiveShadow = false;
        for (let localIndex = 0; localIndex < count; localIndex++) {
          visibleChunk.setMatrixAt(localIndex, placementMatrices[start + localIndex]!);
          visibleChunk.setColorAt(localIndex, placements[start + localIndex]!.tint);
        }
        visibleChunk.instanceMatrix.needsUpdate = true;
        if (visibleChunk.instanceColor) visibleChunk.instanceColor.needsUpdate = true;
        visibleChunk.computeBoundingBox();
        visibleChunk.computeBoundingSphere();
        visibleChunk.frustumCulled = true;
        this.sceneManager.scene.add(visibleChunk);
      }
    }
    this.player.setMountainSurfaceColliders(mountainSurfaceColliders);
  }

  private buildSecretLavaRoute(scene: THREE.Scene): void {
    const basalt = new THREE.MeshStandardMaterial({ color: 0x39353a, roughness: 0.96, metalness: 0.08 });
    const gold = new THREE.MeshStandardMaterial({ color: 0x9c542d, roughness: 0.72, metalness: 0.42 });
    const lavaMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x),f.y); }
        float fbm(vec2 p){ float n=0.0, a=0.5; for(int i=0;i<3;i++){ n+=noise(p)*a; p=p*2.0+vec2(0.0,uTime*0.012); a*=0.5; } return n; }
        void main(){
          vec2 flow=vUv*5.0+vec2(uTime*0.025,-uTime*0.018);
          float heat=fbm(flow);
          float cracks=smoothstep(0.60,0.73,noise(vUv*13.0+vec2(-uTime*0.05,uTime*0.04)));
          vec3 color=mix(vec3(0.18,0.025,0.012),vec3(0.92,0.12,0.012),smoothstep(0.22,0.72,heat));
          color=mix(color,vec3(1.0,0.43,0.035),smoothstep(0.56,0.78,heat)*0.8);
          color=mix(color,vec3(1.0,0.79,0.17),smoothstep(0.79,0.93,heat)*0.8);
          color=mix(color,vec3(0.11,0.018,0.012),cracks*0.72);
          gl_FragColor=vec4(color,1.0);
        }
      `,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const lava = new THREE.Mesh(new THREE.CircleGeometry(14.2, 48), lavaMaterial);
    lava.name = 'secret_lava_pool';
    lava.rotation.x = -Math.PI / 2;
    lava.position.set(this.secretLavaCenter.x, this.secretLavaY, this.secretLavaCenter.y);
    lava.renderOrder = 1;
    scene.add(lava);

    this.lavaUniforms = lavaMaterial.uniforms as { uTime: { value: number } };
    this.lavaLight = new THREE.PointLight(0xff5724, 2.3, 29, 2);
    this.lavaLight.name = 'secret_lava_warm_fill';
    this.lavaLight.position.set(this.secretLavaCenter.x, this.secretLavaY + 3.5, this.secretLavaCenter.y);
    this.lavaLight.castShadow = false;
    scene.add(this.lavaLight);
    this.dayNightCycle?.registerNightLight(this.lavaLight);
    const bubbleGeometry = new THREE.SphereGeometry(0.28, 10, 8);
    const bubbleMaterial = new THREE.MeshBasicMaterial({ color: 0xffa52c, toneMapped: false });
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.399;
      const radius = 2.5 + (i % 3) * 2.7;
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.name = `lava_bubble_${i}`;
      bubble.position.set(this.secretLavaCenter.x + Math.cos(angle) * radius, this.secretLavaY + 0.12, this.secretLavaCenter.y + Math.sin(angle) * radius);
      bubble.visible = false;
      scene.add(bubble);
      this.lavaBubbles.push({ mesh: bubble, phase: i * 1.31, baseY: this.secretLavaY + 0.12 });
    }
    const emberPositions = new Float32Array(48 * 3);
    for (let i = 0; i < 48; i++) {
      const angle = i * 2.399;
      const radius = 4 + ((i * 17) % 100) / 100 * 10;
      emberPositions[i * 3] = Math.cos(angle) * radius;
      emberPositions[i * 3 + 1] = ((i * 29) % 100) / 100 * 2.4;
      emberPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `uniform float uTime; void main(){ vec3 p=position; float phase=fract(position.y*0.37+uTime*0.28); p.y=0.25+phase*2.1; p.x+=sin(uTime*1.2+position.z)*0.13; vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=clamp(4.0/-mv.z,1.0,4.0); }`,
      fragmentShader: `void main(){ vec2 p=gl_PointCoord-0.5; float a=1.0-smoothstep(0.12,0.25,dot(p,p)); gl_FragColor=vec4(1.0,0.34,0.045,a); }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const embers = new THREE.Points(emberGeo, emberMaterial);
    embers.name = 'secret_lava_embers';
    embers.position.set(this.secretLavaCenter.x, this.secretLavaY + 0.2, this.secretLavaCenter.y);
    scene.add(embers);
    this.lavaEmberUniforms = emberMaterial.uniforms as { uTime: { value: number } };

    // A short tutorial run of paired Chinese dragon statues guards the sloped
    // approach. Its checkpoint is placed just before the first warning zone.
    const gateX = 48, gateZ = -84, gateY = this.getTerrainHeight(gateX, gateZ);
    const routeStart = new THREE.Vector3(gateX, gateY + 0.2, gateZ);
    const routeEnd = new THREE.Vector3(58, -7.7, -95);
    const routeSurface = (x: number, z: number) => {
      const path = new THREE.Vector2(routeEnd.x - routeStart.x, routeEnd.z - routeStart.z);
      const point = new THREE.Vector2(x - routeStart.x, z - routeStart.z);
      const t = THREE.MathUtils.clamp(point.dot(path) / Math.max(path.lengthSq(), 0.001), 0, 1);
      return THREE.MathUtils.lerp(routeStart.y, routeEnd.y, t);
    };
    this.dragonRun = new VolcanicDragonRun(scene, routeStart, routeEnd, routeSurface, this.levelColliders, (damage) => {
      if (this.player.isControlsLocked || this.player.isMovementLocked) return;
      this.player.takeDamage(damage, this.checkpointManager.getActiveCheckpointPosition());
      this.audioManager.playPlayerHurt();
      this.audioManager.playHitImpact();
      this.spellSystem.createImpactParticles(this.player.mesh.position.clone().add(new THREE.Vector3(0, 0.8, 0)), 0xff6b16);
      (window as any).gameInstance?.hud?.triggerDamageFlash();
    });

    // A weathered gate marks the hidden trail without a teleport or shortcut.
    const gateCenter = new THREE.Vector3(gateX, gateY, gateZ);
    const gateAxis = new THREE.Vector3(routeEnd.x - routeStart.x, 0, routeEnd.z - routeStart.z).normalize();
    const gateAcross = new THREE.Vector3(-gateAxis.z, 0, gateAxis.x);
    const gateYaw = Math.atan2(-gateAcross.z, gateAcross.x);
    const postBaseMat = new THREE.MeshStandardMaterial({ color: 0x6a6266, roughness: 0.82, metalness: 0.04 });
    const gateRoofMat = new THREE.MeshStandardMaterial({ color: 0x74262a, roughness: 0.68, metalness: 0.06 });
    for (const side of [-1, 1]) {
      const anchor = gateCenter.clone().addScaledVector(gateAcross, side * 2.5);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.48, 4.4, 10), basalt);
      post.position.set(anchor.x, gateY + 2.2, anchor.z);
      post.castShadow = true;
      scene.add(post);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.66, 0.45, 10), postBaseMat);
      base.position.set(anchor.x, gateY + 0.225, anchor.z);
      scene.add(base);
      this.levelColliders.push(post, base);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 6), gold);
      cap.position.set(anchor.x, gateY + 4.45, anchor.z);
      scene.add(cap);
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.56, 7), gold);
      finial.position.set(anchor.x, gateY + 5.02, anchor.z);
      finial.rotation.z = side * -0.24;
      scene.add(finial);
    }
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.55, 0.75), basalt);
    lintel.position.set(gateX, gateY + 4.45, gateZ);
    lintel.rotation.y = gateYaw;
    lintel.castShadow = true;
    scene.add(lintel);
    this.levelColliders.push(lintel);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.24, 2.5), gateRoofMat);
    roof.name = 'volcanic_ceremonial_gate_roof';
    roof.position.set(gateX, gateY + 4.95, gateZ);
    roof.rotation.y = gateYaw;
    roof.castShadow = true;
    scene.add(roof);
    for (const depthSign of [-1, 1]) {
      const eave = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.16, 0.32), gold);
      eave.position.set(gateX, gateY + 4.84, gateZ + gateAxis.z * depthSign * 1.06);
      eave.position.x += gateAxis.x * depthSign * 1.06;
      eave.rotation.y = gateYaw;
      eave.rotation.z = depthSign * -0.07;
      scene.add(eave);
    }

    // Continuous sloped basalt causeway reaches the sunken basin. Its top is
    // a solid collider and its endpoints follow the carved terrain.
    const rampStart = new THREE.Vector3(49, this.getTerrainHeight(49, -84) + 0.3, -84);
    const rampEnd = new THREE.Vector3(58, -7.9, -95);
    const rampVector = rampEnd.clone().sub(rampStart);
    const rampLength = rampVector.length();
    const causeway = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.42, rampLength), basalt);
    causeway.name = 'secret_lava_causeway';
    causeway.position.copy(rampStart).add(rampEnd).multiplyScalar(0.5);
    causeway.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), rampVector.normalize());
    causeway.castShadow = true;
    causeway.receiveShadow = true;
    scene.add(causeway);
    this.levelColliders.push(causeway);

    const platforms = [
      { x: 57, z: -94, y: -7.7, w: 7.0, d: 5.4 },
      { x: 62, z: -98, y: -7.7, w: 5.6, d: 5.2 },
      { x: 67, z: -102, y: -7.7, w: 6.0, d: 5.6 },
      { x: 72, z: -106, y: -7.7, w: 5.8, d: 5.4 },
      { x: 76, z: -111, y: -7.7, w: 7.2, d: 6.0 },
    ];
    platforms.forEach((p, index) => {
      const platform = new THREE.Mesh(new THREE.BoxGeometry(p.w, 0.42, p.d), basalt);
      platform.name = `secret_lava_platform_${index + 1}`;
      platform.position.set(p.x, p.y, p.z);
      platform.receiveShadow = true;
      platform.castShadow = true;
      scene.add(platform);
      this.levelColliders.push(platform);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(p.w * 0.92, 0.08, p.d * 0.9), gold);
      edge.position.set(p.x, p.y + 0.24, p.z);
      scene.add(edge);
    });

    // Rock outcrops make the rim readable and break up the lava silhouette.
    const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 14.5 + (i % 3) * 1.3;
      const x = this.secretLavaCenter.x + Math.cos(angle) * radius;
      const z = this.secretLavaCenter.y + Math.sin(angle) * radius;
      const rock = new THREE.Mesh(rockGeometry, basalt);
      rock.position.set(x, this.getTerrainHeight(x, z) + 0.35, z);
      rock.scale.set(1.0 + (i % 3) * 0.22, 0.65 + (i % 2) * 0.3, 1.0 + (i % 4) * 0.12);
      rock.rotation.set(0.12 * (i % 3), angle, 0.08 * (i % 2));
      rock.castShadow = true;
      scene.add(rock);
    }

    this.exitDoor = new Door('door_exit', new THREE.Vector3(76, -7.45, -111), 0, true);
    this.exitDoor.mesh.name = 'secret_lava_exit_door';
    scene.add(this.exitDoor.mesh);
    this.doors.push(this.exitDoor);
    this.levelColliders.push(this.exitDoor.mesh);
  }

  /** Load the authored Blender portal mesh while the level is still preparing. */
  private async loadCelestialPortalAsset(): Promise<THREE.Group | null> {
    const manager = new THREE.LoadingManager();
    manager.onProgress = (url, loaded, total) => this.onResourceProgress?.(loaded, total, url);
    const loader = new GLTFLoader(manager);
    const url = `${import.meta.env.BASE_URL}assets/environment/space-portal.glb?v=${__APP_VERSION__}`;
    try {
      return (await loader.loadAsync(url)).scene;
    } catch (error) {
      console.warn('[CelestialPortal] Blender portal asset unavailable; keeping the crypt entrance fallback.', { url, error });
      return null;
    }
  }

  /**
   * The original Blender Geometry Nodes material is not portable to glTF.
   * Keep its authored mesh and replace only that material with a small runtime
   * shader, leaving the crypt trigger, destination, and collision untouched.
   */
  private installCelestialPortal(asset: THREE.Group): void {
    if (!this.curiosityCryptMouth) return;
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uActivation: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uActivation;
        varying vec2 vUv;
        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          float r = length(p);
          float a = atan(p.y, p.x);
          float edge = 1.0 - smoothstep(0.91, 1.0, r);
          float rim = smoothstep(0.70, 0.78, r) * (1.0 - smoothstep(0.91, 0.99, r));
          float flow = sin(a * 7.0 + r * 22.0 - uTime * (0.55 + uActivation * 1.1)) * 0.5 + 0.5;
          float spiral = sin(a * 3.0 - r * 17.0 + uTime * (0.25 + uActivation * 0.55)) * 0.5 + 0.5;
          float core = (1.0 - smoothstep(0.04, 0.78, r)) * (0.45 + 0.55 * spiral);
          vec3 deep = vec3(0.10, 0.012, 0.025);
          vec3 ember = vec3(0.88, 0.055, 0.025);
          vec3 gold = vec3(1.0, 0.48, 0.075);
          vec3 color = mix(deep, ember, clamp(flow * 0.7 + core * 0.35, 0.0, 1.0));
          color = mix(color, gold, rim * (0.72 + flow * 0.28));
          color += vec3(0.62, 0.035, 0.012) * core;
          float alpha = edge * smoothstep(0.02, 0.2, uActivation) * 0.82 * (0.38 + core * 0.38 + rim * 0.24);
          gl_FragColor = vec4(color, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending
    });

    asset.name = 'space_portal_blender_asset';
    // The authored circular portal is two-sided so its same space_portal
    // surface reads correctly from both the surface and cave sides.
    asset.position.set(0, 1.58, 0.18);
    asset.scale.setScalar(1.12);
    asset.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.material = material;
      object.castShadow = false;
      object.receiveShadow = false;
      object.renderOrder = 2;
      object.frustumCulled = true;
    });
    this.curiosityCryptMouth.add(asset);
    this.cryptPortalMaterial = material;
    this.portalAsset = asset;
    // The portal GLB may arrive after the deferred full-scene warmup. Compile
    // only this small entrance group before the switch is used, avoiding a
    // first-use shader hitch during the crypt reveal.
    void this.sceneManager.renderer.compileAsync(
      this.curiosityCryptMouth,
      this.sceneManager.camera,
      this.sceneManager.scene
    ).catch((error) => console.warn('[CelestialPortal] Deferred portal shader warmup failed.', error));

    // Asegurar que el material sea visible desde ambos lados (frente y atrás)
    if (this.cryptPortalMaterial) {
        this.cryptPortalMaterial.side = THREE.DoubleSide;
        this.cryptPortalMaterial.transparent = true;
        this.cryptPortalMaterial.depthWrite = false;
    }

    // The authored mesh now supplies the portal surface, so remove only the
    // crude semicircle accent. Keep the dark opening and rocky cave surround.
    const fallbackRing = this.curiosityCryptMouth.children.find((child) =>
      child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry
    );
    if (fallbackRing) fallbackRing.visible = false;
  }

  private buildCuriosityVault(scene: THREE.Scene, stoneMat: THREE.Material, castleCenterZ: number): void {
    // The cave entrance sits off the paved route, outside the temple. Its
    // existing interaction still transfers to the authored underground room.
    this.curiosityCryptSurface.y = this.getTerrainHeight(this.curiosityCryptSurface.x, this.curiosityCryptSurface.z);
    // A small, ground-hugging rune trail makes the already separate west-field
    // crypt entrance discoverable after the pavilion lever is activated.
    this.curiosityCryptTrail = new THREE.Group();
    this.curiosityCryptTrail.name = 'curiosity_crypt_wayfinding_runes';
    const trailMaterial = new THREE.MeshBasicMaterial({ color: 0xe7a84b, toneMapped: false });
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      const x = THREE.MathUtils.lerp(-55, this.curiosityCryptSurface.x, t);
      const z = THREE.MathUtils.lerp(-75, this.curiosityCryptSurface.z, t);
      const rune = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 6, 18), trailMaterial);
      rune.rotation.x = Math.PI / 2;
      rune.position.set(x, this.getTerrainHeight(x, z) + 0.07, z);
      rune.name = `crypt_wayfinder_${i}`;
      this.curiosityCryptTrail.add(rune);
    }
    this.curiosityCryptTrail.visible = false;
    scene.add(this.curiosityCryptTrail);
    this.hatchPivot = new THREE.Group();
    this.hatchPivot.name = 'curiosity_hatch_hinge';
    this.hatchPivot.position.set(this.curiosityCryptSurface.x, this.curiosityCryptSurface.y + 0.4, this.curiosityCryptSurface.z);
    this.lavaVaultHatch = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 4.2), stoneMat);
    this.lavaVaultHatch.name = 'curiosity_hatch_lid';
    this.lavaVaultHatch.position.set(0, -0.2, 2.1);
    // Keep the old hinge state for the lever flow, but remove the crude square
    // lid from view and from collision; the new terrain cave is the entrance.
    this.lavaVaultHatch.visible = false;
    this.lavaVaultHatch.castShadow = false;
    this.lavaVaultHatch.receiveShadow = false;
    this.hatchPivot.add(this.lavaVaultHatch);
    scene.add(this.hatchPivot);

    // A low-poly cave mouth set into the same terrain plane replaces the
    // floating hatch/ring. The opening faces the approach and remains hidden
    // until the existing lever opens the crypt.
    this.curiosityCryptMouth = new THREE.Group();
    this.curiosityCryptMouth.name = 'curiosity_crypt_surface_mouth';
    this.curiosityCryptMouth.position.copy(this.curiosityCryptSurface);
    const caveShape = new THREE.Shape();
    caveShape.moveTo(-1.55, 0.04);
    caveShape.lineTo(-1.55, 1.65);
    caveShape.bezierCurveTo(-1.55, 3.25, 1.55, 3.25, 1.55, 1.65);
    caveShape.lineTo(1.55, 0.04);
    caveShape.closePath();
    const voidPlane = new THREE.Mesh(
      new THREE.ShapeGeometry(caveShape, 24),
      new THREE.MeshBasicMaterial({ color: 0x070b13, side: THREE.DoubleSide })
    );
    voidPlane.position.set(0, 0.02, 0.08);
    this.curiosityCryptMouth.add(voidPlane);
    const caveStone = new THREE.MeshStandardMaterial({ color: 0x34323a, roughness: 0.96, flatShading: true });
    const caveRockPositions = [
      [-1.8, 0.6, 0], [-1.95, 1.35, 0.02], [-1.45, 2.55, 0], [-0.65, 3.0, 0],
      [0.25, 3.08, 0], [1.15, 2.78, 0], [1.8, 2.0, 0], [1.95, 1.05, 0], [1.7, 0.45, 0]
    ] as const;
    caveRockPositions.forEach(([x, y, z], i) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5 + (i % 3) * 0.09, 0), caveStone);
      rock.position.set(x, y, z);
      rock.scale.set(1.25, 0.86 + (i % 2) * 0.22, 0.8);
      rock.rotation.z = (i % 3 - 1) * 0.24;
      rock.castShadow = true;
      this.curiosityCryptMouth.add(rock);
    });
    const mouthRing = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.045, 6, 40, Math.PI),
      new THREE.MeshBasicMaterial({ color: 0xff552c, toneMapped: false }));
    mouthRing.position.set(0, 1.62, 0.12);
    this.curiosityCryptMouth.add(mouthRing);
    this.cryptEntranceGlow = new THREE.PointLight(0xff5a24, 0.7, 5.5, 2);
    this.cryptEntranceGlow.position.set(0, 1.35, 0.6);
    this.cryptEntranceGlow.castShadow = false;
    this.curiosityCryptMouth.add(this.cryptEntranceGlow);
    // Show a low-energy spiral in the existing dark cave opening. The entrance
    // prompt/teleport remains disabled until the lever reveal reaches its end.
    this.curiosityCryptMouth.visible = this.isLavaVaultOpen;
    scene.add(this.curiosityCryptMouth);

    const stairLen = 8.0;
    const stairDrop = 6.0;
    const angle = Math.atan(stairDrop / stairLen);
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.14, Math.hypot(stairLen, stairDrop)), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide }));
    ramp.name = 'curiosity_stair_ramp_collider';
    ramp.position.set(-9.0, -2.93, castleCenterZ + 4.0);
    ramp.rotation.x = -angle;
    scene.add(ramp);
    this.levelColliders.push(ramp);

    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const step = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.28, 0.62), stoneMat);
      step.name = `curiosity_stair_step_${i}`;
      step.position.set(-9.0, 0.1 - t * stairDrop, castleCenterZ + 8 - t * stairLen);
      step.castShadow = step.receiveShadow = true;
      scene.add(step);
      this.levelColliders.push(step);
    }

    // Reuse the level's authored stone texture maps, lightly cool-tinted for
    // the underground chamber rather than replacing them with flat black stone.
    const caveWallMat = stoneMat.clone() as THREE.MeshStandardMaterial;
    caveWallMat.color.multiply(new THREE.Color(0.72, 0.78, 0.92));
    caveWallMat.emissive.setHex(0x24190f);
    caveWallMat.emissiveIntensity = 0.28;
    caveWallMat.roughness = 0.94;
    caveWallMat.metalness = 0.02;
    const caveCeilingMat = new THREE.MeshStandardMaterial({ color: 0x292a31, roughness: 0.98, flatShading: true, side: THREE.DoubleSide });
    const cryptFloorMat = caveWallMat.clone();
    cryptFloorMat.color.multiplyScalar(1.12);
    cryptFloorMat.emissive.setHex(0x101a31);
    cryptFloorMat.emissiveIntensity = 0.34;
    const floor = new THREE.Mesh(new THREE.BoxGeometry(29.5, 0.4, 27.5), cryptFloorMat);
    floor.name = 'curiosity_chamber_floor';
    floor.position.set(-22.25, this.curiosityCryptFloorY - 0.2, castleCenterZ);
    floor.receiveShadow = true;
    scene.add(floor);
    this.levelColliders.push(floor);
    this.cryptWalkableSurfaces = [floor];

    // Enclose the chamber under the terrain with a domed rock vault; the surface
    // sky is hidden from inside and the cave no longer reads as an open box.
    const roof = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), caveCeilingMat);
    roof.name = 'curiosity_crypt_rock_ceiling';
    roof.position.set(-22.25, -6.0, castleCenterZ);
    roof.scale.set(17.5, 8.2, 16.0);
    roof.receiveShadow = true;
    scene.add(roof);
    this.levelColliders.push(roof);

    const walls = [
      [29.5, 7.0, 0.7, -22.25, -2.45, castleCenterZ - 13.75],
      [29.5, 7.0, 0.7, -22.25, -2.45, castleCenterZ + 13.75],
      [0.7, 7.0, 27.5, -37.0, -2.45, castleCenterZ],
      // Split east end wall around the exit portal so the cave is enclosed but navigable.
      [0.7, 7.0, 11.0, -7.5, -2.45, castleCenterZ - 8.25],
      [0.7, 7.0, 11.0, -7.5, -2.45, castleCenterZ + 8.25],
    ];
    walls.forEach(([width, height, depth, x, y, z], index) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), caveWallMat);
      wall.name = `curiosity_chamber_wall_${index}`;
      wall.position.set(x, y, z);
      scene.add(wall);
      this.levelColliders.push(wall);
    });

    // A matching stone arch and a dim teal portal make the return opening legible.
    const returnArch = new THREE.Group();
    returnArch.name = 'curiosity_crypt_return_arch';
    returnArch.position.set(-8.0, -5.8, castleCenterZ);
    const archStone = new THREE.MeshStandardMaterial({ color: 0x75614a, roughness: 0.88, metalness: 0.12 });
    const portalPlane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.8), new THREE.MeshBasicMaterial({ color: 0x071923, side: THREE.DoubleSide }));
    portalPlane.rotation.y = Math.PI / 2;
    portalPlane.position.set(-0.04, 1.4, 0);
    returnArch.add(portalPlane);
    const archLeft = new THREE.Mesh(new THREE.BoxGeometry(0.48, 2.8, 0.55), archStone);
    const archRight = archLeft.clone();
    archLeft.position.set(0, 1.4, -2.45);
    archRight.position.set(0, 1.4, 2.45);
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 5.45), archStone);
    archTop.position.set(0, 2.8, 0);
    returnArch.add(archLeft, archRight, archTop);
    const returnRing = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.07, 8, 40), new THREE.MeshBasicMaterial({ color: 0x57d8ce, toneMapped: false }));
    returnRing.rotation.y = Math.PI / 2;
    returnRing.position.set(0.08, 1.4, 0);
    returnArch.add(returnRing);
    scene.add(returnArch);

    // Compact crypt-only practical lighting: warm wall/altar pools balanced by
    // one restrained spectral accent. No shadow maps or per-frame light work.
    const cryptLighting = new THREE.Group();
    cryptLighting.name = 'curiosity_crypt_practical_lights';
    // Keep this below-ground emissive group resident and visible. A hidden
    // group of point lights was being toggled on crypt entry; Three.js then
    // changed the light-count shader variant for the whole scene and forced a
    // large synchronous shader warmup exactly during the fade transition.
    cryptLighting.visible = true;
    this.cryptLightingGroup = cryptLighting;
    scene.add(cryptLighting);
    [
      { position: new THREE.Vector3(-34.2, -2.25, castleCenterZ - 8.8), color: 0xffb66b, intensity: 2.7, range: 11 },
      { position: new THREE.Vector3(-10.2, -2.25, castleCenterZ - 8.8), color: 0xffc47b, intensity: 2.45, range: 10 },
      { position: new THREE.Vector3(-34.2, -2.25, castleCenterZ + 8.8), color: 0xffc47b, intensity: 2.45, range: 10 },
      { position: new THREE.Vector3(-10.2, -2.25, castleCenterZ + 8.8), color: 0x72c9ff, intensity: 2.2, range: 11 },
      { position: new THREE.Vector3(-33.4, -3.15, castleCenterZ), color: 0xffbd52, intensity: 3.2, range: 8.5 },
    ].forEach(({ position, color }) => {
      const glow = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), new THREE.MeshBasicMaterial({ color, toneMapped: false }));
      glow.position.copy(position);
      cryptLighting.add(glow);
      // The glow mesh and the crypt stone's baked emissive response provide
      // the warm pool. Avoid adding live point lights that trigger a full-scene
      // shader variant change when the player enters or leaves the chamber.
    });

    const floorMark = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: 0xb78a4b, roughness: 0.7 }));
    floorMark.position.set(-22.5, -5.86, castleCenterZ - 13.28);
    scene.add(floorMark);

    // Circular labyrinth seal inspired by the supplied crypt emblem. A single
    // small canvas texture keeps it self-contained and inexpensive to render.
    const sealCanvas = document.createElement('canvas');
    sealCanvas.width = sealCanvas.height = 512;
    const sealContext = sealCanvas.getContext('2d');
    if (sealContext) {
      const cx = 256, cy = 256;
      const stone = sealContext.createRadialGradient(cx, cy, 45, cx, cy, 242);
      stone.addColorStop(0, '#1a2d49');
      stone.addColorStop(0.76, '#10203a');
      stone.addColorStop(1, '#081426');
      sealContext.fillStyle = stone;
      sealContext.beginPath(); sealContext.arc(cx, cy, 238, 0, Math.PI * 2); sealContext.fill();
      sealContext.strokeStyle = '#d6aa5d'; sealContext.lineWidth = 13;
      sealContext.beginPath(); sealContext.arc(cx, cy, 230, 0, Math.PI * 2); sealContext.stroke();
      sealContext.strokeStyle = '#6d512e'; sealContext.lineWidth = 8;
      sealContext.beginPath(); sealContext.arc(cx, cy, 198, 0, Math.PI * 2); sealContext.stroke();
      sealContext.strokeStyle = '#d3a85d'; sealContext.lineWidth = 18;
      sealContext.lineCap = 'square'; sealContext.lineJoin = 'bevel';
      const paths = [
        [[256,70],[256,168],[148,168],[148,112],[218,112],[218,138],[178,138]],
        [[256,70],[256,168],[364,168],[364,112],[294,112],[294,138],[334,138]],
        [[70,256],[168,256],[168,364],[112,364],[112,294],[138,294],[138,334]],
        [[442,256],[344,256],[344,364],[400,364],[400,294],[374,294],[374,334]],
        [[256,442],[256,344],[148,344],[148,400],[218,400],[218,374],[178,374]],
        [[256,442],[256,344],[364,344],[364,400],[294,400],[294,374],[334,374]],
        [[182,218],[330,218],[330,294],[182,294],[182,256],[294,256],[294,276],[218,276]],
      ];
      for (const points of paths) {
        sealContext.beginPath();
        points.forEach(([x, y], index) => index ? sealContext.lineTo(x, y) : sealContext.moveTo(x, y));
        sealContext.stroke();
      }
      sealContext.strokeStyle = 'rgba(255,220,154,.42)'; sealContext.lineWidth = 3;
      [[95,105,140,150],[365,90,400,127],[105,375,145,410],[370,365,411,402],[247,182,274,200]].forEach(([x1,y1,x2,y2]) => {
        sealContext.beginPath(); sealContext.moveTo(x1,y1); sealContext.lineTo(x2,y2); sealContext.stroke();
      });
    }
    const sealTexture = new THREE.CanvasTexture(sealCanvas);
    sealTexture.colorSpace = THREE.SRGBColorSpace;
    const seal = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), new THREE.MeshBasicMaterial({
      map: sealTexture, transparent: true, toneMapped: false, side: THREE.DoubleSide,
    }));
    seal.name = 'curiosity_crypt_ancestral_labyrinth_seal';
    seal.rotation.y = Math.PI / 2;
    seal.position.set(-36.58, -3.8, castleCenterZ);
    seal.renderOrder = 2;
    seal.castShadow = false;
    seal.receiveShadow = false;
    scene.add(seal);
    [new THREE.Vector3(-15.0, -2.8, castleCenterZ), new THREE.Vector3(-29.5, -2.8, castleCenterZ)].forEach((position) => {
      const light = new THREE.PointLight(0xffb45e, 1.7, 9, 2);
      light.position.copy(position);
      light.castShadow = false;
      scene.add(light);
    });

    // Replace the temporary rectangular block with a low octagonal altar. Its
    // top remains at the old platform height, while shallow approach steps
    // keep the chest reachable without forcing a jump.
    const altarStone = caveWallMat.clone();
    altarStone.color.multiply(new THREE.Color(1.08, 1.04, 0.96));
    const altarBase = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.35, 0.3, 8), altarStone);
    altarBase.name = 'curiosity_ancestral_altar_base';
    altarBase.userData.walkableSupport = true;
    altarBase.userData.cryptWalkableSupport = true;
    altarBase.position.set(-33.4, -5.75, castleCenterZ);
    altarBase.receiveShadow = true;
    altarBase.castShadow = true;
    scene.add(altarBase);
    this.levelColliders.push(altarBase);
    this.cryptWalkableSurfaces.push(altarBase);

    const stepMaterial = altarStone.clone();
    for (let i = 0; i < 2; i++) {
      const height = 0.09 + i * 0.09;
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.95, height, 2.45), stepMaterial);
      step.name = `curiosity_altar_approach_step_${i + 1}`;
      step.userData.walkableSupport = true;
      step.userData.cryptWalkableSupport = true;
      step.position.set(-29.55 - i * 0.8, this.curiosityCryptFloorY + height * 0.5 + 0.01, castleCenterZ);
      step.receiveShadow = true;
      scene.add(step);
      this.levelColliders.push(step);
      this.cryptWalkableSurfaces.push(step);
    }

    const goldStone = new THREE.MeshStandardMaterial({
      color: 0x9c7540, roughness: 0.58, metalness: 0.48,
      emissive: 0x261706, emissiveIntensity: 0.22,
    });
    const pillarGeometry = new THREE.CylinderGeometry(0.18, 0.25, 1.55, 8);
    const pillarPositions = [
      [-35.25, castleCenterZ - 2.15], [-35.25, castleCenterZ + 2.15],
      [-31.65, castleCenterZ - 2.15], [-31.65, castleCenterZ + 2.15],
    ];
    pillarPositions.forEach(([x, z], index) => {
      const pillar = new THREE.Group();
      pillar.name = `curiosity_altar_ornament_pillar_${index + 1}`;
      pillar.position.set(x, this.curiosityCryptFloorY + 0.775, z);
      const shaft = new THREE.Mesh(pillarGeometry, altarStone);
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.29, 0.16, 8), goldStone);
      cap.position.y = 0.72;
      const foot = cap.clone();
      foot.position.y = -0.72;
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.035, 6, 16), goldStone);
      band.position.y = 0.36;
      const lowerBand = band.clone();
      lowerBand.position.y = -0.36;
      pillar.add(shaft, cap, foot, band, lowerBand);
      scene.add(pillar);
      // Decorative posts intentionally have no player collider.
    });

    const altarRune = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.028, 6, 48),
      new THREE.MeshStandardMaterial({ color: 0xb88b4d, roughness: 0.7, metalness: 0.35, emissive: 0x172c3b, emissiveIntensity: 0.18 })
    );
    altarRune.name = 'curiosity_altar_floor_engraving';
    altarRune.rotation.x = Math.PI / 2;
    altarRune.position.set(-33.4, -5.585, castleCenterZ);
    scene.add(altarRune);

    // A single textured point cloud supplies very low-cost, soft ambient dust.
    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = dustCanvas.height = 64;
    const dustContext = dustCanvas.getContext('2d');
    if (dustContext) {
      const gradient = dustContext.createRadialGradient(32, 32, 1, 32, 32, 31);
      gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
      gradient.addColorStop(0.28, 'rgba(255,255,255,0.38)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      dustContext.fillStyle = gradient;
      dustContext.fillRect(0, 0, 64, 64);
    }
    const dustTexture = new THREE.CanvasTexture(dustCanvas);
    dustTexture.colorSpace = THREE.SRGBColorSpace;
    const dustCount = 34;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    this.cryptDustBasePositions = new Float32Array(dustCount * 3);
    this.cryptDustPhases = new Float32Array(dustCount);
    const blueDust = new THREE.Color(0x8abfe5);
    const goldDust = new THREE.Color(0xe6bd79);
    for (let i = 0; i < dustCount; i++) {
      const t = i / dustCount;
      const nearAltar = i < 10;
      const x = nearAltar ? -33.4 + Math.sin(i * 2.4) * 3.3 : -35.0 + t * 25.5;
      const z = nearAltar ? castleCenterZ + Math.cos(i * 1.7) * 3.1 : castleCenterZ - 11.5 + ((i * 7) % 23);
      const y = this.curiosityCryptFloorY + 0.75 + ((i * 11) % 32) / 10;
      const offset = i * 3;
      dustPositions[offset] = this.cryptDustBasePositions[offset] = x;
      dustPositions[offset + 1] = this.cryptDustBasePositions[offset + 1] = y;
      dustPositions[offset + 2] = this.cryptDustBasePositions[offset + 2] = z;
      this.cryptDustPhases[i] = i * 1.618;
      const tint = blueDust.clone().lerp(goldDust, (i % 5) === 0 ? 0.5 : 0.08);
      dustColors[offset] = tint.r;
      dustColors[offset + 1] = tint.g;
      dustColors[offset + 2] = tint.b;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
      map: dustTexture, size: 0.22, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0.3, depthWrite: false, alphaTest: 0.015,
      blending: THREE.AdditiveBlending,
    }));
    dust.name = 'curiosity_crypt_ambient_dust';
    dust.frustumCulled = false;
    dust.visible = false;
    this.cryptDust = dust;
    scene.add(dust);

    this.curiosityChest = new TreasureChest(new THREE.Vector3(-33.4, -5.6, castleCenterZ), Math.PI / 2);
    this.curiosityChest.mesh.name = 'curiosity_key_chest';
    scene.add(this.curiosityChest.mesh);
    this.chests.push(this.curiosityChest);
    this.levelColliders.push(this.curiosityChest.mesh);

    // Decode the authored curiosity key while the level is being prepared,
    // well before the player can reach the lever/chest.
    this.warmCuriosityKeyAsset();
  }

  private warmCuriosityKeyAsset(): void {
    if (this.curiosityKeyPreloadStarted) return;
    this.curiosityKeyPreloadStarted = true;
    const startedAt = performance.now();
    void preloadKeyModel('key4_curiosity').then(() => {
      if (import.meta.env.DEV) console.info('[CuriosityVaultPerf] Authored key warmup complete', { durationMs: +(performance.now() - startedAt).toFixed(1) });
    }).catch((error) => {
      this.curiosityKeyPreloadStarted = false;
      console.warn('[KEY] Curiosity key preload failed; the authored model will load on demand when the reward appears.', error);
    });
  }

  /** Observe actual RAF gaps following the lever press; one sample window only. */
  private measureCryptActivationFrames(): void {
    let previous = performance.now();
    let worstFrameMs = 0;
    let frames = 0;
    const sample = (now: number) => {
      worstFrameMs = Math.max(worstFrameMs, now - previous);
      previous = now;
      frames++;
      if (frames < 8) {
        requestAnimationFrame(sample);
        return;
      }
      console.info('[CuriosityVaultPerf] RAF response after lever press', {
        frames,
        worstFrameMs: +worstFrameMs.toFixed(1),
      });
    };
    requestAnimationFrame(sample);
  }

  /** Five-tree liana route on the actual collidable terrain, built from shipped tree assets. */
  private buildCanopyTrial(): void {
    const scene = this.sceneManager.scene;
    // The former anchor (-125,-80) sat beyond the terrain mesh (x=-80..80).
    // This central eastern meadow is inside the real 160m terrain and clear
    // of the main pavilion at (20, 24), temple at (0, -40), crypt and cabin.
    const treeXZ: Array<[number, number]> = [[30, 0], [38, -10], [46, 1], [54, -9], [62, 0]];
    const treeBases = treeXZ.map(([x, z]) => new THREE.Vector3(x, this.getTerrainHeight(x, z), z));
    const perchHeights = [4.55, 4.95, 5.35, 4.9, 5.2];
    const routePoints = treeBases.map((treeBase, i) => new THREE.Vector3(
      treeBase.x + (i === 0 ? 1.9 : 0.9), treeBase.y + perchHeights[i]!, treeBase.z + (i % 2 ? -0.25 : 0.8)
    ));
    const base = treeBases[0]!;
    const top = routePoints[0]!;
    const middle = routePoints[2]!;
    const landing = routePoints[4]!;
    const bark = new THREE.MeshStandardMaterial({ color: 0x56351e, roughness: 0.92 });
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x382116, roughness: 0.82 });
    const warmWood = new THREE.MeshStandardMaterial({ color: 0x76502d, roughness: 0.85 });
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x625138, roughness: 0.88, metalness: 0.02,
      emissive: 0x201302, emissiveIntensity: 0.16, transparent: true, opacity: 0,
    });
    this.canopyPlatformsMaterial = platformMat;

    const addRouteMesh = (mesh: THREE.Mesh, name: string, collider = false) => {
      mesh.name = name;
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.visible = false;
      scene.add(mesh);
      this.canopyRouteVisuals.push(mesh);
      if (collider) this.canopyPlatformColliders.push(mesh);
      return mesh;
    };
    const addBox = (name: string, x: number, y: number, z: number, sx: number, sy: number, sz: number, material: THREE.Material, collider = false) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
      mesh.position.set(x, y, z);
      return addRouteMesh(mesh, name, collider);
    };

    // Tree trunks block passage, while staying clear of the walkable stair spiral.
    const trunkBlockMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
    treeBases.forEach((treeBase, i) => {
      const height = perchHeights[i]! - 0.25;
      const blocker = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.9, height, 9), trunkBlockMat);
      blocker.name = `qi_canopy_trunk_collision_${i + 1}`;
      blocker.position.set(treeBase.x, treeBase.y + height * 0.5, treeBase.z);
      scene.add(blocker);
      this.levelColliders.push(blocker);
    });

    // Tree 1 has a timber house/landing, low rails and a continuous spiral staircase.
    const houseDeckY = top.y - 0.28;
    addBox('qi_treehouse_deck', top.x, houseDeckY, top.z, 5.1, 0.55, 4.5, warmWood, true);
    for (let i = 0; i < 7; i++) addBox('qi_treehouse_floor_plank_' + i, top.x - 2.15 + i * 0.7, houseDeckY + 0.285, top.z, 0.64, 0.045, 4.35, darkWood);
    for (const sx of [-2.25, 2.25]) for (const sz of [-1.9, 1.9]) {
      addBox('qi_treehouse_post', top.x + sx, houseDeckY + 1.0, top.z + sz, 0.18, 2.0, 0.18, darkWood);
    }
    for (const side of [-1, 1]) {
      addBox('qi_treehouse_rail', top.x, houseDeckY + 0.75, top.z + side * 1.95, 4.55, 0.16, 0.14, warmWood);
      for (let i = 0; i < 5; i++) addBox('qi_treehouse_baluster', top.x - 1.8 + i * 0.9, houseDeckY + 0.4, top.z + side * 1.95, 0.09, 0.7, 0.09, darkWood);
    }
    addBox('qi_treehouse_back_wall', top.x, houseDeckY + 1.55, top.z - 1.62, 3.4, 1.3, 0.14, darkWood);
    for (let i = 0; i < 5; i++) addBox('qi_treehouse_lattice', top.x - 1.2 + i * 0.6, houseDeckY + 1.55, top.z - 1.51, 0.055, 1.05, 0.06, warmWood);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 0.9, 4), darkWood);
    roof.position.set(top.x, houseDeckY + 2.65, top.z - 0.15);
    roof.rotation.y = Math.PI / 4;
    addRouteMesh(roof, 'qi_treehouse_chinese_roof');
    const stairSteps = 24;
    const stairStartAngle = -Math.PI * 0.15;
    const stairEndAngle = Math.atan2(top.z - base.z, top.x - base.x) + Math.PI * 2;
    const stairAngleSpan = stairEndAngle - stairStartAngle;
    const stairRadius = 2.05;
    const stairRise = perchHeights[0]! - 0.45;
    const stairSurfaceY = (t: number) => base.y + 0.32 + t * stairRise;

    // A continuous collidable walking surface closes the small gaps between
    // the decorative stair treads, so climbing does not require precise jumps.
    const stairPositions: number[] = [];
    const stairIndices: number[] = [];
    const stairSegments = 40;
    const innerRadius = 1.14;
    const outerRadius = 3.06;
    for (let segment = 0; segment <= stairSegments; segment++) {
      const t = segment / stairSegments;
      const angle = stairStartAngle + t * stairAngleSpan;
      for (const radius of [innerRadius, outerRadius]) {
        stairPositions.push(
          base.x + Math.cos(angle) * radius,
          stairSurfaceY(t),
          base.z + Math.sin(angle) * radius,
        );
      }
    }
    for (let segment = 0; segment < stairSegments; segment++) {
      const a = segment * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      stairIndices.push(a, c, b, c, d, b);
    }
    const stairGeometry = new THREE.BufferGeometry();
    stairGeometry.setAttribute('position', new THREE.Float32BufferAttribute(stairPositions, 3));
    stairGeometry.setIndex(stairIndices);
    stairGeometry.computeVertexNormals();
    const stairWalkwayMaterial = warmWood.clone();
    stairWalkwayMaterial.side = THREE.DoubleSide;
    const continuousStair = new THREE.Mesh(stairGeometry, stairWalkwayMaterial);
    continuousStair.name = 'qi_treehouse_continuous_spiral_stair_walkway';
    continuousStair.userData.walkableSupport = true;
    addRouteMesh(continuousStair, continuousStair.name, true);

    // The decorative tube and scattered posts alone left gaps wide enough for
    // Wukong to slip off the spiral. Build a continuous, invisible side wall
    // from the tread surface up to guard height, using the exact stair curve.
    // Two merged ribbon meshes keep the collision set small and leave the
    // final few centimetres open so the player can step naturally onto the deck.
    const railPaths: THREE.Vector3[][] = [[], []];
    const barrierBottoms: THREE.Vector3[][] = [[], []];
    const barrierTops: THREE.Vector3[][] = [[], []];
    const guardEndT = 0.99;
    for (let sample = 0; sample <= 40; sample++) {
      const t = sample / 40;
      if (t > guardEndT) break;
      const angle = stairStartAngle + t * stairAngleSpan;
      for (let side = 0; side < 2; side++) {
        const radius = side === 0 ? innerRadius + 0.06 : outerRadius - 0.06;
        const x = base.x + Math.cos(angle) * radius;
        const z = base.z + Math.sin(angle) * radius;
        const floorY = stairSurfaceY(t) + 0.035;
        barrierBottoms[side]!.push(new THREE.Vector3(x, floorY, z));
        barrierTops[side]!.push(new THREE.Vector3(x, floorY + 1.28, z));
        railPaths[side]!.push(new THREE.Vector3(x, floorY + 0.9, z));
      }
    }
    const guardCollisionMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    railPaths.forEach((points, side) => {
      const railCurve = new THREE.CatmullRomCurve3(points);
      const rail = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 60, 0.075, 6, false), warmWood);
      rail.name = `qi_treehouse_stair_handrail_${side === 0 ? 'inner' : 'outer'}`;
      addRouteMesh(rail, rail.name);

      const positions: number[] = [];
      const indices: number[] = [];
      const bottoms = barrierBottoms[side]!;
      const tops = barrierTops[side]!;
      for (let i = 0; i < bottoms.length; i++) {
        positions.push(
          bottoms[i]!.x, bottoms[i]!.y, bottoms[i]!.z,
          tops[i]!.x, tops[i]!.y, tops[i]!.z,
        );
      }
      for (let i = 0; i < bottoms.length - 1; i++) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, c, b, c, d, b);
      }
      const guardGeometry = new THREE.BufferGeometry();
      guardGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      guardGeometry.setIndex(indices);
      guardGeometry.computeVertexNormals();
      const guardWall = new THREE.Mesh(guardGeometry, guardCollisionMaterial);
      guardWall.name = `qi_treehouse_stair_guard_collision_${side === 0 ? 'inner' : 'outer'}`;
      addRouteMesh(guardWall, guardWall.name, true);
    });
    for (let step = 1; step < stairSteps - 2; step += 2) {
      const t = step / (stairSteps - 1);
      const angle = stairStartAngle + t * stairAngleSpan;
      for (const [side, radius] of [[-1, innerRadius + 0.04], [1, outerRadius - 0.04]] as const) {
        const post = addBox(
          `qi_treehouse_stair_guard_post_${step}_${side}`,
          base.x + Math.cos(angle) * radius,
          stairSurfaceY(t) + 0.44,
          base.z + Math.sin(angle) * radius,
          0.13, 0.88, 0.13, darkWood, true,
        );
        post.rotation.y = -angle;
      }
    }

    for (let i = 0; i < stairSteps; i++) {
      const t = i / (stairSteps - 1);
      const angle = stairStartAngle + t * stairAngleSpan;
      const y = base.y + 0.28 + t * stairRise;
      const tread = addBox('qi_treehouse_stair_tread_' + (i + 1), base.x + Math.cos(angle) * stairRadius, y, base.z + Math.sin(angle) * stairRadius, 1.45, 0.22, 0.82, warmWood, true);
      tread.rotation.y = -angle;
    }

    // Keep all deck boards in one GPU-instanced batch: the more polished wood
    // detail adds one draw call instead of dozens on mobile.
    const perchPlanks = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1), warmWood, routePoints.length * 7,
    );
    perchPlanks.name = 'qi_canopy_perch_individual_wood_planks';
    perchPlanks.visible = false;
    perchPlanks.castShadow = perchPlanks.receiveShadow = true;
    const perchPlankDummy = new THREE.Object3D();
    let perchPlankIndex = 0;

    // Four intermediate/final timber platforms are mounted to the remaining trees.
    routePoints.forEach((point, i) => {
      const width = i === 4 ? 4.4 : i === 0 ? 4.2 : 3.25;
      const depth = i === 4 ? 4.0 : i === 0 ? 3.8 : 3.2;
      addBox('qi_canopy_perch_' + (i + 1), point.x, point.y - 0.28, point.z, width, 0.56, depth, platformMat, true);
      // Visible individual boards give the functional collider a real timber
      // platform finish. A dark rim and two underside beams tie it into the tree.
      for (let plank = 0; plank < 7; plank++) {
        const plankWidth = (width - 0.24) / 7;
        const plankX = point.x - width / 2 + 0.12 + plankWidth * (plank + 0.5);
        perchPlankDummy.position.set(plankX, point.y + 0.012, point.z);
        perchPlankDummy.scale.set(plankWidth - 0.035, 0.07, depth - 0.18);
        perchPlankDummy.updateMatrix();
        perchPlanks.setMatrixAt(perchPlankIndex, perchPlankDummy.matrix);
        perchPlanks.setColorAt(perchPlankIndex, new THREE.Color(plank % 3 === 0 ? 0xffffff : 0xb6a58c));
        perchPlankIndex++;
      }
      for (const edge of [-1, 1]) {
        addBox('qi_canopy_perch_trim_' + (i + 1), point.x, point.y - 0.48, point.z + edge * (depth * 0.5 - 0.14), width * 0.96, 0.12, 0.16, darkWood);
        addBox(`qi_canopy_perch_beam_${i + 1}_${edge}`, point.x, point.y - 0.39, point.z + edge * (depth * 0.34), width * 0.96, 0.18, 0.2, darkWood);
      }
      if (i > 0 && i < 4) for (const sx of [-1, 1]) {
        addBox('qi_canopy_perch_guard_' + i + '_' + sx, point.x + sx * (width / 2 - 0.12), point.y + 0.38, point.z, 0.12, 0.72, depth * 0.78, warmWood);
        addBox(`qi_canopy_perch_post_${i}_${sx}`, point.x + sx * (width / 2 - 0.12), point.y + 0.48, point.z, 0.18, 0.96, 0.18, darkWood);
      }
    });
    perchPlanks.instanceMatrix.needsUpdate = true;
    if (perchPlanks.instanceColor) perchPlanks.instanceColor.needsUpdate = true;
    scene.add(perchPlanks);
    this.canopyRouteVisuals.push(perchPlanks);

    // Root sigil and seven small weathered stones establish a natural sanctuary.
    const shrineSigil = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.045, 6, 48), new THREE.MeshBasicMaterial({ color: 0xd7a94d, transparent: true, opacity: 0.72, toneMapped: false }));
    shrineSigil.name = 'curiosity_tree_root_sigil';
    shrineSigil.position.set(base.x, base.y + 0.055, base.z);
    shrineSigil.rotation.x = Math.PI / 2;
    scene.add(shrineSigil);
    const innerSigil = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.025, 5, 32), shrineSigil.material);
    innerSigil.name = 'curiosity_tree_inner_rune';
    innerSigil.position.copy(shrineSigil.position).add(new THREE.Vector3(0, 0.012, 0));
    innerSigil.rotation.x = Math.PI / 2;
    scene.add(innerSigil);
    const runeStone = new THREE.MeshStandardMaterial({ color: 0x4e5155, roughness: 0.96, flatShading: true });
    for (let i = 0; i < 7; i++) {
      const angle = i * Math.PI * 2 / 7 + 0.18;
      const x = base.x + Math.cos(angle) * 3.05;
      const z = base.z + Math.sin(angle) * 3.05;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.34 + (i % 3) * 0.07, 0), runeStone);
      rock.name = 'curiosity_sanctuary_ancient_stone_' + i;
      rock.position.set(x, this.getTerrainHeight(x, z) + 0.22, z);
      rock.scale.set(1.25, 0.78 + (i % 2) * 0.18, 0.9);
      rock.rotation.y = angle;
      rock.castShadow = true;
      scene.add(rock);
    }
    const flyGeometry = new THREE.SphereGeometry(0.055, 6, 5);
    const flyMaterial = new THREE.MeshBasicMaterial({ color: 0xffd977, toneMapped: false });
    treeBases.forEach((treeBase, i) => {
      const fly = new THREE.Mesh(flyGeometry, flyMaterial);
      fly.name = 'qi_canopy_firefly_' + i;
      fly.position.copy(treeBase).add(new THREE.Vector3(2.2, 1.1, 0));
      scene.add(fly);
      this.canopyFireflies.push({ mesh: fly, phase: i * 1.37, radius: 1.5 + (i % 3) * 0.25 });
    });
    const shrineGlow = new THREE.PointLight(0xffc66b, 0.8, 7, 2);
    shrineGlow.name = 'curiosity_tree_sanctuary_glow';
    shrineGlow.position.copy(base).add(new THREE.Vector3(0, 1.3, 0));
    shrineGlow.castShadow = false;
    scene.add(shrineGlow);

    // Four visible, leaf-draped lianas connect branches in sequence.
    const routePaths: THREE.QuadraticBezierCurve3[] = [];
    const vineMaterial = new THREE.MeshStandardMaterial({ color: 0x78913c, roughness: 0.94, emissive: 0x385313, emissiveIntensity: 0.42 });
    routePoints.slice(0, -1).forEach((point, i) => {
      const next = routePoints[i + 1]!;
      // Keep the first grip just above Wukong's reach from the deck so the
      // opening action is available while standing; later grips stay slightly
      // higher to preserve the swing silhouette across the canopy.
      const start = point.clone().add(new THREE.Vector3(0, i === 0 ? 1.02 : 1.35, 0));
      const end = next.clone().add(new THREE.Vector3(0, 1.35, 0));
      const control = new THREE.Vector3((start.x + end.x) * 0.5, Math.max(start.y, end.y) + (i % 2 ? 2.25 : 2.7), (start.z + end.z) * 0.5);
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);
      routePaths.push(new THREE.QuadraticBezierCurve3(point.clone(), control.clone().add(new THREE.Vector3(0, -0.15, 0)), next.clone()));
      const vine = new THREE.Mesh(new THREE.TubeGeometry(curve, 22, 0.12, 7, false), vineMaterial);
      vine.name = 'qi_canopy_liana_' + (i + 1);
      vine.castShadow = false;
      vine.visible = false;
      scene.add(vine);
      this.canopyRouteVisuals.push(vine);
      const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 1.65, 7), bark);
      branch.position.copy(treeBases[i]!).add(new THREE.Vector3(0.7, 4.6, 0));
      branch.rotation.z = -Math.PI / 3.2;
      branch.visible = false;
      scene.add(branch);
      this.canopyRouteVisuals.push(branch);
      const handhold = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 6, 22), new THREE.MeshBasicMaterial({ color: 0xffd77c, toneMapped: false }));
      handhold.name = 'qi_liana_handhold_' + (i + 1);
      handhold.position.copy(start);
      handhold.rotation.x = Math.PI / 2;
      handhold.visible = false;
      scene.add(handhold);
      this.canopyRouteVisuals.push(handhold);
    });

    // Set the chest on the open, camera-facing half of the final deck so the
    // reward stays visible against the blossom canopy.
    this.canopyChest = new TreasureChest(landing.clone().add(new THREE.Vector3(0.75, 0, 0.72)), Math.PI);
    this.canopyChest.mesh.name = 'canopy_secret_key_chest';
    scene.add(this.canopyChest.mesh);
    this.chests.push(this.canopyChest);
    // Warm the authored key model while the level is being prepared. Chest
    // interaction only reveals the already-cached model; it never waits on I/O.
    void preloadKeyModel('key3_platform').catch((error) => {
      console.warn('[CanopyTrial] Qi key preload failed; it will retry asynchronously when revealed.', error);
    });
    this.canopyRewardHint = null;
    this.canopyTrial = { base, top, middle, landing, firstPath: routePaths[0]!, secondPath: routePaths[1]!, treeBases, routePoints, routePaths };
  }
  private setCanopyRouteActive(active: boolean): void {
    if (active === this.canopyTrialActivated || this.canopyTrialCompleted) return;
    this.canopyTrialActivated = active;
    for (const visual of this.canopyRouteVisuals) visual.visible = active;
    if (active) {
      for (const collider of this.canopyPlatformColliders) {
        if (!this.levelColliders.includes(collider)) this.levelColliders.push(collider);
      }
      // PlayerController snapshots collision meshes during registration. Refresh
      // it after the challenge activates or the visible stairs remain hollow.
      this.player.setColliders(this.levelColliders);
      this.cameraController.setCollisionObjects(this.levelColliders);
    } else {
      this.removeCanopyPlatformColliders();
      this.player.setColliders(this.levelColliders);
      this.cameraController.setCollisionObjects(this.levelColliders);
    }
  }

  private removeCanopyPlatformColliders(): void {
    for (let i = this.levelColliders.length - 1; i >= 0; i--) {
      if (this.canopyPlatformColliders.includes(this.levelColliders[i] as THREE.Mesh)) this.levelColliders.splice(i, 1);
    }
  }

  private completeCanopyTrial(): void {
    if (this.canopyTrialCompleted) return;
    this.canopyTrialCompleted = true;
    this.canopyTrialActivated = true;
    this.canopyTraversal = null;
    this.canopyTraversalCurve = null;
    this.player.velocity.set(0, 0, 0);
    this.player.isControlsLocked = false;
    this.player.isMovementLocked = false;
    this.player.isGrounded = true;
    // Keep the route's visible surfaces and colliders after completion so
    // Wukong cannot drop through the final perch when the key is claimed.
    this.canopyPlatformsMaterial && (this.canopyPlatformsMaterial.opacity = 1);
    this.canopyRewardHint?.removeFromParent();
  }

  private updateCanopyTrial(delta: number, playerPos: THREE.Vector3): void {
    const route = this.canopyTrial;
    if (!route) return;
    const time = performance.now() * 0.001;
    this.canopyFireflies.forEach((firefly, index) => {
      const treeBase = route.treeBases[index] ?? route.base;
      firefly.mesh.position.set(
        treeBase.x + Math.cos(time * 0.62 + firefly.phase) * firefly.radius,
        treeBase.y + 0.62 + (Math.sin(time * 1.05 + firefly.phase) + 1) * 0.56,
        treeBase.z + Math.sin(time * 0.62 + firefly.phase) * firefly.radius
      );
    });
    if (this.canopyTrialCompleted) return;
    const horizontal = (point: THREE.Vector3) => Math.hypot(playerPos.x - point.x, playerPos.z - point.z);
    const distBase = horizontal(route.base);
    if (!this.canopyTrialActivated && distBase < 18) {
      this.setCanopyRouteActive(true);
      this.subtitleSystem.show('Desafío del Qi Celestial', 'Sube a la primera casa del árbol y cruza las cuatro lianas para alcanzar el cofre final.');
    }
    if (this.canopyPlatformsMaterial && this.canopyTrialActivated && this.canopyActivationProgress < 1) {
      this.canopyActivationProgress = Math.min(1, this.canopyActivationProgress + delta * 2.8);
      this.canopyPlatformsMaterial.opacity = this.canopyActivationProgress;
    }
    if (this.canopyTraversal) {
      this.player.velocity.set(0, 0, 0);
      this.canopyTraversalElapsed += delta;
      const progress = THREE.MathUtils.clamp(this.canopyTraversalElapsed / this.canopyTraversalDuration, 0, 1);
      if (this.canopyTraversalCurve) this.player.mesh.position.copy(this.canopyTraversalCurve.getPoint(progress));
      this.player.isGrounded = progress >= 1;
      return;
    }

    const hud = (window as any).gameInstance?.hud;
    if (!this.canopyTutorialShown && distBase < 20) {
      this.canopyTutorialShown = true;
      this.cameraController.panToward(route.top.clone().add(new THREE.Vector3(0, 2.2, 0)), 1.3);
      this.subtitleSystem.show('Ruta de las lianas', 'Sube las escaleras de madera. En cada plataforma, usa Acción para agarrar la liana y balancearte hasta el siguiente árbol.');
    }
    if (this.player.isControlsLocked || this.player.isMovementLocked || this.isCinematicPlaying) return;

    // The staircase has real per-step colliders. Reaching the deck is based on
    // actual position and elevation; there is no snap-to-platform or auto-climb.
    if (this.canopyRouteIndex < 0 && this.canopyTrialActivated && horizontal(route.top) < 4.0 && Math.abs(playerPos.y - route.top.y) < 2.6) {
      this.canopyRouteIndex = 0;
      this.player.isGrounded = true;
      this.subtitleSystem.show('Primera casa del árbol', 'Buen comienzo. Agárrate a la liana que une los siguientes árboles.');
    }

    if (this.canopyRouteIndex >= 0 && this.canopyRouteIndex < route.routePoints.length - 1) {
      const current = route.routePoints[this.canopyRouteIndex]!;
      const gripReach = this.canopyRouteIndex === 0 ? 4.2 : 3.7;
      const gripHeightReach = this.canopyRouteIndex === 0 ? 3.0 : 2.7;
      if (horizontal(current) < gripReach && Math.abs(playerPos.y - current.y) < gripHeightReach) {
        const nextIndex = this.canopyRouteIndex + 1;
        const clip = this.canopyRouteIndex % 2 === 0 ? 'Swing_To_Land' : 'Swing_To_Land2';
        const canSwing = this.player.animationController.hasClip(clip);
        hud?.showInteractionPrompt(canSwing
          ? (hud?.isTouchDevice?.() ? 'Agarrar la liana · Acción' : 'Agarrar la liana [E]')
          : 'Preparando animación de liana');
        if (!canSwing || !this.inputManager.consumeInteractPress()) return;
        const target = route.routePoints[nextIndex]!;
        this.player.isControlsLocked = this.player.isMovementLocked = true;
        this.player.velocity.set(0, 0, 0);
        this.player.mesh.rotation.y = Math.atan2(target.x - playerPos.x, target.z - playerPos.z);
        this.canopyTraversal = 'swing';
        this.canopyTraversalElapsed = 0;
        this.canopyTraversalDuration = Math.max(0.9, this.player.animationController.getClipDuration(clip));
        const authoredPath = route.routePaths[this.canopyRouteIndex]!;
        // Begin at Wukong's actual standing position so the input never snaps
        // the root to a pre-authored handhold coordinate on the trigger frame.
        this.canopyTraversalCurve = new THREE.QuadraticBezierCurve3(
          this.player.mesh.position.clone(),
          authoredPath.getPoint(0.5),
          target.clone(),
        );
        this.player.animationController.playOneShot(clip, () => {
          this.player.mesh.position.copy(target);
          this.player.isGrounded = true;
          this.player.isControlsLocked = this.player.isMovementLocked = false;
          this.canopyTraversal = null;
          this.canopyTraversalCurve = null;
          this.canopyRouteIndex = nextIndex;
          if (nextIndex === route.routePoints.length - 1) {
            this.canopyRewardClaimed = true;
            this.subtitleSystem.show('Cofre de la copa', 'Has llegado al último árbol. Pulsa Acción para abrir el cofre y obtener la Llave del Qi Celestial.');
          } else {
            this.subtitleSystem.show('Travesía ' + nextIndex + ' de 4', 'Suelta la liana al llegar a la plataforma y continúa hacia el siguiente árbol.');
          }
          this.player.animationController.playState('Idle', 0.18);
        });
        return;
      }
    }

    if (this.canopyRewardClaimed && this.canopyChest && !this.canopyChestOpen && horizontal(route.landing) < 2.8 && Math.abs(playerPos.y - route.landing.y) < 2.5) {
      hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Abrir cofre del Qi · Acción' : 'Abrir cofre del Qi [E]');
      if (!this.inputManager.consumeInteractPress()) return;
      this.canopyChestOpen = this.canopyChest.isUnlocked = true;
      this.canopyChest.unlock(this.audioManager, this.collectibleSystem, () => {
        const rewardPosition = this.canopyChest!.mesh.position.clone();
        if (!this.collectedKeys.key3_platform) {
          this.spawn3DKey('key3_platform', rewardPosition.add(new THREE.Vector3(0, 1.15, 0)), true);
        }
        this.completeCanopyTrial();
      });
      if (this.canopyRewardHint) this.canopyRewardHint.visible = false;
    }
  }
  /** Start the six-key finale once Qi is claimed; wait until another camera cinematic yields. */
  private tryStartIntroKeyCelebration(): void {
    const game = (window as any).gameInstance;
    if (this.introKeyCelebrationInProgress || this.stateFlags.introKeysCelebrated ||
        !this.collectedKeys.key3_platform || this.totalKeysCount < 6 ||
        this.isCinematicPlaying || game?.cinematicCamera?.isActive() || game?.menuState !== 'Playing' || game?.isPaused) return;
    const camera = game?.cinematicCamera as { moveCamera: (...args: any[]) => Promise<void>; abort: () => void } | undefined;
    const hud = game?.hud;
    if (!camera || !hud) return;

    this.introKeyCelebrationInProgress = true;
    const player = this.player.mesh;
    const originalRotation = player.rotation.y;
    const focus = player.position.clone().add(new THREE.Vector3(0, 1.12, 0));
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.quaternion).normalize();
    const endPosition = player.position.clone().addScaledVector(forward, 4.15).add(new THREE.Vector3(0, 1.48, 0));
    const cameraObject = this.cameraController.camera;
    const startPosition = cameraObject.position.clone();
    const startLookAt = startPosition.clone().add(cameraObject.getWorldDirection(new THREE.Vector3()).multiplyScalar(5));
    this.player.velocity.set(0, 0, 0);
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;

    void camera.moveCamera(startPosition, endPosition, startLookAt, focus, 1.15).then(() => {
      if (!this.introKeyCelebrationInProgress) return;
      void camera.moveCamera(endPosition, endPosition, focus, focus, 9999);
      hud.showDialogueChoices(
        'LISAR',
        'Felicidades, has completado las 6 llaves del Nivel Introductorio. ¿Deseas seguir la aventura?',
        [
          { label: 'Sí, continuar', value: 'accept' },
          { label: 'No, quedarme explorando', value: 'decline' },
        ],
        (choice: 'accept' | 'decline') => {
          this.stateFlags.introKeysCelebrated = true;
          this.introKeyCelebrationInProgress = false;
          this.player.isControlsLocked = false;
          this.player.isMovementLocked = false;
          player.rotation.y = originalRotation;
          camera.abort();
          this.cameraController.setTarget(player);
          this.cameraController.resumeAfterCinematic();
          if (choice === 'accept') {
            this.stateFlags.levelCompleted = true;
            hud.showVictoryScreen(6, '05:00');
          }
          game.saveGame(false);
        },
        { placement: 'top', type: 'reward', focusPoints: [{ x: 0.5, y: 0.64, weight: 4 }] },
      );
    }).catch((error: unknown) => {
      this.introKeyCelebrationInProgress = false;
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      console.warn('[KeyCompletion] Could not play the closing camera move.', error);
    });
  }

  private buildAncientRuinsAndLandmarks(): void {
    const scene = this.sceneManager.scene;
    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.repeat.set(2, 2);
    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.85 });
    const redWoodMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.5 }); // Crimson red lacquered wood
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b1a1a, roughness: 0.6 }); // Chinese vermillion roof tiles

    // Paths and small guide lanterns remain; all legacy temple meshes were removed.

    const createToroLantern = (lx: number, lz: number, emissiveColorHex: number) => {
      const ly = this.getTerrainHeight(lx, lz);
      const toro = new THREE.Group();
      toro.position.set(lx, ly, lz);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.8, 6), stoneMat);
      base.position.y = 0.4;
      const chamber = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.45), redWoodMat);
      chamber.position.y = 1.05;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.35, 4), roofMat);
      cap.position.y = 1.45;
      cap.rotation.y = Math.PI / 4;

      const light = new THREE.PointLight(emissiveColorHex, 2.2, 6.5);
      light.position.y = 1.05;

      toro.add(base, chamber, cap, light);
      scene.add(toro);
      this.levelColliders.push(base);
    };

    const pathMap = stoneTex.clone();
    pathMap.wrapS = pathMap.wrapT = THREE.RepeatWrapping;
    pathMap.repeat.set(2.4, 1);
    pathMap.needsUpdate = true;
    const pathMaterial = new THREE.MeshStandardMaterial({ map: pathMap, color: 0xc9c0ae, roughness: 0.72, metalness: 0.025 });

    // Continuous, terrain-conforming stone ribbon. The same surface is the
    // collider, replacing the old overlapping 4.2m square slabs that left
    // visible zigzags and did not support the player's ground ray.
    const addStonePath = (name: string, waypoints: THREE.Vector3[], width: number): THREE.Vector3[] => {
      const curve = new THREE.CatmullRomCurve3(waypoints, false, 'centripetal');
      const sampleCount = Math.max(12, Math.ceil(curve.getLength() / 1.45));
      const maskPoints: THREE.Vector2[] = [];
      const vertices: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      const centers: THREE.Vector3[] = [];
      let distance = 0;
      let previous: THREE.Vector3 | null = null;
      for (let i = 0; i <= sampleCount; i++) {
        const t = i / sampleCount;
        const point = curve.getPointAt(t);
        maskPoints.push(new THREE.Vector2(point.x, point.z));
        point.y = this.getTerrainHeight(point.x, point.z) + 0.055;
        const tangent = curve.getTangentAt(t).setY(0).normalize();
        const sideX = -tangent.z * width * 0.5;
        const sideZ = tangent.x * width * 0.5;
        if (previous) distance += previous.distanceTo(point);
        previous = point.clone();
        centers.push(point.clone());
        vertices.push(point.x + sideX, point.y, point.z + sideZ, point.x - sideX, point.y, point.z - sideZ);
        uvs.push(0, distance / 1.8, 1, distance / 1.8);
        if (i < sampleCount) {
          const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
          indices.push(a, c, b, b, c, d);
        }
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const path = new THREE.Mesh(geometry, pathMaterial);
      path.name = name;
      path.receiveShadow = true;
      path.castShadow = false;
      scene.add(path);
      this.levelColliders.push(path);
      this.vegetationPathMasks.push({ points: maskPoints, halfWidth: width * 0.5 });
      return centers;
    };
    const addRouteLanterns = (centers: THREE.Vector3[], color: number) => {
      // Preserve the lantern rhythm while halving route point lights; lantern
      // meshes remain unchanged and share the light pools along each path.
      for (let i = 0; i < centers.length; i += 16) {
        const point = centers[i];
        const before = centers[Math.max(0, i - 1)];
        const after = centers[Math.min(centers.length - 1, i + 1)];
        const dx = after.x - before.x, dz = after.z - before.z;
        const side = i % 16 === 0 ? 1 : -1;
        const length = Math.hypot(dx, dz) || 1;
        createToroLantern(point.x - dz / length * 2.8 * side, point.z + dx / length * 2.8 * side, color);
      }
    };

    const west = addStonePath('imperial_west_stone_path', [
      new THREE.Vector3(-12, 0, -35), new THREE.Vector3(-22, 0, -45),
      new THREE.Vector3(-35, 0, -58), new THREE.Vector3(-48, 0, -68), new THREE.Vector3(-55, 0, -75)
    ], 4.2);
    addRouteLanterns(west, 0xff9900);
    const east = addStonePath('imperial_east_stone_path', [
      new THREE.Vector3(12, 0, -35), new THREE.Vector3(22, 0, -45),
      new THREE.Vector3(35, 0, -58), new THREE.Vector3(48, 0, -68), new THREE.Vector3(55, 0, -75)
    ], 4.2);
    addRouteLanterns(east, 0xffbd70);
    addStonePath('north_ridge_stone_path', [new THREE.Vector3(-55, 0, -75), new THREE.Vector3(0, 0, -75), new THREE.Vector3(55, 0, -75)], 3.6);
  }

  private setupInteractiveProps(): void {
    const scene = this.sceneManager.scene;

    // Put the existing staff reward on the pavilion's center table. The chest
    // remains the single inventory/save-backed reward and stays interactable
    // from the floor beside the table.
    const staffChestPosition = new THREE.Vector3(20.0, this.getTerrainHeight(20.0, 24.0) + 1.56, 23.0);
    // The approach stair is on +Z; the lock and opening face that approach.
    this.staffChest = new TreasureChest(staffChestPosition, 0);
    scene.add(this.staffChest.mesh);
    this.chests.push(this.staffChest);
    // This reward chest is claimed through the contextual pickup cinematic;
    // Alohomora must not mark it opened first and bypass the hand-grab sequence.
    this.levelColliders.push(this.staffChest.mesh);

    // ── Runic Fast-Travel Portal Network (PortalPair_01) ───────────────────────
    // The existing PortalPair_01 connects this sanctuary to the Palace Atrium.
    // Manifest the temple endpoint over the center of the existing yin-yang.
    const staffPortalX = 0, staffPortalZ = -40;
    const staffPortalY = this.getTerrainHeight(staffPortalX, staffPortalZ) + 0.16;
    const portalA = new RunicPortal({
      id: 'Portal_A_StaffTemple',
      pairId: 'PortalPair_01',
      displayName: 'Santuario Central',
      position: new THREE.Vector3(staffPortalX, staffPortalY, staffPortalZ),
      rotationY: Math.PI,
      // Arrive outside the 1.45 m trigger so a return trip cannot immediately
      // bounce the player back through the same portal.
      exitPoint: new THREE.Vector3(0, this.getTerrainHeight(0, -34) + 0.05, -34),
      exitYaw: Math.PI,
      unlockedByDefault: false,
      templeStyle: true,
    }, scene, this.levelColliders);

    // Portal B: Placed at the Palace Entrance Courtyard near starting route (World: 8.0, 0.0, -12.0)
    const portalB = new RunicPortal({
      id: 'Portal_B_MapShortcut',
      pairId: 'PortalPair_01',
      displayName: 'Atrio del Palacio',
      position: new THREE.Vector3(8.0, 0.0, -12.0),
      rotationY: 0,
      exitPoint: new THREE.Vector3(8.0, 0.0, -9.2),
      exitYaw: 0,
      unlockedByDefault: false,
    }, scene, this.levelColliders);

    this.portalManager.registerPortal(portalA);
    this.portalManager.registerPortal(portalB);
    this.portalManager.linkPair(portalA, portalB);
    console.log('[LevelToyStory] ✅ Runic Portals (PortalPair_01) initialized & linked.');

    this.setupEnergyItems();
    this.loadBridgeAsset();

    // 5 Special Pots for Key 5 (Glowing red effect)
    const specialPotPositions = [
      new THREE.Vector3(-10, 0, 5),     // Near start
      new THREE.Vector3(-20, 0, -50),   // Far left field
      new THREE.Vector3(18, this.getTerrainHeight(18, -48), -48),  // East route beside the temple
      new THREE.Vector3(45, 0, -10),    // North of boss arena
      new THREE.Vector3(-18, this.getTerrainHeight(-18, -48), -48)  // West temple approach
    ];

    specialPotPositions.forEach((pos) => {
      const pot = new DestructiblePot(pos, scene);
      
      // Make special pots look distinct (red emissive highlights)
      const mat = (pot.mesh.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color.setHex(0xa13333);
        mat.emissive.setHex(0x551111);
        mat.emissiveIntensity = 0.6;
      }
      
      this.pots.push(pot);
      this.spellSystem.registerPot(pot);
      this.levelColliders.push(pot.mesh);

      // Bind destruction event
      pot.onDestruct = () => {
        this.specialPotsSmashed++;
        this.audioManager.playPotionPickup(); // Reuse sound
        this.subtitleSystem.show('Sistema', `¡Gema corrupta destruida! (${this.specialPotsSmashed}/${this.totalSpecialPots})`);
        
        if (this.specialPotsSmashed >= this.totalSpecialPots) {
          this.powerOrbSystem?.spawn(new THREE.Vector3(pos.x, pos.y + 0.25, pos.z), 75);
          this.awardKey('key5_pots', new THREE.Vector3(pos.x, pos.y + 0.5, pos.z));
        }
      };
    });

    // Setup 4 Lumos Gargoyles
    const gargoyleConfigs = [
      { pos: new THREE.Vector3(-12, 0, -25), platforms: [] },
      { pos: new THREE.Vector3(12, 0, -48), platforms: [] },
      { pos: new THREE.Vector3(-10, this.getTerrainHeight(-10, -48), -48), platforms: [] },
      { pos: new THREE.Vector3(30, 0, -15), platforms: [] }
    ];

    gargoyleConfigs.forEach(conf => {
      const gargoyle = new LumosGargoyle(conf.pos, scene, conf.platforms);
      this.gargoyles.push(gargoyle);
      this.spellSystem.registerGargoyle(gargoyle);
      
      // Override or inspect interaction
      const originalActivate = gargoyle.activateLumos;
      gargoyle.activateLumos = (audio, colliders) => {
        if (gargoyle.isLit) return;
        originalActivate.call(gargoyle, audio, colliders);
        this.litGargoylesCount++;
        this.subtitleSystem.show('Sistema', `Gárgola iluminada (${this.litGargoylesCount}/4)`);
        
        if (this.litGargoylesCount >= 4) {
          this.awardKey('key6_gargoyles', new THREE.Vector3(0, 0.5, -35)); // Spawns inside castle entrance
        }
      };
    });
  }

  private setupCheckpoints(): void {
    this.checkpointManager.addCheckpoint(0, new THREE.Vector3(0, 0.2, 10), Math.PI); // Spawn
    this.checkpointManager.addCheckpoint(1, new THREE.Vector3(0, 0.2, -22), Math.PI); // Castle Entrance
    this.checkpointManager.addCheckpoint(2, new THREE.Vector3(20, this.getTerrainHeight(20, 18) + 0.2, 18), Math.PI); // Pavilion approach
    this.checkpointManager.addCheckpoint(3, new THREE.Vector3(-55, this.getTerrainHeight(-55, -68) + 0.2, -68), Math.PI); // West ridge pavilion
    this.checkpointManager.addCheckpoint(4, new THREE.Vector3(30, 0.2, -40), Math.PI * 0.5); // Boss Arena Entrance
    this.checkpointManager.addCheckpoint(7, new THREE.Vector3(46.5, this.getTerrainHeight(46.5, -82) + 0.2, -82), Math.PI * 0.5); // Before dragon fire corridor
    this.checkpointManager.addCheckpoint(5, new THREE.Vector3(57, -7.35, -94), Math.PI * 0.5); // Secret lava entry
    this.checkpointManager.addCheckpoint(6, new THREE.Vector3(67, -7.35, -102), Math.PI * 0.5); // Midway lava platform
  }

  private energyItems: THREE.Group[] = [];
  private applePickupTemplate: THREE.Object3D | null = null;
  private pendingAppleDrops: Array<{ position: THREE.Vector3; direction: THREE.Vector3 }> = [];
  private treeReactionTrees: THREE.Vector3[] = [];
  private treeSwayTimers: number[] = [];
  private treeInstanceBatches: Array<{ mesh: THREE.InstancedMesh; baseMatrices: THREE.Matrix4[] }> = [];
  private treeLeafPool: Array<{ mesh: THREE.Mesh; velocity: THREE.Vector3; age: number; lifetime: number }> = [];
  private treeLeafCursor = 0;
  private appleDropAnimations: Array<{ group: THREE.Group; from: THREE.Vector3; to: THREE.Vector3; elapsed: number; duration: number; arcHeight: number }> = [];
  private appleSparkles: Array<{ mesh: THREE.InstancedMesh; phase: number }> = [];
  private appleSparkleGeometry = new THREE.SphereGeometry(0.035, 6, 5);
  private appleSparkleMaterial = new THREE.MeshBasicMaterial({ color: 0xffd76b, toneMapped: false });
  private readonly appleSparkleDummy = new THREE.Object3D();
  private treeRewardUsed = new Set<string>();
  private treeRewards: Array<'apple' | 'snake' | null> = [];
  public treeSnakes: TreeSnakeEnemy[] = [];
  private bridgeAsset: THREE.Object3D | null = null;
  private bridgeWaterUniforms: { uTime: { value: number } } | null = null;

  private setupEnergyItems(): void {
    const scene = this.sceneManager.scene;

    const energySpots = [
      new THREE.Vector3(-15, 0, -20),
      new THREE.Vector3(15, 0, -20),
      new THREE.Vector3(-55, 0, -65),
      new THREE.Vector3(55, 0, -65),
      new THREE.Vector3(-30, 0, -35),
      new THREE.Vector3(30, 0, -35),
      new THREE.Vector3(0, 0, -45),
      new THREE.Vector3(18.0, 0, -46.0), // East approach, ground level
    ];

    energySpots.forEach((spot, idx) => {
      const y = spot.y > 2.0 ? spot.y : this.getTerrainHeight(spot.x, spot.z) + 0.45;
      const group = new THREE.Group();
      group.position.set(spot.x, y, spot.z);
      group.visible = false; // Show the supplied scan as soon as its shared GLB is ready.
      group.name = `energy_item_${idx}`;
      scene.add(group);
      this.energyItems.push(group);
    });
    const loader = new GLTFLoader();
    loader.load(
      import.meta.env.BASE_URL + `assets/environment/wukong-apple-celestial-original.glb?v=${__APP_VERSION__}`,
      (gltf) => {
        this.applePickupTemplate = gltf.scene;
        this.applePickupTemplate.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(this.applePickupTemplate);
        const size = bounds.getSize(new THREE.Vector3());
        const targetHeight = 0.62;
        const scale = targetHeight / Math.max(size.y, size.x, size.z, 0.0001);
        this.energyItems.forEach((group) => {
          const apple = this.applePickupTemplate!.clone(true);
          this.prepareAppleMaterials(apple);
          apple.scale.setScalar(scale);
          apple.position.y = -bounds.min.y * scale;
          group.add(apple);
          this.addAppleSparkles(group);
          group.visible = true;
        });
        for (const drop of this.pendingAppleDrops.splice(0)) this.spawnCelestialApple(drop.position, drop.direction);
      },
      undefined,
      (error) => console.error('[LevelToyStory] Failed to load Apple 3D Photo Scan pickup asset', error)
    );

    this.createTreeLeafPool();
  }

  private updateTreeReactions(delta: number, weatherDelta = delta): void {
    const now = performance.now() * 0.001;
    const wind = this.worldWind.update(weatherDelta, this.dayNightCycle?.hour ?? 21);
    if (wind.gustStarted) this.spawnWindLeafBurst(wind.direction);
    for (let i = this.appleDropAnimations.length - 1; i >= 0; i--) {
      const drop = this.appleDropAnimations[i];
      drop.elapsed = Math.min(drop.duration, drop.elapsed + delta);
      const t = drop.elapsed / drop.duration;
      const eased = t * t * (3 - 2 * t);
      drop.group.position.lerpVectors(drop.from, drop.to, eased);
      drop.group.position.y += Math.sin(t * Math.PI) * drop.arcHeight;
      if (t >= 1) this.appleDropAnimations.splice(i, 1);
    }
    for (const sparkle of this.appleSparkles) {
      if (!sparkle.mesh.parent?.visible) continue;
      const time = now * 1.4 + sparkle.phase;
      for (let i = 0; i < sparkle.mesh.count; i++) {
        const angle = time + i * Math.PI * 2 / sparkle.mesh.count;
        const radius = 0.45 + 0.08 * Math.sin(time * 1.7 + i);
        this.appleSparkleDummy.position.set(Math.cos(angle) * radius, 0.32 + 0.18 * Math.sin(time * 1.9 + i * 1.3), Math.sin(angle) * radius);
        const scale = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * 2.4 + i));
        this.appleSparkleDummy.scale.setScalar(scale);
        this.appleSparkleDummy.updateMatrix();
        sparkle.mesh.setMatrixAt(i, this.appleSparkleDummy.matrix);
      }
      sparkle.mesh.instanceMatrix.needsUpdate = true;
    }
    for (const leaf of this.treeLeafPool) {
      if (!leaf.mesh.visible) continue;
      leaf.age += delta;
      if (leaf.age >= leaf.lifetime) { leaf.mesh.visible = false; continue; }
      leaf.velocity.y -= 3.3 * delta;
      leaf.mesh.position.addScaledVector(leaf.velocity, delta);
      leaf.mesh.rotation.x += delta * 2.4;
      leaf.mesh.rotation.y += delta * 1.8;
      (leaf.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - leaf.age / leaf.lifetime;
    }

    for (let i = 0; i < this.treeSwayTimers.length; i++) {
      let timer = this.treeSwayTimers[i];
      const root = this.treeReactionTrees[i];
      if (!root) continue;
      if (timer >= 0) {
        timer = timer - delta;
        if (timer <= 0) timer = -1;
        this.treeSwayTimers[i] = timer;
      }
      const hitEnvelope = timer >= 0 ? Math.sin(Math.PI * (1 - timer / 1.15)) : 0;
      const windPhase = now * 0.72 + root.x * 0.047 + root.z * 0.031 + i * 1.37;
      const ambientSway = Math.sin(windPhase) * wind.intensity * 0.035;
      const sway = ambientSway + Math.sin(now * 12 + i * 2.1) * 0.075 * hitEnvelope;
      const pivot = this.treeSwayPivot.makeTranslation(root.x, root.y, root.z);
      const unpivot = this.treeSwayUnpivot.makeTranslation(-root.x, -root.y, -root.z);
      const rotation = this.treeSwayRotation.makeRotationFromEuler(
        this.treeSwayEuler.set(sway, Math.sin(windPhase * 0.65) * wind.intensity * 0.008 + Math.sin(now * 7 + i) * 0.018 * hitEnvelope, -sway * 0.55)
      );
      for (const batch of this.treeInstanceBatches) {
        const transformed = this.treeSwayTransform.copy(pivot).multiply(rotation).multiply(unpivot).multiply(batch.baseMatrices[i]);
        batch.mesh.setMatrixAt(i, transformed);
      }
    }
    // Only a small set of authored tree instances is transformed, with shared
    // scratch matrices and no per-frame allocations. Their phase differs by
    // position so a breeze does not move every crown in sync.
    this.treeInstanceBatches.forEach(({ mesh }) => { mesh.instanceMatrix.needsUpdate = true; });
  }

  private spawnWindLeafBurst(windDirection: THREE.Vector2): void {
    if (!this.treeReactionTrees.length || !this.player?.mesh) return;
    const playerPos = this.player.mesh.position;
    const yaw = this.player.mesh.rotation.y;
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    let source: THREE.Vector3 | null = null;
    let bestDistance = 22;
    for (const tree of this.treeReactionTrees) {
      const dx = tree.x - playerPos.x;
      const dz = tree.z - playerPos.z;
      const distance = Math.hypot(dx, dz);
      if (distance >= bestDistance || distance < 2) continue;
      const ahead = (forward.x * dx + forward.z * dz) / distance;
      if (ahead < 0.18) continue;
      bestDistance = distance;
      source = tree;
    }
    // Emit only when a real, nearby canopy is ahead of the player. Do not
    // invent particles in open sky or across buildings from arbitrary points.
    if (!source) return;

    const count = isLowPowerDevice() ? 4 : 7;
    for (let i = 0; i < count; i++) {
      const leaf = this.treeLeafPool[this.treeLeafCursor++ % this.treeLeafPool.length];
      leaf.mesh.visible = true;
      leaf.mesh.position.set(
        source.x + (Math.random() - 0.5) * 2.8,
        source.y + 3.1 + Math.random() * 2.5,
        source.z + (Math.random() - 0.5) * 2.8
      );
      leaf.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      leaf.mesh.scale.setScalar(0.55 + Math.random() * 0.42);
      const alongWind = 1.2 + Math.random() * 1.35;
      const crossFlow = 0.35 + Math.random() * 0.65;
      leaf.velocity.set(
        windDirection.x * alongWind + forward.x * crossFlow,
        0.25 + Math.random() * 0.55,
        windDirection.y * alongWind + forward.z * crossFlow
      );
      leaf.age = 0;
      leaf.lifetime = 2.8 + Math.random() * 1.3;
    }
  }

  private createTreeLeafPool(): void {
    if (this.treeLeafPool.length) return;
    const scene = this.sceneManager.scene;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.13); shape.quadraticCurveTo(0.1, 0.05, 0.07, -0.07);
    shape.quadraticCurveTo(0, -0.16, -0.07, -0.07); shape.quadraticCurveTo(-0.1, 0.05, 0, 0.13);
    const geometry = new THREE.ShapeGeometry(shape, 4);
    const colors = [0xf4b6d3, 0xffdceb, 0xdcb9ef, 0xe994c1];
    for (let i = 0; i < 28; i++) {
      const material = new THREE.MeshBasicMaterial({ color: colors[i % colors.length], side: THREE.DoubleSide, transparent: true, opacity: 0.92, depthWrite: false });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      scene.add(mesh);
      this.treeLeafPool.push({ mesh, velocity: new THREE.Vector3(), age: 0, lifetime: 1.6 });
    }
  }

  /** Called at the actual contact frame of Wukong's ground kick. */
  public reactToTreeKick(playerPos: THREE.Vector3, forward: THREE.Vector3): void {
    let treeIndex = -1;
    let bestDistance = 2.75;
    for (let i = 0; i < this.treeReactionTrees.length; i++) {
      const tree = this.treeReactionTrees[i];
      const dx = tree.x - playerPos.x, dz = tree.z - playerPos.z;
      const distance = Math.hypot(dx, dz);
      if (distance >= bestDistance || distance < 0.001) continue;
      const facing = (forward.x * dx + forward.z * dz) / distance;
      if (facing > -0.12) { treeIndex = i; bestDistance = distance; }
    }
    if (treeIndex < 0) return;

    this.treeSwayTimers[treeIndex] = 1.15;
    const tree = this.treeReactionTrees[treeIndex];
    for (let n = 0; n < 10; n++) {
      const leaf = this.treeLeafPool[this.treeLeafCursor++ % this.treeLeafPool.length];
      leaf.mesh.visible = true;
      leaf.mesh.position.set(tree.x + (Math.random() - 0.5) * 1.25, tree.y + 1.5 + Math.random() * 2.2, tree.z + (Math.random() - 0.5) * 1.25);
      leaf.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      leaf.mesh.scale.setScalar(0.75 + Math.random() * 0.8);
      leaf.velocity.set((Math.random() - 0.5) * 1.5, 1.1 + Math.random() * 1.2, (Math.random() - 0.5) * 1.5);
      leaf.age = 0;
      leaf.lifetime = 1.35 + Math.random() * 0.7;
    }

    // Selected trees grant one surprise on their first kick. Other pines only
    // sway and shed leaves, so rewards cannot be farmed indefinitely.
    const reward = this.treeRewards[treeIndex];
    const rewardKey = `${Math.round(tree.x)},${Math.round(tree.z)}`;
    if (!reward || this.treeRewardUsed.has(rewardKey)) return;
    this.treeRewardUsed.add(rewardKey);
    if (reward === 'apple') {
      const away = new THREE.Vector3(tree.x - playerPos.x, 0, tree.z - playerPos.z);
      if (away.lengthSq() < 0.001) away.set(forward.x, 0, forward.z);
      away.normalize();
      this.spawnCelestialApple(tree, away);
      this.subtitleSystem.show('Árbol celestial', '¡Una Manzana Celestial cayó del árbol!');
    } else {
      const snake = new TreeSnakeEnemy(tree.clone(), this.sceneManager.scene);
      this.treeSnakes.push(snake);
      this.player.reactToSnakeAmbush(() => snake.startFall());
      this.subtitleSystem.show('¡Sorpresa!', 'Una serpiente cayó del árbol y va tras Wukong.');
    }
  }

  private spawnCelestialApple(position: THREE.Vector3, awayFromPlayer = new THREE.Vector3(0, 0, 1)): void {
    const direction = awayFromPlayer.clone().setY(0);
    if (direction.lengthSq() < 0.001) direction.set(0, 0, 1);
    direction.normalize();
    if (!this.applePickupTemplate) { this.pendingAppleDrops.push({ position: position.clone(), direction }); return; }
    const group = new THREE.Group();
    group.name = 'dropped_celestial_apple';
    const landingX = position.x + direction.x * 1.75;
    const landingZ = position.z + direction.z * 1.75;
    const landingY = this.getTerrainHeight(landingX, landingZ) + 0.46;
    const from = new THREE.Vector3(position.x, this.getTerrainHeight(position.x, position.z) + 2.8, position.z);
    const to = new THREE.Vector3(landingX, landingY, landingZ);
    group.position.copy(from);
    const apple = this.applePickupTemplate.clone(true);
    this.applePickupTemplate.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(this.applePickupTemplate);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 0.62 / Math.max(size.x, size.y, size.z, 0.0001);
    this.prepareAppleMaterials(apple);
    apple.scale.setScalar(scale);
    apple.position.y = -bounds.min.y * scale;
    group.add(apple);
    this.addAppleSparkles(group);
    this.sceneManager.scene.add(group);
    this.energyItems.push(group);
    this.appleDropAnimations.push({ group, from, to, elapsed: 0, duration: 0.82, arcHeight: 0.72 });
  }

  private prepareAppleMaterials(root: THREE.Object3D): void {
    root.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const enhanced = materials.map((source) => {
        const material = source.clone();
        if ('emissive' in material) {
          (material as THREE.MeshStandardMaterial).emissive.set(0xffa91a);
          (material as THREE.MeshStandardMaterial).emissiveIntensity = 0.62;
        }
        return material;
      });
      mesh.material = Array.isArray(mesh.material) ? enhanced : enhanced[0];
    });
  }

  private addAppleSparkles(group: THREE.Group): void {
    const sparkle = new THREE.InstancedMesh(this.appleSparkleGeometry, this.appleSparkleMaterial, 5);
    sparkle.name = 'celestial_apple_sparkles';
    sparkle.frustumCulled = true;
    sparkle.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0.2, 0), 0.9);
    const colors = [0xffdf74, 0x7fffe0, 0xff8ce8, 0xa7dcff, 0xffa25e];
    for (let i = 0; i < sparkle.count; i++) sparkle.setColorAt(i, new THREE.Color(colors[i]));
    group.add(sparkle);
    this.appleSparkles.push({ mesh: sparkle, phase: Math.random() * Math.PI * 2 });
  }

  private disposeAppleVisual(group: THREE.Group): void {
    this.appleSparkles = this.appleSparkles.filter(({ mesh }) => mesh.parent !== group);
    group.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || mesh instanceof THREE.InstancedMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) material.dispose();
    });
  }

  public damageTreeSnakes(origin: THREE.Vector3, forward: THREE.Vector3, reach: number, damage: number): void {
    for (let i = this.treeSnakes.length - 1; i >= 0; i--) {
      const snake = this.treeSnakes[i];
      if (!snake.isAlive()) { snake.dispose(); this.treeSnakes.splice(i, 1); continue; }
      const target = snake.getPosition();
      const delta = target.clone().sub(origin);
      const distance = delta.length();
      delta.y = 0;
      if (distance <= reach && (delta.lengthSq() < 0.001 || forward.dot(delta.normalize()) > 0.15)) {
        snake.takeHit(damage, origin, forward);
        if (!snake.isAlive()) { snake.dispose(); this.treeSnakes.splice(i, 1); }
      }
    }
  }

  private loadBridgeAsset(): void {
    if (this.bridgeAsset) return;
    new GLTFLoader().load(import.meta.env.BASE_URL + `assets/environment/wukong-bridge-original.glb?v=${__APP_VERSION__}`, (gltf) => {
      const source = gltf.scene;
      source.name = 'A_bridge_original_asset_source';
      source.updateMatrixWorld(true);
      const sourceBounds = new THREE.Box3().setFromObject(source);
      const sourceSize = sourceBounds.getSize(new THREE.Vector3());
      const scale = 9.5 / Math.max(sourceSize.x, sourceSize.z, 0.0001);
      const deckSource = source.getObjectByName('bridge_mesh_3') as THREE.Mesh | null;
      const sourceMaterial = deckSource?.material;
      const woodMaterial = (Array.isArray(sourceMaterial) ? sourceMaterial[0] : sourceMaterial)?.clone() as THREE.MeshStandardMaterial | undefined;
      if (!deckSource?.isMesh || !woodMaterial) {
        console.error('[LevelToyStory] Original A bridge lacks the exported timber deck mesh/material');
        return;
      }

      // The supplied GLB contains the authored wood plank and texture but the
      // deck is exported as one loose board, with a thin curve and no complete
      // rail assembly. Repeat that real plank as an instanced arched deck and
      // finish the missing red lacquer rails/supports in the same wood finish.
      const deckGeometry = deckSource.geometry.clone();
      deckGeometry.computeBoundingBox();
      const deckCenter = deckGeometry.boundingBox!.getCenter(new THREE.Vector3());
      deckGeometry.translate(-deckCenter.x, -deckCenter.y, -deckCenter.z);
      deckGeometry.scale(scale * 1.38, scale, scale);
      woodMaterial.color.set(0xd2aa79);
      woodMaterial.roughness = Math.max(0.72, woodMaterial.roughness);
      woodMaterial.metalness = 0;
      woodMaterial.side = THREE.DoubleSide;
      woodMaterial.needsUpdate = true;

      const bridge = new THREE.Group();
      bridge.name = 'A_bridge_original_asset';
      const bridgeX = -41.5, bridgeZ = -63;
      const bridgeYaw = Math.atan2(13, 10);
      const halfSpan = 5.7;
      const axisX = Math.sin(bridgeYaw), axisZ = Math.cos(bridgeYaw);
      const lowEnd = this.getTerrainHeight(bridgeX - axisX * halfSpan, bridgeZ - axisZ * halfSpan);
      const highEnd = this.getTerrainHeight(bridgeX + axisX * halfSpan, bridgeZ + axisZ * halfSpan);
      const grade = (highEnd - lowEnd) / (halfSpan * 2);
      bridge.position.set(bridgeX, (lowEnd + highEnd) * 0.5, bridgeZ);
      // The local deck profile already follows the grade; only rotate it into
      // the route direction so slope is not applied twice.
      bridge.rotation.y = bridgeYaw;

      const deckHeight = (z: number) => grade * z + 0.82 * (1 - (z * z) / (halfSpan * halfSpan));
      const deckCount = 55;
      const deck = new THREE.InstancedMesh(deckGeometry, woodMaterial, deckCount);
      deck.name = 'bridge_arched_deck_original_wood_instanced';
      deck.castShadow = true;
      deck.receiveShadow = true;
      const dummy = new THREE.Object3D();
      for (let i = 0; i < deckCount; i++) {
        const z = -halfSpan + ((i + 0.5) / deckCount) * (halfSpan * 2);
        const slope = grade - (1.64 * z) / (halfSpan * halfSpan);
        dummy.position.set(0, deckHeight(z), z);
        dummy.rotation.set(-Math.atan(slope), 0, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        deck.setMatrixAt(i, dummy.matrix);
      }
      deck.instanceMatrix.needsUpdate = true;
      bridge.add(deck);

      const railMaterial = woodMaterial.clone();
      railMaterial.color.set(0x783125);
      railMaterial.roughness = 0.78;
      const topRailMaterial = woodMaterial.clone();
      topRailMaterial.color.set(0x9b4b32);
      topRailMaterial.roughness = 0.72;
      const railHalfWidth = 1.18;
      const railHeight = 0.92;
      const railCurvePoints = (side: number, lift: number) => Array.from({ length: 25 }, (_, i) => {
        const z = -halfSpan + (i / 24) * (halfSpan * 2);
        return new THREE.Vector3(side * railHalfWidth, deckHeight(z) + lift, z);
      });
      for (const side of [-1, 1]) {
        const upper = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railCurvePoints(side, railHeight)), 56, 0.105, 8, false),
          topRailMaterial,
        );
        upper.name = `bridge_lacquered_arch_handrail_${side}`;
        upper.castShadow = true;
        upper.receiveShadow = true;
        bridge.add(upper);
        const lower = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railCurvePoints(side, 0.22)), 56, 0.06, 6, false),
          railMaterial,
        );
        lower.name = `bridge_lower_rail_${side}`;
        lower.castShadow = true;
        bridge.add(lower);

        const posts = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.84, 0.13), railMaterial, 9);
        posts.name = `bridge_balusters_${side}`;
        posts.castShadow = true;
        posts.receiveShadow = true;
        for (let i = 0; i < 9; i++) {
          const z = -halfSpan + 0.2 + (i / 8) * (halfSpan * 2 - 0.4);
          const slope = grade - (1.64 * z) / (halfSpan * halfSpan);
          dummy.position.set(side * railHalfWidth, deckHeight(z) + 0.48, z);
          dummy.rotation.set(-Math.atan(slope), 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          posts.setMatrixAt(i, dummy.matrix);
        }
        posts.instanceMatrix.needsUpdate = true;
        bridge.add(posts);
      }

      const stringerMaterial = railMaterial.clone();
      stringerMaterial.color.set(0x4f261e);
      for (const side of [-1, 1]) {
        const points = Array.from({ length: 21 }, (_, i) => {
          const z = -halfSpan + (i / 20) * (halfSpan * 2);
          return new THREE.Vector3(side * 0.98, deckHeight(z) - 0.17, z);
        });
        const stringer = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, 0.12, 8, false),
          stringerMaterial,
        );
        stringer.name = `bridge_arch_stringer_${side}`;
        stringer.castShadow = true;
        stringer.receiveShadow = true;
        bridge.add(stringer);
      }

      // Curved mesh collider makes the feet follow the actual arch instead of
      // snapping into a flat box or sinking through gaps between the planks.
      // Keep the walk surface front-sided with upward-facing triangles so the
      // player's downward ground ray can land on it. Rail proxies use a
      // separate double-sided material because they are approached from both
      // sides and are tested as actual meshes (not broad world AABBs).
      const walkSurfaceMaterial = new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: false,
        side: THREE.FrontSide,
      });
      const railCollisionMaterial = new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const positions: number[] = [];
      const indices: number[] = [];
      const steps = 32;
      for (let i = 0; i <= steps; i++) {
        const z = -halfSpan + (i / steps) * (halfSpan * 2);
        const y = deckHeight(z) + 0.045;
        positions.push(-1.14, y, z, 1.14, y, z);
        if (i < steps) {
          const a = i * 2;
          // Vertex order is left/right at each increasing Z station. The old
          // winding produced downward normals, so the feet ray skipped this
          // deck and Wukong fell through to the terrain below.
          indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
        }
      }
      const walkGeometry = new THREE.BufferGeometry();
      walkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      walkGeometry.setIndex(indices);
      walkGeometry.computeVertexNormals();
      const deckCollider = new THREE.Mesh(walkGeometry, walkSurfaceMaterial);
      deckCollider.name = 'bridge_curved_walkable_deck_collider';
      deckCollider.userData.walkableSurface = true;
      deckCollider.userData.walkableSupport = true;
      bridge.add(deckCollider);

      source.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) material.dispose();
      });

      // Curved sidewall colliders follow the arched deck, blocking walks through
      // the rails without placing a flat invisible wall across the approach.
      for (const side of [-1, 1]) {
        const wallPositions: number[] = [];
        const wallIndices: number[] = [];
        const wallSegments = 32;
        for (let i = 0; i <= wallSegments; i++) {
          const z = -halfSpan + (i / wallSegments) * (halfSpan * 2);
          const xInner = side * (railHalfWidth - 0.07);
          const xOuter = side * (railHalfWidth + 0.07);
          const bottom = deckHeight(z) + 0.08;
          const top = deckHeight(z) + 0.84;
          wallPositions.push(xInner, bottom, z, xOuter, bottom, z, xInner, top, z, xOuter, top, z);
          if (i < wallSegments) {
            const a = i * 4, b = a + 4;
            wallIndices.push(a, b, a + 2, b, b + 2, a + 2, a + 1, a + 3, b + 1, b + 1, a + 3, b + 3);
          }
        }
        const wallGeometry = new THREE.BufferGeometry();
        wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
        wallGeometry.setIndex(wallIndices);
        wallGeometry.computeVertexNormals();
        const railCollider = new THREE.Mesh(wallGeometry, railCollisionMaterial);
        railCollider.name = `bridge_solid_side_${side}`;
        // Do not feed these rotated, elongated meshes to the generic blocker
        // AABB sweep: its axis-aligned bounds cover the bridge approaches and
        // create an invisible gate across the deck. The real rail mesh remains
        // in the raycast collider set, preserving the handrail limits.
        bridge.add(railCollider);
      }

      this.sceneManager.scene.add(bridge);
      this.bridgeAsset = bridge;
      const center = new THREE.Vector3(bridgeX, 0, bridgeZ);
      const playerPosition = this.player.mesh.position;
      const dx = playerPosition.x - bridgeX, dz = playerPosition.z - bridgeZ;
      const active = dx * dx + dz * dz <= 18 * 18;
      this.structureColliderCandidates.push({ root: bridge, center, radius: 18, active });
      if (active) {
        this.levelColliders.push(bridge);
        this.player.setColliders(this.levelColliders);
        this.cameraController.setCollisionObjects(this.levelColliders);
      }
    }, undefined, (error) => console.error('[LevelToyStory] Failed to load original A bridge asset', error));
  }

  private setupCollectibles(): void {
    const coinPositions: THREE.Vector3[] = [];

    // 1. Main Entrance Pathway (12 coins leading from Wukong spawn up to castle gate)
    for (let i = 0; i < 12; i++) {
      coinPositions.push(new THREE.Vector3(0, 0.6, 9.0 - i * 2.8));
    }

    // 2. Ground Floor Atrium & Hall (14 coins)
    for (let x = -6; x <= 6; x += 3) {
      for (let z = -46; z <= -34; z += 4) {
        if (x !== 0 || z !== -40) {
          coinPositions.push(new THREE.Vector3(x, 0.8, z));
        }
      }
    }

    // 3. Grand East Staircase ascending to Mezzanine (6 coins)
    for (let i = 0; i < 6; i++) {
      const x = 9.2;
      const z = -29.0 - i * 2.6;
      coinPositions.push(new THREE.Vector3(x, this.getTerrainHeight(x, z) + 0.6, z));
    }

    // 4. Four exterior rear/side approach coins move below ground into the
    // crypt. They retain coin_38..coin_41, while the temple interior coins and
    // the separate eight cabin coins keep their original positions and IDs.
    [
      [-15.5, -5.3, -49.0], // crypt entry side
      [-23.0, -5.3, -31.5], // central north lane
      [-23.0, -5.3, -48.5], // central south lane
      [-32.0, -5.3, -44.8], // altar approach
    ].forEach(([x, y, z]) => coinPositions.push(new THREE.Vector3(x, y, z)));
    // Remaining temple-side exterior route positions.
    [[4, -48], [9.2, -44], [4, -34], [-4, -34]].forEach(([x, z]) => {
      coinPositions.push(new THREE.Vector3(x, this.getTerrainHeight(x, z) + 0.6, z));
    });

    // 5. West/east ground approaches replace the removed rooftop path.
    for (let i = 0; i < 4; i++) {
      const x = 7.0 - i * 3.0;
      const z = -53.0 - i * 2.0;
      coinPositions.push(new THREE.Vector3(x, this.getTerrainHeight(x, z) + 0.6, z));
    }
    [[-3, -58], [3, -58]].forEach(([x, z]) => coinPositions.push(new THREE.Vector3(x, this.getTerrainHeight(x, z) + 0.6, z)));

    // 6. Boss Arena & East Garden Pathway (6 coins)
    coinPositions.push(new THREE.Vector3(18.0, 0.6, -35.0));
    coinPositions.push(new THREE.Vector3(26.0, 0.6, -38.0));
    coinPositions.push(new THREE.Vector3(34.0, 0.6, -40.0));
    coinPositions.push(new THREE.Vector3(42.0, 0.6, -35.0));
    coinPositions.push(new THREE.Vector3(48.0, 0.6, -42.0));
    coinPositions.push(new THREE.Vector3(42.0, 0.6, -46.0));

    // Ensure clean state before spawning
    this.collectibleSystem.clearAll();

    const EXPECTED_LISAR_COINS = 50;
    const rawCoins = coinPositions.slice(0, EXPECTED_LISAR_COINS);

    // Pad deterministically if needed
    let seed = 12345;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    while (rawCoins.length < EXPECTED_LISAR_COINS) {
      const rx = (pseudoRandom() - 0.5) * 60;
      const rz = -15 - pseudoRandom() * 50;
      rawCoins.push(new THREE.Vector3(rx, 0.6, rz));
    }

    // Keep the existing 50-coin quest total. Five cabin coins remain on the
    // ground floor and three of these same coin instances reward exploring
    // the second storey; no collectible IDs or persistence totals are added.
    const houseCoinY = this.getAbandonedHouseFloorTopY() + 0.02;
    const houseUpperCoinY = this.getAbandonedHouseUpperFloorTopY() + 0.02;
    const highHouseCoins = [
      [34, -88, houseCoinY], [38, -88, houseCoinY], [42, -88, houseCoinY],
      [34, -92, houseCoinY], [42, -92, houseCoinY],
      [39.2, -96, houseUpperCoinY], [40.3, -94, houseUpperCoinY], [42, -92, houseUpperCoinY]
    ].map(([x, z, y]) => new THREE.Vector3(x, y, z));
    rawCoins.splice(rawCoins.length - highHouseCoins.length, highHouseCoins.length, ...highHouseCoins);

    // ── AUTOMATED COIN POSITION VALIDATION & COLLISION CHECKER ──
    const coinColliderBounds: Array<{ root: THREE.Object3D; bounds: THREE.Box3 }> = [];
    for (const root of this.levelColliders) {
      root.updateWorldMatrix(true, true);
      root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || mesh.userData.solidPlayerBlocker !== true) return;
        coinColliderBounds.push({ root: mesh, bounds: new THREE.Box3().setFromObject(mesh) });
      });
    }
    const coinRaycaster = new THREE.Raycaster();
    const coinDirections = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1)
    ];
    const validateCoinPosition = (pos: THREE.Vector3): { position: THREE.Vector3; corrected: boolean; pendingReview: boolean } => {
      const checkedPos = pos.clone();
      let corrected = false;

      // Use the raised stone plane for temple coins; all other route coins
      // remain attached to the natural terrain surface.
      const templeFloorY = this.centralTempleFloorTopY;
      const templeHalfWidth = this.centralTempleFloorWidth * 0.5;
      const templeHalfDepth = this.centralTempleFloorDepth * 0.5;
      if (templeFloorY !== null && Math.abs(checkedPos.x) <= templeHalfWidth &&
          checkedPos.z >= this.centralTempleFloorCenterZ - templeHalfDepth &&
          checkedPos.z <= this.centralTempleFloorCenterZ + templeHalfDepth) {
        checkedPos.y = templeFloorY + 0.6;
      } else if (checkedPos.x >= -36.5 && checkedPos.x <= -8.0 &&
                 checkedPos.z >= -53.0 && checkedPos.z <= -27.0 &&
                 checkedPos.y < -4.0) {
        // Crypt coins sit at a fixed authored height above the underground
        // stone floor; never project them back onto the terrain roof.
        checkedPos.y = this.curiosityCryptFloorY + 0.6;
      } else if (Math.abs(checkedPos.x - this.highHouseCenter.x) < 7.5 &&
                 Math.abs(checkedPos.z - this.highHouseCenter.z) < 8.5) {
        const houseUpperFloor = this.getAbandonedHouseUpperFloorTopY();
        checkedPos.y = checkedPos.y > houseUpperFloor - 0.8
          ? houseUpperFloor + 0.02
          : this.getAbandonedHouseFloorTopY() + 0.02;
      } else {
        checkedPos.y = this.getTerrainHeight(checkedPos.x, checkedPos.z) + 0.6;
      }

      // 2. Horizontal Wall Collision Test (Cast rays in 4 cardinal directions to ensure no clipping inside walls)
      // Reuse broad-phase bounds and the raycaster; do not raycast unrelated
      // architecture (or the whole map) for every coin candidate.
      for (let attempt = 0; attempt < 3; attempt++) {
        let moved = false;
        const nearby = coinColliderBounds
          .filter(({ bounds }) => bounds.distanceToPoint(checkedPos) <= 0.9)
          .map(({ root }) => root);
        for (const dir of coinDirections) {
          coinRaycaster.set(checkedPos, dir);
          coinRaycaster.far = 0.42;
          const hit = coinRaycaster.intersectObjects(nearby, true)[0];
          if (!hit) continue;
          const hitNorm = hit.face?.normal?.clone() ?? dir.clone().negate();
          hitNorm.transformDirection(hit.object.matrixWorld);
          hitNorm.y = 0;
          if (hitNorm.lengthSq() < 0.001) hitNorm.copy(dir).negate();
          hitNorm.normalize();
          checkedPos.addScaledVector(hitNorm, 0.55);
          corrected = true;
          moved = true;
        }
        if (!moved) break;
      }

      // A remaining solid AABB intersection is a review case, never silently
      // accepted as a successful automatic correction.
      const coinRadius = 0.18;
      const coinHalfHeight = 0.18;
      const pendingReview = coinColliderBounds.some(({ bounds }) =>
        checkedPos.x + coinRadius > bounds.min.x && checkedPos.x - coinRadius < bounds.max.x &&
        checkedPos.y + coinHalfHeight > bounds.min.y && checkedPos.y - coinHalfHeight < bounds.max.y &&
        checkedPos.z + coinRadius > bounds.min.z && checkedPos.z - coinRadius < bounds.max.z
      );
      return { position: checkedPos, corrected, pendingReview };
    };

    const coinAudit = rawCoins.map((pos) => validateCoinPosition(pos));
    const finalCoins = coinAudit.map((result) => result.position);

    const correctedCoins = coinAudit.filter((result) => result.corrected).length;
    const pendingCoins = coinAudit.filter((result) => result.pendingReview).length;
    console.info(`[COINS-VALIDATION] ${finalCoins.length}/${EXPECTED_LISAR_COINS} candidates; corrected ${correctedCoins}; pending geometry review ${pendingCoins}.`);

    finalCoins.forEach((pos, idx) => {
      this.collectibleSystem.spawnCoin(`coin_${idx}`, pos);
    });

    if (import.meta.env.DEV) {
      (window as Window & { __wukongCoinAudit?: () => object }).__wukongCoinAudit = () => {
        const coinMeshes = this.collectibleSystem.collectibles.filter((item) => item.type === 'COIN');
        const obstacles: Array<{ name: string; bounds: THREE.Box3 }> = [];
        for (const root of this.levelColliders) {
          root.updateWorldMatrix(true, true);
          root.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (!mesh.isMesh || !mesh.geometry || mesh.userData.solidPlayerBlocker !== true) return;
            if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
            obstacles.push({ name: mesh.name || root.name || 'unnamed-collider', bounds: new THREE.Box3().setFromObject(mesh) });
          });
        }
        const rows = coinMeshes.map((item) => {
          const position = item.mesh.position;
          const inHouseInterior = Math.abs(position.x - this.highHouseCenter.x) < 7.5 && Math.abs(position.z - this.highHouseCenter.z) < 8.5 &&
            (Math.abs(position.y - (this.getAbandonedHouseFloorTopY() + 0.02)) < 0.35 ||
             Math.abs(position.y - (this.getAbandonedHouseUpperFloorTopY() + 0.02)) < 0.35);
          const inTempleInterior = this.centralTempleFloorTopY !== null && Math.abs(position.x) <= this.centralTempleFloorWidth * 0.5 &&
            position.z >= this.centralTempleFloorCenterZ - this.centralTempleFloorDepth * 0.5 &&
            position.z <= this.centralTempleFloorCenterZ + this.centralTempleFloorDepth * 0.5 &&
            Math.abs(position.y - (this.centralTempleFloorTopY + 0.6)) < 0.35;
          const expectedGround = this.getTerrainHeight(position.x, position.z) + 0.6;
          const unexpectedElevation = !inHouseInterior && !inTempleInterior && Math.abs(position.y - expectedGround) > 0.85;
          const coinRadius = 0.18;
          const coinHalfHeight = 0.18;
          const overlaps = obstacles.filter(({ bounds }) =>
            position.x + coinRadius > bounds.min.x && position.x - coinRadius < bounds.max.x &&
            position.y + coinHalfHeight > bounds.min.y && position.y - coinHalfHeight < bounds.max.y &&
            position.z + coinRadius > bounds.min.z && position.z - coinRadius < bounds.max.z
          ).map(({ name }) => name);
          return {
            id: item.id,
            position: { x: +position.x.toFixed(2), y: +position.y.toFixed(2), z: +position.z.toFixed(2) },
            status: overlaps.length || unexpectedElevation ? 'POTENTIAL_ISSUE' : 'GEOMETRY_CLEAR',
            overlappingColliderBounds: overlaps,
            reachability: 'not_path_tested'
          };
        });
        const report = {
          totalCoins: rows.length,
          geometricallyClear: rows.filter((row) => row.status === 'GEOMETRY_CLEAR').length,
          potentialIssues: rows.filter((row) => row.status !== 'GEOMETRY_CLEAR').length,
          correctedAtPlacement: correctedCoins,
          pendingReviewAtPlacement: pendingCoins,
          rows
        };
        console.table(rows);
        return report;
      };
    }
  }

  private setupNPCs(): void {
    // Place the model origin at the sampled terrain height; GekkoNPC aligns the GLB soles to that root.
    const gekkoY = this.getTerrainHeight(-2.8, -10);
    this.gekkoNPC = new GekkoNPC(new THREE.Vector3(-2.8, gekkoY, -10), -Math.PI * 0.25);
    this.gekkoModelsReady = this.gekkoNPC.loadModels();
    this.sceneManager.scene.add(this.gekkoNPC.mesh);

    // Gekko's physical collider (prevents Wukong from passing through Gekko)
    const gekkoCollider = new THREE.Mesh(
      new THREE.CylinderGeometry(GekkoNPC.COLLIDER_RADIUS, GekkoNPC.COLLIDER_RADIUS, GekkoNPC.COLLIDER_HEIGHT, 12),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide })
    );
    gekkoCollider.position.set(-2.8, gekkoY + GekkoNPC.COLLIDER_HEIGHT / 2, -10);
    this.sceneManager.scene.add(gekkoCollider);
    this.levelColliders.push(gekkoCollider);

    // Give the twins a distinct meeting spot beside the abandoned house, on
    // the sampled hillside just outside its front approach.
    const twinsX = this.highHouseCenter.x;
    const twinsZ = this.highHouseCenter.z + 8.5;
    const twinsPosition = new THREE.Vector3(twinsX, this.getTerrainHeight(twinsX, twinsZ), twinsZ);
    this.twinCatsChallenge = new TwinCatsChallenge(
      this.sceneManager.scene,
      twinsPosition,
      (x, z) => this.getTerrainHeight(x, z),
      this.player,
      this.inputManager,
      (window as any).gameInstance?.hud,
      this.audioManager,
      (completed) => {
        this.letterChallengeCompleted = completed;
        if (completed) (window as any).gameInstance?.saveGame(false);
      },
      (collected) => {
        this.manekiNekoCollected = collected;
        (window as any).gameInstance?.saveGame(false);
      },
      this.manekiNekoCollected
    );
    this.levelColliders.push(...this.twinCatsChallenge.colliders);

    // Setup floating coin model for dialog reference
    this.floatingCoinMesh = new THREE.Group();
    this.floatingCoinMesh.position.set(-2.8, 1.4, -10);
    this.floatingCoinMesh.scale.set(0.6, 0.6, 0.6);
    this.floatingCoinMesh.visible = false;
    this.sceneManager.scene.add(this.floatingCoinMesh);

    const loader = new GLTFLoader();
    loader.load(
      import.meta.env.BASE_URL + 'assets/collectibles/lisar coin.glb?v=7',
      (gltf) => {
        this.floatingCoinMesh.add(gltf.scene.clone());
        this.collectibleSystem.setCoinTemplate(gltf.scene);
      },
      undefined,
      (err) => { console.warn("Failed to load LISAR coin", err); }
    );
  }

  private setupEnemies(): void {
    const scene = this.sceneManager.scene;

    // Normal patrols around the castle perimeter (safely away from spawn, Gekko, and Boss Arena)
    const p1Y = this.getTerrainHeight(-30, -25);
    const patrol1 = new EnemyController('crab_1', new THREE.Vector3(-30, p1Y, -25), [
      new THREE.Vector3(-40, this.getTerrainHeight(-40, -25), -25),
      new THREE.Vector3(-20, this.getTerrainHeight(-20, -25), -25)
    ]);
    const p2Y = this.getTerrainHeight(-15, -15);
    const patrol2 = new EnemyController('crab_2', new THREE.Vector3(-15, p2Y, -15), [
      new THREE.Vector3(-25, this.getTerrainHeight(-25, -15), -15),
      new THREE.Vector3(-5, this.getTerrainHeight(-5, -15), -15)
    ]);
    const p3Y = this.getTerrainHeight(0, -65);
    const patrol3 = new EnemyController('crab_3', new THREE.Vector3(0, p3Y, -65), [
      new THREE.Vector3(-10, this.getTerrainHeight(-10, -65), -65),
      new THREE.Vector3(10, this.getTerrainHeight(10, -65), -65)
    ]);

    // Former upper-floor guards remain on the temple approach at ground height.
    const patrol4 = new EnemyController('crab_second_floor_1', new THREE.Vector3(-10, this.getTerrainHeight(-10, -52), -52));
    const patrol5 = new EnemyController('crab_second_floor_2', new THREE.Vector3(10, this.getTerrainHeight(10, -52), -52));

    // Reuse the common crab AI on safe landings in the new exploration route.
    const lavaGuard1 = new EnemyController('lava_crab_guard_1', new THREE.Vector3(62, -7.45, -98), [
      new THREE.Vector3(60.5, -7.45, -98), new THREE.Vector3(63.5, -7.45, -98),
    ]);
    const lavaGuard2 = new EnemyController('lava_crab_guard_2', new THREE.Vector3(72, -7.45, -106), [
      new THREE.Vector3(70.5, -7.45, -106), new THREE.Vector3(73.5, -7.45, -106),
    ]);

    // Four existing crab controllers patrol the crypt in two entry and two
    // central lanes. Their ground sampler must use the underground slab,
    // never the outdoor terrain height function.
    const cryptFloorY = this.curiosityCryptFloorY;
    const cryptGuard1 = new EnemyController('crypt_crab_guard_1', new THREE.Vector3(-14.5, cryptFloorY, -35), [
      new THREE.Vector3(-16, cryptFloorY, -35), new THREE.Vector3(-12, cryptFloorY, -35),
    ]);
    const cryptGuard2 = new EnemyController('crypt_crab_guard_2', new THREE.Vector3(-14.5, cryptFloorY, -45), [
      new THREE.Vector3(-16, cryptFloorY, -45), new THREE.Vector3(-12, cryptFloorY, -45),
    ]);
    const cryptGuard3 = new EnemyController('crypt_crab_guard_3', new THREE.Vector3(-24, cryptFloorY, -34), [
      new THREE.Vector3(-27, cryptFloorY, -34), new THREE.Vector3(-21, cryptFloorY, -34),
    ]);
    const cryptGuard4 = new EnemyController('crypt_crab_guard_4', new THREE.Vector3(-24, cryptFloorY, -46), [
      new THREE.Vector3(-27, cryptFloorY, -46), new THREE.Vector3(-21, cryptFloorY, -46),
    ]);
    this.cryptGuardians = [cryptGuard1, cryptGuard2, cryptGuard3, cryptGuard4];
    const cryptGrounds = this.getCuriosityCryptWalkableSurfaces();
    const cryptMovementBounds = new THREE.Box2(
      new THREE.Vector2(-36.1, -52.7),
      new THREE.Vector2(-8.9, -27.3),
    );
    for (const guardian of this.cryptGuardians) {
      guardian.groundHeightOverride = cryptFloorY;
      guardian.groundSnapSurfaces = cryptGrounds;
      guardian.movementBounds = cryptMovementBounds;
      // Keep underground enemies out of the outdoor view until their room is entered.
      guardian.mesh.visible = false;
    }

    // Boss Giant Crab in the Sand Arena (firmly grounded at y = 0.2)
    const bossY = 0.2;
    this.bossEnemy = new EnemyController('crab_boss', new THREE.Vector3(45, bossY, -40));
    this.enemies.push(patrol1, patrol2, patrol3, patrol4, patrol5, lavaGuard1, lavaGuard2, ...this.cryptGuardians, this.bossEnemy);

    this.enemies.forEach(e => {
      // Enlarge ordinary crabs by 60% while retaining the separately
      // normalized boss asset at its established 3x Wukong scale.
      e.loadModel(e.id === 'crab_boss' ? 1 : 1.6);
      e.setScene(scene); // Give each enemy direct scene access for death VFX
      scene.add(e.mesh);
      this.spellSystem.registerEnemy(e);

      // Increase Boss health/damage stats
      if (e.id === 'crab_boss') {
        e.health = 9;
        e.maxHealth = 9;
        (e as any).attackDmg = 14;
        e.arenaCenter = new THREE.Vector3(45, 0.2, -40);
        e.arenaRadius = 21.0;
        e.onHealthChange = (health, maxHealth) => {
          const game = (window as any).gameInstance;
          if (this.bossEncounterActive && !this.isCinematicPlaying && !this.stateFlags.bossDefeated && game?.menuState === 'Playing') {
            game.hud?.updateBossHealth(health, maxHealth);
          }
        };
      }

      e.onAttackPlayer = (dmg) => {
        if (!this.combatTutorialShown) {
          this.combatTutorialShown = true;
          this.showCombatControlsHint();
        }
        const wasInsideCrypt = this.isInsideCuriosityCrypt;
        const lethalHit = this.player.health <= dmg && !this.player.isInvulnerable &&
          !this.player.isControlsLocked && !this.player.isMovementLocked;
        // A crypt death must not restore an outdoor checkpoint's underground
        // coordinates (or keep the crypt ground resolver active after respawn).
        const cp = wasInsideCrypt
          ? new THREE.Vector3(this.curiosityCryptSurface.x, this.curiosityCryptSurface.y + 0.2, this.curiosityCryptSurface.z + 3.0)
          : this.checkpointManager.getActiveCheckpointPosition();
        if (wasInsideCrypt && lethalHit) this.respawnFromCuriosityCrypt = true;
        this.player.takeDamage(dmg, cp);
        this.audioManager.playPlayerHurt();
        const hud = (window as any).gameInstance?.hud;
        if (hud) hud.triggerDamageFlash();
      };

      e.onDeath = () => {
        this.powerOrbSystem?.spawn(e.mesh.position, e.id === 'crab_boss' ? 200 : 20);
        if (e.id === 'crab_boss') {
          console.log('[BOSS] HP: 0 -> Entering DYING state. Defeat sequence started.');
          this.bossEncounterActive = false;
          this.stateFlags.bossDefeated = true;
          (window as any).gameInstance?.saveGame(false);
          void this.audioManager.stopBossMusic();
          const hud = (window as any).gameInstance?.hud;
          hud?.hideBossHealth();
          this.subtitleSystem.show('Jefe Cangrejo', '¡El Jefe Cangrejo ha sido derrotado!');

          // Keep gameplay and camera live. The authored key remains a normal
          // world pickup, so the player is never locked during the dissolve.
          const keyPosition = e.mesh.position.clone().add(new THREE.Vector3(0, 1.1, 0));
          if (!this.collectedKeys.key2_boss) this.spawn3DKey('key2_boss', keyPosition);
        }
      };
    });
  }

  public spawn3DKey(id: string, pos: THREE.Vector3, showMagicEffects = true, transientSeconds = 0): void {
    if (!getKeyAsset(id)) {
      console.warn(`[KEY] No approved 3D asset is assigned to '${id}'; no substitute model will be spawned.`);
      return;
    }
    if (this.collectedKeys[id as keyof typeof this.collectedKeys] || this.keysMeshes.some((key) => key.name === id)) return;
    const scene = this.sceneManager.scene;
    const keyGroup = new THREE.Group();
    keyGroup.position.copy(pos);
    keyGroup.name = id;
    keyGroup.userData.assetReady = false;
    if (transientSeconds > 0) keyGroup.userData.removeAt = performance.now() + transientSeconds * 1000;
    scene.add(keyGroup);
    this.keysMeshes.push(keyGroup);
    void loadKeyModel(id).then((model) => {
      if (!keyGroup.parent) return;
      keyGroup.add(model);
      if (showMagicEffects) {
        const asset = getKeyAsset(id)!;
        const halo = new THREE.Mesh(keyHaloGeometry, new THREE.MeshBasicMaterial({
          color: asset.magicColor, transparent: true, opacity: 0.48, depthWrite: false, toneMapped: false,
        }));
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 0.12;
        keyGroup.add(halo);
        const sparkles = new THREE.InstancedMesh(keySparkGeometry, new THREE.MeshBasicMaterial({
          color: asset.magicColor, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false,
        }), 8);
        const dummy = new THREE.Object3D();
        for (let i = 0; i < 8; i++) {
          const angle = i * Math.PI / 4;
          dummy.position.set(Math.cos(angle) * 0.35, 0.08 + (i % 3) * 0.22, Math.sin(angle) * 0.35);
          dummy.scale.setScalar(i % 2 === 0 ? 1 : 0.7);
          dummy.updateMatrix();
          sparkles.setMatrixAt(i, dummy.matrix);
        }
        sparkles.instanceMatrix.needsUpdate = true;
        keyGroup.add(sparkles);
      }
      keyGroup.userData.assetReady = true;
      console.log(`[LevelToyStory] Spawned authored key '${id}' at`, pos);
    }).catch((error) => {
      keyGroup.removeFromParent();
      const failedIndex = this.keysMeshes.indexOf(keyGroup);
      if (failedIndex >= 0) this.keysMeshes.splice(failedIndex, 1);
      if (id === 'key4_curiosity') {
        this.curiosityKeySpawned = false;
        this.curiosityKeyRetryAt = performance.now() + 900;
      }
      console.error(`[KEY] Could not load authored model for '${id}'.`, error);
    });
  }

  /** Handle exactly the closest uncollected authored key; prompt and target cannot diverge. */
  private updateKeyInteraction(playerPos: THREE.Vector3): void {
    const game = (window as any).gameInstance;
    if (game?.menuState !== 'Playing' || game?.isPaused || this.player.isControlsLocked ||
        this.player.isMovementLocked || this.isCinematicPlaying) return;

    let nearest: THREE.Group | null = null;
    let nearestDistance = 2.0;
    for (const key of this.keysMeshes) {
      if (!key.userData.assetReady || this.collectedKeys[key.name as keyof typeof this.collectedKeys]) continue;
      const verticalDistance = Math.abs(key.position.y - playerPos.y);
      if (verticalDistance > 2.4) continue;
      const distance = Math.hypot(key.position.x - playerPos.x, key.position.z - playerPos.z);
      if (distance < nearestDistance) {
        nearest = key;
        nearestDistance = distance;
      }
    }

    if (!nearest) return;
    const keyId = nearest.name as keyof typeof this.collectedKeys;
    const keyData = this.keyDefinitions[keyId];
    const keyPosition = nearest.position.clone();
    const hud = game?.hud;
    hud?.showInteractionPrompt(`Presiona [E] para tomar ${keyData?.name ?? getKeyAsset(keyId)?.name ?? 'Llave Mágica'}`);
    if (!this.inputManager.consumeInteractPress()) return;

    // awardKey owns the idempotency check, persistence and HUD progress update.
    // Remove the world object only after that transaction accepts the pickup.
    if (!this.awardKey(keyId, keyPosition)) return;
    nearest.userData.collected = true;
    nearest.removeFromParent();
    const index = this.keysMeshes.indexOf(nearest);
    if (index >= 0) this.keysMeshes.splice(index, 1);
    hud?.hideInteractionPrompt();
  }

  /** Resolve crypt interactions before the shared E press reaches nearby loot. */
  private updateCryptInteractions(playerPos: THREE.Vector3): void {
    const game = (window as any).gameInstance;
    if (game?.menuState !== 'Playing' || game?.isPaused || this.player.isControlsLocked ||
        this.player.isMovementLocked || this.isCinematicPlaying || this.curiosityCryptTransitioning) return;
    const hud = game?.hud;

    if (this.dragonSwitchMesh && !this.isLavaVaultOpen) {
      const switchPos = this.dragonSwitchMesh.position;
      const switchDistance = Math.hypot(playerPos.x - switchPos.x, playerPos.z - switchPos.z);
      if (switchDistance < 2.8 && Math.abs(playerPos.y - switchPos.y) < 3.0) {
        hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Activar Palanca · Acción' : 'Activar Palanca [E]');
        if (this.inputManager.consumeInteractPress()) {
          const activationStart = performance.now();
          this.isLavaVaultOpen = true;
          this.leverTarget = -Math.PI / 4;
          this.hatchTarget = 1;
          // Key GLTF fetch/decode is started during level preparation, never
          // on the lever's interaction frame.
          this.audioManager.playHitImpact();
          this.audioManager.playPortalActivate();
          // Persist the lever after the interaction frame. saveGame serializes
          // the full exploration state synchronously; running it inline here
          // used to hitch the same frame that starts the hatch animation.
          const persistLever = () => (window as any).gameInstance?.saveGame(false);
          const idleWindow = window as Window & {
            requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
          };
          if (idleWindow.requestIdleCallback) {
            idleWindow.requestIdleCallback(persistLever, { timeout: 1600 });
          } else {
            window.setTimeout(persistLever, 0);
          }
          if (import.meta.env.DEV) {
            console.info('[CuriosityVaultPerf] Lever activation synchronous work', {
              totalMs: +(performance.now() - activationStart).toFixed(1),
            });
            this.measureCryptActivationFrames();
          }
          this.subtitleSystem.show('Mecanismo Secreto', '¡El mecanismo del pabellón ha abierto una cámara secreta al otro lado del reino!');
        }
      }
    }

    if (!this.isLavaVaultOpen) return;
    if (!this.isInsideCuriosityCrypt) {
      const distance = Math.hypot(playerPos.x - this.curiosityCryptSurface.x, playerPos.z - this.curiosityCryptSurface.z);
      if (distance >= 3.2) return;
      if (this.hatchOpenProgress > 0.92) {
        hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Entrar a la cripta · Acción' : 'Entrar a la cripta [E]');
        if (this.inputManager.consumeInteractPress()) void this.transitionCuriosityCrypt(true);
      } else {
        hud?.showInteractionPrompt('La entrada se está abriendo…');
      }
      return;
    }

    const exitDistance = Math.hypot(playerPos.x - this.curiosityCryptReturnPoint.x, playerPos.z - this.curiosityCryptReturnPoint.z);
    if (exitDistance < 3.0) {
      hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Volver al exterior · Acción' : 'Volver al exterior [E]');
      if (this.inputManager.consumeInteractPress()) void this.transitionCuriosityCrypt(false);
    }
  }

  /** Reconcile world keys after loading a save made before/after a pickup. */
  public restoreCollectedKeys(savedKeys: unknown): void {
    if (savedKeys && typeof savedKeys === 'object') {
      for (const id of Object.keys(this.collectedKeys) as Array<keyof typeof this.collectedKeys>) {
        const value = (savedKeys as Record<string, unknown>)[id];
        if (typeof value === 'boolean') this.collectedKeys[id] = value;
      }
    }
    this.totalKeysCount = Object.values(this.collectedKeys).filter(Boolean).length;
    if (this.collectedKeys.key3_platform) {
      this.canopyChestOpen = true;
      this.canopyChest?.restoreOpen(false);
      this.completeCanopyTrial();
    }
    for (let i = this.keysMeshes.length - 1; i >= 0; i--) {
      const key = this.keysMeshes[i];
      if (!this.collectedKeys[key.name as keyof typeof this.collectedKeys]) continue;
      key.removeFromParent();
      this.keysMeshes.splice(i, 1);
    }
    (window as any).gameInstance?.hud?.setCollectedKeys(this.getCollectedKeyIds(), false);
  }

  // Spawns the sparkles and unlocks the key
  public awardKey(keyId: keyof typeof this.collectedKeys, spawnPos?: THREE.Vector3): boolean {
    if (!this.collectedKeys.hasOwnProperty(keyId) || this.collectedKeys[keyId]) return false;
    this.collectedKeys[keyId] = true;

    // Key milestones (apart from Gekko's 50-coin reward) also feed the staff
    // progression, making all five upgrades reachable through full exploration.
    if (keyId !== 'key1_gekko' && keyId !== 'key3_platform') {
      this.powerOrbSystem?.spawn(this.player.mesh.position.clone(), 250);
    }

    // Visual sparks
    if (spawnPos) this.createSparks(spawnPos);
    this.audioManager.playCardPickup(); // Play success chime

    // Increment keys count
    this.totalKeysCount++;
    const hud = (window as any).gameInstance?.hud;
    if (hud) hud.setCollectedKeys(this.getCollectedKeyIds());
    (window as any).gameInstance?.saveGame(false);

    let keyName = '';
    if (keyId === 'key1_gekko') keyName = 'Llave de la Riqueza (Gekko 50 Monedas)';
    if (keyId === 'key2_boss') keyName = 'Llave de la Valentía (Jefe Cangrejo)';
    if (keyId === 'key3_platform') keyName = getKeyAsset(keyId)?.name ?? 'Llave del Qi Celestial';
    if (keyId === 'key4_curiosity') keyName = 'Llave de la Curiosidad';
    if (keyId === 'key6_gargoyles') keyName = 'Llave del Secreto (Gárgolas)';
    if (keyId === 'key5_pots') keyName = 'Llave de Destrucción (Gemas)';

    this.subtitleSystem.show('LISAR', `¡Has obtenido la ${keyName}! (${this.totalKeysCount}/4 Requeridas)`);

    // Check if exit door is now unlocked (STRICT VALIDATION: EXACTLY 3 OR MORE KEYS REQUIRED)
    if (this.totalKeysCount >= 4 && this.exitDoor && !this.exitDoor.isOpen) {
      this.exitDoor.open();
      this.subtitleSystem.show('LISAR', '¡PORTÓN ABIERTO! Has reunido las 4 llaves místicas. El portal de salida en el castillo está desbloqueado.');
    }
    return true;
  }

  public getCollectedKeyIds(): string[] {
    return Object.entries(this.collectedKeys)
      .filter(([id, collected]) => collected && !!getKeyAsset(id))
      .map(([id]) => id);
  }

  public getStaffUpgradeInfo(): StaffUpgradeInfo {
    return this.powerOrbSystem?.getUpgradeInfo() ?? { level: 1, damageMultiplier: 1, nextDamageMultiplier: 1.1, nextCost: 100, orbs: 0 };
  }

  public getStaffDamage(baseDamage: number): number {
    return this.powerOrbSystem?.getStaffDamage(baseDamage) ?? baseDamage;
  }

  public purchaseStaffUpgrade(): 'upgraded' | 'insufficient' | 'max' {
    return this.powerOrbSystem?.upgradeStaff() ?? 'max';
  }

  public restoreStaffProgression(orbs: number, level: number): void {
    this.powerOrbSystem?.restore(orbs, level);
  }

  public getStaffProgressionSaveData(): { powerOrbs: number; staffUpgradeLevel: number } {
    const info = this.getStaffUpgradeInfo();
    return { powerOrbs: info.orbs, staffUpgradeLevel: info.level };
  }

  private createSparks(pos: THREE.Vector3): void {
    this.collectibleSystem.spawnSparks(pos);
  }

  private setupTriggers(): void {
    // Intro trigger
    const tIntro = new TriggerZone('trig_intro', new THREE.Vector3(-8, -1, 5), new THREE.Vector3(8, 5, 15), () => {
      if (!this.stateFlags.introCompleted) {
        this.stateFlags.introCompleted = true;
        this.subtitleSystem.show('Sistema', 'Explora el mapa para conseguir las 5 llaves. Empieza buscando tu báculo en el cofre dentro del castillo.');
        (window as any).gameInstance?.hud.setObjective('Consigue 4 llaves para abrir el portal');
      }
    });
    this.triggerZones.push(tIntro);

    // Gekko First Encounter Trigger Zone (Tutorial Level Proven Architecture)
    const tGekko = new TriggerZone('trig_gekko', new THREE.Vector3(-6.0, -2.0, -16.0), new THREE.Vector3(4.0, 6.0, -6.0), () => {
      if (this.gekkoMissionState === 'NOT_STARTED' && !this.stateFlags.gekkoTalked) {
        this.gekkoMissionState = 'MISSION_ACTIVE';
        void preloadKeyModel('key1_gekko').catch((error) => console.warn('[KEY] Wealth key preload failed.', error));
        this.stateFlags.gekkoTalked = true;
        (window as any).gameInstance?.saveGame(false);
        console.log('[GEKKO] TriggerZone entered -> Starting First Cinematic');
        this.runGekkoCinematic();
      }
    });
    this.triggerZones.push(tGekko);

    const dragonCheckpoint = new TriggerZone('trig_volcanic_dragon_checkpoint', new THREE.Vector3(44, -5, -89), new THREE.Vector3(51, 6, -79), () => {
      this.checkpointManager.setActiveCheckpoint(7);
    });
    this.triggerZones.push(dragonCheckpoint);
    const lavaEntry = new TriggerZone('trig_secret_lava_entry', new THREE.Vector3(53, -10, -98), new THREE.Vector3(61, -5, -90), () => {
      this.checkpointManager.setActiveCheckpoint(5);
    });
    this.triggerZones.push(lavaEntry);
    const lavaMidpoint = new TriggerZone('trig_secret_lava_midpoint', new THREE.Vector3(64, -10, -105), new THREE.Vector3(70, -4, -99), () => {
      this.checkpointManager.setActiveCheckpoint(6);
    });
    this.triggerZones.push(lavaMidpoint);

    // Preserve the original four-key requirement at the new secret door.
    const tExit = new TriggerZone('trig_exit_secret_lava', new THREE.Vector3(71, -10, -115), new THREE.Vector3(81, 0, -105), () => {
      if (!this.stateFlags.levelCompleted && this.exitDoor.isOpen) {
        this.stateFlags.levelCompleted = true;
        (window as any).gameInstance?.hud.showVictoryScreen(5, "05:00");
        document.exitPointerLock();
      }
    });
    this.triggerZones.push(tExit);
  }

  private async runGekkoCinematic(): Promise<void> {
    if (this.isCinematicPlaying) return;
    this.isCinematicPlaying = true;

    // The NPC GLB loads asynchronously during level setup. Do not start the
    // camera/dialogue beat until the actual character (or its explicit visual
    // fallback) is attached, otherwise the conversation can show an empty spot.
    await this.gekkoModelsReady;

    const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
    const cameraController = (window as any).gameInstance?.cameraController;
    const hud = (window as any).gameInstance?.hud;

    if (!cinematicCamera || !hud) {
      this.isCinematicPlaying = false;
      return;
    }

    // These developer-only sky controls occupy the same corner as Gekko in
    // this two-shot. Temporarily hide them so the NPC remains visible.
    this.setSkyDebugPanelVisible(false);

    if (cinematicCamera && hud) {
      // Pause enemy AI!
      this.enemies.forEach(e => e.isPaused = true);
      await hud.fadeScreenOut(500);

      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      const gekkoPos = this.gekkoNPC.mesh.position;
      const gekkoY = gekkoPos.y;

      // Position Player facing Gekko
      // Gekko may be standing on a raised/uneven section of terrain. Keep the
      // player on that same ground elevation; the old hard-coded 0.2 m put
      // Wukong under the ground whenever the NPC was higher on a slope.
      this.player.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z + 2.5);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();
      
      // Position Gekko facing Player
      this.gekkoNPC.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z);
      this.gekkoNPC.mesh.rotation.set(0, 0, 0);
      this.gekkoNPC.setTalking(true);

      this.floatingCoinMesh.position.set(gekkoPos.x, gekkoY + 1.4, gekkoPos.z + 1.25);
      this.floatingCoinMesh.visible = true;

      this.subtitleSystem.hide();

      // Keep the two speakers separated in frame. The former 2.5 m camera
      // distance put Wukong on the near edge of the frustum, where the close
      // third-person model could be cropped or hidden by Gekko.
      const endPos = new THREE.Vector3(gekkoPos.x + 7.5, gekkoY + 2.8, gekkoPos.z + 1.25);
      const endLookAt = new THREE.Vector3(gekkoPos.x, gekkoY + 1.05, gekkoPos.z + 1.25);
      cinematicCamera.moveCamera(endPos, endPos, endLookAt, endLookAt, 999.0);

      await hud.fadeScreenIn(500);

      let cinematicSkipped = false;

      const finishCinematic = async () => {
        if (cinematicSkipped) return;
        cinematicSkipped = true;
        window.removeEventListener('keydown', skipHandler);
        window.removeEventListener('touchstart', touchSkipHandler);
        hud.hideDialogue();
        
        await hud.fadeScreenOut(300);
        
        cinematicCamera.abort();

        // Restore gameplay camera target smoothly behind player
        if (cameraController) {
          cameraController.setTarget(this.player.mesh);
          cameraController.snapBehindTarget();
        }

        this.player.isControlsLocked = false;
        this.player.isMovementLocked = false;
        this.player.isAttacking = false;
        this.player.velocity.set(0, 0, 0);
        this.player.forceIdle();
        this.isCinematicPlaying = false;
        
        this.gekkoNPC.setTalking(false);
        this.gekkoNPC.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z);
        this.gekkoNPC.mesh.rotation.set(0, -Math.PI * 0.25, 0);
        this.floatingCoinMesh.visible = false;
        
        // Resume enemy AI!
        this.enemies.forEach(e => e.isPaused = false);

        await hud.fadeScreenIn(300);
        hud.showGameplayHUD();
        this.setSkyDebugPanelVisible(true);
      };

      const skipHandler = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
          finishCinematic();
        }
      };
      const touchSkipHandler = (e: Event) => {
        e.preventDefault();
        finishCinematic();
      };

      window.addEventListener('keydown', skipHandler);
      window.addEventListener('touchstart', touchSkipHandler, { passive: false });

      const gekkoMsg = hud.isTouchDevice()
        ? '¡Hola viajero! Consigue 50 monedas LISAR del mapa y te entregaré una de las cinco llaves mágicas del portal.'
        : '¡Hola viajero! Consigue 50 monedas LISAR del mapa y te entregaré una de las cinco llaves mágicas del portal. Presiona ENTER para continuar.';

      hud.showTypewriterDialogue('Gekko', gekkoMsg, () => {
        if (cinematicSkipped) return;
        setTimeout(() => {
          if (cinematicSkipped) return;
          finishCinematic();
        }, 4000);
      }, { type: 'cinematic', focusPoints: [
        ...projectDialogueFocus(this.gekkoNPC?.mesh, this.cameraController.camera, 1.25, 2.2),
        ...projectDialogueFocus(this.player.mesh, this.cameraController.camera, 1.2, 1.8),
      ] });
    }
  }

  public async runGameIntroSequence(): Promise<void> {
    const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
    const cameraController = (window as any).gameInstance?.cameraController;
    const hud = (window as any).gameInstance?.hud;

    if (hud) {
      hud.showGameplayHUD();
      hud.fadeScreenIn(100);
    }

    if (cinematicCamera && hud) {
      this.isCinematicPlaying = true;
      this.enemies.forEach(e => e.isPaused = true);
      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      // Position Wukong facing FORWARD along -Z (with his BACK to the camera +Z!)
      this.player.mesh.position.set(0, 0.2, 10);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();

      let introFinished = false;
      const finishIntro = () => {
        if (introFinished) return;
        introFinished = true;
        window.removeEventListener('keydown', keySkip);
        window.removeEventListener('touchstart', touchSkip);

        hud.hideDialogue();
        cinematicCamera.abort();

        // Position camera behind Wukong facing forward (-Z)
        if (cameraController) {
          cameraController.setTarget(this.player.mesh);
          cameraController.snapBehindTarget();
        }

        // Ensure Wukong stays facing -Z (back to camera) and is completely unlocked
        this.player.mesh.position.set(0, 0.2, 10);
        this.player.mesh.rotation.set(0, Math.PI, 0);

        // ── ZERO-LAG HANDOVER: Unlock all movement, inputs, touch and camera controls ──
        this.isCinematicPlaying = false;
        this.player.isControlsLocked = false;
        this.player.isMovementLocked = false;
        this.player.isAttacking = false;
        this.player.velocity.set(0, 0, 0);
        this.player.forceIdle();

        this.enemies.forEach(e => e.isPaused = false);
        hud.showGameplayHUD();
        this.subtitleSystem.show('LISAR', 'Habla con Gekko en el camino para iniciar tu aventura.', 4500);
      };

      const keySkip = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') finishIntro();
      };
      const touchSkip = (e: Event) => {
        e.preventDefault();
        finishIntro();
      };

      window.addEventListener('keydown', keySkip);
      window.addEventListener('touchstart', touchSkip, { passive: false });

      (async () => {
        try {
          // ── TOMA 1: Vista Panorámica del Reino y Montañas Celestiales ──
          this.subtitleSystem.show('LISAR', 'Reino Místico del Rey Mono', 2200);
          await cinematicCamera.moveCamera(
            new THREE.Vector3(38.0, 24.0, 35.0),
            new THREE.Vector3(18.0, 18.0, 20.0),
            new THREE.Vector3(0, 6.0, -45.0),
            new THREE.Vector3(0, 5.0, -40.0),
            2.2
          );
          if (introFinished) return;

          // ── TOMA 2: Pradera Viva y Ruta de Gekko ──
          this.subtitleSystem.show('LISAR', 'Explora el reino, reúne las monedas y encuentra las 5 llaves sagradas.', 2200);
          await cinematicCamera.moveCamera(
            new THREE.Vector3(-22.0, 8.0, 5.0),
            new THREE.Vector3(-10.0, 4.5, -8.0),
            new THREE.Vector3(-2.8, 1.2, -10.0),
            new THREE.Vector3(0, 1.5, -25.0),
            2.2
          );
          if (introFinished) return;

          // ── TOMA 3: Temple route after removing the duplicate eastern temple ──
          this.subtitleSystem.show('LISAR', 'El templo imperial y el pabellón marcan las rutas del reino.', 2200);
          await cinematicCamera.moveCamera(
            new THREE.Vector3(24.0, 12.0, -28.0),
            new THREE.Vector3(14.0, 8.0, -36.0),
            new THREE.Vector3(0, 7.0, -40.0),
            new THREE.Vector3(0, 6.0, -40.0),
            2.2
          );
          if (introFinished) return;

          // ── TOMA 4: Aproximación Dinámica hacia Wukong ──
          await cinematicCamera.moveCamera(
            new THREE.Vector3(0, 5.5, 24.0),
            new THREE.Vector3(0, 2.8, 15.5),
            new THREE.Vector3(0, 1.0, 10.0),
            new THREE.Vector3(0, 1.8, -25.0),
            2.0
          );

          finishIntro();
        } catch (err) {
          console.warn('[Intro] Sequence interrupted or finished:', err);
          finishIntro();
        }
      })();
    }
  }

  private async runGekkoSecondCinematic(): Promise<void> {
    if (this.isCinematicPlaying) return;
    this.isCinematicPlaying = true;
    console.log('[GEKKO] Mission state: COMPLETE -> Starting Reward Cinematic');

    const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
    const hud = (window as any).gameInstance?.hud;

    if (!cinematicCamera || !hud) {
      this.isCinematicPlaying = false;
      return;
    }

    this.setSkyDebugPanelVisible(false);

    if (cinematicCamera && hud) {
      // Pause enemy AI!
      this.enemies.forEach(e => e.isPaused = true);
      await hud.fadeScreenOut(500);

      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      const gekkoPos = this.gekkoNPC.mesh.position;
      const gekkoY = gekkoPos.y;

      // Position Player facing Gekko
      this.player.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z + 2.5);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();
      
      // Position Gekko facing Player
      this.gekkoNPC.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z);
      this.gekkoNPC.mesh.rotation.set(0, 0, 0);
      this.gekkoNPC.setTalking(true);

      // NO LISAR COIN FLOATING IN 2ND CINEMATIC!
      if (this.floatingCoinMesh) this.floatingCoinMesh.visible = false;

      // Use the same wider conversation composition as Gekko's first scene
      // so neither actor is clipped during the reward dialogue.
      const endPos = new THREE.Vector3(gekkoPos.x + 7.5, gekkoY + 2.8, gekkoPos.z + 1.25);
      const endLookAt = new THREE.Vector3(gekkoPos.x, gekkoY + 1.05, gekkoPos.z + 1.25);
      cinematicCamera.moveCamera(endPos, endPos, endLookAt, endLookAt, 999.0);

      this.subtitleSystem.hide();
      await hud.fadeScreenIn(500);

      let cinematicSkipped = false;

      const finishCinematic = async () => {
        if (cinematicSkipped) return;
        cinematicSkipped = true;
        window.removeEventListener('keydown', skipHandler);
        window.removeEventListener('touchstart', touchSkipHandler);
        hud.hideDialogue();
        
        await hud.fadeScreenOut(300);
        
        cinematicCamera.abort();
        const cameraController = (window as any).gameInstance?.cameraController;
        if (cameraController) {
          cameraController.setTarget(this.player.mesh);
          cameraController.snapBehindTarget();
        }

        this.gekkoNPC.setTalking(false);
        this.gekkoNPC.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z);
        this.gekkoNPC.mesh.rotation.set(0, -Math.PI * 0.25, 0);
        
        // Hide Gekko badge from HUD as it's completed
        const gekkoBadge = document.getElementById('gekko-quest-complete');
        if (gekkoBadge) gekkoBadge.classList.add('hidden');

        await hud.fadeScreenIn(300);
        hud.showGameplayHUD();
        this.setSkyDebugPanelVisible(true);

        // ── FASE 2-5: KeyPickupSequence for Gekko Orange Key (key1_gekko) ──
        console.log('[GEKKO] Orange Key given');
        const keyData = this.keyDefinitions['key1_gekko'];
        const spawnPos = new THREE.Vector3(gekkoPos.x, gekkoY + 1.2, gekkoPos.z + 1.3);

        await KeyPickupSequence.runSequence(
          keyData,
          spawnPos,
          this.player,
          this.sceneManager.scene,
          () => {
            this.gekkoMissionState = 'REWARD_GIVEN';
            this.coinsExchanged = true;
            this.awardKey('key1_gekko');
            this.enemies.forEach(e => e.isPaused = false);
            this.player.isControlsLocked = false;
            this.player.isMovementLocked = false;
            this.isCinematicPlaying = false;
            console.log('[GEKKO] Mission completed — REWARD_GIVEN state set');
          }
        );
      };

      const skipHandler = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
          finishCinematic();
        }
      };
      const touchSkipHandler = (e: Event) => {
        e.preventDefault();
        finishCinematic();
      };
      window.addEventListener('keydown', skipHandler);
      window.addEventListener('touchstart', touchSkipHandler, { passive: false });

      const gekkoFocus = [
        ...projectDialogueFocus(this.gekkoNPC?.mesh, this.cameraController.camera, 1.25, 2.2),
        ...projectDialogueFocus(this.player.mesh, this.cameraController.camera, 1.2, 1.8),
      ];
      hud.showTypewriterDialogue('Gekko', 'Vaya... realmente las encontraste todas.', () => {
        if (cinematicSkipped) return;
        hud.showTypewriterDialogue('Gekko', 'Las 50 Lisar Coins. No pensé que alguien fuera capaz de reunirlas.', () => {
          if (cinematicSkipped) return;
          hud.showTypewriterDialogue('Gekko', 'Cumpliste tu parte del trato. Esta Llave de la Riqueza ahora te pertenece.', () => {
            if (cinematicSkipped) return;
            setTimeout(() => {
              if (cinematicSkipped) return;
              finishCinematic();
            }, 2500);
          }, { type: 'reward', focusPoints: gekkoFocus });
        }, { type: 'reward', focusPoints: gekkoFocus });
      }, { type: 'reward', focusPoints: gekkoFocus });
    } else {
      this.isCinematicPlaying = false;
    }
  }

  /** Two deterministic life rewards in each existing playable region. */
  private createLifePickups(): void {
    if (!this.lifePickupSource || this.lifePickups.length) return;
    const scene = this.sceneManager.scene;
    const configs = [
      { id: 'overworld-west', x: -32, z: -4, floor: () => this.getTerrainHeight(-32, -4) },
      { id: 'overworld-east', x: 34, z: -12, floor: () => this.getTerrainHeight(34, -12) },
      { id: 'crypt-west', x: -31, z: -47, floor: () => -5.9 },
      { id: 'crypt-east', x: -15, z: -31, floor: () => -5.9 },
      { id: 'lava-vault-entry', x: 57, z: -94, floor: () => -7.35 },
      { id: 'lava-vault-platform', x: 67, z: -102, floor: () => -7.35 },
    ];
    const sparkleCount = 12;
    const sparkleGeometry = new THREE.SphereGeometry(0.032, 6, 5);
    const sparkleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    });
    this.lifeSparkles = new THREE.InstancedMesh(sparkleGeometry, sparkleMaterial, configs.length * sparkleCount);
    this.lifeSparkles.name = 'wukong_life_pickup_glints';
    this.lifeSparkles.frustumCulled = false;
    this.lifeSparkles.renderOrder = 3;
    const sparkleColors = [0xffd45c, 0x62f4ff, 0xff72dc, 0x9c7bff, 0xfff2a0, 0x70ffbd];
    for (let i = 0; i < this.lifeSparkles.count; i++) {
      this.lifeSparkles.setColorAt(i, new THREE.Color(sparkleColors[i % sparkleColors.length]));
    }
    scene.add(this.lifeSparkles);

    configs.forEach((config, index) => {
      const groundY = config.floor();
      const root = new THREE.Group();
      root.name = `life_pickup_${config.id}`;
      root.position.set(config.x, groundY + 0.68, config.z);
      const model = this.lifePickupSource!.clone(true);
      model.name = `Teara_wukong_vida_model_${config.id}`;
      model.traverse((part) => {
        const mesh = part as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const accentMaterial = (source: THREE.Material): THREE.Material => {
          if (!(source instanceof THREE.MeshStandardMaterial) || source.emissiveMap) return source;
          const material = source.clone();
          if (material.emissive.getHex() === 0) {
            material.emissive.setHex(0x281a06);
            material.emissiveIntensity = 0.18;
          } else {
            material.emissiveIntensity = Math.min(material.emissiveIntensity, 0.22);
          }
          return material;
        };
        mesh.material = Array.isArray(mesh.material)
          ? mesh.material.map(accentMaterial)
          : accentMaterial(mesh.material);
      });
      model.updateMatrixWorld(true);
      const originalBounds = new THREE.Box3().setFromObject(model);
      const originalSize = originalBounds.getSize(new THREE.Vector3());
      const center = originalBounds.getCenter(new THREE.Vector3());
      // The authored Blender object has a remote origin. Center it in model
      // space before scaling; applying the correction after scaling made the
      // pickup transform depend on the source scene's large coordinates.
      model.position.sub(center);
      const item = new THREE.Group();
      item.name = `Teara_wukong_vida_${config.id}`;
      item.add(model);
      const displayHeight = 0.58;
      item.scale.setScalar(displayHeight / Math.max(0.001, originalSize.y));
      // The model was previously prepared and animated but never attached to
      // the world root. Only its ground torus was visible, making the reward
      // look like a bare ring with floating sparkles.
      root.add(item);
      scene.add(root);
      const collected = this.collectedLifePickupIds.has(config.id);
      root.visible = !collected;
      this.lifePickups.push({ id: config.id, root, item, groundY, phase: index * 1.71, collected, fade: collected ? 1 : 0 });
    });
    this.refreshLifeSparkles();
  }

  private updateLifePickups(delta: number, playerPos: THREE.Vector3): void {
    if (!this.lifePickups.length) return;
    this.lifePickupElapsed += Math.min(delta, 0.05);
    const dummy = new THREE.Object3D();
    const sparkleCount = 12;
    this.lifePickups.forEach((pickup, pickupIndex) => {
      if (pickup.collected) {
        pickup.fade = Math.min(1, pickup.fade + delta / 0.24);
        pickup.root.scale.setScalar(Math.max(0.001, 1 - pickup.fade));
        if (pickup.fade >= 1) pickup.root.visible = false;
        for (let i = 0; i < sparkleCount; i++) {
          dummy.position.copy(pickup.root.position); dummy.scale.setScalar(0.001); dummy.updateMatrix();
          this.lifeSparkles?.setMatrixAt(pickupIndex * sparkleCount + i, dummy.matrix);
        }
        return;
      }
      pickup.root.visible = true;
      pickup.root.position.y = pickup.groundY + 0.68 + Math.sin(this.lifePickupElapsed * 1.8 + pickup.phase) * 0.12;
      // Keep the tiara's broad, wearable face visible to Wukong instead of
      // spinning edge-on into the thin golden sliver seen in the pickup view.
      const targetYaw = Math.atan2(playerPos.x - pickup.root.position.x, playerPos.z - pickup.root.position.z);
      const yawDelta = THREE.MathUtils.euclideanModulo(targetYaw - pickup.item.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
      pickup.item.rotation.y += THREE.MathUtils.clamp(yawDelta, -delta * 2.8, delta * 2.8);
      pickup.item.rotation.z = Math.sin(this.lifePickupElapsed * 1.45 + pickup.phase) * 0.035;
      const dx = playerPos.x - pickup.root.position.x;
      const dz = playerPos.z - pickup.root.position.z;
      if (dx * dx + dz * dz <= 1.45 * 1.45 && Math.abs(playerPos.y - pickup.groundY) < 2.35 && this.player.grantLife(1)) {
        pickup.collected = true;
        this.collectedLifePickupIds.add(pickup.id);
        this.audioManager.playPotionPickup();
        this.collectibleSystem.spawnSparks(pickup.root.position.clone());
        (window as any).gameInstance?.saveGame?.(false);
      }
      const t = this.lifePickupElapsed * 1.35 + pickup.phase;
      for (let i = 0; i < sparkleCount; i++) {
        // Scatter the glints through a loose 3D cloud so they don't read as a
        // ground marker or a fixed orbit around the collectible.
        const seed = i + pickupIndex * 17;
        const offsetX = Math.sin(seed * 12.9898) * 0.42;
        const offsetY = Math.cos(seed * 7.233) * 0.34;
        const offsetZ = Math.sin(seed * 4.117 + 1.8) * 0.34;
        const drift = t + seed * 1.73;
        dummy.position.set(
          pickup.root.position.x + offsetX + Math.sin(drift * 0.72) * 0.07,
          pickup.root.position.y + offsetY + Math.sin(drift * 1.1) * 0.09,
          pickup.root.position.z + offsetZ + Math.cos(drift * 0.83) * 0.07,
        );
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i * 2.1);
        dummy.scale.setScalar(0.45 + pulse * 0.9);
        dummy.updateMatrix();
        this.lifeSparkles?.setMatrixAt(pickupIndex * sparkleCount + i, dummy.matrix);
      }
    });
    if (this.lifeSparkles) {
      this.lifeSparkles.instanceMatrix.needsUpdate = true;
      if (this.lifeSparkles.instanceColor) this.lifeSparkles.instanceColor.needsUpdate = true;
    }
  }

  private refreshLifeSparkles(): void {
    if (!this.lifeSparkles) return;
    const dummy = new THREE.Object3D();
    this.lifePickups.forEach((pickup, pickupIndex) => {
      for (let i = 0; i < 12; i++) {
        dummy.position.copy(pickup.root.position); dummy.scale.setScalar(0.001); dummy.updateMatrix();
        this.lifeSparkles!.setMatrixAt(pickupIndex * 12 + i, dummy.matrix);
      }
    });
    this.lifeSparkles.instanceMatrix.needsUpdate = true;
  }

  public resetLifePickups(): void {
    this.collectedLifePickupIds.clear();
    this.lifePickups.forEach((pickup) => {
      pickup.collected = false; pickup.fade = 0;
      pickup.root.scale.setScalar(1); pickup.root.visible = true;
    });
  }

  public restoreCollectedLifePickupIds(ids: unknown): void {
    this.collectedLifePickupIds = new Set(Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []);
    this.lifePickups.forEach((pickup) => {
      pickup.collected = this.collectedLifePickupIds.has(pickup.id);
      pickup.fade = pickup.collected ? 1 : 0;
      pickup.root.visible = !pickup.collected;
      pickup.root.scale.setScalar(pickup.collected ? 0.001 : 1);
    });
  }

  public getCollectedLifePickupIds(): string[] { return [...this.collectedLifePickupIds]; }

  public restoreLetterChallengeCompleted(completed: boolean): void {
    this.letterChallengeCompleted = completed;
    this.twinCatsChallenge?.restoreCompleted(completed);
  }

  public restoreManekiNekoCollected(collected: boolean): void {
    this.manekiNekoCollected = collected;
    this.twinCatsChallenge?.restoreRewardCollected(collected);
  }

  public cancelLetterChallenge(): void { this.twinCatsChallenge?.cancel(); }

  public update(delta: number, playerPos: THREE.Vector3, realElapsed = delta): void {
    this.updateLifePickups(delta, playerPos);
    this.syncStructureColliders(playerPos);
    this.loadOptionalArchitectureNearPlayer(playerPos);
    if (this.optionalHouseLightingGroup) {
      this.optionalHouseLightingGroup.visible = playerPos.distanceToSquared(this.highHouseCenter) < 30 * 30;
    }
    if (this.skyAnchor) this.skyAnchor.position.copy(playerPos);
    const interactionHud = (window as any).gameInstance?.hud;
    interactionHud?.beginInteractionFrame();
    this.twinCatsChallenge?.update(
      realElapsed,
      playerPos,
      (window as any).gameInstance?.menuState === 'Playing' && this.player.health > 0
    );
    // Resolve the nearest authored key before mechanisms and chests. The old
    // order let the distant-priority crypt lever consume E while the HUD was
    // explicitly showing a nearby key, making the key appear uncollectable.
    this.updateKeyInteraction(playerPos);
    this.updateCryptInteractions(playerPos);
    this.updateCanopyTrial(delta, playerPos);
    this.tryStartIntroKeyCelebration();
    this.updateTreeReactions(delta, realElapsed);
    for (let i = this.treeSnakes.length - 1; i >= 0; i--) {
      const snake = this.treeSnakes[i];
      snake.update(delta, playerPos, (x, z) => this.getTerrainHeight(x, z), (amount) => this.player.takeDamage(amount));
      if (!snake.isAlive()) { snake.dispose(); this.treeSnakes.splice(i, 1); }
    }
    // Tick Dynamic Day/Night Cycle
    if (this.dayNightCycle) {
      this.dayNightCycle.update(realElapsed, playerPos);
    }
    const skyPhase = this.dayNightCycle?.phase ?? 0.05;
    const nightAmount = this.dayNightCycle?.nightAmount ?? 1;
    this.updateExteriorMoonlightEffects(delta, nightAmount);
    if (this.arenaMoonFill) this.arenaMoonFill.intensity = 64 * nightAmount;
    this.twinCatsChallenge?.setNightAmount(nightAmount);
    if (this.skyPanorama && this.dayNightCycle) {
      this.skyPanorama.update(this.sceneManager.renderer, skyBlendForHour(this.dayNightCycle.hour));
    }
    if (this.dayNightCycle) {
      this.horizonPaletteElapsed += delta;
      if (this.horizonPaletteElapsed >= 0.16) {
        this.horizonPaletteElapsed %= 0.16;
        this.updateHorizonPalette(this.dayNightCycle.hour);
      }
    }
    if (this.moonMaterial) this.moonMaterial.opacity = 0;
    if (this.cloudsUniforms?.uNightIntensity) this.cloudsUniforms.uNightIntensity.value = nightAmount;
    if (this.starMaterial) {
      // The source night panorama has its own distant stars. A restrained
      // code-star layer retains the existing constellation points without
      // making the ordinary star field double in density.
      this.starMaterial.uniforms.uOpacity.value = 0.34 * nightAmount;
      this.starMaterial.uniforms.uTime.value = performance.now() / 1000;
      this.starMaterial.uniforms.uPixelRatio.value = this.sceneManager.renderer.getPixelRatio();
    }
    if (this.cryptPortalMaterial) this.cryptPortalMaterial.uniforms.uTime.value = performance.now() / 1000;
    if (this.cryptDust) {
      this.cryptDust.visible = this.isInsideCuriosityCrypt;
      if (this.isInsideCuriosityCrypt && this.cryptDustBasePositions && this.cryptDustPhases) {
        this.cryptDustTime += delta;
        const positions = this.cryptDust.geometry.getAttribute('position') as THREE.BufferAttribute;
        const values = positions.array as Float32Array;
        for (let i = 0; i < this.cryptDustPhases.length; i++) {
          const offset = i * 3;
          const phase = this.cryptDustPhases[i] + this.cryptDustTime * 0.3;
          values[offset] = this.cryptDustBasePositions[offset] + Math.sin(phase) * 0.07;
          values[offset + 1] = this.cryptDustBasePositions[offset + 1] + Math.sin(phase * 0.73) * 0.12;
          values[offset + 2] = this.cryptDustBasePositions[offset + 2] + Math.cos(phase * 0.61) * 0.07;
        }
        positions.needsUpdate = true;
      }
    }
    this.constellationSystem?.update(delta, skyPhase);
    if (this.skyDebugPanel && this.dayNightCycle) {
      this.skyDebugElapsed -= delta;
      if (this.skyDebugElapsed <= 0) {
        const state = this.dayNightCycle.getDebugState();
        this.skyDebugPanel.textContent = `CIELO DEV · ${state.hour} · ${state.daylight < 0.01 ? 'Noche' : state.daylight > 0.99 ? 'Día' : 'Transición'} · Faroles ${state.lanterns.toFixed(2)} · Sol (${state.sunDirection.x.toFixed(2)}, ${state.sunDirection.y.toFixed(2)}, ${state.sunDirection.z.toFixed(2)})`;
        this.skyDebugElapsed = 0.2;
      }
    }

    if (this.grassUniforms) {
      this.grassUniforms.uTime.value = performance.now() / 1000.0;
      if (this.grassUniforms.uPlayerPos) {
        this.grassUniforms.uPlayerPos.value.copy(playerPos);
      }
      const wind = this.worldWind.state;
      this.grassUniforms.uWindDirection?.value.copy(wind.direction);
      if (this.grassUniforms.uWindStrength) this.grassUniforms.uWindStrength.value = wind.intensity;
    }
    if (this.bridgeWaterUniforms) this.bridgeWaterUniforms.uTime.value += Math.min(delta, 0.05);
    const lavaTime = performance.now() / 1000;
    if (this.lavaUniforms) this.lavaUniforms.uTime.value = lavaTime;
    if (this.lavaEmberUniforms) this.lavaEmberUniforms.uTime.value = lavaTime;
    this.lavaBubbles.forEach(({ mesh, phase, baseY }) => {
      const wave = Math.sin(lavaTime * 1.7 + phase);
      mesh.visible = wave > 0.58;
      mesh.position.y = baseY + Math.max(0, wave) * 0.34;
      const scale = 0.55 + Math.max(0, wave) * 0.75;
      mesh.scale.setScalar(scale);
    });
    this.dragonRun?.update(delta, playerPos);
    this.powerOrbSystem?.update(delta, playerPos);
    this.grassCullElapsed -= delta;
    if (this.grassCullElapsed <= 0) {
      // Keep authored Blender LODs at all distances; the ground material
      // carries coverage beyond the vegetation range. Avoid broken topology.
      // Mobile class and low-power capability are separate signals: recent
      // phones commonly report ample RAM/cores, but still need the compact
      // vegetation radius to keep their fill and vertex budgets predictable.
      const isMobile = isMobileDevice() || isLowPowerDevice();
      const selectedQualityIndex = this.grassQuality === 0.65 ? 0 : this.grassQuality === 1 ? 2 : 1;
      // Keep the visual style, but cap the default high preset to the medium
      // vegetation radius on phones. This avoids drawing distant grass sectors
      // that contribute little to a small screen and consume GPU time.
      const qualityIndex = isMobile ? Math.min(selectedQualityIndex, 1) : selectedQualityIndex;
      const midDistances = isMobile ? [7, 9, 12] : [12, 16, 24];
      // Vegetation beyond these ranges is represented by the textured ground.
      // Keeping distant instanced blades alive was the dominant avoidable
      // foliage cost, especially in the high desktop profile.
      const farDistances = isMobile ? [18, 23, 30] : [36, 48, 62];
      const lodDistance = midDistances[qualityIndex];
      const farDistance = farDistances[qualityIndex];
      // The 20 m sectors contain hundreds of clumps. Applying the complete
      // source mesh to an entire sector because only its near edge is close
      // caused a large triangle spike. The authored Blender LOD is used for
      // the near band too; it retains the blade silhouette with far fewer
      // repeated polygons.
      for (let i = 0; i < this.grassSectors.length; i++) {
        const sector = this.grassSectors[i];
        if (this.isInsideCuriosityCrypt) {
          sector.visible = false;
          continue;
        }
        const center = sector.userData.grassCenter as THREE.Vector2;
        const dx = playerPos.x - center.x;
        const dz = playerPos.z - center.y;
        // Distance to the nearest point of the sector avoids the visible
        // circular cutoff caused by testing only each sector's center.
        const halfSize = (sector.userData.grassHalfSize as number) || 20;
        const edgeX = Math.max(Math.abs(dx) - halfSize, 0);
        const edgeZ = Math.max(Math.abs(dz) - halfSize, 0);
        const distanceSq = edgeX * edgeX + edgeZ * edgeZ;
        const distance = Math.sqrt(distanceSq);
        sector.visible = distance <= farDistance;
        if (sector.visible) {
          const targetGeometry = distance <= lodDistance
              ? (isMobile
                ? (distance <= 5 ? sector.userData.grassMediumGeometry : sector.userData.grassLowGeometry)
                : qualityIndex === 2
                ? sector.userData.grassLodGeometry
                : qualityIndex === 1
                  ? sector.userData.grassMediumGeometry
                  : sector.userData.grassLowGeometry)
              : sector.userData.grassFarGeometry;
          if (sector.geometry !== targetGeometry) sector.geometry = targetGeometry;
        }
      }
      this.grassCullElapsed = 0.35;
    }
    if (this.hatchPivot && this.hatchTarget !== this.hatchOpenProgress) {
      this.hatchOpenProgress = THREE.MathUtils.damp(this.hatchOpenProgress, this.hatchTarget, 4.6, delta);
      if (Math.abs(this.hatchOpenProgress - this.hatchTarget) < 0.002) this.hatchOpenProgress = this.hatchTarget;
      this.hatchPivot.rotation.x = -this.hatchOpenProgress * Math.PI * 0.5;
      if (this.cryptPortalMaterial) this.cryptPortalMaterial.uniforms.uActivation.value = this.hatchOpenProgress;
      if (this.portalAsset) this.portalAsset.scale.y = 1.12 * (0.82 + this.hatchOpenProgress * 0.18);
      if (this.cryptEntranceGlow) {
        this.cryptEntranceGlow.intensity = 0.7 + this.hatchOpenProgress * 4.1;
        this.cryptEntranceGlow.distance = 5.5 + this.hatchOpenProgress * 5.5;
      }
      if (this.curiosityCryptMouth) this.curiosityCryptMouth.visible = this.isLavaVaultOpen && this.hatchOpenProgress > 0.01;
    }
    if (this.curiosityCryptTrail) this.curiosityCryptTrail.visible = this.isLavaVaultOpen && !this.curiosityChestOpen;
    if (this.dragonLeverStick) {
      this.dragonLeverStick.rotation.x = THREE.MathUtils.damp(this.dragonLeverStick.rotation.x, this.leverTarget, 9, delta);
    }
    // Update elevator platforms
    this.movingPlatforms.forEach(p => p.update(delta));

    // Check triggers
    this.triggerZones.forEach(t => t.check(playerPos, delta));

    const lavaDistance = Math.hypot(playerPos.x - this.secretLavaCenter.x, playerPos.z - this.secretLavaCenter.y);
    if (lavaDistance < 14.1 && playerPos.y < this.secretLavaY + 1.0 &&
        !this.player.isControlsLocked && !this.player.isMovementLocked) {
      this.subtitleSystem.show('¡Lava!', 'El calor te devuelve al último punto seguro.');
      this.player.takeDamage(this.player.health, this.checkpointManager.getActiveCheckpointPosition());
      (window as any).gameInstance?.hud.triggerDamageFlash();
      this.audioManager.playPlayerHurt();
    }

    // Chests run after the key and crypt checks so the visible key prompt owns
    // its single E press when a key and chest overlap in interaction range.
    const chestInRange = !this.stateFlags.staffFound && !this.staffChest.isUnlocked &&
      this.staffChest.mesh.position.distanceTo(playerPos) < 2.2 &&
      !this.player.isControlsLocked && !this.player.isMovementLocked && !this.isCinematicPlaying;
    const openStaffChest = chestInRange && this.inputManager.consumeInteractPress();
    // DYING means gameplay damage is finished; it also covers despawned or
    // health-zero guardians while their short visual death sequence completes.
    // Visibility controls where the room is rendered; it is not a kill state.
    // Counting hidden pre-entry guardians as defeated permanently unlocked
    // the chest before the challenge could be played.
    const cryptGuardiansDefeated = this.cryptGuardians.every((enemy) => !enemy.isAlive());
    if (cryptGuardiansDefeated && !this.cryptGuardiansCleared) {
      this.cryptGuardiansCleared = true;
      this.curiosityChest.isUnlocked = true;
      this.audioManager.playPortalActivate();
      const hud = (window as any).gameInstance?.hud;
      hud?.showInfoToast('CRIPTA ANCESTRAL', '¡Los guardianes han caído! El cofre ancestral está desbloqueado', 4200, 3);
      (window as any).gameInstance?.saveGame(false);
    }
    // Measure the chest's approach range in the floor plane; the chest pivot
    // sits 0.3 m above the chamber floor and must not shrink the usable radius.
    const curiosityChestDistance = Math.hypot(
      this.curiosityChest.mesh.position.x - playerPos.x,
      this.curiosityChest.mesh.position.z - playerPos.z,
    );
    const curiosityChestNear = this.isInsideCuriosityCrypt && this.isLavaVaultOpen && !this.curiosityChestOpen &&
      curiosityChestDistance < 2.7 && Math.abs(this.curiosityChest.mesh.position.y - playerPos.y) < 2.6 &&
      !this.player.isControlsLocked && !this.player.isMovementLocked && !this.isCinematicPlaying;
    const curiosityChestInRange = curiosityChestNear && this.curiosityChest.isUnlocked &&
      curiosityChestDistance < 2.7 &&
      !this.player.isControlsLocked && !this.player.isMovementLocked && !this.isCinematicPlaying;
    const openCuriosityChest = curiosityChestInRange && this.inputManager.consumeInteractPress();
    const gekkoPosForAction = this.gekkoNPC?.mesh?.position;
    const gekkoDistanceForAction = gekkoPosForAction
      ? Math.hypot(playerPos.x - gekkoPosForAction.x, playerPos.z - gekkoPosForAction.z)
      : Infinity;
    // Keep the whole proximity/control gate around every mission state. The
    // previous ungrouped `||` terms made active/rewarded Gekko consume E from
    // anywhere on the map, which could steal chest/interact presses.
    const gekkoNeedsAction = gekkoDistanceForAction < 5.5 && !this.isCinematicPlaying &&
      !this.player.isControlsLocked && !this.player.isMovementLocked &&
      (this.gekkoMissionState === 'NOT_STARTED' ||
        this.gekkoMissionState === 'MISSION_ACTIVE' ||
        this.gekkoMissionState === 'REWARD_GIVEN');
    const interactWithGekko = gekkoNeedsAction && this.inputManager.consumeInteractPress();

    const activeGame = (window as any).gameInstance;
    if (activeGame?.menuState === 'Playing' && this.player.health > 0 && !this.stateFlags.bossDefeated && !this.bossEncounterActive && !this.isCinematicPlaying && !this.player.isControlsLocked) {
      const entryDistance = Math.hypot(playerPos.x - 34, playerPos.z + 40);
      if (entryDistance <= 10) {
        this.stateFlags.bossCinematicPlayed = true;
        void this.runBossCinematic();
      }
    }
    if (this.bossEncounterActive && this.bossEnemy?.arenaCenter) {
      const arenaDistance = Math.hypot(playerPos.x - this.bossEnemy.arenaCenter.x, playerPos.z - this.bossEnemy.arenaCenter.z);
      if (arenaDistance > this.bossEnemy.arenaRadius + 1.5) this.exitBossEncounter();
    }
    
    // Update doors
    this.doors.forEach(d => d.update(delta));
    
    // Update NPC
    if (this.gekkoNPC) {
      const gekkoPosition = this.gekkoNPC.mesh.position;
      const nearGekko = Math.hypot(playerPos.x - gekkoPosition.x, playerPos.z - gekkoPosition.z) < GekkoNPC.HEAD_TRACKING_RADIUS;
      const canTrackGekko = nearGekko && !this.isCinematicPlaying && !this.player.isControlsLocked;
      if (canTrackGekko) {
        this.gekkoLookTarget.copy(playerPos);
        this.gekkoLookTarget.y += 1.35;
      }
      this.gekkoNPC.update(delta, canTrackGekko ? this.gekkoLookTarget : null);
      if (nearGekko && !this.isCinematicPlaying && !this.player.isControlsLocked) {
        this.npcGazePoint.copy(gekkoPosition);
        this.npcGazePoint.y += 1.5;
        this.player.animationController.setGazeTarget(this.npcGazePoint);
      } else {
        this.player.animationController.setGazeTarget(null);
      }
    }
    
    if (this.floatingCoinMesh && this.floatingCoinMesh.visible) {
      this.floatingCoinMesh.rotation.y += delta * 2;
      this.floatingCoinMesh.position.y = 1.4 + Math.sin(Date.now() / 300) * 0.08;
    }

    // Spin 3D floating keys in the world & check for collection with TakingItem animation
    // Key visuals keep spinning after the one-frame interaction was resolved.
    for (let i = this.keysMeshes.length - 1; i >= 0; i--) {
      const key = this.keysMeshes[i]!;
      if (typeof key.userData.removeAt === 'number' && performance.now() >= key.userData.removeAt) {
        key.removeFromParent();
        this.keysMeshes.splice(i, 1);
        continue;
      }
      if (!key.userData.assetReady) continue;
      key.rotation.y += delta * 2.0;
      key.position.y += Math.sin(Date.now() * 0.003) * 0.001;
    }

    // Update enemies (including DYING state for death VFX execution and memory cleanup)
    this.enemies.forEach(e => {
      if (e.state !== 'DEAD' && e.state !== 'DEFEATED') {
        if (e.id.startsWith('crypt_crab_guard_') && !this.isInsideCuriosityCrypt) {
          e.mesh.visible = false;
          return;
        }
        // Enemy AI uses planar distance; keep surface enemies from aggroing or
        // dealing damage through the ground while Wukong explores the crypt.
        // Continue DYING sequences everywhere so their cleanup/VFX still finish.
        if (e.state !== 'DYING' && e.state !== 'DISSOLVING' && Math.abs(e.mesh.position.y - playerPos.y) > 3.25) return;
        e.update(delta, playerPos, this.levelColliders);
        if (!this.combatTutorialShown && e.isAlive() && e.mesh.position.distanceTo(playerPos) < 5.5) {
          this.combatTutorialShown = true;
          this.showCombatControlsHint();
        }
      }
    });

    // Update collectibles (with strict manual E key press support)
    this.collectibleSystem.update(
      playerPos,
      delta,
      () => {},
      (coins) => {
        const hud = (window as any).gameInstance?.hud;
        if (hud) {
          hud.setCoinCount(coins);
          // Check if we hit exactly 50 for Gekko
          if (coins >= 50 && !this.coinsExchanged) {
            this.subtitleSystem.show('Sistema', '¡Tienes 50 monedas LISAR! Ve a hablar con Gekko.');
          }
        }
      },
      undefined,
      () => this.inputManager.consumeInteractPress()
    );

    // ── Gekko Proximity Detection & Automatic Cinematic Triggering ──
    const gekkoPos = this.gekkoNPC?.mesh?.position || new THREE.Vector3(-2.8, 0.2, -10);
    const distToGekko = Math.hypot(playerPos.x - gekkoPos.x, playerPos.z - gekkoPos.z);

    if (distToGekko < 5.5 && !this.isCinematicPlaying && !this.player.isControlsLocked) {
      if (this.gekkoMissionState === 'NOT_STARTED' && !this.stateFlags.gekkoTalked) {
        this.gekkoMissionState = 'MISSION_ACTIVE';
        this.stateFlags.gekkoTalked = true;
        console.log('[GEKKO] Auto-triggering First Cinematic on proximity (dist: ' + distToGekko.toFixed(2) + 'm)');
        (window as any).gameInstance?.saveGame(false);
        this.runGekkoCinematic();
      } else if (this.gekkoMissionState === 'MISSION_ACTIVE') {
        const currentCoins = this.collectibleSystem.coinCount;
        if (currentCoins >= 50) {
          const hud = (window as any).gameInstance?.hud;
          hud?.showInteractionPrompt('Hablar con Gekko para canjear [E]');
          if (interactWithGekko) {
            this.gekkoMissionState = 'MISSION_COMPLETE';
            this.runGekkoSecondCinematic();
          }
        } else {
          const hud = (window as any).gameInstance?.hud;
          if (interactWithGekko) {
            hud?.hideInteractionPrompt();
            hud?.showInfoToast('GEKKO', 'Aún te faltan monedas. ¡Sigue explorando el reino!', 3600, 2);
          } else hud?.showInteractionPrompt(`Hablar con Gekko (${currentCoins}/50 Monedas) [E]`);
        }
      } else if (this.gekkoMissionState === 'REWARD_GIVEN') {
        const hud = (window as any).gameInstance?.hud;
        hud?.showInteractionPrompt('Hablar con Gekko [E]');
        if (interactWithGekko) {
          this.subtitleSystem.show('Gekko', '¡Gracias por ayudarme con las 50 Lisar Coins! Usa esa llave para abrir el portón principal.');
        }
      }
      if (this.gekkoMissionState === 'NOT_STARTED' && this.stateFlags.gekkoTalked) {
        const hud = (window as any).gameInstance?.hud;
        hud?.showInteractionPrompt('Hablar con Gekko [E]');
        if (interactWithGekko) {
          this.gekkoMissionState = 'MISSION_ACTIVE';
          void preloadKeyModel('key1_gekko').catch((error) => console.warn('[KEY] Wealth key preload failed.', error));
          this.runGekkoCinematic();
        }
      }
    }

    // ── Dragon Switch Interaction (Mezzanine Floor Balcony) ──
    // Crypt switch/entry/exit interactions are resolved earlier, before E can be
    // consumed by a nearby key, NPC, chest, or walk-over collectible.

    if (playerPos.y < -7.2 && playerPos.x <= -6 && playerPos.x >= -38 && playerPos.z >= -54 && playerPos.z <= -26) {
      this.player.takeDamage(15);
      this.player.mesh.position.copy(this.curiosityCryptRoomEntry);
      this.player.velocity.set(0, 0, 0);
      this.audioManager.playPlayerHurt();
      const hud = (window as any).gameInstance?.hud;
      if (hud) hud.triggerDamageFlash();
      this.subtitleSystem.show('Cámara secreta', 'Regresa por las escaleras para volver a la superficie.');
    }

    // ── Runic Fast-Travel Portal System Update ──
    const hud = (window as any).gameInstance?.hud;
    const cameraController = (window as any).gameInstance?.cameraController;
    if (hud && cameraController) {
      this.portalManager.update(
        delta,
        playerPos,
        this.inputManager,
        hud,
        this.audioManager,
        this.player,
        cameraController,
        this.subtitleSystem
      );
    }

    // ── Celestial Apple pickup check (instant, shared original GLB asset) ──
    for (let i = this.energyItems.length - 1; i >= 0; i--) {
      const item = this.energyItems[i];
      item.rotation.y += delta * 2.0; // Smooth visual spin
      const distToEnergy = item.position.distanceTo(playerPos);
      if (this.appleDropAnimations.some((drop) => drop.group === item)) continue;
      if (item.visible && distToEnergy < 2.0 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
        hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Tomar Manzana Celestial · Acción' : 'Tomar Manzana Celestial [E]');
        const interactPressed = this.inputManager.consumeInteractPress();

        if (distToEnergy < 1.6 || interactPressed) {
          hud?.hideInteractionPrompt();
          this.collectibleSystem.spawnSparks(item.position);
          this.disposeAppleVisual(item);
          this.sceneManager.scene.remove(item);
          this.energyItems.splice(i, 1);

          this.audioManager.playPotionPickup();
          this.player.heal(35);
          this.subtitleSystem.show('Manzana Celestial', '¡Has recogido una Manzana Celestial! (+35 de salud)', 2000);
        }
      }
    }

    // ── Chest Interaction — Staff Pickup ──────────────────────────────────────
    if (curiosityChestNear && !this.curiosityChest.isUnlocked) {
      hud?.showInteractionPrompt('Derrota a los guardianes para abrir el cofre');
    } else if (curiosityChestInRange) {
      hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Abrir cofre · Acción' : 'Abrir cofre [E]');
    }
    if (openCuriosityChest) {
      hud?.hideInteractionPrompt();
      this.curiosityChestOpen = true;
      this.curiosityChest.isUnlocked = true;
      this.curiosityKeyRewardReady = true;
      if (!this.curiosityKeySpawned && !this.collectedKeys.key4_curiosity) {
        this.curiosityKeySpawned = true;
        this.spawn3DKey('key4_curiosity', this.curiosityChest.mesh.position.clone().add(new THREE.Vector3(0, 1.08, 0)), false);
        this.subtitleSystem.show('Cofre antiguo', 'Has encontrado la Llave de la Curiosidad.');
      }
      this.curiosityChest.unlock(this.audioManager, this.collectibleSystem);
    }

    if (this.curiosityKeyRewardReady && !this.collectedKeys.key4_curiosity && !this.curiosityKeySpawned &&
        performance.now() >= this.curiosityKeyRetryAt) {
      this.curiosityKeySpawned = true;
      this.spawn3DKey('key4_curiosity', this.curiosityChest.mesh.position.clone().add(new THREE.Vector3(0, 1.08, 0)), false);
    }

    if (!this.stateFlags.staffFound && this.staffChest.mesh.position.distanceTo(playerPos) < 2.2 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
      const hud = (window as any).gameInstance?.hud;
      hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Abrir cofre · Acción' : 'Presiona [E] para abrir cofre');

      if (openStaffChest && !this.staffChest.isUnlocked) {
        this.stateFlags.staffFound = true;
        this.staffChest.isUnlocked = true;
        this.isCinematicPlaying = true;
        hud?.hideInteractionPrompt();

        // Pause enemy AI!
        this.enemies.forEach(e => e.isPaused = true);

        this.staffChest.unlock(this.audioManager, this.collectibleSystem, undefined, false);
        const cinematic = new ChestCinematic({
          scene: this.sceneManager.scene,
          player: this.player,
          chestPosition: this.staffChest.mesh.position.clone(),
          hud: {
            fadeScreenOut: (ms) => hud.fadeScreenOut(ms),
            fadeScreenIn: (ms) => hud.fadeScreenIn(ms),
            setObjective: (text) => hud.setObjective(text),
          },
          onComplete: () => {
            console.log('[LevelToyStory] Staff cinematic complete — gameplay resumes.');
            this.isCinematicPlaying = false;
            this.subtitleSystem.show('Báculo Mágico', hud?.isTouchDevice?.() ? '¡Has obtenido el Báculo Sagrado! Está guardado a la espalda. Pulsa Golpe para atacar.' : '¡Has obtenido el Báculo Sagrado! Báculo guardado a la espalda. Ataca con Click Izquierdo.');
            // Resume enemy AI!
            this.enemies.forEach(e => e.isPaused = false);
          },
        });

        cinematic.run().then(() => {
          // Commit chest ownership and inventory together for reloads.
          (window as any).gameInstance?.saveGame?.(false);
        }).catch(err => {
          console.error('[LevelToyStory] ChestCinematic error:', err);
          this.isCinematicPlaying = false;
          this.player.isMovementLocked = false;
          this.player.obtainWeapon('STAFF');
          (window as any).gameInstance?.saveGame?.(false);
          this.enemies.forEach(e => e.isPaused = false);
        });
      }
    }
    interactionHud?.endInteractionFrame();
  }

  /** Load the large scenic annex only when the player explores its region. */
  private loadOptionalArchitectureNearPlayer(playerPos: THREE.Vector3): void {
    if (this.optionalArchitectureStarted || this.optionalArchitectureLoading) return;
    if (playerPos.distanceToSquared(this.highHouseCenter) > 58 * 58) return;
    this.optionalArchitectureLoading = true;
    const loadStartedAt = performance.now();
    const loader = new GLTFLoader();
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    loader.load(base + 'wukong-chinese-high-house-original.glb', async (gltf) => {
      const house = gltf.scene;
      house.name = 'chinese_high_house_wood_original';
      house.traverse((part) => {
        if ((part as THREE.Mesh).isMesh) {
          (part as THREE.Mesh).castShadow = false;
          (part as THREE.Mesh).receiveShadow = true;
          const mesh = part as THREE.Mesh;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          if (materials.some((material) => /floor|piso|suelo|deck|platform/i.test(material.name))) {
            mesh.userData.walkableSupport = true;
          }
        }
      });
      this.sceneManager.scene.add(house);
      house.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(house);
      const center = bounds.getCenter(new THREE.Vector3());
      const houseSize = bounds.getSize(new THREE.Vector3());
      const wallThickness = 0.38;
      house.position.x += this.highHouseCenter.x - center.x;
      house.position.z += this.highHouseCenter.z - center.z;
      house.position.y += this.getTerrainHeight(this.highHouseCenter.x, this.highHouseCenter.z) - bounds.min.y;
      house.updateMatrixWorld(true);

      // The GLB is intentionally kept as the original combined mesh. Cut a
      // small, measured opening only through horizontal upper-deck faces so
      // the interior stair can reach the second storey without altering its
      // walls, posts, roof, materials, textures, or UVs.
      // World-space footprint of the L-shaped landing well. The geometry
      // audit measured the original house bounds; this cut follows the two
      // stair runs rather than removing a large rectangular section of floor.
      const stairStartX = this.highHouseCenter.x - houseSize.x * 0.5 + wallThickness + 0.75;
      const stairEndX = stairStartX + 6.0;
      const stairZ = this.highHouseCenter.z - houseSize.z * 0.5 + wallThickness + 1.0;
      const stairClearance = 0.82;
      const houseMesh = house.children.find((part) => (part as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
      if (houseMesh?.geometry.index) {
        const sourceGeometry = houseMesh.geometry;
        const sourceIndex = sourceGeometry.index!;
        const positions = sourceGeometry.getAttribute('position');
        const kept = new Uint32Array(sourceIndex.count);
        let keptCount = 0;
        const a = new THREE.Vector3();
        const b = new THREE.Vector3();
        const c = new THREE.Vector3();
        const normal = new THREE.Vector3();
        const edge = new THREE.Vector3();
        const centroid = new THREE.Vector3();
        const upperY = this.getAbandonedHouseUpperFloorTopY();
        const world = (index: number, target: THREE.Vector3) => target.fromBufferAttribute(positions, index).applyMatrix4(houseMesh.matrixWorld);
        for (let i = 0; i < sourceIndex.count; i += 3) {
          const ia = sourceIndex.getX(i), ib = sourceIndex.getX(i + 1), ic = sourceIndex.getX(i + 2);
          world(ia, a); world(ib, b); world(ic, c);
          edge.subVectors(c, a);
          normal.subVectors(b, a).cross(edge).normalize();
          centroid.copy(a).add(b).add(c).multiplyScalar(1 / 3);
          const inLowerFlightWell = centroid.x > stairStartX - stairClearance && centroid.x < stairEndX + stairClearance &&
            centroid.z > stairZ - stairClearance && centroid.z < stairZ + stairClearance;
          const inUpperFlightWell = centroid.x > stairEndX - stairClearance && centroid.x < stairEndX + stairClearance &&
            centroid.z > stairZ - stairClearance && centroid.z < stairZ + 6.0 + stairClearance;
          const inStairwell = inLowerFlightWell || inUpperFlightWell;
          const upperDeckFace = Math.abs(normal.y) > 0.88 && Math.abs(centroid.y - upperY) < 0.58;
          if (!(inStairwell && upperDeckFace)) {
            kept[keptCount++] = ia;
            kept[keptCount++] = ib;
            kept[keptCount++] = ic;
          }
          // This mesh contains hundreds of thousands of triangles. Yield in
          // bounded batches so the optional annex cannot monopolize a frame
          // when its GLB finishes loading beside the moving player.
          if (i > 0 && i % (8192 * 3) === 0) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          }
        }
        const cutGeometry = new THREE.BufferGeometry();
        cutGeometry.name = sourceGeometry.name;
        cutGeometry.userData = { ...sourceGeometry.userData };
        for (const [name, attribute] of Object.entries(sourceGeometry.attributes)) cutGeometry.setAttribute(name, attribute);
        cutGeometry.morphAttributes = sourceGeometry.morphAttributes;
        cutGeometry.morphTargetsRelative = sourceGeometry.morphTargetsRelative;
        for (const group of sourceGeometry.groups) cutGeometry.addGroup(group.start, group.count, group.materialIndex);
        cutGeometry.setDrawRange(sourceGeometry.drawRange.start, sourceGeometry.drawRange.count);
        cutGeometry.setIndex(new THREE.BufferAttribute(kept.slice(0, keptCount), 1));
        cutGeometry.computeBoundingBox();
        cutGeometry.computeBoundingSphere();
        houseMesh.geometry = cutGeometry;
      }

      // The architectural GLB is a visual asset (330k triangles), not a
      // physics mesh. Register a small set of boxes for collision instead of
      // raycasting that entire facade on each movement/ground/camera query.
      const houseGroundY = this.getTerrainHeight(this.highHouseCenter.x, this.highHouseCenter.z);
      const houseFloorTopY = this.getAbandonedHouseFloorTopY();
      const houseUpperFloorTopY = this.getAbandonedHouseUpperFloorTopY();
      const halfWidth = houseSize.x * 0.5;
      const halfDepth = houseSize.z * 0.5;
      // The lower storey is visibly open on stilts. Do not wrap it in a solid
      // AABB shell: that was the invisible barrier sealing Wukong outside.
      // Keep simplified wall blockers only around the enclosed upper storey.
      const houseRoofTopY = houseGroundY + houseSize.y;
      const wallBottom = houseUpperFloorTopY;
      const wallHeight = Math.max(3, houseRoofTopY - wallBottom);
      // The GLB's front doorway is strongly offset from its bounding-box
      // center: its opening is around local X=0.5 while the model bounds
      // center is around local X=-6.2. Align the proxy opening to that actual
      // doorway (world X ~= center + 6.7); centering it on the house sealed
      // the entrance with the front-wall collision box.
      const requestedEntranceCenterX = this.highHouseCenter.x + 6.7;
      const requestedDoorWidth = Math.min(5.2, houseSize.x * 0.40);
      const houseMinX = this.highHouseCenter.x - halfWidth;
      const houseMaxX = this.highHouseCenter.x + halfWidth;
      // The authored opening sits close to the right edge of the facade.
      // Clip it to the actual GLB bounds before deriving wall segments; the
      // old unbounded width calculation produced a negative-sized wall box.
      const doorMinX = THREE.MathUtils.clamp(requestedEntranceCenterX - requestedDoorWidth * 0.5, houseMinX, houseMaxX);
      const doorMaxX = THREE.MathUtils.clamp(requestedEntranceCenterX + requestedDoorWidth * 0.5, houseMinX, houseMaxX);
      const doorWidth = doorMaxX - doorMinX;
      const entranceCenterX = (doorMinX + doorMaxX) * 0.5;
      const doorHeight = Math.min(wallHeight, 3.0);
      const collisionRoot = new THREE.Group();
      collisionRoot.name = 'abandoned_house_simplified_collision';
      const collisionMaterial = new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const addWall = (name: string, width: number, height: number, depth: number, x: number, y: number, z: number) => {
        if (width <= 0.02 || height <= 0.02 || depth <= 0.02) return;
        const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), collisionMaterial);
        wall.name = name;
        wall.position.set(x, y, z);
        wall.userData.solidPlayerBlocker = true;
        collisionRoot.add(wall);
      };
      const wallCenterY = wallBottom + wallHeight * 0.5;
      addWall('abandoned_house_back_wall', houseSize.x, wallHeight, wallThickness,
        this.highHouseCenter.x, wallCenterY, this.highHouseCenter.z - halfDepth);
      addWall('abandoned_house_left_wall', wallThickness, wallHeight, houseSize.z,
        this.highHouseCenter.x - halfWidth, wallCenterY, this.highHouseCenter.z);
      addWall('abandoned_house_right_wall', wallThickness, wallHeight, houseSize.z,
        this.highHouseCenter.x + halfWidth, wallCenterY, this.highHouseCenter.z);
      const leftWidth = doorMinX - houseMinX;
      const rightWidth = houseMaxX - doorMaxX;
      addWall('abandoned_house_front_left', leftWidth, wallHeight, wallThickness,
        houseMinX + leftWidth * 0.5, wallCenterY, this.highHouseCenter.z + halfDepth);
      addWall('abandoned_house_front_right', rightWidth, wallHeight, wallThickness,
        doorMaxX + rightWidth * 0.5, wallCenterY, this.highHouseCenter.z + halfDepth);
      if (wallHeight > doorHeight) {
        addWall('abandoned_house_front_lintel', doorWidth, wallHeight - doorHeight, wallThickness,
          entranceCenterX, wallBottom + doorHeight + (wallHeight - doorHeight) * 0.5,
          this.highHouseCenter.z + halfDepth);
      }
      this.sceneManager.scene.add(collisionRoot);

      // The ground-floor slab is at local Y=0.10. Support that actual lower
      // walking surface so Wukong can enter and collect the cabin coins.
      this.optionalHouseFloorCollider = new THREE.Mesh(
        new THREE.BoxGeometry(houseSize.x - wallThickness * 2, 0.16, houseSize.z),
        new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide })
      );
      this.optionalHouseFloorCollider.name = 'abandoned_house_floor_support';
      this.optionalHouseFloorCollider.position.set(this.highHouseCenter.x, houseFloorTopY - 0.08, this.highHouseCenter.z);
      this.optionalHouseFloorCollider.userData.walkableSupport = true;
      this.sceneManager.scene.add(this.optionalHouseFloorCollider);

      // Upper floor support is split around the stairwell so neither the
      // invisible collision nor the original deck closes the opening.
      const supportMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
      const supportCenterX = this.highHouseCenter.x;
      const supportCenterZ = this.highHouseCenter.z;
      // Extend the walkable deck support to the original model bounds so the
      // authored front balcony remains solid through the doorway.
      const supportWidth = houseSize.x;
      const supportDepth = houseSize.z;
      const supportMinX = supportCenterX - supportWidth / 2;
      const supportMaxX = supportCenterX + supportWidth / 2;
      const supportMinZ = supportCenterZ - supportDepth / 2;
      const supportMaxZ = supportCenterZ + supportDepth / 2;
      const upperSupports: THREE.Mesh[] = [];
      const addUpperSupport = (name: string, width: number, depth: number, x: number, z: number) => {
        if (width <= 0.1 || depth <= 0.1) return;
        const support = new THREE.Mesh(new THREE.BoxGeometry(width, 0.16, depth), supportMaterial);
        support.name = name;
        support.position.set(x, houseUpperFloorTopY - 0.08, z);
        support.userData.walkableSupport = true;
        upperSupports.push(support);
        this.sceneManager.scene.add(support);
      };
      const clearBounds = {
        minX: stairStartX - stairClearance, maxX: stairEndX + stairClearance,
        minZ: stairZ - stairClearance, maxZ: stairZ + 6.0 + stairClearance,
      };
      const xCuts = [supportMinX, clearBounds.minX, stairEndX - stairClearance, stairEndX + stairClearance, clearBounds.maxX, supportMaxX]
        .map((x) => THREE.MathUtils.clamp(x, supportMinX, supportMaxX)).sort((a, b) => a - b);
      const zCuts = [supportMinZ, clearBounds.minZ, stairZ - stairClearance, stairZ + stairClearance, stairZ + 6.0 + stairClearance, clearBounds.maxZ, supportMaxZ]
        .map((z) => THREE.MathUtils.clamp(z, supportMinZ, supportMaxZ)).sort((a, b) => a - b);
      for (let xi = 0; xi < xCuts.length - 1; xi++) {
        const minX = xCuts[xi], maxX = xCuts[xi + 1];
        if (maxX - minX < 0.02) continue;
        for (let zi = 0; zi < zCuts.length - 1; zi++) {
          const minZ = zCuts[zi], maxZ = zCuts[zi + 1];
          if (maxZ - minZ < 0.02) continue;
          const cx = (minX + maxX) * 0.5, cz = (minZ + maxZ) * 0.5;
          const inLowerFlightWell = cx > stairStartX - stairClearance && cx < stairEndX + stairClearance &&
            cz > stairZ - stairClearance && cz < stairZ + stairClearance;
          const inUpperFlightWell = cx > stairEndX - stairClearance && cx < stairEndX + stairClearance &&
            cz > stairZ - stairClearance && cz < stairZ + 6.0 + stairClearance;
          if (inLowerFlightWell || inUpperFlightWell) continue;
          addUpperSupport(`abandoned_house_upper_floor_support_${xi}_${zi}`, maxX - minX, maxZ - minZ, cx, cz);
        }
      }

      // Functional L stair sized to the 1.7 m player: two 6 m runs, 15
      // risers per run (~20 cm each), with a turning landing between them.
      // Treads reuse the house's existing material and one instanced draw call.
      const treadCount = 15;
      const treadWidth = 1.35;
      const treadDepth = 0.46;
      const runLength = 6.0;
      const risePerStep = (houseUpperFloorTopY - houseFloorTopY) / (treadCount * 2);
      const stairMaterial = (Array.isArray(houseMesh?.material) ? houseMesh?.material[0] : houseMesh?.material)?.clone();
      if (stairMaterial) {
        const treadGeometry = new THREE.BoxGeometry(treadWidth, 0.18, treadDepth);
        const treads = new THREE.InstancedMesh(treadGeometry, stairMaterial, treadCount * 2);
        treads.name = 'abandoned_house_l_stair_treads';
        const matrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3(1, 1, 1);
        let instance = 0;
        // First flight runs along X, so its 1.35 m tread width rotates across Z.
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
        for (let i = 0; i < treadCount; i++) {
          const x = supportMinX + 0.75 + i * (runLength / (treadCount - 1));
          const y = houseFloorTopY + (i + 1) * risePerStep - 0.09;
          matrix.compose(new THREE.Vector3(x, y, supportMinZ + 1.0), quaternion, scale);
          treads.setMatrixAt(instance++, matrix);
        }
        quaternion.identity();
        for (let i = 0; i < treadCount; i++) {
          const z = supportMinZ + 1.0 + i * (runLength / (treadCount - 1));
          const y = houseFloorTopY + (treadCount + i + 1) * risePerStep - 0.09;
          quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
          matrix.compose(new THREE.Vector3(supportMinX + 0.75 + runLength, y, z), quaternion, scale);
          treads.setMatrixAt(instance++, matrix);
        }
        treads.instanceMatrix.needsUpdate = true;
        this.sceneManager.scene.add(treads);
      }
      // Matching invisible step tops make the stair follow the controller's
      // normal 20 cm step-up path. The mesh is instanced, so all 30 supports
      // add one draw call and avoid a long unsupported ramp snap.
      const stairStepSupports = new THREE.InstancedMesh(
        new THREE.BoxGeometry(treadWidth, risePerStep, treadDepth), supportMaterial, treadCount * 2
      );
      stairStepSupports.name = 'abandoned_house_stair_step_supports';
      stairStepSupports.userData.walkableSupport = true;
      const stepMatrix = new THREE.Matrix4();
      const stepRotation = new THREE.Quaternion();
      const stepScale = new THREE.Vector3(1, 1, 1);
      let stepInstance = 0;
      stepRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      for (let i = 0; i < treadCount; i++) {
        const x = stairStartX + i * (runLength / (treadCount - 1));
        const y = houseFloorTopY + (i + 1) * risePerStep - risePerStep / 2;
        stepMatrix.compose(new THREE.Vector3(x, y, stairZ), stepRotation, stepScale);
        stairStepSupports.setMatrixAt(stepInstance++, stepMatrix);
      }
      stepRotation.identity();
      for (let i = 0; i < treadCount; i++) {
        const z = stairZ + i * (runLength / (treadCount - 1));
        const y = houseFloorTopY + (treadCount + i + 1) * risePerStep - risePerStep / 2;
        stepMatrix.compose(new THREE.Vector3(stairEndX, y, z), stepRotation, stepScale);
        stairStepSupports.setMatrixAt(stepInstance++, stepMatrix);
      }
      stairStepSupports.instanceMatrix.needsUpdate = true;
      this.sceneManager.scene.add(stairStepSupports);
      const addWalkableRamp = (name: string, length: number, center: THREE.Vector3, alongX: boolean, rise: number) => {
        const support = new THREE.Mesh(new THREE.BoxGeometry(alongX ? length : treadWidth, 0.1, alongX ? treadWidth : length), supportMaterial);
        support.name = name;
        support.position.copy(center);
        support.rotation.z = alongX ? Math.atan2(rise, length) : 0;
        if (!alongX) support.rotation.x = -Math.atan2(rise, length);
        support.userData.walkableSupport = true;
        this.sceneManager.scene.add(support);
        return support;
      };
      const landingY = houseFloorTopY + treadCount * risePerStep;
      const lowerRamp = addWalkableRamp('abandoned_house_lower_stair_ramp_support', runLength,
        new THREE.Vector3(stairStartX + runLength / 2, houseFloorTopY + (landingY - houseFloorTopY) / 2, stairZ), true, landingY - houseFloorTopY);
      const upperRamp = addWalkableRamp('abandoned_house_upper_stair_ramp_support', runLength,
        new THREE.Vector3(stairStartX + runLength, landingY + (houseUpperFloorTopY - landingY) / 2, stairZ + runLength / 2), false, houseUpperFloorTopY - landingY);
      const landing = new THREE.Mesh(new THREE.BoxGeometry(treadWidth, 0.12, treadWidth), supportMaterial);
      landing.name = 'abandoned_house_stair_landing_support';
      landing.position.set(stairStartX + runLength, landingY - 0.06, stairZ);
      landing.userData.walkableSupport = true;
      this.sceneManager.scene.add(landing);

      // Small top landing bridges the stair opening onto the authored upper
      // deck. It overlaps the surrounding floor by design so there is no lip.
      const topLanding = new THREE.Mesh(new THREE.BoxGeometry(treadWidth + 0.12, 0.14, 1.45), stairMaterial ?? supportMaterial);
      topLanding.name = 'abandoned_house_upper_stair_landing';
      topLanding.position.set(stairEndX, houseUpperFloorTopY - 0.07, stairZ + runLength + 0.45);
      this.sceneManager.scene.add(topLanding);
      const topLandingSupport = new THREE.Mesh(new THREE.BoxGeometry(treadWidth + 0.12, 0.14, 1.45), supportMaterial);
      topLandingSupport.name = 'abandoned_house_upper_stair_landing_support';
      topLandingSupport.position.copy(topLanding.position);
      topLandingSupport.userData.walkableSupport = true;
      this.sceneManager.scene.add(topLandingSupport);

      // Handrails sit just outside the 1.35 m clear walking width. They reuse
      // the cabin timber material, with four meshes total and no added lights.
      if (stairMaterial) {
        const railGeometry = new THREE.BoxGeometry(runLength + 0.12, 0.12, 0.10);
        const lowerAngle = Math.atan2(landingY - houseFloorTopY, runLength);
        const upperAngle = Math.atan2(houseUpperFloorTopY - landingY, runLength);
        const addRail = (name: string, position: THREE.Vector3, rotation: THREE.Euler) => {
          const rail = new THREE.Mesh(railGeometry, stairMaterial);
          rail.name = name;
          rail.position.copy(position);
          rail.rotation.copy(rotation);
          // The curved turn is narrow; keep the handrails visual so their
          // expanded capsule bounds cannot seal the landing transition.
          collisionRoot.add(rail);
        };
        for (const side of [-1, 1]) {
          addRail(`abandoned_house_lower_stair_rail_${side}`, new THREE.Vector3(
            stairStartX + runLength * 0.5,
            houseFloorTopY + (landingY - houseFloorTopY) * 0.5 + 0.72,
            stairZ + side * 0.78
          ), new THREE.Euler(0, 0, lowerAngle));
          addRail(`abandoned_house_upper_stair_rail_${side}`, new THREE.Vector3(
            stairEndX + side * 0.78,
            landingY + (houseUpperFloorTopY - landingY) * 0.5 + 0.72,
            stairZ + runLength * 0.5
          ), new THREE.Euler(-upperAngle, Math.PI / 2, 0));
        }
      }

      this.levelColliders.push(collisionRoot, this.optionalHouseFloorCollider, ...upperSupports, lowerRamp, upperRamp, landing, topLandingSupport, stairStepSupports);

      // Two restrained warm fills make the aged timber readable indoors.
      // They cast no shadows and switch off outside the cabin's nearby region.
      const cabinLighting = new THREE.Group();
      cabinLighting.name = 'abandoned_house_warm_practical_lighting';
      cabinLighting.visible = playerPos.distanceToSquared(this.highHouseCenter) < 30 * 30;
      const lowerWarmFill = new THREE.PointLight(0xffb477, 1.7, 9, 2);
      lowerWarmFill.name = 'abandoned_house_lower_warm_fill';
      lowerWarmFill.position.set(this.highHouseCenter.x + 1.2, houseFloorTopY + 2.4, this.highHouseCenter.z + 1.0);
      lowerWarmFill.castShadow = false;
      const upperWarmFill = new THREE.PointLight(0xffc184, 1.5, 8, 2);
      upperWarmFill.name = 'abandoned_house_upper_warm_fill';
      upperWarmFill.position.set(stairEndX + 2.0, houseUpperFloorTopY + 2.1, stairZ + 4.5);
      upperWarmFill.castShadow = false;
      cabinLighting.add(lowerWarmFill, upperWarmFill);
      this.sceneManager.scene.add(cabinLighting);
      this.optionalHouseLightingGroup = cabinLighting;

      this.player.setColliders(this.levelColliders);
      this.cameraController.setCollisionObjects(this.levelColliders);
      this.optionalArchitectureStarted = true;
      this.optionalArchitectureLoading = false;
      const triangleCount = houseMesh?.geometry.index?.count
        ? houseMesh.geometry.index.count / 3
        : (houseMesh?.geometry.getAttribute('position')?.count ?? 0) / 3;
      console.info(`[LevelToyStory] Loaded original high-house visual (${Math.round(triangleCount).toLocaleString()} tris) in ${Math.round(performance.now() - loadStartedAt)}ms; added an interior two-run stair and a matching upper-deck opening.`);
    }, undefined, (error) => {
      this.optionalArchitectureLoading = false;
      console.warn('[LevelToyStory] Optional high-house annex could not load.', error);
    });
  }

  private async transitionCuriosityCrypt(entering: boolean): Promise<void> {
    if (this.curiosityCryptTransitioning || !this.isLavaVaultOpen) return;
    const transitionStartedAt = performance.now();
    let fadeOutMs = 0;
    let sceneSwapMs = 0;
    let fadeInMs = 0;
    this.curiosityCryptTransitioning = true;
    this.isTeleportingToCrypt = entering;
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.player.velocity.set(0, 0, 0);
    const hud = (window as any).gameInstance?.hud;
    const cameraController = (window as any).gameInstance?.cameraController;
    hud?.hideInteractionPrompt();
    let screenIsFadedOut = false;
    try {
      if (hud) {
        const phaseStart = performance.now();
        await hud.fadeScreenOut(90);
        fadeOutMs = performance.now() - phaseStart;
        screenIsFadedOut = true;
      }
      const sceneSwapStartedAt = performance.now();
      if (entering) {
        // Switch the ground resolver before moving under the terrain. Otherwise
        // the next physics frame can snap Wukong back to the temple surface.
        this.isInsideCuriosityCrypt = true;
        // The outdoor terrain and its instanced grass used to remain drawn
        // above the underground room, occluding its guardians, altar, and
        // light. The crypt has its own floor and domed roof, so hide only those
        // outdoor ground meshes while inside and restore them on exit.
        if (this.worldTerrainMesh) this.worldTerrainMesh.visible = false;
        this.grassSectors.forEach((sector) => { sector.visible = false; });
        this.grassCullElapsed = 0;
        for (const guardian of this.cryptGuardians) {
          if (!guardian.isAlive()) {
            guardian.mesh.visible = false;
            continue;
          }
          const spawn = guardian.patrolWaypoints[0];
          if (spawn) guardian.mesh.position.copy(spawn);
          guardian.mesh.position.y = this.curiosityCryptFloorY;
          guardian.mesh.updateMatrixWorld(true);
          guardian.mesh.visible = true;
        }
        // Land on the authored underground floor immediately. Mark the player
        // grounded as part of the teleport so the outdoor terrain resolver
        // cannot interpret the first frame as a fall through to the temple.
        this.player.mesh.position.copy(this.curiosityCryptRoomEntry);
        this.player.mesh.position.y = this.curiosityCryptFloorY;
        this.player.isGrounded = true;
        this.player.jumpCount = 0;
        this.player.mesh.updateMatrixWorld(true);
      } else {
        for (const guardian of this.cryptGuardians) guardian.mesh.visible = false;
        this.player.mesh.position.set(this.curiosityCryptSurface.x, this.curiosityCryptSurface.y + 0.08, this.curiosityCryptSurface.z + 3.0);
        this.isInsideCuriosityCrypt = false;
        if (this.worldTerrainMesh) this.worldTerrainMesh.visible = true;
        this.grassCullElapsed = 0;
        this.player.isGrounded = false;
        this.player.mesh.updateMatrixWorld(true);
      }
      sceneSwapMs = performance.now() - sceneSwapStartedAt;
      this.player.mesh.rotation.y = entering ? Math.PI / 2 : Math.PI;
      this.player.velocity.set(0, 0, 0);
      cameraController?.snapBehindTarget();
      if (hud) {
        const phaseStart = performance.now();
        await hud.fadeScreenIn(110);
        fadeInMs = performance.now() - phaseStart;
        screenIsFadedOut = false;
      }
      if (entering && !this.curiosityChestOpen && !this.cryptGuardiansCleared) {
        hud?.showInfoToast(
          'CRIPTA DE LA CURIOSIDAD',
          'Vence a los guardianes de la cripta para desbloquear el tesoro del cofre.',
          6000,
          3,
        );
      }
      if (import.meta.env.DEV) {
        console.info('[CuriosityVaultPerf] Crypt transition completed', {
          direction: entering ? 'enter' : 'exit',
          fadeOutMs: +fadeOutMs.toFixed(1),
          sceneSwapMs: +sceneSwapMs.toFixed(1),
          fadeInMs: +fadeInMs.toFixed(1),
          totalMs: +(performance.now() - transitionStartedAt).toFixed(1),
          guardians: this.cryptGuardians.map((enemy) => ({
            id: enemy.id,
            position: [
              +enemy.mesh.position.x.toFixed(2),
              +enemy.mesh.position.y.toFixed(2),
              +enemy.mesh.position.z.toFixed(2),
            ],
            state: enemy.state,
          })),
        });
      }
      this.subtitleSystem.show(
        'Cripta de la Curiosidad',
        entering ? 'Has llegado a la cámara secreta.' : 'Has regresado al exterior.'
      );
    } catch (error) {
      console.error('[CuriosityVault] Entrance transition failed.', error);
    } finally {
      if (hud && screenIsFadedOut) await hud.fadeScreenIn(100);
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.player.velocity.set(0, 0, 0);
      this.isTeleportingToCrypt = false;
      this.curiosityCryptTransitioning = false;
    }
  }

  public restoreCuriosityPuzzle(hatchOpen: boolean, chestOpen: boolean, preserveLegacyExit = false): void {
    this.isLavaVaultOpen = hatchOpen;
    this.hatchTarget = hatchOpen ? 1 : 0;
    this.hatchOpenProgress = this.hatchTarget;
    this.leverTarget = hatchOpen ? -Math.PI / 4 : Math.PI / 4;
    if (this.hatchPivot) this.hatchPivot.rotation.x = -this.hatchOpenProgress * Math.PI * 0.5;
    if (this.cryptPortalMaterial) this.cryptPortalMaterial.uniforms.uActivation.value = this.hatchOpenProgress;
    if (this.portalAsset) this.portalAsset.scale.y = 1.12 * (0.82 + this.hatchOpenProgress * 0.18);
    if (this.cryptEntranceGlow) {
      this.cryptEntranceGlow.intensity = 0.7 + this.hatchOpenProgress * 4.1;
      this.cryptEntranceGlow.distance = 5.5 + this.hatchOpenProgress * 5.5;
    }
    if (this.curiosityCryptMouth) this.curiosityCryptMouth.visible = hatchOpen;
    if (this.dragonLeverStick) this.dragonLeverStick.rotation.x = this.leverTarget;
    this.curiosityChestOpen = chestOpen;
    if (chestOpen) {
      this.cryptGuardiansCleared = true;
      this.curiosityKeyRewardReady = true;
      this.curiosityChest.restoreOpen();
      if (!this.collectedKeys.key4_curiosity) {
        this.curiosityKeySpawned = true;
        this.spawn3DKey('key4_curiosity', this.curiosityChest.mesh.position.clone().add(new THREE.Vector3(0, 1.08, 0)), false);
      }
    }
    if (preserveLegacyExit && this.exitDoor) this.exitDoor.open();
  }

  public restoreBossDefeated(): void {
    if (!this.stateFlags.bossDefeated || !this.bossEnemy) return;
    this.bossEncounterActive = false;
    this.stateFlags.bossCinematicPlayed = true;
    if (!this.collectedKeys.key2_boss) {
      this.spawn3DKey('key2_boss', new THREE.Vector3(45, this.getTerrainHeight(45, -40) + 1.2, -40));
    }
    this.bossEnemy.dispose();
    (window as any).gameInstance?.hud?.hideBossHealth();
  }

  public restoreStaffChest(): void {
    if (this.stateFlags.staffFound) this.staffChest.restoreOpen(false);
  }

  private showCombatControlsHint(): void {
    const hud = (window as any).gameInstance?.hud;
    const hint = hud?.isTouchDevice?.()
      ? 'Pulsa Golpe para atacar con el báculo o dar una patada.'
      : 'Presiona [Click Izquierdo] para atacar con tu Báculo o [Ctrl] para Patear.';
    this.subtitleSystem.show('¡ALERTA DE COMBATE!', `⚔️ ${hint}`, 5000);
  }

  private handleBossPlayerRespawn(): void {
    if (!this.bossEncounterActive || this.stateFlags.bossDefeated) return;
    this.bossEncounterActive = false;
    this.isCinematicPlaying = false;
    this.stateFlags.bossCinematicPlayed = false;
    this.player.isControlsLocked = false;
    this.player.isMovementLocked = false;
    this.player.isAttacking = false;
    this.bossEnemy.isPaused = false;
    this.bossEnemy.resetBossEncounter();
    this.enemies.forEach(enemy => { if (enemy.id !== 'crab_boss') enemy.isPaused = false; });
    (window as any).gameInstance?.hud?.hideBossHealth();
    void this.audioManager.stopBossMusic();
  }

  private exitBossEncounter(): void {
    if (!this.bossEncounterActive || this.stateFlags.bossDefeated) return;
    this.bossEncounterActive = false;
    this.stateFlags.bossCinematicPlayed = false;
    this.bossEnemy.isPaused = false;
    this.bossEnemy.resetBossEncounter();
    this.enemies.forEach(enemy => { if (enemy.id !== 'crab_boss') enemy.isPaused = false; });
    (window as any).gameInstance?.hud?.hideBossHealth();
    void this.audioManager.stopBossMusic();
  }

  private async runBossCinematic(): Promise<void> {
    const game = (window as any).gameInstance;
    if (game?.menuState !== 'Playing' || this.player.health <= 0 || this.bossEncounterActive || this.stateFlags.bossDefeated) {
      game?.hud?.hideBossHealth();
      return;
    }
    const cinematicCamera = game?.cinematicCamera;
    const cameraController = game?.cameraController;
    const hud = game?.hud;
    if (!cinematicCamera || !cameraController || !hud) return;

    this.bossEncounterActive = true;
    void preloadKeyModel('key2_boss').catch((error) => console.warn('[KEY] Boss reward preload failed.', error));
    this.isCinematicPlaying = true;
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.player.isAttacking = false;
    this.player.forceIdle();
    // Reuse the exact Step_Backward reaction that plays for the tree-snake
    // ambush, without its surprise icon; it gives Wukong the requested ready
    // stance as the boss encounter begins, without adding a new animation.
    this.player.animationController.playSnakeSurprise();
    this.enemies.forEach(enemy => { enemy.isPaused = true; });
    this.bossEnemy.isPaused = true;
    this.bossEnemy.mesh.position.copy(this.bossEnemy.arenaCenter!);
    this.bossEnemy.mesh.rotation.set(0, 0, 0);
    const bossHudToken: symbol = hud.beginBossEncounter();
    this.subtitleSystem.hide();
    void this.audioManager.startBossMusic();

    const playerPos = this.player.mesh.position;
    const bossPos = this.bossEnemy.mesh.position;
    const fromBoss = new THREE.Vector3(playerPos.x - bossPos.x, 0, playerPos.z - bossPos.z);
    if (fromBoss.lengthSq() < 0.01) fromBoss.set(0, 0, 1);
    fromBoss.normalize();
    this.player.mesh.rotation.y = Math.atan2(bossPos.x - playerPos.x, bossPos.z - playerPos.z);

    const camera = cameraController.camera as THREE.PerspectiveCamera;
    const startPos = camera.position.clone();
    const startForward = camera.getWorldDirection(new THREE.Vector3());
    const startLookAt = startPos.clone().addScaledVector(startForward, 7);
    const side = new THREE.Vector3(-fromBoss.z, 0, fromBoss.x);
    const endPos = bossPos.clone().addScaledVector(fromBoss, 7).addScaledVector(side, 2.2);
    endPos.y += 3.1;
    const endLookAt = bossPos.clone().add(new THREE.Vector3(0, 1.2, 0));
    const cameraMove = cinematicCamera.moveCamera(startPos, endPos, startLookAt, endLookAt, 1.35);

    let cinematicFinished = false;
    let autoFinishTimer = 0;
    const finishCinematic = () => {
      if (cinematicFinished) return;
      cinematicFinished = true;
      if (!hud.isBossEncounterCurrent(bossHudToken)) {
        window.clearTimeout(autoFinishTimer);
        window.removeEventListener('keydown', skipHandler);
        return;
      }
      window.clearTimeout(autoFinishTimer);
      window.removeEventListener('keydown', skipHandler);
      hud.hideDialogue();
      cinematicCamera.abort();
      cameraController.target = this.player.mesh;
      cameraController.resumeAfterCinematic();
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.enemies.forEach(enemy => { enemy.isPaused = false; });
      this.bossEnemy.state = 'CHASE';
      this.bossEnemy.isPaused = false;
      this.bossEncounterActive = true;
      this.isCinematicPlaying = false;
      // The entrance cinematic can finish after a reset/menu transition. The
      // meter belongs only to the live boss encounter in active gameplay.
      if (game.menuState === 'Playing' && !this.stateFlags.bossDefeated && this.bossEnemy.isAlive()) {
        hud.revealBossHealth(this.bossEnemy.health, this.bossEnemy.maxHealth, bossHudToken);
      } else {
        this.bossEncounterActive = false;
        hud.hideBossHealth();
      }
    };
    const skipHandler = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter' || event.code === 'Escape') {
        event.preventDefault();
        finishCinematic();
      }
    };
    window.addEventListener('keydown', skipHandler);
    hud.showTypewriterDialogue(
      'Cangrejo',
      '¡Esquiva las marcas del suelo! Cuando se canse, acércate y golpéalo.',
      () => {
        if (!cinematicFinished) autoFinishTimer = window.setTimeout(finishCinematic, 1300);
      },
      { type: 'boss', focusPoints: [
        ...projectDialogueFocus(this.bossEnemy?.mesh, (window as any).gameInstance?.cameraController?.camera, 1.3, 2.6),
        ...projectDialogueFocus(this.player.mesh, (window as any).gameInstance?.cameraController?.camera, 1.2, 1.7),
      ] }
    );

    try {
      await cameraMove;
    } catch (error) {
      console.warn('[Boss Cinematic] Camera move ended early:', error);
      finishCinematic();
    }
  }

  private setSkyDebugPanelVisible(visible: boolean): void {
    const panel = this.skyDebugPanel?.parentElement;
    if (panel) panel.style.display = visible ? '' : 'none';
  }

  private createSkyDebugPanel(): void {
    // Sky tuning controls belong to the developer server only. Vite replaces
    // DEV with false in public builds, so this panel cannot appear for players.
    if (!import.meta.env.DEV || this.skyDebugPanel) return;
    // Keep the selector and the actual world clock in sync on first launch.
    this.dayNightCycle?.setHour(21);
    this.dayNightCycle?.setTimeScale(1);
    const panel = document.createElement('div');
    panel.setAttribute('aria-label', 'Depuración del ciclo celeste');
    Object.assign(panel.style, {
      // Keep developer-only sky controls below the compact Silvio/Loki tracker.
      // At 92 px they overlaid its timer and letters, making the mission HUD
      // look clipped or like an older panel was still mounted.
      position: 'fixed', right: '10px', top: '182px', zIndex: '1500',
      maxWidth: 'min(360px, calc(100vw - 20px))', padding: '8px 10px',
      border: '1px solid #d8ad53', borderRadius: '8px',
      background: 'rgba(10, 15, 31, .88)', color: '#ffe4a0',
      font: '12px/1.35 system-ui, sans-serif', pointerEvents: 'auto'
    });
    const row = document.createElement('div');
    Object.assign(row.style, { display: 'flex', gap: '6px', marginTop: '5px', flexWrap: 'wrap' });
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Hora del juego');
    const hours = ['00:00','04:59','05:00','05:59','06:00','06:59','07:00','07:59','08:00','12:00','16:59','17:00','17:59','18:00','18:59','19:00','19:59','20:00','21:00','23:59'];
    hours.forEach((label) => {
      const option = document.createElement('option'); option.value = label;
      option.textContent = label; if (label === '21:00') option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener('change', () => {
      const [h, m] = select.value.split(':').map(Number);
      this.dayNightCycle?.setHour(h + m / 60);
    });
    const pause = document.createElement('button');
    pause.textContent = 'Detener reloj';
    pause.addEventListener('click', () => {
      if (!this.dayNightCycle) return;
      this.dayNightCycle.setPaused(!this.dayNightCycle.paused);
      pause.textContent = this.dayNightCycle.paused ? 'Reanudar reloj' : 'Detener reloj';
    });
    const speedWrap = document.createElement('label');
    speedWrap.style.cssText = 'display:inline-flex;align-items:center;gap:5px';
    const speed = document.createElement('input');
    speed.type = 'range'; speed.min = '0'; speed.max = '120'; speed.step = '0.1'; speed.value = '1';
    speed.setAttribute('aria-label', 'Velocidad del ciclo celeste');
    const speedValue = document.createElement('span');
    speedValue.textContent = '1.0×';
    speed.addEventListener('input', () => {
      const scale = Number(speed.value);
      this.dayNightCycle?.setTimeScale(scale);
      speedValue.textContent = `${scale.toFixed(1)}×`;
    });
    speedWrap.append(speed, speedValue);
    [select, pause, speedWrap].forEach((control) => {
      Object.assign(control.style, { color: '#ffe4a0', background: '#171525', border: '1px solid #806a42', borderRadius: '4px', padding: '3px 5px' });
      row.appendChild(control);
    });
    panel.appendChild(row);
    const status = document.createElement('div'); status.style.marginTop = '5px';
    status.textContent = 'CIELO DEV'; panel.appendChild(status);
    this.skyDebugPanel = status;
    document.body.appendChild(panel);
  }

}


