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
  }

  public showGameplayHUD(): void {
    this.hudTopLeftEl.classList.remove('hidden');
    this.hudTopRightEl.classList.remove('hidden');
    this.spellHotbarEl.classList.remove('hidden');
  }



  public setHealth(hp: number, maxHp = 100): void {
    const safeHp = Math.max(0, Math.ceil(hp));
    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    this.hpBarFillEl.style.width = `${pct}%`;
    const hpTextEl = document.getElementById('hp-text');
    if (hpTextEl) hpTextEl.textContent = `${safeHp} / ${maxHp}`;
  }

  public setMana(mp: number, maxMp = 100): void {
    const safeMp = Math.max(0, Math.ceil(mp));
    const pct = Math.max(0, Math.min(100, (mp / maxMp) * 100));
    this.mpBarFillEl.style.width = `${pct}%`;
    const mpTextEl = document.getElementById('mp-text');
    if (mpTextEl) mpTextEl.textContent = `${safeMp} / ${maxMp}`;
  }

  public setCoinCount(count: number): void {
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

  public setObjective(text: string): void {
    if (text) {
      this.objectiveContainerEl.classList.remove('hidden');
      this.objectiveTextEl.textContent = text;
    } else {
      this.objectiveContainerEl.classList.add('hidden');
    }
  }

  public setCardCount(count: number, total = 3): void {
    if (this.cardCounterEl) {
      this.cardCounterEl.textContent = `${count} / ${total}`;
    }
  }

  public showInteractionPrompt(label: string): void {
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

  // Typewriter Dialogue Effect
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
    }, 40); // 40ms per character
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
}
