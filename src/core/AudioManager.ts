export class AudioManager {
  private ctx: AudioContext | null = null;
  private readonly bgmAudio = new Audio();
  private readonly musicPaths = {
    intro: 'assets/music/wukong-intro-theme.mp3',
    gameplayB: 'assets/music/wukong-game-lisar-studio.mp3',
    crabBoss: 'assets/music/crab-boss-theme.mp3'
  } as const;
  private readonly musicUrls = new Map<keyof typeof this.musicPaths, string>();
  private musicPreparation: Promise<void> | null = null;
  private bossMusicPreparation: Promise<void> | null = null;
  private musicPrepared = false;
  private musicMode: 'intro' | 'gameplay' | 'boss' | null = null;
  private currentMusicTrack: keyof typeof this.musicPaths | null = null;
  private returnTrack: 'intro' | 'gameplayB' = 'intro';
  private returnTrackTime = 0;
  private musicGain = 1;
  private musicFadeId = 0;

  // Volume channels
  public masterVolume = 1.0;
  public musicVolume = 0.5;
  public sfxVolume = 0.8;
  public voiceVolume = 0.95;

  private isAudioUnlocked = false;

  constructor() {
    this.bgmAudio.preload = 'auto';
    this.bgmAudio.volume = this.musicVolume * this.masterVolume;
    this.bgmAudio.addEventListener('ended', () => this.playNextGameplayTrack());
    this.setupMobileTouchUnlock();
  }

  /**
   * Unlocks WebAudio & HTML5 Audio autoplay policies on mobile devices (iOS Safari & Chrome Mobile)
   * upon the first touch/click interaction.
   */
  private setupMobileTouchUnlock(): void {
    const unlock = () => {
      if (this.isAudioUnlocked) return;
      this.isAudioUnlocked = true;

      try {
        const ctx = this.initCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        if (this.musicMode && this.bgmAudio.paused) {
          this.bgmAudio.play().catch(e => console.warn('[AudioManager] BGM unlock resume error:', e));
        }

        console.log('[AudioManager] ✅ Mobile WebAudio & BGM unlocked on first touch/click.');
      } catch (err) {
        console.warn('[AudioManager] Audio unlock failed:', err);
      }
    };

    window.addEventListener('touchstart', unlock, { once: true });
    window.addEventListener('touchend', unlock, { once: true });
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });
  }

  public resume(): void {
    try {
      this.initCtx();
    } catch (e) {
      console.warn('[AudioManager] Failed to resume AudioContext:', e);
    }
  }

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public prepareMusic(): Promise<void> {
    if (this.musicPrepared) return Promise.resolve();
    if (this.musicPreparation) return this.musicPreparation;

    const base = import.meta.env.BASE_URL;
    this.musicPreparation = Promise.all(
      Object.entries(this.musicPaths).filter(([key]) => key !== 'crabBoss').map(async ([key, path]) => {
        const response = await fetch(`${base}${path}`, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Could not load music asset: ${path} (${response.status})`);
        const blob = await response.blob();
        this.musicUrls.set(key as keyof typeof this.musicPaths, URL.createObjectURL(blob));
      })
    ).then(async () => {
      this.setMusicSource('intro');
      this.bgmAudio.loop = true;
      await new Promise<void>((resolve, reject) => {
        if (this.bgmAudio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve();
          return;
        }
        const onCanPlay = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error('The intro music could not be decoded.')); };
        const cleanup = () => {
          this.bgmAudio.removeEventListener('canplay', onCanPlay);
          this.bgmAudio.removeEventListener('error', onError);
        };
        this.bgmAudio.addEventListener('canplay', onCanPlay, { once: true });
        this.bgmAudio.addEventListener('error', onError, { once: true });
      });
      await Promise.all((['gameplayB'] as const).map((track) => {
        const url = this.musicUrls.get(track);
        return url ? this.preflightTrack(url) : Promise.reject(new Error(`Missing prepared music: ${track}`));
      }));
      // Source selection above is done only before playback or when a gameplay track ends.
      // The intro starts at its first prepared sample; state changes never call this path.
      this.bgmAudio.currentTime = 0;
      this.musicPrepared = true;
      // This large, encounter-only theme must not hold the intro screen open.
      // Download/decode it in the background while the player starts the level.
      void this.prepareBossMusicAsset().catch((error: unknown) => {
        console.warn('[AudioManager] Crab theme is not ready yet; it will retry when needed.', error);
      });
    }).catch((error: unknown) => {
      for (const url of this.musicUrls.values()) URL.revokeObjectURL(url);
      this.musicUrls.clear();
      throw error;
    }).finally(() => {
      this.musicPreparation = null;
    });

    return this.musicPreparation;
  }

  public async startIntroMusic(): Promise<boolean> {
    if (!this.musicPrepared) return false;
    this.musicMode = 'intro';
    this.bgmAudio.loop = true;
    if (this.currentMusicTrack !== 'intro') this.setMusicSource('intro');
    if (!this.bgmAudio.paused && this.currentMusicTrack === 'intro') return true;

    try {
      await this.bgmAudio.play();
      return true;
    } catch (error) {
      console.info('[AudioManager] Waiting for a user gesture to start the intro music.', error);
      return false;
    }
  }

  public startGameplayMusic(): void {
    if (!this.musicPrepared) return;
    void this.prepareBossMusicAsset().catch((error: unknown) => {
      console.warn('[AudioManager] Background crab theme preparation failed.', error);
    });
    if (this.musicMode === 'gameplay' && !this.bgmAudio.paused) return;
    this.musicMode = 'gameplay';
    this.musicGain = 1;
    this.applyMusicVolume();
    this.bgmAudio.loop = false;
    const nextTrack = this.pickGameplayTrack();
    if (nextTrack !== this.currentMusicTrack) this.setMusicSource(nextTrack);
    if (this.bgmAudio.paused) {
      this.bgmAudio.play().catch(error => console.warn('[AudioManager] Gameplay music playback failed:', error));
    }
  }

  private playNextGameplayTrack(): void {
    if (this.musicMode !== 'gameplay') return;
    const nextTrack = this.pickGameplayTrack(this.currentMusicTrack === 'intro' ? 'intro' : 'gameplayB');
    if (nextTrack !== this.currentMusicTrack) this.setMusicSource(nextTrack);
    this.bgmAudio.loop = false;
    this.bgmAudio.play().catch(error => console.warn('[AudioManager] Gameplay playlist could not continue:', error));
  }

  private pickGameplayTrack(exclude?: 'intro' | 'gameplayB'): 'intro' | 'gameplayB' {
    const choices: Array<'intro' | 'gameplayB'> = exclude ? (exclude === 'intro' ? ['gameplayB'] : ['intro']) : ['intro', 'gameplayB'];
    return choices[Math.floor(Math.random() * choices.length)];
  }

  public async startBossMusic(): Promise<void> {
    if (!this.musicPrepared || this.musicMode === 'boss') return;
    if (this.musicMode === 'gameplay' && (this.currentMusicTrack === 'intro' || this.currentMusicTrack === 'gameplayB')) {
      this.returnTrack = this.currentMusicTrack;
      this.returnTrackTime = this.bgmAudio.currentTime;
    }
    this.musicMode = 'boss';
    try {
      await this.prepareBossMusicAsset();
    } catch (error) {
      if (this.musicMode === 'boss') this.musicMode = 'gameplay';
      console.warn('[AudioManager] Crab theme could not be prepared.', error);
      return;
    }
    if (this.musicMode !== 'boss') return;
    await this.fadeMusicTo(0, 520);
    if (this.musicMode !== 'boss') return;
    this.setMusicSource('crabBoss');
    this.bgmAudio.loop = true;
    this.musicGain = 0;
    this.applyMusicVolume();
    try {
      await this.bgmAudio.play();
      if (this.musicMode === 'boss') await this.fadeMusicTo(1, 650);
    } catch (error) {
      console.warn('[AudioManager] Crab music playback failed:', error);
      this.musicMode = 'gameplay';
      this.restoreGameplayMusic();
    }
  }

  public async stopBossMusic(): Promise<void> {
    if (this.musicMode !== 'boss') return;
    this.musicMode = 'gameplay';
    await this.fadeMusicTo(0, 520);
    if (this.musicMode !== 'gameplay') return;
    this.restoreGameplayMusic();
  }

  private restoreGameplayMusic(): void {
    this.setMusicSource(this.returnTrack);
    this.bgmAudio.loop = false;
    void this.waitForMediaReady(this.bgmAudio).then(async () => {
      if (this.musicMode !== 'gameplay') return;
      if (Number.isFinite(this.bgmAudio.duration)) {
        this.bgmAudio.currentTime = Math.min(this.returnTrackTime, Math.max(0, this.bgmAudio.duration - 0.05));
      }
      this.musicGain = 0;
      this.applyMusicVolume();
      try {
        await this.bgmAudio.play();
        if (this.musicMode === 'gameplay') await this.fadeMusicTo(1, 650);
      } catch (error) {
        console.warn('[AudioManager] Could not resume gameplay music:', error);
      }
    });
  }

  private async fadeMusicTo(target: number, durationMs: number): Promise<void> {
    const id = ++this.musicFadeId;
    const from = this.musicGain;
    const startedAt = performance.now();
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (id !== this.musicFadeId) { resolve(); return; }
        const t = Math.min(1, (now - startedAt) / durationMs);
        const eased = t * t * (3 - 2 * t);
        this.musicGain = from + (target - from) * eased;
        this.applyMusicVolume();
        if (t >= 1) resolve();
        else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  private applyMusicVolume(): void {
    this.bgmAudio.volume = this.musicVolume * this.masterVolume * this.musicGain;
  }

  private preflightTrack(url: string): Promise<void> {
    const probe = new Audio();
    probe.preload = 'auto';
    probe.src = url;
    return this.waitForMediaReady(probe).finally(() => {
      probe.pause();
      probe.removeAttribute('src');
      probe.load();
    });
  }

  private prepareBossMusicAsset(): Promise<void> {
    if (this.musicUrls.has('crabBoss')) return Promise.resolve();
    if (this.bossMusicPreparation) return this.bossMusicPreparation;
    const base = import.meta.env.BASE_URL;
    this.bossMusicPreparation = fetch(`${base}${this.musicPaths.crabBoss}`, { cache: 'force-cache' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Could not load crab music (${response.status}).`);
        const url = URL.createObjectURL(await response.blob());
        this.musicUrls.set('crabBoss', url);
        await this.preflightTrack(url);
      })
      .catch((error: unknown) => {
        const url = this.musicUrls.get('crabBoss');
        if (url) URL.revokeObjectURL(url);
        this.musicUrls.delete('crabBoss');
        throw error;
      })
      .finally(() => { this.bossMusicPreparation = null; });
    return this.bossMusicPreparation;
  }

  private waitForMediaReady(audio: HTMLAudioElement): Promise<void> {
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        cleanup();
        reject(new Error('Timed out waiting for audio to decode.'));
      }, 30_000);
      const cleanup = () => {
        window.clearTimeout(timeoutId);
        audio.removeEventListener('canplay', onReady);
        audio.removeEventListener('error', onError);
      };
      const onReady = () => { cleanup(); resolve(); };
      const onError = () => { cleanup(); reject(new Error('Audio could not be decoded.')); };
      audio.addEventListener('canplay', onReady, { once: true });
      audio.addEventListener('error', onError, { once: true });
      audio.load();
    });
  }

  private setMusicSource(track: keyof typeof this.musicPaths): void {
    const url = this.musicUrls.get(track);
    if (!url) return;
    this.bgmAudio.pause();
    this.bgmAudio.src = url;
    this.bgmAudio.load();
    this.applyMusicVolume();
    this.currentMusicTrack = track;
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1.0, volume));
    this.applyMusicVolume();
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1.0, volume));
    this.voiceVolume = this.sfxVolume;
  }

  public playMenuSelect(): void {
    if (this.sfxVolume <= 0.001) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.055);
    gain.gain.setValueAtTime(0.045 * this.sfxVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  // ── Multi-Variant Physical Hit Impact SFX (with pitch/volume variation) ──────
  public playHitImpact(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Pitch variation: +/- 10%
    const pitchFactor = 0.9 + Math.random() * 0.2;
    const vol = (0.7 + Math.random() * 0.2) * this.sfxVolume * this.masterVolume;

    // Heavy punchy transient oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 * pitchFactor, now);
    osc.frequency.exponentialRampToValueAtTime(45 * pitchFactor, now + 0.12);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // ── Youthful Adventurous Male Hero Vocal Grunts ──────────────────────────────
  public playAttackGrunt(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const vol = 0.85 * this.voiceVolume * this.masterVolume;

    // Formant synthesizer for energetic hero attack shout
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    const variants = [320, 360, 410];
    const baseFreq = variants[Math.floor(Math.random() * variants.length)];

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.18);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(3.0, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playJumpGrunt(): void {
    // 45% chance to trigger jump vocal grunt (avoids repetitive fatigue)
    if (Math.random() > 0.45) return;

    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const vol = 0.7 * this.voiceVolume * this.masterVolume;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.15);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1300, now);
    filter.Q.setValueAtTime(2.5, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  public playHurtGrunt(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const vol = 0.9 * this.voiceVolume * this.masterVolume;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.24);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playHardLandingGrunt(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const vol = 0.95 * this.voiceVolume * this.masterVolume;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.32);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.34);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.34);
  }

  // ── Hard Landing Heavy Impact SFX (Surface Specific) ──────────────────────────
  public playHardLandingImpact(surface: 'grass' | 'stone' | 'wood' = 'stone'): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const vol = 0.95 * this.sfxVolume * this.masterVolume;

    // 1. Sub-bass heavy impact pulse
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    subGain.gain.setValueAtTime(vol * 1.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.38);

    // 2. Surface-specific noise burst
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    if (surface === 'grass') {
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, now);
    } else if (surface === 'wood') {
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(450, now);
    } else {
      // stone
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, now);
    }

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.28);
  }

  public playFlipendoCast(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Heavy physical pulse + sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.35);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playAlohomoraCast(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Sparkling keyhole magic swirl
    [659.25, 880, 1046.5, 1318.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.2, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.4);
    });
  }

  public playLumosCast(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(880, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playPotShatter(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Noise burst + ceramic click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playChestOpen(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.25, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  }

  public playLumosGargoyle(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  public playBeanPickup(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, now); // B5 note
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6 note
    gain2.gain.setValueAtTime(0.0, now);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.3);

  }

  public playCoinSpawnHarmonic(index: number): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Magical Pentatonic Scale starting from C5
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00]; 
    const octave = Math.floor(index / scale.length);
    // Scale up frequency by octave (x1, x2, x4...) capped at 3 octaves to avoid harsh highs
    const cappedOctave = Math.min(octave, 2);
    const freq = scale[index % scale.length] * Math.pow(2, cappedOctave);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    
    // Very quick magical chime
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.1);

    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playFrogPickup(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playSpellSwitch(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playPlayerHurt(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playPotionPickup(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const freqs = [440, 554.37, 659.25, 880];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.3);
    });
  }

  public playSpellCast(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Luminous magic pulse sound (sine sweep up + noise sparkle)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playTargetHit(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Magical crystal chime (2 harmonizing sines)
    [880, 1320, 1760].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.2, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.5);
    });
  }

  public playDoorOpen(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Heavy stone door grinding sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(140, now + 1.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  public playCardPickup(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // Arpeggio chime for collectible
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);

      gain.gain.setValueAtTime(0.25, now + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.4);
    });
  }

  public playFootstep(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 + Math.random() * 20, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playEnemyStun(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playVictoryJingle(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, d: 0.2 }, // C
      { f: 659.25, d: 0.2 }, // E
      { f: 783.99, d: 0.2 }, // G
      { f: 1046.5, d: 0.6 }  // C6
    ];

    let offset = 0;
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + offset);

      gain.gain.setValueAtTime(0.3, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + note.d);

      offset += note.d * 0.75;
    });
  }

  /**
   * Harmonic ascending chime when waking ancient runic portal pair
   */
  public playPortalActivate(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const notes = [
      { f: 329.63, d: 0.25 }, // E4
      { f: 440.00, d: 0.25 }, // A4
      { f: 554.37, d: 0.30 }, // C#5
      { f: 880.00, d: 0.60 }  // A5
    ];

    let offset = 0;
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + offset);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume * this.masterVolume, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + note.d);

      offset += 0.12;
    });
  }

  /**
   * Resonant ethereal whoosh & crystal chord during instant teleportation
   */
  public playPortalTeleport(): void {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    // 1. Ethereal whoosh sweep
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepOsc.type = 'sine';
    sweepOsc.frequency.setValueAtTime(180, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(720, now + 0.18);

    sweepGain.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.28);

    // 2. Resonant high chord
    [659.25, 830.61, 987.77].forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + 0.08);

      gain.gain.setValueAtTime(0.18 * this.sfxVolume * this.masterVolume, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.08);
      osc.stop(now + 0.35);
    });
  }
}
