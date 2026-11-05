import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AudioManager } from '../core/AudioManager';
import type { InputManager } from '../core/InputManager';
import type { PlayerController } from '../player/PlayerController';
import type { HUD } from '../ui/HUD';

const LETTERS = ['W', 'U', 'K', 'O', 'N', 'G'] as const;
type MissionState = 'AVAILABLE' | 'DIALOGUE' | 'ACTIVE' | 'FAILED' | 'COMPLETED';

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
  private readonly actors: Array<{ root: THREE.Group; mixer: THREE.AnimationMixer; head: THREE.Bone | null; yaw: number; pitch: number }> = [];
  private readonly lookTarget = new THREE.Vector3();
  private readonly headWorld = new THREE.Vector3();
  private readonly headLocal = new THREE.Vector3();
  private readonly headParentWorldQuaternion = new THREE.Quaternion();
  private readonly headOffset = new THREE.Quaternion();
  private readonly letterRoots: THREE.Group[] = [];
  private letterAssetsReady = false;
  private preloading: Promise<void> | null = null;
  private state: MissionState = 'AVAILABLE';
  private elapsed = 0;
  private collectedCount = 0;
  private activeLetterIndex = -1;
  private activeLetterAge = 0;
  private savedCompleted = false;
  private readonly interactionRadius = 3.4;
  private readonly lookRadius = 3;
  private readonly pickupRadius = 1.65;
  private readonly catHeight = 1.8;
  private readonly onStateChange: (completed: boolean) => void;
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
    onStateChange: (completed: boolean) => void
  ) {
    this.scene = scene;
    this.getTerrainHeight = getTerrainHeight;
    this.player = player;
    this.input = input;
    this.hud = hud;
    this.audio = audio;
    this.position = spawn.clone();
    this.onStateChange = onStateChange;
    this.root.name = 'NPC_Gatos_Gemelos';
    this.root.position.copy(spawn);
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
          if ((object as THREE.Bone).isBone && /(?:head|cabeza)$/i.test(object.name)) head = object as THREE.Bone;
          const mesh = object as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.revealAuthoredIris(mesh);
          }
        });

        const mixer = new THREE.AnimationMixer(gltf.scene);
        if (gltf.animations.length) mixer.clipAction(gltf.animations[0]).play();
        this.actors.push({ root: actorRoot, mixer, head, yaw: 0, pitch: 0 });

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
    const retry = this.state === 'FAILED';
    this.state = 'DIALOGUE';
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    const text = this.savedCompleted
      ? '¡Increíble! ¡Las encontraste todas! El desafío de los gemelos ya es tuyo.'
      : retry
        ? '¡Casi lo consigues! ¿Quieres intentarlo otra vez?'
        : '¡Eh, Wukong! ¡Tengo un desafío para ti! He escondido seis letras mágicas por todo el reino que forman tu nombre. Pero no será tan fácil... ¡Tienes solo 60 segundos para encontrarlas todas y deberás recogerlas en orden! ¿Crees que eres lo suficientemente rápido para conseguirlo?';
    const choices = this.savedCompleted
      ? [{ label: '¡Gracias!', value: 'decline' as const }]
      : retry
        ? [{ label: 'Reintentar', value: 'accept' as const }, { label: 'Salir', value: 'decline' as const }]
        : [{ label: '¡Acepto el desafío!', value: 'accept' as const }, { label: 'Ahora no.', value: 'decline' as const }];

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

  private beginChallenge(): void {
    this.elapsed = 0;
    this.collectedCount = 0;
    this.activeLetterIndex = 0;
    this.activeLetterAge = 0;
    this.state = 'ACTIVE';
    this.setActiveLetter(0);
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

    if (this.state === 'ACTIVE') {
      this.elapsed += delta;
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
      if (playerDistance <= this.interactionRadius && this.actors.length === 2 && !this.hud.isDialogueOpen()) {
        this.hud.showInteractionPrompt('Hablar con los gemelos');
        if (this.input.consumeInteractPress()) this.showDialogue();
      }
      return;
    }
    if (playerDistance > this.interactionRadius || this.actors.length < 2 || this.hud.isDialogueOpen()) return;
    const label = this.letterAssetsReady ? 'Hablar con los gemelos' : 'Preparando el desafío de los gemelos…';
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
        actor.head.parent?.getWorldQuaternion(this.headParentWorldQuaternion);
        this.headLocal.applyQuaternion(this.headParentWorldQuaternion.invert());
        desiredYaw = THREE.MathUtils.clamp(Math.atan2(this.headLocal.x, this.headLocal.z), -Math.PI * 2 / 9, Math.PI * 2 / 9);
        desiredPitch = THREE.MathUtils.clamp(
          Math.atan2(this.headLocal.y, Math.hypot(this.headLocal.x, this.headLocal.z)),
          -Math.PI / 12,
          Math.PI / 9
        );
      }
      const maxStep = Math.max(0, delta) * Math.PI / 2;
      actor.yaw += THREE.MathUtils.clamp(desiredYaw - actor.yaw, -maxStep, maxStep);
      actor.pitch += THREE.MathUtils.clamp(desiredPitch - actor.pitch, -maxStep, maxStep);
      this.headOffset.setFromEuler(new THREE.Euler(actor.pitch, actor.yaw, 0, 'YXZ'));
      // The mixer evaluates the authored head keys before this method each
      // frame, so this constrained local offset never accumulates.
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
      this.hud.showMissionNotice('¡DESAFÍO COMPLETADO!', '¡Has recuperado las seis letras mágicas!');
      this.onStateChange(true);
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
    if (completed) this.state = 'COMPLETED';
  }

  public cancel(): void {
    if (this.state === 'ACTIVE' || this.state === 'DIALOGUE') {
      this.setActiveLetter(-1);
      this.activeLetterIndex = -1;
      this.collectedCount = 0;
      this.elapsed = 0;
      this.state = this.savedCompleted ? 'COMPLETED' : 'AVAILABLE';
    }
    this.player.isControlsLocked = false;
    this.player.isMovementLocked = false;
    this.clearBursts();
    this.hud.hideLetterChallenge();
    this.hud.hideDialogue();
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
