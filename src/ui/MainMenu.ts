export type MenuState = 'Loading' | 'Intro' | 'MenuIdle' | 'StartingGame' | 'Playing';
export type StartMode = 'new' | 'continue';

export interface MenuPreferences {
  music: number;
  effects: number;
  quality: number;
}

interface MainMenuCallbacks {
  onStateChange: (state: MenuState) => void;
  onStartIntroMusic: () => Promise<boolean>;
  onBeginTransition: (mode: StartMode) => void;
  onTransitionComplete: (mode: StartMode) => void;
  onPreferences: (preferences: MenuPreferences) => void;
  onSelect: () => void;
}

const SAVE_KEY = 'lisar_savegame';
const PREFERENCES_KEY = 'lisar_menu_preferences_v1';

export class MainMenu {
  private readonly callbacks: MainMenuCallbacks;
  private readonly introVideo = document.getElementById('intro-video') as HTMLVideoElement;
  private readonly idleVideo = document.getElementById('idle-video') as HTMLVideoElement;
  private readonly startVideo = document.getElementById('start-video') as HTMLVideoElement;
  private readonly loadingPanel = document.getElementById('loading-panel')!;
  private readonly startIntroButton = document.getElementById('btn-start-intro') as HTMLButtonElement;
  private readonly mainMenu = document.getElementById('main-menu')!;
  private readonly dialog = document.getElementById('menu-dialog')!;
  private readonly dialogTitle = document.getElementById('dialog-title')!;
  private readonly optionsContent = document.getElementById('options-content')!;
  private readonly creditsContent = document.getElementById('credits-content')!;
  private readonly creditsActions = document.querySelector('.credits-actions')!;
  private readonly confirmContent = document.getElementById('confirm-content')!;
  private readonly dialogError = document.getElementById('dialog-error')!;
  private readonly continueButton = document.getElementById('btn-continue') as HTMLButtonElement;
  private readonly newGameButton = document.getElementById('btn-new-game') as HTMLButtonElement;
  private readonly menuButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.menu-actions button'));
  private state: MenuState = 'Loading';
  private startMode: StartMode = 'new';
  private preferences: MenuPreferences = { music: 0.5, effects: 0.8, quality: 0.85 };
  private errorRetry: (() => void) | null = null;
  private loadingRetry: () => void = () => window.location.reload();
  private transitionStarted = false;
  private startVideoReady = false;
  private startVideoFailed = false;
  private startVideoPreparation: Promise<void> | null = null;
  private introStartPending = false;
  private introFallbackStarted = false;

  constructor(callbacks: MainMenuCallbacks) {
    this.callbacks = callbacks;
    const base = import.meta.env.BASE_URL;
    this.introVideo.src = `${base}assets/cinematics/wukong-intro.mp4`;
    this.idleVideo.src = `${base}assets/cinematics/wukong-menu-idle.mp4`;
    this.idleVideo.loop = true;
    this.startVideo.preload = 'auto';
    this.startVideo.src = `${base}assets/cinematics/wukong-start.mp4`;
    this.loadPreferences();
    this.bindEvents();
    this.startIntroButton.addEventListener('click', () => void this.playIntro(true));
    this.refreshContinueButton();
    document.getElementById('project-version')!.textContent = `Versión ${__APP_VERSION__}`;
  }

  private setState(state: MenuState): void {
    this.state = state;
    this.callbacks.onStateChange(state);
  }

  public setLoadingProgress(loaded: number, total: number, asset?: string): void {
    const bar = document.getElementById('loading-progress')!;
    const percent = document.getElementById('loading-percent')!;
    const status = document.getElementById('loading-status')!;
    const ratio = total > 0 ? Math.max(0, Math.min(1, loaded / total)) : 0;
    bar.style.width = `${Math.round(ratio * 100)}%`;
    percent.textContent = total > 0 ? `${Math.round(ratio * 100)}%` : 'Cargando…';
    if (asset) status.textContent = `Cargando ${this.friendlyAssetName(asset)}…`;
  }

  private friendlyAssetName(url: string): string {
    const name = decodeURIComponent(url.split('/').pop()?.split('?')[0] || 'recursos');
    if (/wukong|player/i.test(name)) return 'a Wukong';
    if (/fbx|idle|run|jump/i.test(name)) return 'las animaciones';
    return 'los recursos';
  }

