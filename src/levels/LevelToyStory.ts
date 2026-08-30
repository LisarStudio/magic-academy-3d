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
    key1_gekko: { id: 'key1_gekko', name: 'Llave de la Riqueza (Gekko)', color: 0x00ff88, emissiveColor: 0x00cc66, obtained: false },
    key2_boss: { id: 'key2_boss', name: 'Llave de Combate (Jefe Cangrejo)', color: 0xff2200, emissiveColor: 0xff4400, obtained: false },
    key3_platform: { id: 'key3_platform', name: 'Llave de Plataformas (Tejado)', color: 0x00e5ff, emissiveColor: 0x00bfff, obtained: false },
    key4_gargoyles: { id: 'key4_gargoyles', name: 'Llave del Secreto (Gárgolas)', color: 0xa855f7, emissiveColor: 0x9333ea, obtained: false },
    key5_pots: { id: 'key5_pots', name: 'Llave de Destrucción (Gemas)', color: 0xffa500, emissiveColor: 0xff8800, obtained: false },
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
        // Castle walls thick envelope
        if (x > -17 && x < 17 && z > -58 && z < -17) continue;

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

    // Castle Base / Ground Floor Foundation
    const castleGroundFloor = new THREE.Mesh(new THREE.BoxGeometry(28, 0.4, 28), floorMat);
    castleGroundFloor.position.set(0, 0.1, castleCenterZ);
    castleGroundFloor.receiveShadow = true;
    scene.add(castleGroundFloor);
    this.levelColliders.push(castleGroundFloor);

    // Front Grand Entrance Staircase (z = -23 to z = -27)
    for (let s = 0; s < 5; s++) {
      const stepW = 8.0 - s * 0.4;
      const step = new THREE.Mesh(new THREE.BoxGeometry(stepW, 0.35, 1.2), stoneMat);
      step.position.set(0, s * 0.25 + 0.15, -23.5 - s * 0.9);
      scene.add(step);
      this.levelColliders.push(step);
    }

    // Outer Fortress Walls (Left, Right, Back)
    const wallHeight = 5.0;
    const castleLeftWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, wallHeight, 28), stoneMat);
    castleLeftWall.position.set(-14, wallHeight / 2, castleCenterZ);
    const castleRightWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, wallHeight, 28), stoneMat);
    castleRightWall.position.set(14, wallHeight / 2, castleCenterZ);
    const castleBackWall = new THREE.Mesh(new THREE.BoxGeometry(28, wallHeight, 0.6), stoneMat);
    castleBackWall.position.set(0, wallHeight / 2, castleCenterZ - 14);
    scene.add(castleLeftWall, castleRightWall, castleBackWall);
    this.levelColliders.push(castleLeftWall, castleRightWall, castleBackWall);

    // Front Façade Monumental Pillars
    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(2.5, wallHeight, 2.5), stoneMat);
    pLeft.position.set(-8, wallHeight / 2, castleCenterZ + 14);
    const pRight = new THREE.Mesh(new THREE.BoxGeometry(2.5, wallHeight, 2.5), stoneMat);
    pRight.position.set(8, wallHeight / 2, castleCenterZ + 14);
    scene.add(pLeft, pRight);
    this.levelColliders.push(pLeft, pRight);

    // Castle Second Floor Balcony & Sanctum Floor (y = 5.0)
    const secondFloorBack = new THREE.Mesh(new THREE.BoxGeometry(28, 0.4, 14), floorMat);
    secondFloorBack.position.set(0, 5.0, castleCenterZ - 7);
    secondFloorBack.receiveShadow = true;
    scene.add(secondFloorBack);
    this.levelColliders.push(secondFloorBack);

    const secondFloorFront = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 14), floorMat);
    secondFloorFront.position.set(4, 5.0, castleCenterZ + 7);
    secondFloorFront.receiveShadow = true;
    scene.add(secondFloorFront);
    this.levelColliders.push(secondFloorFront);

    // Second Floor Interior Room (Library/Sanctum) side walls
    const roomWallL = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.6), stoneMat);
    roomWallL.position.set(-13, 6.5, castleCenterZ - 5);
    const roomWallR = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.6), stoneMat);
    roomWallR.position.set(13, 6.5, castleCenterZ - 5);
    scene.add(roomWallL, roomWallR);
    this.levelColliders.push(roomWallL, roomWallR);

    // Inside Castle Staircase (connecting ground floor y=0.1 to second floor y=5)
    const stepCount = 14;
    for (let i = 0; i < stepCount; i++) {
      const t = i / (stepCount - 1);
      const stepY = 0.1 + t * 4.9;
      const stepZ = -30 - t * 14;
      const step = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 1.5), stoneMat);
      step.position.set(-8, stepY, stepZ);
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
    }

    const stairRampLength = Math.hypot(14, 4.9) + 2.0;
    const stairsCollider = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.35, stairRampLength),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    stairsCollider.position.set(-8, 2.55, -37);
    stairsCollider.rotation.x = Math.atan(4.9 / 14);
    scene.add(stairsCollider);
    this.levelColliders.push(stairsCollider);

    // Second Floor Guardrails
    const guardrailL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 28), stoneMat);
    guardrailL.position.set(-13.8, 5.6, castleCenterZ);
    const guardrailR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 28), stoneMat);
    guardrailR.position.set(13.8, 5.6, castleCenterZ);
    const guardrailB = new THREE.Mesh(new THREE.BoxGeometry(28, 1.2, 0.4), stoneMat);
    guardrailB.position.set(0, 5.6, castleCenterZ - 13.8);
    scene.add(guardrailL, guardrailR, guardrailB);
    this.levelColliders.push(guardrailL, guardrailR, guardrailB);

    // Castle High Tower (Central cylinder on the roof) from y = 5 to 10
    const towerGeo = new THREE.CylinderGeometry(6, 6, 5, 12);
    const highTower = new THREE.Mesh(towerGeo, stoneMat);
    highTower.position.set(0, 7.5, castleCenterZ - 4);
    highTower.castShadow = true;
    highTower.receiveShadow = true;
    scene.add(highTower);
    this.levelColliders.push(highTower);

    // Tower Roof/Platform at y = 10.2
    const towerRoof = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 6.4, 0.4, 12), floorMat);
    towerRoof.position.set(0, 10.2, castleCenterZ - 4);
    scene.add(towerRoof);
    this.levelColliders.push(towerRoof);

    // Elevator (MovingPlatform) connecting ground floor to 2nd floor (y: 0.2 to 5.0)
    const elevator = new MovingPlatform(
      new THREE.Vector3(10, 0.2, castleCenterZ + 10),
      new THREE.Vector3(10, 5.0, castleCenterZ + 10),
      1.5, // speed
      4, 4 // size
    );
    scene.add(elevator.mesh);
    this.movingPlatforms.push(elevator);
    this.levelColliders.push(elevator.mesh);

    // Internal Tower Spiral Steps to Roof Platform (y = 5.0 to 10.2)
    const towerSteps = 10;
    for (let i = 0; i < towerSteps; i++) {
      const progress = i / (towerSteps - 1);
      const angle = progress * Math.PI * 1.8;
      const h = 5.2 + progress * 5.0;
      const sx = Math.cos(angle) * 4.2;
      const sz = (castleCenterZ - 4) + Math.sin(angle) * 4.2;

      const step = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.3, 1.4), stoneMat);
      step.position.set(sx, h, sz);
      step.rotation.y = -angle + Math.PI / 2;
      scene.add(step);
      this.levelColliders.push(step);
    }

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

    // Chinese Curved Pagoda Roof Eaves over the 1st floor balcony (y = 5.2)
    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(19, 2.2, 4), roofMat);
    roof1.position.set(0, 5.8, castleCenterZ);
    roof1.rotation.y = Math.PI / 4;
    scene.add(roof1);

    // Chinese Tower Pagoda Crown Roof over the top cylinder (y = 10.4)
    const roofTower = new THREE.Mesh(new THREE.ConeGeometry(9.5, 3.5, 4), roofMat);
    roofTower.position.set(0, 12.0, castleCenterZ - 4);
    roofTower.rotation.y = Math.PI / 4;
    scene.add(roofTower);

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

      // ── WALKABLE SPIRAL STAIRCASE (ESCALERA EN ESPIRAL DEL TEMPLO DEL BÁCULO) ──
      const numSteps = 24;
      const startH = 0.8;
      const totalH = 14.0;
      const stepRadius = 4.8;

      for (let i = 0; i < numSteps; i++) {
        const progress = i / (numSteps - 1);
        const angle = progress * Math.PI * 2.8; // ~500 degrees spiral rotation
        const h = startH + progress * totalH;

        const stepGeo = new THREE.BoxGeometry(3.5, 0.35, 1.8);
        const step = new THREE.Mesh(stepGeo, stoneMat);
        const sx = Math.cos(angle) * stepRadius;
        const sz = Math.sin(angle) * stepRadius;

        step.position.set(sx, h, sz);
        step.rotation.y = -angle + Math.PI / 2;
        cit.add(step);
        this.levelColliders.push(step);

        // Outer Safety Balustrade Railing along the spiral edge (prevents falling off)
        const railPost = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 8), redWoodMat);
        const rx = Math.cos(angle) * (stepRadius + 1.5);
        const rz = Math.sin(angle) * (stepRadius + 1.5);
        railPost.position.set(rx, h + 0.6, rz);
        cit.add(railPost);
        this.levelColliders.push(railPost);

        if (i % 6 === 0) {
          const lanternMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, emissive: 0xff4400, emissiveIntensity: 1.5 });
          const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), lanternMat);
          lantern.position.set(sx * 1.2, h + 1.5, sz * 1.2);
          const lLight = new THREE.PointLight(0xff7700, 2.0, 6.0);
          lLight.position.set(sx * 1.2, h + 1.5, sz * 1.2);
          cit.add(lantern, lLight);
        }
      }

      // ── PISO SUPERIOR / CÁMARA DEL SECRETO (Y = 14.8) ──
      const upperFloor = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.6, 16), stoneMat);
      upperFloor.position.y = 14.8;
      cit.add(upperFloor);
      this.levelColliders.push(upperFloor);

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
    // We need 50 coins scattered across the map
    // Let's spawn them algorithmically and mathematically
    const coinPositions: THREE.Vector3[] = [];

    // Castle front pathway (10 coins)
    for (let i = 0; i < 10; i++) {
      coinPositions.push(new THREE.Vector3(0, 0.5, 8 - i * 2));
    }

    // Inside Castle ground floor (10 coins)
    for (let x = -8; x <= 8; x += 4) {
      for (let z = -48; z <= -35; z += 4) {
        if (x !== 0 || z !== -40) {
          coinPositions.push(new THREE.Vector3(x, 0.5, z));
        }
      }
    }

    // Along the wrapping outer ramp (6 coins)
    for (let i = 0; i < 6; i++) {
      coinPositions.push(new THREE.Vector3(-15, 0.5 + i * 0.8, -29 - i * 2.2));
    }

    // Castle Second Floor balcony/terrace (6 coins)
    coinPositions.push(new THREE.Vector3(-8, 5.5, -45));
    coinPositions.push(new THREE.Vector3(-4, 5.5, -48));
    coinPositions.push(new THREE.Vector3(4, 5.5, -48));
    coinPositions.push(new THREE.Vector3(8, 5.5, -45));
    coinPositions.push(new THREE.Vector3(0, 5.5, -33));
    coinPositions.push(new THREE.Vector3(2, 5.5, -33));

    // Outer plains & Boss Arena entrance (12 coins)
    coinPositions.push(new THREE.Vector3(15, 0.5, -20));
    coinPositions.push(new THREE.Vector3(20, 0.5, -25));
    coinPositions.push(new THREE.Vector3(25, 0.5, -30));
    coinPositions.push(new THREE.Vector3(25, 0.5, -50));
    coinPositions.push(new THREE.Vector3(20, 0.5, -55));
    coinPositions.push(new THREE.Vector3(15, 0.5, -60));
    // Inside boss arena perimeter
    coinPositions.push(new THREE.Vector3(45, 0.5, -30));
    coinPositions.push(new THREE.Vector3(35, 0.5, -40));
    coinPositions.push(new THREE.Vector3(55, 0.5, -40));
    coinPositions.push(new THREE.Vector3(45, 0.5, -50));
    coinPositions.push(new THREE.Vector3(40, 0.5, -45));
    coinPositions.push(new THREE.Vector3(50, 0.5, -35));

    // Platforming climbing spots (6 coins)
    coinPositions.push(new THREE.Vector3(11, 7.0, -45));
    coinPositions.push(new THREE.Vector3(8, 8.5, -52));
    coinPositions.push(new THREE.Vector3(0, 9.7, -53));
    coinPositions.push(new THREE.Vector3(0, 10.7, -44)); // Castle roof tower top
    coinPositions.push(new THREE.Vector3(-4, 10.7, -44));
    coinPositions.push(new THREE.Vector3(4, 10.7, -44));

    // South ruins coins (3 coins)
    coinPositions.push(new THREE.Vector3(-30, 0.5, 10));
    coinPositions.push(new THREE.Vector3(-27, 0.5, 13));
    coinPositions.push(new THREE.Vector3(-32, 0.5, 7));

    // West ruins coins (4 coins)
    coinPositions.push(new THREE.Vector3(-45, 0.5, -40)); // center of circle
    coinPositions.push(new THREE.Vector3(-45, 0.5, -35));
    coinPositions.push(new THREE.Vector3(-40, 0.5, -40));
    coinPositions.push(new THREE.Vector3(-45, 5.2, -40)); // Top of broken arch

    // Guarantee EXACTLY 50 deterministic coin positions aligned strictly with terrain height
    const EXPECTED_LISAR_COINS = 50;
    const rawCoins = coinPositions.slice(0, EXPECTED_LISAR_COINS);
    while (rawCoins.length < EXPECTED_LISAR_COINS) {
      const rx = (Math.random() - 0.5) * 60;
      const rz = -15 - Math.random() * 50;
      rawCoins.push(new THREE.Vector3(rx, 0.6, rz));
    }

    const finalCoins = rawCoins.map((pos) => {
      // If the coin is near ground level (not on balconies/roofs/stairs), align to terrain height
      if (pos.y < 1.5) {
        pos.y = this.getTerrainHeight(pos.x, pos.z) + 0.6;
      }
      return pos;
    });

    console.log(`[COINS] Initializing spawn sequence for EXACTLY ${finalCoins.length}/${EXPECTED_LISAR_COINS} Lisar Coins.`);

    let index = 0;
    const spawnNext = () => {
      if (index >= finalCoins.length) {
        console.log(`[COINS] Spawned: ${finalCoins.length}/${EXPECTED_LISAR_COINS}`);
        return;
      }
      const pos = finalCoins[index];
      this.createSparks(pos);
      this.collectibleSystem.spawnCoin(`coin_${index}`, pos);
      this.audioManager.playCoinSpawnHarmonic(index);
      index++;
      setTimeout(spawnNext, 40);
    };
    spawnNext();
  }

  private setupNPCs(): void {
    // Position Gekko near the start/castle front, elevated +0.18m so his feet sit perfectly on top of floor
    const gekkoY = this.getTerrainHeight(-4, -10) + 0.18;
    this.gekkoNPC = new GekkoNPC(new THREE.Vector3(-4, gekkoY, -10), -Math.PI * 0.25);
    this.gekkoNPC.loadModels();
    this.sceneManager.scene.add(this.gekkoNPC.mesh);

    // Gekko's physical collider (prevents Wukong from passing through Gekko)
    const gekkoCollider = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 2.5, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    gekkoCollider.position.set(-4, gekkoY + 1.25, -10);
    this.sceneManager.scene.add(gekkoCollider);
    this.levelColliders.push(gekkoCollider);

    // Setup floating coin model for dialog reference
    this.floatingCoinMesh = new THREE.Group();
    this.floatingCoinMesh.position.set(-4, 1.4, -10);
    this.floatingCoinMesh.scale.set(0.6, 0.6, 0.6);
    this.floatingCoinMesh.visible = false;
    this.sceneManager.scene.add(this.floatingCoinMesh);

    const loader = new GLTFLoader();
    loader.load(
      import.meta.env.BASE_URL + 'assets/collectibles/lisar coin.glb?v=7',
      (gltf) => {
        this.floatingCoinMesh.add(gltf.scene.clone());
        this.collectibleSystem.coinTemplate = gltf.scene;
      },
      undefined,
      (err) => { console.warn("Failed to load LISAR coin", err); }
    );
  }

  private setupEnemies(): void {
    const scene = this.sceneManager.scene;

    // Normal patrols around the castle base (3 crabs) - placed safely away from spawn and Gekko
    const patrol1 = new EnemyController('crab_1', new THREE.Vector3(-30, 0, -25), [
      new THREE.Vector3(-40, 0, -25), new THREE.Vector3(-20, 0, -25)
    ]);
    const patrol2 = new EnemyController('crab_2', new THREE.Vector3(25, 0, -25), [
      new THREE.Vector3(15, 0, -25), new THREE.Vector3(35, 0, -25)
    ]);
    const patrol3 = new EnemyController('crab_3', new THREE.Vector3(0, 0, -65), [
      new THREE.Vector3(-10, 0, -65), new THREE.Vector3(10, 0, -65)
    ]);

    // Guards on the 2nd floor (2 crabs)
    const patrol4 = new EnemyController('crab_second_floor_1', new THREE.Vector3(-6, 5.0, -40));
    const patrol5 = new EnemyController('crab_second_floor_2', new THREE.Vector3(6, 5.0, -40));

    // Boss Giant Crab in the Sand Arena
    this.bossEnemy = new EnemyController('crab_boss', new THREE.Vector3(45, 0.1, -40));
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
    if (keyId === 'key1_gekko') keyName = 'Llave Naranja de Gekko (50 Monedas)';
    if (keyId === 'key2_boss') keyName = 'Llave Carmesí de Combate (Jefe Cangrejo)';
    if (keyId === 'key3_platform') keyName = 'Llave Esmeralda de Plataformas (Tejado)';
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
    const geom = new THREE.BufferGeometry();
    const count = 25;
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    for(let i=0; i<count; i++) {
      positions[i*3] = pos.x + (Math.random() - 0.5)*0.8;
      positions[i*3+1] = pos.y + Math.random()*0.8;
      positions[i*3+2] = pos.z + (Math.random() - 0.5)*0.8;
      velocities.push(
        (Math.random() - 0.5) * 3,
        Math.random() * 3 + 2,
        (Math.random() - 0.5) * 3
      );
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x3df3ff, size: 0.15, transparent: true });
    const points = new THREE.Points(geom, mat);
    this.sceneManager.scene.add(points);
    
    let age = 0;
    const animate = () => {
      age += 0.016;
      if (age > 0.6) {
        this.sceneManager.scene.remove(points);
        geom.dispose();
        mat.dispose();
        return;
      }
      const p = geom.attributes.position.array as Float32Array;
      for(let i=0; i<count; i++) {
        p[i*3] += velocities[i*3] * 0.016;
        p[i*3+1] += velocities[i*3+1] * 0.016;
        p[i*3+2] += velocities[i*3+2] * 0.016;
        velocities[i*3+1] -= 9.8 * 0.016; // gravity
      }
      geom.attributes.position.needsUpdate = true;
      mat.opacity = 1 - (age / 0.6);
      requestAnimationFrame(animate);
    };
    animate();
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

    // Boss arena entrance trigger zone
    const tBoss = new TriggerZone('trig_boss_arena', new THREE.Vector3(26.0, -1, -47.0), new THREE.Vector3(34.0, 6, -33.0), () => {
      if (!this.stateFlags.bossCinematicPlayed) {
        this.stateFlags.bossCinematicPlayed = true;
        this.runBossCinematic();
      }
    });
    this.triggerZones.push(tBoss);

    // Gekko conversation trigger zone
    const tGekko = new TriggerZone('trig_gekko', new THREE.Vector3(-7, -1, -13.0), new THREE.Vector3(-1.0, 5, -7.0), async () => {
      if (this.isCinematicPlaying) return;

      if (this.gekkoMissionState === 'NOT_STARTED') {
        this.gekkoMissionState = 'MISSION_ACTIVE';
        this.stateFlags.gekkoTalked = true;
        console.log('[GEKKO] State transition: NOT_STARTED -> MISSION_ACTIVE');
        this.runGekkoCinematic();
      } else if (this.gekkoMissionState === 'MISSION_COMPLETE') {
        console.log('[GEKKO] Triggering 2nd cinematic for 50 coins reward...');
        this.runGekkoSecondCinematic();
      } else if (this.gekkoMissionState === 'MISSION_ACTIVE') {
        const currentCoins = this.collectibleSystem.coinCount;
        if (currentCoins >= 50) {
          this.gekkoMissionState = 'MISSION_COMPLETE';
          console.log('[GEKKO] State transition: MISSION_ACTIVE -> MISSION_COMPLETE');
          this.runGekkoSecondCinematic();
        } else {
          this.subtitleSystem.show('Gekko', `Aún no tienes las 50 monedas Lisar (tienes ${currentCoins}/50). ¡Búscalas por todo el escenario!`);
        }
      } else if (this.gekkoMissionState === 'REWARD_GIVEN') {
        this.subtitleSystem.show('Gekko', '¡Gracias por ayudarme con las 50 Lisar Coins! Usa esa llave para abrir el portón principal.');
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
    const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
    const hud = (window as any).gameInstance?.hud;

    if (cinematicCamera && hud) {
      // Pause enemy AI!
      this.enemies.forEach(e => e.isPaused = true);
      await hud.fadeScreenOut(500);

      this.player.isControlsLocked = true;
      this.player.isMovementLocked = true;

      const gekkoY = this.getTerrainHeight(-4, -10) + 0.18;
      // Position Player facing Gekko
      this.player.mesh.position.set(-4, 0.2, -7.5);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();
      
      // Position Gekko facing Player
      this.gekkoNPC.mesh.position.set(-4, gekkoY, -10);
      this.gekkoNPC.mesh.rotation.set(0, 0, 0);
      this.gekkoNPC.setTalking(true);

      this.floatingCoinMesh.position.set(-4, gekkoY + 1.4, -8.7);
      this.floatingCoinMesh.visible = true;

      this.subtitleSystem.hide();

      // Camera view
      const endPos = new THREE.Vector3(-1.5, gekkoY + 1.25, -8.75); 
      const endLookAt = new THREE.Vector3(-4.0, gekkoY + 1.1, -8.75); 
      cinematicCamera.moveCamera(endPos, endPos, endLookAt, endLookAt, 999.0);

      await hud.fadeScreenIn(500);

      let cinematicSkipped = false;

      const finishCinematic = async () => {
        if (cinematicSkipped) return;
        cinematicSkipped = true;
        window.removeEventListener('keydown', skipHandler);
        window.removeEventListener('touchstart', touchSkipHandler);
        window.removeEventListener('pointerdown', touchSkipHandler);
        hud.hideDialogue();
        
        await hud.fadeScreenOut(500);
        
        cinematicCamera.abort();
        this.player.isControlsLocked = false;
        this.player.isMovementLocked = false;
        
        this.gekkoNPC.setTalking(false);
        this.gekkoNPC.mesh.position.set(-4, gekkoY, -10);
        this.gekkoNPC.mesh.rotation.set(0, -Math.PI * 0.25, 0);
        this.floatingCoinMesh.visible = false;
        
        // Resume enemy AI!
        this.enemies.forEach(e => e.isPaused = false);

        await hud.fadeScreenIn(500);
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
      window.addEventListener('pointerdown', touchSkipHandler, { passive: false });

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
      this.player.mesh.rotation.set(0, Math.PI, 0); // Math.PI = facing -Z into the world!
      this.player.forceIdle();

      // Start black fade
      await hud.fadeScreenOut(0);

      // High scenic camera sweep over the meadow and mountain pagodas
      const startCamPos = new THREE.Vector3(25.0, 18.0, 35.0);
      const startLookAt = new THREE.Vector3(0, 4.0, -40.0);

      // End camera position: Placed smoothly BEHIND Wukong, looking forward into the kingdom
      const endCamPos = new THREE.Vector3(0, 2.8, 15.5);
      const endLookAt = new THREE.Vector3(0, 1.8, -25.0);

      cinematicCamera.moveCamera(startCamPos, endCamPos, startLookAt, endLookAt, 4.0);

      // Fade screen in
      await hud.fadeScreenIn(1000);

      this.subtitleSystem.show('LISAR', '¡Bienvenido al Reino Místico del Rey Mono! Se ha iniciado la aventura.', 4000);

      let introFinished = false;
      const finishIntro = async () => {
        if (introFinished) return;
        introFinished = true;
        window.removeEventListener('keydown', keySkip);
        window.removeEventListener('touchstart', touchSkip);
        window.removeEventListener('pointerdown', touchSkip);

        hud.hideDialogue();
        cinematicCamera.abort();

        // Position camera behind Wukong facing forward (-Z)
        if (cameraController) {
          cameraController.yaw = Math.PI; // Look along -Z into the world
          cameraController.pitch = -0.15;
          cameraController.updateCameraPosition();
        }

        // Ensure Wukong stays facing -Z (back to camera) and is completely unlocked
        this.player.mesh.rotation.set(0, Math.PI, 0);

        this.isCinematicPlaying = false;
        this.player.isControlsLocked = false;
        this.player.isMovementLocked = false;
        this.player.isAttacking = false;
        this.player.velocity.set(0, 0, 0);
        this.player.forceIdle();

        this.enemies.forEach(e => e.isPaused = false);
        hud.showGameplayHUD();
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
      window.addEventListener('pointerdown', touchSkip, { passive: false });

      // ZERO GEKKO DIALOGUE ON INTRO! Gekko stays completely idle until Wukong physically walks up to him!
      setTimeout(() => {
        if (!introFinished) finishIntro();
      }, 4200);
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

      // Position Player facing Gekko
      this.player.mesh.position.set(-4, 0, -7.5);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.forceIdle();
      
      // Position Gekko facing Player
      this.gekkoNPC.mesh.position.set(-4, 0, -10);
      this.gekkoNPC.mesh.rotation.set(0, 0, 0);
      this.gekkoNPC.setTalking(true);

      // NO LISAR COIN FLOATING IN 2ND CINEMATIC!
      if (this.floatingCoinMesh) this.floatingCoinMesh.visible = false;

      // Camera view
      const endPos = new THREE.Vector3(-1.5, 1.25, -8.75); 
      const endLookAt = new THREE.Vector3(-4.0, 1.1, -8.75); 
      cinematicCamera.moveCamera(endPos, endPos, endLookAt, endLookAt, 999.0);

      this.subtitleSystem.hide();
      await hud.fadeScreenIn(500);

      let cinematicSkipped = false;

      const finishCinematic = async () => {
        if (cinematicSkipped) return;
        cinematicSkipped = true;
        window.removeEventListener('keydown', skipHandler);
        window.removeEventListener('touchstart', touchSkipHandler);
        window.removeEventListener('pointerdown', touchSkipHandler);
        hud.hideDialogue();
        
        await hud.fadeScreenOut(400);
        
        cinematicCamera.abort();
        this.gekkoNPC.setTalking(false);
        this.gekkoNPC.mesh.position.set(-4, 0, -10);
        this.gekkoNPC.mesh.rotation.set(0, -Math.PI * 0.25, 0);
        
        // Hide Gekko badge from HUD as it's completed
        const gekkoBadge = document.getElementById('gekko-quest-complete');
        if (gekkoBadge) gekkoBadge.classList.add('hidden');

        await hud.fadeScreenIn(400);

        // ── FASE 2-5: KeyPickupSequence for Gekko Orange Key (key1_gekko) ──
        console.log('[GEKKO] Orange Key given');
        const keyData = this.keyDefinitions['key1_gekko'];
        const spawnPos = new THREE.Vector3(-4, 1.2, -8.7);

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
      window.addEventListener('pointerdown', touchSkipHandler, { passive: false });

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
    this.triggerZones.forEach(t => t.check(playerPos));
    
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
    for (let idx = this.keysMeshes.length - 1; idx >= 0; idx--) {
      const kMesh = this.keysMeshes[idx];
      kMesh.rotation.y += delta * 2.0;
      kMesh.position.y += Math.sin(Date.now() * 0.003) * 0.001;

      // Check distance for collection
      if (kMesh.position.distanceTo(playerPos) < 1.4 && !this.player.isControlsLocked && !this.isCinematicPlaying) {
        const keyId = kMesh.name;
        const keyPos = kMesh.position.clone();
        const keyData = this.keyDefinitions[keyId] || {
          id: keyId,
          name: 'Llave Mágica',
          color: 0xffd700,
          emissiveColor: 0xffaa00,
          obtained: false,
        };

        // Remove key mesh from scene and array immediately
        this.sceneManager.scene.remove(kMesh);
        this.keysMeshes.splice(idx, 1);

        KeyPickupSequence.runSequence(keyData, keyPos, this.player, this.sceneManager.scene, () => {
          this.awardKey(keyId as any, keyPos);
        });
      }
    }

    // Update enemies (including DYING state for death VFX execution and memory cleanup)
    this.enemies.forEach(e => {
      if (e.state !== 'DEAD') e.update(delta, playerPos, this.levelColliders);
    });

    // Update collectibles
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
      }
    );

    // ── Energy Item Pickup Check ──────────────────────────────────────────
    for (let i = this.energyItems.length - 1; i >= 0; i--) {
      const item = this.energyItems[i];
      item.rotation.y += delta * 2.0; // Slow magical spin
      if (item.position.distanceTo(playerPos) < 1.6 && !this.player.isControlsLocked) {
        this.sceneManager.scene.remove(item);
        this.energyItems.splice(i, 1);
        this.createSparks(item.position);
        this.audioManager.playCardPickup();
        this.player.heal(35);
        this.subtitleSystem.show('Durazno Celestial', '¡Has recogido un Durazno Celestial! (+35 ENERGÍA RESTAURADA)');
      }
    }

    // ── Chest Interaction — Staff Pickup ──────────────────────────────────────
    if (!this.stateFlags.staffFound && this.staffChest.mesh.position.distanceTo(playerPos) < 2.0) {
      const hud = (window as any).gameInstance?.hud;
      hud?.showInteractionPrompt('Abrir Cofre');

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
