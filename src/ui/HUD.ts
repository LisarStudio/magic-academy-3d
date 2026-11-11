import * as THREE from 'three';
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
  private staminaMeterEl: HTMLElement | null = null;
  private staminaMeterFillEl: SVGPathElement | null = null;
  private staminaTipEl: SVGCircleElement | null = null;
  private staminaGradientStops: SVGStopElement[] = [];
  private staminaDisplayed = false;
  private lastStaminaColorStep = -1;
  private readonly staminaAnchor = new THREE.Vector3();
  private readonly staminaCameraRight = new THREE.Vector3();
  private staffChargeMeterEl: HTMLElement | null = null;
  private staffChargeFillEl: HTMLElement | null = null;
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
  private infoToastEl: HTMLElement;
  private infoToastSpeakerEl: HTMLElement;
  private infoToastTextEl: HTMLElement;
  private infoToastTimer: number | null = null;
  private infoToastHideTimer: number | null = null;
  private infoToastPriority = 0;
  private infoToastVisible = false;
  private queuedInfoToast: { speaker: string; text: string; durationMs: number; priority: number } | null = null;

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
    this.createStaminaMeter();
    this.staffChargeMeterEl = document.getElementById('staff-charge-meter');
    this.staffChargeFillEl = document.getElementById('staff-charge-fill');
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
    this.infoToastEl = document.createElement('aside');
    this.infoToastEl.id = 'hud-info-toast';
    this.infoToastEl.className = 'hud-info-toast hidden';
    this.infoToastEl.setAttribute('role', 'status');
    this.infoToastEl.setAttribute('aria-live', 'polite');
    this.infoToastEl.setAttribute('aria-hidden', 'true');
    this.infoToastSpeakerEl = document.createElement('strong');
    this.infoToastSpeakerEl.className = 'hud-info-toast-speaker';
    this.infoToastTextEl = document.createElement('span');
    this.infoToastTextEl.className = 'hud-info-toast-text';
    this.infoToastEl.append(this.infoToastSpeakerEl, this.infoToastTextEl);
    document.getElementById('ui-overlay')?.appendChild(this.infoToastEl);
    this.createLetterChallengeSlots();
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('hudDebug')) {
      this.hudTopLeftEl.dataset.hudComponent = 'HUD.ts#hud-top-left';
      this.letterChallengePanelEl.dataset.hudComponent = 'HUD.ts#letter-challenge-hud';
      console.info('[HUD debug]', {
        component: 'src/ui/HUD.ts',
        player: this.hudTopLeftEl.id,
        challenge: this.letterChallengePanelEl.id,
        stylesheet: 'src/style.css',
      });
    }

    this.initAudioSliders();
    this.initPauseButton();
    this.initPauseKeyboardNavigation();
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
        this.updatePauseSliderKnob(this.sliderMusicEl!, val);
        const game = (window as any).gameInstance;
        if (game) game.updatePauseAudioPreferences(val / 100, Number(this.sliderFxEl?.value ?? 80) / 100);
      });
    }

    if (this.sliderFxEl) {
      this.sliderFxEl.addEventListener('input', () => {
        const val = parseInt(this.sliderFxEl!.value, 10);
        if (this.fxVolTextEl) this.fxVolTextEl.textContent = `${val}%`;
        const audioMgr = (window as any).gameInstance?.audioManager;
        if (audioMgr) audioMgr.setSFXVolume(val / 100);
        this.updatePauseSliderKnob(this.sliderFxEl!, val);
        const game = (window as any).gameInstance;
        if (game) game.updatePauseAudioPreferences(Number(this.sliderMusicEl?.value ?? 50) / 100, val / 100);
      });
    }
  }

  private updatePauseSliderKnob(slider: HTMLInputElement, value: number): void {
    slider.parentElement?.style.setProperty('--slider-progress', `${Math.max(0, Math.min(100, value))}%`);
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

  private initPauseKeyboardNavigation(): void {
    window.addEventListener('keydown', (event) => {
      if (this.pauseScreenEl.classList.contains('hidden')) return;
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === 'range') return;
      if (event.code !== 'ArrowDown' && event.code !== 'ArrowUp') return;

      const confirmation = document.getElementById('pause-return-confirm');
      const inConfirmation = !!confirmation && !confirmation.classList.contains('hidden');
      const actions = Array.from((inConfirmation ? confirmation : this.pauseScreenEl)
        .querySelectorAll<HTMLButtonElement>(inConfirmation ? '.pause-confirm-card button' : '.pause-navigation button'))
        .filter((button) => !button.disabled);
      if (!actions.length) return;

      event.preventDefault();
      const current = actions.indexOf(document.activeElement as HTMLButtonElement);
      const step = event.code === 'ArrowDown' ? 1 : -1;
      actions[(current + step + actions.length) % actions.length]?.focus({ preventScroll: true });
    });
  }

  public showPauseMenu(visible: boolean): void {
    this.staminaMeterEl?.classList.toggle('is-paused', visible);
    if (visible) {
      this.pauseScreenEl.classList.remove('hidden');
      const audio = (window as any).gameInstance?.audioManager;
      const music = this.sliderMusicEl;
      const effects = this.sliderFxEl;
      if (music && audio) {
        const value = Math.round(audio.getMusicVolume() * 100);
        music.value = String(value);
        if (this.musicVolTextEl) this.musicVolTextEl.textContent = `${value}%`;
        this.updatePauseSliderKnob(music, value);
      }
      if (effects && audio) {
        const value = Math.round(audio.getSFXVolume() * 100);
        effects.value = String(value);
        if (this.fxVolTextEl) this.fxVolTextEl.textContent = `${value}%`;
        this.updatePauseSliderKnob(effects, value);
      }
      this.equipmentViewer?.onPauseOpened();
      window.requestAnimationFrame(() => document.getElementById('btn-resume')?.focus({ preventScroll: true }));
    } else {
      this.pauseScreenEl.classList.add('hidden');
      document.getElementById('pause-return-confirm')?.classList.add('hidden');
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
    const pickedUp = this.lastCoins >= 0 && count > this.lastCoins;
    this.lastCoins = count;

    if (this.coinCounterEl) {
      this.coinCounterEl.textContent = count.toString() + ' / 50';
      const container = document.getElementById('coin-counter-container');
      if (container) {
        container.style.removeProperty('display');
        container.classList.remove('hidden');
      }
      if (pickedUp && container) {
        container.classList.remove('coin-pickup-pop');
        void container.offsetWidth;
        container.classList.add('coin-pickup-pop');
        window.setTimeout(() => container.classList.remove('coin-pickup-pop'), 380);
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

  public setStamina(value: number, maxValue: number, visible: boolean): void {
    const meter = this.staminaMeterEl;
    const fill = this.staminaMeterFillEl;
    if (!meter || !fill) return;
    const max = Math.max(1, maxValue);
    const safeValue = Math.max(0, Math.min(max, value));
    const ratio = safeValue / max;
    const recovering = !visible && ratio < 0.999;
    this.staminaDisplayed = visible || recovering;
    meter.classList.toggle('is-visible', visible);
    meter.classList.toggle('is-recovering', recovering);
    meter.classList.toggle('is-low', ratio <= 0.25);
    meter.setAttribute('aria-valuenow', String(Math.round(safeValue)));
    meter.setAttribute('aria-hidden', String(!visible));
    fill.setAttribute('stroke-dashoffset', String((1 - ratio) * 100));
    // The fill path starts at the lower end and travels upward. Keep its
    // moving edge at the remaining-energy boundary: full at the top, then
    // descending smoothly as sprint stamina is spent.
    const t = ratio;
    const u = 1 - t;
    const tipX = u * u * u * 33 + 3 * u * u * t * 10 + 3 * u * t * t * 11 + t * t * t * 34;
    const tipY = u * u * u * 84 + 3 * u * u * t * 69 + 3 * u * t * t * 17 + t * t * t * 5;
    this.staminaTipEl?.setAttribute('cx', tipX.toFixed(2));
    this.staminaTipEl?.setAttribute('cy', tipY.toFixed(2));

    // Shift the whole amber-to-red gradient toward red as stamina runs out.
    // Quantizing to 5% avoids needless style churn while retaining a smooth look.
    const colorStep = Math.round(ratio * 20);
    if (colorStep !== this.lastStaminaColorStep) {
      this.lastStaminaColorStep = colorStep;
      const exhausted = 1 - colorStep / 20;
      const blend = (start: number[], end: number[]) => `rgb(${start.map((channel, index) => Math.round(channel + (end[index]! - channel) * exhausted)).join(' ')})`;
      this.staminaGradientStops[0]?.style.setProperty('stop-color', blend([255, 224, 138], [255, 74, 45]));
      this.staminaGradientStops[1]?.style.setProperty('stop-color', blend([255, 133, 39], [218, 25, 40]));
    }
  }

  /** Keep the curved sprint gauge in screen space beside Wukong, following
   * the live camera projection rather than occupying the coin HUD. */
  public updateStaminaAnchor(player: THREE.Object3D, camera: THREE.Camera, canvas: HTMLCanvasElement): void {
    if (!this.staminaDisplayed || !this.staminaMeterEl) return;
    player.getWorldPosition(this.staminaAnchor);
    this.staminaAnchor.y += 1.05;
    camera.updateMatrixWorld(true);
    this.staminaCameraRight.setFromMatrixColumn(camera.matrixWorld, 0);
    // Place it on the opposite screen side from the previous implementation,
    // with the open side of the arc facing Wukong.
    this.staminaAnchor.addScaledVector(this.staminaCameraRight, -0.72).project(camera);
    if (this.staminaAnchor.z < -1 || this.staminaAnchor.z > 1 || Math.abs(this.staminaAnchor.x) > 1.18 || Math.abs(this.staminaAnchor.y) > 1.18) {
      this.staminaMeterEl.classList.add('is-offscreen');
      return;
    }
    this.staminaMeterEl.classList.remove('is-offscreen');
    const bounds = canvas.getBoundingClientRect();
    const x = bounds.left + (this.staminaAnchor.x + 1) * 0.5 * bounds.width;
    const y = bounds.top + (1 - this.staminaAnchor.y) * 0.5 * bounds.height;
    this.staminaMeterEl.style.left = `${Math.max(bounds.left + 24, Math.min(bounds.right - 24, x))}px`;
    this.staminaMeterEl.style.top = `${Math.max(bounds.top + 48, Math.min(bounds.bottom - 48, y))}px`;
  }

  private createStaminaMeter(): void {
    const meter = document.createElement('div');
    meter.id = 'stamina-meter';
    meter.className = 'stamina-meter';
    meter.setAttribute('role', 'progressbar');
    meter.setAttribute('aria-label', 'Resistencia para correr');
    meter.setAttribute('aria-valuemin', '0');
    meter.setAttribute('aria-valuemax', '100');
    meter.setAttribute('aria-valuenow', '100');
    meter.setAttribute('aria-hidden', 'true');
    meter.innerHTML = `<svg viewBox="0 0 46 90" aria-hidden="true" focusable="false">
      <defs><linearGradient id="stamina-arc-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop class="stamina-gradient-top" offset="0" stop-color="#ffe08a" />
        <stop class="stamina-gradient-bottom" offset="1" stop-color="#ff8527" />
      </linearGradient><filter id="stamina-arc-glow" x="-100%" y="-40%" width="300%" height="180%"><feGaussianBlur stdDeviation="2.4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <path class="stamina-arc-halo" d="M34 5 C11 17 10 69 33 84" />
      <path class="stamina-arc-track" d="M34 5 C11 17 10 69 33 84" />
      <path id="stamina-meter-fill" class="stamina-meter-fill" d="M33 84 C10 69 11 17 34 5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0" />
      <circle class="stamina-arc-tip" cx="34" cy="5" r="2.5" />
    </svg>`;
    this.staminaMeterEl = meter;
    this.staminaMeterFillEl = meter.querySelector<SVGPathElement>('#stamina-meter-fill');
    this.staminaTipEl = meter.querySelector<SVGCircleElement>('.stamina-arc-tip');
    this.staminaGradientStops = Array.from(meter.querySelectorAll<SVGStopElement>('.stamina-gradient-top, .stamina-gradient-bottom'));
    document.getElementById('ui-overlay')?.appendChild(meter);
  }

  public setStaffCharge(visible: boolean, ratio: number): void {
    const meter = this.staffChargeMeterEl;
    const fill = this.staffChargeFillEl;
    if (!meter || !fill) return;
    const progress = Math.max(0, Math.min(1, ratio));
    meter.classList.toggle('is-visible', visible);
    meter.classList.toggle('is-ready', visible && progress >= 1);
    meter.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    meter.setAttribute('aria-hidden', String(!visible));
    fill.style.width = `${progress * 100}%`;
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
    if (this.infoToastVisible) {
      this.hideInteractionPrompt();
      return;
    }
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

  /** Show a compact, non-interactive side message without using narrative subtitles. */
  public showInfoToast(speaker: string, text: string, durationMs = 3600, priority = 1): void {
    const message = { speaker, text, durationMs, priority };
    if (this.infoToastVisible && priority < this.infoToastPriority) {
      if (!this.queuedInfoToast || priority >= this.queuedInfoToast.priority) this.queuedInfoToast = message;
      return;
    }
    this.displayInfoToast(message);
  }

  private displayInfoToast(message: { speaker: string; text: string; durationMs: number; priority: number }): void {
    if (this.infoToastTimer !== null) window.clearTimeout(this.infoToastTimer);
    if (this.infoToastHideTimer !== null) window.clearTimeout(this.infoToastHideTimer);
    this.infoToastTimer = null;
    this.infoToastHideTimer = null;
    this.infoToastPriority = message.priority;
    this.infoToastVisible = true;
    this.infoToastSpeakerEl.textContent = message.speaker;
    this.infoToastTextEl.textContent = message.text;
    this.infoToastEl.classList.remove('hidden', 'is-visible', 'is-right');
    this.infoToastEl.setAttribute('aria-hidden', 'false');
    const leftOverlaps = this.infoToastOverlapsVisibleUI('left');
    const rightOverlaps = this.infoToastOverlapsVisibleUI('right');
    this.infoToastEl.classList.toggle('is-right', leftOverlaps && !rightOverlaps);
    if (leftOverlaps && rightOverlaps) {
      // Choose the clearer side if both are occupied, while keeping the toast
      // out of touch controls and existing HUD/dialogue regions.
      this.infoToastEl.classList.toggle('is-right', this.infoToastOverlapScore('right') < this.infoToastOverlapScore('left'));
    }
    // Commit the hidden-state layout before enabling the transition; unlike a
    // deferred RAF this still animates correctly in paused/background tabs.
    this.infoToastEl.getBoundingClientRect();
    this.infoToastEl.classList.add('is-visible');
    this.hideInteractionPrompt();
    this.infoToastTimer = window.setTimeout(() => {
      this.infoToastEl.classList.remove('is-visible');
      this.infoToastHideTimer = window.setTimeout(() => {
        this.infoToastEl.classList.add('hidden');
        this.infoToastEl.setAttribute('aria-hidden', 'true');
        this.infoToastVisible = false;
        this.infoToastPriority = 0;
        this.infoToastTimer = null;
        this.infoToastHideTimer = null;
        const queued = this.queuedInfoToast;
        this.queuedInfoToast = null;
        if (queued) this.displayInfoToast(queued);
      }, 190);
    }, Math.max(1000, message.durationMs));
  }

  private infoToastOverlapsVisibleUI(side: 'left' | 'right'): boolean {
    this.infoToastEl.classList.toggle('is-right', side === 'right');
    const toastRect = this.infoToastEl.getBoundingClientRect();
    return this.infoToastGetObstacles().some((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && toastRect.left < rect.right && toastRect.right > rect.left &&
        toastRect.top < rect.bottom && toastRect.bottom > rect.top;
    });
  }

  private infoToastOverlapScore(side: 'left' | 'right'): number {
    this.infoToastEl.classList.toggle('is-right', side === 'right');
    const toastRect = this.infoToastEl.getBoundingClientRect();
    return this.infoToastGetObstacles().reduce((score, element) => {
      const rect = element.getBoundingClientRect();
      const width = Math.max(0, Math.min(toastRect.right, rect.right) - Math.max(toastRect.left, rect.left));
      const height = Math.max(0, Math.min(toastRect.bottom, rect.bottom) - Math.max(toastRect.top, rect.top));
      return score + width * height;
    }, 0);
  }

  private infoToastGetObstacles(): HTMLElement[] {
    const selectors = [
      '#hud-top-left:not(.hidden)', '#hud-top-right:not(.hidden)', '#objective-container:not(.hidden)',
      '#objective-mini-icon.visible', '#touch-joystick-zone', '#touch-action-zone',
      '#interaction-prompt:not(.hidden)', '#letter-challenge-hud:not(.hidden)',
      '#boss-health-panel:not(.hidden)', '#dialogue-bubble:not(.hidden)', '#subtitle-box:not(.hidden)'
    ].join(',');
    return Array.from(document.querySelectorAll<HTMLElement>(selectors)).filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;
    });
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
      document.removeEventListener('pointerdown', handleTap, true);
      if (this.dialogueTapHandler === handleTap) this.dialogueTapHandler = null;
      onComplete?.();
      // Some dialogue callbacks only reveal choices (or leave a final line on
      // screen). Keep a second tap available to dismiss those lines, unless
      // the callback installed the next line's own handler or closed the UI.
      if (!this.dialogueTapHandler && this.cinematicDialogueUI.isOpen()) {
        document.addEventListener('pointerdown', handleTap, true);
        this.dialogueTapHandler = handleTap;
      }
    };
    this.typewriterInterval = setInterval(() => {
      if (charIndex < text.length) {
        this.dialogueTextEl.textContent += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        this.typewriterInterval = null;
        if (!completed) {
          completed = true;
          onComplete?.();
        }
      }
    }, 35);

    // Let a tap anywhere in the scene advance the active line. Once typing has
    // finished, the next non-button tap dismisses the completed dialogue.
    const handleTap = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, input, select, textarea, a, [data-dialogue-no-skip]')) return;
      e.preventDefault();
      e.stopPropagation();
      if (completed) {
        if (this.dialogueChoices.length > 0) return;
        this.hideDialogue();
      } else {
        finish();
      }
    };

    document.addEventListener('pointerdown', handleTap, true);
    this.dialogueTapHandler = handleTap;
  }

  private clearDialogueTapHandler(): void {
    if (!this.dialogueTapHandler) return;
    document.removeEventListener('pointerdown', this.dialogueTapHandler, true);
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
    const duration = Math.max(0, durationMs);
    const element = this.screenFadeEl;
    element.classList.remove('hidden');
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.transition = 'none';
    element.style.opacity = '0';
    // Commit a transparent start frame; the hidden class also sets display:none.
    void element.offsetWidth;
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '1';
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  public fadeScreenIn(durationMs: number = 1000): Promise<void> {
    const duration = Math.max(0, durationMs);
    const element = this.screenFadeEl;
    element.classList.remove('hidden');
    element.style.display = 'block';
    element.style.visibility = 'visible';
    element.style.transition = 'none';
    element.style.opacity = '1';
    void element.offsetWidth;
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';
    return new Promise(resolve => setTimeout(() => {
      element.classList.add('hidden');
      element.style.removeProperty('display');
      element.style.removeProperty('visibility');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transition');
      resolve();
    }, duration));
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