  public async playIntro(userInitiated = false): Promise<void> {
    if (this.introStartPending || this.state === 'Intro') return;
    this.introStartPending = true;
    try {
      this.setState('Loading');
      const audioStart = this.callbacks.onStartIntroMusic();

      // On a Comenzar tap, start audio and video before yielding the browser's
      // user activation. Awaiting audio first can make the video play() reject.
      if (userInitiated) {
        const videoStart = this.startIntroVideo();
        const [audioStarted] = await Promise.all([audioStart, videoStart.then(() => true)]);
        if (!audioStarted) this.showIntroStartPrompt();
        return;
      }

      const audioStarted = await audioStart;
      if (!audioStarted) {
        this.showIntroStartPrompt();
        return;
      }
      await this.startIntroVideo();
    } catch {
      // Intro playback is optional; continue into the menu instead of showing
      // a dead-end loading error if a browser blocks or cannot decode the clip.
      this.skipUnavailableIntro();
    } finally {
      this.introStartPending = false;
    }
  }

  private startIntroVideo(): Promise<void> {
    this.introFallbackStarted = false;
    this.startIntroButton.classList.add('hidden');
    this.loadingPanel.classList.add('hidden');
    this.mainMenu.classList.add('hidden');
    this.introVideo.currentTime = 0;
    this.introVideo.onended = () => void this.enterMenuIdle();
    this.introVideo.onerror = () => this.skipUnavailableIntro();
    this.introVideo.classList.add('is-visible');
    this.setState('Intro');
    return this.introVideo.play();
  }

  private showIntroStartPrompt(): void {
    this.introVideo.pause();
    this.introVideo.classList.remove('is-visible');
    this.mainMenu.classList.add('hidden');
    this.loadingPanel.classList.remove('hidden');
    document.getElementById('loading-status')!.textContent = 'Todo está listo. Pulsa Comenzar para iniciar la aventura con música.';
    document.getElementById('loading-percent')!.textContent = 'Listo';
    document.getElementById('loading-progress')!.style.width = '100%';
    document.getElementById('btn-retry-loading')!.classList.add('hidden');
    this.startIntroButton.classList.remove('hidden');
    this.setState('Loading');
  }

  private skipUnavailableIntro(): void {
    if (this.state !== 'Intro' || this.introFallbackStarted) return;
    this.introFallbackStarted = true;
    this.introVideo.pause();
    this.introVideo.classList.remove('is-visible');
    void this.enterMenuIdle();
  }

  private async enterMenuIdle(): Promise<void> {
    if (this.state !== 'Intro') return;
    this.idleVideo.currentTime = 0;
    try {
      await this.idleVideo.play();
      this.idleVideo.classList.add('is-visible');
      this.introVideo.classList.remove('is-visible');
      this.mainMenu.classList.remove('hidden');
      this.refreshContinueButton();
      this.setState('MenuIdle');
      void this.prepareStartVideo().catch(() => undefined);
      window.setTimeout(() => {
        if (this.state === 'MenuIdle') {
          this.introVideo.pause();
          this.introVideo.currentTime = 0;
        }
      }, 800);
    } catch {
      // Keep the final intro frame behind the menu if the idle preview cannot play.
      this.mainMenu.classList.remove('hidden');
      this.refreshContinueButton();
      this.setState('MenuIdle');
      void this.prepareStartVideo().catch(() => undefined);
    }
  }

  public showLoadingError(message: string, retry: () => void = () => window.location.reload()): void {
    this.loadingRetry = retry;
    this.loadingPanel.classList.remove('hidden');
    this.mainMenu.classList.add('hidden');
    this.introVideo.classList.remove('is-visible');
    this.idleVideo.classList.remove('is-visible');
    document.getElementById('loading-status')!.textContent = message;
    document.getElementById('loading-percent')!.textContent = 'No se pudo completar la carga';
    document.getElementById('loading-progress')!.style.width = '0';
    document.getElementById('btn-retry-loading')!.classList.remove('hidden');
    this.startIntroButton.classList.add('hidden');
    this.setState('Loading');
  }

