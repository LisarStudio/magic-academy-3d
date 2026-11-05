import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AudioManager } from '../core/AudioManager';
import type { InputManager } from '../core/InputManager';
import type { PlayerController } from '../player/PlayerController';
import type { HUD } from '../ui/HUD';

const LETTERS = ['W', 'U', 'K', 'O', 'N', 'G'] as const;
type MissionState = 'AVAILABLE' | 'DIALOGUE' | 'STARTING' | 'ACTIVE' | 'FAILED' | 'COMPLETED';

const LETTER_POSITIONS: ReadonlyArray<THREE.Vector2> = [
  new THREE.Vector2(29, -73),
  new THREE.Vector2(4, -74),
  new THREE.Vector2(-24, -72),
  new THREE.Vector2(-47, -55),
  new THREE.Vector2(-41, -29),
  new THREE.Vector2(-15, -19)
];

/** Two original cats from NPC_Silvio.blend and their shared ordered-letter trial. */
export class TwinCatsChallenge {
  private readonly scene: THREE.Scene;
  private readonly getTerrainHeight: (x: number, z: number) => number;
  private readonly player: PlayerController;
  private readonly input: InputManager;
  private readonly hud: HUD;
  private readonly audio: AudioManager;
  public readonly position: THREE.Vector3;
  public readonly root = new THREE.Group();
  public readonly colliders: THREE.Mesh[] = [];
  private readonly loader = new GLTFLoader();
  private readonly actors: Array<{
    root: THREE.Group;
    mixer: THREE.AnimationMixer;
    head: THREE.Bone | null;
    headRestQuaternion: THREE.Quaternion;
    headHasAnimatedRotation: boolean;
    yaw: number;
    pitch: number;
  }> = [];
  private readonly lookTarget = new THREE.Vector3();
  private readonly headWorld = new THREE.Vector3();
  private readonly headLocal = new THREE.Vector3();
  private readonly headParentWorldQuaternion = new THREE.Quaternion();
  private readonly headOffset = new THREE.Quaternion();
  private readonly headEuler = new THREE.Euler(0, 0, 0, 'YXZ');
  private readonly twinCatsFillLight = new THREE.PointLight(0xffd39a, 3.2, 8, 2);
  private readonly letterRoots: THREE.Group[] = [];
  private letterAssetsReady = false;
  private preloading: Promise<void> | null = null;
  private state: MissionState = 'AVAILABLE';
  private elapsed = 0;
  private collectedCount = 0;
  private activeLetterIndex = -1;
  private activeLetterAge = 0;
  private hudEntryElapsed = 0;
  private savedCompleted = false;
  private rewardCollected = false;
  private rewardRoot: THREE.Group | null = null;
  private rewardLoading: Promise<void> | null = null;
  private rewardLoadFailed = false;
  private rewardAge = 0;
  private rewardBaseY = 0;
  private rewardVisualRoot: THREE.Group | null = null;
  private rewardParticles: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null = null;
  private readonly rewardParticlePhases = [0, 1.7, 3.2, 4.8, 5.7];
  private readonly interactionRadius = 3.4;
  private readonly lookRadius = 3;
  private readonly pickupRadius = 1.65;
  private readonly rewardHintRadius = 4.5;
  private readonly catHeight = 1.8;
  private readonly onStateChange: (completed: boolean) => void;
  private readonly onRewardCollected: (collected: boolean) => void;
  private readonly bursts: Array<{
    points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
    origins: Float32Array;
    velocities: THREE.Vector3[];
    age: number;
  }> = [];

