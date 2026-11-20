import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { deleteSaveSlot, getSaveSlots, SAVE_SLOT_COUNT } from '../core/SaveSlotStore';
import { formatPlayTime, getSaveProgress } from '../core/GameProgress';
import type { SaveData } from '../core/SaveSlotStore';
import { LEVEL_PROGRESS_KEY_IDS, getKeyAsset, loadKeyModel } from '../collectibles/KeyAssetCatalog';
import { GekkoNPC } from '../npc/GekkoNPC';

export type SaveSlotMenuMode = 'continue' | 'new' | 'save' | 'load';
export type ProgressExitDestination = 'main-menu' | 'level-select';
type SlotAction = (mode: SaveSlotMenuMode, slotId: number) => boolean | void;

const SLOT_LABELS = ['PARTIDA I', 'PARTIDA II', 'PARTIDA III'];

/** One shared Three renderer and scene display the real optimized FBX-derived
 * book models in all three cards. The loop exists only while this panel is open. */
export class SaveSlotMenu {
  private readonly screen: HTMLElement;
  private readonly title: HTMLElement;
  private readonly description: HTMLElement;
  private readonly grid: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly confirmPanel: HTMLElement;
  private readonly confirmMessage: HTMLElement;
  private readonly status: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer | null;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(33, 1, 0.05, 20);
  private readonly previewGroups: THREE.Group[] = [];
  private readonly models: Partial<Record<'empty' | 'saved', THREE.Object3D>> = {};
  private modelLoads: Promise<void> | null = null;
  private frameId = 0;
  private lastFrameAt = 0;
  private previewStartedAt = 0;
  private mode: SaveSlotMenuMode = 'continue';
  private action: SlotAction = () => undefined;
  private onBack: () => void = () => undefined;
  private pendingConfirmation: { type: 'overwrite' | 'delete'; slotId: number } | null = null;
  private levelProgressPanel: HTMLElement | null = null;
  private levelSavePanel: HTMLElement | null = null;
  private levelProgressOpen = false;
  private levelProgressResolve: ((saved: boolean) => void) | null = null;
  private levelProgressStartedAt = 0;
  private levelProgressLastFrame = 0;
  private levelProgressElapsed = 0;
  private levelProgressWidth = 0;
  private levelProgressHeight = 0;
  private levelProgressRevealIndex = -1;
  private readonly levelKeyModels: THREE.Group[] = [];
  private levelCoinModel: THREE.Group | null = null;
  private levelCoinComplete = false;
  private levelCoinCountFinished = false;
  private levelCoinGlowElapsed = 0;
  private readonly levelCoinGlowMaterials: { material: THREE.MeshStandardMaterial; emissive: THREE.Color; intensity: number }[] = [];
  private readonly levelCoinGlowColor = new THREE.Color(0xffbd59);
  private readonly playProgressCoinTick: (index: number) => void;
  private levelGekko: THREE.Group | null = null;
  private levelGekkoRig: THREE.Object3D | null = null;
  private levelGekkoMixer: THREE.AnimationMixer | null = null;
  private readonly levelPreviewFits = new WeakMap<THREE.Group, { center: THREE.Vector3; normalization: number; targetHeight: number }>();
  private readonly resizeHandler = (): void => { if (this.isOpen()) this.renderFrame(performance.now(), true); };

  constructor(playProgressCoinTick: (index: number) => void = () => undefined) {
    this.playProgressCoinTick = playProgressCoinTick;
    const screen = document.createElement('section');
    screen.id = 'save-slot-screen';
    screen.className = 'save-slot-screen hidden';
    screen.setAttribute('role', 'dialog');
    screen.setAttribute('aria-modal', 'true');
    screen.setAttribute('aria-labelledby', 'save-slot-title');
    screen.innerHTML = `
      <div class="save-slot-panel">
        <header class="save-slot-header">
          <span class="save-slot-kicker">ARCHIVOS DEL REINO</span>
          <h2 id="save-slot-title">Elige una partida</h2>
          <p id="save-slot-description"></p>
        </header>
        <div id="save-slot-grid" class="save-slot-grid" aria-live="polite">
          <canvas id="save-slot-preview-canvas" aria-hidden="true"></canvas>
        </div>
        <div id="save-slot-confirm" class="save-slot-confirm hidden" role="alertdialog" aria-live="assertive">
          <p id="save-slot-confirm-message"></p>
          <div class="save-slot-confirm-actions">
            <button id="save-slot-confirm-yes" class="save-slot-button is-danger" type="button">Confirmar</button>
            <button id="save-slot-confirm-no" class="save-slot-button" type="button">Cancelar</button>
          </div>
        </div>
        <p id="save-slot-status" class="save-slot-status" role="status" aria-live="polite"></p>
        <footer class="save-slot-footer">
          <span>El porcentaje refleja hitos del contenido implementado; la aventura continúa en desarrollo.</span>
          <button id="save-slot-back" class="save-slot-button save-slot-back" type="button">Volver</button>
        </footer>
      </div>`;
    document.getElementById('app')?.appendChild(screen);
    this.screen = screen;
    this.title = screen.querySelector('#save-slot-title')!;
    this.description = screen.querySelector('#save-slot-description')!;
    this.grid = screen.querySelector('#save-slot-grid')!;
    this.canvas = screen.querySelector('#save-slot-preview-canvas')!;
    this.confirmPanel = screen.querySelector('#save-slot-confirm')!;
    this.confirmMessage = screen.querySelector('#save-slot-confirm-message')!;
    this.status = screen.querySelector('#save-slot-status')!;

    try {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: !matchMedia('(pointer: coarse)').matches, powerPreference: 'low-power' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setScissorTest(true);
      this.scene.add(new THREE.AmbientLight(0xffe4bb, 1.15));
      const keyLight = new THREE.DirectionalLight(0xffc66e, 1.65);
      keyLight.position.set(-2, 4, 5);
      this.scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0x8ba8ff, 0.55);
      fillLight.position.set(3, 1.5, -3);
      this.scene.add(fillLight);
      this.camera.position.set(0.4, 0.3, 3.05);
      this.camera.lookAt(0, 0, 0);
    } catch (error) {
      console.warn('[SaveSlots] 3D card renderer is unavailable on this device.', error);
      this.renderer = null;
    }

