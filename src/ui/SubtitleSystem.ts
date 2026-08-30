export class SubtitleSystem {
  private boxEl: HTMLElement;
  private speakerEl: HTMLElement;
  private textEl: HTMLElement;

  private queue: Array<{ speaker: string; text: string; durationMs: number }> = [];
  private isProcessing = false;
  private timeoutId: any = null;

  constructor() {
    this.boxEl = document.getElementById('subtitle-box')!;
    this.speakerEl = document.getElementById('subtitle-speaker')!;
    this.textEl = document.getElementById('subtitle-text')!;
  }

  public show(speaker: string, text: string, durationMs: number = 4500): void {
    // Add message to the queue
    this.queue.push({ speaker, text, durationMs });
    this.processQueue();
  }

  private processQueue(): void {
    if (this.isProcessing) return;

    if (this.queue.length === 0) {
      this.hide();
      return;
    }

    this.isProcessing = true;
    const msg = this.queue.shift()!;

    this.speakerEl.textContent = msg.speaker;
    this.textEl.textContent = msg.text;
    this.boxEl.classList.remove('hidden');

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isProcessing = false;
      this.processQueue();
    }, msg.durationMs);
  }

  public hide(): void {
    this.boxEl.classList.add('hidden');
    this.isProcessing = false;
    this.queue = [];
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
