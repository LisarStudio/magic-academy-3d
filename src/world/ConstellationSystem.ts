import * as THREE from 'three';

type SkyPattern = { name: string; points: [number, number][]; azimuth: number; altitude: number };

/** Connects fixed members of the actual world star field into occasional constellations. */
export class ConstellationSystem {
  private readonly group = new THREE.Group();
  private readonly stars: THREE.Points;
  private readonly lines: THREE.LineSegments;
  private elapsed = 0;
  private elapsedSinceChange = 0;
  private patternDuration = 10;
  private activeIndex = -1;
  private activeLineStart = 0;
  private activeLineCount = 0;
  private readonly starMaterial: THREE.PointsMaterial;
  private readonly lineMaterial = new THREE.LineBasicMaterial({
    color: 0x9be3ff, transparent: true, opacity: 0, depthTest: true,
    depthWrite: false, toneMapped: false
  });

  // Positions are fixed in the level sky. Cassiopeia is included; every pattern
  // shares its points with the general starfield below, rather than following
  // the camera or drawing a HUD-shaped overlay in front of the player.
  private readonly patterns: SkyPattern[] = [
    { name: 'Cassiopeia', azimuth: -0.92, altitude: 0.65, points: [[-3.8, 0.9], [-1.9, -0.7], [0, 1.25], [1.9, -0.75], [3.8, 0.85]] },
    { name: 'Cisne', azimuth: 0.05, altitude: 0.75, points: [[0, 3], [0, 1], [-1.8, -0.2], [0, 1], [1.8, -0.2], [0, 1], [0, -2.7]] },
    { name: 'Osa Menor', azimuth: 1.15, altitude: 0.82, points: [[-1.8, 2.1], [0, 2.7], [2.0, 2.0], [1.9, 0], [1.6, -2.0], [-0.2, -2.4], [-1.8, -1.2]] },
    { name: 'Lira', azimuth: 2.35, altitude: 0.68, points: [[-1.5, 1.7], [1.5, 1.7], [0, 0], [-1.2, -2.0], [1.2, -2.0], [0, 0]] },
  ];

  /** World positions appended to the normal star points so lines meet those same stars. */
  public readonly skyStarPositions: Float32Array;

  constructor(scene: THREE.Scene) {
    const starPositions: number[] = [];
    const linePositions: number[] = [];
    const lineRanges: Array<{ start: number; count: number }> = [];
    const up = new THREE.Vector3(0, 1, 0);
    const center = new THREE.Vector3();
    const towardLevel = new THREE.Vector3();
    const right = new THREE.Vector3();
    const skyUp = new THREE.Vector3();
    const previous = new THREE.Vector3();
    const current = new THREE.Vector3();

    for (const pattern of this.patterns) {
      const horizontal = Math.cos(pattern.azimuth);
      const depth = Math.sin(pattern.azimuth);
      center.set(horizontal * 105, Math.sin(pattern.altitude) * 58 + 18, depth * 105);
      towardLevel.copy(center).negate().normalize();
      right.crossVectors(up, towardLevel).normalize();
      skyUp.crossVectors(towardLevel, right).normalize();
      const lineStart = linePositions.length / 3;
      let first = true;
      for (const [px, py] of pattern.points) {
        current.copy(center).addScaledVector(right, px * 1.75).addScaledVector(skyUp, py * 1.75);
        starPositions.push(current.x, current.y, current.z);
        if (!first) linePositions.push(previous.x, previous.y, previous.z, current.x, current.y, current.z);
        previous.copy(current);
        first = false;
      }
      lineRanges.push({ start: lineStart, count: (pattern.points.length - 1) * 2 });
    }
    this.skyStarPositions = new Float32Array(starPositions);

    const glow = document.createElement('canvas');
    glow.width = glow.height = 32;
    const ctx = glow.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 15);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    this.starMaterial = new THREE.PointsMaterial({
      color: 0xc9edff, map: new THREE.CanvasTexture(glow), size: 8,
      sizeAttenuation: false, transparent: true, opacity: 0,
      depthTest: true, depthWrite: false, toneMapped: false, alphaTest: 0.015
    });
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(this.skyStarPositions, 3));
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    this.stars = new THREE.Points(starGeometry, this.starMaterial);
    this.lines = new THREE.LineSegments(lineGeometry, this.lineMaterial);
    this.stars.frustumCulled = this.lines.frustumCulled = false;
    this.group.name = 'world_anchored_night_constellations';
    this.group.visible = false;
    this.group.add(this.lines, this.stars);
    scene.add(this.group);
    this.lineRanges = lineRanges;
    this.selectPattern(0);
  }

  private readonly lineRanges: Array<{ start: number; count: number }>;

  public update(delta: number, phase: number): void {
    const night = phase < 0.24 || phase > 0.95;
    this.group.visible = night;
    if (!night) {
      this.setOpacity(0);
      return;
    }
    this.elapsed += Math.min(delta, 0.1);
    this.elapsedSinceChange += delta;
    if (this.elapsedSinceChange >= this.patternDuration) {
      let next = Math.floor(Math.random() * this.patterns.length);
      if (next === this.activeIndex) next = (next + 1) % this.patterns.length;
      this.selectPattern(next);
      this.elapsed = 0;
      this.elapsedSinceChange = 0;
      this.patternDuration = 22 + Math.random() * 14;
    }

    const fadeIn = THREE.MathUtils.smoothstep(this.elapsed, 0.2, 1.8);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(this.elapsedSinceChange, this.patternDuration - 2.8, this.patternDuration);
    const twinkle = 0.86 + Math.sin(this.elapsed * 2.1) * 0.08;
    this.setOpacity(fadeIn * fadeOut * twinkle);
    const tracedVertices = Math.ceil(this.activeLineCount * THREE.MathUtils.smoothstep(this.elapsed, 0.3, 3.0));
    this.lines.geometry.setDrawRange(this.activeLineStart, tracedVertices);
  }

  private selectPattern(index: number): void {
    this.activeIndex = index;
    const range = this.lineRanges[index];
    this.activeLineStart = range.start;
    this.activeLineCount = range.count;
    this.lines.geometry.setDrawRange(range.start, 0);
    this.elapsed = 0;
    this.elapsedSinceChange = 0;
  }

  private setOpacity(opacity: number): void {
    this.starMaterial.opacity = opacity;
    this.lineMaterial.opacity = opacity * 0.56;
  }
}
