import * as THREE from 'three';

/** A single lightweight constellation that fades in, traces its lines, then fades away. */
export class ConstellationSystem {
  private readonly group = new THREE.Group();
  private readonly camera: THREE.Camera;
  private readonly stars: THREE.Points;
  private readonly lines: THREE.LineSegments;
  private elapsed = 0;
  private nextChange = 8;
  private activeIndex = -1;
  private opacity = 0;
  private readonly lookDirection = new THREE.Vector3();
  // These are sky overlays anchored in camera space. Depth testing against the
  // temple/terrain hid them whenever the camera looked toward the horizon.
  private readonly starMaterial: THREE.PointsMaterial;
  private readonly lineMaterial = new THREE.LineBasicMaterial({ color: 0x9be3ff, transparent: true, opacity: 0, depthTest: true, depthWrite: false, toneMapped: false });
  private readonly shapes = [
    // Cassiopeia's recognisable W.
    [[-4, 1], [-2, -1], [0, 1.4], [2, -1], [4, 1]],
    [[-3, -1], [-2, 1], [0, 2], [2, 1], [3, -1], [0, -2], [-3, -1]],
    [[-3, 1], [-1, 2], [1, 0.8], [2.8, 1.8], [2, -1], [0, -2], [-2, -0.8]],
    [[-3, 0], [-1.2, 1.8], [0, 0], [1.2, 1.8], [3, 0], [1.2, -1.8], [-1.2, -1.8], [-3, 0]],
  ];

  constructor(scene: THREE.Scene, camera: THREE.Camera) {
    this.camera = camera;
    // PointsMaterial without a map renders square point sprites. The old 7 m
    // camera-space stars therefore appeared as translucent rectangles over
    // Wukong while a constellation faded in. Use a tiny radial alpha sprite
    // in screen pixels instead of large world-sized squares.
    const starCanvas = document.createElement('canvas');
    starCanvas.width = starCanvas.height = 64;
    const ctx = starCanvas.getContext('2d');
    if (ctx) {
      const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
      glow.addColorStop(0, 'rgba(255,255,255,1)');
      glow.addColorStop(0.22, 'rgba(255,255,255,.95)');
      glow.addColorStop(0.55, 'rgba(255,255,255,.38)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 64, 64);
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);
    this.starMaterial = new THREE.PointsMaterial({
      color: 0xc9edff, map: starTexture, vertexColors: true, size: 11, sizeAttenuation: false,
      transparent: true, opacity: 0, depthTest: true, depthWrite: false,
      toneMapped: false, alphaTest: 0.015
    });
    this.group.name = 'night_constellations';
    this.group.visible = false;
    this.group.frustumCulled = false;
    this.stars = new THREE.Points(new THREE.BufferGeometry(), this.starMaterial);
    this.lines = new THREE.LineSegments(new THREE.BufferGeometry(), this.lineMaterial);
    // Keep both elements in the normal depth-tested world pass: close scenery
    // occludes the stars, so they never draw over Wukong's face.
    this.stars.renderOrder = this.lines.renderOrder = 1;
    this.stars.frustumCulled = this.lines.frustumCulled = false;
    this.group.add(this.lines, this.stars);
    scene.add(this.group);
    this.selectShape(0);
  }

  update(delta: number, playerPosition: THREE.Vector3, phase: number): void {
    const night = phase < 0.24 || phase > 0.95;
    this.group.visible = night;
    if (!night) { this.opacity = 0; this.setOpacity(0); return; }

    this.elapsed += Math.min(delta, 0.1);
    this.nextChange -= delta;
    if (this.nextChange <= 0) {
      let next = Math.floor(Math.random() * this.shapes.length);
      if (this.shapes.length > 1 && next === this.activeIndex) next = (next + 1) % this.shapes.length;
      this.selectShape(next);
      this.elapsed = 0;
      this.nextChange = 15 + Math.random() * 12;
    }
    const show = THREE.MathUtils.smoothstep(this.elapsed, 0.35, 2.6) * (1 - THREE.MathUtils.smoothstep(this.elapsed, this.nextChange - 2.8, this.nextChange));
    this.opacity = show * 0.72;
    this.setOpacity(this.opacity);
    const lineCount = this.lines.geometry.getAttribute('position').count;
    const trace = THREE.MathUtils.smoothstep(this.elapsed, 0.15, 2.7);
    this.lines.geometry.setDrawRange(0, Math.ceil(lineCount * trace));
    // Place the constellation in the upper sky field, well beyond the player.
    // Camera-up keeps it above the horizon; depth testing lets the temple and
    // Wukong occlude it instead of painting a HUD-like pattern over them.
    this.camera.getWorldDirection(this.lookDirection);
    this.group.position.copy(playerPosition).addScaledVector(this.lookDirection, 86);
    this.group.position.addScaledVector(this.camera.up, 18);
    this.group.quaternion.copy(this.camera.quaternion);
    this.group.scale.setScalar(2.4);
    this.group.rotateZ(Math.sin(this.elapsed * 0.12) * 0.018);
  }

  private selectShape(index: number): void {
    this.activeIndex = index;
    const shape = this.shapes[index];
    const starPositions = new Float32Array(shape.length * 3);
    const linePositions = new Float32Array(Math.max(0, shape.length - 1) * 6);
    shape.forEach(([x, y], i) => {
      starPositions.set([x, y, 0], i * 3);
      if (i < shape.length - 1) linePositions.set([x, y, 0, shape[i + 1][0], shape[i + 1][1], 0], i * 6);
    });
    this.stars.geometry.dispose();
    this.lines.geometry.dispose();
    this.stars.geometry = new THREE.BufferGeometry();
    this.stars.geometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    this.lines.geometry = new THREE.BufferGeometry();
    this.lines.geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  }

  private setOpacity(opacity: number): void {
    this.starMaterial.opacity = opacity;
    this.lineMaterial.opacity = opacity * 0.58;
  }
}
