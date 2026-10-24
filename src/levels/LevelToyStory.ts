import * as THREE from 'three';
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
  private grassUniforms: any = null;
  private grassSectors: THREE.InstancedMesh[] = [];
  private grassLodSectors: THREE.InstancedMesh[] = [];
  private grassCullElapsed = 0;
  private cloudsUniforms: any = null;
  private lampMoths: LampMothSystem | null = null;
  private curiosityChest!: TreasureChest;
  public curiosityChestOpen = false;
  private curiosityKeySpawned = false;
  private hatchPivot!: THREE.Group;
  private hatchOpenProgress = 0;
  private hatchTarget = 0;
  private leverTarget = Math.PI / 4;

  public getTerrainHeight(x: number, z: number): number {
    // Gameplay zones (Castle fortress, arena, front entrance road) are strictly flat at y = 0.0
    const castleDist = Math.max(Math.abs(x) - 14, Math.abs(z + 40) - 15);
    const arenaDist = Math.hypot(x - 45, z + 40) - 15;

    let blend = 1.0;
    if (castleDist < 8) blend *= Math.max(0, castleDist / 8);
    if (arenaDist < 8) blend *= Math.max(0, arenaDist / 8);
    if (z > -22 && Math.abs(x) < 9) blend *= Math.max(0, Math.abs(x) / 9);

    if (blend <= 0.001) return 0.0;

    const hill1 = Math.sin(x * 0.05 + z * 0.04) * 2.2;
    const hill2 = Math.cos(x * 0.09 - z * 0.07) * 1.4;
    const knoll = Math.sin(x * 0.15) * Math.sin(z * 0.15) * 0.8;
    return (hill1 + hill2 + knoll) * blend;
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
    audioManager: AudioManager
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
    this.player.onRespawn = () => queueMicrotask(() => this.handleBossPlayerRespawn());
  }

  public async init(): Promise<void> {
    this.buildToyStoryLevelGeometry();
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
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
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

    // Add key visual hints
    this.spawnKeysInWorld();

    // Pre-compile cinematic key shaders & materials ahead of time to eliminate boss death stutter
    KeyPickupSequence.precompileShaders(this.sceneManager.renderer, scene, this.sceneManager.camera);

    this.checkpointManager.respawnPlayer(this.player);
    await this.loadIntroEnvironmentAssets();
  }

  /** Adds the pavilion and a subtle green ground texture as scenery only. */
  private async loadIntroEnvironmentAssets(): Promise<void> {
    const base = import.meta.env.BASE_URL + 'assets/environment/';
    const loader = new GLTFLoader();
    const [pavilionResult, templeResult, lionResult, lampResult, grassResult, grassLodResult] = await Promise.allSettled([
      loader.loadAsync(`${base}chinese-pavilion.glb`),
      loader.loadAsync(`${base}wukong-chinese-temple.glb`),
      loader.loadAsync(`${base}wukong-porcelain-lion.glb`),
      loader.loadAsync(`${base}wukong-red-lamp.glb`),
      loader.loadAsync(`${base}wukong-grass-clumps.glb`),
      loader.loadAsync(`${base}wukong-grass-clumps-lod.glb`),
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
    if (grassResult.status === 'fulfilled' && grassLodResult.status === 'fulfilled') {
      this.buildOriginalGrass(grassResult.value.scene, grassLodResult.value.scene);
    } else {
      console.error('[Grass] Could not load the original Grass It! meshes and their derived distance LOD; no substitute grass was generated.',
        grassResult.status === 'rejected' ? grassResult.reason : grassLodResult.status === 'rejected' ? grassLodResult.reason : 'unknown load error');
    }
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
          child.receiveShadow = true;
        }
      });
      scene.add(asset);
      return asset;
    };

    if (pavilionResult.status === 'fulfilled') {
      const pavilion = pavilionResult.value.scene;
      const mainPavilion = placeAsset(pavilion, 'chinese_pavilion_intro_reference', 8.5, 20, 24);
      placeAsset(pavilion, 'chinese_pavilion_west_landmark', 8.5, -55, -75);
      this.addPavilionCollision(mainPavilion, 8.5);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Pavilion asset.', pavilionResult.reason);
    }

    if (templeResult.status === 'fulfilled') {
      const temple = templeResult.value.scene;
      // One temple anchors the route beyond Gekko. The duplicate eastern
      // sanctuary was removed; its staff reward now lives in the pavilion.
      const routeTemple = placeAsset(temple, 'chinese_temple_gekko_route', 24, 0, -40);
      this.addTempleCollision(routeTemple, 24, 8);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Temple asset.', templeResult.reason);
    }

    if (lionResult.status === 'fulfilled') {
      placeAsset(lionResult.value.scene, 'chinese_porcelain_guardian_pair', 7.6, 0, -21.7);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese Porcelain Lion asset.', lionResult.reason);
    }

    if (lampResult.status === 'fulfilled') {
      const lamps = placeAsset(lampResult.value.scene, 'chinese_red_lamp_entry_pair', 3.8, 0, -26.8);
      // The supplied asset is a paired hanging lantern prop. Lift its group
      // under the entry eave instead of leaving it at character/ground level.
      lamps.position.y += 4.8;
      const anchors = [new THREE.Vector3(-2.25, 5.1, -26.8), new THREE.Vector3(2.25, 5.1, -26.8)];
      anchors.forEach((position) => {
        const light = new THREE.PointLight(0xffaa58, 0.9, 7, 2);
        light.position.copy(position);
        light.castShadow = false;
        scene.add(light);
        this.dayNightCycle?.registerNightLight(light);
      });
      const mobile = window.innerWidth <= 1024 || navigator.maxTouchPoints > 0;
      this.lampMoths = new LampMothSystem(scene, anchors, mobile);
    } else {
      console.warn('[LevelToyStory] Could not load the Chinese red lamp asset.', lampResult.reason);
    }

    const warmFill = new THREE.PointLight(0xffb56b, 3.5, 26, 2);
    warmFill.position.set(0, this.getTerrainHeight(0, -34) + 7, -34);
    warmFill.castShadow = false;
    scene.add(warmFill);
    this.dayNightCycle?.registerNightLight(warmFill);
    this.player.setColliders(this.levelColliders);
    this.cameraController.setCollisionObjects(this.levelColliders);

  }

  /** Lightweight static blockers around the pavilion; the entrances stay open. */
  private addPavilionCollision(asset: THREE.Object3D, targetWidth: number): void {
    const bounds = new THREE.Box3().setFromObject(asset);
    const center = bounds.getCenter(new THREE.Vector3());
    const half = targetWidth * 0.5;
    const ground = bounds.min.y;
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    const addWall = (w: number, h: number, d: number, x: number, z: number) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      wall.position.set(x, ground + h / 2, z);
      wall.name = 'pavilion_static_collision';
      this.sceneManager.scene.add(wall);
      this.levelColliders.push(wall);
    };
    const doorWidth = 2.8;
    addWall(0.35, 2.7, targetWidth, center.x - half, center.z);
    addWall(0.35, 2.7, targetWidth, center.x + half, center.z);
    addWall(half - doorWidth / 2, 2.7, 0.35, center.x - (half + doorWidth / 2) / 2, center.z + half);
    addWall(half - doorWidth / 2, 2.7, 0.35, center.x + (half + doorWidth / 2) / 2, center.z + half);
    addWall(targetWidth, 2.7, 0.35, center.x, center.z - half);
    const columnHeight = Math.min(4.8, bounds.max.y - ground);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, columnHeight, 8), mat);
      column.position.set(center.x + sx * half * 0.34, ground + columnHeight / 2, center.z + sz * half * 0.34);
      column.name = 'pavilion_column_static_collision';
      this.sceneManager.scene.add(column);
      this.levelColliders.push(column);
    }
  }

  /** Simple perimeter colliders preserve a walk-through entrance and avoid
   * raycasting the high-poly decorative GLB on every player frame. */
  private addTempleCollision(asset: THREE.Object3D, targetWidth: number, entranceWidth: number): void {
    const bounds = new THREE.Box3().setFromObject(asset);
    const center = bounds.getCenter(new THREE.Vector3());
    const half = targetWidth * 0.5;
    const ground = bounds.min.y;
    const height = Math.min(6.5, bounds.max.y - ground);
    const thickness = 0.45;
    const mat = new THREE.MeshBasicMaterial({ visible: false });
    const add = (w: number, d: number, x: number, z: number) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, height, d), mat);
      wall.position.set(x, ground + height / 2, z);
      wall.name = 'chinese_temple_static_collision';
      this.sceneManager.scene.add(wall);
      this.levelColliders.push(wall);
    };
    add(thickness, targetWidth, center.x - half, center.z);
    add(thickness, targetWidth, center.x + half, center.z);
    add(targetWidth, thickness, center.x, center.z - half);
    const segment = (targetWidth - entranceWidth) / 2;
    add(segment, thickness, center.x - half + segment / 2, center.z + half);
    add(segment, thickness, center.x + half - segment / 2, center.z + half);
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
  private buildOriginalGrass(sourceRoot: THREE.Object3D, lodRoot: THREE.Object3D): void {
    const sourceNames = ['Grass_Short', 'Grass_Lush', 'Grass_Tall'] as const;
    const weights = [0.43, 0.43, 0.14];
    const scaleRanges: Array<[number, number]> = [[0.9, 1.08], [0.78, 1.28], [0.72, 1.18]];
    this.grassUniforms = {
      uTime: { value: 0 },
      uPlayerPos: { value: new THREE.Vector3(999, 999, 999) },
    };
    sourceRoot.updateMatrixWorld(true);
    lodRoot.updateMatrixWorld(true);

    const templates = sourceNames.map((name) => {
      const source = sourceRoot.getObjectByName(name) as THREE.Mesh | null;
      if (!source?.isMesh) throw new Error(`Original grass GLB is missing mesh ${name}`);
      const geometry = source.geometry.clone().applyMatrix4(source.matrixWorld);
      geometry.computeBoundingBox();
      const bounds = geometry.boundingBox!;
      const height = Math.max(0.05, bounds.max.y - bounds.min.y);
      const centerX = (bounds.min.x + bounds.max.x) * 0.5;
      const centerZ = (bounds.min.z + bounds.max.z) * 0.5;
      geometry.translate(-centerX, -bounds.min.y, -centerZ);
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      const lodSource = lodRoot.getObjectByName(`${name}_LOD`) as THREE.Mesh | null;
      if (!lodSource?.isMesh) throw new Error(`Derived grass LOD is missing mesh ${name}_LOD`);
      const lodGeometry = lodSource.geometry.clone().applyMatrix4(lodSource.matrixWorld);
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
        material: materials.length === 1 ? materials[0] : materials,
        minScale: scaleRanges[sourceNames.indexOf(name)][0],
        maxScale: scaleRanges[sourceNames.indexOf(name)][1],
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
      if (Math.abs(x) < 18.5 && Math.abs(z + 40) < 18.5) return true;
      if (Math.hypot(x - 45, z + 40) < 16.2) return true;
      if (Math.hypot(x + 55, z + 75) < 11.2 || Math.hypot(x - 55, z + 75) < 19.2) return true;
      if (Math.hypot(x - 20, z - 24) < 7.5) return true;
      if (Math.hypot(x + 30, z - 10) < 9 || Math.hypot(x + 45, z + 40) < 9) return true;
      if (Math.abs(x) < 4.2 && z > -27 && z < 17) return true;
      if (Math.abs(z + 75) < 2.8 && Math.abs(x) < 56) return true;
      for (const road of roads) for (let i = 0; i < road.length - 1; i++) {
        if (segmentDistance(x, z, road[i][0], road[i][1], road[i + 1][0], road[i + 1][1]) < 3.15) return true;
      }
      return false;
    };

    const isMobile = window.innerWidth <= 1024 || navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const sectorSize = 32;
    const spacing = isMobile ? 1.18 : 0.92;
    const sectorsPerAxis = Math.ceil(160 / sectorSize);
    let placedTotal = 0;
    for (let sx = 0; sx < sectorsPerAxis; sx++) {
      for (let sz = 0; sz < sectorsPerAxis; sz++) {
        const x0 = -80 + sx * sectorSize;
        const z0 = -120 + sz * sectorSize;
        const matrices = templates.map(() => [] as THREE.Matrix4[]);
        const steps = Math.ceil(sectorSize / spacing);
        for (let gx = 0; gx < steps; gx++) for (let gz = 0; gz < steps; gz++) {
          const x = x0 + (gx + 0.12 + random() * 0.76) * spacing;
          const z = z0 + (gz + 0.12 + random() * 0.76) * spacing;
          if (x > 80 || z > 40 || excluded(x, z)) continue;
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
          dummy.scale.setScalar(scale);
          dummy.updateMatrix();
          matrices[variant].push(dummy.matrix.clone());
        }

        matrices.forEach((instances, variant) => {
          if (!instances.length) return;
          const template = templates[variant];
          const sector = new THREE.InstancedMesh(template.geometry, template.material, instances.length);
          const lodSector = new THREE.InstancedMesh(template.lodGeometry, template.material, instances.length);
          sector.name = `grassit-${template.name.toLowerCase()}-sector-${sx}-${sz}`;
          lodSector.name = `${sector.name}-lod`;
          const center = new THREE.Vector2(x0 + sectorSize * 0.5, z0 + sectorSize * 0.5);
          sector.userData.grassCenter = center;
          sector.userData.grassLod = lodSector;
          lodSector.userData.grassCenter = center;
          sector.castShadow = false;
          sector.receiveShadow = false;
          lodSector.castShadow = false;
          lodSector.receiveShadow = false;
          lodSector.visible = false;
          sector.instanceMatrix.setUsage(THREE.StaticDrawUsage);
          lodSector.instanceMatrix.setUsage(THREE.StaticDrawUsage);
          instances.forEach((matrix, index) => sector.setMatrixAt(index, matrix));
          instances.forEach((matrix, index) => lodSector.setMatrixAt(index, matrix));
          sector.instanceMatrix.needsUpdate = true;
          lodSector.instanceMatrix.needsUpdate = true;
          this.sceneManager.scene.add(sector);
          this.sceneManager.scene.add(lodSector);
          this.grassSectors.push(sector);
          this.grassLodSectors.push(lodSector);
          placedTotal += instances.length;
        });
      }
    }
    console.info(`[Grass] ${placedTotal} original Grass It! clumps from ${sourceNames.join(', ')} in ${sectorSize}m sectors (${isMobile ? 'mobile' : 'desktop'} spacing ${spacing}m)`);
  }

  private buildToyStoryLevelGeometry(): void {
    const scene = this.sceneManager.scene;

    // Generate Textures
    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.repeat.set(4, 4);
    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.65, bumpScale: 0.04 });
    const groundBaseMat = new THREE.MeshStandardMaterial({ color: 0x526b32, roughness: 0.98 }); // Warm green distant ground LOD
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
    this.levelColliders.push(worldFloor);

    // ═══════════════════════════════════════════════════════════════════════════════
    // Grass It! mesh variants are instanced from the original exported GLB after async asset loading.

    // ▓▓▓  HIGH-PERFORMANCE INSTANCED 3D GLTF FOLIAGE & NATURE MANAGER  ▓▓▓
    // Combines 350+ individual meshes into 3 single InstancedMesh draw calls!
    // ═══════════════════════════════════════════════════════════════════════════════
    (() => {
      const gltfLoader = new GLTFLoader();

      // 1. Real 3D Conifer Pine & Oak Trees
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/tree_conifer.gltf', (gltf) => {
        const treeTemplate = gltf.scene;
        const treePositions = [
          [-45, 0, 15], [-55, 0, -20], [-60, 0, -55], [55, 0, 10], [60, 0, -20],
          [-25, 0, -90], [25, 0, -90], [-40, 0, -80], [45, 0, -80], [0, 0, -105]
        ];
        treePositions.forEach(([x, y, z]) => {
          const t = treeTemplate.clone();
          t.position.set(x, y, z);
          t.rotation.y = Math.random() * Math.PI * 2;
          const s = 1.0 + Math.random() * 0.5;
          t.scale.set(s, s * (0.9 + Math.random() * 0.3), s);
          scene.add(t);
          this.levelColliders.push(t);
        });
      });

      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/tree_oak.gltf', (gltf) => {
        const oakTemplate = gltf.scene;
        const oakPositions = [
          [-35, 0, -10], [35, 0, -15], [-20, 0, -75], [20, 0, -75], [-50, 0, -45]
        ];
        oakPositions.forEach(([x, y, z]) => {
          const t = oakTemplate.clone();
          t.position.set(x, y, z);
          t.rotation.y = Math.random() * Math.PI * 2;
          const s = 0.9 + Math.random() * 0.4;
          t.scale.set(s, s, s);
          scene.add(t);
          this.levelColliders.push(t);
        });
      });

      // 2. Real 3D Meadow Shrubs & Bushes (InstancedMesh: 1 single draw call)
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/bush_meadow.gltf', (gltf) => {
        let bushMesh: THREE.Mesh | null = null;
        gltf.scene.traverse((c) => {
          if (!bushMesh && (c as THREE.Mesh).isMesh) bushMesh = c as THREE.Mesh;
        });

        if (bushMesh) {
          const bushPositions = [
            [-28, 0, 8], [-32, 0, 12], [-42, 0, -38], [-48, 0, -42],
            [28, 0, -12], [32, 0, -18], [-15, 0, -85], [15, 0, -85],
            [-8, 0, -22], [8, 0, -22], [-14, 0, -12], [14, 0, -12]
          ];
          const instancedBushes = new THREE.InstancedMesh((bushMesh as THREE.Mesh).geometry, (bushMesh as THREE.Mesh).material, bushPositions.length);
          const dummy = new THREE.Object3D();

          bushPositions.forEach(([x, y, z], idx) => {
            dummy.position.set(x, y, z);
            dummy.rotation.y = Math.random() * Math.PI * 2;
            const s = 1.0 + Math.random() * 0.6;
            dummy.scale.set(s, s * (0.8 + Math.random() * 0.4), s);
            dummy.updateMatrix();
            instancedBushes.setMatrixAt(idx, dummy.matrix);
          });
          instancedBushes.instanceMatrix.needsUpdate = true;
          instancedBushes.castShadow = true;
          instancedBushes.receiveShadow = true;
          scene.add(instancedBushes);
        }
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
    // The old switch was stranded on the removed mezzanine. Put it beside the
    // hatch at ground level so the curiosity chain remains reachable.
    switchGroup.position.set(-14.0, this.getTerrainHeight(-14.0, -34.1), -34.1);

    const switchPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.9, 8), stoneMat);
    switchPedestal.position.y = 0.45;
    switchPedestal.castShadow = true;
    switchGroup.add(switchPedestal);

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

    // 5. Exit Portal/Door at the back of the castle
    this.exitDoor = new Door('door_exit', new THREE.Vector3(0, this.getTerrainHeight(0, castleCenterZ - 15) + 0.1, castleCenterZ - 15), 0, true);
    scene.add(this.exitDoor.mesh);
    this.doors.push(this.exitDoor);
    this.levelColliders.push(this.exitDoor.mesh);

    // 6. Ancient Ruins & Landmarks (Expanded Map)
    this.buildAncientRuinsAndLandmarks();

    // Configure collision objects in controllers
    this.cameraController.setCollisionObjects(this.levelColliders);
    this.player.setColliders(this.levelColliders);
  }

  private buildCuriosityVault(scene: THREE.Scene, stoneMat: THREE.Material, castleCenterZ: number): void {
    // Real floor opening; the original solid 28m slab continued beneath its hatch.
    this.hatchPivot = new THREE.Group();
    this.hatchPivot.name = 'curiosity_hatch_hinge';
    this.hatchPivot.position.set(-9.0, 0.4, castleCenterZ + 5.9);
    this.lavaVaultHatch = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 4.2), stoneMat);
    this.lavaVaultHatch.name = 'curiosity_hatch_lid';
    this.lavaVaultHatch.position.set(0, -0.2, 2.1);
    this.lavaVaultHatch.castShadow = true;
    this.lavaVaultHatch.receiveShadow = true;
    this.hatchPivot.add(this.lavaVaultHatch);
    scene.add(this.hatchPivot);
    this.levelColliders.push(this.lavaVaultHatch);

    const stairLen = 8.0;
    const stairDrop = 6.0;
    const angle = Math.atan(stairDrop / stairLen);
    const ramp = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.14, Math.hypot(stairLen, stairDrop)), new THREE.MeshBasicMaterial({ visible: false }));
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

    const floor = new THREE.Mesh(new THREE.BoxGeometry(29.5, 0.4, 27.5), stoneMat);
    floor.name = 'curiosity_chamber_floor';
    floor.position.set(-22.25, -6.1, castleCenterZ);
    floor.receiveShadow = true;
    scene.add(floor);
    this.levelColliders.push(floor);

    const walls = [
      [29.5, 7.0, 0.7, -22.25, -2.45, castleCenterZ - 13.75],
      [29.5, 7.0, 0.7, -22.25, -2.45, castleCenterZ + 13.75],
      [0.7, 7.0, 27.5, -37.0, -2.45, castleCenterZ],
    ];
    walls.forEach(([width, height, depth, x, y, z], index) => {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), stoneMat);
      wall.name = `curiosity_chamber_wall_${index}`;
      wall.position.set(x, y, z);
      scene.add(wall);
      this.levelColliders.push(wall);
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

    // 1. Ruta Imperial del Oeste (Palacio → Templo 02 Pagoda de la Montaña)
    const westWaypoints = [
      new THREE.Vector3(-12, 0, -35),
      new THREE.Vector3(-22, 0, -45),
      new THREE.Vector3(-35, 0, -58),
      new THREE.Vector3(-48, 0, -68),
      new THREE.Vector3(-55, 0, -75)
    ];

    for (let w = 0; w < westWaypoints.length - 1; w++) {
      const pA = westWaypoints[w];
      const pB = westWaypoints[w + 1];
      const steps = 8;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const rx = THREE.MathUtils.lerp(pA.x, pB.x, t);
        const rz = THREE.MathUtils.lerp(pA.z, pB.z, t);
        const ry = this.getTerrainHeight(rx, rz) + 0.04;

        const pathSlab = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 4.2), stoneMat);
        pathSlab.position.set(rx, ry, rz);
        pathSlab.rotation.y = Math.atan2(pB.x - pA.x, pB.z - pA.z);
        pathSlab.receiveShadow = true;
        scene.add(pathSlab);

        // Place Tōrō lantern every 4 steps on alternating sides of the road
        if (s % 4 === 0) {
          const sideOffset = (s % 8 === 0 ? 2.6 : -2.6);
          const perpX = -Math.sin(pathSlab.rotation.y) * sideOffset;
          const perpZ = Math.cos(pathSlab.rotation.y) * sideOffset;
          createToroLantern(rx + perpX, rz + perpZ, 0xff9900);
        }
      }
    }

    // 2. Ruta Imperial del Este (Palacio → Templo 03 Santuario del Báculo)
    const eastWaypoints = [
      new THREE.Vector3(12, 0, -35),
      new THREE.Vector3(22, 0, -45),
      new THREE.Vector3(35, 0, -58),
      new THREE.Vector3(48, 0, -68),
      new THREE.Vector3(55, 0, -75)
    ];

    for (let w = 0; w < eastWaypoints.length - 1; w++) {
      const pA = eastWaypoints[w];
      const pB = eastWaypoints[w + 1];
      const steps = 8;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const rx = THREE.MathUtils.lerp(pA.x, pB.x, t);
        const rz = THREE.MathUtils.lerp(pA.z, pB.z, t);
        const ry = this.getTerrainHeight(rx, rz) + 0.04;

        const pathSlab = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 4.2), stoneMat);
        pathSlab.position.set(rx, ry, rz);
        pathSlab.rotation.y = Math.atan2(pB.x - pA.x, pB.z - pA.z);
        pathSlab.receiveShadow = true;
        scene.add(pathSlab);

        if (s % 4 === 0) {
          const sideOffset = (s % 8 === 0 ? 2.6 : -2.6);
          const perpX = -Math.sin(pathSlab.rotation.y) * sideOffset;
          const perpZ = Math.cos(pathSlab.rotation.y) * sideOffset;
          createToroLantern(rx + perpX, rz + perpZ, 0x00e5ff);
        }
      }
    }

    // 3. Ruta de la Cresta Norte (Conexión entre Templo 02 y Templo 03)
    for (let s = 0; s <= 15; s++) {
      const t = s / 15;
      const rx = THREE.MathUtils.lerp(-55, 55, t);
      const rz = -75;
      const ry = this.getTerrainHeight(rx, rz) + 0.04;

      const ridgeSlab = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 3.6), stoneMat);
      ridgeSlab.position.set(rx, ry, rz);
      ridgeSlab.receiveShadow = true;
      scene.add(ridgeSlab);
    }
  }

  private setupInteractiveProps(): void {
    const scene = this.sceneManager.scene;

    // Put the existing staff reward on the pavilion's center table. The chest
    // remains the single inventory/save-backed reward and stays interactable
    // from the floor beside the table.
    const staffChestPosition = new THREE.Vector3(20.0, this.getTerrainHeight(20.0, 24.0) + 1.75, 23.0);
    this.staffChest = new TreasureChest(staffChestPosition, Math.PI);
    scene.add(this.staffChest.mesh);
    this.chests.push(this.staffChest);
    this.spellSystem.registerChest(this.staffChest);
    this.levelColliders.push(this.staffChest.mesh);

    // ── Runic Fast-Travel Portal Network (PortalPair_01) ───────────────────────
    // Portal A sits beside the sanctuary path at ground level; the replaced
    // visual-only temple no longer provides a traversable balcony or stairs.
    const staffPortalY = this.getTerrainHeight(25.0, 24.0) + 0.05;
    const portalA = new RunicPortal({
      id: 'Portal_A_StaffTemple',
      pairId: 'PortalPair_01',
      displayName: 'Santuario del Báculo',
      position: new THREE.Vector3(25.0, staffPortalY, 24.0),
      rotationY: -Math.PI / 2,
      exitPoint: new THREE.Vector3(22.0, this.getTerrainHeight(22.0, 24.0) + 0.05, 24.0),
      exitYaw: -Math.PI / 2,
      unlockedByDefault: false,
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

    // ── AUTOMATED COIN POSITION VALIDATION & COLLISION CHECKER ──
    const validateCoinPosition = (pos: THREE.Vector3): THREE.Vector3 => {
      const checkedPos = pos.clone();

      // All exploration collectibles now sit on the real terrain surface;
      // no coin remains suspended on removed mezzanine/roof geometry.
      checkedPos.y = this.getTerrainHeight(checkedPos.x, checkedPos.z) + 0.6;

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
    // Position Gekko right alongside the entrance avenue, elevated +0.18m so his feet sit perfectly on top of floor
    const gekkoY = this.getTerrainHeight(-2.8, -10) + 0.18;
    this.gekkoNPC = new GekkoNPC(new THREE.Vector3(-2.8, gekkoY, -10), -Math.PI * 0.25);
    this.gekkoNPC.loadModels();
    this.sceneManager.scene.add(this.gekkoNPC.mesh);

    // Gekko's physical collider (prevents Wukong from passing through Gekko)
    const gekkoCollider = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2.5, 12),
      new THREE.MeshBasicMaterial({ visible: false })
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

    // Boss Giant Crab in the Sand Arena (firmly grounded at y = 0.2)
    const bossY = 0.2;
    this.bossEnemy = new EnemyController('crab_boss', new THREE.Vector3(45, bossY, -40));
    this.enemies.push(patrol1, patrol2, patrol3, patrol4, patrol5, this.bossEnemy);

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

    const keyLight = new THREE.PointLight(emissiveColor, 3.5, 5.5);
    keyLight.position.set(0, 0, 0);
    keyGroup.add(keyLight);

    keyGroup.add(ring, shaft, tooth1, tooth2);
    scene.add(keyGroup);
    this.keysMeshes.push(keyGroup);
    console.log(`[LevelToyStory] ✅ Spawned 3D Key '${id}' at`, pos);
  }

  // Spawns the sparkles and unlocks the key
  public awardKey(keyId: keyof typeof this.collectedKeys, spawnPos?: THREE.Vector3): void {
    if (this.collectedKeys[keyId]) return;
    this.collectedKeys[keyId] = true;

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

    // Exit portal trigger at the back
    const tExit = new TriggerZone('trig_exit', new THREE.Vector3(-5, -1, -54), new THREE.Vector3(5, 5, -50), () => {
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
    const interactionHud = (window as any).gameInstance?.hud;
    interactionHud?.beginInteractionFrame();
    // Tick Dynamic Day/Night Cycle
    if (this.dayNightCycle) {
      this.dayNightCycle.update(delta, playerPos);
    }

    if (this.grassUniforms) {
      this.grassUniforms.uTime.value = performance.now() / 1000.0;
      if (this.grassUniforms.uPlayerPos) {
        this.grassUniforms.uPlayerPos.value.copy(playerPos);
      }
    }
    this.grassCullElapsed -= delta;
    if (this.grassCullElapsed <= 0) {
      // Keep original source clumps at close range and switch to derived,
      // topology-reduced copies in the middle distance. The ground material
      // carries coverage beyond the vegetation range.
      const isMobile = window.innerWidth <= 1024 || navigator.maxTouchPoints > 0 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const detailedDistance = isMobile ? 48 : 68;
      const lodDistance = isMobile ? 104 : 148;
      for (let i = 0; i < this.grassSectors.length; i++) {
        const sector = this.grassSectors[i];
        const lodSector = this.grassLodSectors[i];
        const center = sector.userData.grassCenter as THREE.Vector2;
        const dx = playerPos.x - center.x;
        const dz = playerPos.z - center.y;
        // Distance to the nearest point of the 32m sector avoids the visible
        // circular cutoff caused by testing only each sector's center.
        const edgeX = Math.max(Math.abs(dx) - 16, 0);
        const edgeZ = Math.max(Math.abs(dz) - 16, 0);
        const distanceSq = edgeX * edgeX + edgeZ * edgeZ;
        sector.visible = distanceSq <= detailedDistance * detailedDistance;
        lodSector.visible = !sector.visible && distanceSq <= lodDistance * lodDistance;
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
    }
    if (this.dragonLeverStick) {
      this.dragonLeverStick.rotation.x = THREE.MathUtils.damp(this.dragonLeverStick.rotation.x, this.leverTarget, 9, delta);
    }
    // Update elevator platforms
    this.movingPlatforms.forEach(p => p.update(delta));

    // Check triggers
    this.triggerZones.forEach(t => t.check(playerPos, delta));

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
            this.audioManager.playCardPickup();
            void this.runCuriosityReveal();
            this.subtitleSystem.show('Mecanismo Secreto', '¡Has activado la Palanca del Dragón! La Cripta de Lava Subterránea se ha abierto en la planta baja.');
          }
        } else {
          hud?.showInteractionPrompt('Trampilla abierta: baja por las escaleras');
        }
      }
    }

    // ── Subterranean Lava Fall Check ──
    if (playerPos.y < -7.2 && playerPos.x <= -10 && playerPos.x >= -36 && playerPos.z >= -54 && playerPos.z <= -26) {
      this.player.takeDamage(15);
      this.player.mesh.position.set(-9.0, -5.5, -40.0);
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
        this.spawn3DKey('key4_curiosity', this.curiosityChest.mesh.position.clone().add(new THREE.Vector3(0, 1.25, 0)));
        this.subtitleSystem.show('Cofre antiguo', 'Dentro del cofre está la Llave de la Curiosidad.');
      });
    }

    if (!this.stateFlags.staffFound && this.staffChest.mesh.position.distanceTo(playerPos) < 2.2 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
      const hud = (window as any).gameInstance?.hud;
      hud?.showInteractionPrompt('Presiona [E] para abrir cofre');

      if (openStaffChest && !this.staffChest.isUnlocked) {
        this.stateFlags.staffFound = true;
        this.staffChest.isUnlocked = true;
        this.isCinematicPlaying = true;
        hud?.hideInteractionPrompt();

        // Pause enemy AI!
        this.enemies.forEach(e => e.isPaused = true);

        this.staffChest.unlock(this.audioManager, this.collectibleSystem);

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

  private async runCuriosityReveal(): Promise<void> {
    if (this.isCinematicPlaying) return;
    const game = (window as any).gameInstance;
    const cinematicCamera = game?.cinematicCamera;
    const cameraController = game?.cameraController;
    if (!cinematicCamera || !cameraController) return;

    this.isCinematicPlaying = true;
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.player.velocity.set(0, 0, 0);
    this.enemies.forEach((enemy) => { enemy.isPaused = true; });
    try {
      const hatchLook = new THREE.Vector3(-9, 0.2, this.curiosityChest.mesh.position.z + 6);
      const from = cameraController.camera.position.clone();
      const to = new THREE.Vector3(-5.5, 5.5, hatchLook.z + 5.5);
      await cinematicCamera.moveCamera(from, to, this.player.mesh.position.clone().add(new THREE.Vector3(0, 1, 0)), hatchLook, 1.8);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    } catch (error) {
      console.warn('[CuriosityVault] Reveal camera failed; restoring gameplay camera.', error);
    } finally {
      cinematicCamera.abort();
      cameraController.setTarget(this.player.mesh);
      cameraController.resumeAfterCinematic();
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.player.velocity.set(0, 0, 0);
      this.enemies.forEach((enemy) => { enemy.isPaused = false; });
      this.isCinematicPlaying = false;
    }
  }

  public restoreCuriosityPuzzle(hatchOpen: boolean, chestOpen: boolean, preserveLegacyExit = false): void {
    this.isLavaVaultOpen = hatchOpen;
    this.hatchTarget = hatchOpen ? 1 : 0;
    this.hatchOpenProgress = this.hatchTarget;
    this.leverTarget = hatchOpen ? -Math.PI / 4 : Math.PI / 4;
    if (this.hatchPivot) this.hatchPivot.rotation.x = -this.hatchOpenProgress * Math.PI * 0.5;
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