  private bindEvents(): void {
    this.introVideo.addEventListener('error', () => {
      this.skipUnavailableIntro();
    });
    document.getElementById('btn-retry-loading')!.addEventListener('click', () => this.loadingRetry());
    this.newGameButton.addEventListener('click', () => this.requestStart('new'));
    this.continueButton.addEventListener('click', () => this.requestStart('continue'));
    document.getElementById('btn-options')!.addEventListener('click', () => this.openDialog('options'));
    document.getElementById('btn-credits')!.addEventListener('click', () => this.openDialog('credits'));
    document.getElementById('btn-dialog-close')!.addEventListener('click', () => this.closeDialog());
    document.getElementById('btn-credits-back')!.addEventListener('click', () => this.closeDialog());
    document.getElementById('btn-cancel-new')!.addEventListener('click', () => this.closeDialog());
    document.getElementById('btn-confirm-new')!.addEventListener('click', () => {
      this.closeDialog();
      try { localStorage.removeItem(SAVE_KEY); } catch { /* Storage may be disabled. */ }
      this.refreshContinueButton();
      this.beginTransition('new');
    });

    const retryButton = document.createElement('button');
    retryButton.id = 'btn-dialog-retry';
    retryButton.className = 'dialog-button hidden';
    retryButton.type = 'button';
    retryButton.textContent = 'Reintentar';
    this.dialogError.insertAdjacentElement('afterend', retryButton);
    retryButton.addEventListener('click', () => {
      const retry = this.errorRetry;
      this.closeDialog();
      retry?.();
    });

    document.getElementById('music-volume')!.addEventListener('input', (event) => {
      this.preferences.music = Number((event.target as HTMLInputElement).value);
      this.persistPreferences();
    });
    document.getElementById('sfx-volume')!.addEventListener('input', (event) => {
      this.preferences.effects = Number((event.target as HTMLInputElement).value);
      this.persistPreferences();
    });
    document.getElementById('render-quality')!.addEventListener('change', (event) => {
      this.preferences.quality = Number((event.target as HTMLSelectElement).value);
      this.persistPreferences();
    });

    this.menuButtons.forEach((button) => {
      button.addEventListener('pointerenter', () => this.callbacks.onSelect());
      button.addEventListener('focus', () => this.callbacks.onSelect());
    });

    window.addEventListener('keydown', (event) => {
      if (this.state !== 'MenuIdle') {
        if (event.code === 'Escape' && !this.dialog.classList.contains('hidden')) this.closeDialog();
        return;
      }
      if (!this.dialog.classList.contains('hidden')) {
        if (event.code === 'Escape') { event.preventDefault(); this.closeDialog(); }
        return;
      }
      if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        event.preventDefault();
        const enabled = this.menuButtons.filter((button) => !button.disabled);
        const current = enabled.indexOf(document.activeElement as HTMLButtonElement);
        const step = event.code === 'ArrowDown' ? 1 : -1;
        enabled[(current + step + enabled.length) % enabled.length]?.focus();
      }
      if (event.code === 'Enter' && !this.menuButtons.includes(document.activeElement as HTMLButtonElement)) {
        event.preventDefault();
        this.menuButtons.find((button) => !button.disabled)?.click();
      }
    });

