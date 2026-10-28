import { getControlModePreference, setControlModePreference, type ControlModePreference } from '../core/ControlMode';

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
  onTransitionComplete: (mode: StartMode) => Promise<void> | void;
  onPreferences: (preferences: MenuPreferences) => void;
  onSelect: () => void;
}

const SAVE_KEY = 'lisar_savegame';
const PREFERENCES_KEY = 'lisar_menu_preferences_v2';
const LEGACY_PREFERENCES_KEY = 'lisar_menu_preferences_v1';

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
  private preferences: MenuPreferences = { music: 0.5, effects: 0.8, quality: 1 };
  private errorRetry: (() => void) | null = null;
  private loadingRetry: () => void = () => window.location.reload();
  private transitionStarted = false;
  private startVideoReady = false;
  private startVideoPreparation: Promise<void> | null = null;
  private loadingTipTimer = 0;
  private loadingTipIndex = 0;
  private readonly loadingTips = [
    'Pulsa Acción junto al cofre para recoger el Báculo.',
    'Golpe ataca; con el Báculo usarás nuevos movimientos.',
    'Esquiva el ataque anunciado del cangrejo y contraataca.',
    'Encuentra llaves para abrir cerraduras antiguas.',
    'Ayuda a Gekko para conseguir monedas.'
  ];
  private introStartPending = false;
  private introFallbackStarted = false;

  constructor(callbacks: MainMenuCallbacks) {
    this.callbacks = callbacks;
    const base = import.meta.env.BASE_URL;
    const mobileMedia = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    const introPath = mobileMedia
      ? 'assets/cinematics/optimized/wukong-intro-mobile.mp4'
      : 'assets/cinematics/optimized/wukong-intro-desktop.mp4';
    const idlePath = mobileMedia
      ? 'assets/cinematics/optimized/wukong-menu-idle-mobile.mp4'
      : 'assets/cinematics/optimized/wukong-menu-idle-desktop.mp4';
    this.introVideo.setAttribute('fetchpriority', 'high');
    this.introVideo.src = `${base}${introPath}?v=${__APP_VERSION__}`;
    this.idleVideo.preload = 'none';
    this.idleVideo.src = `${base}${idlePath}?v=${__APP_VERSION__}`;
    this.idleVideo.loop = true;
    this.startVideo.preload = 'none';
    this.startVideo.src = `${base}assets/cinematics/wukong-start.mp4?v=${__APP_VERSION__}`;
    this.introVideo.addEventListener('progress', () => this.updateIntroProgress());
    this.introVideo.addEventListener('loadedmetadata', () => this.updateIntroProgress());
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
    bar.classList.remove('loading-progress-indeterminate');
    bar.style.width = `${Math.round(ratio * 100)}%`;
    percent.textContent = total > 0 ? `${Math.round(ratio * 100)}%` : 'Cargando…';
    if (asset) status.textContent = `Cargando ${this.friendlyAssetName(asset)}…`;
  }

  public setStartupLoadingStatus(message: string): void {
    document.getElementById('loading-status')!.textContent = message;
    const progress = document.getElementById('loading-progress')!;
    progress.style.width = '';
    progress.classList.add('loading-progress-indeterminate');
    document.getElementById('loading-percent')!.textContent = 'Preparando…';
  }

  /** Mobile browsers may defer video downloads until a user gesture. Offer the
   * gesture immediately so startup never waits on a preload that Safari/iOS
   * is allowed to postpone indefinitely. The actual cinematic still starts
   * only after both the music and its first decoded frame are ready. */
  public showMobileIntroGate(): void {
    if (this.state !== 'Loading') return;
    this.loadingPanel.classList.remove('hidden');
    this.loadingPanel.classList.remove('is-dismissing');
    this.mainMenu.classList.add('hidden');
    this.startIntroButton.textContent = 'Comenzar';
    this.startIntroButton.classList.remove('hidden');
    document.getElementById('btn-retry-loading')!.classList.add('hidden');
    document.getElementById('loading-status')!.textContent = 'Toca Comenzar para preparar y reproducir la introducción.';
    document.getElementById('loading-percent')!.textContent = 'Listo para iniciar';
    const progress = document.getElementById('loading-progress')!;
    progress.classList.add('loading-progress-indeterminate');
    progress.style.width = '';
  }

  private updateIntroProgress(): void {
    if (this.state !== 'Loading') return;
    const video = this.introVideo;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0 || video.buffered.length === 0) return;
    const buffered = video.buffered.end(video.buffered.length - 1);
    const percent = Math.round(Math.max(0, Math.min(1, buffered / duration)) * 100);
    const bar = document.getElementById('loading-progress')!;
    bar.classList.remove('loading-progress-indeterminate');
    bar.style.width = `${percent}%`;
    document.getElementById('loading-status')!.textContent = 'Preparando la introducción…';
    document.getElementById('loading-percent')!.textContent = `${percent}% del video disponible`;
  }

  public prepareIntroVideo(): Promise<void> {
    return this.waitForVideoData(this.introVideo, 'La_leyenda_de_Wukong_Intro');
  }

  public showInGameLoading(): void {
    const screen = document.getElementById('in-game-loading');
    if (!screen) return;
    document.getElementById('btn-retry-in-game-loading')?.classList.add('hidden');
    const video = document.getElementById('in-game-loading-video') as HTMLVideoElement | null;
    const base = import.meta.env.BASE_URL;
    screen.querySelectorAll<HTMLImageElement>('img[data-loading-src]').forEach((image) => {
      image.fetchPriority = 'low';
      image.src = `${base}${image.dataset.loadingSrc}?v=${__APP_VERSION__}`;
      delete image.dataset.loadingSrc;
    });
    if (video) {
      const poster = `${base}assets/ui/wukong-loading-poster.webp?v=${__APP_VERSION__}`;
      video.poster = poster;
      // Let the transformed video element display its own poster, so its fallback
      // framing matches the live animation and never puts Wukong back under the UI.
      screen.style.backgroundImage = 'none';
      video.setAttribute('fetchpriority', 'low');
      if (!video.src.includes('wukong-loading-background-optimized.mp4')) {
        video.src = `${base}assets/ui/wukong-loading-background-optimized.mp4?v=${__APP_VERSION__}`;
        video.load();
      }
      void video.play().catch(() => { /* Keep the Blender-rendered poster visible. */ });
    }
    this.setInGameLoadingIndeterminate('Preparando a Wukong y el reino…');
    this.loadingTipIndex = Math.floor(Math.random() * this.loadingTips.length);
    this.updateLoadingTip();
    window.clearInterval(this.loadingTipTimer);
    this.loadingTipTimer = window.setInterval(() => this.updateLoadingTip(), 5000);
    screen.classList.remove('hidden');
    screen.classList.add('is-visible');
  }

  public setInGameLoadingProgress(loaded: number, total: number, asset?: string, phase = 'Cargando recursos'): void {
    const bar = document.getElementById('in-game-loading-progress');
    const label = document.getElementById('in-game-loading-status');
    const count = document.getElementById('in-game-loading-count');
    if (!bar || !label || !count) return;
    if (total <= 0) {
      this.setInGameLoadingIndeterminate(phase);
      return;
    }
    const ratio = Math.max(0, Math.min(1, loaded / total));
    bar.classList.remove('is-indeterminate');
    bar.style.width = `${Math.round(ratio * 100)}%`;
    bar.parentElement?.parentElement?.setAttribute('aria-valuenow', `${Math.round(ratio * 100)}`);
    label.textContent = asset ? `${phase}: ${this.friendlyAssetName(asset)}` : phase;
    count.textContent = `${loaded} de ${total} recursos`;
  }

  public setInGameLoadingIndeterminate(message: string): void {
    const bar = document.getElementById('in-game-loading-progress');
    if (bar) {
      bar.classList.add('is-indeterminate');
      bar.style.width = '';
    }
    bar?.parentElement?.parentElement?.removeAttribute('aria-valuenow');
    const label = document.getElementById('in-game-loading-status');
    if (label) label.textContent = message;
    const count = document.getElementById('in-game-loading-count');
    if (count) count.textContent = 'Preparando la partida…';
  }

  public async completeInGameLoading(): Promise<void> {
    const bar = document.getElementById('in-game-loading-progress');
    if (bar) {
      bar.classList.remove('is-indeterminate');
      bar.style.width = '100%';
    }
    bar?.parentElement?.parentElement?.setAttribute('aria-valuenow', '100');
    const label = document.getElementById('in-game-loading-status');
    if (label) label.textContent = 'Partida lista';
    const count = document.getElementById('in-game-loading-count');
    if (count) count.textContent = 'Recursos esenciales preparados';
    const screen = document.getElementById('in-game-loading');
    if (!screen) return;
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    screen.classList.remove('is-visible');
    await new Promise<void>((resolve) => window.setTimeout(resolve, 280));
    screen.classList.add('hidden');
    window.clearInterval(this.loadingTipTimer);
    (document.getElementById('in-game-loading-video') as HTMLVideoElement | null)?.pause();
  }

  public failInGameLoading(message: string): void {
    const status = document.getElementById('in-game-loading-status');
    if (status) status.textContent = message;
    document.getElementById('btn-retry-in-game-loading')?.classList.remove('hidden');
    window.clearInterval(this.loadingTipTimer);
  }

  private updateLoadingTip(): void {
    const tip = document.getElementById('in-game-loading-tip');
    if (!tip) return;
    const offset = 1 + Math.floor(Math.random() * (this.loadingTips.length - 1));
    this.loadingTipIndex = (this.loadingTipIndex + offset) % this.loadingTips.length;
    tip.textContent = this.loadingTips[this.loadingTipIndex];
  }

  private loadOfficialMenuLogo(): void {
    const logo = document.querySelector<HTMLImageElement>('.wukong-logo');
    const path = logo?.dataset.menuLogo;
    if (!logo || !path || logo.src) return;
    logo.fetchPriority = 'low';
    logo.src = `${import.meta.env.BASE_URL}${path}?v=${__APP_VERSION__}`;
    delete logo.dataset.menuLogo;
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
    } catch (error) {
      const mediaError = error instanceof Error ? error : new Error(String(error));
      console.error('[MainMenu] Intro playback failed:', this.describeVideoFailure(this.introVideo, mediaError));
      if (mediaError.name === 'NotAllowedError') this.showIntroStartPrompt();
      else this.handleIntroMediaError();
    } finally {
      this.introStartPending = false;
    }
  }

  private async startIntroVideo(): Promise<void> {
    this.introFallbackStarted = false;
    this.startIntroButton.classList.add('hidden');
    this.mainMenu.classList.add('hidden');
    this.introVideo.currentTime = 0;
    this.introVideo.onended = () => void this.enterMenuIdle();
    this.introVideo.onerror = () => this.handleIntroMediaError();
    this.introVideo.classList.add('is-visible');
    this.setState('Intro');
    // Calling play() from the Comenzar gesture also starts the media request on
    // mobile Safari, where preload="auto" is only a hint and may be ignored.
    await this.introVideo.play();
    await this.waitForVideoFrame(this.introVideo);
    this.loadingPanel.classList.add('is-dismissing');
    await this.waitForOpacityTransition(this.loadingPanel);
    this.loadingPanel.classList.add('hidden');
    this.loadingPanel.classList.remove('is-dismissing');
  }

  private showIntroStartPrompt(): void {
    this.introVideo.pause();
    this.introVideo.currentTime = 0;
    this.introVideo.classList.add('is-visible');
    this.mainMenu.classList.add('hidden');
    this.loadingPanel.classList.remove('hidden');
    this.loadingPanel.classList.remove('is-dismissing');
    document.getElementById('loading-status')!.textContent = 'Todo está listo. Pulsa Comenzar para iniciar la aventura con música.';
    document.getElementById('loading-percent')!.textContent = 'Listo';
    const progress = document.getElementById('loading-progress')!;
    progress.classList.remove('loading-progress-indeterminate');
    progress.style.width = '100%';
    document.getElementById('btn-retry-loading')!.classList.add('hidden');
    this.startIntroButton.classList.remove('hidden');
    this.setState('Loading');
  }

  private handleIntroMediaError(): void {
    if (this.state !== 'Intro' || this.introFallbackStarted) return;
    this.introFallbackStarted = true;
    console.error('[MainMenu] Intro media error:', this.describeVideoFailure(this.introVideo));
    this.introVideo.pause();
    this.showLoadingError('No se pudo cargar la intro. Revisa la conexión e inténtalo otra vez.', () => {
      this.introFallbackStarted = false;
      this.introVideo.load();
      // Keep Retry's tap as the gesture that calls play(); do not await a
      // preload that mobile browsers may defer until that same gesture.
      void this.playIntro(true);
    });
  }

  private async enterMenuIdle(): Promise<void> {
    if (this.state !== 'Intro') return;
    this.idleVideo.currentTime = 0;
    try {
      await this.idleVideo.play();
      await this.waitForVideoFrame(this.idleVideo);
      this.idleVideo.classList.add('is-visible');
      this.introVideo.classList.remove('is-visible');
      document.getElementById('cinematic-backdrop')?.classList.add('is-menu-idle');
      this.loadOfficialMenuLogo();
      this.mainMenu.classList.remove('hidden');
      this.setState('MenuIdle');
      this.refreshContinueButton();
      void this.prepareStartVideo().catch((error: unknown) => {
        console.error('[MainMenu] Start-video preparation failed:', this.describeVideoFailure(this.startVideo, error));
        this.showDialogError('No se pudo preparar la transición. Reintenta para volver a cargarla.', () => void this.retryStartTransition('new'));
      });
      window.setTimeout(() => {
        if (this.state === 'MenuIdle') {
          this.introVideo.pause();
          this.introVideo.currentTime = 0;
        }
      }, 800);
    } catch (error) {
      console.error('[MainMenu] Menu-idle playback failed:', this.describeVideoFailure(this.idleVideo, error));
      this.showLoadingError('No se pudo reproducir el fondo animado del menú. Reintenta para volver a cargarlo.', () => void this.retryMenuIdleVideo());
    }
  }

  private async retryMenuIdleVideo(): Promise<void> {
    this.idleVideo.pause();
    this.idleVideo.load();
    try {
      await this.waitForVideoData(this.idleVideo, 'MenuIdle_3x_preview');
      await this.idleVideo.play();
      await this.waitForVideoFrame(this.idleVideo);
      this.idleVideo.classList.add('is-visible');
      this.introVideo.classList.remove('is-visible');
      document.getElementById('cinematic-backdrop')?.classList.add('is-menu-idle');
      this.loadOfficialMenuLogo();
      this.loadingPanel.classList.add('hidden');
      this.mainMenu.classList.remove('hidden');
      this.setState('MenuIdle');
      this.refreshContinueButton();
      void this.prepareStartVideo().catch((retryError: unknown) => {
        console.error('[MainMenu] Start-video retry failed:', this.describeVideoFailure(this.startVideo, retryError));
        this.showDialogError('No se pudo preparar la transición. Reintenta para volver a cargarla.', () => void this.retryStartTransition('new'));
      });
    } catch (retryError) {
      console.error('[MainMenu] Menu-idle retry failed:', this.describeVideoFailure(this.idleVideo, retryError));
      this.showLoadingError('El fondo animado sigue sin estar disponible. Revisa el recurso e inténtalo de nuevo.', () => void this.retryMenuIdleVideo());
    }
  }

  public showLoadingError(message: string, retry: () => void = () => window.location.reload()): void {
    this.loadingRetry = retry;
    this.loadingPanel.classList.remove('hidden');
    this.loadingPanel.classList.remove('is-dismissing');
    this.mainMenu.classList.add('hidden');
    document.getElementById('loading-status')!.textContent = message;
    document.getElementById('loading-percent')!.textContent = 'No se pudo completar la carga';
    const progress = document.getElementById('loading-progress')!;
    progress.classList.remove('loading-progress-indeterminate');
    progress.style.width = '0';
    document.getElementById('btn-retry-loading')!.classList.remove('hidden');
    this.startIntroButton.classList.add('hidden');
    this.setState('Loading');
  }

  private bindEvents(): void {
    this.introVideo.addEventListener('error', () => {
      this.handleIntroMediaError();
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
    document.getElementById('control-mode')!.addEventListener('change', (event) => {
      setControlModePreference((event.target as HTMLSelectElement).value as ControlModePreference);
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
        this.refreshContinueButton();
      }
    });
  }

  private requestStart(mode: StartMode): void {
    if (this.state !== 'MenuIdle' || this.transitionStarted) return;
    if (!this.startVideoReady) return;
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

    this.refreshContinueButton();
    this.startVideo.preload = 'auto';
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
        this.refreshContinueButton();
        resolve();
      };
      const onError = () => fail(new Error(this.describeVideoFailure(this.startVideo)));
      const onLoadedData = () => {
        if (this.startVideo.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
        void this.waitForVideoFrame(this.startVideo).then(framePresented, fail);
        this.startVideo.play().catch((error: unknown) => fail(error instanceof Error ? error : new Error('Start video playback was blocked.')));
      };

      this.startVideo.addEventListener('loadeddata', onLoadedData);
      this.startVideo.addEventListener('error', onError);
      if (this.startVideo.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onLoadedData();
      else this.startVideo.load();
    }).catch((error: unknown) => {
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
    document.getElementById('cinematic-backdrop')?.classList.remove('is-menu-idle');
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
    return new Promise((resolve, reject) => {
      let timeoutId = 0;
      const cleanup = () => {
        window.clearTimeout(timeoutId);
        video.removeEventListener('error', onError);
        video.removeEventListener('loadeddata', onData);
        video.removeEventListener('playing', onPlaying);
      };
      const onError = () => { cleanup(); reject(new Error(this.describeVideoFailure(video))); };
      const onFrameReady = () => {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth <= 0) return;
        cleanup();
        // HAVE_CURRENT_DATA means the decoded current frame is available. Let one
        // paint happen before swapping the layer so the compositor has a frame.
        requestAnimationFrame(() => resolve());
      };
      const onData = () => onFrameReady();
      const onPlaying = () => onFrameReady();
      video.addEventListener('error', onError, { once: true });
      video.addEventListener('loadeddata', onData);
      video.addEventListener('playing', onPlaying);
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
        onFrameReady();
        return;
      }
      timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out waiting for decoded video frame: ${this.describeVideoFailure(video)}`));
      }, 10_000);
    });
  }

  private waitForVideoData(video: HTMLVideoElement, label = video.currentSrc || video.id): Promise<void> {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
    if (video.error) return Promise.reject(new Error(this.describeVideoFailure(video)));

    return new Promise<void>((resolve, reject) => {
      let timeoutId = 0;
      const cleanup = () => {
        window.clearTimeout(timeoutId);
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('error', onError);
        video.removeEventListener('abort', onAbort);
      };
      const onReady = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error(this.describeVideoFailure(video))); };
      const onAbort = () => { cleanup(); reject(new Error(`Video request aborted: ${label}`)); };
      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('error', onError, { once: true });
      video.addEventListener('abort', onAbort, { once: true });
      timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error(`Timed out loading video data: ${label} (readyState=${video.readyState}, networkState=${video.networkState})`));
      }, 30_000);
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
    });
  }

  private describeVideoFailure(video: HTMLVideoElement, cause?: unknown): string {
    const mediaError = video.error;
    const reason = cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause || 'media element error');
    return `${video.currentSrc || video.src || video.id}; mediaError=${mediaError?.code ?? 'none'}; readyState=${video.readyState}; networkState=${video.networkState}; ${reason}`;
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
    document.getElementById('cinematic-backdrop')?.classList.add('is-menu-idle');
    this.setState('MenuIdle');
    this.showDialogError(message, () => void this.retryStartTransition(this.startMode));
  }

  private async retryStartTransition(mode: StartMode): Promise<void> {
    this.startVideoReady = false;
    this.refreshContinueButton();
    this.startVideo.currentTime = 0;
    try {
      await this.prepareStartVideo();
      await this.beginTransition(mode);
    } catch {
      this.showDialogError('El vídeo de inicio sigue sin estar disponible. Comprueba la conexión e inténtalo otra vez.', () => void this.retryStartTransition(mode));
    }
  }

  private async finishTransition(): Promise<void> {
    if (!this.transitionStarted || this.state !== 'StartingGame') return;
    this.transitionStarted = false;
    try {
      this.showInGameLoading();
      await this.callbacks.onTransitionComplete(this.startMode);
    } catch (error) {
      console.error('[MainMenu] Could not enter gameplay after the transition:', error);
      this.failInGameLoading('No se pudo preparar la partida. Reintenta para volver a intentarlo.');
      return;
    }

    this.introVideo.pause();
    this.idleVideo.pause();
    this.introVideo.classList.remove('is-visible');
    this.idleVideo.classList.remove('is-visible');
    const backdrop = document.getElementById('cinematic-backdrop');
    // First expose the already-rendered game beneath the transition frame while
    // the branded loading video/logo still covers the screen. Only remove the
    // loading overlay after the cinematic layer is gone, preventing a black gap.
    backdrop?.classList.add('is-ending');
    if (backdrop) backdrop.style.background = 'transparent';
    this.startVideo.classList.remove('is-visible');
    await this.waitForOpacityTransition(this.startVideo);
    this.startVideo.pause();
    backdrop?.classList.add('hidden');
    backdrop?.classList.remove('is-ending');
    await this.completeInGameLoading();
    this.setState('Playing');
    document.getElementById('start-screen')!.classList.add('hidden');
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
    const canStart = this.startVideoReady;
    this.continueButton.disabled = !canContinue || !canStart;
    this.newGameButton.disabled = !canStart;
    this.continueButton.classList.toggle('menu-button-primary', canContinue);
    this.newGameButton.classList.toggle('menu-button-primary', !canContinue);
    const loadingStatus = document.getElementById('menu-loading-status');
    if (loadingStatus) {
      loadingStatus.textContent = !this.startVideoReady ? 'Preparando la transición…' : '';
      loadingStatus.classList.toggle('hidden', this.state !== 'MenuIdle' || canStart);
    }
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
      const stored = localStorage.getItem(PREFERENCES_KEY) ?? localStorage.getItem(LEGACY_PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<MenuPreferences>;
        const savedQuality = Number(parsed.quality);
        this.preferences = {
          music: this.clamp(parsed.music, 0.5),
          effects: this.clamp(parsed.effects, 0.8),
          // 0.85 was the former out-of-box preset and caused a soft image on
          // standard-density screens. Migrate that implicit default to High;
          // an explicitly chosen power-saving preset remains respected.
          quality: Number.isFinite(savedQuality) && [0.65, 0.85, 1].includes(savedQuality)
            ? (savedQuality === 0.85 ? 1 : savedQuality)
            : 1
        };
        if (!localStorage.getItem(PREFERENCES_KEY)) {
          localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
        }
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
    (document.getElementById('control-mode') as HTMLSelectElement).value = getControlModePreference();
  }

  private persistPreferences(): void {
    this.callbacks.onPreferences(this.preferences);
    try { localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences)); } catch { /* Preferences still apply for this session. */ }
  }
}
