import type * as THREE from 'three';

type RendererSample = {
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number | null;
};

type PerformanceSample = {
  elapsedSeconds: number;
  fpsAverage: number;
  frameMsP95: number;
  jsHeapUsedBytes: number | null;
  renderer: RendererSample;
  state: string;
  paused: boolean;
};

type DiagnosticEvent = { atSeconds: number; type: string; detail?: string };

/** Small, local-only stability recorder. The game does not send telemetry. */
export class RuntimeDiagnostics {
  private readonly startedAt = performance.now();
  private readonly frameTimes: number[] = [];
  private readonly samples: PerformanceSample[] = [];
  private readonly events: DiagnosticEvent[] = [];
  private readonly maxFrames = 1800;
  private readonly maxSamples = 360;
  private readonly maxEvents = 120;
  private sampleElapsed = 0;
  private sessionFrames = 0;
  private gameplaySeconds = 0;
  private sampleSequence = 0;
  private contextLost = false;
  private readonly previousSession: unknown;
  private longTaskObserver: PerformanceObserver | null = null;
  private persistScheduled = false;
  private persistIdleId: number | null = null;
  private persistTimeoutId: number | null = null;
  private readonly storageKey = 'wukong-runtime-diagnostics-v1';

  public constructor() {
    this.previousSession = this.readPreviousSession();
    window.addEventListener('error', (event) => {
      this.record('window.error', event.message || event.error?.message || 'Error event');
    });
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      this.record('unhandledrejection', reason instanceof Error ? reason.message : String(reason ?? 'Unknown rejection'));
    });
    try {
      this.longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) this.record('long-task', `${entry.duration.toFixed(1)} ms`);
      });
      this.longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch { /* Long Task API is not available in every browser. */ }

    (window as any).__wukongDiagnostics = {
      snapshot: () => this.snapshot(),
      download: () => this.download(),
    };
    document.addEventListener('visibilitychange', () => this.record('visibility', document.visibilityState));
    window.addEventListener('pagehide', (event) => {
      this.record('pagehide', `persisted=${event.persisted}`);
      this.cancelScheduledPersist();
      this.persist();
    });
  }

  public attachRenderer(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.contextLost = true;
      this.record('webglcontextlost', 'Render loop suspended; browser context recovery requested.');
      this.persist();
    });
    canvas.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.record('webglcontextrestored', 'Browser restored the WebGL context.');
    });
  }

  public get isContextLost(): boolean { return this.contextLost; }

  public recordTransition(from: string, to: string): void {
    this.record('screen-transition', `${from} -> ${to}`);
  }

  public recordFrame(frameMs: number, renderer: THREE.WebGLRenderer, state: string, paused: boolean, elapsed: number): void {
    if (!Number.isFinite(frameMs) || frameMs < 0) return;
    this.sessionFrames++;
    this.gameplaySeconds += Math.max(0, elapsed);
    this.frameTimes.push(Math.min(frameMs, 10_000));
    if (this.frameTimes.length > this.maxFrames) this.frameTimes.shift();
    this.sampleElapsed += Math.max(0, elapsed);
    if (this.sampleElapsed < 5) return;
    this.sampleElapsed %= 5;

    const memory = renderer.info.memory;
    const jsMemory = (performance as Performance & { memory?: { usedJSHeapSize?: number } }).memory;
    this.samples.push({
      elapsedSeconds: this.elapsedSeconds(),
      fpsAverage: this.sessionFrames / Math.max(0.001, this.gameplaySeconds),
      frameMsP95: this.percentile95(),
      jsHeapUsedBytes: Number.isFinite(jsMemory?.usedJSHeapSize) ? jsMemory!.usedJSHeapSize! : null,
      renderer: {
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        geometries: memory.geometries,
        textures: memory.textures,
        programs: renderer.info.programs?.length ?? null,
      },
      state,
      paused,
    });
    this.sampleSequence++;
    if (this.samples.length > this.maxSamples) this.samples.shift();
    // sessionStorage is synchronous. Serializing the rolling frame history in
    // the render loop every ten seconds can itself create the hitch we are
    // measuring, so persist only during an idle slice (pagehide still flushes).
    if (this.sampleSequence % 2 === 0) this.schedulePersist();
  }

  public snapshot(): object {
    return {
      schema: 1,
      sessionElapsedSeconds: this.elapsedSeconds(),
      averageFps: this.sessionFrames / Math.max(0.001, this.gameplaySeconds),
      contextLost: this.contextLost,
      counts: {
        errors: this.events.filter((event) => event.type === 'window.error' || event.type === 'unhandledrejection').length,
        longTasks: this.events.filter((event) => event.type === 'long-task').length,
        contextLosses: this.events.filter((event) => event.type === 'webglcontextlost').length,
        contextRestores: this.events.filter((event) => event.type === 'webglcontextrestored').length,
        transitions: this.events.filter((event) => event.type === 'screen-transition').length,
      },
      lastSample: this.samples.at(-1) ?? null,
      samples: [...this.samples],
      events: [...this.events],
      previousSession: this.previousSession,
      interpretation: {
        jsHeap: 'Available in Chromium-based browsers only; null means unsupported.',
        gpuMemory: 'Not exposed consistently by WebGL; renderer counts are resource counters, not byte totals.',
        browserGpuProcess: 'A browser/OS GPU process kill cannot be distinguished from a closed tab using page JavaScript alone.',
      },
    };
  }

  public download(): void {
    const blob = new Blob([JSON.stringify(this.snapshot(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wukong-diagnostics-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private record(type: string, detail?: string): void {
    this.events.push({ atSeconds: this.elapsedSeconds(), type, detail });
    if (this.events.length > this.maxEvents) this.events.shift();
    if (type === 'window.error' || type === 'unhandledrejection' || type.startsWith('webglcontext')) this.schedulePersist();
  }

  private schedulePersist(): void {
    if (this.persistScheduled) return;
    this.persistScheduled = true;
    const flush = (): void => {
      this.persistScheduled = false;
      this.persistIdleId = null;
      this.persistTimeoutId = null;
      this.persist();
    };
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };
    if (idleWindow.requestIdleCallback) this.persistIdleId = idleWindow.requestIdleCallback(flush, { timeout: 5000 });
    else this.persistTimeoutId = window.setTimeout(flush, 1200);
  }

  private cancelScheduledPersist(): void {
    const idleWindow = window as Window & { cancelIdleCallback?: (id: number) => void };
    if (this.persistIdleId !== null) idleWindow.cancelIdleCallback?.(this.persistIdleId);
    if (this.persistTimeoutId !== null) window.clearTimeout(this.persistTimeoutId);
    this.persistScheduled = false;
    this.persistIdleId = null;
    this.persistTimeoutId = null;
  }

  private elapsedSeconds(): number { return Math.max(0, (performance.now() - this.startedAt) / 1000); }

  private percentile95(): number {
    if (!this.frameTimes.length) return 0;
    const ordered = [...this.frameTimes].sort((a, b) => a - b);
    return ordered[Math.min(ordered.length - 1, Math.ceil(ordered.length * 0.95) - 1)];
  }

  private readPreviousSession(): unknown {
    try { return JSON.parse(sessionStorage.getItem(this.storageKey) ?? 'null'); }
    catch { return null; }
  }

  private persist(): void {
    try {
      const record = {
        schema: 1,
        sessionElapsedSeconds: this.elapsedSeconds(),
        averageFps: this.sessionFrames / Math.max(0.001, this.gameplaySeconds),
        contextLost: this.contextLost,
        lastSample: this.samples.at(-1) ?? null,
        samples: this.samples.slice(-360),
        events: this.events.slice(-80),
      };
      sessionStorage.setItem(this.storageKey, JSON.stringify(record));
    } catch { /* Storage can be disabled or unavailable in private contexts. */ }
  }
}
