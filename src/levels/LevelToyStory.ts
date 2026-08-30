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
import { ItemPickupVFX } from '../player/ItemPickupVFX';

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

  public levelColliders: THREE.Object3D[] = [];
  public triggerZones: TriggerZone[] = [];
  public doors: Door[] = [];
  public pots: DestructiblePot[] = [];
  public chests: TreasureChest[] = [];
  public enemies: EnemyController[] = [];
  public gargoyles: LumosGargoyle[] = [];
  public movingPlatforms: MovingPlatform[] = [];

  // Key tracking
  public collectedKeys = {
    key1_gekko: false, // 50 coins quest
    key2_boss: false,  // boss arena
    key3_platform: false, // high tower
    key4_gargoyles: false, // 4 gargoyles lit
    key5_pots: false // 5 special pots smashed
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
  private cloudsUniforms: any = null;

  public getTerrainHeight(x: number, z: number): number {
    if (x > -35 && x < 35 && z > -70 && z < 25) {
      return 0.0;
    }
    const h1 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 2.8;
    const h2 = Math.sin(x * 0.095 + z * 0.07) * 1.5;
    return Math.max(0.0, h1 + h2);
  }

  // Quest states & Gekko Mission State Machine
  public gekkoMissionState: 'NOT_STARTED' | 'MISSION_ACTIVE' | 'MISSION_COMPLETE' | 'REWARD_GIVEN' = 'NOT_STARTED';
  private isCinematicPlaying = false;
  private coinsExchanged = false;
  private litGargoylesCount = 0;
  private specialPotsSmashed = 0;
  private totalSpecialPots = 5;

  // Generic Key Registry with Color Data
  public keyDefinitions: Record<string, KeyData> = {
    key1_gekko: { id: 'key1_gekko', name: 'Llave de la Riqueza (Gekko)', color: 0xff6600, emissiveColor: 0xff8800, obtained: false },
    key2_boss: { id: 'key2_boss', name: 'Llave de la Valentía (Jefe Cangrejo)', color: 0xff2200, emissiveColor: 0xff4400, obtained: false },
    key3_platform: { id: 'key3_platform', name: 'Llave de Plataformas (Tejado)', color: 0x00e5ff, emissiveColor: 0x00bfff, obtained: false },
    key4_gargoyles: { id: 'key4_gargoyles', name: 'Llave del Secreto (Gárgolas)', color: 0xa855f7, emissiveColor: 0x9333ea, obtained: false },
    key5_pots: { id: 'key5_pots', name: 'Llave de Destrucción (Gemas)', color: 0xffd700, emissiveColor: 0xffaa00, obtained: false },
  };

  // Visual markers for keys
  private keysMeshes: THREE.Group[] = [];

  // Boss reference
  private bossEnemy!: EnemyController;

  public stateFlags = {
    introCompleted: false,
    staffFound: false,
    gekkoTalked: false,
    bossCinematicPlayed: false,
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
  }

  public init(): void {
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

    // Add key visual hints
    this.spawnKeysInWorld();

    // Pre-compile cinematic key shaders & materials ahead of time to eliminate boss death stutter
    KeyPickupSequence.precompileShaders(this.sceneManager.renderer, scene, this.sceneManager.camera);

    this.checkpointManager.respawnPlayer(this.player);
  }

  private buildToyStoryLevelGeometry(): void {
    const scene = this.sceneManager.scene;

    // Generate Textures
    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.repeat.set(4, 4);
    const floorTex = TextureGenerator.createAncientRuinedFlagstonesTexture();
    floorTex.repeat.set(6, 6);
    const floorNormalTex = TextureGenerator.createCastleFloorNormalMap();
    floorNormalTex.repeat.set(6, 6);

    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.65, bumpScale: 0.04 });
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      normalMap: floorNormalTex,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.78,
      metalness: 0.12
    });
    const groundBaseMat = new THREE.MeshStandardMaterial({ color: 0x224925, roughness: 0.95 }); // Deep rich base for grass
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xc2b280, roughness: 0.85 });  // Arena floor

    // 1. Rolling Undulating Terrain Mesh (160 x 160, 64x64 segments)
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 64, 64);
    terrainGeo.rotateX(-Math.PI / 2); // Orient horizontally

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i) - 40; // Align with center at (0, 0, -40)

      // Calculate distance to gameplay zones (Castle, Arena, Paths)
      const castleDist = Math.max(Math.abs(x) - 14, Math.abs(z + 40) - 15);
      const arenaDist = Math.hypot(x - 45, z + 40) - 15;

      // Blend factor: 0.0 near gameplay zones (flat), 1.0 in open wilderness
      let blend = 1.0;
      if (castleDist < 8) blend *= Math.max(0, castleDist / 8);
      if (arenaDist < 8) blend *= Math.max(0, arenaDist / 8);
      if (z > -20 && Math.abs(x) < 8) blend *= Math.max(0, Math.abs(x) / 8);

      // Layered organic noise for soft rolling hills, knolls, and valley dips
      const hill1 = Math.sin(x * 0.05 + z * 0.04) * 2.2;
      const hill2 = Math.cos(x * 0.09 - z * 0.07) * 1.4;
      const knoll = Math.sin(x * 0.15) * Math.sin(z * 0.15) * 0.8;

      const y = (hill1 + hill2 + knoll) * blend;
      posAttr.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const worldFloor = new THREE.Mesh(terrainGeo, groundBaseMat);
    worldFloor.position.set(0, 0, -40);
    worldFloor.receiveShadow = true;
    scene.add(worldFloor);
    this.levelColliders.push(worldFloor);

    // ═══════════════════════════════════════════════════════════════════════════════
    // ▓▓▓  AAA GRASS SYSTEM  ▓▓▓  GPU Instanced • Wind Shader • 80k Blades
    // ═══════════════════════════════════════════════════════════════════════════════
    // Each "instance" = 3 intersecting tapered blades (cross-clump).
    // 6 vertical segments per blade → smooth S-curve wind bending.
    // Wind: 4 independent layers (base drift, FBM noise, gust wave, player push).
    // Roots are pinned. Only tips sway. Exactly like Nintendo/Breath of the Wild.
    // ═══════════════════════════════════════════════════════════════════════════════

    (() => {
      const SEG     = 6;        // vertical segments per blade (quality of bending)
      const BW      = 0.20;     // blade half-width at base
      const BH      = 1.4;      // blade height (world units)

      // ── Build one tapered blade (PlaneGeometry with manual taper) ──────────────
      const buildBlade = (rotY: number): THREE.BufferGeometry => {
        const vCount = (SEG + 1) * 2; // 2 verts per row
        const positions = new Float32Array(vCount * 3);
        const uvs       = new Float32Array(vCount * 2);
        const normals   = new Float32Array(vCount * 3);

        for (let row = 0; row <= SEG; row++) {
          const t     = row / SEG;             // 0 (root) → 1 (tip)
          const y     = t * BH;
          const taper = 1.0 - t * 0.85;       // narrows to 15% at tip
          const w     = BW * taper;

          const lIdx = row * 2;
          const rIdx = row * 2 + 1;

          // Left vertex
          positions[lIdx * 3 + 0] = -w;
          positions[lIdx * 3 + 1] =  y;
          positions[lIdx * 3 + 2] =  0;
          uvs[lIdx * 2 + 0] = 0;
          uvs[lIdx * 2 + 1] = t;
          normals[lIdx * 3 + 0] = 0; normals[lIdx * 3 + 1] = 0; normals[lIdx * 3 + 2] = 1;

          // Right vertex
          positions[rIdx * 3 + 0] =  w;
          positions[rIdx * 3 + 1] =  y;
          positions[rIdx * 3 + 2] =  0;
          uvs[rIdx * 2 + 0] = 1;
          uvs[rIdx * 2 + 1] = t;
          normals[rIdx * 3 + 0] = 0; normals[rIdx * 3 + 1] = 0; normals[rIdx * 3 + 2] = 1;
        }

        // Build quad strip indices
        const iCount = SEG * 6;
        const indices = new Uint16Array(iCount);
        for (let s = 0; s < SEG; s++) {
          const base = s * 6;
          const v    = s * 2;
          indices[base + 0] = v;     indices[base + 1] = v + 1; indices[base + 2] = v + 2;
          indices[base + 3] = v + 1; indices[base + 4] = v + 3; indices[base + 5] = v + 2;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('uv',       new THREE.BufferAttribute(uvs, 2));
        geo.setAttribute('normal',   new THREE.BufferAttribute(normals, 3));
        geo.setIndex(new THREE.BufferAttribute(indices, 1));

        // Apply rotation around Y axis
        geo.applyMatrix4(new THREE.Matrix4().makeRotationY(rotY));
        return geo;
      };

      // ── Merge 3 blades at 0°, 60°, -60° ──────────────────────────────────────
      const b1 = buildBlade(0);
      const b2 = buildBlade(Math.PI / 3);
      const b3 = buildBlade(-Math.PI / 3);

      const totalVerts = b1.attributes.position.count * 3;
      const mergedPos  = new Float32Array(totalVerts * 3);
      const mergedUV   = new Float32Array(totalVerts * 2);
      const mergedNorm = new Float32Array(totalVerts * 3);

      const vc = b1.attributes.position.count;
      const p1a = b1.attributes.position.array as Float32Array;
      const p2a = b2.attributes.position.array as Float32Array;
      const p3a = b3.attributes.position.array as Float32Array;
      mergedPos.set(p1a, 0);
      mergedPos.set(p2a, p1a.length);
      mergedPos.set(p3a, p1a.length + p2a.length);

      const u1a = b1.attributes.uv.array as Float32Array;
      const u2a = b2.attributes.uv.array as Float32Array;
      const u3a = b3.attributes.uv.array as Float32Array;
      mergedUV.set(u1a, 0);
      mergedUV.set(u2a, u1a.length);
      mergedUV.set(u3a, u1a.length + u2a.length);

      const n1a = b1.attributes.normal.array as Float32Array;
      const n2a = b2.attributes.normal.array as Float32Array;
      const n3a = b3.attributes.normal.array as Float32Array;
      mergedNorm.set(n1a, 0);
      mergedNorm.set(n2a, n1a.length);
      mergedNorm.set(n3a, n1a.length + n2a.length);

      const i1a = b1.index!.array as Uint16Array;
      const i2a = b2.index!.array as Uint16Array;
      const i3a = b3.index!.array as Uint16Array;
      const totalIdx = (i1a.length + i2a.length + i3a.length);
      const mergedIdx = new Uint32Array(totalIdx);
      mergedIdx.set(i1a, 0);
      for (let i = 0; i < i2a.length; i++) mergedIdx[i1a.length + i] = i2a[i] + vc;
      for (let i = 0; i < i3a.length; i++) mergedIdx[i1a.length + i2a.length + i] = i3a[i] + vc * 2;

      const clumpGeo = new THREE.BufferGeometry();
      clumpGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
      clumpGeo.setAttribute('uv',       new THREE.BufferAttribute(mergedUV, 2));
      clumpGeo.setAttribute('normal',   new THREE.BufferAttribute(mergedNorm, 3));
      clumpGeo.setIndex(new THREE.BufferAttribute(mergedIdx, 1));

      b1.dispose(); b2.dispose(); b3.dispose();

      // ── Material with wind shader ────────────────────────────────────────────
      const grassMat = new THREE.MeshStandardMaterial({
        color: 0x52c65a,
        roughness: 0.80,
        metalness: 0.0,
        side: THREE.DoubleSide,
        alphaTest: 0.04,
      });
      // Unique cache key so Three.js always uses our custom shader
      grassMat.customProgramCacheKey = () => 'grass_botw_aaa_v5';

      grassMat.onBeforeCompile = (shader) => {
        shader.uniforms.uTime      = { value: 0.0 };
        shader.uniforms.uPlayerPos = { value: new THREE.Vector3(999, 999, 999) };
        this.grassUniforms = shader.uniforms;

        shader.vertexShader = [
          'uniform float uTime;',
          'uniform vec3  uPlayerPos;',
          shader.vertexShader
        ].join('\n');

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          /* glsl */`
          #include <begin_vertex>

          #ifdef USE_INSTANCING
            vec3 wpos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
          #else
            vec3 wpos = vec3(0.0);
          #endif

          // Normalized height: 0 = root, 1 = tip
          float nH = clamp(position.y / ${BH.toFixed(2)}, 0.0, 1.0);
          float bend = nH * nH * nH;

          float drift = sin(uTime * 1.4 + wpos.x * 0.09 + wpos.z * 0.07) * 0.25;

          float n1 = sin(wpos.x * 0.19 + wpos.z * 0.14 + uTime * 2.2) * 0.14;
          float n2 = cos(wpos.x * 0.09 - wpos.z * 0.25 + uTime * 1.1) * 0.09;
          float fbm = n1 + n2;

          float windDot = wpos.x * 0.62 + wpos.z * 0.45;
          float gust    = sin(uTime * 1.8 + windDot * 0.11) * 0.30 * (0.5 + 0.5 * sin(uTime * 0.3 + wpos.x * 0.01));

          float totalX = (drift + fbm + gust) * bend;
          float totalZ = (drift * 0.5 + fbm * 0.6 + gust * 0.5) * bend;

          transformed.x += totalX * 0.75 + totalZ * 0.25;
          transformed.z += totalX * 0.30 + totalZ * 0.70;

          // Player push
          vec2 toPlayer2 = wpos.xz - uPlayerPos.xz;
          float pDist = length(toPlayer2);
          float pRadius = 2.0;
          if (pDist < pRadius && pDist > 0.001) {
            float pushStr = (1.0 - pDist / pRadius) * 0.95 * bend;
            vec2 pDir = toPlayer2 / pDist;
            transformed.x += pDir.x * pushStr;
            transformed.z += pDir.y * pushStr;
          }
          `
        );

        // Fragment: rich multi-tone green gradient + tip warmth + subsurface hint
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          /* glsl */`
          #include <color_fragment>
          // Height gradient: dark roots → vivid mid → warm golden tips
          float vH = vUv.y;
          // Base color is the diffuseColor from instanceColor
          // Darken roots slightly for ground-contact shading (AO)
          float rootDark  = 1.0 - smoothstep(0.0, 0.18, vH) * 0.35;
          // Warm up tips to golden/yellow-green
          float tipWarm   = smoothstep(0.65, 1.0, vH);
          diffuseColor.rgb *= rootDark;
          diffuseColor.rgb += vec3(tipWarm * 0.12, tipWarm * 0.09, -tipWarm * 0.04);
          // Fake SSS: bright fringe when backlit (simulate light through thin blade)
          float sss = smoothstep(0.4, 1.0, vH) * 0.08;
          diffuseColor.rgb += vec3(sss * 0.5, sss * 0.9, sss * 0.1);
          `
        );
      };

      // ── Instance placement ──────────────────────────────────────────────────
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const COUNT = isMobile ? 12000 : 80000;

      const grassMesh = new THREE.InstancedMesh(clumpGeo, grassMat, COUNT);
      grassMesh.frustumCulled = false;   // Field is always partially in view
      grassMesh.castShadow    = false;   // Too expensive; use ambient instead
      grassMesh.receiveShadow = true;

      const dummy = new THREE.Object3D();

      // Deterministic seeded random (no Math.random() — reproducible layout)
      let seed = 98765;
      const rnd = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };

      let placed = 0;
      const maxTries = COUNT * 4;
      let tries = 0;

      while (placed < COUNT && tries < maxTries) {
        tries++;

        // Spread: 160 wide × 150 deep, centered on the field
        const x = (rnd() - 0.5) * 155;
        const z = -110 + rnd() * 145;

        // ── Exclusion zones ──
        // Castle interior
        if (x > -14 && x < 14 && z > -55 && z < -20) continue;
        // Boss arena (circle)
        if (Math.hypot(x - 40, z + 45) < 17) continue;
        // Ruin patches
        if (Math.hypot(x + 30, z - 10) < 8) continue;
        if (Math.hypot(x + 45, z + 40) < 8) continue;
        // Castle walls & entrance corridor thick envelope
        if (x > -17 && x < 17 && z > -58 && z < -17) continue;
        // Central Paved Avenue (CAMINO) clean corridor (keeps main path 100% legible)
        if (Math.abs(x) < 3.5 && z > -25 && z < 15) continue;

        // ── Organic density: clumping via noise ──
        const clump = Math.sin(x * 0.38) * Math.cos(z * 0.29) + Math.sin(x * 0.17 + z * 0.22) * 0.6;
        // Create natural sparse patches (bare earth)
        if (clump < -0.5 && rnd() > 0.15) continue;
        // Dense clusters near center
        const centerDist = Math.hypot(x, z + 35);
        if (centerDist > 65 && rnd() > 0.55) continue;

        // ── Placement ──
        dummy.position.set(
          x + (rnd() - 0.5) * 0.6,
          0.01, // just above the ground plane
          z + (rnd() - 0.5) * 0.6,
        );
        // Random rotation around Y (full 360°)
        dummy.rotation.set(
          (rnd() - 0.5) * 0.12,  // slight lean
          rnd() * Math.PI * 2,
          (rnd() - 0.5) * 0.12,
        );
        // Height variation: 0.45–1.6 (short scrub to tall reed)
        const sy = 0.45 + rnd() * 1.15;
        // XZ scale independent of Y for natural look
        const sxz = 0.55 + rnd() * 0.75;
        dummy.scale.set(sxz, sy, sxz);
        dummy.updateMatrix();
        grassMesh.setMatrixAt(placed, dummy.matrix);

        // ── Rich color palette — 7 green variants ──
        const ct = rnd();
        let h: number, s: number, l: number;
        if      (ct < 0.18) { h = 0.30; s = 0.80; l = 0.36 + rnd() * 0.08; } // vivid spring
        else if (ct < 0.34) { h = 0.35; s = 0.65; l = 0.24 + rnd() * 0.08; } // dark forest
        else if (ct < 0.50) { h = 0.27; s = 0.72; l = 0.40 + rnd() * 0.10; } // medium fresh
        else if (ct < 0.63) { h = 0.23; s = 0.58; l = 0.38 + rnd() * 0.08; } // warm olive
        else if (ct < 0.75) { h = 0.25; s = 0.85; l = 0.44 + rnd() * 0.10; } // lime accent
        else if (ct < 0.88) { h = 0.18; s = 0.65; l = 0.46 + rnd() * 0.10; } // golden dry
        else                { h = 0.32; s = 0.50; l = 0.30 + rnd() * 0.06; } // deep shade

        grassMesh.setColorAt(placed, new THREE.Color().setHSL(h, s, l));
        placed++;
      }

      grassMesh.instanceMatrix.needsUpdate = true;
      if (grassMesh.instanceColor) grassMesh.instanceColor.needsUpdate = true;
      scene.add(grassMesh);
      console.log(`[Grass AAA] ✅ ${placed}/${COUNT} blades placed in ${tries} tries`);
    })();

    // ═══════════════════════════════════════════════════════════════════════════════
    // ▓▓▓  REAL 3D GLTF FOLIAGE & NATURE ENVIRONMENT MANAGER  ▓▓▓
    // Loads & instantiates real 3D GLTF trees, shrubs, and 3D wildflowers.
    // ZERO primitive spheres, ZERO blocky proxies.
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

      // 2. Real 3D Meadow Shrubs & Bushes
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/bush_meadow.gltf', (gltf) => {
        const bushTemplate = gltf.scene;
        const bushPositions = [
          [-28, 0, 8], [-32, 0, 12], [-42, 0, -38], [-48, 0, -42],
          [28, 0, -12], [32, 0, -18], [-15, 0, -85], [15, 0, -85],
          [-8, 0, -22], [8, 0, -22], [-14, 0, -12], [14, 0, -12]
        ];
        bushPositions.forEach(([x, y, z]) => {
          const b = bushTemplate.clone();
          b.position.set(x, y, z);
          b.rotation.y = Math.random() * Math.PI * 2;
          const s = 1.0 + Math.random() * 0.6;
          b.scale.set(s, s * (0.8 + Math.random() * 0.4), s);
          scene.add(b);
        });
      });

      // 3. Real 3D Wildflowers (Daisies & Buttercups in natural patches)
      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/flower_daisy.gltf', (gltf) => {
        const daisyTemplate = gltf.scene;
        const daisyPatches = [
          { center: [-15, -15], count: 35 },
          { center: [15, -15], count: 35 },
          { center: [-25, 5], count: 40 },
          { center: [20, -65], count: 40 },
          { center: [-20, -65], count: 40 },
        ];
        daisyPatches.forEach((patch) => {
          for (let i = 0; i < patch.count; i++) {
            const f = daisyTemplate.clone();
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 6.0;
            const x = patch.center[0] + Math.cos(angle) * dist;
            const z = patch.center[1] + Math.sin(angle) * dist;
            f.position.set(x, 0.05, z);
            f.rotation.y = Math.random() * Math.PI * 2;
            const s = 0.8 + Math.random() * 0.5;
            f.scale.set(s, s, s);
            scene.add(f);
          }
        });
      });

      gltfLoader.load(import.meta.env.BASE_URL + 'assets/environment/flower_buttercup.gltf', (gltf) => {
        const buttercupTemplate = gltf.scene;
        const buttercupPatches = [
          { center: [-10, 5], count: 30 },
          { center: [10, 5], count: 30 },
          { center: [-35, -30], count: 35 },
          { center: [35, -30], count: 35 },
        ];
        buttercupPatches.forEach((patch) => {
          for (let i = 0; i < patch.count; i++) {
            const f = buttercupTemplate.clone();
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 5.0;
            const x = patch.center[0] + Math.cos(angle) * dist;
            const z = patch.center[1] + Math.sin(angle) * dist;
            f.position.set(x, 0.05, z);
            f.rotation.y = Math.random() * Math.PI * 2;
            const s = 0.8 + Math.random() * 0.5;
            f.scale.set(s, s, s);
            scene.add(f);
          }
        });
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

    // 2. Central Castle / Main Building (visible from almost everywhere)


    // ── Castle: 28w × 28d × 15h Monumental Imperial Palace, centered at (0, 0, -40) ──
    const castleCenterZ = -40;
    const redWoodMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c842, metalness: 0.8, roughness: 0.2 });

    // Castle Base / Ground Floor Foundation (y = 0.4)
    const castleGroundFloor = new THREE.Mesh(new THREE.BoxGeometry(28, 0.4, 28), floorMat);
    castleGroundFloor.position.set(0, 0.2, castleCenterZ);
    castleGroundFloor.receiveShadow = true;
    scene.add(castleGroundFloor);
    this.levelColliders.push(castleGroundFloor);

    // Symmetrical Front Grand Entrance Staircase (z = -23.5 to z = -26.5, rising smoothly from y = 0.0 to y = 0.4)
    const frontStepCount = 4;
    for (let s = 0; s < frontStepCount; s++) {
      const stepW = 10.0 - s * 0.4;
      const stepH = 0.15 + s * 0.1;
      const stepZ = -23.5 - s * 0.8;
      const step = new THREE.Mesh(new THREE.BoxGeometry(stepW, stepH, 1.0), stoneMat);
      step.position.set(0, stepH / 2, stepZ);
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
      this.levelColliders.push(step);
    }

    // Outer Fortress Walls (Left, Right, Back) — 5.0m height
    const wallHeight = 5.0;
    const castleLeftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, wallHeight, 28), stoneMat);
    castleLeftWall.position.set(-14, wallHeight / 2 + 0.2, castleCenterZ);
    const castleRightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, wallHeight, 28), stoneMat);
    castleRightWall.position.set(14, wallHeight / 2 + 0.2, castleCenterZ);
    const castleBackWall = new THREE.Mesh(new THREE.BoxGeometry(28, wallHeight, 0.6), stoneMat);
    castleBackWall.position.set(0, wallHeight / 2 + 0.2, castleCenterZ - 14);
    scene.add(castleLeftWall, castleRightWall, castleBackWall);
    this.levelColliders.push(castleLeftWall, castleRightWall, castleBackWall);

    // Front Façade Symmetrical Outer Wing Walls (x = -14 to -5 and x = +5 to +14), leaving wide 10m central entrance
    const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(9, wallHeight, 0.6), stoneMat);
    frontWallL.position.set(-9.5, wallHeight / 2 + 0.2, castleCenterZ + 14);
    const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(9, wallHeight, 0.6), stoneMat);
    frontWallR.position.set(9.5, wallHeight / 2 + 0.2, castleCenterZ + 14);
    scene.add(frontWallL, frontWallR);
    this.levelColliders.push(frontWallL, frontWallR);

    // Front Façade Monumental Red & Gold Entrance Pillars flanking the 10m gateway
    const pLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, wallHeight, 12), redWoodMat);
    pLeft.position.set(-5.0, wallHeight / 2 + 0.2, castleCenterZ + 14);
    const pRight = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, wallHeight, 12), redWoodMat);
    pRight.position.set(5.0, wallHeight / 2 + 0.2, castleCenterZ + 14);
    const capL = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 12), goldMat);
    capL.position.set(-5.0, wallHeight + 0.2, castleCenterZ + 14);
    const capR = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.3, 12), goldMat);
    capR.position.set(5.0, wallHeight + 0.2, castleCenterZ + 14);
    scene.add(pLeft, pRight, capL, capR);
    this.levelColliders.push(pLeft, pRight);

    // ── SECOND FLOOR MEZZANINE (y = 5.2) — Open Gallery around perimeter ──
    const mezzanineL = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.4, 28), floorMat);
    mezzanineL.position.set(-11.0, 5.2, castleCenterZ);
    const mezzanineR = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.4, 28), floorMat);
    mezzanineR.position.set(11.0, 5.2, castleCenterZ);
    const mezzanineBack = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.4, 8.0), floorMat);
    mezzanineBack.position.set(0, 5.2, castleCenterZ - 10.0);
    const mezzanineFront = new THREE.Mesh(new THREE.BoxGeometry(16.0, 0.4, 5.0), floorMat);
    mezzanineFront.position.set(0, 5.2, castleCenterZ + 11.5);

    scene.add(mezzanineL, mezzanineR, mezzanineBack, mezzanineFront);
    this.levelColliders.push(mezzanineL, mezzanineR, mezzanineBack, mezzanineFront);

    // Protective Mezzanine Balustrades (along internal open atrium edge)
    const railMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.6 });
    const atriRailL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 16.5), railMat);
    atriRailL.position.set(-8.0, 5.9, castleCenterZ + 0.75);
    const atriRailFront = new THREE.Mesh(new THREE.BoxGeometry(16.0, 1.0, 0.25), railMat);
    atriRailFront.position.set(0, 5.9, castleCenterZ + 9.0);
    const atriRailBack = new THREE.Mesh(new THREE.BoxGeometry(16.0, 1.0, 0.25), railMat);
    atriRailBack.position.set(0, 5.9, castleCenterZ - 6.0);

    scene.add(atriRailL, atriRailFront, atriRailBack);
    this.levelColliders.push(atriRailL, atriRailFront, atriRailBack);

    // ── MONUMENTAL IMPERIAL GRAND STAIRCASE (Ground Floor y=0.4 to Mezzanine y=5.2) ──
    // Positioned cleanly along the East inner wall (x = 8.5, from z = -28 rising to z = -44)
    const stairLength = 16.0;
    const stairRise = 4.8;
    const stairAngle = Math.atan(stairRise / stairLength);
    const stairRampDist = Math.hypot(stairLength, stairRise);

    // 1. Solid Stone Foundation Ramp
    const stairBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, stairRampDist + 0.5), stoneMat);
    stairBase.position.set(8.5, 1.6, castleCenterZ + 4.0);
    stairBase.rotation.x = stairAngle;
    scene.add(stairBase);
    this.levelColliders.push(stairBase);

    // 2. Individual Stone Steps
    const numSteps = 16;
    for (let i = 0; i < numSteps; i++) {
      const t = i / (numSteps - 1);
      const stepY = 0.4 + t * stairRise;
      const stepZ = -28.0 - t * stairLength;
      const step = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 1.15), stoneMat);
      step.position.set(8.5, stepY, stepZ);
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
    }

    // 3. Smooth Ramp Collider (100% fluid ascent/descent)
    const stairSmoothRamp = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.35, stairRampDist),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    stairSmoothRamp.position.set(8.5, 2.9, castleCenterZ + 4.0);
    stairSmoothRamp.rotation.x = stairAngle;
    scene.add(stairSmoothRamp);
    this.levelColliders.push(stairSmoothRamp);

    // 4. Crimson Red Wood Balustrade Railings with Lanterns
    const balustradeR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, stairRampDist), redWoodMat);
    balustradeR.position.set(6.3, 3.4, castleCenterZ + 4.0);
    balustradeR.rotation.x = stairAngle;
    scene.add(balustradeR);
    this.levelColliders.push(balustradeR);

    // Lantern posts at bottom & top of main staircase
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, emissive: 0xff4400, emissiveIntensity: 1.5 });
    const postL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.6, 8), redWoodMat);
    postL1.position.set(6.3, 1.2, -28.0);
    const lant1L = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), lanternMat);
    lant1L.position.set(6.3, 2.1, -28.0);
    const postL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.6, 8), redWoodMat);
    postL2.position.set(6.3, 6.0, -44.0);
    const lant1R = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), lanternMat);
    lant1R.position.set(6.3, 6.9, -44.0);
    scene.add(postL1, lant1L, postL2, lant1R);

    // ── UPPER ROOF ACCESS STAIRCASE (Mezzanine y=5.2 to Roof Terrace y=10.0) ──
    // Starts at North-East landing (x = 8.0, z = -48.0) and rises along North/Back wall to (x = -4.0, z = -48.0)
    const upperSteps = 15;
    const upperRise = 4.8;
    const upperLength = 12.0;
    const upperAngle = Math.atan(upperRise / upperLength);
    const upperRampDist = Math.hypot(upperLength, upperRise);

    const upperRampBase = new THREE.Mesh(new THREE.BoxGeometry(upperRampDist + 0.5, 2.0, 3.8), stoneMat);
    upperRampBase.position.set(2.0, 6.4, castleCenterZ - 10.0);
    upperRampBase.rotation.z = upperAngle;
    scene.add(upperRampBase);
    this.levelColliders.push(upperRampBase);

    for (let i = 0; i < upperSteps; i++) {
      const t = i / (upperSteps - 1);
      const stepX = 8.0 - t * upperLength;
      const stepY = 5.2 + t * upperRise;
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.35, 3.8), stoneMat);
      step.position.set(stepX, stepY, castleCenterZ - 10.0);
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
    }

    const upperRampCollider = new THREE.Mesh(
      new THREE.BoxGeometry(upperRampDist, 0.35, 4.0),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    upperRampCollider.position.set(2.0, 7.7, castleCenterZ - 10.0);
    upperRampCollider.rotation.z = upperAngle;
    scene.add(upperRampCollider);
    this.levelColliders.push(upperRampCollider);

    // ── 100% SOLID WALKABLE ROOF TERRACE PLATFORM (y = 10.0) ──
    const roofFloorSlab = new THREE.Mesh(new THREE.BoxGeometry(20.0, 0.4, 20.0), floorMat);
    roofFloorSlab.position.set(0, 10.0, castleCenterZ - 2.0);
    roofFloorSlab.receiveShadow = true;
    scene.add(roofFloorSlab);
    this.levelColliders.push(roofFloorSlab);

    // Roof Balustrade Railings around terrace
    const rRailN = new THREE.Mesh(new THREE.BoxGeometry(20.0, 1.0, 0.3), railMat);
    rRailN.position.set(0, 10.7, castleCenterZ - 12.0);
    const rRailS = new THREE.Mesh(new THREE.BoxGeometry(20.0, 1.0, 0.3), railMat);
    rRailS.position.set(0, 10.7, castleCenterZ + 8.0);
    const rRailW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 20.0), railMat);
    rRailW.position.set(-10.0, 10.7, castleCenterZ - 2.0);
    const rRailE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 20.0), railMat);
    rRailE.position.set(10.0, 10.7, castleCenterZ - 2.0);
    scene.add(rRailN, rRailS, rRailW, rRailE);
    this.levelColliders.push(rRailN, rRailS, rRailW, rRailE);

    // Solid Perimeter Parapet / Balustrade Safety Railings around the roof edge (y = 10.2 to 11.4)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bx = Math.cos(angle) * 6.5;
      const bz = Math.sin(angle) * 6.5;
      const roofRailing = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.2, 0.5), redWoodMat);
      roofRailing.position.set(bx, 10.8, (castleCenterZ - 4) + bz);
      roofRailing.rotation.y = -angle + Math.PI / 2;
      scene.add(roofRailing);
      this.levelColliders.push(roofRailing);
    }

    // 8 Imperial Red Wood Columns supporting the elevated Pavilion Crown Roof
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 5.8;
      const pz = Math.sin(angle) * 5.8;
      const roofPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.2, 8), redWoodMat);
      roofPillar.position.set(px, 12.3, (castleCenterZ - 4) + pz);
      scene.add(roofPillar);
      this.levelColliders.push(roofPillar);
    }

    // ── DRAGON SWITCH (Mezzanine Floor Balcony: x = -8.5, y = 5.2, z = -40) ──
    const switchGroup = new THREE.Group();
    switchGroup.position.set(-8.5, 5.2, castleCenterZ);

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
    this.buildSubterraneanLavaVault(scene, stoneMat, castleCenterZ);


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
    this.exitDoor = new Door('door_exit', new THREE.Vector3(0, 0, castleCenterZ - 12.5), 0, true);
    scene.add(this.exitDoor.mesh);
    this.doors.push(this.exitDoor);
    this.levelColliders.push(this.exitDoor.mesh);

    // 6. Ancient Ruins & Landmarks (Expanded Map)
    this.buildAncientRuinsAndLandmarks();

    // Configure collision objects in controllers
    this.cameraController.setCollisionObjects(this.levelColliders);
    this.player.setColliders(this.levelColliders);
  }

  private buildSubterraneanLavaVault(
    scene: THREE.Scene,
    stoneMat: THREE.Material,
    castleCenterZ: number
  ): void {
    // 1. Trapdoor Stone Slab at Ground Floor (x = -9.0, z = -32.0, y = 0.2)
    this.lavaVaultHatch = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 4.2), stoneMat);
    this.lavaVaultHatch.position.set(-9.0, 0.2, castleCenterZ + 8.0);
    this.lavaVaultHatch.receiveShadow = true;
    scene.add(this.lavaVaultHatch);
    this.levelColliders.push(this.lavaVaultHatch);

    // 2. Secret Subterranean Stairs descending from y = 0.2 to y = -5.8
    const stairsSteps = 12;
    const stairLen = 8.0;
    const stairDrop = 6.0;
    for (let i = 0; i < stairsSteps; i++) {
      const t = i / (stairsSteps - 1);
      const stepY = 0.1 - t * stairDrop;
      const stepZ = (castleCenterZ + 8.0) - t * stairLen;
      const step = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.35, 1.0), stoneMat);
      step.position.set(-9.0, stepY, stepZ);
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
      this.levelColliders.push(step);
    }

    // 3. Subterranean Entrance Ledge at y = -5.8 (x = -9.0, z = castleCenterZ)
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.5, 6.0), stoneMat);
    ledge.position.set(-9.0, -5.8, castleCenterZ);
    ledge.receiveShadow = true;
    scene.add(ledge);
    this.levelColliders.push(ledge);

    // 4. Subterranean Chamber Walls
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(32.0, 8.0, 1.0), stoneMat);
    wallN.position.set(-22.0, -4.0, castleCenterZ - 14.0);
    const wallS = new THREE.Mesh(new THREE.BoxGeometry(32.0, 8.0, 1.0), stoneMat);
    wallS.position.set(-22.0, -4.0, castleCenterZ + 14.0);
    const wallW = new THREE.Mesh(new THREE.BoxGeometry(1.0, 8.0, 28.0), stoneMat);
    wallW.position.set(-37.0, -4.0, castleCenterZ);
    scene.add(wallN, wallS, wallW);
    this.levelColliders.push(wallN, wallS, wallW);

    // 5. Glowing Lava Floor at y = -8.2
    const lavaMat = new THREE.MeshStandardMaterial({
      color: 0xff2200,
      emissive: 0xff3300,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.1
    });
    const lavaMesh = new THREE.Mesh(new THREE.PlaneGeometry(30.0, 26.0), lavaMat);
    lavaMesh.position.set(-22.0, -8.2, castleCenterZ);
    lavaMesh.rotation.x = -Math.PI / 2;
    scene.add(lavaMesh);

    // Lava Ambient PointLights
    const lavaLight1 = new THREE.PointLight(0xff4400, 3.5, 12.0);
    lavaLight1.position.set(-16.0, -6.5, castleCenterZ);
    const lavaLight2 = new THREE.PointLight(0xff4400, 3.5, 12.0);
    lavaLight2.position.set(-28.0, -6.5, castleCenterZ);
    scene.add(lavaLight1, lavaLight2);

    // 6. 4 Moving Stone Platforms across the Lava Chasm (y = -5.8)
    const plat1 = new MovingPlatform(
      new THREE.Vector3(-14.5, -5.8, castleCenterZ - 6.0),
      new THREE.Vector3(-14.5, -5.8, castleCenterZ + 6.0),
      1.8,
      3.2, 3.2
    );
    const plat2 = new MovingPlatform(
      new THREE.Vector3(-19.5, -5.8, castleCenterZ + 6.0),
      new THREE.Vector3(-19.5, -5.8, castleCenterZ - 6.0),
      2.2,
      3.2, 3.2
    );
    const plat3 = new MovingPlatform(
      new THREE.Vector3(-24.5, -5.8, castleCenterZ - 6.0),
      new THREE.Vector3(-24.5, -5.8, castleCenterZ + 6.0),
      2.0,
      3.2, 3.2
    );
    const plat4 = new MovingPlatform(
      new THREE.Vector3(-29.5, -5.8, castleCenterZ + 5.0),
      new THREE.Vector3(-29.5, -5.8, castleCenterZ - 5.0),
      1.7,
      3.2, 3.2
    );

    scene.add(plat1.mesh, plat2.mesh, plat3.mesh, plat4.mesh);
    this.movingPlatforms.push(plat1, plat2, plat3, plat4);
    this.levelColliders.push(plat1.mesh, plat2.mesh, plat3.mesh, plat4.mesh);

    // 7. Ancient Fire Altar & Shrine Floor on the far west side (x = -34.0, z = castleCenterZ)
    const shrineFloor = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.5, 6.0), stoneMat);
    shrineFloor.position.set(-34.0, -5.8, castleCenterZ);
    shrineFloor.receiveShadow = true;
    scene.add(shrineFloor);
    this.levelColliders.push(shrineFloor);

    // Pedestal holding Key 4 (Llave del Secreto / Fuego Subterráneo)
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.0, 8), stoneMat);
    pedestal.position.set(-34.0, -5.3, castleCenterZ);
    pedestal.castShadow = true;
    scene.add(pedestal);
    this.levelColliders.push(pedestal);

    // Spawn 3D Key 4 at the shrine altar!
    this.spawn3DKey('key4_gargoyles', new THREE.Vector3(-34.0, -4.6, castleCenterZ));
  }

  private buildAncientRuinsAndLandmarks(): void {
    const scene = this.sceneManager.scene;
    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.repeat.set(2, 2);
    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.85 });
    const redWoodMat = new THREE.MeshStandardMaterial({ color: 0x8b0000, roughness: 0.5 }); // Crimson red lacquered wood
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 }); // Gold trim
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b1a1a, roughness: 0.6 }); // Chinese vermillion roof tiles

    // ── 1. CHINESE MEDIEVAL ARCHITECTURE DECORATIONS ON MAIN CASTLE ──
    const castleCenterZ = -40;

    // ── CHINESE TRADITIONAL PERIMETER ROOF EAVES (Overhanging outer walls, open courtyard/balcony) ──
    // 4 Perimeter Eave Canopies extending outwards from the 4 outer walls (keeps 2nd floor balcony 100% open & unobstructed)
    const eaveFront = new THREE.Mesh(new THREE.BoxGeometry(29, 0.4, 2.8), roofMat);
    eaveFront.position.set(0, 5.2, castleCenterZ + 14.5);
    eaveFront.rotation.x = 0.25;

    const eaveBack = new THREE.Mesh(new THREE.BoxGeometry(29, 0.4, 2.8), roofMat);
    eaveBack.position.set(0, 5.2, castleCenterZ - 14.5);
    eaveBack.rotation.x = -0.25;

    const eaveLeft = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 29), roofMat);
    eaveLeft.position.set(-14.5, 5.2, castleCenterZ);
    eaveLeft.rotation.z = -0.25;

    const eaveRight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 29), roofMat);
    eaveRight.position.set(14.5, 5.2, castleCenterZ);
    eaveRight.rotation.z = 0.25;

    scene.add(eaveFront, eaveBack, eaveLeft, eaveRight);

    // Elevated Chinese Pavilion Crown Pagoda Roof sitting high above the roof terrace (y = 15.0)
    // Provides 4.8m of clear headroom so Wukong can run, fight, and walk without ever hitting the ceiling!
    const roofTower = new THREE.Mesh(new THREE.ConeGeometry(9.5, 3.2, 8), roofMat);
    roofTower.position.set(0, 15.0, castleCenterZ - 4);
    roofTower.rotation.y = Math.PI / 8;
    scene.add(roofTower);

    // Golden spire on top of the tower roof (y = 17.5)
    const towerSpire = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.0, 8), goldMat);
    towerSpire.position.set(0, 17.5, castleCenterZ - 4);
    scene.add(towerSpire);

    // 8 Red Lacquered Wooden Columns with Gold Trim
    const colPositions = [
      [-12, 2.6, castleCenterZ + 12.8], [12, 2.6, castleCenterZ + 12.8],
      [-5, 2.6, castleCenterZ + 12.8], [5, 2.6, castleCenterZ + 12.8],
      [-12, 2.6, castleCenterZ - 12.8], [12, 2.6, castleCenterZ - 12.8],
      [-12, 7.6, castleCenterZ - 4], [12, 7.6, castleCenterZ - 4]
    ];
    colPositions.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 5.0, 10), redWoodMat);
      col.position.set(x, y, z);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.2, 10), goldMat);
      cap.position.set(x, y + 2.5, z);
      scene.add(col, cap);
      this.levelColliders.push(col);
    });

    // Chinese Paifang Arch Gateway at Castle Entrance (z = -27)
    const paifangGroup = new THREE.Group();
    paifangGroup.position.set(0, 0, -26);
    
    const pPostL = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 4.5, 10), redWoodMat);
    pPostL.position.set(-3.5, 2.25, 0);
    const pPostR = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 4.5, 10), redWoodMat);
    pPostR.position.set(3.5, 2.25, 0);
    const pBeam = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.4, 0.6), redWoodMat);
    pBeam.position.set(0, 4.2, 0);
    const pRoof = new THREE.Mesh(new THREE.ConeGeometry(6.2, 1.4, 4), roofMat);
    pRoof.position.set(0, 5.1, 0);
    pRoof.rotation.y = Math.PI / 4;

    paifangGroup.add(pPostL, pPostR, pBeam, pRoof);
    scene.add(paifangGroup);
    this.levelColliders.push(pPostL, pPostR);

    // Hanging Red Chinese Lanterns with Warm Glow
    const lanternPositions = [
      [-3.5, 3.6, -26], [3.5, 3.6, -26],
      [-5.0, 4.6, castleCenterZ + 12.8], [5.0, 4.6, castleCenterZ + 12.8],
      [0, 9.8, castleCenterZ - 4]
    ];
    lanternPositions.forEach(([lx, ly, lz]) => {
      const lanternMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, emissive: 0xff3300, emissiveIntensity: 1.2 });
      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), lanternMat);
      lantern.position.set(lx, ly, lz);
      const light = new THREE.PointLight(0xff7700, 2.2, 6.0);
      light.position.set(lx, ly, lz);
      scene.add(lantern, light);
    });

    // ── 2. THREE DISTINCT CHINESE MEDIEVAL ARCHITECTURAL LANDMARKS ──

    // TEMPLO 01: MAIN IMPERIAL PALACE FORTRESS (Center at 0, 0, -40)
    // (Broad monumental fortress wall base, red lacquered columns, Paifang archway, double eave roofs)

    // TEMPLO 02: VERTICAL 5-TIER MOUNTAIN PAGODA SHRINE (West Ridge at -55, 0, -75)
    const buildMountainPagoda = (cx: number, cz: number) => {
      const cy = this.getTerrainHeight(cx, cz);
      const pag = new THREE.Group();
      pag.position.set(cx, cy, cz);

      // Base Octagonal Foundation (grounded)
      const baseWall = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 9.5, 2.5, 8), stoneMat);
      baseWall.position.y = 1.25;
      pag.add(baseWall);
      this.levelColliders.push(baseWall);

      // Grand Entrance Steps on Front Threshold (z = +8.5)
      for (let s = 0; s < 4; s++) {
        const stepWidth = 4.2 - s * 0.3;
        const step = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.4, 1.2), stoneMat);
        step.position.set(0, s * 0.35 + 0.2, 8.5 + (3 - s) * 1.0);
        pag.add(step);
        this.levelColliders.push(step);
      }

      // Torii / Paifang Entrance Archway Gateway at Pagoda Entrance
      const archL = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.5, 10), redWoodMat);
      archL.position.set(-2.2, 2.25, 8.2);
      const archR = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 4.5, 10), redWoodMat);
      archR.position.set(2.2, 2.25, 8.2);
      const archBeam = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.4, 0.6), redWoodMat);
      archBeam.position.set(0, 4.2, 8.2);
      const archRoof = new THREE.Mesh(new THREE.ConeGeometry(4.2, 1.2, 4), roofMat);
      archRoof.position.y = 5.0;
      archRoof.position.z = 8.2;
      archRoof.rotation.y = Math.PI / 4;

      const eLightL = new THREE.PointLight(0xffaa00, 2.5, 7.0);
      eLightL.position.set(-2.2, 3.5, 8.2);
      const eLightR = new THREE.PointLight(0xffaa00, 2.5, 7.0);
      eLightR.position.set(2.2, 3.5, 8.2);

      pag.add(archL, archR, archBeam, archRoof, eLightL, eLightR);
      this.levelColliders.push(archL, archR);

      // Open Entrance Doorway Cutout
      const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 0.6), redWoodMat);
      doorFrame.position.set(0, 2.6, 7.8);
      pag.add(doorFrame);

      // 5 Tiered Pagoda Roofs tapering upward
      const tierRadii = [10, 8.5, 7, 5.5, 4];
      const tierHeights = [3.5, 8.0, 12.0, 15.5, 18.5];

      tierRadii.forEach((r, idx) => {
        const h = tierHeights[idx];
        const wall = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.75, r * 0.8, 3.2, 8), redWoodMat);
        wall.position.y = h;
        const eave = new THREE.Mesh(new THREE.ConeGeometry(r, 2.0, 4), roofMat);
        eave.position.y = h + 1.6;
        eave.rotation.y = Math.PI / 4;
        pag.add(wall, eave);
        this.levelColliders.push(wall);
      });

      // Golden Needle Spire Crown
      const spire = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6, 8), goldMat);
      spire.position.y = 23;
      pag.add(spire);

      scene.add(pag);
    };

    // TEMPLO 03: TEMPLO DEL BÁCULO / CÁMARA DEL SECRETO (East Peak at 55, 0, -75)
    const buildDragonCitadel = (cx: number, cz: number) => {
      const cy = this.getTerrainHeight(cx, cz);
      const cit = new THREE.Group();
      cit.position.set(cx, cy, cz);

      // Circular Temple Base Rampart (grounded on terrain)
      const rampart = new THREE.Mesh(new THREE.CylinderGeometry(16, 17, 1.6, 16), stoneMat);
      rampart.position.y = 0.8;
      cit.add(rampart);
      this.levelColliders.push(rampart);

      // Grand Entrance Portal Steps on Front (z = +15)
      for (let s = 0; s < 4; s++) {
        const stepWidth = 5.0 - s * 0.3;
        const step = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.4, 1.2), stoneMat);
        step.position.set(0, s * 0.35 + 0.2, 15 + (3 - s) * 1.0);
        cit.add(step);
        this.levelColliders.push(step);
      }

      // Entrance Dragon Pillars
      const eColL = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 5.0, 10), redWoodMat);
      eColL.position.set(-2.8, 2.5, 14.8);
      const eColR = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 5.0, 10), redWoodMat);
      eColR.position.set(2.8, 2.5, 14.8);
      const eBeam = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 0.6), redWoodMat);
      eBeam.position.set(0, 4.8, 14.8);
      cit.add(eColL, eColR, eBeam);
      this.levelColliders.push(eColL, eColR);

      // Central Pillar for Spiral Staircase
      const centralPillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 14.0, 12), redWoodMat);
      centralPillar.position.y = 7.8;
      cit.add(centralPillar);
      this.levelColliders.push(centralPillar);

      // ── WALKABLE SPIRAL RAMP (RAMPA EN ESPIRAL — ancha, suave y 100% segura con barreras físicas continuas) ──
      const numSteps = 64; // Dense overlapping segments create smooth seamless ramp surface
      const startH = 0.8;
      const totalH = 14.0;
      const stepRadius = 4.5;

      for (let i = 0; i < numSteps; i++) {
        const progress = i / (numSteps - 1);
        const angle = progress * Math.PI * 2.8;
        const h = startH + progress * totalH;

        // Wide overlapping ramp segments (4.6m wide × 2.6m deep) that overlap to form continuous surface
        const stepGeo = new THREE.BoxGeometry(4.6, 0.45, 2.6);
        const step = new THREE.Mesh(stepGeo, stoneMat);
        const sx = Math.cos(angle) * stepRadius;
        const sz = Math.sin(angle) * stepRadius;

        step.name = `spiral_step_${i}`;
        step.position.set(sx, h, sz);
        step.rotation.y = -angle + Math.PI / 2;
        cit.add(step);
        this.levelColliders.push(step);

        // ── THICK CONTINUOUS SAFETY BARRIERS (Barreras laterales curvas sin fisuras para evitar caídas) ──
        // Inner curved barrier wall (height 1.8m above ramp)
        const innerWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 3.2), redWoodMat);
        innerWall.position.set(Math.cos(angle) * 1.9, h + 0.9, Math.sin(angle) * 1.9);
        innerWall.rotation.y = -angle + Math.PI / 2;
        cit.add(innerWall);
        this.levelColliders.push(innerWall);

        // Outer curved barrier wall (height 1.8m above ramp)
        const outerWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 3.2), redWoodMat);
        outerWall.position.set(Math.cos(angle) * 6.8, h + 0.9, Math.sin(angle) * 6.8);
        outerWall.rotation.y = -angle + Math.PI / 2;
        cit.add(outerWall);
        this.levelColliders.push(outerWall);

        if (i % 8 === 0) {
          const lanternMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, emissive: 0xff4400, emissiveIntensity: 1.5 });
          const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), lanternMat);
          lantern.position.set(Math.cos(angle) * 7.1, h + 2.2, Math.sin(angle) * 7.1);
          cit.add(lantern);
        }
      }

      // ── PISO SUPERIOR / CÁMARA DEL SECRETO (Y = 14.8) — 100% SÓLIDO SIN HUECOS ──
      // 8 dense overlapping solid floor slabs covering the entire upper floor around the 4.5m stair exit
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const cx = Math.cos(angle) * 8.5;
        const cz = Math.sin(angle) * 8.5;
        const upperFloorSlab = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.6, 7.5), stoneMat);
        upperFloorSlab.position.set(cx, 14.8, cz);
        upperFloorSlab.receiveShadow = true;
        cit.add(upperFloorSlab);
        this.levelColliders.push(upperFloorSlab);
      }

      // Solid outer perimeter safety balustrade around the secret chamber edge (radius 12.5m)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bx = Math.cos(angle) * 12.2;
        const bz = Math.sin(angle) * 12.2;
        const perimeterRailing = new THREE.Mesh(new THREE.BoxGeometry(9.5, 1.4, 0.6), redWoodMat);
        perimeterRailing.position.set(bx, 15.5, bz);
        perimeterRailing.rotation.y = -angle + Math.PI / 2;
        cit.add(perimeterRailing);
        this.levelColliders.push(perimeterRailing);
      }

      // 8 Perimeter Dragon Pillars with Gold Rings in Secret Chamber
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * 11.5;
        const pz = Math.sin(angle) * 11.5;
        const pCol = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 7, 10), redWoodMat);
        pCol.position.set(px, 18.3, pz);
        const pRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 8, 16), goldMat);
        pRing.position.set(px, 21.2, pz);
        pRing.rotation.x = Math.PI / 2;
        cit.add(pCol, pRing);
        this.levelColliders.push(pCol);
      }

      // Chamber Pagoda Roof Cover
      const chamberRoof = new THREE.Mesh(new THREE.ConeGeometry(15, 4.0, 8), roofMat);
      chamberRoof.position.y = 23.5;
      cit.add(chamberRoof);

      // Raised Stone Altar for the Special Staff Chest inside Secret Chamber
      const altarGeo = new THREE.CylinderGeometry(2.2, 2.8, 0.8, 8);
      const altar = new THREE.Mesh(altarGeo, stoneMat);
      altar.position.set(0, 15.4, 0);
      cit.add(altar);
      this.levelColliders.push(altar);

      // Floating Glowing Cyan Staff Emblem above Dome
      const staffEmblem = new THREE.Mesh(new THREE.OctahedronGeometry(2.0, 0), new THREE.MeshStandardMaterial({
        color: 0x00e5ff, emissive: 0x00bfff, emissiveIntensity: 2.5, metalness: 0.9
      }));
      staffEmblem.position.y = 26;
      const emblemLight = new THREE.PointLight(0x00e5ff, 6.0, 20.0);
      emblemLight.position.y = 26;
      cit.add(staffEmblem, emblemLight);

      scene.add(cit);
    };

    // Instantiate Templo 02 & Templo 03 firmly grounded on terrain
    buildMountainPagoda(-55, -75);
    buildDragonCitadel(55, -75);

    // ── ZELDA BOTW-GRADE CONTINUOUS COBBLESTONE HIGHWAYS WITH TŌRŌ LANTERNS ──
    // Helper function to build stone Tōrō lanterns
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

    // ── South Ruins ──
    const ruins1 = new THREE.Group();
    ruins1.position.set(-30, 0, 10);
    scene.add(ruins1);

    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 0.8), stoneMat);
    wall1.position.set(0, 1.5, 0);
    ruins1.add(wall1);
    this.levelColliders.push(wall1);

    const pillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 4, 8), stoneMat);
    pillar1.position.set(-3, 2, 3);
    ruins1.add(pillar1);
    this.levelColliders.push(pillar1);

    const fallenPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3.5, 8), stoneMat);
    fallenPillar.position.set(1, 0.5, 2);
    fallenPillar.rotation.set(0, Math.PI / 4, Math.PI / 2 - 0.1);
    ruins1.add(fallenPillar);
    this.levelColliders.push(fallenPillar);

    // ── West Library Ruins ──
    const ruins2 = new THREE.Group();
    ruins2.position.set(-45, 0, -40);
    scene.add(ruins2);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const rx = Math.cos(angle) * 5;
      const rz = Math.sin(angle) * 5;
      
      const height = i % 2 === 0 ? 5 : 3.5;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, height, 8), stoneMat);
      col.position.set(rx, height / 2, rz);
      ruins2.add(col);
      this.levelColliders.push(col);
    }

    const arch = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 1.2), stoneMat);
    arch.position.set(Math.cos(0.5/6 * Math.PI*2)*5, 4.8, Math.sin(0.5/6*Math.PI*2)*5);
    arch.rotation.y = -0.5/6 * Math.PI*2;
    ruins2.add(arch);
    this.levelColliders.push(arch);
  }

  private setupCheckpoints(): void {
    // Starting checkpoint in front of the castle
    this.checkpointManager.addCheckpoint(0, new THREE.Vector3(0, 0.2, 10), 0);
    // Near boss arena
    this.checkpointManager.addCheckpoint(1, new THREE.Vector3(25, 0.2, -40), -Math.PI / 2);
    // Castle 2nd Floor
    this.checkpointManager.addCheckpoint(2, new THREE.Vector3(0, 5.2, -40), 0);
  }

  private setupInteractiveProps(): void {
    const scene = this.sceneManager.scene;

    // Relocate Staff Chest on top of the Altar inside the Secret Chamber of Templo 03 ("Templo del Báculo")
    this.staffChest = new TreasureChest(new THREE.Vector3(55.0, 15.9, -75.0), Math.PI);
    scene.add(this.staffChest.mesh);
    this.chests.push(this.staffChest);
    this.spellSystem.registerChest(this.staffChest);
    this.levelColliders.push(this.staffChest.mesh);

    this.setupEnergyItems();

    // 5 Special Pots for Key 5 (Glowing red effect)
    const specialPotPositions = [
      new THREE.Vector3(-10, 0, 5),     // Near start
      new THREE.Vector3(-20, 0, -50),   // Far left field
      new THREE.Vector3(12, 5.0, -45),  // Second floor balcony
      new THREE.Vector3(45, 0, -10),    // North of boss arena
      new THREE.Vector3(-2, 10.2, -44)  // On top of the castle roof tower
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
      { pos: new THREE.Vector3(-10, 5.0, -48), platforms: [] },
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
          this.awardKey('key4_gargoyles', new THREE.Vector3(0, 0.5, -35)); // Spawns inside castle entrance
        }
      };
    });
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
      new THREE.Vector3(55, 14.8, -75),
    ];

    energySpots.forEach((spot, idx) => {
      const y = spot.y > 5.0 ? spot.y + 0.4 : this.getTerrainHeight(spot.x, spot.z) + 0.45;
      const group = new THREE.Group();
      group.position.set(spot.x, y, spot.z);

      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xff66aa,
        emissive: 0xff3388,
        emissiveIntensity: 1.8,
        roughness: 0.2,
        metalness: 0.6,
      });
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), orbMat);
      
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 8, 16), ringMat);
      ring.rotation.x = Math.PI / 3;

      const light = new THREE.PointLight(0xff66aa, 3.0, 5.0);
      group.add(orb, ring, light);
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
      coinPositions.push(new THREE.Vector3(8.5, 1.0 + i * 0.8, -29.0 - i * 2.6));
    }

    // 4. Mezzanine Balcony Walkway (8 coins at y = 5.6)
    coinPositions.push(new THREE.Vector3(-8.0, 5.6, -44.0));
    coinPositions.push(new THREE.Vector3(-8.0, 5.6, -36.0));
    coinPositions.push(new THREE.Vector3(-4.0, 5.6, -48.0));
    coinPositions.push(new THREE.Vector3(0.0, 5.6, -48.0));
    coinPositions.push(new THREE.Vector3(4.0, 5.6, -48.0));
    coinPositions.push(new THREE.Vector3(8.0, 5.6, -44.0));
    coinPositions.push(new THREE.Vector3(4.0, 5.6, -34.0));
    coinPositions.push(new THREE.Vector3(-4.0, 5.6, -34.0));

    // 5. Upper Roof Staircase & Terrace (6 coins)
    for (let i = 0; i < 4; i++) {
      coinPositions.push(new THREE.Vector3(7.0 - i * 3.0, 5.8 + i * 1.2, -48.0));
    }
    coinPositions.push(new THREE.Vector3(-3.0, 10.6, -42.0));
    coinPositions.push(new THREE.Vector3(3.0, 10.6, -42.0));

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

      // 1. Surface Height Check (Castle slabs vs Balconies vs Roofs vs Outdoor Terrain)
      if (Math.abs(checkedPos.x) <= 14 && checkedPos.z >= -54 && checkedPos.z <= -26 && checkedPos.y < 2.0) {
        checkedPos.y = 0.85; // Sits 0.35m above Castle ground floor slab at y = 0.5
      } else if (checkedPos.y < 1.5) {
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

    // Normal patrols around the castle base (3 crabs) - placed safely away from spawn and Gekko
    const p1Y = this.getTerrainHeight(-30, -25);
    const patrol1 = new EnemyController('crab_1', new THREE.Vector3(-30, p1Y, -25), [
      new THREE.Vector3(-40, this.getTerrainHeight(-40, -25), -25),
      new THREE.Vector3(-20, this.getTerrainHeight(-20, -25), -25)
    ]);
    const p2Y = this.getTerrainHeight(25, -25);
    const patrol2 = new EnemyController('crab_2', new THREE.Vector3(25, p2Y, -25), [
      new THREE.Vector3(15, this.getTerrainHeight(15, -25), -25),
      new THREE.Vector3(35, this.getTerrainHeight(35, -25), -25)
    ]);
    const p3Y = this.getTerrainHeight(0, -65);
    const patrol3 = new EnemyController('crab_3', new THREE.Vector3(0, p3Y, -65), [
      new THREE.Vector3(-10, this.getTerrainHeight(-10, -65), -65),
      new THREE.Vector3(10, this.getTerrainHeight(10, -65), -65)
    ]);

    // Guards on the 2nd floor (2 crabs) - sitting cleanly on 2nd floor slab
    const patrol4 = new EnemyController('crab_second_floor_1', new THREE.Vector3(-6, 5.0, -40));
    const patrol5 = new EnemyController('crab_second_floor_2', new THREE.Vector3(6, 5.0, -40));

    // Boss Giant Crab in the Sand Arena
    const bossY = this.getTerrainHeight(45, -40);
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
        (e as any).health = 5;
        (e as any).maxHealth = 5;
        (e as any).attackDmg = 25;
        e.arenaCenter = new THREE.Vector3(45, 0.1, -40);
        e.arenaRadius = 15.0;
      }

      e.onAttackPlayer = (dmg) => {
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
    // Key 3: Platforming challenge (Castle Roof)
    this.spawn3DKey('key3_platform', new THREE.Vector3(0, 10.8, -44));
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
    } else if (id === 'key4_gargoyles') {
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
    if (keyId === 'key4_gargoyles') keyName = 'Llave del Secreto (Gárgolas)';
    if (keyId === 'key5_pots') keyName = 'Llave de Destrucción (Gemas)';

    this.subtitleSystem.show('LISAR', `¡Has obtenido la ${keyName}! (${this.totalKeysCount}/3 Requeridas)`);

    // Check if exit door is now unlocked (STRICT VALIDATION: EXACTLY 3 OR MORE KEYS REQUIRED)
    if (this.totalKeysCount >= 3 && this.exitDoor && !this.exitDoor.isOpen) {
      this.exitDoor.open();
      this.subtitleSystem.show('LISAR', '¡PORTÓN ABIERTO! Has reunido las 3 llaves místicas. El portal de salida en el castillo está desbloqueado.');
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
        (window as any).gameInstance?.hud.setObjective('Consigue las 5 llaves para abrir el portal');
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

    // Boss arena entrance trigger zone
    const tBoss = new TriggerZone('trig_boss_arena', new THREE.Vector3(26.0, -1, -47.0), new THREE.Vector3(34.0, 6, -33.0), () => {
      if (!this.stateFlags.bossCinematicPlayed) {
        this.stateFlags.bossCinematicPlayed = true;
        this.runBossCinematic();
      }
    });
    this.triggerZones.push(tBoss);

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

    if (cinematicCamera && hud) {
      this.isCinematicPlaying = true;
      this.enemies.forEach(e => e.isPaused = true);
      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      // Position Wukong facing FORWARD along -Z (with his BACK to the camera +Z!)
      this.player.mesh.position.set(0, 0.2, 10);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();

      // Ensure screen fade is 100% hidden so 3D world is immediately visible
      hud.fadeScreenIn(100);

      // High scenic camera sweep over the meadow and mountain pagodas down to behind Wukong
      const startCamPos = new THREE.Vector3(22.0, 16.0, 32.0);
      const startLookAt = new THREE.Vector3(0, 3.5, -35.0);

      // End camera position: Placed smoothly BEHIND Wukong, looking forward into the kingdom
      const endCamPos = new THREE.Vector3(0, 2.8, 15.5);
      const endLookAt = new THREE.Vector3(0, 1.8, -25.0);

      this.subtitleSystem.show('LISAR', '¡Bienvenido al Reino Místico del Rey Mono!', 4000);

      let introFinished = false;
      const finishIntro = async () => {
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

      cinematicCamera.moveCamera(startCamPos, endCamPos, startLookAt, endLookAt, 3.5).then(() => {
        finishIntro();
      });
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
    if (this.grassUniforms) {
      this.grassUniforms.uTime.value = performance.now() / 1000.0;
      if (this.grassUniforms.uPlayerPos) {
        this.grassUniforms.uPlayerPos.value.copy(playerPos);
      }
    }
    if (this.cloudsUniforms) {
      this.cloudsUniforms.uTime.value = performance.now() / 1000.0;
    }
    // Update elevator platforms
    this.movingPlatforms.forEach(p => p.update(delta));

    // Check triggers
    this.triggerZones.forEach(t => t.check(playerPos, delta));
    
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

        if (this.inputManager.keys['KeyE'] || (hud?.isTouchDevice?.() && distToKey < 1.3)) {
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
      if (e.state !== 'DEAD') e.update(delta, playerPos, this.levelColliders);
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
      this.inputManager.keys
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
          hud?.showInteractionPrompt(`Hablar con Gekko (${currentCoins}/50 Monedas)`);
          if (this.inputManager.keys['KeyE']) {
            this.subtitleSystem.show('Gekko', `Aún no tienes las 50 monedas Lisar (tienes ${currentCoins}/50). ¡Búscalas por todo el reino!`);
          }
        }
      } else if (this.gekkoMissionState === 'REWARD_GIVEN') {
        const hud = (window as any).gameInstance?.hud;
        hud?.showInteractionPrompt('Hablar con Gekko');
        if (this.inputManager.keys['KeyE']) {
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
          hud?.showInteractionPrompt('Activar Palanca del Dragón [E]');
          if (this.inputManager.keys['KeyE'] || (hud?.isTouchDevice?.() && distToSwitch < 1.4)) {
            this.isLavaVaultOpen = true;
            this.dragonLeverStick.rotation.x = -Math.PI / 4;
            this.lavaVaultHatch.position.y = -20; // Open hatch down
            this.audioManager.playCardPickup();
            this.subtitleSystem.show('Mecanismo Secreto', '¡Has activado la Palanca del Dragón! La Cripta de Lava Subterránea se ha abierto en la planta baja.');
          }
        } else {
          hud?.showInteractionPrompt('Palanca Activada (Cripta de Lava Abierta)');
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
      this.subtitleSystem.show('Cripta de Lava', '¡Cuidado con la lava ardiente! Cruza usando las plataformas móviles.');
    }

    // ── Energy Item / Peach Pickup Check (Manual E key press with Full TakeItem Animation) ─────────────────────
    for (let i = this.energyItems.length - 1; i >= 0; i--) {
      const item = this.energyItems[i];
      item.rotation.y += delta * 2.0; // Slow magical spin
      const distToEnergy = item.position.distanceTo(playerPos);
      if (distToEnergy < 2.2 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
        const hud = (window as any).gameInstance?.hud;
        hud?.showInteractionPrompt('Presiona [E] para tomar Durazno Celestial');

        if (this.inputManager.keys['KeyE'] || (hud?.isTouchDevice?.() && distToEnergy < 1.3)) {
          hud?.hideInteractionPrompt();
          const peachPos = item.position.clone();

          // Lock player movement and lock controls during TakeItem animation
          this.player.isControlsLocked = true;
          this.player.isMovementLocked = true;
          this.player.velocity.set(0, 0, 0);

          // Attach peach to Wukong's hand so it doesn't disappear prematurely
          this.sceneManager.scene.remove(item);
          const handNode = ItemPickupVFX.findHandNode(this.player);
          handNode.add(item);
          item.position.set(0, 0.15, 0.05);
          item.scale.setScalar(0.8);

          this.energyItems.splice(i, 1);

          this.player.animationController.playTakeItemAnimation(() => {
            // ONLY WHEN TakeItem animation finishes:
            handNode.remove(item);
            this.collectibleSystem.spawnSparks(peachPos);
            this.audioManager.playCardPickup();
            this.player.heal(35);
            this.player.isControlsLocked = false;
            this.player.isMovementLocked = false;
            this.subtitleSystem.show('Durazno Celestial', '¡Has recogido un Durazno Celestial! (+35 ENERGÍA RESTAURADA)');
          });
        }
      }
    }

    // ── Chest Interaction — Staff Pickup ──────────────────────────────────────
    if (!this.stateFlags.staffFound && this.staffChest.mesh.position.distanceTo(playerPos) < 2.0) {
      const hud = (window as any).gameInstance?.hud;
      hud?.showInteractionPrompt('Presiona [E] para abrir cofre');

      if (this.inputManager.keys['KeyE'] && !this.staffChest.isUnlocked) {
        this.stateFlags.staffFound = true;
        this.staffChest.isUnlocked = true;
        hud?.hideInteractionPrompt();

        // Pause enemy AI!
        this.enemies.forEach(e => e.isPaused = true);

        this.staffChest.unlock(this.audioManager, this.collectibleSystem, () => {
          this.player.equipStaff(this.sceneManager.scene);
          this.subtitleSystem.show('Báculo Mágico', '¡Has encontrado el Báculo Mágico en el cofre! Hechizos desbloqueados.');
        });

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
            // Resume enemy AI!
            this.enemies.forEach(e => e.isPaused = false);
          },
        });

        cinematic.run().catch(err => {
          console.error('[LevelToyStory] ChestCinematic error:', err);
          this.player.isMovementLocked = false;
          // Resume enemy AI!
          this.enemies.forEach(e => e.isPaused = false);
        });
      }
    } else {
      (window as any).gameInstance?.hud?.hideInteractionPrompt();
    }
  }

  private async runBossCinematic(): Promise<void> {
    const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
    const hud = (window as any).gameInstance?.hud;

    if (!cinematicCamera || !hud) return;

    try {
      // Pause enemy AI!
      this.enemies.forEach(e => e.isPaused = true);
      await hud.fadeScreenOut(500);

      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      // Position Player facing East, inside the arena boundaries
      this.player.mesh.position.set(35, 0.1, -40);
      this.player.mesh.rotation.set(0, Math.PI / 2, 0); 
      this.player.forceIdle();

      // Position Boss facing West, inside the arena
      this.bossEnemy.mesh.position.set(48, 0.1, -40);
      this.bossEnemy.mesh.rotation.set(0, -Math.PI / 2, 0); 
      
      this.bossEnemy.isPaused = false; 
      this.bossEnemy.state = 'IDLE';

      // Camera view inside the arena, avoiding boundary walls
      const endPos = new THREE.Vector3(41.5, 2.5, -46.0); 
      const endLookAt = new THREE.Vector3(41.5, 1.2, -40.0); 
      cinematicCamera.moveCamera(endPos, endPos, endLookAt, endLookAt, 999.0);

      this.subtitleSystem.hide();
      await hud.fadeScreenIn(500);

      let cinematicSkipped = false;

      const finishCinematic = async () => {
        if (cinematicSkipped) return;
        cinematicSkipped = true;
        window.removeEventListener('keydown', skipHandler);
        hud.hideDialogue();

        await hud.fadeScreenOut(500);

        cinematicCamera.abort();
        this.player.isControlsLocked = false;
        this.player.isMovementLocked = false;

        // Resume enemy AI
        this.enemies.forEach(e => e.isPaused = false);

        await hud.fadeScreenIn(500);
      };

      const skipHandler = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
          finishCinematic();
        }
      };
      window.addEventListener('keydown', skipHandler);

      hud.showTypewriterDialogue(
        'Jefe Cangrejo',
        '¡Cuidado! Este cangrejo gigante acorazado es inmune a tus ataques normales. ¡Espera a que intente embestirte, esquívalo, y golpéalo por detrás mientras esté aturdido!',
        () => {
          if (cinematicSkipped) return;
          setTimeout(() => {
            if (cinematicSkipped) return;
            finishCinematic();
          }, 7000);
        }
      );
    } catch (err) {
      console.error('[Boss Cinematic] Error during cinematic, performing emergency cleanup:', err);
      // Emergency cleanup — always restore gameplay
      cinematicCamera.abort();
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.enemies.forEach(e => e.isPaused = false);
      hud.hideDialogue();
    }
  }


}
