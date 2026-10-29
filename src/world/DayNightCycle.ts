import * as THREE from 'three';

interface DayNightKey {
  p: number;
  sky: THREE.Color;
  fog: THREE.Color;
  ambient: THREE.Color;
  dir: THREE.Color;
  ai: number;
  di: number;
  y: number;
  sun: number;
}

export interface DayNightConfig {
  cycleDuration?: number; // Total cycle seconds (e.g. 240s = 4 mins)
  startPhase?: number;    // Initial phase 0.0 - 1.0 (0.0 = Night, 0.45 = Dawn, 0.70 = Sunrise, 0.90 = Morning)
  renderer?: THREE.WebGLRenderer;
}

export class DayNightCycle {
  private scene: THREE.Scene;
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private cloudsUniforms?: any;
  private renderer?: THREE.WebGLRenderer;

  public cycleDuration: number;
  public time = 0;
  public phase = 0; // 0.0 to 1.0

  // Celestial Body: Dynamic Rising Sun
  public sunMesh: THREE.Mesh;
  public sunLight: THREE.PointLight;

  // Preallocated Colors for Zero-Garbage Lerping
  private tempColor1 = new THREE.Color();
  private tempColor2 = new THREE.Color();
  private tempColor3 = new THREE.Color();
  private tempColor4 = new THREE.Color();
  private cloudDayColor = new THREE.Color(0xffd9b7);
  private cloudNightColor = new THREE.Color(0x52698a);
  private readonly nightLights = new Map<THREE.PointLight, number>();

  // Phase Color Palettes
  // 1. Night (0.00 - 0.25)
  private readonly cNightSky = new THREE.Color(0x0a0918);
  private readonly cNightFog = new THREE.Color(0x0a0918);
  private readonly cNightAmbient = new THREE.Color(0x404870);
  private readonly cNightDir = new THREE.Color(0x7588c4);

  // 2. Pre-Dawn Cosmic Indigo / Violet (0.25 - 0.45)
  private readonly cPreDawnSky = new THREE.Color(0x180e30);
  private readonly cPreDawnFog = new THREE.Color(0x160c2c);
  private readonly cPreDawnAmbient = new THREE.Color(0x524270);
  private readonly cPreDawnDir = new THREE.Color(0x9178b8);

  // 3. Dawn Rich Amber & Rose (0.45 - 0.70)
  private readonly cDawnSky = new THREE.Color(0x4a1c38);
  private readonly cDawnFog = new THREE.Color(0x61243a);
  private readonly cDawnAmbient = new THREE.Color(0x8a5550);
  private readonly cDawnDir = new THREE.Color(0xff8a42);

  // 4. Sunrise Golden Azure (0.70 - 0.88)
  private readonly cSunriseSky = new THREE.Color(0x3a6eb5);
  private readonly cSunriseFog = new THREE.Color(0x4d80c7);
  private readonly cSunriseAmbient = new THREE.Color(0x9ec7eb);
  private readonly cSunriseDir = new THREE.Color(0xffdf80);

  // 5. Morning Bright Blue (0.88 - 1.00)
  private readonly cMorningSky = new THREE.Color(0x5b9df2);
  private readonly cMorningAmbient = new THREE.Color(0xb8dcff);
  private readonly cMorningDir = new THREE.Color(0xfffae0);
  // Allocated once instead of creating a ten-entry palette on every frame.
  private readonly phaseKeys: DayNightKey[] = [
    { p: 0.00, sky: this.cNightSky, fog: this.cNightFog, ambient: this.cNightAmbient, dir: this.cNightDir, ai: 1.0, di: 1.8, y: -20, sun: 0 },
    { p: 0.18, sky: this.cNightSky, fog: this.cNightFog, ambient: this.cNightAmbient, dir: this.cNightDir, ai: 1.0, di: 1.8, y: -20, sun: 0 },
    { p: 0.30, sky: this.cPreDawnSky, fog: this.cPreDawnFog, ambient: this.cPreDawnAmbient, dir: this.cPreDawnDir, ai: 1.05, di: 1.9, y: -12, sun: 0.15 },
    { p: 0.42, sky: this.cDawnSky, fog: this.cDawnFog, ambient: this.cDawnAmbient, dir: this.cDawnDir, ai: 1.2, di: 2.1, y: 2, sun: 0.5 },
    { p: 0.58, sky: this.cSunriseSky, fog: this.cSunriseFog, ambient: this.cSunriseAmbient, dir: this.cSunriseDir, ai: 1.4, di: 2.3, y: 25, sun: 0.9 },
    { p: 0.76, sky: this.cMorningSky, fog: this.cMorningSky, ambient: this.cMorningAmbient, dir: this.cMorningDir, ai: 1.55, di: 2.5, y: 48, sun: 1 },
    { p: 0.84, sky: this.cMorningSky, fog: this.cMorningSky, ambient: this.cMorningAmbient, dir: this.cMorningDir, ai: 1.55, di: 2.5, y: 48, sun: 1 },
    { p: 0.92, sky: this.cDawnSky, fog: this.cDawnFog, ambient: this.cDawnAmbient, dir: this.cDawnDir, ai: 1.2, di: 2.1, y: 8, sun: 0.45 },
    { p: 0.97, sky: this.cPreDawnSky, fog: this.cPreDawnFog, ambient: this.cPreDawnAmbient, dir: this.cPreDawnDir, ai: 1.05, di: 1.9, y: -10, sun: 0.1 },
    { p: 1.00, sky: this.cNightSky, fog: this.cNightFog, ambient: this.cNightAmbient, dir: this.cNightDir, ai: 1.0, di: 1.8, y: -20, sun: 0 },
  ];

