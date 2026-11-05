import type { SpellType } from '../spells/SpellProjectile';
import { EquipmentViewer } from './EquipmentViewer';
import { MobileTouchControls } from './MobileTouchControls';
import { usesTouchControls } from '../core/ControlMode';
import { KEY_ASSETS, type ProgressKeyId } from '../collectibles/KeyAssetCatalog';
import { CinematicDialogueUI, type CinematicDialogueOptions } from './CinematicDialogueUI';

export class HUD {
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
  private collectedKeysEl: HTMLElement | null = null;
  private collectedKeyIds = new Set<string>();
  private manekiNekoSlotEl: HTMLElement | null = null;
  private manekiNekoIconEl: HTMLImageElement | null = null;
  private gekkoQuestBadgeEl: HTMLElement | null = null;
  private damageFlashEl: HTMLElement;
  private screenFadeEl: HTMLElement;
  private bossHealthPanelEl: HTMLElement;
  private bossHealthFillEl: HTMLElement;
  private bossHealthRevealTimer: number | null = null;
  private bossHealthRafFirst = 0;
  private bossHealthRafSecond = 0;
  private bossHealthGeneration = 0;
  private bossHealthActive = false;
  private bossEncounterToken: symbol | null = null;
  private lifeCountEl: HTMLElement | null = null;
  private dodgeWarningEl: HTMLElement | null = null;

  private dialogueBubbleEl: HTMLElement;
  private dialogueSpeakerEl: HTMLElement;
  private dialogueTextEl: HTMLElement;
  private dialogueOptionsEl: HTMLElement;
  private cinematicDialogueUI: CinematicDialogueUI;
  private dialogueChoiceKeyHandler: ((event: KeyboardEvent) => void) | null = null;
  private dialogueTapHandler: ((event: Event) => void) | null = null;
  private dialogueChoiceCallback: ((choice: 'accept' | 'decline') => void) | null = null;
  private dialogueChoices: Array<{ label: string; value: 'accept' | 'decline' }> = [];
  private selectedDialogueChoice = 0;
  private letterChallengePanelEl: HTMLElement;
  private letterChallengeTimeEl: HTMLElement;
  private letterChallengeProgressEl: HTMLElement;
  private letterChallengeNextEl: HTMLElement;
  private letterChallengeSlotsEl: HTMLElement;
  private letterChallengeSlotElements: HTMLElement[] = [];
  private missionNoticeTimer = 0;

  private slotSpell1El: HTMLElement;
  private slotSpell2El: HTMLElement;
  private slotSpell3El: HTMLElement;

  private pauseScreenEl: HTMLElement;
  private btnMobilePauseEl: HTMLElement | null = null;
  private sliderMusicEl: HTMLInputElement | null = null;
  private sliderFxEl: HTMLInputElement | null = null;
  private musicVolTextEl: HTMLElement | null = null;
  private fxVolTextEl: HTMLElement | null = null;

  public equipmentViewer: EquipmentViewer | null = null;
  public mobileControls: MobileTouchControls | null = null;

  // Objective auto-fade
  private objectiveFadeTimer: any = null;
  private objectiveMiniIconEl: HTMLElement | null = null;
  private lastObjectiveText: string = '';
  private interactionPromptRequested = false;

  public isDebugMode = false;

