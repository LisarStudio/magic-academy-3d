import * as THREE from 'three';

export interface WindState {
  intensity: number;
  direction: THREE.Vector2;
  gustStarted: boolean;
}

/** Low-cost stochastic weather state. It is advanced by the existing level update. */
export class WorldWindController {
  public readonly state: WindState = {
    intensity: 0.12,
    direction: new THREE.Vector2(1, 0),
    gustStarted: false,
  };

  private elapsed = 0;
  private nextBaselineShift = 9 + Math.random() * 12;
  private baseline = 0.12;
  private baselineFrom = this.baseline;
  private baselineTo = this.baseline;
  private baselineBlend = 1;
  private gustWait = 16 + Math.random() * 34;
  private gustElapsed = 0;
  private gustDuration = 0;
  private gustPeak = 0;
  private angle = Math.random() * Math.PI * 2;
  private targetAngle = this.angle;

  public update(delta: number, hour: number): WindState {
    const dt = Math.min(0.1, Math.max(0, Number.isFinite(delta) ? delta : 0));
    this.elapsed += dt;
    this.state.gustStarted = false;

    if (this.elapsed >= this.nextBaselineShift) {
      this.nextBaselineShift = this.elapsed + 8 + Math.random() * 18;
      this.baselineFrom = this.baseline;
      const dayBias = this.hourBias(hour);
      this.baselineTo = THREE.MathUtils.clamp(dayBias * (0.35 + Math.random() * 0.9), 0.045, 0.34);
      this.baselineBlend = 0;
      this.targetAngle += (Math.random() - 0.5) * 1.6;
    }
    this.baselineBlend = Math.min(1, this.baselineBlend + dt / 6.5);
    const eased = this.baselineBlend * this.baselineBlend * (3 - 2 * this.baselineBlend);
    this.baseline = THREE.MathUtils.lerp(this.baselineFrom, this.baselineTo, eased);

    this.gustWait -= dt;
    if (this.gustWait <= 0) {
      if (Math.random() < this.gustChance(hour)) {
        this.gustElapsed = 0;
        this.gustDuration = 3.8 + Math.random() * 4.6;
        this.gustPeak = 0.68 + Math.random() * 0.3;
        this.targetAngle += (Math.random() - 0.5) * 2.3;
        this.state.gustStarted = true;
      }
      this.gustWait = 18 + Math.random() * 44;
    }

    let gust = 0;
    if (this.gustElapsed < this.gustDuration) {
      this.gustElapsed += dt;
      const t = Math.min(1, this.gustElapsed / this.gustDuration);
      gust = this.gustPeak * Math.sin(Math.PI * t);
    }

    // Smoothly rotate toward weather fronts; no frame-to-frame random jitter.
    const angleDelta = Math.atan2(Math.sin(this.targetAngle - this.angle), Math.cos(this.targetAngle - this.angle));
    this.angle += angleDelta * Math.min(1, dt * 0.12);
    this.state.direction.set(Math.cos(this.angle), Math.sin(this.angle));
    this.state.intensity = THREE.MathUtils.clamp(this.baseline + gust, 0, 1);
    return this.state;
  }

  private hourBias(hour: number): number {
    const h = ((hour % 24) + 24) % 24;
    const dawn = Math.max(0, 1 - Math.abs(h - 6.5) / 2.5);
    const dusk = Math.max(0, 1 - Math.abs(h - 18.2) / 2.2);
    const daytime = h >= 8 && h < 17 ? 1 : 0.55;
    return 0.12 + 0.1 * daytime + 0.11 * dawn + 0.16 * dusk;
  }

  private gustChance(hour: number): number {
    const h = ((hour % 24) + 24) % 24;
    const dusk = h >= 16.5 && h < 20.5 ? 0.78 : 0;
    const dawn = h >= 5 && h < 8.5 ? 0.63 : 0;
    return Math.max(0.5, dusk, dawn);
  }
}