  constructor(
    scene: THREE.Scene,
    dirLight: THREE.DirectionalLight,
    ambientLight: THREE.AmbientLight,
    cloudsUniforms?: any,
    config: DayNightConfig = {}
  ) {
    this.scene = scene;
    this.dirLight = dirLight;
    this.ambientLight = ambientLight;
    this.cloudsUniforms = cloudsUniforms;
    this.renderer = config.renderer;
    this.cycleDuration = config.cycleDuration ?? 240.0;
    this.phase = config.startPhase ?? 0.05; // Start at night, slowly progress to dawn
    this.time = this.phase * this.cycleDuration;

    // 1. Rising Sun Orb Mesh
    const sunGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffe680,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.position.set(80, -10, -60);
    this.scene.add(this.sunMesh);

    // 2. Subtle Sun Glow Corona
    const glowGeo = new THREE.PlaneGeometry(16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffaa33,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const sunGlow = new THREE.Mesh(glowGeo, glowMat);
    this.sunMesh.add(sunGlow);

    // 3. Sun Local Light
    this.sunLight = new THREE.PointLight(0xffaa44, 0.0, 100);
    this.sunMesh.add(this.sunLight);
  }

  /** Registers warm architectural lights so they fade naturally with the sun. */
  public registerNightLight(light: THREE.PointLight): void {
    this.nightLights.set(light, light.intensity);
  }

  public update(delta: number, cameraPosition: THREE.Vector3): void {
    this.time += delta;
    if (this.time >= this.cycleDuration) {
      this.time %= this.cycleDuration;
    }
    this.phase = this.time / this.cycleDuration;

    // Center Sun in distance relative to player/camera
    this.sunMesh.position.x = cameraPosition.x + 85;
    this.sunMesh.position.z = cameraPosition.z - 75;

    // Cyclic keyframes cover both dawn and sunset. Smoothstep interpolation
    // keeps sky, fog, ambient and sun continuous even at phase wrap.
    const keys = this.phaseKeys;
    let left = keys[0];
    let right = keys[1];
    for (let i = 1; i < keys.length; i++) {
      if (this.phase <= keys[i].p) { left = keys[i - 1]; right = keys[i]; break; }
    }
    const linearT = THREE.MathUtils.clamp((this.phase - left.p) / Math.max(0.0001, right.p - left.p), 0, 1);
    const t = linearT * linearT * (3 - 2 * linearT);
    const skyColor = this.tempColor1.lerpColors(left.sky, right.sky, t);
    const fogColor = this.tempColor2.lerpColors(left.fog, right.fog, t);
    const ambientColor = this.tempColor3.lerpColors(left.ambient, right.ambient, t);
    const dirColor = this.tempColor4.lerpColors(left.dir, right.dir, t);
    const ambientIntensity = THREE.MathUtils.lerp(left.ai, right.ai, t);
    const dirIntensity = THREE.MathUtils.lerp(left.di, right.di, t);
    const sunY = THREE.MathUtils.lerp(left.y, right.y, t);
    const sunOpacity = THREE.MathUtils.lerp(left.sun, right.sun, t);
    const daylight = THREE.MathUtils.smoothstep(this.phase, 0.27, 0.64) * (1 - THREE.MathUtils.smoothstep(this.phase, 0.82, 0.99));

    // Apply smooth interpolated lighting & fog
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(skyColor);
    }
    if (this.scene.fog) {
      this.scene.fog.color.copy(fogColor);
    }
    this.ambientLight.color.copy(ambientColor);
    this.ambientLight.intensity = ambientIntensity;

    this.dirLight.color.copy(dirColor);
    this.dirLight.intensity = dirIntensity;
    if (this.renderer) this.renderer.toneMappingExposure = THREE.MathUtils.lerp(1.12, 1.3, daylight);
    this.dirLight.position.set(
      cameraPosition.x + 40,
      35 + sunY * 0.5,
      cameraPosition.z - 30
    );
    for (const [light, baseIntensity] of this.nightLights) {
      light.intensity = baseIntensity * (0.35 + 0.65 * (1 - daylight));
    }

    // Update Sun position & opacity
    this.sunMesh.position.y = sunY;
    (this.sunMesh.material as THREE.MeshBasicMaterial).opacity = sunOpacity;
    this.sunLight.intensity = sunOpacity * 4.0;

    // Update Clouds Shader Uniforms if present
    if (this.cloudsUniforms) {
      if (this.cloudsUniforms.uSkyColor) this.cloudsUniforms.uSkyColor.value.copy(skyColor);
      if (this.cloudsUniforms.uCloudColor) {
        this.cloudsUniforms.uCloudColor.value.lerpColors(this.cloudNightColor, this.cloudDayColor, daylight);
      }
      if (this.cloudsUniforms.uMoonColor) {
        this.cloudsUniforms.uMoonColor.value.copy(dirColor);
      }
    }
  }
}
