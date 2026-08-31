import type { SpellType } from '../spells/SpellProjectile';

export class HUD {
  private reticleEl: HTMLElement;
  private hudTopLeftEl: HTMLElement;
  private hudTopRightEl: HTMLElement;
  private objectiveContainerEl: HTMLElement;
  private spellHotbarEl: HTMLElement;
  private objectiveTextEl: HTMLElement;
  private cardCounterEl: HTMLElement | null = null;
  private interactionPromptEl: HTMLElement;
  private interactionLabelEl: HTMLElement;
  private debugOverlayEl: HTMLElement;
  private debugFpsEl: HTMLElement;
  private debugPosEl: HTMLElement;
  private debugStateEl: HTMLElement;
  private debugAnimEl: HTMLElement;
  private debugCheckpointEl: HTMLElement;
  private victoryScreenEl: HTMLElement;
  private victoryCardsEl: HTMLElement;
  private victoryTimeEl: HTMLElement;

  private hpBarFillEl: HTMLElement;
  private mpBarFillEl: HTMLElement;
  private coinCounterEl: HTMLElement | null = null;
  private keyCounterEl: HTMLElement | null = null;
  private gekkoQuestBadgeEl: HTMLElement | null = null;
  private damageFlashEl: HTMLElement;
  private screenFadeEl: HTMLElement;

  private dialogueBubbleEl: HTMLElement;
  private dialogueSpeakerEl: HTMLElement;
  private dialogueTextEl: HTMLElement;

  private slotSpell1El: HTMLElement;
  private slotSpell2El: HTMLElement;
  private slotSpell3El: HTMLElement;

  private pauseScreenEl: HTMLElement;
  private btnMobilePauseEl: HTMLElement | null = null;
  private sliderMusicEl: HTMLInputElement | null = null;
  private sliderFxEl: HTMLInputElement | null = null;
  private musicVolTextEl: HTMLElement | null = null;
  private fxVolTextEl: HTMLElement | null = null;

  // Objective auto-fade
  private objectiveFadeTimer: any = null;
  private objectiveMiniIconEl: HTMLElement | null = null;
  private lastObjectiveText: string = '';

  public isDebugMode = false;

  constructor() {
    this.reticleEl = document.getElementById('reticle')!;
    this.hudTopLeftEl = document.getElementById('hud-top-left')!;
    this.hudTopRightEl = document.getElementById('hud-top-right')!;
    this.objectiveContainerEl = document.getElementById('objective-container')!;
    this.spellHotbarEl = document.getElementById('spell-hotbar')!;
    this.objectiveTextEl = document.getElementById('objective-text')!;
    this.interactionPromptEl = document.getElementById('interaction-prompt')!;
    this.interactionLabelEl = document.getElementById('interaction-label')!;
    this.debugOverlayEl = document.getElementById('debug-overlay')!;
    this.debugFpsEl = document.getElementById('debug-fps')!;
    this.debugPosEl = document.getElementById('debug-pos')!;
    this.debugStateEl = document.getElementById('debug-state')!;
    this.debugAnimEl = document.getElementById('debug-anim')!;
    this.debugCheckpointEl = document.getElementById('debug-checkpoint')!;
    this.victoryScreenEl = document.getElementById('victory-screen')!;
    this.victoryCardsEl = document.getElementById('victory-cards')!;
    this.victoryTimeEl = document.getElementById('victory-time')!;
    this.pauseScreenEl = document.getElementById('pause-screen')!;
    this.btnMobilePauseEl = document.getElementById('btn-mobile-pause');

    this.sliderMusicEl = document.getElementById('slider-music') as HTMLInputElement;
    this.sliderFxEl = document.getElementById('slider-fx') as HTMLInputElement;
    this.musicVolTextEl = document.getElementById('music-vol-text');
    this.fxVolTextEl = document.getElementById('fx-vol-text');

    this.coinCounterEl = document.getElementById('coin-count');
    this.keyCounterEl = document.getElementById('key-count');
    this.cardCounterEl = document.getElementById('card-count');
    this.gekkoQuestBadgeEl = document.getElementById('gekko-quest-complete');

    this.hpBarFillEl = document.getElementById('hp-bar-fill')!;
    this.mpBarFillEl = document.getElementById('mp-bar-fill')!;
    this.slotSpell1El = document.getElementById('slot-spell-1')!;
    this.slotSpell2El = document.getElementById('slot-spell-2')!;
    this.slotSpell3El = document.getElementById('slot-spell-3')!;
    this.damageFlashEl = document.getElementById('damage-flash')!;
    this.screenFadeEl = document.getElementById('screen-fade')!;

    this.dialogueBubbleEl = document.getElementById('dialogue-bubble')!;
    this.dialogueSpeakerEl = document.getElementById('dialogue-speaker')!;
    this.dialogueTextEl = document.getElementById('dialogue-text')!;

    this.initAudioSliders();
    this.initPauseButton();
    this.createObjectiveMiniIcon();
  }