  constructor() {
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
    this.collectedKeysEl = document.getElementById('hud-collected-keys');
    this.setCollectedKeys([], false);
    this.manekiNekoSlotEl = document.getElementById('hud-maneki-neko');
    this.manekiNekoIconEl = this.manekiNekoSlotEl?.querySelector('img') ?? null;
    this.setManekiNekoOwned(false);
    this.cardCounterEl = document.getElementById('card-count');
    this.gekkoQuestBadgeEl = document.getElementById('gekko-quest-complete');

    this.hpBarFillEl = document.getElementById('hp-bar-fill')!;
    this.lifeCountEl = document.getElementById('life-count');
    this.dodgeWarningEl = document.getElementById('dodge-warning');
    this.mpBarFillEl = document.getElementById('mp-bar-fill')!;
    this.slotSpell1El = document.getElementById('slot-spell-1')!;
    this.slotSpell2El = document.getElementById('slot-spell-2')!;
    this.slotSpell3El = document.getElementById('slot-spell-3')!;
    this.damageFlashEl = document.getElementById('damage-flash')!;
    this.screenFadeEl = document.getElementById('screen-fade')!;
    this.bossHealthPanelEl = document.getElementById('boss-health-panel')!;
    this.bossHealthFillEl = document.getElementById('boss-health-fill')!;
    this.hideBossHealth();

    this.dialogueBubbleEl = document.getElementById('dialogue-bubble')!;
    this.dialogueSpeakerEl = document.getElementById('dialogue-speaker')!;
    this.dialogueTextEl = document.getElementById('dialogue-text')!;
    this.dialogueOptionsEl = document.getElementById('dialogue-options')!;
    this.cinematicDialogueUI = new CinematicDialogueUI(this.dialogueBubbleEl, this.dialogueSpeakerEl);
    this.letterChallengePanelEl = document.getElementById('letter-challenge-hud')!;
    this.letterChallengeTimeEl = document.getElementById('letter-challenge-time')!;
    this.letterChallengeProgressEl = document.getElementById('letter-challenge-progress')!;
    this.letterChallengeNextEl = document.getElementById('letter-challenge-next')!;
    this.letterChallengeSlotsEl = document.getElementById('letter-challenge-slots')!;
    this.createLetterChallengeSlots();

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
    }
  }

  public showPauseMenu(visible: boolean): void {
    if (visible) {
      this.pauseScreenEl.classList.remove('hidden');
      this.equipmentViewer?.onPauseOpened();
    } else {
      this.pauseScreenEl.classList.add('hidden');
      this.equipmentViewer?.onPauseClosed();
    }
  }

  public setMobileActionHighlight(active: boolean): void {
    this.mobileControls?.setActionHighlight(active);
  }

  public showGameplayHUD(): void {
    this.hudTopLeftEl.classList.remove('hidden');
    this.hudTopRightEl.classList.remove('hidden');
    this.spellHotbarEl.classList.remove('hidden');
  }

  private createLetterChallengeSlots(): void {
    const letters = ['W', 'U', 'K', 'O', 'N', 'G'];
    this.letterChallengeSlotsEl.replaceChildren();
    this.letterChallengeSlotElements = letters.map((letter) => {
      const slot = document.createElement('div');
      slot.className = 'letter-challenge-slot';
      slot.setAttribute('role', 'listitem');
      slot.setAttribute('aria-label', `Letra ${letter} pendiente`);
      const icon = document.createElement('img');
      // The authored 1254px originals remain untouched. These transparent,
      // tightly cropped 512px HUD derivatives retain their look at 1x/2x UI.
      icon.src = `${import.meta.env.BASE_URL}assets/letter-challenge/hud-${letter}.png`;
      icon.alt = `Letra ${letter}`;
      icon.decoding = 'async';
      icon.draggable = false;
      slot.appendChild(icon);
      this.letterChallengeSlotsEl.appendChild(slot);
      return slot;
    });
  }

  public showLetterChallenge(): void {
    this.letterChallengePanelEl.classList.remove('hidden', 'is-urgent');
    this.letterChallengePanelEl.setAttribute('aria-hidden', 'false');
    this.letterChallengeTimeEl.textContent = '01:00';
    this.letterChallengeProgressEl.textContent = '0/6 recuperadas';
    this.letterChallengeNextEl.textContent = 'Siguiente: W';
    this.updateLetterChallenge(60, 0);
    requestAnimationFrame(() => this.letterChallengePanelEl.classList.add('is-visible'));
  }

  public updateLetterChallenge(secondsRemaining: number, collectedCount: number): void {
    const seconds = Math.max(0, Math.ceil(secondsRemaining));
    const minutesText = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secondsText = String(seconds % 60).padStart(2, '0');
    this.letterChallengeTimeEl.textContent = `${minutesText}:${secondsText}`;
    this.letterChallengePanelEl.classList.toggle('is-urgent', seconds <= 10);
    const count = Math.max(0, Math.min(6, Math.floor(collectedCount)));
    this.letterChallengeProgressEl.textContent = `${count}/6 recuperadas`;
    this.letterChallengeNextEl.textContent = count < 6 ? `Siguiente: ${['W', 'U', 'K', 'O', 'N', 'G'][count]}` : '¡Completado!';
    this.letterChallengeSlotElements.forEach((slot, index) => {
      const collected = index < count;
      const next = index === count && count < 6;
      slot.classList.toggle('is-collected', collected);
      slot.classList.toggle('is-next', next);
      slot.dataset.state = collected ? 'collected' : next ? 'target' : 'pending';
      slot.setAttribute('aria-label', `Letra ${['W', 'U', 'K', 'O', 'N', 'G'][index]} ${collected ? 'recuperada' : next ? 'siguiente' : 'pendiente'}`);
    });
  }

  public hideLetterChallenge(): void {
    this.letterChallengePanelEl.classList.remove('is-visible', 'is-urgent');
    this.letterChallengePanelEl.classList.add('hidden');
    this.letterChallengePanelEl.setAttribute('aria-hidden', 'true');
  }

  public showMissionNotice(title: string, message: string): void {
    window.clearTimeout(this.missionNoticeTimer);
    this.showTypewriterDialogue(title, message, () => {
      this.missionNoticeTimer = window.setTimeout(() => this.hideDialogue(), 2600);
    });
  }

  public isDialogueOpen(): boolean {
    return !this.dialogueBubbleEl.classList.contains('hidden');
  }

  public showDialogueChoices(
    speaker: string,
    text: string,
    choices: Array<{ label: string; value: 'accept' | 'decline' }>,
    onChoose: (choice: 'accept' | 'decline') => void,
    presentation: CinematicDialogueOptions = {},
  ): void {
    this.clearDialogueChoiceState();
    this.clearDialogueTapHandler();
    if (this.typewriterInterval) window.clearInterval(this.typewriterInterval);
    window.clearTimeout(this.missionNoticeTimer);
    this.cinematicDialogueUI.show(speaker, presentation);
    this.dialogueTextEl.textContent = '';
    this.dialogueChoices = choices;
    this.dialogueChoiceCallback = onChoose;
    this.selectedDialogueChoice = 0;
    this.dialogueOptionsEl.replaceChildren();
    this.dialogueOptionsEl.classList.remove('hidden');
    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dialogue-choice-button';
      button.textContent = choice.label;
      button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.chooseDialogueOption(index);
      });
      this.dialogueOptionsEl.appendChild(button);
    });

    let charIndex = 0;
    this.typewriterInterval = window.setInterval(() => {
      if (charIndex >= text.length) {
        window.clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        return;
      }
      this.dialogueTextEl.textContent += text.charAt(charIndex++);
    }, 24);
    this.dialogueChoiceKeyHandler = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
        event.preventDefault();
        this.selectedDialogueChoice = (this.selectedDialogueChoice + choices.length - 1) % choices.length;
        this.refreshDialogueChoiceFocus();
      } else if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
        event.preventDefault();
        this.selectedDialogueChoice = (this.selectedDialogueChoice + 1) % choices.length;
        this.refreshDialogueChoiceFocus();
      } else if (event.code === 'Enter' || event.code === 'Space') {
        event.preventDefault();
        this.chooseDialogueOption();
      }
    };
    window.addEventListener('keydown', this.dialogueChoiceKeyHandler);
  }

  private refreshDialogueChoiceFocus(): void {
    const buttons = Array.from(this.dialogueOptionsEl.querySelectorAll<HTMLButtonElement>('button'));
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', index === this.selectedDialogueChoice ? 'true' : 'false'));
    buttons[this.selectedDialogueChoice]?.focus({ preventScroll: true });
  }

  public chooseDialogueOption(index = this.selectedDialogueChoice): void {
    const choice = this.dialogueChoices[index];
    if (!choice || !this.dialogueChoiceCallback) return;
    const callback = this.dialogueChoiceCallback;
    this.clearDialogueChoiceState();
    this.hideDialogue();
    callback(choice.value);
  }

  private clearDialogueChoiceState(): void {
    if (this.dialogueChoiceKeyHandler) window.removeEventListener('keydown', this.dialogueChoiceKeyHandler);
    this.dialogueChoiceKeyHandler = null;
    this.dialogueChoiceCallback = null;
    this.dialogueChoices = [];
    this.dialogueOptionsEl.classList.add('hidden');
    this.dialogueOptionsEl.replaceChildren();
  }

  /** Creates a one-use authorization for the currently active boss encounter. */
  public beginBossEncounter(): symbol {
    this.hideBossHealth();
    this.bossEncounterToken = Symbol('live-boss-encounter');
    return this.bossEncounterToken;
  }

  public isBossEncounterCurrent(token: symbol): boolean {
    return this.bossEncounterToken === token;
  }

  /** Reveals the boss meter only after its current entrance dialogue has finished. */
  public revealBossHealth(health: number, maxHealth: number, token: symbol): void {
    if (!this.isBossEncounterCurrent(token)) return;
    this.cancelBossHealthReveal();
    this.bossHealthActive = true;
    const generation = ++this.bossHealthGeneration;
    this.openBossHealthPanel();
    this.updateBossHealth(health, maxHealth);

    const targetWidth = this.bossHealthFillEl.style.width;
    const mask = this.bossHealthPanelEl.querySelector<HTMLElement>('.boss-health-mask');
    const targetMaskLeft = mask?.style.left ?? '88.25%';
    const targetMaskWidth = mask?.style.width ?? '0%';
    this.bossHealthPanelEl.classList.remove('boss-health-reveal');
    this.bossHealthFillEl.style.transition = 'none';
    this.bossHealthFillEl.style.width = '0%';
    if (mask) {
      mask.style.transition = 'none';
      mask.style.left = '32.15%';
      mask.style.width = '56.1%';
    }
    void this.bossHealthFillEl.offsetWidth;
    this.bossHealthPanelEl.classList.add('boss-health-reveal');
    this.bossHealthFillEl.style.removeProperty('transition');
    this.bossHealthFillEl.parentElement?.setAttribute('aria-valuetext', `Jefe: ${Math.ceil(health)} de ${Math.max(1, maxHealth)}`);

    this.bossHealthRafFirst = requestAnimationFrame(() => {
      this.bossHealthRafFirst = 0;
      this.bossHealthRafSecond = requestAnimationFrame(() => {
      this.bossHealthRafSecond = 0;
      if (generation !== this.bossHealthGeneration || !this.bossHealthActive || this.bossHealthPanelEl.hidden || this.bossHealthPanelEl.classList.contains('hidden')) return;
      this.bossHealthFillEl.style.width = targetWidth;
      if (mask) {
        mask.style.removeProperty('transition');
        mask.style.left = targetMaskLeft;
        mask.style.width = targetMaskWidth;
      }
      });
    });
    this.bossHealthRevealTimer = window.setTimeout(() => {
      if (generation !== this.bossHealthGeneration || !this.bossHealthActive) return;
      this.bossHealthPanelEl.classList.remove('boss-health-reveal');
      this.bossHealthRevealTimer = null;
    }, 1350);
  }

  public updateBossHealth(health: number, maxHealth: number): void {
    if (!this.bossHealthActive || this.bossHealthPanelEl.hidden || this.bossHealthPanelEl.classList.contains('hidden')) return;
    const safeMax = Math.max(1, maxHealth);
    const safeHealth = Math.max(0, Math.min(safeMax, health));
    const ratio = safeHealth / safeMax;
    this.bossHealthFillEl.style.width = `${ratio * 100}%`;
    this.bossHealthFillEl.style.setProperty('--boss-health-color', healthFillColor(ratio));
    const mask = this.bossHealthPanelEl.querySelector<HTMLElement>('.boss-health-mask');
    if (mask) {
      const barLeft = 32.15;
      const barWidth = 56.1;
      mask.style.left = `${barLeft + barWidth * ratio}%`;
      mask.style.width = `${barWidth * (1 - ratio)}%`;
    }
    this.bossHealthFillEl.parentElement?.setAttribute('aria-valuenow', String(Math.ceil(safeHealth)));
    this.bossHealthFillEl.parentElement?.setAttribute('aria-valuemax', String(safeMax));
  }

  public hideBossHealth(): void {
    this.bossEncounterToken = null;
    this.bossHealthActive = false;
    this.bossHealthGeneration++;
    this.cancelBossHealthReveal();
    this.bossHealthPanelEl.hidden = true;
    this.bossHealthPanelEl.classList.add('hidden');
    this.bossHealthPanelEl.classList.remove('boss-health-reveal');
    this.bossHealthFillEl.style.width = '0%';
    const mask = this.bossHealthPanelEl.querySelector<HTMLElement>('.boss-health-mask');
    if (mask) {
      mask.style.left = '32.15%';
      mask.style.width = '56.1%';
    }
    this.bossHealthFillEl.style.removeProperty('--boss-health-color');
    const progress = this.bossHealthFillEl.parentElement;
    progress?.setAttribute('aria-valuenow', '0');
    progress?.setAttribute('aria-valuemax', '1');
    progress?.removeAttribute('aria-valuetext');
  }

  private cancelBossHealthReveal(): void {
    if (this.bossHealthRafFirst) cancelAnimationFrame(this.bossHealthRafFirst);
    if (this.bossHealthRafSecond) cancelAnimationFrame(this.bossHealthRafSecond);
    this.bossHealthRafFirst = 0;
    this.bossHealthRafSecond = 0;
    if (this.bossHealthRevealTimer !== null) window.clearTimeout(this.bossHealthRevealTimer);
    this.bossHealthRevealTimer = null;
  }

  private openBossHealthPanel(): void {
    this.bossHealthPanelEl.hidden = false;
    this.bossHealthPanelEl.classList.remove('hidden');
  }

  // Cached values to avoid redundant DOM operations
  private lastHp = -1;
  private lastMaxHp = -1;
  private lastMp = -1;
  private lastMaxMp = -1;
  private lastCoins = -1;
  private hpImpactTimer = 0;

  /**
   * HP bar with dynamic color: green (high) → orange (medium) → red (low)
   * Transitions are smooth via CSS transition on background and box-shadow.
   */
  public setHealth(hp: number, maxHp = 100): void {
    const safeHp = Math.max(0, Math.ceil(hp));
    if (safeHp === this.lastHp && maxHp === this.lastMaxHp) return;
    if (this.lastHp >= 0 && safeHp < this.lastHp) this.flashHealthBarImpact();
    this.lastHp = safeHp;
    this.lastMaxHp = maxHp;

    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    this.hpBarFillEl.style.clipPath = `inset(0 ${100 - pct}% 0 0 round 999px)`;
    this.hpBarFillEl.style.background = healthFillColor(pct / 100);
    this.hpBarFillEl.setAttribute('aria-valuenow', String(safeHp));
    this.hpBarFillEl.setAttribute('aria-valuemax', String(maxHp));
    this.hpBarFillEl.parentElement?.setAttribute('aria-valuenow', String(safeHp));
    this.hpBarFillEl.parentElement?.setAttribute('aria-valuemax', String(maxHp));

    const hpTextEl = document.getElementById('hp-text');
    if (hpTextEl) hpTextEl.textContent = `${safeHp} / ${maxHp}`;
  }

  private flashHealthBarImpact(): void {
    this.hpBarFillEl.classList.remove('hp-impact-flash');
    void this.hpBarFillEl.offsetWidth;
    this.hpBarFillEl.classList.add('hp-impact-flash');
    window.clearTimeout(this.hpImpactTimer);
    this.hpImpactTimer = window.setTimeout(() => this.hpBarFillEl.classList.remove('hp-impact-flash'), 520);
  }

  public setLives(lives: number): void {
    if (!this.lifeCountEl) return;
    const safeLives = Math.max(0, Math.floor(lives));
    this.lifeCountEl.textContent = `×${safeLives}`;
    this.lifeCountEl.setAttribute('aria-label', `Vidas restantes: ${safeLives}`);
  }

  public showDodgeWarning(active: boolean): void {
    this.dodgeWarningEl?.classList.toggle('hidden', !active);
  }

  public setMana(mp: number, maxMp = 100): void {
    const safeMp = Math.max(0, Math.ceil(mp));
    if (safeMp === this.lastMp && maxMp === this.lastMaxMp) return;
    this.lastMp = safeMp;
    this.lastMaxMp = maxMp;

    const pct = Math.max(0, Math.min(100, (mp / maxMp) * 100));
    this.mpBarFillEl.style.width = 'calc(100% - 4px)';
    this.mpBarFillEl.style.clipPath = `inset(0 ${100 - pct}% 0 0 round 999px)`;
    const mpTextEl = document.getElementById('mp-text');
    if (mpTextEl) mpTextEl.textContent = `${safeMp} / ${maxMp}`;
    this.mpBarFillEl.parentElement?.setAttribute('aria-valuenow', String(safeMp));
    this.mpBarFillEl.parentElement?.setAttribute('aria-valuemax', String(maxMp));
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

  public setCollectedKeys(ids: string[], animateNewlyAcquired = true): void {
    if (!this.collectedKeysEl) return;
    const uniqueIds = [...new Set(ids)].filter((id) => !!KEY_ASSETS[id as ProgressKeyId]);
    this.collectedKeysEl.replaceChildren();
    this.collectedKeysEl.setAttribute('aria-label', uniqueIds.length
      ? `Llaves obtenidas: ${uniqueIds.map((id) => KEY_ASSETS[id as ProgressKeyId]!.name).join(', ')}`
      : 'Todavía no has obtenido llaves');

    const acquired = new Set(uniqueIds);
    const ordered = Object.entries(KEY_ASSETS)
      .filter((entry): entry is [ProgressKeyId, NonNullable<typeof entry[1]>] => !!entry[1])
      .sort((a, b) => a[1].slotIndex - b[1].slotIndex);
    ordered.forEach(([id, asset]) => {
      const slot = document.createElement('span');
      const unlocked = acquired.has(id);
      slot.className = `imperial-key-socket ${unlocked ? 'is-unlocked' : 'is-locked'}`;
      slot.dataset.keyId = id;
      slot.title = asset.name;
      if (unlocked) {
        const icon = document.createElement('img');
        icon.src = asset.iconUrl;
        icon.alt = asset.name;
        icon.loading = 'eager';
        icon.decoding = 'async';
        slot.appendChild(icon);
        if (animateNewlyAcquired && !this.collectedKeyIds.has(id)) {
          slot.classList.add('key-unlock-flash');
          window.setTimeout(() => slot.classList.remove('key-unlock-flash'), 800);
        }
      } else {
        slot.setAttribute('aria-label', `${asset.name}, bloqueada`);
        slot.innerHTML = '<svg class="imperial-key-lock" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.25 10V7.2a4.75 4.75 0 0 1 9.5 0V10"/><rect x="5.5" y="10" width="13" height="10.5" rx="1.8"/><circle cx="12" cy="15" r="1.15"/><path d="M12 16v2"/></svg>';
      }
      this.collectedKeysEl!.appendChild(slot);
    });
    this.collectedKeyIds = acquired;
    this.collectedKeysEl.classList.add('has-keys');
  }

  public setManekiNekoOwned(owned: boolean, animate = false): void {
    if (!this.manekiNekoSlotEl || !this.manekiNekoIconEl) return;
    if (owned && !this.manekiNekoIconEl.getAttribute('src')) {
      this.manekiNekoIconEl.src = `${import.meta.env.BASE_URL}assets/quest/maneki_neko.png`;
    }
    this.manekiNekoSlotEl.classList.toggle('hidden', !owned);
    this.manekiNekoSlotEl.setAttribute('aria-hidden', String(!owned));
    this.manekiNekoIconEl.alt = owned ? 'Maneki Neko — Amuleto del Gato de la Abundancia' : '';
    if (owned && animate) {
      this.manekiNekoSlotEl.classList.remove('maneki-neko-arrive');
      void this.manekiNekoSlotEl.offsetWidth;
      this.manekiNekoSlotEl.classList.add('maneki-neko-arrive');
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
    return usesTouchControls();
  }

  public showInteractionPrompt(label: string): void {
    this.interactionPromptRequested = true;
    if (this.isTouchDevice()) {
      const isActionPrompt = /\[E\]/i.test(label) || /^(Abrir|Hablar|Recoger|Tomar|Activar)\b/i.test(label);
      if (/\[E\]/i.test(label)) {
        label = label.replace(/\[E\]/gi, '').replace(/^\s*Presiona\s*/i, '').replace(/^\s*para\s+/i, '');
        label = `Pulsa Acción para ${label.charAt(0).toLowerCase()}${label.slice(1)}`;
      } else if (/^(Abrir|Hablar|Recoger|Tomar|Activar)\b/i.test(label)) {
        label = `Pulsa Acción para ${label.charAt(0).toLowerCase()}${label.slice(1)}`;
      }
      this.setMobileActionHighlight(isActionPrompt);
    }
    this.interactionLabelEl.textContent = label;
    this.interactionPromptEl.classList.remove('hidden');
  }

  public hideInteractionPrompt(): void {
    this.interactionPromptRequested = false;
    this.interactionPromptEl.classList.add('hidden');
    this.setMobileActionHighlight(false);
  }

  public beginInteractionFrame(): void {
    this.interactionPromptRequested = false;
  }

  public endInteractionFrame(): void {
    if (!this.interactionPromptRequested) this.hideInteractionPrompt();
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
  public showTypewriterDialogue(speaker: string, text: string, onComplete?: () => void, presentation: CinematicDialogueOptions = {}): void {
    this.clearDialogueChoiceState();
    this.clearDialogueTapHandler();
    window.clearTimeout(this.missionNoticeTimer);
    this.cinematicDialogueUI.show(speaker, presentation);
    this.dialogueTextEl.textContent = '';
    
    if (this.typewriterInterval) {
      clearInterval(this.typewriterInterval);
    }

    let charIndex = 0;
    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      if (this.typewriterInterval) window.clearInterval(this.typewriterInterval);
      this.typewriterInterval = null;
      this.dialogueTextEl.textContent = text;
      this.dialogueBubbleEl.removeEventListener('click', handleTap);
      this.dialogueBubbleEl.removeEventListener('touchstart', handleTap);
      if (this.dialogueTapHandler === handleTap) this.dialogueTapHandler = null;
      onComplete?.();
    };
    this.typewriterInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.dialogueTextEl.textContent += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        this.dialogueBubbleEl.removeEventListener('click', handleTap);
        this.dialogueBubbleEl.removeEventListener('touchstart', handleTap);
        if (this.dialogueTapHandler === handleTap) this.dialogueTapHandler = null;
        if (!completed) {
          completed = true;
          onComplete?.();
        }
      }
    }, 35);

    // Touch tap / click listener on dialogue bubble to immediately finish text & advance
    const handleTap = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      finish();
    };

    this.dialogueBubbleEl.addEventListener('click', handleTap, { once: true });
    this.dialogueBubbleEl.addEventListener('touchstart', handleTap, { once: true });
    this.dialogueTapHandler = handleTap;
  }

  private clearDialogueTapHandler(): void {
    if (!this.dialogueTapHandler) return;
    this.dialogueBubbleEl.removeEventListener('click', this.dialogueTapHandler);
    this.dialogueBubbleEl.removeEventListener('touchstart', this.dialogueTapHandler);
    this.dialogueTapHandler = null;
  }

  public hideDialogue(): void {
    this.cinematicDialogueUI.hide();
    this.clearDialogueTapHandler();
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.typewriterInterval = null;
    this.clearDialogueChoiceState();
    window.clearTimeout(this.missionNoticeTimer);
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

/** One solid color across the health fill, interpolated from actual health. */
function healthFillColor(ratio: number): string {
  const stops = [
    { at: 0.10, rgb: [235, 48, 48] },
    { at: 0.25, rgb: [255, 137, 36] },
    { at: 0.50, rgb: [255, 218, 61] },
    { at: 0.75, rgb: [174, 220, 65] },
    { at: 1.00, rgb: [54, 208, 95] },
  ];
  const value = Math.max(0, Math.min(1, ratio));
  if (value <= stops[0].at) return `rgb(${stops[0].rgb.join(',')})`;
  for (let i = 1; i < stops.length; i++) {
    const low = stops[i - 1], high = stops[i];
    if (value <= high.at) {
      const t = (value - low.at) / (high.at - low.at);
      const rgb = low.rgb.map((channel, index) => Math.round(channel + (high.rgb[index] - channel) * t));
      return `rgb(${rgb.join(',')})`;
    }
  }
  return 'rgb(54,208,95)';
}
