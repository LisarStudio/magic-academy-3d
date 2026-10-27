import * as THREE from 'three';
import { isLowPowerDevice } from '../core/DevicePerformance';
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
import { LampMothSystem } from '../world/LampMothSystem';
import { ConstellationSystem } from '../world/ConstellationSystem';
import { VolcanicDragonRun } from './VolcanicDragonRun';
import { PowerOrbSystem, type StaffUpgradeInfo } from '../collectibles/PowerOrbSystem';

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
    key3_platform: false, // high tower
    key4_curiosity: false,
    key5_pots: false,
    key6_gargoyles: false
  };
  public totalKeysCount = 0;

  // Level Entities
  private staffChest!: TreasureChest;
  public exitDoor!: Door;
  private gekkoNPC!: GekkoNPC;
  private floatingCoinMesh!: THREE.Group;
  private dragonSwitchMesh!: THREE.Group;
  private dragonLeverStick!: THREE.Mesh;
  public isLavaVaultOpen = false;
  private lavaVaultHatch!: THREE.Mesh;
  private curiosityCryptMouth!: THREE.Group;
  private curiosityCryptTrail!: THREE.Group;
  private grassUniforms: any = null;
  private grassSectors: THREE.InstancedMesh[] = [];
  private terrainGroundMaterial: THREE.MeshStandardMaterial | null = null;
  private grassLoadStarted = false;
  private grassLoadPromise: Promise<void> | null = null;
  private grassCullElapsed = 0;
  private grassQuality = 0.85;
  private centralTempleObject: THREE.Object3D | null = null;
  private structureColliderCandidates: Array<{ root: THREE.Object3D; center: THREE.Vector3; radius: number; active: boolean }> = [];
  private cloudsUniforms: any = null;
  private lampMoths: LampMothSystem | null = null;
  private constellationSystem: ConstellationSystem | null = null;
  private optionalArchitectureStarted = false;
  private optionalArchitectureLoading = false;
  private readonly highHouseCenter = new THREE.Vector3(38, 0, -92);
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
  public curiosityChestOpen = false;
  private curiosityKeySpawned = false;
  private hatchPivot!: THREE.Group;
  private hatchOpenProgress = 0;
  private hatchTarget = 0;
  // Set the crypt away from the paved route so its reveal never obstructs the
  // approach to the temple or its stair landing.
  private readonly curiosityCryptSurface = new THREE.Vector3(-57, 0, -61);
  private readonly npcGazePoint = new THREE.Vector3();
  private readonly curiosityCryptRoomEntry = new THREE.Vector3(-9.8, -5.82, -40);
  private isInsideCuriosityCrypt = false;
  private curiosityCryptTransitioning = false;
  private canopyTrial: { base: THREE.Vector3; top: THREE.Vector3; middle: THREE.Vector3; landing: THREE.Vector3; firstPath: THREE.QuadraticBezierCurve3; secondPath: THREE.QuadraticBezierCurve3 } | null = null;
  private canopyTutorialShown = false;
  private canopyAtTop = false;
  private canopyAtMid = false;
  private canopyRewardClaimed = false;
  private canopyChest: TreasureChest | null = null;
  private canopyChestOpen = false;
  private canopyRewardHint: THREE.Object3D | null = null;
  private canopyTraversal: 'climb' | 'top' | 'swing' | null = null;
  private canopyTraversalCurve: THREE.QuadraticBezierCurve3 | null = null;
  private canopyTraversalElapsed = 0;
  private canopyTraversalDuration = 1.2;
  private leverTarget = Math.PI / 4;
  private readonly secretLavaCenter = new THREE.Vector2(66, -105);
  private secretLavaY = -11.2;

  public getTerrainHeight(x: number, z: number): number {
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
    const naturalHeight = (hill1 + hill2 + knoll) * blend;
    // Remote eastern volcanic basin: the same terrain function drives the
    // visible surface, foliage placement, and the player ground ray.
    const lavaDistance = Math.hypot(x - 66, z + 105);
    const basinBlend = 1 - THREE.MathUtils.smoothstep(lavaDistance, 15, 36);
    return THREE.MathUtils.lerp(naturalHeight, -13.2, basinBlend);
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
    key1_gekko: { id: 'key1_gekko', name: 'Llave de la Riqueza (Gekko)', color: 0xff6600, emissiveColor: 0xff8800, obtained: false },
    key2_boss: { id: 'key2_boss', name: 'Llave de la Valentía (Jefe Cangrejo)', color: 0xff2200, emissiveColor: 0xff4400, obtained: false },
    key3_platform: { id: 'key3_platform', name: 'Llave de Plataformas (Tejado)', color: 0x00e5ff, emissiveColor: 0x00bfff, obtained: false },
    key4_curiosity: { id: 'key4_curiosity', name: 'Llave de la Curiosidad', color: 0xffdc62, emissiveColor: 0xffb51b, obtained: false },
    key6_gargoyles: { id: 'key6_gargoyles', name: 'Llave del Secreto (Gargolas)', color: 0xa855f7, emissiveColor: 0x9333ea, obtained: false },
    key5_pots: { id: 'key5_pots', name: 'Llave de Destrucción (Gemas)', color: 0xffd700, emissiveColor: 0xffaa00, obtained: false },
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
    levelCompleted: false
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
    this.player.onRespawn = () => queueMicrotask(() => this.handleBossPlayerRespawn());
  }

  public async init(): Promise<void> {
    this.buildToyStoryLevelGeometry();
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

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.5);
    const hemiLight = new THREE.HemisphereLight(0x1e293b, 0x020617, 0.4);
    
    const moonLight = new THREE.DirectionalLight(0xb4d3fe, 1.2);
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

    // Warm accent lights for depth & contrast (Castle entrance + Torch warmth)
    const entranceTorch = new THREE.PointLight(0xffa544, 2.5, 18);
    entranceTorch.position.set(0, 3.0, -25.5);
    scene.add(entranceTorch);

    const entranceTorch2 = new THREE.PointLight(0xffa544, 2.5, 18);
    entranceTorch2.position.set(-6, 3.0, -25.5);
    scene.add(entranceTorch2);

    // Subtle Rim Light from rear for separation of Wukong and Castle silhouettes
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-30, 20, -80);

    scene.add(ambientLight, hemiLight, moonLight, rimLight);

    // Create glowing celestial Moon
    const moonGeo = new THREE.SphereGeometry(6, 24, 24);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(40, 80, -60);

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
    scene.add(moonMesh);

    // Create Procedural AAA Stylized Clouds Dome
    const cloudDomeGeo = new THREE.SphereGeometry(140, 32, 24);
    const cloudMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSkyColor: { value: new THREE.Color(0x020617) },
        uCloudColor: { value: new THREE.Color(0x1e293b) },
        uMoonColor: { value: new THREE.Color(0x93c5fd) },
        uMoonPos: { value: new THREE.Vector3(40, 80, -60) }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uSkyColor;
        uniform vec3 uCloudColor;
        uniform vec3 uMoonColor;
        uniform vec3 uMoonPos;

        varying vec3 vWorldPosition;

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

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPosition);
          if (dir.y < -0.05) discard;

          vec2 uv1 = dir.xz * 2.5 + vec2(uTime * 0.012, uTime * 0.008);
          float n1 = fbm(uv1);

          vec2 uv2 = dir.xz * 4.5 + vec2(-uTime * 0.02, uTime * 0.015);
          float n2 = fbm(uv2);

          float cloudDensity = smoothstep(0.45, 0.75, n1 * 0.65 + n2 * 0.35);
          
          float horizonFade = smoothstep(-0.02, 0.3, dir.y);
          cloudDensity *= horizonFade;

          vec3 moonDir = normalize(uMoonPos);
          float moonRim = max(0.0, dot(dir, moonDir));
          float moonGlow = pow(moonRim, 6.0) * cloudDensity * 0.8;

          vec3 finalColor = mix(uSkyColor, uCloudColor, cloudDensity * 0.65);
          finalColor += uMoonColor * moonGlow;

          gl_FragColor = vec4(finalColor, cloudDensity * 0.55 * horizonFade);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    const skyDome = new THREE.Mesh(cloudDomeGeo, cloudMat);
    scene.add(skyDome);
    this.cloudsUniforms = cloudMat.uniforms;

    // Create Starfield above the map
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const radius = 125 + Math.random() * 15;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = Math.abs(radius * Math.sin(phi) * Math.sin(theta)) + 10;
      const z = radius * Math.cos(phi);
      
      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      const intensity = 0.5 + Math.random() * 0.5;
      starColors[i * 3] = intensity;
      starColors[i * 3 + 1] = intensity;
      starColors[i * 3 + 2] = intensity;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Initialize Dynamic Celestial Day/Night Cycle (Night -> Pre-Dawn -> Dawn -> Sunrise -> Morning)
    this.dayNightCycle = new DayNightCycle(
      scene,
      this.sceneManager.dirLight,
      this.sceneManager.ambientLight,
      this.cloudsUniforms,
      { cycleDuration: 240.0, startPhase: 0.05, renderer: this.sceneManager.renderer }
    );
    this.constellationSystem = new ConstellationSystem(scene, this.cameraController.camera);

    // Add key visual hints
    this.spawnKeysInWorld();

    // Warm only the key/reward materials against the real light configuration.
    // Do this before gameplay on every device so first collection never pays
    // shader compilation or GPU resource creation costs.
    const pickupWarmups = await Promise.allSettled([
      KeyPickupSequence.precompileShaders(this.sceneManager.renderer, this.sceneManager.camera, scene),
      this.powerOrbSystem.precompileShaders(this.sceneManager.renderer, this.sceneManager.camera, scene),
    ]);
    pickupWarmups.forEach((result) => {
      if (result.status === 'rejected') console.warn('[Level] Pickup shader warmup failed; cached emissive fallback remains active.', result.reason);
    });

    this.checkpointManager.respawnPlayer(this.player);
    // Load the visual identity before play so the in-game loader can report real
    // resource progress and the first playable frame includes the temple assets.
    await this.loadIntroEnvironmentAssets();
    // Build the original grass in yielding sector batches after level setup.
    void this.loadGrassInBackground();
  }

  /** Adds the pavilion and a subtle green ground texture as scenery only. */
  private async loadIntroEnvironmentAssets(): Promise<void> {
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    const version = `?v=${__APP_VERSION__}`;
    const mobileTextures = isLowPowerDevice();
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
      placeAsset(pavilion, 'chinese_pavilion_west_landmark', 8.5, -55, -75);
      this.addPavilionCollision(mainPavilion);
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
      this.addTempleCollision(routeTemple);
      this.addTempleStoneFloor(routeTemple);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Temple asset.', templeResult.reason);
    }

    if (lionResult.status === 'fulfilled') {
      // Place the two authored statues at the actual stair-side markers. Move
      // each model node independently so their authored spacing cannot collapse
      // into a single cluster when the source is scaled.
      const guardians = placeAsset(lionResult.value.scene, 'chinese_porcelain_guardian_pair', 7.0, 0, -27.1, Math.PI);
      guardians.updateMatrixWorld(true);
      const lionNodes = ['Chinese Porcelain Lion.001', 'Chinese Porcelain Lion.002']
        .map((name) => guardians.getObjectByName(name)).filter((node): node is THREE.Object3D => !!node);
      const ground = this.getTerrainHeight(0, -30.4);
      const guardianXs = [-11.2, 11.2];
      const guardianBounds: THREE.Box3[] = [];
      lionNodes.forEach((node, index) => {
        const bounds = new THREE.Box3().setFromObject(node);
        const current = bounds.getCenter(new THREE.Vector3());
        // Place each statue outside the stair cheek walls at the green marks.
        const target = new THREE.Vector3(guardianXs[index] ?? 11.2, ground + (bounds.max.y - bounds.min.y) * 0.5, -30.4);
        if (node.parent) {
          const localDelta = node.parent.worldToLocal(target.clone()).sub(node.parent.worldToLocal(current.clone()));
          node.position.add(localDelta);
        }
        const worldYaw = Math.atan2(-target.x, 10 - target.z);
        node.rotation.y = worldYaw - guardians.rotation.y;
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
        const blockerHeight = Math.max(1.55, Math.min(2.2, size.y * 0.72));
        const blocker = new THREE.Mesh(new THREE.BoxGeometry(
          Math.max(1.15, size.x * 0.78), blockerHeight, Math.max(1.15, size.z * 0.78)
        ), invisible);
        blocker.position.set(center.x, ground + blockerHeight * 0.5, center.z);
        blocker.name = 'porcelain_guardian_blocker';
        lionColliders.add(blocker);
      });
      this.sceneManager.scene.add(lionColliders);
      this.levelColliders.push(lionColliders);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Porcelain Lion asset.', lionResult.reason);
    }

    if (lampResult.status === 'fulfilled') {
      const lampZ = -30.2;
      const lampGround = this.getTerrainHeight(0, lampZ);
      const lamps = placeAsset(lampResult.value.scene, 'chinese_red_lamp_entry_pair', 3.8, 0, lampZ);
      lamps.position.y += 4.8;
      lamps.updateMatrixWorld(true);
      const anchors: THREE.Vector3[] = [];
      const lampNodes = ['lantern', 'lantern.001'].map((name) => lamps.getObjectByName(name)).filter((node): node is THREE.Object3D => !!node);
      lampNodes.forEach((node, index) => {
        const bounds = new THREE.Box3().setFromObject(node);
        const current = bounds.getCenter(new THREE.Vector3());
        const target = new THREE.Vector3(index === 0 ? -5.9 : 5.9, current.y, lampZ);
        if (node.parent) node.position.add(node.parent.worldToLocal(target).sub(node.parent.worldToLocal(current)));
      });
      lamps.updateMatrixWorld(true);
      for (const node of lampNodes) {
        const bounds = new THREE.Box3().setFromObject(node);
        const center = bounds.getCenter(new THREE.Vector3());
        anchors.push(center.clone());
        // The cord's lower end must coincide with the actual top centre of
        // this individual lantern, and its upper end with the roof above it.
        const lampTop = bounds.max.y + 0.02;
        const ray = new THREE.Raycaster(new THREE.Vector3(center.x, lampGround + 40, center.z), new THREE.Vector3(0, -1, 0), 0, 40);
        const roofHit = this.centralTempleObject
          ? ray.intersectObject(this.centralTempleObject, true).find(hit => hit.point.y > lampTop && hit.point.y < lampGround + 16)
          : undefined;
        const fallbackRoofY = lampGround + 8.5;
        const roofY = roofHit && roofHit.point.y > lampTop + 0.3 ? roofHit.point.y : Math.max(lampTop + 0.5, fallbackRoofY);
        const cordStart = new THREE.Vector3(center.x, lampTop, center.z);
        const cordEnd = new THREE.Vector3(center.x, roofY - 0.025, center.z);
        const cordVector = cordEnd.clone().sub(cordStart);
        const cordLength = cordVector.length();
        const cord = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 1, 6),
          new THREE.MeshStandardMaterial({ color: 0x75432b, roughness: 0.92 })
        );
        cord.name = 'lantern_roof_hanging_cord';
        cord.position.copy(cordStart).addScaledVector(cordVector, 0.5);
        cord.scale.y = cordLength;
        cord.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cordVector.normalize());
        cord.castShadow = false;
        scene.add(cord);
      }
      anchors.forEach((position) => {
        const light = new THREE.PointLight(0xffaa58, 0.9, 7, 2);
        light.position.copy(position);
        light.castShadow = false;
        scene.add(light);
        this.dayNightCycle?.registerNightLight(light);
      });
      const mobile = navigator.maxTouchPoints > 0 && matchMedia('(pointer: coarse)').matches;
      this.lampMoths = new LampMothSystem(scene, anchors, mobile);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese red lamp asset.', lampResult.reason);
    }

    // Existing lantern fill, tuned up to reveal the interior timber and floor
    // at night without adding shadow-casting lights or a global color filter.
    const warmFill = new THREE.PointLight(0xffc98c, 4.8, 30, 2);
    warmFill.position.set(0, this.getTerrainHeight(0, -34) + 6.2, -34);
    warmFill.castShadow = false;
    scene.add(warmFill);
    this.dayNightCycle?.registerNightLight(warmFill);
    this.player.setColliders(this.levelColliders);
    this.cameraController.setCollisionObjects(this.levelColliders);

  }

  /** Use a small set of architectural proxies instead of per-frame raycasts
   * against the 100k-triangle pavilion render mesh. */
  private addPavilionCollision(asset: THREE.Object3D): void {
    const bounds = new THREE.Box3().setFromObject(asset);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const y = this.getTerrainHeight(center.x, center.z);
    const root = new THREE.Group();
    root.name = 'pavilion_low_cost_collision';
    const invisible = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(size.x * 0.82, 0.18, size.z * 0.82), invisible);
    deck.position.set(center.x, y + 0.09, center.z);
    root.add(deck);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, Math.min(5.2, size.y * 0.74), 6), invisible);
      pillar.position.set(center.x + sx * size.x * 0.36, y + Math.min(5.2, size.y * 0.74) * 0.5, center.z + sz * size.z * 0.36);
      root.add(pillar);
    }
    this.sceneManager.scene.add(root);
    this.structureColliderCandidates.push({
      root, center, radius: 20, active: false
    });
  }

  private addTempleCollision(asset: THREE.Object3D): void {
    asset.updateMatrixWorld(true);
    // The overall GLB bounds include the roof eaves. Using them for collision
    // pushed invisible walls several metres outside the real building. The
    // textured asset's wall/panel planes are at roughly ±5.4 source units;
    // roof eaves extend farther and are intentionally excluded.
    const center = new THREE.Vector3(0, 0, -40);
    const modelScale = asset.scale.x;
    const ground = this.getTerrainHeight(0, -40);
    const proxy = new THREE.Group();
    proxy.name = 'central_temple_open_entrance_collision';
    // `visible:false` also disables Mesh.raycast in Three.js. Keep the proxies
    // raycastable while suppressing every framebuffer write.
    const material = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide });
    const wallHeight = 8.5;
    const thickness = 0.34;
    const addWall = (name: string, sx: number, sz: number, x: number, z: number) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(sx, wallHeight, sz), material);
      wall.name = name;
      wall.frustumCulled = false;
      wall.position.set(x, ground + wallHeight * 0.5, z);
      proxy.add(wall);
    };
    // The actual wall/panel footprint is about ±5.4 source units. The larger
    // ±7.9 bounds belong to the roof eaves and must not become invisible walls.
    const halfW = 5.4 * modelScale;
    const halfD = 5.4 * modelScale;
    const sideHalfD = 5.4 * modelScale;
    // After the asset's half-turn, its open south entrance faces +Z. The side
    // and rear proxies meet that plane, leaving only the authored stair/door
    // opening clear. No proxy is based on roof overhang dimensions.
    const frontZ = center.z + halfD;
    const rearZ = center.z - halfD;
    const openingHalf = 2.45;
    addWall('temple_west_wall', thickness, sideHalfD * 2, center.x - halfW, center.z);
    addWall('temple_east_wall', thickness, sideHalfD * 2, center.x + halfW, center.z);
    addWall('temple_rear_wall', halfW * 2, thickness, center.x, rearZ);
    addWall('temple_front_wall_left', halfW - openingHalf, thickness, center.x - (halfW + openingHalf) * 0.5, frontZ);
    addWall('temple_front_wall_right', halfW - openingHalf, thickness, center.x + (halfW + openingHalf) * 0.5, frontZ);
    this.sceneManager.scene.add(proxy);
    // Only keep walls active around the building footprint, not across the
    // surrounding field. A small approach margin still activates them before
    // the player reaches a wall or the stair landing.
    const radius = Math.hypot(halfW, halfD) + 3.0;
    this.structureColliderCandidates.push({ root: proxy, center, radius, active: false });
    this.openTempleEntrance(asset);
  }

  /** Remove only the lower triangles of the south/front door leaf, preserving
   * the surrounding textured timber and the upper façade. */
  private openTempleEntrance(asset: THREE.Object3D): void {
    asset.updateMatrixWorld(true);
    const inverseAssetWorld = asset.matrixWorld.clone().invert();
    asset.traverse((object) => {
      const mesh = object as THREE.Mesh;
      const geometry = mesh.isMesh ? mesh.geometry : undefined;
      const position = geometry?.getAttribute('position');
      const index = geometry?.getIndex();
      if (!geometry || !position || !index || geometry.userData.openTempleDoorCut) return;
      const sourceGroups = geometry.groups.length ? geometry.groups.map((group) => ({ ...group })) : [{ start: 0, count: index.count, materialIndex: 0 }];
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
          const ia = index.getX(i), ib = index.getX(i + 1), ic = index.getX(i + 2);
          a.fromBufferAttribute(position, ia).applyMatrix4(geometryToTemple);
          b.fromBufferAttribute(position, ib).applyMatrix4(geometryToTemple);
          c.fromBufferAttribute(position, ic).applyMatrix4(geometryToTemple);
          const x = (a.x + b.x + c.x) / 3, y = (a.y + b.y + c.y) / 3, z = (a.z + b.z + c.z) / 3;
          // The textured temple's real front leaf spans about 5.4 m at local
          // z=-5.4. The old 3.1 m cut left both door panels blocking the entry.
          const doorway = Math.abs(x) < 2.55 && y < 5.0 && y > 0.02 && z < -4.65 && z > -6.15;
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
      this.cameraController.setCollisionObjects(this.levelColliders);
    }
  }

  private addTempleStoneFloor(temple?: THREE.Object3D): void {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#514d4b';
    ctx.fillRect(0, 0, size, size);
    const tile = 64;
    for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
      const shade = 88 + ((row * 23 + col * 17) % 25);
      ctx.fillStyle = `rgb(${shade},${shade - 3},${shade - 5})`;
      ctx.fillRect(col * tile + 2, row * tile + 2, tile - 4, tile - 4);
      ctx.strokeStyle = 'rgba(25,24,24,.55)';
      ctx.strokeRect(col * tile + 2, row * tile + 2, tile - 4, tile - 4);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = Math.min(8, this.sceneManager.renderer.capabilities.getMaxAnisotropy());
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      map, color: 0xb5aea2, roughness: 0.78, metalness: 0.02,
      clearcoat: 0.04, clearcoatRoughness: 0.82
    });
    // The outdoor terrain is y=0 here. Keep the walkable temple surface within
    // the player's step height and put the collider's top at the same y as the
    // visible mosaic, avoiding the old 46 cm floor lip that hid Wukong's legs.
    const groundY = this.getTerrainHeight(0, -40);
    let topY = groundY + 0.16;
    let frontZ = -31.8;
    let rearZ = -48.2;
    if (temple) {
      temple.updateMatrixWorld(true);
      const halfDepth = 5.4 * temple.scale.x;
      frontZ = -40 + halfDepth;
      rearZ = -40 - halfDepth;
      const surfaceRay = new THREE.Raycaster();
      const rayOrigin = new THREE.Vector3();
      const down = new THREE.Vector3(0, -1, 0);
      // The temple mesh has a deep eave in front of the doorway; sampling
      // directly under it hit no walkable surface and left the overlay at the
      // terrain fallback (0.16 m), below the final stair/landing (~0.6 m).
      // Sample the actual landing just beyond the door plane instead.
      const thresholdSamples = [frontZ + 1.3, frontZ + 1.8, frontZ + 2.3];
      const walkableHeights: number[] = [];
      // Sample the actual upper stair/landing, not the temple's middle. The
      // center ray left a height lip at the seam between the last stair and floor.
      for (const z of thresholdSamples) for (const x of [-1.1, 0, 1.1]) {
        rayOrigin.set(x, groundY + 8, z);
        surfaceRay.set(rayOrigin, down);
        surfaceRay.far = 10;
        const hit = surfaceRay.intersectObject(temple, true).find((candidate) => {
          if (!candidate.face || candidate.point.y < groundY - 0.15 || candidate.point.y > groundY + 2.5) return false;
          return candidate.face.normal.clone().transformDirection(candidate.object.matrixWorld).y > 0.82;
        });
        if (hit) walkableHeights.push(hit.point.y);
      }
      if (walkableHeights.length) topY = Math.max(...walkableHeights) + 0.008;
    }
    // Keep the added finish strictly over the temple's ~18.5 m foundation.
    // Scanning every roof/stair vertex at this height accidentally included
    // the approach and made a large square pad spill into the surrounding land.
    // Fit the floor to the actual wall footprint (±5.4 model units), rather
    // than clipping it to a fixed 16 m square. The roof eaves are wider, so
    // this keeps the finish inside the building while covering its walkable
    // interior without a second drop at the stair landing.
    const floorWidth = temple ? Math.max(1, 10.8 * temple.scale.x - 0.24) : 16;
    const floorDepth = temple ? Math.max(1, frontZ - rearZ - 0.24) : 16;
    const floorCenterX = 0;
    const floorCenterZ = temple ? (frontZ + rearZ) * 0.5 : -40;
    this.centralTempleFloorWidth = floorWidth;
    this.centralTempleFloorDepth = floorDepth;
    this.centralTempleFloorCenterZ = floorCenterZ;
    // A thin rendered plane removes the visible boxed skirt that looked like
    // a second slab under the temple. Its face remains raycastable as the
    // walkable floor surface and sits on the sampled stair-landing height.
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorWidth, floorDepth), floorMaterial);
    floor.name = 'central_temple_stone_floor';
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(floorCenterX, topY, floorCenterZ);
    floor.receiveShadow = true;
    this.sceneManager.scene.add(floor);
    this.levelColliders.push(floor);
    this.centralTempleFloorTopY = topY;

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
      } else if (temple && Math.abs(pos.x) <= 11 && pos.z >= frontZ - 1 && pos.z <= frontZ + 10) {
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
    medallion.position.set(0, topY + 0.002, -40);
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
    yinStone.position.set(0, topY + 0.004, -40);
    scene.add(yinStone);
    const dotGeometry = new THREE.CircleGeometry(0.48, 24);
    const bronze = new THREE.MeshStandardMaterial({ color: 0xb27635, roughness: 0.48, metalness: 0.52 });
    const dotLight = new THREE.Mesh(dotGeometry, new THREE.MeshStandardMaterial({ color: 0xe4d7bd, roughness: 0.55 }));
    const dotDark = new THREE.Mesh(dotGeometry, new THREE.MeshStandardMaterial({ color: 0x282a32, roughness: 0.55 }));
    dotLight.rotation.x = dotDark.rotation.x = -Math.PI / 2;
    dotLight.position.set(0, topY + 0.006, -40 - 1.55);
    dotDark.position.set(0, topY + 0.006, -40 + 1.55);
    scene.add(dotLight, dotDark);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.65, 0.045, 8, 96), bronze);
    ring.name = 'temple_yinyang_bronze_inlay';
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, topY + 0.008, -40);
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
    innerInlay.position.set(0, topY + 0.009, -40);
    const outerInlay = new THREE.Mesh(new THREE.TorusGeometry(3.82, 0.016, 6, 96), inlayMaterial);
    outerInlay.name = 'temple_yinyang_outer_gold_inlay';
    outerInlay.rotation.x = Math.PI / 2;
    outerInlay.position.set(0, topY + 0.009, -40);
    scene.add(innerInlay, outerInlay);
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
   * Instances the exact Grass It! source meshes exported from
   * la_leyenda_de_wukong_Camarasuave.blend. The original GLB remains untouched;
   * GPU wind bends its real blades at the tips while the roots stay planted.
   */
  public loadGrassInBackground(): Promise<void> {
    if (this.grassLoadStarted) return this.grassLoadPromise ?? Promise.resolve();
    this.grassLoadStarted = true;
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    const loader = new GLTFLoader();
    this.grassLoadPromise = loader.loadAsync(`${base}wukong-grass-clumps.glb?v=${__APP_VERSION__}`)
      .then(async (original) => {
        let lodRoot: THREE.Object3D | null = null;
        try {
          lodRoot = (await loader.loadAsync(`${base}wukong-grass-clumps-lod.glb?v=${__APP_VERSION__}`)).scene;
        } catch (error) {
          console.warn('[Grass] Optional LOD failed; using the original meshes at every distance.', error);
        }
        this.applyOriginalGrassGroundTexture(original.scene);
        await this.buildOriginalGrass(original.scene, lodRoot ?? original.scene);
      })
      .catch((error: unknown) => {
        console.error('[Grass] Background load of original Grass It! assets failed; no substitute grass was generated.', error);
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
    const named = sourceRoot.getObjectByName('Grass_Lush');
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
    groundTexture.repeat.set(150, 150);
    groundTexture.anisotropy = Math.min(4, this.sceneManager.renderer.capabilities.getMaxAnisotropy());
    groundTexture.needsUpdate = true;
    this.terrainGroundMaterial.map = groundTexture;
    this.terrainGroundMaterial.color.setHex(0x526b32);
    this.terrainGroundMaterial.needsUpdate = true;
  }

  private async buildOriginalGrass(sourceRoot: THREE.Object3D, lodRoot: THREE.Object3D): Promise<void> {
    const sourceNames = ['Grass_Short', 'Grass_Lush', 'Grass_Tall'] as const;
    const weights = [0.43, 0.43, 0.14];
    const scaleRanges: Array<[number, number]> = [[0.9, 1.0], [0.7, 2.3], [0.8, 1.6]];
    this.player.visualModel.updateMatrixWorld(true);
    const characterBounds = new THREE.Box3().setFromObject(this.player.visualModel);
    const characterHeight = Math.max(0.1, characterBounds.max.y - characterBounds.min.y);
    // The 1.7 m player scale is measured from the loaded Wukong model. Keep
    // the original blade silhouette and texture, but cap its tallest tip at
    // ankle height instead of uniformly shrinking the clump's width.
    const ankleGrassHeight = Math.min(0.18, characterHeight * 0.105);
    this.grassUniforms = {
      uTime: { value: 0 },
      uPlayerPos: { value: new THREE.Vector3(999, 999, 999) },
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

    const makeDistanceGeometry = (source: THREE.BufferGeometry, keepRatio: number): THREE.BufferGeometry => {
      const geometry = source.clone();
      const index = source.index;
      if (!index || index.count < 12) return geometry;
      const stride = Math.max(2, Math.round(1 / keepRatio));
      const sourceGroups = source.groups.length
        ? source.groups
        : [{ start: 0, count: index.count, materialIndex: 0 }];
      const selected: number[] = [];
      const groups: Array<{ start: number; count: number; materialIndex: number }> = [];
      for (const group of sourceGroups) {
        const groupStart = selected.length;
        const end = Math.min(group.start + group.count, index.count);
        let face = 0;
        for (let offset = group.start; offset + 2 < end; offset += 3, face++) {
          // Stagger each material group's samples to retain a distributed
          // silhouette without running a runtime simplifier.
          if (face % stride !== (groups.length % stride)) continue;
          selected.push(index.getX(offset), index.getX(offset + 1), index.getX(offset + 2));
        }
        if (selected.length > groupStart) {
          groups.push({ start: groupStart, count: selected.length - groupStart, materialIndex: group.materialIndex ?? 0 });
        }
      }
      if (selected.length < 3) return geometry;
      geometry.setIndex(new THREE.BufferAttribute(Uint32Array.from(selected), 1));
      geometry.clearGroups();
      if (source.groups.length) groups.forEach((group) => geometry.addGroup(group.start, group.count, group.materialIndex));
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      return geometry;
    };

    const templates = sourceNames.map((name) => {
      const source = findMesh(sourceRoot, name);
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
      const lowGeometry = makeDistanceGeometry(lodGeometry, lodSource ? 0.18 : 0.04);
      const mediumGeometry = makeDistanceGeometry(lodGeometry, lodSource ? 0.45 : 0.08);
      const farGeometry = makeDistanceGeometry(lodGeometry, lodSource ? 0.035 : 0.01);

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
          shader.vertexShader = `uniform float uTime;\nuniform vec3 uPlayerPos;\n${shader.vertexShader}`;
          shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
            #include <begin_vertex>
            #ifdef USE_INSTANCING
              vec3 grassWorld = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
            #else
              vec3 grassWorld = vec3(0.0);
            #endif
            float grassTip = clamp(position.y / ${height.toFixed(4)}, 0.0, 1.0);
            float grassWave = sin(uTime * 1.15 + grassWorld.x * 0.12 + grassWorld.z * 0.09) * 0.075
              + sin(uTime * 0.63 - grassWorld.x * 0.07 + grassWorld.z * 0.11) * 0.035;
            transformed.x += grassWave * grassTip * grassTip;
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

    let seed = 709391;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3();
    const slopeRotation = new THREE.Quaternion();
    const yawRotation = new THREE.Quaternion();
    const segmentDistance = (x: number, z: number, ax: number, az: number, bx: number, bz: number) => {
      const dx = bx - ax, dz = bz - az;
      const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
      return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
    };
    const roads = [
      [[-12, -35], [-22, -45], [-35, -58], [-48, -68], [-55, -75]],
      [[12, -35], [22, -45], [35, -58], [48, -68], [55, -75]],
    ];
    const excluded = (x: number, z: number): boolean => {
      if (Math.abs(x) < 14.2 && Math.abs(z + 40) < 14.2) return true;
      if (Math.hypot(x - 45, z + 40) < 16.2) return true;
      if (Math.hypot(x + 55, z + 75) < 11.2 || Math.hypot(x - 55, z + 75) < 19.2) return true;
      if (Math.hypot(x - 20, z - 24) < 7.5) return true;
      if (Math.hypot(x + 30, z - 10) < 9 || Math.hypot(x + 45, z + 40) < 9) return true;
      if (Math.hypot(x - this.secretLavaCenter.x, z - this.secretLavaCenter.y) < 16.8) return true;
      if (segmentDistance(x, z, 49, -84, 58, -95) < 2.4) return true;
      if (Math.abs(x) < 4.2 && z > -27 && z < 17) return true;
      if (Math.abs(z + 75) < 2.8 && Math.abs(x) < 56) return true;
      for (const road of roads) for (let i = 0; i < road.length - 1; i++) {
        if (segmentDistance(x, z, road[i][0], road[i][1], road[i + 1][0], road[i + 1][1]) < 3.15) return true;
      }
      return false;
    };

    const isMobile = isLowPowerDevice();
    // Smaller spatial chunks keep the high-poly source clumps close to Wukong
    // instead of rendering an entire 40 m tile at full detail.
    const sectorSize = 20;
    // The original Geometry Nodes field used far more than one clump per m².
    // Four-ish randomized source clumps per square meter closes the gaps while
    // instancing keeps the distribution compact on the GPU.
    // Source clumps contain many fine blades already. A wider mobile sampling
    // interval retains the carpet while reducing instance preparation and draws.
    const spacing = isMobile ? 0.84 : 0.56;
    // Offset the X grid so the normal spawn point lies near a cell center,
    // rather than exactly on a seam that would activate two full-detail tiles.
    const xSectorOrigin = -90;
    const zSectorOrigin = -120;
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
          if (gx > 0 && gx % 8 === 0) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
          }
        }

        matrices.forEach((instances, variant) => {
          if (!instances.length) return;
          const template = templates[variant];
          const sector = new THREE.InstancedMesh(template.geometry, template.material, instances.length);
          sector.name = `grassit-${template.name.toLowerCase()}-sector-${sx}-${sz}`;
          const center = new THREE.Vector2(x0 + sectorSize * 0.5, z0 + sectorSize * 0.5);
          sector.userData.grassCenter = center;
          sector.userData.grassHalfSize = sectorSize * 0.5;
          sector.userData.grassFullGeometry = template.geometry;
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
    console.info(`[Grass] ${placedTotal} original Grass It! clumps from ${sourceNames.join(', ')} in ${sectorSize}m sectors (${isMobile ? 'mobile' : 'desktop'} spacing ${spacing}m); Wukong ${characterHeight.toFixed(2)}m, grass cap ${ankleGrassHeight.toFixed(2)}m`);
  }

  private buildToyStoryLevelGeometry(): void {
    const scene = this.sceneManager.scene;

    // Generate Textures
    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.repeat.set(4, 4);
    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.65, bumpScale: 0.04 });
    const groundBaseMat = new THREE.MeshStandardMaterial({ color: 0x526b32, roughness: 0.98 }); // Warm green distant ground LOD
    this.terrainGroundMaterial = groundBaseMat;
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xc2b280, roughness: 0.85 });  // Arena floor

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
    terrainGeo.computeVertexNormals();

    const worldFloor = new THREE.Mesh(terrainGeo, groundBaseMat);
    worldFloor.name = 'world-terrain';
    worldFloor.position.set(0, 0, 0);
    worldFloor.receiveShadow = true;
    scene.add(worldFloor);
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
          [-35, 0, -10], [35, 0, -15], [-20, 0, -75], [20, 0, -75], [-50, 0, -45]
        ];
        const dummy = new THREE.Object3D();
        const seed = 81271;
        let randomSeed = seed;
        const rand = () => { randomSeed = (randomSeed * 1664525 + 1013904223) >>> 0; return randomSeed / 4294967296; };
        for (const mesh of meshes) {
          const relative = rootInverse.clone().multiply(mesh.matrixWorld);
          const instances = new THREE.InstancedMesh(mesh.geometry, mesh.material, positions.length);
          instances.name = 'original_pinus_tree_instances';
          instances.castShadow = false;
          instances.receiveShadow = false;
          positions.forEach(([x, , z], i) => {
            const ground = this.getTerrainHeight(x, z);
            const scale = 0.78 + rand() * 0.15;
            dummy.position.set(x, ground, z);
            dummy.rotation.set(0, rand() * Math.PI * 2, 0);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            instances.setMatrixAt(i, dummy.matrix.multiply(relative));
            if (mesh.material instanceof THREE.Material && mesh.material.transparent) instances.setColorAt(i, new THREE.Color().setHSL(0.25 + rand() * 0.08, 0.3, 0.76 + rand() * 0.12));
          });
          instances.instanceMatrix.needsUpdate = true;
          if (instances.instanceColor) instances.instanceColor.needsUpdate = true;
          instances.computeBoundingBox();
          instances.computeBoundingSphere();
          scene.add(instances);
        }
        positions.forEach(([x, , z]) => {
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
        const instances = new THREE.InstancedMesh(shrubGeometry, bushSource.material, bushPositions.length);
        instances.name = 'original_chinese_croton_instances';
        const dummy = new THREE.Object3D();
        let seed = 32471;
        const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
        bushPositions.forEach(([x, , z], i) => {
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

      // 3. Real 3D Wildflowers — Daisies (InstancedMesh: 1 single draw call for 190 flowers)
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/flower_daisy.gltf', (gltf) => {
        let daisyMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((c) => {
          if (!daisyMesh && (c as THREE.Mesh).isMesh) daisyMesh = c as THREE.Mesh;
        });

        if (daisyMesh) {
          const daisyPatches = [
            { center: [-15, -15], count: 35 },
            { center: [15, -15], count: 35 },
            { center: [-25, 5], count: 40 },
            { center: [20, -65], count: 40 },
            { center: [-20, -65], count: 40 },
          ];
          const totalDaisies = daisyPatches.reduce((acc, p) => acc + p.count, 0);
          const instancedDaisies = new THREE.InstancedMesh((daisyMesh as THREE.Mesh).geometry, (daisyMesh as THREE.Mesh).material, totalDaisies);
          const dummy = new THREE.Object3D();

          let idx = 0;
          daisyPatches.forEach((patch) => {
            for (let i = 0; i < patch.count; i++) {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * 6.0;
              const x = patch.center[0] + Math.cos(angle) * dist;
              const z = patch.center[1] + Math.sin(angle) * dist;
              dummy.position.set(x, 0.05, z);
              dummy.rotation.y = Math.random() * Math.PI * 2;
              const s = 0.8 + Math.random() * 0.5;
              dummy.scale.set(s, s, s);
              dummy.updateMatrix();
              instancedDaisies.setMatrixAt(idx++, dummy.matrix);
            }
          });
          instancedDaisies.instanceMatrix.needsUpdate = true;
          scene.add(instancedDaisies);
        }
      });

      // 4. Real 3D Wildflowers — Buttercups (InstancedMesh: 1 single draw call for 130 flowers)
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/flower_buttercup.gltf', (gltf) => {
        let buttercupMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((c) => {
          if (!buttercupMesh && (c as THREE.Mesh).isMesh) buttercupMesh = c as THREE.Mesh;
        });

        if (buttercupMesh) {
          const buttercupPatches = [
            { center: [-10, 5], count: 30 },
            { center: [10, 5], count: 30 },
            { center: [-35, -30], count: 35 },
            { center: [35, -30], count: 35 },
          ];
          const totalButtercups = buttercupPatches.reduce((acc, p) => acc + p.count, 0);
          const instancedButtercups = new THREE.InstancedMesh((buttercupMesh as THREE.Mesh).geometry, (buttercupMesh as THREE.Mesh).material, totalButtercups);
          const dummy = new THREE.Object3D();

          let idx = 0;
          buttercupPatches.forEach((patch) => {
            for (let i = 0; i < patch.count; i++) {
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * 5.0;
              const x = patch.center[0] + Math.cos(angle) * dist;
              const z = patch.center[1] + Math.sin(angle) * dist;
              dummy.position.set(x, 0.05, z);
              dummy.rotation.y = Math.random() * Math.PI * 2;
              const s = 0.8 + Math.random() * 0.5;
              dummy.scale.set(s, s, s);
              dummy.updateMatrix();
              instancedButtercups.setMatrixAt(idx++, dummy.matrix);
            }
          });
          instancedButtercups.instanceMatrix.needsUpdate = true;
          scene.add(instancedButtercups);
        }
      });

      // 4. Drastically Reduced Realistic Mossy Boulders (9 hand-placed cluster rocks)
      const rockGeo = new THREE.DodecahedronGeometry(0.8, 1);
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x3d423a, roughness: 0.85 });
      const rockClusters = [
        // South Ruins rubble base cluster
        [-32, 0.4, 8, 1.2], [-28, 0.3, 14, 0.9], [-34, 0.5, 12, 1.4],
        // West Library cliff knoll cluster
        [-48, 0.6, -38, 1.5], [-44, 0.4, -42, 1.1], [-50, 0.5, -44, 1.3],
        // North Arena rock outcrop cluster
        [58, 0.5, -38, 1.6], [62, 0.4, -42, 1.2], [55, 0.3, -44, 1.0]
      ];
      rockClusters.forEach(([x, y, z, s]) => {
        const rock = new THREE.Mesh(rockGeo, rockMat);
        rock.position.set(x, y, z);
        rock.rotation.set(Math.random() * 0.4, Math.random() * Math.PI * 2, Math.random() * 0.4);
        rock.scale.set(s, s * 0.7, s);
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
        this.levelColliders.push(rock);
      });
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


    // 4. Combat Boss Arena (to the East, broad sand circular area)
    const arenaCenter = new THREE.Vector3(45, 0.1, -40);
    const arenaFloor = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 0.2, 24), sandMat);
    arenaFloor.position.copy(arenaCenter);
    arenaFloor.receiveShadow = true;
    scene.add(arenaFloor);
    this.levelColliders.push(arenaFloor);

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
    this.player.setColliders(this.levelColliders);
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

  private buildCuriosityVault(scene: THREE.Scene, stoneMat: THREE.Material, castleCenterZ: number): void {
    // The cave entrance sits off the paved route, outside the temple. Its
    // existing interaction still transfers to the authored underground room.
    this.curiosityCryptSurface.y = this.getTerrainHeight(this.curiosityCryptSurface.x, this.curiosityCryptSurface.z);
    // A small, ground-hugging rune trail makes the already separate west-field
    // crypt entrance discoverable after the pavilion lever is activated.
    this.curiosityCryptTrail = new THREE.Group();
    this.curiosityCryptTrail.name = 'curiosity_crypt_wayfinding_runes';
    const trailMaterial = new THREE.MeshBasicMaterial({ color: 0x54e5df, toneMapped: false });
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
      new THREE.MeshBasicMaterial({ color: 0x37d9d1, toneMapped: false }));
    mouthRing.position.set(0, 1.62, 0.12);
    this.curiosityCryptMouth.add(mouthRing);
    const entranceGlow = new THREE.PointLight(0x42deda, 2.2, 8, 2);
    entranceGlow.position.set(0, 1.35, 0.6);
    this.curiosityCryptMouth.add(entranceGlow);
    this.curiosityCryptMouth.visible = false;
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

    const caveWallMat = new THREE.MeshStandardMaterial({ color: 0x49413b, roughness: 0.94, metalness: 0.02, flatShading: true });
    const caveCeilingMat = new THREE.MeshStandardMaterial({ color: 0x292a31, roughness: 0.98, flatShading: true, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(29.5, 0.4, 27.5), stoneMat);
    floor.name = 'curiosity_chamber_floor';
    floor.position.set(-22.25, -6.1, castleCenterZ);
    floor.receiveShadow = true;
    scene.add(floor);
    this.levelColliders.push(floor);

    // Enclose the chamber under the terrain with a domed rock vault; the surface
    // sky is hidden from inside and the cave no longer reads as an open box.
    const roof = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), caveCeilingMat);
    roof.name = 'curiosity_crypt_rock_ceiling';
    roof.position.set(-22.25, -6.0, castleCenterZ);
    roof.scale.set(17.5, 5.6, 16.0);
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

    // Low-cost cave lighting, no shadow maps: readable stone and traversal on mobile too.
    [
      new THREE.Vector3(-15.5, -1.5, castleCenterZ - 7),
      new THREE.Vector3(-22.5, -1.5, castleCenterZ),
      new THREE.Vector3(-30, -1.5, castleCenterZ + 7),
    ].forEach((position, i) => {
      const glow = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), new THREE.MeshBasicMaterial({ color: i === 1 ? 0x64d9d2 : 0xffbb66, toneMapped: false }));
      glow.position.copy(position);
      scene.add(glow);
      const light = new THREE.PointLight(i === 1 ? 0x57cfc9 : 0xffb35d, 3.2, 12, 2);
      light.position.copy(position);
      light.castShadow = false;
      scene.add(light);
    });

    const floorMark = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 1.6), new THREE.MeshStandardMaterial({ color: 0xb78a4b, roughness: 0.7 }));
    floorMark.position.set(-22.5, -5.86, castleCenterZ - 13.28);
    scene.add(floorMark);
    [new THREE.Vector3(-15.0, -2.8, castleCenterZ), new THREE.Vector3(-29.5, -2.8, castleCenterZ)].forEach((position) => {
      const light = new THREE.PointLight(0xffb45e, 1.7, 9, 2);
      light.position.copy(position);
      light.castShadow = false;
      scene.add(light);
    });

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.3, 6.0), stoneMat);
    plinth.name = 'curiosity_chest_plinth';
    plinth.position.set(-33.4, -5.75, castleCenterZ);
    plinth.receiveShadow = true;
    scene.add(plinth);
    this.levelColliders.push(plinth);

    this.curiosityChest = new TreasureChest(new THREE.Vector3(-33.4, -5.6, castleCenterZ), Math.PI);
    this.curiosityChest.mesh.name = 'curiosity_key_chest';
    scene.add(this.curiosityChest.mesh);
    this.chests.push(this.curiosityChest);
    this.levelColliders.push(this.curiosityChest.mesh);
  }

  /** Optional canopy route in the western field, well away from the central temple. */
  private buildCanopyTrial(): void {
    const scene = this.sceneManager.scene;
    const base = new THREE.Vector3(-72, this.getTerrainHeight(-72, -88), -88);
    const top = new THREE.Vector3(-70.8, base.y + 4.18, -87.2);
    const middle = new THREE.Vector3(-66.4, this.getTerrainHeight(-66.4, -84.5) + 0.62, -84.5);
    const landing = new THREE.Vector3(-57.6, this.getTerrainHeight(-57.6, -76.8) + 0.38, -76.8);
    const bark = new THREE.MeshStandardMaterial({ color: 0x52331f, roughness: 0.94 });
    const leaf = new THREE.MeshStandardMaterial({ color: 0x367b48, roughness: 0.9, emissive: 0x10210d, emissiveIntensity: 0.18 });
    const stone = new THREE.MeshStandardMaterial({ color: 0x626574, roughness: 0.88 });
    const tree = new THREE.Group();
    tree.name = 'west_canopy_climbing_tree';
    tree.position.copy(base);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.9, 5.8, 10), bark);
    trunk.name = 'canopy_tree_trunk';
    trunk.position.y = 2.9;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);
    for (let i = 0; i < 5; i++) {
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2 + (i % 2) * 0.22, 1), leaf);
      crown.position.set(Math.sin(i * 1.25) * 1.25, 5.45 + (i % 3) * 0.62, Math.cos(i * 1.25) * 1.0);
      crown.castShadow = true;
      tree.add(crown);
    }
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.5, 7), bark);
    branch.position.set(0.95, 4.45, 0);
    branch.rotation.z = Math.PI / 2.8;
    tree.add(branch);
    scene.add(tree);

    const trunkCollider = new THREE.Mesh(new THREE.CylinderGeometry(0.83, 1.0, 5.8, 10), new THREE.MeshBasicMaterial({ colorWrite: false }));
    trunkCollider.name = 'canopy_tree_trunk_collision';
    trunkCollider.position.copy(base).add(new THREE.Vector3(0, 2.9, 0));
    scene.add(trunkCollider);
    this.levelColliders.push(trunkCollider);

    const makeLanding = (position: THREE.Vector3, name: string, width: number, depth: number) => {
      const platform = new THREE.Mesh(new THREE.BoxGeometry(width, 0.55, depth), stone);
      platform.name = name;
      platform.position.set(position.x, position.y - 0.275, position.z);
      platform.castShadow = platform.receiveShadow = true;
      scene.add(platform);
      this.levelColliders.push(platform);
    };
    makeLanding(top, 'canopy_tree_top_landing', 2.8, 2.6);
    makeLanding(middle, 'canopy_middle_landing', 2.8, 2.6);
    makeLanding(landing, 'canopy_secret_chest_landing', 3.4, 3.1);

    const makeVine = (from: THREE.Vector3, to: THREE.Vector3, name: string, lift: number) => {
      const control = new THREE.Vector3((from.x + to.x) * 0.5, Math.max(from.y, to.y) + lift, (from.z + to.z) * 0.5);
      const curve = new THREE.QuadraticBezierCurve3(from.clone(), control, to.clone());
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.065, 6, false), new THREE.MeshStandardMaterial({ color: 0x467a37, roughness: 0.95 }));
      mesh.name = name;
      mesh.castShadow = false;
      scene.add(mesh);
      return curve;
    };
    makeVine(top.clone().add(new THREE.Vector3(0, 1.35, 0)), middle.clone().add(new THREE.Vector3(0, 2.2, 0)), 'canopy_vine_swing_one', 3.2);
    makeVine(middle.clone().add(new THREE.Vector3(0, 2.1, 0)), landing.clone().add(new THREE.Vector3(0, 2.7, 0)), 'canopy_vine_swing_two', 2.8);
    const firstPath = new THREE.QuadraticBezierCurve3(
      top.clone(),
      new THREE.Vector3((top.x + middle.x) * 0.5, Math.max(top.y, middle.y) + 2.4, (top.z + middle.z) * 0.5),
      middle.clone()
    );
    const secondPath = new THREE.QuadraticBezierCurve3(
      middle.clone(),
      new THREE.Vector3((middle.x + landing.x) * 0.5, Math.max(middle.y, landing.y) + 2.8, (middle.z + landing.z) * 0.5),
      landing.clone()
    );
    const vineGlowMaterial = new THREE.MeshBasicMaterial({ color: 0xffdc78, toneMapped: false });
    [top, middle].forEach((point, index) => {
      const marker = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.045, 7, 24), vineGlowMaterial);
      marker.name = 'canopy_vine_grab_marker_' + index;
      marker.position.copy(point).add(new THREE.Vector3(0, 1.15, 0));
      marker.rotation.x = Math.PI / 2;
      scene.add(marker);
    });

    this.canopyChest = new TreasureChest(landing.clone(), Math.PI);
    this.canopyChest.mesh.name = 'canopy_secret_key_chest';
    scene.add(this.canopyChest.mesh);
    this.levelColliders.push(this.canopyChest.mesh);
    this.chests.push(this.canopyChest);
    this.canopyRewardHint = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshStandardMaterial({ color: 0x6ff5ff, emissive: 0x12cfee, emissiveIntensity: 1.8 }));
    this.canopyRewardHint.name = 'canopy_route_reward_hint';
    this.canopyRewardHint.position.copy(landing).add(new THREE.Vector3(0, 1.35, 0));
    scene.add(this.canopyRewardHint);
    this.canopyTrial = { base, top, middle, landing, firstPath, secondPath };
  }

  private updateCanopyTrial(delta: number, playerPos: THREE.Vector3): void {
    const route = this.canopyTrial;
    if (!route) return;
    if (this.canopyTraversal) {
      this.player.velocity.set(0, 0, 0);
      if (this.canopyTraversal === 'top') {
        // Hold Wukong on the small upper platform while Climbing_To_Top
        // finishes; don't let gravity pull him down between animation frames.
        this.player.mesh.position.copy(route.top);
        this.player.isGrounded = true;
        return;
      }
      this.canopyTraversalElapsed += delta;
      const progress = THREE.MathUtils.clamp(this.canopyTraversalElapsed / this.canopyTraversalDuration, 0, 1);
      if (this.canopyTraversalCurve) this.player.mesh.position.copy(this.canopyTraversalCurve.getPoint(progress));
      this.player.isGrounded = this.canopyTraversal === 'swing' && progress >= 1;
      return;
    }

    const horizontal = (point: THREE.Vector3) => Math.hypot(playerPos.x - point.x, playerPos.z - point.z);
    const distBase = horizontal(route.base);
    const distTop = horizontal(route.top);
    const distMiddle = horizontal(route.middle);
    if (!this.canopyTutorialShown && distBase < 17) {
      this.canopyTutorialShown = true;
      this.cameraController.panToward(route.top.clone().add(new THREE.Vector3(0, 3, 0)), 1.8);
      this.subtitleSystem.show('Ruta de las lianas', 'Trepa al \u00e1rbol con Acci\u00f3n. Cruza de una plataforma a la otra balance\u00e1ndote desde los dos anclajes de liana.');
    }
    if (this.player.isControlsLocked || this.player.isMovementLocked || this.isCinematicPlaying) return;
    const hud = (window as any).gameInstance?.hud;
    if (!this.canopyAtTop && !this.canopyAtMid && distBase < 2.5 && Math.abs(playerPos.y - route.base.y) < 1.5) {
      // Supplemental FBX clips load after first gameplay. Never lock the
      // player or teleport through the route if they have not finished yet.
      const canClimb = this.player.animationController.hasClip('Climbing') && this.player.animationController.hasClip('Climbing_To_Top');
      hud?.showInteractionPrompt(canClimb
        ? (hud?.isTouchDevice?.() ? 'Trepar al \u00e1rbol \u00b7 Acci\u00f3n' : 'Trepar al \u00e1rbol [E]')
        : 'Preparando animaci\u00f3n de escalada');
      if (!canClimb) return;
      if (!this.inputManager.consumeInteractPress()) return;
      this.player.isControlsLocked = this.player.isMovementLocked = true;
      this.player.velocity.set(0, 0, 0);
      this.player.mesh.rotation.y = Math.atan2(route.base.x - playerPos.x, route.base.z - playerPos.z);
      this.canopyTraversal = 'climb';
      this.canopyTraversalElapsed = 0;
      this.canopyTraversalDuration = this.player.animationController.getClipDuration('Climbing');
      this.canopyTraversalCurve = new THREE.QuadraticBezierCurve3(this.player.mesh.position.clone(), route.base.clone().add(new THREE.Vector3(0, 2.2, 0.25)), route.top.clone());
      this.player.animationController.playOneShot('Climbing', () => {
        this.player.mesh.position.copy(route.top);
        this.canopyTraversal = 'top';
        this.canopyTraversalCurve = null;
        this.player.animationController.playOneShot('Climbing_To_Top', () => {
          this.canopyAtTop = true;
          this.canopyTraversal = null;
          this.player.isGrounded = true;
          this.player.isControlsLocked = this.player.isMovementLocked = false;
          this.player.animationController.playState('Idle', 0.18);
        });
      });
      return;
    }

    const swingTo = (curve: THREE.QuadraticBezierCurve3, target: THREE.Vector3, clipName: string, next: 'middle' | 'landing') => {
      this.player.isControlsLocked = this.player.isMovementLocked = true;
      this.player.velocity.set(0, 0, 0);
      this.player.mesh.rotation.y = Math.atan2(target.x - playerPos.x, target.z - playerPos.z);
      this.canopyTraversal = 'swing';
      this.canopyTraversalElapsed = 0;
      this.canopyTraversalDuration = this.player.animationController.getClipDuration(clipName);
      this.canopyTraversalCurve = curve;
      this.player.animationController.playOneShot(clipName, () => {
        this.player.mesh.position.copy(target);
        this.player.isGrounded = true;
        this.player.isControlsLocked = this.player.isMovementLocked = false;
        this.canopyTraversal = null;
        this.canopyTraversalCurve = null;
        if (next === 'middle') {
          this.canopyAtTop = false;
          this.canopyAtMid = true;
          this.subtitleSystem.show('Primera traves\u00eda', 'Has llegado a la plataforma intermedia. Contin\u00faa por la segunda liana hacia el cofre secreto.');
        } else {
          this.canopyAtMid = false;
          this.canopyRewardClaimed = true;
          this.subtitleSystem.show('Cofre de la copa', 'La segunda traves\u00eda te ha llevado a un cofre secreto. Pulsa Acci\u00f3n para abrirlo.');
        }
        this.player.animationController.playState('Idle', 0.18);
      });
    };

    if (this.canopyAtTop && distTop < 3.2) {
      const canSwing = this.player.animationController.hasClip('Swing_To_Land');
      hud?.showInteractionPrompt(canSwing
        ? (hud?.isTouchDevice?.() ? 'Cruzar a la plataforma \u00b7 Acci\u00f3n' : 'Cruzar a la plataforma [E]')
        : 'Preparando animaci\u00f3n de liana');
      if (!canSwing) return;
      if (this.inputManager.consumeInteractPress()) swingTo(route.firstPath, route.middle, 'Swing_To_Land', 'middle');
      return;
    }
    if (this.canopyAtMid && distMiddle < 3.2) {
      const clip = route.middle.distanceTo(route.landing) > 8 ? 'Swing_To_Land2' : 'Swing_To_Land';
      const canSwing = this.player.animationController.hasClip(clip);
      hud?.showInteractionPrompt(canSwing
        ? (hud?.isTouchDevice?.() ? 'Balancearse a la otra orilla \u00b7 Acci\u00f3n' : 'Balancearse a la otra orilla [E]')
        : 'Preparando animaci\u00f3n de liana');
      if (!canSwing) return;
      if (this.inputManager.consumeInteractPress()) {
        swingTo(route.secondPath, route.landing, clip, 'landing');
      }
      return;
    }
    if (this.canopyRewardClaimed && this.canopyChest && !this.canopyChestOpen && this.canopyChest.mesh.position.distanceTo(playerPos) < 2.7) {
      hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Abrir cofre secreto \u00b7 Acci\u00f3n' : 'Abrir cofre secreto [E]');
      if (!this.inputManager.consumeInteractPress()) return;
      this.canopyChestOpen = this.canopyChest.isUnlocked = true;
      this.canopyChest.unlock(this.audioManager, this.collectibleSystem, () => {
        if (!this.collectedKeys.key4_curiosity && !this.curiosityKeySpawned) {
          this.curiosityKeySpawned = true;
          this.spawn3DKey('key4_curiosity', this.canopyChest!.mesh.position.clone().add(new THREE.Vector3(0, 1.25, 0)));
          this.subtitleSystem.show('Llave de la Curiosidad', 'Has encontrado una ruta secreta y la llave de su cofre.');
        } else {
          this.powerOrbSystem?.spawn(this.canopyChest!.mesh.position, 30);
          this.subtitleSystem.show('Cofre secreto', 'El cofre contiene una Esfera de Poder.');
        }
      });
      if (this.canopyRewardHint) this.canopyRewardHint.visible = false;
    }
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
    const pathMaterial = new THREE.MeshStandardMaterial({ map: pathMap, color: 0xbdb8ad, roughness: 0.82, metalness: 0.02 });

    // Continuous, terrain-conforming stone ribbon. The same surface is the
    // collider, replacing the old overlapping 4.2m square slabs that left
    // visible zigzags and did not support the player's ground ray.
    const addStonePath = (name: string, waypoints: THREE.Vector3[], width: number): THREE.Vector3[] => {
      const curve = new THREE.CatmullRomCurve3(waypoints, false, 'centripetal');
      const sampleCount = Math.max(12, Math.ceil(curve.getLength() / 1.45));
      const vertices: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      const centers: THREE.Vector3[] = [];
      let distance = 0;
      let previous: THREE.Vector3 | null = null;
      for (let i = 0; i <= sampleCount; i++) {
        const t = i / sampleCount;
        const point = curve.getPointAt(t);
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
      return centers;
    };
    const addRouteLanterns = (centers: THREE.Vector3[], color: number) => {
      for (let i = 0; i < centers.length; i += 8) {
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
    this.spellSystem.registerChest(this.staffChest);
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

    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xff66aa,
      emissive: 0xff3388,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.6,
    });
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });

    energySpots.forEach((spot, idx) => {
      const y = spot.y > 2.0 ? spot.y : this.getTerrainHeight(spot.x, spot.z) + 0.45;
      const group = new THREE.Group();
      group.position.set(spot.x, y, spot.z);

      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), orbMat);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 8, 16), ringMat);
      ring.rotation.x = Math.PI / 3;

      group.add(orb, ring);
      group.name = `energy_item_${idx}`;

      scene.add(group);
      this.energyItems.push(group);
    });
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
      const x = 8.5;
      const z = -29.0 - i * 2.6;
      coinPositions.push(new THREE.Vector3(x, this.getTerrainHeight(x, z) + 0.6, z));
    }

    // 4. Temple-side ground route (the old mezzanine was removed)
    [[-8, -44], [-8, -36], [-4, -48], [0, -51], [4, -48], [8, -44], [4, -34], [-4, -34]].forEach(([x, z]) => {
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

    // Keep the existing 50-coin quest total; redistribute eight route coins
    // inside the new wooden house rather than creating extra quest currency.
    const highHouseCoins = [
      [34, -88], [38, -88], [42, -88], [34, -92],
      [42, -92], [34, -96], [38, -96], [42, -96]
    ].map(([x, z]) => new THREE.Vector3(x, this.getTerrainHeight(x, z) + 2.2, z));
    rawCoins.splice(rawCoins.length - highHouseCoins.length, highHouseCoins.length, ...highHouseCoins);

    // ── AUTOMATED COIN POSITION VALIDATION & COLLISION CHECKER ──
    const validateCoinPosition = (pos: THREE.Vector3): THREE.Vector3 => {
      const checkedPos = pos.clone();

      // Use the raised stone plane for temple coins; all other route coins
      // remain attached to the natural terrain surface.
      const templeFloorY = this.centralTempleFloorTopY;
      const templeHalfWidth = this.centralTempleFloorWidth * 0.5;
      const templeHalfDepth = this.centralTempleFloorDepth * 0.5;
      if (templeFloorY !== null && Math.abs(checkedPos.x) <= templeHalfWidth &&
          checkedPos.z >= this.centralTempleFloorCenterZ - templeHalfDepth &&
          checkedPos.z <= this.centralTempleFloorCenterZ + templeHalfDepth) {
        checkedPos.y = templeFloorY + 0.6;
      } else if (Math.abs(checkedPos.x - this.highHouseCenter.x) < 7.5 &&
                 Math.abs(checkedPos.z - this.highHouseCenter.z) < 8.5) {
        checkedPos.y = this.getTerrainHeight(checkedPos.x, checkedPos.z) + 2.2;
      } else {
        checkedPos.y = this.getTerrainHeight(checkedPos.x, checkedPos.z) + 0.6;
      }

      // 2. Horizontal Wall Collision Test (Cast rays in 4 cardinal directions to ensure no clipping inside walls)
      const raycaster = new THREE.Raycaster();
      const directions = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
      ];

      for (const dir of directions) {
        raycaster.set(checkedPos, dir);
        raycaster.far = 0.4;
        const hits = raycaster.intersectObjects(this.levelColliders, true);
        if (hits.length > 0) {
          // If too close to a wall, nudge 0.5m away from the wall normal
          const hitNorm = hits[0].face?.normal?.clone() || new THREE.Vector3(0, 0, 1);
          checkedPos.addScaledVector(hitNorm, 0.5);
        }
      }

      return checkedPos;
    };

    const finalCoins = rawCoins.map((pos) => validateCoinPosition(pos));

    console.log(`[COINS-VALIDATION] Validated & Synchronously Spawning EXACTLY ${finalCoins.length}/${EXPECTED_LISAR_COINS} Lisar Coins.`);

    finalCoins.forEach((pos, idx) => {
      this.collectibleSystem.spawnCoin(`coin_${idx}`, pos);
    });
  }

  private setupNPCs(): void {
    // Place the model origin at the sampled terrain height; GekkoNPC aligns the GLB soles to that root.
    const gekkoY = this.getTerrainHeight(-2.8, -10);
    this.gekkoNPC = new GekkoNPC(new THREE.Vector3(-2.8, gekkoY, -10), -Math.PI * 0.25);
    this.gekkoNPC.loadModels();
    this.sceneManager.scene.add(this.gekkoNPC.mesh);

    // Gekko's physical collider (prevents Wukong from passing through Gekko)
    const gekkoCollider = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2.5, 12),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide })
    );
    gekkoCollider.position.set(-2.8, gekkoY + 1.25, -10);
    this.sceneManager.scene.add(gekkoCollider);
    this.levelColliders.push(gekkoCollider);

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

    // The crypt is a small underground extension with its own two patrols.
    // Their height band keeps them independent from the surface encounters.
    const cryptGuard1 = new EnemyController('crypt_crab_guard_1', new THREE.Vector3(-30, -5.82, -33), [
      new THREE.Vector3(-33, -5.82, -33), new THREE.Vector3(-27, -5.82, -33),
    ]);
    const cryptGuard2 = new EnemyController('crypt_crab_guard_2', new THREE.Vector3(-20, -5.82, -47), [
      new THREE.Vector3(-23, -5.82, -47), new THREE.Vector3(-17, -5.82, -47),
    ]);

    // Boss Giant Crab in the Sand Arena (firmly grounded at y = 0.2)
    const bossY = 0.2;
    this.bossEnemy = new EnemyController('crab_boss', new THREE.Vector3(45, bossY, -40));
    this.enemies.push(patrol1, patrol2, patrol3, patrol4, patrol5, lavaGuard1, lavaGuard2, cryptGuard1, cryptGuard2, this.bossEnemy);

    this.enemies.forEach(e => {
      const scaleMult = e.id === 'crab_boss' ? 3.5 : 1.0;
      e.loadModel(scaleMult);
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
          const hud = (window as any).gameInstance?.hud;
          hud?.updateBossHealth(health, maxHealth);
        };
      }

      e.onAttackPlayer = (dmg) => {
        if (!this.combatTutorialShown) {
          this.combatTutorialShown = true;
          this.showCombatControlsHint();
        }
        const cp = this.checkpointManager.getActiveCheckpointPosition();
        this.player.takeDamage(dmg, cp);
        this.audioManager.playPlayerHurt();
        const hud = (window as any).gameInstance?.hud;
        if (hud) hud.triggerDamageFlash();
      };

      e.onDeath = async () => {
        this.powerOrbSystem?.spawn(e.mesh.position, e.id === 'crab_boss' ? 200 : 20);
        if (e.id === 'crab_boss') {
          console.log('[BOSS] HP: 0 -> Entering DYING state. Defeat sequence started.');
          if (this.isCinematicPlaying) return;
          this.isCinematicPlaying = true;
          this.bossEncounterActive = false;
          this.stateFlags.bossDefeated = true;
          void this.audioManager.stopBossMusic();
          const hud = (window as any).gameInstance?.hud;
          hud?.hideBossHealth();

          // Pause other enemies
          this.enemies.forEach(other => {
            if (other.id !== 'crab_boss') other.isPaused = true;
          });

          // Focus camera on defeated boss lying on the ground
          const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
          if (cinematicCamera) {
            const bossPos = e.mesh.position.clone();
            const camPos = bossPos.clone().add(new THREE.Vector3(-6.0, 3.5, 6.0));
            const lookAt = bossPos.clone().add(new THREE.Vector3(0, 0.5, 0));
            cinematicCamera.moveCamera(camPos, camPos, lookAt, lookAt, 999.0);
          }

          this.subtitleSystem.show('Jefe Cangrejo', '¡El Jefe Cangrejo ha sido derrotado!');

          // Wait 1.0s to view defeated boss lying on arena floor
          await new Promise(r => setTimeout(r, 1000));

          // Run KeyPickupSequence for Crimson Boss Key (key2_boss)
          console.log('[BOSS] Reward key spawned — flying to player');
          const bossKeyData = this.keyDefinitions['key2_boss'];
          const keySpawnPos = e.mesh.position.clone().add(new THREE.Vector3(0, 1.2, 0));

          await KeyPickupSequence.runSequence(
            bossKeyData,
            keySpawnPos,
            this.player,
            this.sceneManager.scene,
            () => {
              console.log('[BOSS] Death sequence completed — gameplay resumed');
              this.awardKey('key2_boss');
              if (cinematicCamera) cinematicCamera.abort();
              const cameraController = (window as any).gameInstance?.cameraController;
              if (cameraController) {
                cameraController.target = this.player.mesh;
                cameraController.resumeAfterCinematic();
              }
              this.enemies.forEach(other => other.isPaused = false);
              this.isCinematicPlaying = false;
            }
          );
        }
      };
    });
  }

  // Spawns the physical key objects in the world for 3D collection (except Gekko's which is dialog based)
  private spawnKeysInWorld(): void {
    // Key 3 remains in the temple route, moved off the removed castle roof.
    this.spawn3DKey('key3_platform', new THREE.Vector3(15, this.getTerrainHeight(15, -47) + 0.8, -47));
  }

  public spawn3DKey(id: string, pos: THREE.Vector3): void {
    const scene = this.sceneManager.scene;
    const keyGroup = new THREE.Group();
    keyGroup.position.copy(pos);
    keyGroup.name = id;

    // Distinct theme color per quest key
    let baseColor = 0xffd700;
    let emissiveColor = 0xffaa00;

    if (id === 'key1_gekko') {
      baseColor = 0xff6600;     // Vivid Orange for Gekko 50 coins quest!
      emissiveColor = 0xff8800;
    } else if (id === 'key2_boss') {
      baseColor = 0xff2200;     // Crimson Red for Boss Victory
      emissiveColor = 0xff4400;
    } else if (id === 'key3_platform') {
      baseColor = 0x00ff88;     // Emerald Green for Castle Roof
      emissiveColor = 0x00cc66;
    } else if (id === 'key4_curiosity') {
      baseColor = 0xffdc62;
      emissiveColor = 0xffb51b;
    } else if (id === 'key6_gargoyles') {
      baseColor = 0xa855f7;     // Arcane Violet for Gargoyles
      emissiveColor = 0x9333ea;
    } else if (id === 'key5_pots') {
      baseColor = 0x00e5ff;     // Cyan Blue for Gem Pots
      emissiveColor = 0x00bfff;
    }

    const keyMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      emissive: emissiveColor,
      emissiveIntensity: 1.0,
      metalness: 0.85,
      roughness: 0.2,
    });

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.08, 12, 24), keyMat);
    ring.rotation.x = Math.PI / 2;
    
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 12), keyMat);
    shaft.position.y = -0.35;

    const tooth1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.06), keyMat);
    tooth1.position.set(0.12, -0.55, 0);

    const tooth2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), keyMat);
    tooth2.position.set(0.10, -0.42, 0);

    // Keep the key visibly luminous without adding a PointLight per key.
    // Changing the scene light count while collecting recompiles shader
    // variants on some WebGL drivers and caused multi-second pickup stalls.
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 8, 6),
      new THREE.MeshBasicMaterial({ color: emissiveColor, toneMapped: false })
    );
    glow.name = 'key_emissive_glow';
    keyGroup.add(glow);

    keyGroup.add(ring, shaft, tooth1, tooth2);
    scene.add(keyGroup);
    this.keysMeshes.push(keyGroup);
    console.log(`[LevelToyStory] ✅ Spawned 3D Key '${id}' at`, pos);
  }

  // Spawns the sparkles and unlocks the key
  public awardKey(keyId: keyof typeof this.collectedKeys, spawnPos?: THREE.Vector3): void {
    if (this.collectedKeys[keyId]) return;
    this.collectedKeys[keyId] = true;

    // Key milestones (apart from Gekko's 50-coin reward) also feed the staff
    // progression, making all five upgrades reachable through full exploration.
    if (keyId !== 'key1_gekko') {
      this.powerOrbSystem?.spawn(this.player.mesh.position.clone(), 250);
    }

    // Visual sparks
    if (spawnPos) this.createSparks(spawnPos);
    this.audioManager.playCardPickup(); // Play success chime

    // Increment keys count
    this.totalKeysCount++;
    const hud = (window as any).gameInstance?.hud;
    if (hud) hud.setKeyCount(this.totalKeysCount);

    let keyName = '';
    if (keyId === 'key1_gekko') keyName = 'Llave de la Riqueza (Gekko 50 Monedas)';
    if (keyId === 'key2_boss') keyName = 'Llave de la Valentía (Jefe Cangrejo)';
    if (keyId === 'key3_platform') keyName = 'Llave de Plataformas (Tejado)';
    if (keyId === 'key4_curiosity') keyName = 'Llave de la Curiosidad';
    if (keyId === 'key6_gargoyles') keyName = 'Llave del Secreto (Gárgolas)';
    if (keyId === 'key5_pots') keyName = 'Llave de Destrucción (Gemas)';

    this.subtitleSystem.show('LISAR', `¡Has obtenido la ${keyName}! (${this.totalKeysCount}/4 Requeridas)`);

    // Check if exit door is now unlocked (STRICT VALIDATION: EXACTLY 3 OR MORE KEYS REQUIRED)
    if (this.totalKeysCount >= 4 && this.exitDoor && !this.exitDoor.isOpen) {
      this.exitDoor.open();
      this.subtitleSystem.show('LISAR', '¡PORTÓN ABIERTO! Has reunido las 4 llaves místicas. El portal de salida en el castillo está desbloqueado.');
    }
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
      if (this.gekkoMissionState === 'NOT_STARTED') {
        this.gekkoMissionState = 'MISSION_ACTIVE';
        this.stateFlags.gekkoTalked = true;
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

    const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
    const cameraController = (window as any).gameInstance?.cameraController;
    const hud = (window as any).gameInstance?.hud;

    if (cinematicCamera && hud) {
      // Pause enemy AI!
      this.enemies.forEach(e => e.isPaused = true);
      await hud.fadeScreenOut(500);

      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      const gekkoPos = this.gekkoNPC.mesh.position;
      const gekkoY = gekkoPos.y;

      // Position Player facing Gekko
      this.player.mesh.position.set(gekkoPos.x, 0.2, gekkoPos.z + 2.5);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();
      
      // Position Gekko facing Player
      this.gekkoNPC.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z);
      this.gekkoNPC.mesh.rotation.set(0, 0, 0);
      this.gekkoNPC.setTalking(true);

      this.floatingCoinMesh.position.set(gekkoPos.x, gekkoY + 1.4, gekkoPos.z + 1.25);
      this.floatingCoinMesh.visible = true;

      this.subtitleSystem.hide();

      // Camera view side-by-side shot
      const endPos = new THREE.Vector3(gekkoPos.x + 2.5, gekkoY + 1.25, gekkoPos.z + 1.25); 
      const endLookAt = new THREE.Vector3(gekkoPos.x, gekkoY + 1.1, gekkoPos.z + 1.25); 
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
      });
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

    if (cinematicCamera && hud) {
      // Pause enemy AI!
      this.enemies.forEach(e => e.isPaused = true);
      await hud.fadeScreenOut(500);

      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      const gekkoPos = this.gekkoNPC.mesh.position;
      const gekkoY = gekkoPos.y;

      // Position Player facing Gekko
      this.player.mesh.position.set(gekkoPos.x, 0.2, gekkoPos.z + 2.5);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();
      
      // Position Gekko facing Player
      this.gekkoNPC.mesh.position.set(gekkoPos.x, gekkoY, gekkoPos.z);
      this.gekkoNPC.mesh.rotation.set(0, 0, 0);
      this.gekkoNPC.setTalking(true);

      // NO LISAR COIN FLOATING IN 2ND CINEMATIC!
      if (this.floatingCoinMesh) this.floatingCoinMesh.visible = false;

      // Camera view side-by-side shot
      const endPos = new THREE.Vector3(gekkoPos.x + 2.5, gekkoY + 1.25, gekkoPos.z + 1.25); 
      const endLookAt = new THREE.Vector3(gekkoPos.x, gekkoY + 1.1, gekkoPos.z + 1.25); 
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
          });
        });
      });
    } else {
      this.isCinematicPlaying = false;
    }
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    this.syncStructureColliders(playerPos);
    this.loadOptionalArchitectureNearPlayer(playerPos);
    const interactionHud = (window as any).gameInstance?.hud;
    interactionHud?.beginInteractionFrame();
    this.updateCanopyTrial(delta, playerPos);
    // Tick Dynamic Day/Night Cycle
    if (this.dayNightCycle) {
      this.dayNightCycle.update(delta, playerPos);
    }
    this.constellationSystem?.update(delta, playerPos, this.dayNightCycle?.phase ?? 0);

    if (this.grassUniforms) {
      this.grassUniforms.uTime.value = performance.now() / 1000.0;
      if (this.grassUniforms.uPlayerPos) {
        this.grassUniforms.uPlayerPos.value.copy(playerPos);
      }
    }
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
      // Keep original source clumps at close range and switch to derived,
      // topology-reduced copies in the middle distance. The ground material
      // carries coverage beyond the vegetation range.
      const isMobile = isLowPowerDevice();
      const qualityIndex = this.grassQuality === 0.65 ? 0 : this.grassQuality === 1 ? 2 : 1;
      const detailDistances = isMobile ? [2, 3, 4] : [4, 5, 7];
      const midDistances = isMobile ? [8, 10, 12] : [14, 20, 30];
      const farDistances = isMobile ? [20, 26, 34] : [48, 65, 90];
      const detailedDistance = detailDistances[qualityIndex];
      const lodDistance = midDistances[qualityIndex];
      const farDistance = farDistances[qualityIndex];
      // High keeps the complete Blender LOD close to the player; Medium uses
      // a fuller topology reduction and Low/mobile uses the lightest variant.
      // Full source polygons remain exclusive to High desktop.
      const useFullDetail = !isMobile && qualityIndex === 2;
      for (let i = 0; i < this.grassSectors.length; i++) {
        const sector = this.grassSectors[i];
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
          const targetGeometry = distance <= detailedDistance && useFullDetail
            ? sector.userData.grassFullGeometry
            : distance <= lodDistance
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
    if (this.cloudsUniforms) {
      this.cloudsUniforms.uTime.value = performance.now() / 1000.0;
    }
    if (this.lampMoths) this.lampMoths.update(delta, playerPos);
    if (this.hatchPivot && this.hatchTarget !== this.hatchOpenProgress) {
      this.hatchOpenProgress = THREE.MathUtils.damp(this.hatchOpenProgress, this.hatchTarget, 3.2, delta);
      if (Math.abs(this.hatchOpenProgress - this.hatchTarget) < 0.002) this.hatchOpenProgress = this.hatchTarget;
      this.hatchPivot.rotation.x = -this.hatchOpenProgress * Math.PI * 0.5;
      if (this.curiosityCryptMouth) this.curiosityCryptMouth.visible = this.hatchOpenProgress > 0.28;
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

    // Claim high-priority contextual presses before nearby coins or keys can consume them.
    const chestInRange = !this.stateFlags.staffFound && !this.staffChest.isUnlocked &&
      this.staffChest.mesh.position.distanceTo(playerPos) < 2.2 &&
      !this.player.isControlsLocked && !this.player.isMovementLocked && !this.isCinematicPlaying;
    const openStaffChest = chestInRange && this.inputManager.consumeInteractPress();
    const curiosityChestInRange = this.isLavaVaultOpen && !this.curiosityChestOpen &&
      this.curiosityChest.mesh.position.distanceTo(playerPos) < 2.7 &&
      !this.player.isControlsLocked && !this.player.isMovementLocked && !this.isCinematicPlaying;
    const openCuriosityChest = curiosityChestInRange && this.inputManager.consumeInteractPress();
    const gekkoPosForAction = this.gekkoNPC?.mesh?.position;
    const gekkoDistanceForAction = gekkoPosForAction
      ? Math.hypot(playerPos.x - gekkoPosForAction.x, playerPos.z - gekkoPosForAction.z)
      : Infinity;
    const gekkoNeedsAction = gekkoDistanceForAction < 5.5 && !this.isCinematicPlaying &&
      !this.player.isControlsLocked && !this.player.isMovementLocked &&
      ((this.gekkoMissionState === 'MISSION_ACTIVE' && this.collectibleSystem.coinCount < 50) || this.gekkoMissionState === 'REWARD_GIVEN');
    const interactWithGekko = gekkoNeedsAction && this.inputManager.consumeInteractPress();

    if (!this.stateFlags.bossDefeated && !this.bossEncounterActive && !this.isCinematicPlaying && !this.player.isControlsLocked) {
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
      this.gekkoNPC.update(delta);
      const gekkoPosition = this.gekkoNPC.mesh.position;
      const nearGekko = Math.hypot(playerPos.x - gekkoPosition.x, playerPos.z - gekkoPosition.z) < 7;
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
    // Spin 3D floating keys in the world & check for collection with manual E key
    for (let idx = this.keysMeshes.length - 1; idx >= 0; idx--) {
      const kMesh = this.keysMeshes[idx];
      kMesh.rotation.y += delta * 2.0;
      kMesh.position.y += Math.sin(Date.now() * 0.003) * 0.001;

      // Check distance for collection (requires E key press)
      const distToKey = kMesh.position.distanceTo(playerPos);
      if (distToKey < 2.0 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
        const keyId = kMesh.name;
        const keyPos = kMesh.position.clone();
        const keyData = this.keyDefinitions[keyId] || {
          id: keyId,
          name: 'Llave Mágica',
          color: 0xffd700,
          emissiveColor: 0xffaa00,
          obtained: false,
        };

        const hud = (window as any).gameInstance?.hud;
        hud?.showInteractionPrompt(`Presiona [E] para tomar ${keyData.name}`);

        if (this.inputManager.consumeInteractPress()) {
          hud?.hideInteractionPrompt();
          // Remove key mesh from scene and array immediately
          this.sceneManager.scene.remove(kMesh);
          this.keysMeshes.splice(idx, 1);

          KeyPickupSequence.runSequence(keyData, keyPos, this.player, this.sceneManager.scene, () => {
            this.awardKey(keyId as any, keyPos);
          });
        }
      }
    }

    // Update enemies (including DYING state for death VFX execution and memory cleanup)
    this.enemies.forEach(e => {
      if (e.state !== 'DEAD') {
        // Enemy AI uses planar distance; keep surface enemies from aggroing or
        // dealing damage through the ground while Wukong explores the crypt.
        // Continue DYING sequences everywhere so their cleanup/VFX still finish.
        if (e.state !== 'DYING' && Math.abs(e.mesh.position.y - playerPos.y) > 3.25) return;
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
      if (this.gekkoMissionState === 'NOT_STARTED') {
        this.gekkoMissionState = 'MISSION_ACTIVE';
        this.stateFlags.gekkoTalked = true;
        console.log('[GEKKO] Auto-triggering First Cinematic on proximity (dist: ' + distToGekko.toFixed(2) + 'm)');
        this.runGekkoCinematic();
      } else if (this.gekkoMissionState === 'MISSION_ACTIVE') {
        const currentCoins = this.collectibleSystem.coinCount;
        if (currentCoins >= 50) {
          this.gekkoMissionState = 'MISSION_COMPLETE';
          console.log('[GEKKO] Auto-triggering Second Cinematic (Reward) on proximity (dist: ' + distToGekko.toFixed(2) + 'm)');
          this.runGekkoSecondCinematic();
        } else {
          const hud = (window as any).gameInstance?.hud;
          hud?.showInteractionPrompt(`Hablar con Gekko (${currentCoins}/50 Monedas) [E]`);
          if (interactWithGekko) {
            this.subtitleSystem.show('Gekko', `Aún no tienes las 50 monedas Lisar (tienes ${currentCoins}/50). ¡Búscalas por todo el reino!`);
          }
        }
      } else if (this.gekkoMissionState === 'REWARD_GIVEN') {
        const hud = (window as any).gameInstance?.hud;
        hud?.showInteractionPrompt('Hablar con Gekko [E]');
        if (interactWithGekko) {
          this.subtitleSystem.show('Gekko', '¡Gracias por ayudarme con las 50 Lisar Coins! Usa esa llave para abrir el portón principal.');
        }
      }
    }

    // ── Dragon Switch Interaction (Mezzanine Floor Balcony) ──
    if (this.dragonSwitchMesh) {
      const distToSwitch = this.dragonSwitchMesh.position.distanceTo(playerPos);
      if (distToSwitch < 2.8 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
        const hud = (window as any).gameInstance?.hud;
        if (!this.isLavaVaultOpen) {
          hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Activar Palanca · Acción' : 'Activar Palanca [E]');
          if (this.inputManager.consumeInteractPress()) {
            this.isLavaVaultOpen = true;
            this.leverTarget = -Math.PI / 4;
            this.hatchTarget = 1;
          this.audioManager.playHitImpact();
          this.audioManager.playPortalActivate();
          this.subtitleSystem.show('Mecanismo Secreto', '¡El mecanismo del pabellón ha abierto una cámara secreta al otro lado del reino!');
          }
        } else {
          hud?.showInteractionPrompt('La cripta está abierta; busca la entrada al oeste.');
        }
      }
    }

    // The west-field hatch is the usable entrance to the existing crypt.
    // Use the shared E / Acción input path so neither desktop nor mobile has
    // to rely on walking through a decorative lid or an underground terrain slab.
    if (this.isLavaVaultOpen && !this.player.isControlsLocked && !this.player.isMovementLocked && !this.isCinematicPlaying) {
      const hud = (window as any).gameInstance?.hud;
      if (!this.isInsideCuriosityCrypt) {
        const dx = playerPos.x - this.curiosityCryptSurface.x;
        const dz = playerPos.z - this.curiosityCryptSurface.z;
        if (Math.hypot(dx, dz) < 3.2) {
          if (this.hatchOpenProgress > 0.92) {
            hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Entrar a la cripta · Acción' : 'Entrar a la cripta [E]');
            if (this.inputManager.consumeInteractPress()) void this.transitionCuriosityCrypt(true);
          } else {
            hud?.showInteractionPrompt('La entrada se está abriendo…');
          }
        }
      } else {
        const dx = playerPos.x - this.curiosityCryptRoomEntry.x;
        const dz = playerPos.z - this.curiosityCryptRoomEntry.z;
        if (Math.hypot(dx, dz) < 3.0) {
          hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Volver al exterior · Acción' : 'Volver al exterior [E]');
          if (this.inputManager.consumeInteractPress()) void this.transitionCuriosityCrypt(false);
        }
      }
    }

    // ── Subterranean Lava Fall Check ──
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

    // ── Energy Item / Peach Pickup Check (Instantaneous Zero-Lag Collection) ──
    for (let i = this.energyItems.length - 1; i >= 0; i--) {
      const item = this.energyItems[i];
      item.rotation.y += delta * 2.0; // Smooth visual spin
      const distToEnergy = item.position.distanceTo(playerPos);
      if (distToEnergy < 2.0 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
        hud?.showInteractionPrompt('Tomar Durazno Celestial [E]');
        const interactPressed = this.inputManager.consumeInteractPress();

        if (distToEnergy < 1.6 || interactPressed) {
          hud?.hideInteractionPrompt();
          this.collectibleSystem.spawnSparks(item.position);
          this.sceneManager.scene.remove(item);
          this.energyItems.splice(i, 1);

          this.audioManager.playPotionPickup();
          this.player.heal(35);
          this.subtitleSystem.show('Durazno Celestial', '¡Has recogido un Durazno Celestial! (+35 ENERGÍA)', 2000);
        }
      }
    }

    // ── Chest Interaction — Staff Pickup ──────────────────────────────────────
    if (curiosityChestInRange) {
      hud?.showInteractionPrompt(hud?.isTouchDevice?.() ? 'Abrir cofre · Acción' : 'Abrir cofre [E]');
    }
    if (openCuriosityChest) {
      hud?.hideInteractionPrompt();
      this.curiosityChestOpen = true;
      this.curiosityChest.isUnlocked = true;
      this.curiosityChest.unlock(this.audioManager, this.collectibleSystem, () => {
        if (this.curiosityKeySpawned || this.collectedKeys.key4_curiosity) return;
        this.curiosityKeySpawned = true;
        this.powerOrbSystem?.spawn(this.curiosityChest.mesh.position, 60);
        this.spawn3DKey('key4_curiosity', this.curiosityChest.mesh.position.clone().add(new THREE.Vector3(0, 1.25, 0)));
        this.subtitleSystem.show('Cofre antiguo', 'Dentro del cofre está la Llave de la Curiosidad.');
      });
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

        this.staffChest.unlock(this.audioManager, this.collectibleSystem);
        this.powerOrbSystem?.spawn(this.staffChest.mesh.position, 30);

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

        cinematic.run().catch(err => {
          console.error('[LevelToyStory] ChestCinematic error:', err);
          this.isCinematicPlaying = false;
          this.player.isMovementLocked = false;
          this.player.hasStaff = true;
          this.player.setStaffVisibility(true);
          this.player.attachStaffToBack();
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
    const loader = new GLTFLoader();
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    loader.load(base + 'wukong-chinese-high-house-original.glb', (gltf) => {
      const house = gltf.scene;
      house.name = 'chinese_high_house_wood_original';
      house.traverse((part) => {
        if ((part as THREE.Mesh).isMesh) {
          (part as THREE.Mesh).castShadow = false;
          (part as THREE.Mesh).receiveShadow = true;
        }
      });
      this.sceneManager.scene.add(house);
      house.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(house);
      const center = bounds.getCenter(new THREE.Vector3());
      house.position.x += this.highHouseCenter.x - center.x;
      house.position.z += this.highHouseCenter.z - center.z;
      house.position.y += this.getTerrainHeight(this.highHouseCenter.x, this.highHouseCenter.z) - bounds.min.y;
      house.updateMatrixWorld(true);
      this.optionalArchitectureStarted = true;
      this.optionalArchitectureLoading = false;
      console.info('[LevelToyStory] Loaded original Chinese High House Wood annex on demand.');
    }, undefined, (error) => {
      this.optionalArchitectureLoading = false;
      console.warn('[LevelToyStory] Optional high-house annex could not load.', error);
    });
  }

  private async transitionCuriosityCrypt(entering: boolean): Promise<void> {
    if (this.curiosityCryptTransitioning || !this.isLavaVaultOpen) return;
    this.curiosityCryptTransitioning = true;
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.player.velocity.set(0, 0, 0);
    const hud = (window as any).gameInstance?.hud;
    const cameraController = (window as any).gameInstance?.cameraController;
    hud?.hideInteractionPrompt();
    let screenIsFadedOut = false;
    try {
      if (hud) {
        await hud.fadeScreenOut(180);
        screenIsFadedOut = true;
      }
      if (entering) {
        this.player.mesh.position.copy(this.curiosityCryptRoomEntry);
        this.isInsideCuriosityCrypt = true;
      } else {
        this.player.mesh.position.set(this.curiosityCryptSurface.x, this.curiosityCryptSurface.y + 0.08, this.curiosityCryptSurface.z + 3.0);
        this.isInsideCuriosityCrypt = false;
      }
      this.player.mesh.rotation.y = entering ? Math.PI / 2 : Math.PI;
      this.player.velocity.set(0, 0, 0);
      cameraController?.snapBehindTarget();
      if (hud) {
        await hud.fadeScreenIn(220);
        screenIsFadedOut = false;
      }
      this.subtitleSystem.show(
        'Cripta de la Curiosidad',
        entering ? 'Has llegado a la cámara secreta.' : 'Has regresado al exterior.'
      );
    } catch (error) {
      console.error('[CuriosityVault] Entrance transition failed.', error);
    } finally {
      if (hud && screenIsFadedOut) await hud.fadeScreenIn(120);
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.player.velocity.set(0, 0, 0);
      this.curiosityCryptTransitioning = false;
    }
  }

  public restoreCuriosityPuzzle(hatchOpen: boolean, chestOpen: boolean, preserveLegacyExit = false): void {
    this.isLavaVaultOpen = hatchOpen;
    this.hatchTarget = hatchOpen ? 1 : 0;
    this.hatchOpenProgress = this.hatchTarget;
    this.leverTarget = hatchOpen ? -Math.PI / 4 : Math.PI / 4;
    if (this.hatchPivot) this.hatchPivot.rotation.x = -this.hatchOpenProgress * Math.PI * 0.5;
    if (this.curiosityCryptMouth) this.curiosityCryptMouth.visible = this.hatchOpenProgress > 0.28;
    if (this.dragonLeverStick) this.dragonLeverStick.rotation.x = this.leverTarget;
    this.curiosityChestOpen = chestOpen;
    if (chestOpen) {
      this.curiosityChest.restoreOpen();
      if (!this.collectedKeys.key4_curiosity) {
        this.curiosityKeySpawned = true;
        this.spawn3DKey('key4_curiosity', this.curiosityChest.mesh.position.clone().add(new THREE.Vector3(0, 1.25, 0)));
      }
    }
    if (preserveLegacyExit && this.exitDoor) this.exitDoor.open();
  }

  public restoreBossDefeated(): void {
    if (!this.stateFlags.bossDefeated || !this.bossEnemy) return;
    this.bossEncounterActive = false;
    this.stateFlags.bossCinematicPlayed = true;
    this.bossEnemy.dispose();
    (window as any).gameInstance?.hud?.hideBossHealth();
  }

  public restoreStaffChest(): void {
    if (this.stateFlags.staffFound) this.staffChest.restoreOpen();
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
    if (this.bossEncounterActive || this.stateFlags.bossDefeated) return;
    const game = (window as any).gameInstance;
    const cinematicCamera = game?.cinematicCamera;
    const cameraController = game?.cameraController;
    const hud = game?.hud;
    if (!cinematicCamera || !cameraController || !hud) return;

    this.bossEncounterActive = true;
    this.isCinematicPlaying = true;
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.player.isAttacking = false;
    this.player.forceIdle();
    this.enemies.forEach(enemy => { enemy.isPaused = true; });
    this.bossEnemy.isPaused = true;
    this.bossEnemy.mesh.position.copy(this.bossEnemy.arenaCenter!);
    this.bossEnemy.mesh.rotation.set(0, 0, 0);
    hud.showBossHealth(this.bossEnemy.health, this.bossEnemy.maxHealth);
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
      hud.showBossHealth(this.bossEnemy.health, this.bossEnemy.maxHealth);
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
      }
    );

    try {
      await cameraMove;
    } catch (error) {
      console.warn('[Boss Cinematic] Camera move ended early:', error);
      finishCinematic();
    }
  }

}