    this.startVideo.addEventListener('ended', () => this.finishTransition());
    this.startVideo.addEventListener('error', () => {
      if (this.state === 'StartingGame') {
        this.recoverStartTransition('No se pudo reproducir la transición. Reintenta para volver a cargar el vídeo.');
      } else {
        this.startVideoFailed = true;
        this.refreshContinueButton();
      }
    });
  }

  private requestStart(mode: StartMode): void {
    if (this.state !== 'MenuIdle' || this.transitionStarted) return;
    if (mode === 'continue') {
      if (!this.hasValidSave()) { this.refreshContinueButton(); return; }
      this.beginTransition('continue');
      return;
    }
    if (this.hasValidSave()) {
      this.openDialog('confirm');
      return;
    }
    this.beginTransition('new');
  }

  private async prepareStartVideo(): Promise<void> {
    if (this.startVideoReady) return;
    if (this.startVideoPreparation) return this.startVideoPreparation;

    this.startVideoFailed = false;
    this.refreshContinueButton();
    this.startVideoPreparation = new Promise<void>((resolve, reject) => {
      let settled = false;
      const cleanup = () => {
        this.startVideo.removeEventListener('loadeddata', onLoadedData);
        this.startVideo.removeEventListener('error', onError);
      };
      const fail = (error: Error) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(error);
      };
      const framePresented = () => {
        if (settled) return;
        settled = true;
        cleanup();
        this.startVideo.pause();
        this.startVideo.currentTime = 0;
        this.startVideoReady = true;
        this.startVideoFailed = false;
        this.refreshContinueButton();
        resolve();
      };
      const onError = () => fail(new Error('Start video could not be loaded.'));
      const onLoadedData = () => {
        if (this.startVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
        if (!this.requestVideoFrameCallback(this.startVideo, framePresented)) {
          requestAnimationFrame(() => framePresented());
        }
        this.startVideo.play().catch((error: unknown) => fail(error instanceof Error ? error : new Error('Start video playback was blocked.')));
      };

      this.startVideo.addEventListener('loadeddata', onLoadedData);
      this.startVideo.addEventListener('error', onError);
      if (this.startVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onLoadedData();
      else this.startVideo.load();
    }).catch((error: unknown) => {
      this.startVideoFailed = true;
      this.startVideo.pause();
      this.startVideo.currentTime = 0;
      this.refreshContinueButton();
      throw error;
    }).finally(() => {
      this.startVideoPreparation = null;
    });

    return this.startVideoPreparation;
  }

  private async beginTransition(mode: StartMode): Promise<void> {
    if (this.transitionStarted) return;
    this.transitionStarted = true;
    this.startMode = mode;
    this.setState('StartingGame');
    this.callbacks.onBeginTransition(mode);
    this.startVideo.currentTime = 0;

    try {
      const firstFrame = this.waitForVideoFrame(this.startVideo);
      await this.startVideo.play();
      await firstFrame;
      if (this.state !== 'StartingGame') return;

      // Keep the levitating menu visible until a decoded start-video frame is presented.
      this.startVideo.classList.add('is-visible');
      this.mainMenu.classList.add('is-leaving');
      await Promise.all([
        this.waitForOpacityTransition(this.startVideo),
        this.waitForOpacityTransition(this.mainMenu)
      ]);
      this.idleVideo.pause();
    } catch {
      this.recoverStartTransition('El vídeo de inicio no pudo prepararse. Reintenta para volver a cargarlo.');
    }
  }

  private waitForVideoFrame(video: HTMLVideoElement): Promise<void> {
    return new Promise((resolve) => {
      if (!this.requestVideoFrameCallback(video, resolve)) {
        video.addEventListener('playing', () => requestAnimationFrame(() => resolve()), { once: true });
      }
    });
  }

  private requestVideoFrameCallback(video: HTMLVideoElement, callback: () => void): boolean {
    const frameVideo = video as unknown as { requestVideoFrameCallback?: (callback: () => void) => number };
    if (typeof frameVideo.requestVideoFrameCallback !== 'function') return false;
    frameVideo.requestVideoFrameCallback(callback);
    return true;
  }

  private waitForOpacityTransition(element: HTMLElement): Promise<void> {
    const duration = getComputedStyle(element).transitionDuration.split(',').reduce((max, value) => {
      const seconds = Number.parseFloat(value) * (value.trim().endsWith('ms') ? 0.001 : 1);
      return Math.max(max, Number.isFinite(seconds) ? seconds : 0);
    }, 0);
    if (duration === 0) return new Promise((resolve) => requestAnimationFrame(() => resolve()));

    return new Promise((resolve) => {
      let finished = false;
      const complete = () => {
        if (finished) return;
        finished = true;
        element.removeEventListener('transitionend', onEnd);
        window.clearTimeout(fallback);
        resolve();
      };
      const onEnd = (event: TransitionEvent) => {
        if (event.target === element && event.propertyName === 'opacity') complete();
      };
      const fallback = window.setTimeout(complete, Math.ceil(duration * 1000) + 50);
      element.addEventListener('transitionend', onEnd);
    });
  }

  private recoverStartTransition(message: string): void {
    if (this.state !== 'StartingGame') return;
    this.transitionStarted = false;
    this.startVideo.pause();
    this.startVideo.classList.remove('is-visible');
    this.mainMenu.classList.remove('is-leaving');
    void this.idleVideo.play();
    this.setState('MenuIdle');
    this.showDialogError(message, () => void this.retryStartTransition(this.startMode));
  }

  private async retryStartTransition(mode: StartMode): Promise<void> {
    this.startVideoReady = false;
    this.startVideoFailed = false;
    this.refreshContinueButton();
    this.startVideo.currentTime = 0;
    try {
      await this.prepareStartVideo();
      await this.beginTransition(mode);
    } catch {
      this.showDialogError('El vídeo de inicio sigue sin estar disponible. Comprueba la conexión e inténtalo otra vez.', () => void this.retryStartTransition(mode));
    }
  }

  private finishTransition(): void {
    if (!this.transitionStarted || this.state !== 'StartingGame') return;
    this.transitionStarted = false;
    try {
      this.callbacks.onTransitionComplete(this.startMode);
    } catch (error) {
      console.error('[MainMenu] Could not enter gameplay after the transition:', error);
      this.transitionStarted = true;
      this.recoverStartTransition('No se pudo iniciar el nivel. Reintenta para volver al juego.');
      return;
    }

    this.setState('Playing');
    document.getElementById('start-screen')!.classList.add('hidden');
    this.introVideo.pause();
    this.idleVideo.pause();
    this.introVideo.classList.remove('is-visible');
    this.idleVideo.classList.remove('is-visible');
    const backdrop = document.getElementById('cinematic-backdrop');
    // The fixed backdrop sits above the WebGL canvas. Make it transparent as the
    // final video frame fades so the already-rendered gameplay appears beneath it.
    backdrop?.classList.add('is-ending');
    if (backdrop) backdrop.style.background = 'transparent';
    this.startVideo.classList.remove('is-visible');
    void this.waitForOpacityTransition(this.startVideo).then(() => {
      this.startVideo.pause();
      backdrop?.classList.add('hidden');
      backdrop?.classList.remove('is-ending');
    });
  }

  private hasValidSave(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw) as { version?: number; playerPos?: { x?: number; y?: number; z?: number }; timestamp?: number };
      const pos = data.playerPos;
      return (data.version === undefined || data.version === 1) &&
        !!pos && [pos.x, pos.y, pos.z].every((value) => typeof value === 'number' && Number.isFinite(value)) &&
        Math.abs(pos.x!) < 10000 && Math.abs(pos.y!) < 10000 && Math.abs(pos.z!) < 10000;
    } catch {
      return false;
    }
  }

  private refreshContinueButton(): void {
    const canContinue = this.hasValidSave();
    const canStart = this.startVideoReady || this.startVideoFailed;
    this.continueButton.disabled = !canContinue || !canStart;
    this.newGameButton.disabled = !canStart;
    this.continueButton.classList.toggle('menu-button-primary', canContinue);
    this.newGameButton.classList.toggle('menu-button-primary', !canContinue);
  }

  private openDialog(view: 'options' | 'credits' | 'confirm'): void {
    this.callbacks.onSelect();
    this.dialog.querySelector('.dialog-card')?.classList.toggle('credits-open', view === 'credits');
    this.optionsContent.classList.toggle('hidden', view !== 'options');
    this.creditsContent.classList.toggle('hidden', view !== 'credits');
    this.creditsActions.classList.toggle('hidden', view !== 'credits');
    this.confirmContent.classList.toggle('hidden', view !== 'confirm');
    this.dialogTitle.textContent = view === 'options' ? 'Opciones' : view === 'credits' ? 'Créditos' : 'Nueva partida';
    this.dialogError.classList.add('hidden');
    document.getElementById('btn-dialog-retry')?.classList.add('hidden');
    this.dialog.classList.remove('hidden');
    if (view === 'options') this.syncPreferenceControls();
    (this.dialog.querySelector('button:not(.hidden)') as HTMLButtonElement | null)?.focus();
  }

  private closeDialog(): void {
    this.dialog.classList.add('hidden');
    this.dialogError.classList.add('hidden');
    document.getElementById('btn-dialog-retry')?.classList.add('hidden');
    document.getElementById('btn-new-game')?.focus();
  }

  private showDialogError(message: string, retry: () => void): void {
    this.openDialog('options');
    this.optionsContent.classList.add('hidden');
    this.dialogTitle.textContent = 'No se pudo iniciar';
    this.dialogError.textContent = message;
    this.dialogError.classList.remove('hidden');
    document.getElementById('btn-dialog-retry')?.classList.remove('hidden');
    this.errorRetry = retry;
  }

  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<MenuPreferences>;
        this.preferences = {
          music: this.clamp(parsed.music, 0.5),
          effects: this.clamp(parsed.effects, 0.8),
          quality: [0.65, 0.85, 1].includes(Number(parsed.quality)) ? Number(parsed.quality) : 0.85
        };
      }
    } catch { /* Use safe defaults when local storage is unavailable. */ }
    this.callbacks.onPreferences(this.preferences);
    this.syncPreferenceControls();
  }

  private clamp(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
  }

  private syncPreferenceControls(): void {
    (document.getElementById('music-volume') as HTMLInputElement).value = String(this.preferences.music);
    (document.getElementById('sfx-volume') as HTMLInputElement).value = String(this.preferences.effects);
    (document.getElementById('render-quality') as HTMLSelectElement).value = String(this.preferences.quality);
  }

  private persistPreferences(): void {
    this.callbacks.onPreferences(this.preferences);
    try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences)); } catch { /* Preferences still apply for this session. */ }
  }
}
