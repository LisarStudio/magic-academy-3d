import * as THREE from 'three';

type Pattern = {
  name: string;
  azimuth: number;
  altitude: number;
  points: Array<[number, number]>;
  starIndices: number[];
};

/** Animates existing points in the level star field; no overlay or extra geometry. */
export class ConstellationSystem {
  private readonly patterns: Pattern[] = [
    { name: 'Casiopea', azimuth: -0.92, altitude: 0.65, points: [[-3.8, 0.9], [-1.9, -0.7], [0, 1.25], [1.9, -0.75], [3.8, 0.85]], starIndices: [] },
    { name: 'Cisne', azimuth: 0.05, altitude: 0.75, points: [[0, 3], [0, 1], [-1.8, -0.2], [1.8, -0.2], [0, -2.7]], starIndices: [] },
    { name: 'Osa Menor', azimuth: 1.15, altitude: 0.82, points: [[-1.8, 2.1], [0, 2.7], [2.0, 2.0], [1.9, 0], [1.6, -2.0], [-0.2, -2.4], [-1.8, -1.2]], starIndices: [] },
    { name: 'Lira', azimuth: 2.35, altitude: 0.68, points: [[-1.5, 1.7], [1.5, 1.7], [0, 0], [-1.2, -2.0], [1.2, -2.0]], starIndices: [] },
  ];

  private colors: THREE.BufferAttribute | null = null;
  private baseColors: number[] = [];
  private elapsed = 0;
  private sinceChange = 0;
  private duration = 27;
  private activeIndex = 0;

  /** Resolve each constellation node to a distinct star already in the sky. */
  constructor(starPositions: Float32Array) {
    const up = new THREE.Vector3(0, 1, 0);
    const center = new THREE.Vector3();
    const towardLevel = new THREE.Vector3();
    const right = new THREE.Vector3();
    const skyUp = new THREE.Vector3();
    const target = new THREE.Vector3();
    const used = new Set<number>();
    const count = Math.floor(starPositions.length / 3);

    for (const pattern of this.patterns) {
      const radius = 132;
      const horizontal = Math.cos(pattern.altitude) * radius;
      center.set(
        Math.cos(pattern.azimuth) * horizontal,
        Math.sin(pattern.altitude) * radius + 10,
        Math.sin(pattern.azimuth) * horizontal
      );
      center.setLength(radius);
      towardLevel.copy(center).negate().normalize();
      right.crossVectors(up, towardLevel).normalize();
      skyUp.crossVectors(towardLevel, right).normalize();

      for (const [x, y] of pattern.points) {
        target.copy(center).addScaledVector(right, x * 4.4).addScaledVector(skyUp, y * 4.4);
        let bestIndex = -1;
        let bestDistance = Infinity;
        for (let i = 0; i < count; i++) {
          if (used.has(i)) continue;
          const dx = starPositions[i * 3] - target.x;
          const dy = starPositions[i * 3 + 1] - target.y;
          const dz = starPositions[i * 3 + 2] - target.z;
          const distance = dx * dx + dy * dy + dz * dz;
          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
          }
        }
        if (bestIndex >= 0) {
          pattern.starIndices.push(bestIndex);
          used.add(bestIndex);
        }
      }
    }
  }

  public attachStarColors(attribute: THREE.BufferAttribute): void {
    this.colors = attribute;
    const values = attribute.array as Float32Array;
    this.baseColors = [];
    for (const pattern of this.patterns) {
      for (const index of pattern.starIndices) {
        const offset = index * 3;
        this.baseColors[offset] = values[offset];
        this.baseColors[offset + 1] = values[offset + 1];
        this.baseColors[offset + 2] = values[offset + 2];
      }
    }
  }

  public update(delta: number, phase: number): void {
    if (!this.colors) return;
    const night = phase < 0.24 || phase > 0.95;
    if (!night) {
      this.elapsed = this.sinceChange = 0;
      this.write(0);
      return;
    }

    this.elapsed += Math.min(delta, 0.1);
    this.sinceChange += delta;
    if (this.sinceChange >= this.duration) {
      let next = Math.floor(Math.random() * this.patterns.length);
      if (next === this.activeIndex) next = (next + 1) % this.patterns.length;
      this.activeIndex = next;
      this.elapsed = this.sinceChange = 0;
      this.duration = 23 + Math.random() * 12;
    }
    const fade = 1 - THREE.MathUtils.smoothstep(this.sinceChange, this.duration - 3.2, this.duration);
    this.write(fade);
  }

  private write(envelope: number): void {
    if (!this.colors) return;
    const values = this.colors.array as Float32Array;
    this.patterns.forEach((pattern, patternIndex) => {
      pattern.starIndices.forEach((starIndex, nodeIndex) => {
        const offset = starIndex * 3;
        const revealAt = nodeIndex * 0.34;
        const reveal = patternIndex === this.activeIndex
          ? THREE.MathUtils.smoothstep(this.elapsed, revealAt, revealAt + 0.65) * envelope
          : 0;
        const glow = reveal * (0.78 + 0.22 * Math.sin(this.elapsed * 2.2 + nodeIndex * 1.4));
        values[offset] = THREE.MathUtils.lerp(this.baseColors[offset], 0.98, glow);
        values[offset + 1] = THREE.MathUtils.lerp(this.baseColors[offset + 1], 0.91, glow);
        values[offset + 2] = THREE.MathUtils.lerp(this.baseColors[offset + 2], 1, glow);
      });
    });
    this.colors.needsUpdate = true;
  }
}
