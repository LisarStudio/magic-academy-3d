import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { deleteSaveSlot, getSaveSlots, SAVE_SLOT_COUNT } from '../core/SaveSlotStore';
import { formatPlayTime, getSaveProgress } from '../core/GameProgress';

export type SaveSlotMenuMode = 'continue' | 'new' | 'save' | 'load';
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
  private mode: SaveSlotMenuMode = 'continue';
  private action: SlotAction = () => undefined;
  private onBack: () => void = () => undefined;
  private pendingConfirmation: { type: 'overwrite' | 'delete'; slotId: number } | null = null;
  private readonly resizeHandler = (): void => { if (this.isOpen()) this.renderFrame(performance.now(), true); };

  constructor() {
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
      this.scene.add(new THREE.AmbientLight(0xffe4bb, 2.25));
      const keyLight = new THREE.DirectionalLight(0xffc66e, 3.2);
      keyLight.position.set(-2, 4, 5);
      this.scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0x8ba8ff, 1.1);
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
    this.screen.classList.add('hidden');
    document.getElementById('pause-screen')?.classList.remove('save-slot-paused');
    this.hideConfirmation();
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    if (notify) this.onBack();
  }

  public isOpen(): boolean { return !this.screen.classList.contains('hidden'); }

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
      if (time - this.lastFrameAt >= 33) this.renderFrame(time);
      this.frameId = requestAnimationFrame(tick);
    };
    this.frameId = requestAnimationFrame(tick);
  }

  private renderFrame(time: number, force = false): void {
    if (!this.renderer || !this.isOpen()) return;
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
      this.previewGroups[slotId]!.rotation.y = Math.sin(time * 0.00036 + slotId * 0.72) * 0.28 + (time * 0.00006);
      this.previewGroups[slotId]!.rotation.z = Math.sin(time * 0.00045 + slotId) * 0.025;
      this.renderer.render(this.scene, this.camera);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (this.isOpen() && event.key === 'Escape') {
      event.preventDefault();
      if (!this.confirmPanel.classList.contains('hidden')) this.hideConfirmation();
      else this.close(true);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const buttons = Array.from(this.screen.querySelectorAll<HTMLButtonElement>('button:not(:disabled):not(.hidden)'));
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0 || buttons.length === 0) return;
    event.preventDefault();
    const next = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? current + 1 : current - 1;
    buttons[(next + buttons.length) % buttons.length]?.focus();
  }
}
