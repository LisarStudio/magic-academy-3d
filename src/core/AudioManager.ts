export class AudioManager {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;

  // Volume channels
  public masterVolume = 1.0;
  public musicVolume = 0.5;
  public sfxVolume = 0.8;
  public voiceVolume = 0.95;

  private isAudioUnlocked = false;

  constructor() {
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

        if (this.bgmAudio && this.bgmAudio.paused) {
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

  public startBGM(): void {
    if (this.bgmAudio) return;
    
    this.bgmAudio = new Audio(import.meta.env.BASE_URL + 'assets/Castle Dawn Escape.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = this.musicVolume * this.masterVolume;
    this.bgmAudio.play().catch(err => {
      console.warn('[AudioManager] BGM autoplay blocked or failed to load:', err);
    });
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1.0, volume));
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.musicVolume * this.masterVolume;
    }
  }

  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1.0, volume));
    this.voiceVolume = this.sfxVolume;
  }

  public stopBGM(): void {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
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
}