  constructor(
    scene: THREE.Scene,
    spawn: THREE.Vector3,
    getTerrainHeight: (x: number, z: number) => number,
    player: PlayerController,
    input: InputManager,
    hud: HUD,
    audio: AudioManager,
    onStateChange: (completed: boolean) => void,
    onRewardCollected: (collected: boolean) => void,
    rewardCollected = false
  ) {
    this.scene = scene;
    this.getTerrainHeight = getTerrainHeight;
    this.player = player;
    this.input = input;
    this.hud = hud;
    this.audio = audio;
    this.position = spawn.clone();
    this.onStateChange = onStateChange;
    this.onRewardCollected = onRewardCollected;
    this.rewardCollected = rewardCollected;
    this.root.name = 'NPC_Gatos_Gemelos';
    this.root.position.copy(spawn);
    this.twinCatsFillLight.name = 'Twin_Cats_Warm_Fill_No_Shadows';
    this.twinCatsFillLight.position.set(0, 1.55, 0);
    this.twinCatsFillLight.castShadow = false;
    this.root.add(this.twinCatsFillLight);
    // The original GLBs face +Z. Face the pair toward the player's arrival;
    // the prior extra PI turn made them show their backs on approach.
    this.root.rotation.y = Math.atan2(player.mesh.position.x - spawn.x, player.mesh.position.z - spawn.z);
    [-0.88, 0.88].forEach((offset, index) => {
      const blocker = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52, 0.52, 1.75, 10),
        new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide })
      );
      blocker.name = `npc_twin_cat_blocker_${index === 0 ? 'silvio' : 'loki'}`;
      const rotatedOffset = new THREE.Vector3(offset, 0, 0).applyQuaternion(this.root.quaternion);
      blocker.position.set(spawn.x + rotatedOffset.x, spawn.y + 0.88, spawn.z + rotatedOffset.z);
      blocker.userData.solidPlayerBlocker = true;
      this.colliders.push(blocker);
      this.scene.add(blocker);
    });
    this.loadCats();
  }

  private async loadCats(): Promise<void> {
    const names = ['silvio', 'loki'] as const;
    const lateralOffsets = [-0.88, 0.88];
    try {
      for (let i = 0; i < names.length; i++) {
        const gltf = await this.loader.loadAsync(`${import.meta.env.BASE_URL}assets/npc/twin-cats/${names[i]}.glb`);
        const actorRoot = new THREE.Group();
        actorRoot.name = names[i] === 'silvio' ? 'Gato_01_Silvio' : 'Gato_02_Loki';
        actorRoot.add(gltf.scene);
        actorRoot.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(actorRoot);
        const size = bounds.getSize(new THREE.Vector3());
        actorRoot.scale.setScalar(this.catHeight / Math.max(0.001, size.y));
        actorRoot.updateMatrixWorld(true);
        const scaledBounds = new THREE.Box3().setFromObject(actorRoot);
        const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());
        // The source scene spaces the two cats far apart for staging. Remove
        // each model's source-world offset before placing them as one NPC.
        actorRoot.position.set(lateralOffsets[i] - scaledCenter.x, -scaledBounds.min.y, -scaledCenter.z);
        this.root.add(actorRoot);

        let head: THREE.Bone | null = null;
        gltf.scene.traverse((object) => {
          if ((object as THREE.Bone).isBone && /(?:head|cabeza)(?:\.\d+)?$/i.test(object.name)) head = object as THREE.Bone;
          const mesh = object as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            const warmMaterials = sourceMaterials.map((source) => {
              const material = source.clone();
              if ('emissive' in material && !/(?:iris|sclera)/i.test(source.name)) {
                const litMaterial = material as THREE.MeshStandardMaterial;
                litMaterial.emissive.setRGB(0.075, 0.043, 0.015);
                litMaterial.emissiveIntensity = 0.7;
              }
              return material;
            });
            mesh.material = Array.isArray(mesh.material) ? warmMaterials : warmMaterials[0]!;
            this.revealAuthoredIris(mesh);
          }
        });

        const mixer = new THREE.AnimationMixer(gltf.scene);
        if (gltf.animations.length) mixer.clipAction(gltf.animations[0]).play();
        const headBone = head as THREE.Bone | null;
        const headHasAnimatedRotation = Boolean(headBone && gltf.animations.some((clip) =>
          clip.tracks.some((track) => track.name === `${headBone.name}.quaternion`)
        ));
        if (!headBone) console.warn(`[TwinCats] No head bone found on ${names[i]} rig; authored animation is preserved without procedural gaze.`);
        if (headBone && !headHasAnimatedRotation) console.info(`[TwinCats] ${names[i]} head is not keyed by the source animation; gaze offset will reset from its bind pose each frame.`);
        this.actors.push({
          root: actorRoot,
          mixer,
          head: headBone,
          headRestQuaternion: headBone?.quaternion.clone() ?? new THREE.Quaternion(),
          headHasAnimatedRotation,
          yaw: 0,
          pitch: 0
        });

      }
      this.scene.add(this.root);
    } catch (error) {
      console.error('[TwinCats] Could not load the exported original cat rigs.', error);
    }
  }

  private preloadLetters(): Promise<void> {
    if (this.letterAssetsReady) return Promise.resolve();
    if (this.preloading) return this.preloading;
    this.preloading = Promise.all(LETTERS.map(async (letter, index) => {
      const gltf = await this.loader.loadAsync(`${import.meta.env.BASE_URL}assets/letter-challenge/letter-${letter.toLowerCase()}.glb`);
      const item = new THREE.Group();
      item.name = `Letra_Magica_${letter}`;
      item.add(gltf.scene);
      item.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(item);
      const size = bounds.getSize(new THREE.Vector3());
      item.scale.setScalar(0.88 / Math.max(0.001, size.y));
      item.updateMatrixWorld(true);
      const normalizedBounds = new THREE.Box3().setFromObject(item);
      item.position.y = -normalizedBounds.min.y;
      item.rotation.y = this.getLetterApproachYaw(index);
      item.userData.approachYaw = item.rotation.y;
      item.visible = false;
      item.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.letterIndex = index;
      });
      this.letterRoots[index] = item;
    })).then(() => { this.letterAssetsReady = true; }).catch((error) => {
      this.preloading = null;
      console.error('[TwinCats] Letter challenge assets failed to preload.', error);
      throw error;
    });
    return this.preloading;
  }

  /** The exported cats already contain black iris shells, but those shells
   * sit behind the sclera surface. Move only the authored iris geometry
   * forward slightly in eye-local space so the pupils remain visible in WebGL. */
  private revealAuthoredIris(mesh: THREE.Mesh): void {
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const irisGroups = mesh.geometry.groups.filter((group) => /tiny iris/i.test(materials[group.materialIndex ?? 0]?.name ?? ''));
    const singleIris = materials.length === 1 && /tiny iris/i.test(materials[0]?.name ?? '');
    if (!singleIris && irisGroups.length === 0) return;

    mesh.geometry = mesh.geometry.clone();
    const position = mesh.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
    if (!position) return;
    const vertices = new Set<number>();
    if (singleIris) {
      for (let i = 0; i < position.count; i++) vertices.add(i);
    } else {
      const index = mesh.geometry.index;
      for (const group of irisGroups) {
        for (let i = group.start; i < group.start + group.count; i++) {
          vertices.add(index ? index.getX(i) : i);
        }
      }
    }
    // In the source eye meshes the iris maximum Z is ~0.0097 while the sclera
    // reaches ~0.0126; +0.0034 exposes its surface by only a few millimetres.
    for (const vertex of vertices) position.setZ(vertex, position.getZ(vertex) + 0.0034);
    position.needsUpdate = true;
    mesh.geometry.computeVertexNormals();

    const keepIrisDark = (material: THREE.Material): THREE.Material => {
      const copy = material.clone();
      if (/tiny iris/i.test(copy.name) && 'color' in copy) {
        const iris = copy as THREE.MeshStandardMaterial;
        iris.color.set('#100d14');
        iris.roughness = 0.28;
        iris.depthWrite = true;
      }
      return copy;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(keepIrisDark) : keepIrisDark(mesh.material);
  }

  /** The supplied letters share a +Z readable face. Point that face toward
   * the previous waypoint and keep the idle rotation small enough to remain legible. */
  private getLetterApproachYaw(index: number): number {
    const point = LETTER_POSITIONS[index];
    if (!point) return 0;
    const previousX = index === 0 ? this.position.x : LETTER_POSITIONS[index - 1].x;
    const previousZ = index === 0 ? this.position.z : LETTER_POSITIONS[index - 1].y;
    return Math.atan2(previousX - point.x, previousZ - point.y);
  }

  private showDialogue(): void {
    if (this.savedCompleted) {
      const text = this.rewardCollected
        ? '¡Cuídalo mucho, Wukong! Ojalá su pequeña patita te recuerde que siempre habrá amigos deseándote suerte, estés donde estés.'
        : '¡Wukong! ¡No olvides tu Maneki Neko! La buena fortuna ya te está esperando. Solo tienes que acercarte y recogerlo.';
      this.showShortDialogue(text);
      return;
    }
    const retry = this.state === 'FAILED';
    // Warm the media cache while the player reads the choices; this does not
    // start playback. Declining the quest therefore never changes the music.
    void this.audio.prepareSilvioMissionMusic().catch((error: unknown) => {
      console.warn('[TwinCats] Silvio mission music preload failed.', error);
    });
    this.state = 'DIALOGUE';
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    const text = retry
        ? '\u00a1Casi lo consigues! \u00bfQuieres intentarlo otra vez?'
        : '\u00a1Wukong! Hemos escondido seis letras m\u00e1gicas por el reino. \u00a1Encu\u00e9ntralas en orden antes de que pasen 60 segundos! \u00bfAceptas?';
    const choices = retry
        ? [{ label: 'Reintentar', value: 'accept' as const }, { label: 'Salir', value: 'decline' as const }]
        : [{ label: '\u00a1Acepto!', value: 'accept' as const }, { label: 'Ahora no', value: 'decline' as const }];

    this.hud.showDialogueChoices('Silvio', text, choices, (choice) => {
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.player.isAttacking = false;
      this.player.velocity.set(0, 0, 0);
      this.player.forceIdle();
      if (choice === 'accept' && !this.savedCompleted) {
        if (!this.letterAssetsReady) {
          this.hud.showInteractionPrompt('Preparando el desafío…');
          this.state = retry ? 'FAILED' : 'AVAILABLE';
          void this.preloadLetters().then(() => this.showDialogue()).catch(() => {});
          return;
        }
        this.beginChallenge();
      } else {
        this.state = this.savedCompleted ? 'COMPLETED' : retry ? 'FAILED' : 'AVAILABLE';
      }
    });
  }

  private showShortDialogue(text: string, after?: () => void): void {
    this.state = 'DIALOGUE';
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.hud.showDialogueChoices('Silvio', text, [{ label: 'Continuar', value: 'accept' }], () => {
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.player.isAttacking = false;
      this.player.velocity.set(0, 0, 0);
      this.player.forceIdle();
      this.state = this.savedCompleted ? 'COMPLETED' : this.state === 'FAILED' ? 'FAILED' : 'AVAILABLE';
      after?.();
    });
  }

  private showVictoryDialogue(line = 0): void {
    const lines = [
      '¡Lo lograste, Wukong! ¡Reuniste todas las letras! Sabía que eras rápido, pero hoy demostraste algo todavía más importante: que nunca te rindes.',
      'Como prometimos, tenemos un regalo para ti. Llegó hasta nosotros desde unas tierras muy lejanas, donde los viajeros cuentan historias sobre pequeños gatos que atraen la buena fortuna.',
      'Se llama Maneki Neko, el Gato de la Abundancia.',
      'Dicen que invita a la suerte, a la prosperidad y a los buenos encuentros. Pero su verdadero secreto no está en el oro ni en los tesoros...',
      '...sino en recordar que incluso los caminos más difíciles pueden traer algo maravilloso. Llévalo contigo, Wukong. Que te acompañe en tus viajes, te recuerde a tus amigos y te dé esperanza cuando el camino parezca demasiado oscuro.',
      '¡Anda, acércate! ¡Es tuyo! Y quién sabe... ¡quizás la fortuna tenga grandes planes para ti!'
    ];
    if (line >= lines.length) {
      void this.ensureRewardSpawned().then(() => this.finishDialogue());
      return;
    }
    this.state = 'DIALOGUE';
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.hud.showDialogueChoices('Silvio', lines[line], [{ label: line === lines.length - 1 ? '¡Voy por él!' : 'Continuar', value: 'accept' }], () => {
      if (line === 2) void this.ensureRewardSpawned();
      this.showVictoryDialogue(line + 1);
    });
  }

  private finishDialogue(): void {
    this.state = this.savedCompleted ? 'COMPLETED' : 'AVAILABLE';
    this.player.isControlsLocked = false;
    this.player.isMovementLocked = false;
    this.player.isAttacking = false;
    this.player.velocity.set(0, 0, 0);
    this.player.forceIdle();
    void this.audio.stopSilvioMissionMusic();
  }

  private ensureRewardSpawned(): Promise<void> {
    if (!this.savedCompleted || this.rewardCollected || this.rewardRoot?.parent === this.scene) return Promise.resolve();
    if (this.rewardLoadFailed) return Promise.resolve();
    if (this.rewardLoading) return this.rewardLoading;
    this.rewardLoading = this.loader.loadAsync(`${import.meta.env.BASE_URL}assets/quest/maneki_neko.glb`).then((gltf) => {
      if (this.rewardCollected || !this.savedCompleted) return;
      const reward = new THREE.Group();
      reward.name = 'Maneki_Neko_Recompensa_Silvio_Loki';
      const visual = new THREE.Group();
      visual.name = 'Maneki_Neko_Modelo_Levitante';
      visual.add(gltf.scene);
      visual.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(visual);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 0.86 / Math.max(0.001, size.y);
      visual.scale.setScalar(scale);
      visual.position.set(-center.x * scale, 0.38 - bounds.min.y * scale, -center.z * scale);
      reward.add(visual);
      this.rewardVisualRoot = visual;
      const localSide = new THREE.Vector3(2.1, 0, 0).applyQuaternion(this.root.quaternion);
      const x = this.position.x + localSide.x;
      const z = this.position.z + localSide.z;
      this.rewardBaseY = this.getTerrainHeight(x, z);
      reward.position.set(x, this.rewardBaseY, z);
      reward.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData.twinCatsReward = true;
      });
      this.rewardRoot = reward;
      this.addRewardFloatEffects(reward);
      this.scene.add(reward);
      this.createMagicBurst(reward.position.clone().add(new THREE.Vector3(0, 0.4, 0)), 18);
    }).catch((error) => {
      this.rewardLoadFailed = true;
      this.rewardLoading = null;
      console.error('[TwinCats] Could not load the original Maneki Neko reward model.', error);
    });
    return this.rewardLoading;
  }

  private addRewardFloatEffects(reward: THREE.Group): void {
    // The reward origin is at the model's feet; the shadow stays on the ground
    // while the complete reward group gently floats around its fixed base.
    const effects = new THREE.Group();
    effects.name = 'Maneki_Neko_Efectos_Flotantes';
    reward.add(effects);
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 31);
      gradient.addColorStop(0, 'rgba(255, 220, 150, 0.55)');
      gradient.addColorStop(0.42, 'rgba(255, 190, 90, 0.22)');
      gradient.addColorStop(1, 'rgba(255, 170, 60, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    const shadowTexture = new THREE.CanvasTexture(canvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.05, 0.62),
      new THREE.MeshBasicMaterial({ map: shadowTexture, color: 0x9c681d, transparent: true, opacity: 0.25, depthWrite: false, toneMapped: false })
    );
    shadow.name = 'Maneki_Neko_Sombra_Suave';
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, 0.002, 0);
    shadow.renderOrder = 1;
    effects.add(shadow);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.43, 0.012, 5, 40),
      new THREE.MeshBasicMaterial({ color: 0xffd56a, transparent: true, opacity: 0.24, depthWrite: false, toneMapped: false })
    );
    halo.name = 'Maneki_Neko_Halo_Dorado_Discreto';
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.018;
    effects.add(halo);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.rewardParticlePhases.length * 3), 3));
    const material = new THREE.PointsMaterial({ color: 0xffdf83, size: 0.035, transparent: true, opacity: 0.62, depthWrite: false, sizeAttenuation: true, toneMapped: false });
    this.rewardParticles = new THREE.Points(geometry, material);
    this.rewardParticles.name = 'Maneki_Neko_Chispas_Ascendentes';
    this.rewardParticles.position.y = 0.4;
    effects.add(this.rewardParticles);
    this.updateRewardParticles(0);
  }

  private updateRewardParticles(time: number): void {
    if (!this.rewardParticles) return;
    const positions = this.rewardParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
    this.rewardParticlePhases.forEach((phase, index) => {
      const lift = (time * 0.38 + phase / (Math.PI * 2)) % 1;
      const angle = phase + time * 0.25;
      const radius = 0.26 + 0.04 * Math.sin(phase * 2);
      positions.setXYZ(index, Math.cos(angle) * radius, lift * 0.7, Math.sin(angle) * radius);
    });
    positions.needsUpdate = true;
  }

  public restoreRewardCollected(collected: boolean): void {
    this.rewardCollected = collected;
    if (collected) {
      if (this.rewardRoot) this.scene.remove(this.rewardRoot);
      this.hud.setManekiNekoOwned(true);
    } else if (this.savedCompleted) {
      this.hud.setManekiNekoOwned(false);
      void this.ensureRewardSpawned();
    }
  }

  private beginChallenge(): void {
    this.elapsed = 0;
    this.collectedCount = 0;
    this.activeLetterIndex = 0;
    this.activeLetterAge = 0;
    this.hudEntryElapsed = 0;
    this.state = 'STARTING';
    void this.audio.startSilvioMissionMusic();
    this.hud.showLetterChallenge();
    this.hud.updateLetterChallenge(60, this.collectedCount);
  }

  private setActiveLetter(index: number): void {
    this.letterRoots.forEach((letter) => {
      if (letter) { letter.visible = false; this.scene.remove(letter); }
    });
    if (index < 0 || index >= LETTERS.length) return;
    const letter = this.letterRoots[index];
    const point = LETTER_POSITIONS[index];
    if (!letter || !point) return;
    letter.position.set(point.x, this.getTerrainHeight(point.x, point.y) + 0.025, point.y);
    letter.visible = true;
    this.scene.add(letter);
    this.createMagicBurst(letter.position, 10);
  }

  public update(delta: number, playerPos: THREE.Vector3, gameplayActive: boolean): void {
    const safeDelta = Math.max(0, Math.min(delta, 0.1));
    this.actors.forEach((actor) => actor.mixer.update(safeDelta));
    this.updateBursts(safeDelta);

    const playerDistance = Math.hypot(playerPos.x - this.position.x, playerPos.z - this.position.z);
    if (playerDistance < 24 && !this.letterAssetsReady && !this.preloading) {
      void this.preloadLetters().catch(() => {});
    }

    if (!gameplayActive || this.state === 'ACTIVE' && playerPos.y < -4) {
      this.cancel();
      return;
    }

    if (playerDistance <= 8) {
      this.lookTarget.copy(playerPos);
      this.lookTarget.y += 1.35;
    }
    this.updateCatLook(safeDelta, playerDistance <= this.lookRadius ? this.lookTarget : null);

    // Let the HUD complete its 620 ms entrance before starting the 60-second
    // clock or enabling the first pickup. Movement remains unlocked.
    if (this.state === 'STARTING') {
      this.hudEntryElapsed += safeDelta;
      if (this.hudEntryElapsed >= 0.64) {
        this.state = 'ACTIVE';
        this.setActiveLetter(0);
      }
      return;
    }

    if (this.state === 'ACTIVE') {
      this.elapsed += safeDelta;
      this.activeLetterAge += safeDelta;
      const remaining = Math.max(0, 60 - this.elapsed);
      this.hud.updateLetterChallenge(remaining, this.collectedCount);
      const letter = this.letterRoots[this.activeLetterIndex];
      if (letter) {
        letter.position.y = this.getTerrainHeight(letter.position.x, letter.position.z) + 0.82 + Math.sin(this.activeLetterAge * 2.2) * 0.12;
        letter.rotation.y = (letter.userData.approachYaw as number) + Math.sin(this.activeLetterAge * 0.7) * 0.12;
        if (Math.hypot(playerPos.x - letter.position.x, playerPos.z - letter.position.z) < this.pickupRadius && Math.abs(playerPos.y - letter.position.y) < 2.2) {
          this.collectActiveLetter();
        }
      }
      if (remaining <= 0 && this.state === 'ACTIVE') this.failChallenge();
      return;
    }

    if (this.state === 'DIALOGUE') {
      if (this.input.consumeInteractPress()) this.hud.chooseDialogueOption(0);
      return;
    }

    if (this.state === 'COMPLETED') {
      if (this.savedCompleted && this.rewardCollected) return;
      if (this.savedCompleted && !this.rewardCollected) {
        void this.ensureRewardSpawned();
        if (this.rewardRoot?.parent === this.scene) {
          this.rewardAge += safeDelta;
          const { x, z } = this.rewardRoot.position;
      if (this.rewardVisualRoot) this.rewardVisualRoot.position.y = 0.38 + Math.sin(this.rewardAge * 1.5) * 0.1;
          this.updateRewardParticles(this.rewardAge);
          const rewardDistance = Math.hypot(playerPos.x - x, playerPos.z - z);
          if (rewardDistance <= this.rewardHintRadius) {
            this.hud.showInteractionPrompt(rewardDistance <= this.pickupRadius ? 'Recoger Maneki Neko' : 'Acércate al Maneki Neko');
            if (rewardDistance <= this.pickupRadius && Math.abs(playerPos.y - (this.rewardBaseY + 0.38)) < 2.1 && this.input.consumeInteractPress()) {
              this.collectReward();
            }
            return;
          }
        } else if (this.rewardLoadFailed && playerDistance <= this.interactionRadius && this.actors.length === 2 && !this.hud.isDialogueOpen()) {
          this.hud.showInteractionPrompt('Reintentar cargar el Maneki Neko');
          if (this.input.consumeInteractPress()) {
            this.rewardLoadFailed = false;
            void this.ensureRewardSpawned();
          }
          return;
        }
      }
      if (playerDistance <= this.interactionRadius && this.actors.length === 2 && !this.hud.isDialogueOpen()) {
        this.hud.showInteractionPrompt('Hablar con Silvio');
        if (this.input.consumeInteractPress()) this.showDialogue();
      }
      return;
    }
    if (playerDistance > this.interactionRadius || this.actors.length < 2 || this.hud.isDialogueOpen()) return;
    const label = this.letterAssetsReady ? 'Hablar con Silvio' : 'Preparando el desafío de los gemelos…';
    this.hud.showInteractionPrompt(label);
    if (this.input.consumeInteractPress()) {
      if (!this.letterAssetsReady) {
        void this.preloadLetters().then(() => { if (this.state !== 'ACTIVE') this.showDialogue(); }).catch(() => {});
        return;
      }
      this.showDialogue();
    }
  }

  private updateCatLook(delta: number, target: THREE.Vector3 | null): void {
    this.root.updateMatrixWorld(true);
    this.actors.forEach((actor) => {
      if (!actor.head) return;
      let desiredYaw = 0;
      let desiredPitch = 0;
      if (target) {
        actor.head.getWorldPosition(this.headWorld);
        this.headLocal.copy(target).sub(this.headWorld);
        // Use the stable NPC root frame. The old code used the animated neck's
        // frame, so each authored head/neck key changed the tracking target
        // underneath the procedural controller and could cause snapping.
        actor.root.getWorldQuaternion(this.headParentWorldQuaternion);
        this.headLocal.applyQuaternion(this.headParentWorldQuaternion.invert());
        const maxYaw = THREE.MathUtils.degToRad(35);
        desiredYaw = THREE.MathUtils.clamp(Math.atan2(this.headLocal.x, this.headLocal.z), -maxYaw, maxYaw);
        desiredPitch = THREE.MathUtils.clamp(
          Math.atan2(this.headLocal.y, Math.hypot(this.headLocal.x, this.headLocal.z)),
          THREE.MathUtils.degToRad(-15),
          THREE.MathUtils.degToRad(15)
        );
      }
      const maxStep = Math.max(0, delta) * THREE.MathUtils.degToRad(60);
      actor.yaw += THREE.MathUtils.clamp(desiredYaw - actor.yaw, -maxStep, maxStep);
      actor.pitch += THREE.MathUtils.clamp(desiredPitch - actor.pitch, -maxStep, maxStep);
      this.headEuler.set(actor.pitch, actor.yaw, 0, 'YXZ');
      this.headOffset.setFromEuler(this.headEuler);
      // The mixer writes the authored quaternion first. Compose a constrained
      // additive gaze on top; if a rig lacks a keyed head rotation, restore its
      // bind pose first so repeated offsets can never accumulate.
      if (!actor.headHasAnimatedRotation) actor.head.quaternion.copy(actor.headRestQuaternion);
      actor.head.quaternion.multiply(this.headOffset);
    });
  }

  private collectActiveLetter(): void {
    if (this.state !== 'ACTIVE') return;
    if (this.activeLetterIndex !== this.collectedCount) return;
    const pickedPosition = this.letterRoots[this.activeLetterIndex]?.position.clone();
    this.audio.playMagicLetterPickup();
    if (pickedPosition) this.createMagicBurst(pickedPosition, 16);
    this.collectedCount = Math.min(LETTERS.length, this.collectedCount + 1);
    const nextIndex = this.collectedCount;
    if (this.collectedCount >= LETTERS.length) {
      this.setActiveLetter(-1);
      this.state = 'COMPLETED';
      this.savedCompleted = true;
      this.hud.hideLetterChallenge();
      this.onStateChange(true);
      this.showVictoryDialogue();
      return;
    }
    this.activeLetterIndex = nextIndex;
    this.activeLetterAge = 0;
    this.setActiveLetter(nextIndex);
    this.hud.updateLetterChallenge(Math.max(0, 60 - this.elapsed), this.collectedCount);
  }

  private failChallenge(): void {
    if (this.state !== 'ACTIVE') return;
    const recovered = this.collectedCount;
    this.setActiveLetter(-1);
    this.activeLetterIndex = -1;
    this.state = 'FAILED';
    this.clearBursts();
    this.hud.hideLetterChallenge();
    void this.audio.stopSilvioMissionMusic();
    this.hud.showMissionNotice('¡TIEMPO AGOTADO!', `Has conseguido ${recovered} de 6 letras.`);
  }

  private createMagicBurst(position: THREE.Vector3, count: number): void {
    const geometry = new THREE.BufferGeometry();
    const origins = new Float32Array(count * 3);
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      origins[i * 3] = 0;
      origins[i * 3 + 1] = 0;
      origins[i * 3 + 2] = 0;
      const angle = Math.random() * Math.PI * 2;
      const lift = 0.35 + Math.random() * 1.1;
      velocities.push(new THREE.Vector3(Math.cos(angle) * (0.35 + Math.random() * 0.6), lift, Math.sin(angle) * (0.35 + Math.random() * 0.6)));
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const material = new THREE.PointsMaterial({ color: 0xffd86a, size: 0.075, transparent: true, opacity: 0.9, depthWrite: false, sizeAttenuation: true });
    const points = new THREE.Points(geometry, material);
    points.name = 'Efecto_Brisas_Letras';
    points.position.copy(position);
    this.scene.add(points);
    this.bursts.push({ points, origins, velocities, age: 0 });
  }

  private updateBursts(delta: number): void {
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const burst = this.bursts[i];
      burst.age += delta;
      const positions = burst.points.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let p = 0; p < burst.velocities.length; p++) {
        const velocity = burst.velocities[p];
        const t = burst.age;
        positions.setXYZ(p,
          burst.origins[p * 3] + velocity.x * t,
          burst.origins[p * 3 + 1] + velocity.y * t - 1.6 * t * t,
          burst.origins[p * 3 + 2] + velocity.z * t
        );
      }
      positions.needsUpdate = true;
      burst.points.material.opacity = Math.max(0, 0.9 * (1 - burst.age / 0.48));
      if (burst.age < 0.48) continue;
      this.scene.remove(burst.points);
      burst.points.geometry.dispose();
      burst.points.material.dispose();
      this.bursts.splice(i, 1);
    }
  }

  public restoreCompleted(completed: boolean): void {
    this.savedCompleted = completed;
    if (completed) {
      this.state = 'COMPLETED';
      if (!this.rewardCollected) void this.ensureRewardSpawned();
    }
  }

  private collectReward(): void {
    if (!this.savedCompleted || this.rewardCollected || !this.rewardRoot) return;
    this.rewardCollected = true;
    const pickedPosition = this.rewardRoot.position.clone().add(new THREE.Vector3(0, 0.75, 0));
    this.scene.remove(this.rewardRoot);
    this.rewardParticles = null;
    this.rewardVisualRoot = null;
    this.audio.playMagicLetterPickup();
    this.createMagicBurst(pickedPosition, 20);
    this.hud.setManekiNekoOwned(true, true);
    this.onRewardCollected(true);
    this.showShortDialogue('¡Cuídalo mucho, Wukong! Ojalá su pequeña patita te recuerde que siempre habrá amigos deseándote suerte, estés donde estés.');
  }

  public cancel(): void {
    if (this.state === 'ACTIVE' || this.state === 'STARTING' || this.state === 'DIALOGUE') {
      this.setActiveLetter(-1);
      this.activeLetterIndex = -1;
      this.collectedCount = 0;
      this.elapsed = 0;
      this.hudEntryElapsed = 0;
      this.state = this.savedCompleted ? 'COMPLETED' : 'AVAILABLE';
    }
    this.player.isControlsLocked = false;
    this.player.isMovementLocked = false;
    this.clearBursts();
    this.hud.hideLetterChallenge();
    this.hud.hideDialogue();
    void this.audio.stopSilvioMissionMusic();
  }

  private clearBursts(): void {
    this.bursts.forEach(({ points }) => {
      this.scene.remove(points);
      points.geometry.dispose();
      points.material.dispose();
    });
    this.bursts.length = 0;
  }
}
