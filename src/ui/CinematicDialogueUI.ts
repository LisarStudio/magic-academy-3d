import { Vector3, type Camera, type Object3D } from 'three';

export type DialoguePlacement = 'auto' | 'top' | 'bottom';

export interface DialogueFocusPoint {
  x: number;
  y: number;
  weight?: number;
}

export interface CinematicDialogueOptions {
  portraitUrl?: string;
  portraitAlt?: string;
  placement?: DialoguePlacement;
  type?: 'npc' | 'mission' | 'cinematic' | 'boss' | 'reward' | 'narrative';
  cameraBehavior?: { onOpen?: () => void; onClose?: () => void };
  onAfterDialogue?: () => void;
  /** Normalized viewport points for the speaker, player, boss, or camera focus. */
  focusPoints?: DialogueFocusPoint[];
}

export function projectDialogueFocus(object: Object3D | null | undefined, camera: Camera | null | undefined, yOffset = 1.25, weight = 1.8): DialogueFocusPoint[] {
  if (!object || !camera) return [];
  object.updateWorldMatrix(true, false);
  camera.updateMatrixWorld(true);
  const point = object.getWorldPosition(new Vector3()).add(new Vector3(0, yOffset, 0)).project(camera);
  if (!Number.isFinite(point.x + point.y + point.z) || point.z < -1 || point.z > 1) return [];
  return [{ x: (point.x + 1) / 2, y: (1 - point.y) / 2, weight }];
}

/** Single shared dialogue panel with event-driven, collision-aware placement. */
export class CinematicDialogueUI {
  private readonly panel: HTMLElement;
  private readonly speaker: HTMLElement;
  private readonly portrait: HTMLImageElement | null;
  private readonly fallback: HTMLElement | null;
  private resizeFrame = 0;
  private recalcTimer = 0;
  private open = false;
  private resolvedRect: DOMRect | null = null;
  private currentOptions: CinematicDialogueOptions = {};
  private readonly observer: MutationObserver | null;

  constructor(panel: HTMLElement, speaker: HTMLElement) {
    this.panel = panel;
    this.speaker = speaker;
    this.portrait = panel.querySelector<HTMLImageElement>('[data-dialogue-portrait]');
    this.fallback = panel.querySelector<HTMLElement>('[data-dialogue-portrait-fallback]');
    this.portrait?.addEventListener('error', () => {
      this.portrait!.hidden = true;
      if (this.fallback) this.fallback.hidden = false;
    });
    this.observer = typeof MutationObserver !== 'undefined'
      ? new MutationObserver(() => this.scheduleReposition())
      : null;
    const observed = ['hud-top-left', 'hud-top-right', 'boss-health-panel', 'letter-challenge-hud', 'mobile-controls', 'mobile-touch-overlay']
      .map((id) => document.getElementById(id)).filter((element): element is HTMLElement => !!element);
    observed.forEach((element) => this.observer?.observe(element, { attributes: true, attributeFilter: ['class', 'style', 'hidden', 'aria-hidden'] }));
    window.addEventListener('resize', this.scheduleReposition, { passive: true });
    window.visualViewport?.addEventListener('resize', this.scheduleReposition, { passive: true });
    window.addEventListener('orientationchange', this.scheduleReposition, { passive: true });
  }

  public show(name: string, options: CinematicDialogueOptions = {}): void {
    const previousOpen = this.open;
    this.currentOptions = options;
    if (!previousOpen) options.cameraBehavior?.onOpen?.();
    const skin = this.dialogueSkin(name);
    if (skin) {
      const base = import.meta.env.BASE_URL;
      const artwork = skin === 'silvio-loki' ? 'Silvio_Loki_Dialogue.png'
        : skin === 'gekko' ? 'Gekko_Dialogue.png' : 'Nezha_X_Dialogue.png';
      this.panel.dataset.dialogueSkin = skin;
      this.panel.style.setProperty('--dialogue-artwork', `url("${base}assets/dialogue-huds/${artwork}")`);
    } else {
      delete this.panel.dataset.dialogueSkin;
      this.panel.style.removeProperty('--dialogue-artwork');
    }
    // The provided artwork already includes its exact speaker heading. Keep a
    // matching accessible label in the existing live dialogue markup.
    this.speaker.textContent = skin === 'silvio-loki' ? 'Silvio y Loki'
      : skin === 'gekko' ? 'Gekko' : skin === 'nezha-x' ? 'NEZHA-X' : name;
    const portraitUrl = skin ? undefined : options.portraitUrl ?? this.defaultPortrait(name);
    if (this.portrait) {
      this.portrait.alt = portraitUrl ? (options.portraitAlt ?? `${name}, retrato`) : '';
      this.portrait.hidden = !portraitUrl;
      if (portraitUrl && this.portrait.getAttribute('src') !== portraitUrl) this.portrait.src = portraitUrl;
      if (this.fallback) this.fallback.hidden = !!portraitUrl;
    }
    if (this.fallback) this.fallback.textContent = this.initials(name);
    this.open = true;
    this.panel.classList.remove('hidden');
    this.panel.setAttribute('aria-hidden', 'false');
    this.panel.inert = false;
    this.place();
  }

