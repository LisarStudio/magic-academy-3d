import * as THREE from 'three';

export interface DayNightConfig {
  cycleDuration?: number; // Total cycle seconds (e.g. 240s = 4 mins)
  startPhase?: number;    // Initial phase 0.0 - 1.0 (0.0 = Night, 0.45 = Dawn, 0.70 = Sunrise, 0.90 = Morning)
}

export class DayNightCycle {
  private scene: THREE.Scene;
  private dirLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private cloudsUniforms?: any;

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
  private readonly cMorningFog = new THREE.Color(0x70acf7);
  private readonly cMorningAmbient = new THREE.Color(0xb8dcff);
  private readonly cMorningDir = new THREE.Color(0xfffae0);

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

  public update(delta: number, cameraPosition: THREE.Vector3): void {
    this.time += delta;
    if (this.time >= this.cycleDuration) {
      this.time %= this.cycleDuration;
    }
    this.phase = this.time / this.cycleDuration;

    // Center Sun in distance relative to player/camera
    this.sunMesh.position.x = cameraPosition.x + 85;
    this.sunMesh.position.z = cameraPosition.z - 75;

    let skyColor: THREE.Color;
    let fogColor: THREE.Color;
    let ambientColor: THREE.Color;
    let dirColor: THREE.Color;
    let ambientIntensity: number;
    let dirIntensity: number;
    let sunY = -15;
    let sunOpacity = 0.0;

    if (this.phase < 0.25) {
      // Phase 1: Deep Night
      const t = this.phase / 0.25;
      skyColor = this.tempColor1.lerpColors(this.cNightSky, this.cNightSky, t);
      fogColor = this.tempColor2.lerpColors(this.cNightFog, this.cNightFog, t);
      ambientColor = this.tempColor3.lerpColors(this.cNightAmbient, this.cNightAmbient, t);
      dirColor = this.cNightDir;
      ambientIntensity = 1.0;
      dirIntensity = 1.8;
      sunY = -20;
      sunOpacity = 0.0;
    } else if (this.phase < 0.45) {
      // Phase 2: Pre-Dawn Cosmic Indigo
      const t = (this.phase - 0.25) / 0.20;
      skyColor = this.tempColor1.lerpColors(this.cNightSky, this.cPreDawnSky, t);
      fogColor = this.tempColor2.lerpColors(this.cNightFog, this.cPreDawnFog, t);
      ambientColor = this.tempColor3.lerpColors(this.cNightAmbient, this.cPreDawnAmbient, t);
      dirColor = this.cPreDawnDir;
      ambientIntensity = 1.0 + t * 0.15;
      dirIntensity = 1.8 + t * 0.2;
      sunY = -20 + t * 15; // Rising towards horizon
      sunOpacity = t * 0.3;
    } else if (this.phase < 0.70) {
      // Phase 3: Dawn Amber & Rose Awakening
      const t = (this.phase - 0.45) / 0.25;
      skyColor = this.tempColor1.lerpColors(this.cPreDawnSky, this.cDawnSky, t);
      fogColor = this.tempColor2.lerpColors(this.cPreDawnFog, this.cDawnFog, t);
      ambientColor = this.tempColor3.lerpColors(this.cPreDawnAmbient, this.cDawnAmbient, t);
      dirColor = this.cDawnDir;
      ambientIntensity = 1.15 + t * 0.25;
      dirIntensity = 2.0 + t * 0.3;
      sunY = -5 + t * 25; // Rises above mountains (Y: -5 -> 20)
      sunOpacity = 0.3 + t * 0.6;
    } else if (this.phase < 0.88) {
      // Phase 4: Sunrise Golden Azure
      const t = (this.phase - 0.70) / 0.18;
      skyColor = this.tempColor1.lerpColors(this.cDawnSky, this.cSunriseSky, t);
      fogColor = this.tempColor2.lerpColors(this.cDawnFog, this.cSunriseFog, t);
      ambientColor = this.tempColor3.lerpColors(this.cDawnAmbient, this.cSunriseAmbient, t);
      dirColor = this.cSunriseDir;
      ambientIntensity = 1.40 + t * 0.15;
      dirIntensity = 2.3 + t * 0.2;
      sunY = 20 + t * 25; // Y: 20 -> 45
      sunOpacity = 0.9 + t * 0.1;
    } else {
      // Phase 5: Morning Clear Blue
      const t = (this.phase - 0.88) / 0.12;
      skyColor = this.tempColor1.lerpColors(this.cSunriseSky, this.cMorningSky, t);
      fogColor = this.tempColor2.lerpColors(this.cSunriseFog, this.cMorningFog, t);
      ambientColor = this.tempColor3.lerpColors(this.cSunriseAmbient, this.cMorningAmbient, t);
      dirColor = this.cMorningDir;
      ambientIntensity = 1.55;
      dirIntensity = 2.5;
      sunY = 45 + t * 10;
      sunOpacity = 1.0;
    }

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
    this.dirLight.position.set(
      cameraPosition.x + 40,
      35 + sunY * 0.5,
      cameraPosition.z - 30
    );

    // Update Sun position & opacity
    this.sunMesh.position.y = sunY;
    (this.sunMesh.material as THREE.MeshBasicMaterial).opacity = sunOpacity;
    this.sunLight.intensity = sunOpacity * 4.0;

    // Update Clouds Shader Uniforms if present
    if (this.cloudsUniforms) {
      if (this.cloudsUniforms.uSkyColor) this.cloudsUniforms.uSkyColor.value.copy(skyColor);
      if (this.cloudsUniforms.uCloudColor) {
        this.cloudsUniforms.uCloudColor.value.lerpColors(
          new THREE.Color(0x354060),
          new THREE.Color(0xffebd2),
          Math.max(0, (this.phase - 0.3) / 0.6)
        );
      }
      if (this.cloudsUniforms.uMoonColor) {
        this.cloudsUniforms.uMoonColor.value.copy(dirColor);
      }
    }
  }
}