    for (let index = 0; index < SAVE_SLOT_COUNT; index++) {
      const group = new THREE.Group();
      group.position.x = (index - 1) * 2.45;
      this.scene.add(group);
      this.previewGroups.push(group);
    }
    screen.querySelector('#save-slot-back')!.addEventListener('click', () => this.close(true));
    screen.querySelector('#save-slot-confirm-no')!.addEventListener('click', () => this.hideConfirmation());
    screen.querySelector('#save-slot-confirm-yes')!.addEventListener('click', () => this.confirmPendingAction());
    screen.addEventListener('keydown', (event) => this.handleKeydown(event));
    window.addEventListener('resize', this.resizeHandler, { passive: true });
  }

  public open(mode: SaveSlotMenuMode, action: SlotAction, onBack: () => void = () => undefined): void {
    this.mode = mode;
    this.action = action;
    this.onBack = onBack;
    this.pendingConfirmation = null;
    // Every opening starts with the book covers/pages facing the preview camera.
    // Keep all slots in phase so Continue/Load never opens on a side view.
    this.previewStartedAt = performance.now();
    for (const group of this.previewGroups) {
      group.rotation.set(0, 0, 0);
    }
    this.confirmPanel.classList.add('hidden');
    this.status.textContent = '';
    this.title.textContent = mode === 'new' ? 'Nueva aventura' : mode === 'save' ? 'Guardar partida' : mode === 'load' ? 'Cargar partida' : 'Continuar aventura';
    this.description.textContent = mode === 'new'
      ? 'Elige un espacio vacío. Una partida existente solo se reemplaza tras confirmarlo.'
      : mode === 'save'
        ? 'Selecciona una ranura para guardar el progreso actual.'
        : mode === 'load'
          ? 'Elige una partida guardada para restaurar su aventura.'
          : 'Selecciona la ranura guardada que quieres continuar.';
    this.renderCards();
    this.screen.classList.remove('hidden');
    document.getElementById('pause-screen')?.classList.add('save-slot-paused');
    window.setTimeout(() => this.grid.querySelector<HTMLButtonElement>('.save-slot-primary:not(:disabled)')?.focus() ?? this.screen.querySelector<HTMLButtonElement>('#save-slot-back')?.focus(), 0);
    void this.loadModels();
    this.startRenderLoop();
  }

  public close(notify = false): void {
    if (!this.isOpen()) return;
    if (this.levelProgressOpen) {
      // Keep the review step explicit. Escape opens the save/skip decision;
      // it never dismisses the sequence and accidentally continues gameplay.
      this.levelProgressPanel?.querySelector<HTMLButtonElement>('[data-review-continue]')?.click();
      return;
    }
    this.screen.classList.add('hidden');
    document.getElementById('pause-screen')?.classList.remove('save-slot-paused');
    this.hideConfirmation();
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    if (notify) this.onBack();
  }

  public isOpen(): boolean { return !this.screen.classList.contains('hidden'); }

  /** Presents saved progress, then asks whether to save or continue without
   * writing. Reuses the save-slot renderer instead of creating another one. */
  public presentLevelProgress(
    save: SaveData,
    slotId: number,
    saveAction: (slotId: number) => boolean,
    exitDestination: ProgressExitDestination | null = null,
  ): Promise<boolean> {
    if (this.levelProgressOpen) this.finishLevelProgress(false);
    this.levelProgressOpen = true;
    this.levelProgressStartedAt = performance.now();
    this.levelProgressLastFrame = this.levelProgressStartedAt;
    this.levelProgressElapsed = 0;
    this.levelProgressWidth = 0;
    this.levelProgressHeight = 0;
    this.levelProgressRevealIndex = -1;
    this.pendingConfirmation = null;
    this.previewGroups.forEach((group) => { while (group.children.length) group.remove(group.children[0]!); });
    this.title.closest('.save-slot-panel')?.classList.add('is-level-progress-hidden');
    this.screen.classList.add('is-level-progress');
    const base = import.meta.env.BASE_URL;
    const keys = LEVEL_PROGRESS_KEY_IDS.map((id) => ({ id, asset: getKeyAsset(id), obtained: save.collectedKeys?.[id] === true }));
    const coins = Math.max(0, Math.min(50, Math.floor(Number(save.coinsCount) || 0)));
    this.levelCoinComplete = coins >= 50;
    const progress = getSaveProgress(save);
    const missions = this.getProgressMissions(save);
    const panel = document.createElement('section');
    panel.className = 'level-progress-panel';
    panel.classList.toggle('has-all-coins', this.levelCoinComplete);
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'level-progress-title');
    panel.tabIndex = -1;
    panel.innerHTML = `
      <canvas id="level-progress-canvas" aria-hidden="true"></canvas>
      <div class="level-progress-completion-glow" aria-hidden="true"></div>
      <div class="level-progress-gecko-lane" aria-hidden="true"></div>
      <header class="level-progress-header">
        <img src="${base}assets/ui/01_logo_wukong_reino_celestial.png" alt="La Leyenda de Wukong" />
        <div><span>ARCHIVOS DEL REINO CELESTIAL</span><h2 id="level-progress-title">Nivel 1 · ${progress.levelName.replace(/^Reino Celestial\s*[·•]\s*/i, '')}</h2></div>
        <p class="level-progress-percent">${progress.levelPercent}%<small>progreso del nivel</small></p>
      </header>
      <div class="level-progress-frame">
        <section class="level-progress-missions" aria-label="Misiones del nivel">
          ${missions.map((mission, index) => `<button class="level-mission-card ${mission.status === 'COMPLETADA' ? 'is-earned' : 'is-hidden-state'}${index === 0 ? ' is-selected' : ''}" type="button" data-mission="${index}" aria-pressed="${index === 0}">
            <span class="level-mission-art"><img src="${base}${mission.image}" alt="${mission.name}" decoding="async" />${mission.rewardIcon ? `<img class="level-mission-reward" src="${mission.rewardIcon}" alt="Recompensa Maneki Neko obtenida" decoding="async" />` : ''}<span class="level-mission-question" aria-hidden="true">?</span></span>
            <span class="level-mission-name">${mission.name}</span>
          </button>`).join('')}
        </section>
        <section class="level-progress-coin-group" aria-label="Progreso de Lisar Coins">
          <div class="level-progress-coin-row"><span class="level-coin-model" aria-hidden="true"></span><strong class="level-coin-count" aria-live="off">× 00</strong></div>
        </section>
        <div class="level-progress-key-row" aria-label="Cinco llaves del nivel">
          ${keys.map(({ id, asset, obtained }) => `<div class="level-key-card ${obtained ? 'is-obtained' : 'is-locked'}" data-key="${id}">
            <span class="level-key-model" aria-hidden="true"></span><span class="level-key-question" aria-hidden="true">?</span>
            <strong>${asset?.name ?? 'Llave'}</strong><small>${obtained ? 'OBTENIDA' : 'PENDIENTE'}</small>
          </div>`).join('')}
        </div>
      </div>
      <footer class="level-progress-controls">
        <span>${exitDestination ? 'Revisa tu progreso antes de salir; puedes guardar en la siguiente pantalla.' : 'Elige una misión para revisar tu avance'}</span>
        <button class="save-slot-button save-slot-primary" type="button" data-review-continue>${exitDestination ? (exitDestination === 'level-select' ? 'Ir a selección de nivel' : 'Volver al menú principal') : 'Continuar al Nivel 1'}</button>
      </footer>`;
    this.screen.appendChild(panel);
    this.levelProgressPanel = panel;
    const savePanel = document.createElement('section');
    savePanel.className = 'level-save-panel hidden';
    savePanel.setAttribute('role', 'dialog');
    savePanel.setAttribute('aria-modal', 'true');
    savePanel.setAttribute('aria-labelledby', 'level-save-title');
    savePanel.tabIndex = -1;
    savePanel.innerHTML = `
      <header class="level-save-heading"><span>ARCHIVOS DEL REINO CELESTIAL</span><h2 id="level-save-title">${exitDestination ? '¿Guardar antes de salir?' : '¿Deseas guardar tu progreso?'}</h2>
        <p>Se conservará en <strong>${SLOT_LABELS[slotId] ?? `PARTIDA ${slotId + 1}`}</strong>. No se sobrescribirá sin tu confirmación.</p></header>
      <button class="level-save-card" type="button" data-enter aria-label="Nivel 1, Nivel introductorio, progreso ${progress.levelPercent}%">
        <img src="${base}assets/ui/level_1_card.png" alt="" decoding="async" fetchpriority="high" />
        <span class="level-save-card-title">NIVEL 1</span>
        <span class="level-save-card-subtitle">Nivel introductorio</span>
        <strong class="level-save-card-percent" data-level-percent="${progress.levelPercent}">0%</strong>
        <span class="level-save-card-label">PROGRESO DEL NIVEL</span>
      </button>
      <button class="save-slot-button save-slot-primary level-enter-button" type="button" data-enter>${exitDestination ? (exitDestination === 'level-select' ? 'Ir a selección de nivel' : 'Volver al menú principal') : 'Entrar al Nivel 1'}</button>
      <div class="level-save-confirm hidden" role="alertdialog" aria-live="assertive">
        <strong>¿Actualizar ${SLOT_LABELS[slotId] ?? `PARTIDA ${slotId + 1}`} con este progreso?</strong>
        <span>Esta acción modifica solo la ranura que elegiste.</span>
        <div><button class="save-slot-button save-slot-primary" type="button" data-confirm-save>Confirmar guardado</button><button class="save-slot-button" type="button" data-cancel-save>Cancelar</button></div>
      </div>
      <p class="level-save-status" role="status" aria-live="polite"></p>
      <div class="level-save-actions">
        <button class="save-slot-button save-slot-primary" type="button" data-save>Guardar progreso</button>
        <button class="save-slot-button" type="button" data-skip-save>${exitDestination ? 'Salir sin guardar' : 'Omitir guardado'}</button>
        <button class="save-slot-button" type="button" data-back-progress>Volver</button>
      </div>`;
    this.screen.appendChild(savePanel);
    this.levelSavePanel = savePanel;
    this.canvas.id = 'save-slot-preview-canvas';
    this.canvas.classList.add('level-progress-render-canvas');
    panel.prepend(this.canvas);
    this.canvas.style.position = 'absolute';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.scene.background = null;
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(0, 0, 0);
    this.camera.fov = 35;
    this.camera.updateProjectionMatrix();
    this.renderer?.setScissorTest(false);
    this.renderer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    this.screen.classList.remove('hidden');
    document.getElementById('in-game-loading')?.classList.add('hidden');

    const confirmation = savePanel.querySelector<HTMLElement>('.level-save-confirm')!;
    const status = savePanel.querySelector<HTMLElement>('.level-save-status')!;
    const enterButtons = Array.from(savePanel.querySelectorAll<HTMLButtonElement>('[data-enter]'));
    const primaryEnterButton = enterButtons[enterButtons.length - 1]!;
    panel.querySelector<HTMLButtonElement>('[data-review-continue]')!.addEventListener('click', () => {
      panel.classList.add('is-review-hidden');
      savePanel.classList.remove('hidden');
      savePanel.focus();
      savePanel.querySelector<HTMLButtonElement>('[data-save]')?.focus();
    });
    savePanel.querySelector<HTMLButtonElement>('[data-save]')!.addEventListener('click', () => {
      confirmation.classList.remove('hidden');
      confirmation.querySelector<HTMLButtonElement>('[data-confirm-save]')?.focus();
    });
    savePanel.querySelector<HTMLButtonElement>('[data-cancel-save]')!.addEventListener('click', () => {
      confirmation.classList.add('hidden');
      savePanel.querySelector<HTMLButtonElement>('[data-save]')?.focus();
    });
    savePanel.querySelector<HTMLButtonElement>('[data-confirm-save]')!.addEventListener('click', () => {
      confirmation.classList.add('hidden');
      try {
        if (!saveAction(slotId)) throw new Error('El sistema de guardado no confirmó la operación.');
        status.textContent = `¡Progreso guardado en ${SLOT_LABELS[slotId]}!`;
        savePanel.querySelector('.level-save-actions')?.classList.add('hidden');
        primaryEnterButton.focus();
      } catch (error) {
        console.error('[LevelProgress] Save failed:', error);
        status.textContent = 'No se pudo guardar. La partida original se conservó.';
      }
    });
    savePanel.querySelector<HTMLButtonElement>('[data-skip-save]')!.addEventListener('click', () => this.finishLevelProgress(true));
    savePanel.querySelector<HTMLButtonElement>('[data-back-progress]')!.addEventListener('click', () => {
      savePanel.classList.add('hidden');
      panel.classList.remove('is-review-hidden');
      panel.focus();
    });
    enterButtons.forEach((button) => button.addEventListener('click', () => this.finishLevelProgress(true)));
    const levelPercent = savePanel.querySelector<HTMLElement>('[data-level-percent]');
    const percentStart = performance.now();
    const revealLevelPercent = (now: number): void => {
      if (this.levelSavePanel !== savePanel || !levelPercent) return;
      const ratio = Math.min(1, Math.max(0, (now - percentStart) / 900));
      const eased = 1 - Math.pow(1 - ratio, 3);
      levelPercent.textContent = `${Math.round(progress.levelPercent * eased)}%`;
      if (ratio < 1) requestAnimationFrame(revealLevelPercent);
    };
    requestAnimationFrame(revealLevelPercent);
    panel.querySelectorAll<HTMLButtonElement>('.level-mission-card').forEach((button) => {
      button.addEventListener('click', () => {
        panel.querySelectorAll('.level-mission-card').forEach((item) => {
          item.classList.toggle('is-selected', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });
        // Mission selection updates its visual focus only; keep the approved
        // compact composition free of a redundant status sentence.
      });
    });
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        panel.querySelector<HTMLButtonElement>('[data-review-continue]')?.click();
      }
      if (event.key === 'Enter' && (event.target as HTMLElement)?.tagName !== 'BUTTON') {
        event.preventDefault();
        panel.querySelector<HTMLButtonElement>('[data-review-continue]')?.focus();
      }
    });
    savePanel.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        if (!confirmation.classList.contains('hidden')) {
          confirmation.classList.add('hidden');
          savePanel.querySelector<HTMLButtonElement>('[data-save]')?.focus();
          return;
        }
        savePanel.classList.add('hidden');
        panel.classList.remove('is-review-hidden');
        panel.focus();
      }
    });

    panel.querySelector<HTMLElement>('.level-coin-count')!.textContent = '× 00';
    const coinCounter = panel.querySelector<HTMLElement>('.level-coin-count')!;
    const coinCountStart = performance.now();
    const coinCountDuration = 4_000;
    let lastDisplayedCoins = 0;
    const revealCoinCount = (now: number): void => {
      if (this.levelProgressPanel !== panel) return;
      const ratio = Math.min(1, Math.max(0, (now - coinCountStart) / coinCountDuration));
      // Keep the count frame-rate independent and continuously ease it into
      // the saved total without an intermediate timing break.
      const eased = ratio + 0.08 * Math.sin(Math.PI * ratio);
      const displayedCoins = Math.round(coins * eased);
      coinCounter.textContent = `× ${displayedCoins}`;
      for (let tick = lastDisplayedCoins + 1; tick <= displayedCoins; tick++) this.playProgressCoinTick(tick);
      lastDisplayedCoins = displayedCoins;
      const revealThrough = Math.min(4, Math.floor(ratio * 5));
      if (revealThrough > this.levelProgressRevealIndex) this.revealLevelProgressThrough(revealThrough, panel);
      if (ratio < 1) requestAnimationFrame(revealCoinCount);
      else {
        this.levelCoinCountFinished = true;
        if (this.levelCoinComplete) panel.classList.add('is-count-finished');
      }
    };
    requestAnimationFrame(revealCoinCount);

    const promise = new Promise<boolean>((resolve) => { this.levelProgressResolve = resolve; });
    if (!this.renderer) status.textContent = 'Vista 3D no disponible; el progreso guardado está intacto.';
    void this.loadLevelProgressModels(save, keys.map((entry) => entry.id));
    panel.focus();
    if (this.renderer) this.startRenderLoop();
    return promise;
  }

  private getProgressMissions(save: SaveData): Array<{ name: string; image: string; glyph: string; status: string; detail: string; rewardIcon?: string }> {
    const keys = save.collectedKeys ?? {};
    const gekkoDone = keys.key1_gekko === true;
    const bossDone = keys.key2_boss === true;
    const twinsDone = save.letterChallengeCompleted === true || save.manekiNekoCollected === true;
    const missionAsset = (name: string): string => `assets/ui/missions/${name}`;
    return [
      { name: 'NEZHA-X', image: missionAsset('nezha-x_mision.png'), glyph: 'N', status: bossDone ? 'COMPLETADA' : 'DISPONIBLE', detail: bossDone ? 'Has superado el desaf\u00EDo de combate.' : 'Enfrenta al guardi\u00E1n del desaf\u00EDo.' },
      { name: 'GEKKO', image: missionAsset('gekko_mision.png'), glyph: 'G', status: gekkoDone ? 'COMPLETADA' : 'EN PROGRESO', detail: gekkoDone ? 'La misi\u00F3n de Gekko fue completada.' : 'Ayuda a Gekko y re\u00FAne las Lisar Coins.' },
      { name: 'SILVIO Y LOKI', image: missionAsset('silvio_loki_mision.png'), glyph: 'SL', status: twinsDone ? 'COMPLETADA' : 'DISPONIBLE', detail: twinsDone ? 'El desaf\u00EDo de Silvio y Loki fue completado.' : 'Busca a los gemelos junto a la caba\u00F1a.', rewardIcon: save.manekiNekoCollected === true ? `${import.meta.env.BASE_URL}assets/quest/maneki_neko.png` : undefined },
      { name: 'CRIPTA', image: missionAsset('portal_mision.png'), glyph: 'C', status: keys.key4_curiosity === true ? 'COMPLETADA' : 'DISPONIBLE', detail: keys.key4_curiosity === true ? 'La Llave de la Curiosidad ya fue obtenida.' : 'Explora la cripta y encuentra la Llave de la Curiosidad.' },
      { name: '\u00C1RBOL DE LA NATURALEZA', image: missionAsset('arbol_mision.png'), glyph: 'A', status: keys.key3_platform === true ? 'COMPLETADA' : 'DISPONIBLE', detail: keys.key3_platform === true ? 'La llave del \u00C1rbol de la Naturaleza ya fue obtenida.' : 'Completa la traves\u00EDa por las lianas.' },
    ];
  }
  private async loadLevelProgressModels(save: SaveData, keyIds: readonly (typeof LEVEL_PROGRESS_KEY_IDS)[number][]): Promise<void> {
    const panel = this.levelProgressPanel;
    if (!panel || !this.renderer) return;
    const base = import.meta.env.BASE_URL;
    const makeFitGroup = (object: THREE.Object3D, targetHeight: number, name: string, preserveScale = false): THREE.Group => {
      object.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(object);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const normalization = preserveScale ? 1 : targetHeight / Math.max(size.x, size.y, size.z, 0.001);
      const fitGroup = new THREE.Group();
      fitGroup.name = name;
      fitGroup.add(object);
      this.levelPreviewFits.set(fitGroup, { center, normalization, targetHeight });
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) child.frustumCulled = false;
      });
      return fitGroup;
    };
    const loader = new GLTFLoader();
    try {
      // Load the actual gameplay collectible alongside the other preview assets.
      // The DOM span is only a transparent screen-space anchor for this shared
      // Three renderer; the visible coin comes entirely from the original GLB.
      const [coinGltf, gekkoGltf] = await Promise.all([
        loader.loadAsync(`${base}assets/collectibles/lisar%20coin.glb?v=7`),
        loader.loadAsync(`${base}assets/characters/gekko_wave.glb`),
      ]);
      if (!this.levelProgressOpen || panel !== this.levelProgressPanel) return;
      this.levelGekkoRig = gekkoGltf.scene;
      this.levelGekkoRig.scale.setScalar(GekkoNPC.MODEL_SCALE);
      // Apply the portrait-facing yaw before measuring the mesh bounds. This
      // keeps the visual pivot centered after rotation on both wide and tall
      // layouts, instead of swinging the model off to one side on phones.
      this.levelGekkoRig.rotation.y = -Math.PI * 0.25;
      this.levelGekkoRig.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.castShadow = false;
        child.receiveShadow = false;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        for (const material of materials) {
          material.transparent = false;
          material.depthWrite = true;
          material.alphaTest = 0.5;
          material.needsUpdate = true;
        }
      });
      this.levelGekkoRig.updateMatrixWorld(true);
      const gekkoBounds = new THREE.Box3().setFromObject(this.levelGekkoRig);
      const gekkoSize = gekkoBounds.getSize(new THREE.Vector3());
      const gekkoHeight = Math.max(gekkoSize.x, gekkoSize.y, gekkoSize.z, 0.001);
      this.levelGekko = makeFitGroup(this.levelGekkoRig, gekkoHeight, 'level-progress-gekko-fit', true);
      this.scene.add(this.levelGekko);
      if (gekkoGltf.animations.length) {
        this.levelGekkoMixer = new THREE.AnimationMixer(this.levelGekkoRig);
        this.levelGekkoMixer.clipAction(gekkoGltf.animations[0]!).setLoop(THREE.LoopRepeat, Infinity).play();
      }

      coinGltf.scene.updateMatrixWorld(true);
      coinGltf.scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const sources = Array.isArray(child.material) ? child.material : [child.material];
        const materials = sources.map((source) => {
          const material = source.clone();
          if (material instanceof THREE.MeshStandardMaterial) {
            // Keep the GLB's authored lighting and textures as the idle state.
            // The completion shimmer below temporarily blends over this base.
            this.levelCoinGlowMaterials.push({ material, emissive: material.emissive.clone(), intensity: material.emissiveIntensity });
          }
          return material;
        });
        sources.forEach((source) => source.dispose());
        child.material = Array.isArray(child.material) ? materials : materials[0]!;
        child.castShadow = false;
        child.receiveShadow = false;
      });
      const coinBounds = new THREE.Box3().setFromObject(coinGltf.scene);
      const coinCenter = coinBounds.getCenter(new THREE.Vector3());
      // Give the model a centered pivot so its slow 360-degree rotation stays
      // in place even if the source GLB origin is offset.
      coinGltf.scene.position.sub(coinCenter);
      const coinPivot = new THREE.Group();
      coinPivot.add(coinGltf.scene);
      this.levelCoinModel = makeFitGroup(coinPivot, 1, 'level-progress-lisar-coin');
      this.scene.add(this.levelCoinModel);

      const spacing = 1.62;
      for (let index = 0; index < keyIds.length; index++) {
        const id = keyIds[index]!;
        const model = await loadKeyModel(id);
        if (!this.levelProgressOpen || panel !== this.levelProgressPanel) return;
        const obtained = save.collectedKeys?.[id] === true;
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.castShadow = false;
          object.receiveShadow = false;
          const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
          const previewMaterials = sourceMaterials.map((source) => {
            const material = source.clone();
            // Earned keys retain the original GLB materials. Pending keys use
            // the same real geometry as a dark silhouette, without exposing
            // their reward color or engraved texture details.
            if (!obtained) {
              if ('color' in material && material.color instanceof THREE.Color) material.color.set(0x151b2a);
              if (material instanceof THREE.MeshStandardMaterial) {
                material.map = null;
                material.normalMap = null;
                material.metalnessMap = null;
                material.roughnessMap = null;
                material.aoMap = null;
                material.emissiveMap = null;
                material.metalness = 0;
                material.roughness = 1;
                material.emissive.set(0x000000);
                material.emissiveIntensity = 0;
              } else if (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial) {
                material.map = null;
                material.emissive.set(0x000000);
                material.emissiveIntensity = 0;
              }
              material.needsUpdate = true;
            }
            return material;
          });
          object.material = Array.isArray(object.material) ? previewMaterials : previewMaterials[0]!;
        });
        let previewObject: THREE.Object3D = model;
        if (id === 'key6_qi_celestial') {
          // The Qi GLB's mesh is offset from its scene origin along Z. Center
          // the mesh bounds before adding the rotating fit group so its spin
          // axis passes through the key instead of making it orbit sideways.
          model.updateMatrixWorld(true);
          const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
          const pivot = new THREE.Group();
          pivot.name = 'level-progress-key6_qi_celestial-pivot';
          pivot.add(model);
          model.position.sub(center);
          previewObject = pivot;
        }
        const fittedKey = makeFitGroup(previewObject, 1.28, `level-progress-${id}-fit`);
        fittedKey.visible = false;
        fittedKey.userData.rotateWhenRevealed = obtained;
        const keyIndex = this.levelKeyModels.length;
        fittedKey.userData.progressIndex = keyIndex;
        fittedKey.position.set((keyIndex - 2) * spacing, -1.52, 0.3 + keyIndex * 0.01);
        this.scene.add(fittedKey);
        this.levelKeyModels.push(fittedKey);
        if (keyIndex <= this.levelProgressRevealIndex) this.revealLevelProgressThrough(this.levelProgressRevealIndex, panel);
      }
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error('[LevelProgress] Could not prepare all 3D preview assets:', error);
      const status = this.levelSavePanel?.querySelector<HTMLElement>('.level-save-status');
      if (status) status.textContent = 'Algunos modelos no se pudieron cargar; el progreso guardado sigue intacto.';
    }
  }

  private revealLevelProgressThrough(index: number, panel: HTMLElement): void {
    this.levelProgressRevealIndex = Math.max(this.levelProgressRevealIndex, Math.min(4, index));
    for (let itemIndex = 0; itemIndex <= this.levelProgressRevealIndex; itemIndex++) {
      panel.querySelectorAll<HTMLElement>('.level-mission-card')[itemIndex]?.classList.add('is-revealed');
      const keyId = LEVEL_PROGRESS_KEY_IDS[itemIndex];
      panel.querySelector<HTMLElement>(`.level-key-card[data-key="${keyId}"]`)?.classList.add('is-revealed');
      const model = this.levelKeyModels[itemIndex];
      if (model && !model.visible) {
        model.visible = true;
        if (model.userData.rotateWhenRevealed === true) model.userData.revealStartedAt = performance.now();
      }
    }
  }

  private finishLevelProgress(saved: boolean): void {
    if (!this.levelProgressOpen) return;
    this.levelProgressOpen = false;
    const panel = this.levelProgressPanel;
    panel?.remove();
    this.levelProgressPanel = null;
    this.levelSavePanel?.remove();
    this.levelSavePanel = null;
    this.canvas.classList.remove('level-progress-render-canvas');
    this.grid.prepend(this.canvas);
    this.title.closest('.save-slot-panel')?.classList.remove('is-level-progress-hidden');
    this.screen.classList.remove('is-level-progress');
    this.clearLevelProgressModels();
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.screen.classList.add('hidden');
    const resolve = this.levelProgressResolve;
    this.levelProgressResolve = null;
    resolve?.(saved);
  }

  private clearLevelProgressModels(): void {
    for (const object of [...this.levelKeyModels, ...(this.levelCoinModel ? [this.levelCoinModel] : []), ...(this.levelGekko ? [this.levelGekko] : [])]) {
      object.removeFromParent();
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          if (object === this.levelCoinModel) {
            child.geometry.dispose();
            materials.forEach((material) => {
              for (const value of Object.values(material)) if (value instanceof THREE.Texture) value.dispose();
              material.dispose();
            });
          } else materials.forEach((material) => material.dispose());
        }
      });
    }
    this.levelKeyModels.length = 0;
    this.levelCoinModel = null;
    this.levelCoinComplete = false;
    this.levelCoinCountFinished = false;
    this.levelCoinGlowElapsed = 0;
    this.levelCoinGlowMaterials.length = 0;
    this.levelGekko = null;
    this.levelGekkoRig = null;
    this.levelGekkoMixer?.stopAllAction();
    this.levelGekkoMixer = null;
    this.scene.background = null;
    this.camera.position.set(0.4, 0.3, 3.05);
    this.camera.lookAt(0, 0, 0);
    this.camera.fov = 33;
    this.camera.updateProjectionMatrix();
  }

  private renderCards(): void {
    const slots = getSaveSlots();
    this.grid.querySelectorAll('.save-slot-card').forEach((card) => card.remove());
    for (let slotId = 0; slotId < SAVE_SLOT_COUNT; slotId++) {
      const data = slots[slotId];
      const card = document.createElement('article');
      card.className = `save-slot-card${data ? ' has-save' : ' is-empty'}`;
      card.dataset.slot = String(slotId);
      const modelFrame = document.createElement('div');
      modelFrame.className = 'save-slot-model-frame';
      modelFrame.dataset.preview = String(slotId);
      modelFrame.innerHTML = '<span class="save-slot-model-loading">Libro 3D</span>';
      const head = document.createElement('div');
      head.className = 'save-slot-card-heading';
      const name = document.createElement('h3');
      name.textContent = SLOT_LABELS[slotId]!;
      const badge = document.createElement('span');
      badge.className = 'save-slot-badge';
      badge.textContent = data ? 'GUARDADA' : 'VACÍA';
      head.append(name, badge);
      const details = document.createElement('div');
      details.className = 'save-slot-details';
      if (data) {
        const progress = getSaveProgress(data);
        details.innerHTML = `<p class="save-slot-level"></p><p>CONTENIDO DISPONIBLE <strong>${progress.implementedContentPercent}%</strong></p><p>PROGRESO DEL NIVEL <strong>${progress.levelPercent}%</strong></p><p>TIEMPO <strong>${formatPlayTime(progress.playedSeconds)}</strong></p><div class="save-slot-progress" aria-hidden="true"><span style="width:${progress.levelPercent}%"></span></div>`;
        details.querySelector('.save-slot-level')!.textContent = progress.levelName;
      } else {
        details.innerHTML = '<p class="save-slot-empty-title">SIN PARTIDA GUARDADA</p><p class="save-slot-empty-subtitle">NUEVA AVENTURA</p>';
      }
      const actions = document.createElement('div');
      actions.className = 'save-slot-card-actions';
      const primary = document.createElement('button');
      primary.type = 'button';
      primary.className = 'save-slot-button save-slot-primary';
      primary.textContent = this.primaryLabel(!!data);
      primary.disabled = this.mode === 'continue' || this.mode === 'load' ? !data : false;
      primary.addEventListener('click', () => this.selectSlot(slotId, !!data));
      actions.appendChild(primary);
      if (data) {
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'save-slot-delete';
        deleteButton.textContent = 'Eliminar';
        deleteButton.setAttribute('aria-label', `Eliminar ${SLOT_LABELS[slotId]}`);
        deleteButton.addEventListener('click', () => this.askToDelete(slotId));
        actions.appendChild(deleteButton);
      }
      card.append(modelFrame, head, details, actions);
      this.grid.appendChild(card);
      this.syncPreviewModel(slotId, !!data);
    }
    if (this.renderer) requestAnimationFrame(() => this.renderFrame(performance.now(), true));
  }

  private primaryLabel(hasSave: boolean): string {
    if (this.mode === 'continue') return hasSave ? 'Continuar' : 'Vacía';
    if (this.mode === 'load') return hasSave ? 'Cargar partida' : 'Vacía';
    if (this.mode === 'save') return hasSave ? 'Sobrescribir' : 'Guardar aquí';
    return hasSave ? 'Usar esta ranura' : 'Nueva partida';
  }

  private selectSlot(slotId: number, hasSave: boolean): void {
    if ((this.mode === 'continue' || this.mode === 'load') && !hasSave) return;
    if (this.mode === 'new' && hasSave) {
      this.pendingConfirmation = { type: 'overwrite', slotId };
      this.showConfirmation(`¿Sobrescribir ${SLOT_LABELS[slotId]} e iniciar una nueva aventura? La partida anterior se reemplazará solo si confirmas.`);
      return;
    }
    if (this.mode === 'save' && hasSave) {
      this.pendingConfirmation = { type: 'overwrite', slotId };
      this.showConfirmation(`¿Sobrescribir los datos guardados en ${SLOT_LABELS[slotId]}? Las otras ranuras no cambiarán.`);
      return;
    }
    this.runSelectedAction(slotId);
  }

  private runSelectedAction(slotId: number): void {
    const result = this.action(this.mode, slotId);
    if (this.mode === 'save') {
      if (result === false) {
        this.status.textContent = 'No se pudo guardar. Comprueba el almacenamiento del navegador.';
      } else {
        this.status.textContent = `${SLOT_LABELS[slotId]} guardada correctamente.`;
        this.renderCards();
      }
      return;
    }
    if (result !== false) this.close(false);
    else this.status.textContent = 'No se pudo completar la acción para esta ranura.';
  }

  private askToDelete(slotId: number): void {
    this.pendingConfirmation = { type: 'delete', slotId };
    this.showConfirmation(`¿Eliminar la partida guardada de ${SLOT_LABELS[slotId]}? Esta acción solo afecta a esa ranura.`);
  }

  private showConfirmation(message: string): void {
    this.confirmMessage.textContent = message;
    this.confirmPanel.classList.remove('hidden');
    this.confirmPanel.querySelector<HTMLButtonElement>('#save-slot-confirm-yes')?.focus();
  }

  private hideConfirmation(): void {
    this.pendingConfirmation = null;
    this.confirmPanel.classList.add('hidden');
  }

  private confirmPendingAction(): void {
    const confirmation = this.pendingConfirmation;
    if (!confirmation) return;
    this.hideConfirmation();
    if (confirmation.type === 'delete') {
      try {
        deleteSaveSlot(confirmation.slotId);
        this.status.textContent = `${SLOT_LABELS[confirmation.slotId]} eliminada.`;
        this.renderCards();
      } catch (error) {
        console.error('[SaveSlots] Could not delete save slot.', error);
        this.status.textContent = 'No se pudo eliminar la partida.';
      }
      return;
    }
    this.runSelectedAction(confirmation.slotId);
  }

  private async loadModels(): Promise<void> {
    if (!this.renderer || this.modelLoads) return this.modelLoads ?? Promise.resolve();
    const loader = new GLTFLoader();
    const base = import.meta.env.BASE_URL;
    this.modelLoads = Promise.all([
      loader.loadAsync(`${base}assets/save-slots/empty-game.glb`),
      loader.loadAsync(`${base}assets/save-slots/saved-game.glb`),
    ]).then(([empty, saved]) => {
      this.models.empty = empty.scene;
      this.models.saved = saved.scene;
      for (let slotId = 0; slotId < SAVE_SLOT_COUNT; slotId++) {
        const card = this.grid.querySelector<HTMLElement>(`[data-slot="${slotId}"]`);
        const isSaved = card?.classList.contains('has-save') === true;
        this.syncPreviewModel(slotId, isSaved);
      }
      // Asset loading can finish after the menu opens. Start the preview's
      // frontal hold only once the models are actually ready to be seen.
      this.previewStartedAt = performance.now();
      for (const group of this.previewGroups) group.rotation.set(0, 0, 0);
      this.renderFrame(performance.now(), true);
    }).catch((error: unknown) => {
      console.error('[SaveSlots] Could not load the save-book models.', error);
      this.grid.querySelectorAll<HTMLElement>('.save-slot-model-loading').forEach((node) => { node.textContent = 'Modelo no disponible'; });
    }).finally(() => { this.modelLoads = null; });
    return this.modelLoads;
  }

  private syncPreviewModel(slotId: number, hasSave: boolean): void {
    const group = this.previewGroups[slotId];
    if (!group) return;
    const existing = group.children[0];
    if (existing) group.remove(existing);
    const source = hasSave ? this.models.saved : this.models.empty;
    if (!source) return;
    const book = source.clone(true);
    book.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(book);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z, 0.001);
    const scale = 1.28 / maxSize;
    book.scale.setScalar(scale);
    book.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    book.rotation.x = -0.18;
    group.add(book);
    const frame = this.grid.querySelector<HTMLElement>(`[data-preview="${slotId}"]`);
    frame?.querySelector('.save-slot-model-loading')?.remove();
  }

  private startRenderLoop(): void {
    if (!this.renderer || this.frameId) return;
    const tick = (time: number): void => {
      if (!this.isOpen()) { this.frameId = 0; return; }
      if (time - this.lastFrameAt >= 33) {
        if (this.levelProgressOpen) {
          const delta = Math.min(0.08, Math.max(0, (time - this.levelProgressLastFrame) / 1000));
          this.levelProgressLastFrame = time;
          this.levelProgressElapsed += delta;
          this.levelGekkoMixer?.update(delta);
          if (this.levelCoinModel) this.levelCoinModel.rotation.y += delta * 0.42;
          if (this.levelCoinCountFinished && this.levelCoinComplete) {
            const shimmerDuration = 1.2;
            this.levelCoinGlowElapsed = Math.min(shimmerDuration, this.levelCoinGlowElapsed + delta);
            const shimmer = Math.sin(Math.PI * this.levelCoinGlowElapsed / shimmerDuration);
            this.levelCoinGlowMaterials.forEach(({ material, emissive, intensity }) => {
              material.emissive.copy(emissive).lerp(this.levelCoinGlowColor, shimmer * 0.55);
              material.emissiveIntensity = intensity + shimmer * 0.42;
            });
          }
          this.levelKeyModels.forEach((model) => {
            if (model.visible && model.userData.rotateWhenRevealed === true) model.rotation.y = (model.rotation.y + delta * 0.42) % (Math.PI * 2);
          });
          this.renderLevelProgressFrame();
        } else this.renderFrame(time);
      }
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  private renderFrame(time: number, force = false): void {
    if (!this.renderer || !this.isOpen()) return;
    if (this.levelProgressOpen) { this.renderLevelProgressFrame(); return; }
    if (!force && time - this.lastFrameAt < 32) return;
    this.lastFrameAt = time;
    const width = Math.max(1, this.grid.clientWidth);
    const height = Math.max(1, this.grid.clientHeight);
    this.renderer.setSize(width, height, false);
    const canvasRect = this.canvas.getBoundingClientRect();
    this.renderer.setScissorTest(true);
    this.renderer.clear(true, true, true);
    for (let slotId = 0; slotId < SAVE_SLOT_COUNT; slotId++) {
      const frame = this.grid.querySelector<HTMLElement>(`[data-preview="${slotId}"]`);
      const rect = frame?.getBoundingClientRect();
      if (!rect || rect.width < 2 || rect.height < 2) continue;
      const x = rect.left - canvasRect.left;
      const y = canvasRect.bottom - rect.bottom;
      this.renderer.setViewport(x, y, rect.width, rect.height);
      this.renderer.setScissor(x, y, rect.width, rect.height);
      this.camera.aspect = rect.width / rect.height;
      // Each scissored viewport shows one card. Aim at that slot's world-space
      // group so all three books stay framed instead of clipping the outer two.
      const targetX = this.previewGroups[slotId]!.position.x;
      this.camera.position.x = targetX + 0.4;
      this.camera.lookAt(targetX, 0, 0);
      this.camera.updateProjectionMatrix();
      // Start square-on for a readable view of the book, then rotate slowly
      // through a full 360°. A shared elapsed time avoids random per-slot poses.
      const elapsed = Math.max(0, time - this.previewStartedAt - 900);
      this.previewGroups[slotId]!.rotation.y = elapsed * 0.00006;
      this.previewGroups[slotId]!.rotation.z = Math.sin(elapsed * 0.00045) * 0.025;
      this.renderer.render(this.scene, this.camera);
    }
  }

  private renderLevelProgressFrame(): void {
    if (!this.renderer || !this.levelProgressPanel || !this.levelProgressOpen) return;
    const width = Math.max(1, this.levelProgressPanel.clientWidth);
    const height = Math.max(1, this.levelProgressPanel.clientHeight);
    if (width !== this.levelProgressWidth || height !== this.levelProgressHeight) {
      this.renderer.setSize(width, height, false);
      this.levelProgressWidth = width;
      this.levelProgressHeight = height;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    const viewHeight = 2 * this.camera.position.z * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));
    const viewWidth = viewHeight * this.camera.aspect;
    const panelRect = this.levelProgressPanel.getBoundingClientRect();
    const placeFitted = (model: THREE.Group, x: number, y: number, z: number, displayHeight: number): void => {
      const fit = this.levelPreviewFits.get(model);
      if (!fit) return;
      const scale = fit.normalization * (displayHeight / fit.targetHeight);
      model.scale.setScalar(scale);
      model.position.set(x - fit.center.x * scale, y - fit.center.y * scale, z - fit.center.z * scale);
    };
    if (this.levelGekko) {
      // Fit Gekko into a dedicated responsive screen-space lane. Its complete
      // rotated bounds set the scale, keeping tail, hat, and feet inside the
      // left column and clear of the center and bottom controls.
      const gekkoDepth = 6;
      const lane = this.levelProgressPanel.querySelector<HTMLElement>('.level-progress-gecko-lane');
      const fit = this.levelPreviewFits.get(this.levelGekko);
      if (lane && fit) {
        const rect = lane.getBoundingClientRect();
        const depthScale = (this.camera.position.z - gekkoDepth) / this.camera.position.z;
        // The GLB's authored origin is offset from its rotated visual bounds.
        // Nudge the fitted silhouette back into the left lane so its tail and
        // head share the reference column instead of clipping past the panel.
        const centerX = rect.left + rect.width * 0.67 - panelRect.left;
        const centerY = rect.top + rect.height * 0.5 - panelRect.top;
        const x = (centerX / width - 0.5) * viewWidth * depthScale;
        const y = (0.5 - centerY / height) * viewHeight * depthScale;
        const heightLimit = rect.height / height * viewHeight * depthScale;
        const widthLimit = rect.width / width * viewWidth * depthScale;
        // Scale the full model to the left reference box (not just move its
        // center): use nearly the available fitted height while retaining a
        // small safety margin for the tail, hat, and feet.
        const displayHeight = Math.min(heightLimit, widthLimit, viewHeight * 0.5) * 1.17;
        placeFitted(this.levelGekko, x, y, gekkoDepth, displayHeight);
      }
    }
    this.levelKeyModels.forEach((model, index) => {
      const id = LEVEL_PROGRESS_KEY_IDS[index];
      const anchor = id && this.levelProgressPanel?.querySelector<HTMLElement>(`[data-key="${id}"] .level-key-model`);
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const depth = 0.3 + index * 0.01;
      const depthScale = (this.camera.position.z - depth) / this.camera.position.z;
      const centerX = rect.left + rect.width * 0.5 - panelRect.left;
      const centerY = rect.top + rect.height * 0.5 - panelRect.top;
      const x = (centerX / width - 0.5) * viewWidth * depthScale;
      const y = (0.5 - centerY / height) * viewHeight * depthScale;
      const displayHeight = Math.min(viewHeight * 0.22, viewWidth * 0.13, rect.height / height * viewHeight * depthScale * 0.92);
      placeFitted(model, x, y, depth, displayHeight);
      const revealStartedAt = model.userData.revealStartedAt as number | undefined;
      if (model.visible && revealStartedAt !== undefined) {
        const progress = Math.min(1, Math.max(0, (performance.now() - revealStartedAt) / 360));
        const easeOut = 1 - Math.pow(1 - progress, 3);
        model.scale.multiplyScalar(0.72 + 0.28 * easeOut);
        if (progress >= 1) delete model.userData.revealStartedAt;
      }
    });
    const coinAnchor = this.levelProgressPanel.querySelector<HTMLElement>('.level-coin-model');
    if (this.levelCoinModel && coinAnchor) {
      const rect = coinAnchor.getBoundingClientRect();
      const depth = 0.25;
      const depthScale = (this.camera.position.z - depth) / this.camera.position.z;
      const centerX = rect.left + rect.width * 0.5 - panelRect.left;
      const centerY = rect.top + rect.height * 0.5 - panelRect.top;
      const x = (centerX / width - 0.5) * viewWidth * depthScale;
      const y = (0.5 - centerY / height) * viewHeight * depthScale;
      const displayHeight = Math.min(viewHeight * 0.24, viewWidth * 0.2, rect.height / height * viewHeight * depthScale * 0.98);
      placeFitted(this.levelCoinModel, x, y, depth, displayHeight);
      const glow = this.levelProgressPanel.querySelector<HTMLElement>('.level-progress-completion-glow');
      if (glow) {
        glow.style.left = `${centerX}px`;
        glow.style.top = `${centerY}px`;
        glow.style.width = `${Math.max(rect.width, rect.height) * 1.9}px`;
        glow.style.transform = 'translate(-50%, -50%)';
      }
    }
    this.renderer.setScissorTest(false);
    this.renderer.clear(true, true, true);
    this.renderer.render(this.scene, this.camera);
  }


  private handleKeydown(event: KeyboardEvent): void {
    if (this.isOpen() && event.key === 'Escape') {
      event.preventDefault();
      if (this.levelProgressOpen) return;
      if (!this.confirmPanel.classList.contains('hidden')) this.hideConfirmation();
      else this.close(true);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const buttons = Array.from(this.screen.querySelectorAll<HTMLButtonElement>('button:not(:disabled):not(.hidden)'))
      .filter((button) => !button.closest('.hidden, .is-review-hidden') && button.getClientRects().length > 0);
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0 || buttons.length === 0) return;
    event.preventDefault();
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? current + 1 : current - 1;
    buttons[(next + buttons.length) % buttons.length]?.focus();
  }
}