  public hide(): void {
    if (!this.open) return;
    this.open = false;
    this.panel.classList.add('hidden');
    this.panel.setAttribute('aria-hidden', 'true');
    this.panel.inert = true;
    this.panel.removeAttribute('data-placement');
    this.panel.removeAttribute('data-type');
    delete this.panel.dataset.dialogueSkin;
    this.panel.style.removeProperty('--dialogue-artwork');
    this.currentOptions.cameraBehavior?.onClose?.();
    this.currentOptions.onAfterDialogue?.();
    this.currentOptions = {};
  }

  public isOpen(): boolean { return this.open; }

  private readonly scheduleReposition = (): void => {
    if (!this.open || this.recalcTimer) return;
    this.recalcTimer = window.setTimeout(() => {
      this.recalcTimer = 0;
      if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = 0;
        this.place();
      });
    }, 90);
  };

  private place(): void {
    const requested = this.currentOptions.placement ?? 'auto';
    const selected = requested === 'auto' ? this.resolveDialoguePlacement() : requested;
    this.panel.dataset.placement = selected;
    if (this.currentOptions.type) this.panel.dataset.type = this.currentOptions.type;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const panelHeight = this.panel.getBoundingClientRect().height || 190;
    const margin = (window.innerWidth <= 700 ? 12 : 18);
    const safeTop = this.readSafeInset('top') + margin;
    const safeBottom = this.readSafeInset('bottom') + (window.innerWidth <= 700 ? 12 : 20);
    const top = requested === 'auto' && this.resolvedRect
      ? this.resolvedRect.top
      : selected === 'top' ? safeTop : Math.max(safeTop, viewportHeight - panelHeight - safeBottom);
    this.panel.style.setProperty('--dialogue-y', `${top}px`);
  }

  /** Compare HUD/controls overlap and focal-point obstruction for top and bottom. */
  public resolveDialoguePlacement(): 'top' | 'bottom' {
    const width = window.visualViewport?.width ?? window.innerWidth;
    const height = window.visualViewport?.height ?? window.innerHeight;
    const mobile = width <= 700;
    const measuredPanel = this.panel.getBoundingClientRect();
    const panelWidth = measuredPanel.width || Math.min(width - (mobile ? 20 : 32), mobile ? 580 : Math.min(760, width * 0.46));
    const panelHeight = measuredPanel.height || (mobile ? 220 : 190);
    const safeTop = this.readSafeInset('top') + (mobile ? 10 : 18);
    const safeBottom = this.readSafeInset('bottom') + (mobile ? 12 : 20);
    const obstacles = this.visibleObstacles();
    const candidate = (position: 'top' | 'bottom'): DOMRect => {
      let y = position === 'top' ? safeTop : Math.max(safeTop, height - panelHeight - safeBottom);
      const x = (width - panelWidth) / 2;
      const horizontalMatch = (rect: DOMRect) => rect.right > x && rect.left < x + panelWidth;
      if (position === 'top') {
        for (const obstacle of obstacles) {
          if (horizontalMatch(obstacle.rect) && obstacle.rect.top < height * 0.42 && obstacle.rect.bottom > y) {
            y = Math.min(height * 0.45, Math.max(y, obstacle.rect.bottom + 10));
          }
        }
      } else {
        for (const obstacle of obstacles) {
          if (horizontalMatch(obstacle.rect) && obstacle.rect.bottom > height * 0.58 && obstacle.rect.top < y + panelHeight) {
            y = Math.max(height * 0.55, Math.min(y, obstacle.rect.top - panelHeight - 10));
          }
        }
      }
      return new DOMRect(x, y, panelWidth, panelHeight);
    };
    const score = (position: 'top' | 'bottom'): number => {
      const rect = candidate(position);
      let value = 0;
      const idealY = position === 'top' ? safeTop : Math.max(safeTop, height - panelHeight - safeBottom);
      value += Math.abs(rect.top - idealY) / Math.max(1, height) * 2.5;
      for (const obstacle of obstacles) {
        const area = this.intersectionArea(rect, obstacle.rect);
        if (area > 0) value += area / (rect.width * rect.height) * obstacle.weight;
      }
      for (const point of this.currentOptions.focusPoints ?? []) {
        const x = point.x <= 1 ? point.x * width : point.x;
        const y = point.y <= 1 ? point.y * height : point.y;
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) value += (point.weight ?? 1.5);
        else if (x >= rect.left - 24 && x <= rect.right + 24 && y >= rect.top - 24 && y <= rect.bottom + 24) value += (point.weight ?? 1.5) * 0.45;
      }
      // Leave comfortable space for the mobile action/joystick area.
      if (mobile && position === 'bottom') value += 0.55;
      return value;
    };
    const topScore = score('top');
    const bottomScore = score('bottom');
    const placement = topScore < bottomScore ? 'top' : 'bottom';
    this.resolvedRect = placement === 'top' ? candidate('top') : candidate('bottom');
    return placement;
  }

  private visibleObstacles(): Array<{ rect: DOMRect; weight: number }> {
    const selectors: Array<[string, number]> = [
      ['#hud-top-left', 2.4], ['#hud-top-right', 2.4], ['#boss-health-panel', 3.2],
      ['#letter-challenge-hud', 2.8], ['.mobile-controls', 3.2],
      ['#lisar-mobile-touch-overlay .touch-joystick-zone', 3.2], ['#lisar-mobile-touch-overlay .touch-action-zone', 3.2],
      ['#interaction-prompt:not(.hidden)', 1.4], ['#objective-container:not(.hidden)', 1.2],
    ];
    const result: Array<{ rect: DOMRect; weight: number }> = [];
    for (const [selector, weight] of selectors) {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element || element.hidden || element.classList.contains('hidden') || getComputedStyle(element).display === 'none' || getComputedStyle(element).visibility === 'hidden') continue;
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) result.push({ rect, weight });
    }
    return result;
  }

  private intersectionArea(a: DOMRect, b: DOMRect): number {
    return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  }

  private readSafeInset(edge: 'top' | 'bottom'): number {
    const probe = document.createElement('div');
    probe.style.cssText = `position:fixed;visibility:hidden;padding-${edge}:env(safe-area-inset-${edge});`;
    document.body.appendChild(probe);
    const value = Number.parseFloat(getComputedStyle(probe)[`padding${edge[0].toUpperCase()}${edge.slice(1)}` as 'paddingTop' | 'paddingBottom']) || 0;
    probe.remove();
    return value;
  }

  private defaultPortrait(name: string): string | undefined {
    const normalized = name.toLocaleLowerCase();
    const base = import.meta.env.BASE_URL;
    if (/silv|loki|gemelo/.test(normalized)) return `${base}assets/npc/twin-cats/hud-silvio-loki.png`;
    if (/maneki|gato de la abundancia/.test(normalized)) return `${base}assets/quest/maneki_neko.png`;
    if (/cangrejo|crab/.test(normalized)) return `${base}assets/ui/crab-boss-portrait.png`;
    return undefined;
  }

  private dialogueSkin(name: string): 'silvio-loki' | 'gekko' | 'nezha-x' | null {
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
    if (/silv|loki|gemelo/.test(normalized)) return 'silvio-loki';
    if (/gekko/.test(normalized)) return 'gekko';
    if (/nezha|cangrejo|crab/.test(normalized)) return 'nezha-x';
    return null;
  }

  private initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase() ?? '').join('') || 'NPC';
  }
}