  /** Create the minimized mission icon that appears after objective fades */
  private createObjectiveMiniIcon(): void {
    // Only create if it doesn't exist yet
    if (document.getElementById('objective-mini-icon')) {
      this.objectiveMiniIconEl = document.getElementById('objective-mini-icon');
      return;
    }
    const icon = document.createElement('div');
    icon.id = 'objective-mini-icon';
    icon.textContent = '⭐';
    icon.title = 'Ver objetivo';
    
    // Touch/click to re-show objective
    const showObjective = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      this.showObjectiveTemporarily();
    };
    icon.addEventListener('click', showObjective);
    icon.addEventListener('touchstart', showObjective, { passive: false });

    const uiOverlay = document.getElementById('ui-overlay');
    if (uiOverlay) {
      uiOverlay.appendChild(icon);
    }
    this.objectiveMiniIconEl = icon;
  }

  /** Show the full objective text temporarily, then fade again */
  private showObjectiveTemporarily(): void {
    if (!this.lastObjectiveText) return;
    
    // Hide mini icon
    if (this.objectiveMiniIconEl) {
      this.objectiveMiniIconEl.classList.remove('visible');
    }

    // Show objective container with fade in
    this.objectiveContainerEl.classList.remove('hidden');
    this.objectiveContainerEl.classList.remove('objective-fading');
    this.objectiveTextEl.textContent = this.lastObjectiveText;

    // Schedule fade out again
    this.scheduleObjectiveFade();
  }

  /** Schedule the objective to fade out after a delay */
  private scheduleObjectiveFade(): void {
    if (this.objectiveFadeTimer) {
      clearTimeout(this.objectiveFadeTimer);
    }

    // Show for 5 seconds, then fade out over 1.2 seconds
    this.objectiveFadeTimer = setTimeout(() => {
      // Add fading class (CSS handles 1.2s opacity + transform transition)
      this.objectiveContainerEl.classList.add('objective-fading');

      // After transition completes, hide and show mini icon
      setTimeout(() => {
        this.objectiveContainerEl.classList.add('hidden');
        this.objectiveContainerEl.classList.remove('objective-fading');

        // Show minimized mission icon
        if (this.objectiveMiniIconEl) {
          this.objectiveMiniIconEl.classList.add('visible');
        }
      }, 1300); // slightly longer than CSS transition (1.2s)
    }, 5000);
  }

  private initAudioSliders(): void {
    if (this.sliderMusicEl) {
      this.sliderMusicEl.addEventListener('input', () => {
        const val = parseInt(this.sliderMusicEl!.value, 10);
        if (this.musicVolTextEl) this.musicVolTextEl.textContent = `${val}%`;
        const audioMgr = (window as any).gameInstance?.audioManager;
        if (audioMgr) audioMgr.setMusicVolume(val / 100);
      });
    }

    if (this.sliderFxEl) {
      this.sliderFxEl.addEventListener('input', () => {
        const val = parseInt(this.sliderFxEl!.value, 10);
        if (this.fxVolTextEl) this.fxVolTextEl.textContent = `${val}%`;
        const audioMgr = (window as any).gameInstance?.audioManager;
        if (audioMgr) audioMgr.setSFXVolume(val / 100);
      });
    }
  }

  private initPauseButton(): void {
    if (this.btnMobilePauseEl) {
      const toggle = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const game = (window as any).gameInstance;
        if (game) game.togglePause();
      };
      this.btnMobilePauseEl.addEventListener('click', toggle);
      this.btnMobilePauseEl.addEventListener('touchstart', toggle);
    }
  }

  public setupMobileControls(inputManager: any): void {
    const btnKick = document.getElementById('btn-mobile-kick');
    const btnJump = document.getElementById('btn-mobile-jump');
    const btnAttack = document.getElementById('btn-mobile-attack');

    if (btnKick) {
      const handleKick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        inputManager.triggerKick();
      };
      btnKick.addEventListener('touchstart', handleKick, { passive: false });
      btnKick.addEventListener('click', handleKick);
    }

    if (btnJump) {
      const handleJump = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        inputManager.triggerJump();
      };
      btnJump.addEventListener('touchstart', handleJump, { passive: false });
      btnJump.addEventListener('click', handleJump);
    }

    if (btnAttack) {
      const handleAttack = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        inputManager.triggerMagicSpell();
      };
      btnAttack.addEventListener('touchstart', handleAttack, { passive: false });
      btnAttack.addEventListener('click', handleAttack);
    }
  }

  public showPauseMenu(visible: boolean): void {
    if (visible) {
      this.pauseScreenEl.classList.remove('hidden');
    } else {
      this.pauseScreenEl.classList.add('hidden');
    }
  }

  public showGameplayHUD(): void {
    this.hudTopLeftEl.classList.remove('hidden');
    this.hudTopRightEl.classList.remove('hidden');
    this.spellHotbarEl.classList.remove('hidden');
  }

  // Cached values to avoid redundant DOM operations
  private lastHp = -1;
  private lastMaxHp = -1;
  private lastMp = -1;
  private lastMaxMp = -1;
  private lastCoins = -1;
  private lastKeys = -1;
  private lastHpColor = '';

  /**
   * HP bar with dynamic color: green (high) → orange (medium) → red (low)
   * Transitions are smooth via CSS transition on background and box-shadow.
   */
  public setHealth(hp: number, maxHp = 100): void {
    const safeHp = Math.max(0, Math.ceil(hp));
    if (safeHp === this.lastHp && maxHp === this.lastMaxHp) return;
    this.lastHp = safeHp;
    this.lastMaxHp = maxHp;

    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    this.hpBarFillEl.style.width = `${pct}%`;

    let colorState = 'green';
    if (pct <= 25) colorState = 'red';
    else if (pct <= 55) colorState = 'orange';

    if (colorState !== this.lastHpColor) {
      this.lastHpColor = colorState;
      if (colorState === 'green') {
        this.hpBarFillEl.style.background = 'linear-gradient(90deg, #15803d, #22c55e, #86efac)';
        this.hpBarFillEl.style.boxShadow = '0 0 8px rgba(34, 197, 94, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)';
      } else if (colorState === 'orange') {
        this.hpBarFillEl.style.background = 'linear-gradient(90deg, #b45309, #f59e0b, #fcd34d)';
        this.hpBarFillEl.style.boxShadow = '0 0 8px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)';
      } else {
        this.hpBarFillEl.style.background = 'linear-gradient(90deg, #991b1b, #ef4444, #fca5a5)';
        this.hpBarFillEl.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
      }
    }

    const hpTextEl = document.getElementById('hp-text');
    if (hpTextEl) hpTextEl.textContent = `${safeHp} / ${maxHp}`;
  }

  public setMana(mp: number, maxMp = 100): void {
    const safeMp = Math.max(0, Math.ceil(mp));
    if (safeMp === this.lastMp && maxMp === this.lastMaxMp) return;
    this.lastMp = safeMp;
    this.lastMaxMp = maxMp;

    const pct = Math.max(0, Math.min(100, (mp / maxMp) * 100));
    this.mpBarFillEl.style.width = `${pct}%`;
    const mpTextEl = document.getElementById('mp-text');
    if (mpTextEl) mpTextEl.textContent = `${safeMp} / ${maxMp}`;
  }

  public setCoinCount(count: number): void {
    if (count === this.lastCoins) return;
    this.lastCoins = count;

    if (this.coinCounterEl) {
      this.coinCounterEl.textContent = count.toString() + ' / 50';
      const container = document.getElementById('coin-counter-container');
      if (container) {
        container.style.removeProperty('display');
        container.classList.remove('hidden');
      }
    }
    // Show Gekko quest-complete badge when the player reaches 50 coins
    if (this.gekkoQuestBadgeEl) {
      if (count >= 50) {
        this.gekkoQuestBadgeEl.classList.remove('hidden');
      } else {
        this.gekkoQuestBadgeEl.classList.add('hidden');
      }
    }
  }

  public setKeyCount(count: number): void {
    if (count === this.lastKeys) return;
    this.lastKeys = count;

    if (this.keyCounterEl) {
      this.keyCounterEl.textContent = `Llaves: ${count} / 5`;
    }
  }

  public setActiveSpellSlot(spell: SpellType): void {
    this.slotSpell1El.classList.remove('active');
    this.slotSpell2El.classList.remove('active');
    this.slotSpell3El.classList.remove('active');

    if (spell === 'FLIPENDO') {
      this.slotSpell1El.classList.add('active');
    } else if (spell === 'ALOHOMORA') {
      this.slotSpell2El.classList.add('active');
    } else if (spell === 'LUMOS') {
      this.slotSpell3El.classList.add('active');
    }
  }

  public triggerDamageFlash(): void {
    this.damageFlashEl.classList.remove('hidden');
    // Restart animation
    this.damageFlashEl.style.animation = 'none';
    this.damageFlashEl.offsetHeight; // Reflow
    this.damageFlashEl.style.animation = 'flash-red 0.3s ease-out forwards';
    setTimeout(() => {
      this.damageFlashEl.classList.add('hidden');
    }, 300);
  }

  public showReticle(visible: boolean): void {
    if (visible) {
      this.reticleEl.classList.remove('hidden');
    } else {
      this.reticleEl.classList.add('hidden');
    }
  }

  /**
   * Set objective text. Shows for 5 seconds then smoothly fades out,
   * leaving a small minimized icon that can be tapped to re-show it.
   */
  public setObjective(text: string): void {
    if (text) {
      this.lastObjectiveText = text;
      
      // Hide mini icon
      if (this.objectiveMiniIconEl) {
        this.objectiveMiniIconEl.classList.remove('visible');
      }

      // Show with reset — remove fading class to ensure fresh display
      this.objectiveContainerEl.classList.remove('hidden');
      this.objectiveContainerEl.classList.remove('objective-fading');
      this.objectiveTextEl.textContent = text;

      // Schedule automatic fade out
      this.scheduleObjectiveFade();
    } else {
      this.lastObjectiveText = '';
      this.objectiveContainerEl.classList.add('hidden');
      this.objectiveContainerEl.classList.remove('objective-fading');
      if (this.objectiveMiniIconEl) {
        this.objectiveMiniIconEl.classList.remove('visible');
      }
      if (this.objectiveFadeTimer) {
        clearTimeout(this.objectiveFadeTimer);
        this.objectiveFadeTimer = null;
      }
    }
  }

  public setCardCount(count: number, total = 3): void {
    if (this.cardCounterEl) {
      this.cardCounterEl.textContent = `${count} / ${total}`;
    }
  }

  public isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 1024
    );
  }

  public showInteractionPrompt(label: string): void {
    if (this.isTouchDevice()) {
      label = label.replace(/\[ENTER\]|ENTER/gi, '[TOCA LA PANTALLA]');
      label = label.replace(/PRESIONA/gi, 'TOCA');
    }
    this.interactionLabelEl.textContent = label;
    this.interactionPromptEl.classList.remove('hidden');
  }

  public hideInteractionPrompt(): void {
    this.interactionPromptEl.classList.add('hidden');
  }

  public toggleDebug(): void {
    this.isDebugMode = !this.isDebugMode;
    if (this.isDebugMode) {
      this.debugOverlayEl.classList.remove('hidden');
    } else {
      this.debugOverlayEl.classList.add('hidden');
    }
  }

  public updateDebugStats(fps: number, posX: number, posY: number, posZ: number, state: string, anim: string, checkpoint: number): void {
    if (!this.isDebugMode) return;
    this.debugFpsEl.textContent = fps.toString();
    this.debugPosEl.textContent = `${posX.toFixed(1)}, ${posY.toFixed(1)}, ${posZ.toFixed(1)}`;
    this.debugStateEl.textContent = state;
    this.debugAnimEl.textContent = anim;
    this.debugCheckpointEl.textContent = checkpoint.toString();
  }

  public showVictoryScreen(cardsCount: number, timeFormatted: string): void {
    this.victoryCardsEl.textContent = `${cardsCount} / 3`;
    this.victoryTimeEl.textContent = timeFormatted;
    this.victoryScreenEl.classList.remove('hidden');
  }

  public hideVictoryScreen(): void {
    this.victoryScreenEl.classList.add('hidden');
  }

  // Typewriter Dialogue Effect (Supports Touch Tap Anywhere to Advance)
  private typewriterInterval: any;
  public showTypewriterDialogue(speaker: string, text: string, onComplete?: () => void): void {
    this.dialogueBubbleEl.classList.remove('hidden');
    this.dialogueSpeakerEl.textContent = speaker;
    this.dialogueTextEl.textContent = '';
    
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }

    let charIndex = 0;
    this.typewriterInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.dialogueTextEl.textContent += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        if (onComplete) onComplete();
      }
    }, 35);

    // Touch tap / click listener on dialogue bubble to immediately finish text & advance
    const handleTap = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      this.dialogueBubbleEl.removeEventListener('click', handleTap);
      this.dialogueBubbleEl.removeEventListener('touchstart', handleTap);
      
      if (this.typewriterInterval) {
        clearInterval(this.typewriterInterval);
      }
      this.dialogueTextEl.textContent = text;
      if (onComplete) onComplete();
    };

    this.dialogueBubbleEl.addEventListener('click', handleTap, { once: true });
    this.dialogueBubbleEl.addEventListener('touchstart', handleTap, { once: true });
  }

  public hideDialogue(): void {
    this.dialogueBubbleEl.classList.add('hidden');
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
  }

  public fadeScreenOut(durationMs: number = 1000): Promise<void> {
    this.screenFadeEl.style.transition = `opacity ${durationMs}ms ease-in-out`;
    this.screenFadeEl.classList.remove('hidden');
    return new Promise(resolve => setTimeout(resolve, durationMs));
  }

  public fadeScreenIn(durationMs: number = 1000): Promise<void> {
    this.screenFadeEl.style.transition = `opacity ${durationMs}ms ease-in-out`;
    this.screenFadeEl.classList.add('hidden');
    return new Promise(resolve => setTimeout(resolve, durationMs));
  }

  /**
   * Ultra-snappy magical flash transition during portal teleportation.
   * Total duration ~200-250ms with zero long black screens.
   */
  public triggerTeleportFlash(durationMs: number = 220): Promise<void> {
    const half = Math.max(50, Math.floor(durationMs / 2));
    this.screenFadeEl.style.transition = `opacity ${half}ms ease-out`;
    this.screenFadeEl.style.background = 'radial-gradient(circle, rgba(0,229,255,0.7) 0%, rgba(5,20,35,0.85) 100%)';
    this.screenFadeEl.classList.remove('hidden');

    return new Promise(resolve => {
      setTimeout(() => {
        this.screenFadeEl.style.transition = `opacity ${half}ms ease-in`;
        this.screenFadeEl.classList.add('hidden');
        setTimeout(() => {
          this.screenFadeEl.style.background = '#000000';
          resolve();
        }, half);
      }, half);
    });
  }
}
