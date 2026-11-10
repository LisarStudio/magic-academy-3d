import * as THREE from 'three';

export interface DayNightConfig {
  /** Real seconds per in-game hour. The resulting full day is 24x this value. */
  realSecondsPerGameHour?: number;
  /** Legacy full-cycle setting, retained for callers that still use it. */
  cycleDuration?: number;
  initialHour?: number;
  renderer?: THREE.WebGLRenderer;
  moonLight?: THREE.DirectionalLight;
  /** Existing environment fills, modulated with the same day/night clock. */
  hemisphereLight?: THREE.HemisphereLight;
  rimLight?: THREE.DirectionalLight;
}

/** One game-clock source for sky, world lighting, stars and registered lanterns. */
export class DayNightCycle {
  public readonly cycleDuration: number;
  public time = 0;
  public phase = 0;
  public hour: number;
  public timeScale = 1;
  public paused = false;
  public readonly sunDirection = new THREE.Vector3();
  public readonly moonDirection = new THREE.Vector3();
  private readonly keyLightDirection = new THREE.Vector3();
  private readonly keyLightRotationAxis = new THREE.Vector3();
  private readonly worldUp = new THREE.Vector3(0, 1, 0);
  public daylight = 0;
  public nightAmount = 1;
  public lanternIntensity = 1;
  public readonly sunMesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  public readonly sunLight: THREE.PointLight;

  private readonly nightLights = new Map<THREE.PointLight, number>();
  private readonly nightEmissiveMaterials = new Map<THREE.MeshStandardMaterial, number>();
  private readonly nightSky = new THREE.Color(0x0b1530);
  private readonly dawnSky = new THREE.Color(0xf3a982);
  private readonly daySky = new THREE.Color(0x6ea9e9);
  private readonly duskSky = new THREE.Color(0xe78065);
  private readonly nightAmbient = new THREE.Color(0x7183a6);
  private readonly warmAmbient = new THREE.Color(0xf0b894);
  private readonly dayAmbient = new THREE.Color(0xcbdcf0);
  private readonly coolMoon = new THREE.Color(0xb4c9f0);
  private readonly dayRimColor = new THREE.Color(0x55c5e8);
  private readonly nightRimColor = new THREE.Color(0x7893c1);
  private readonly warmSun = new THREE.Color(0xffd6a0);
  private readonly whiteSun = new THREE.Color(0xfff1d3);
  private readonly initialHour: number;
  private readonly renderer?: THREE.WebGLRenderer;
  private readonly moonLight?: THREE.DirectionalLight;
  private readonly hemisphereLight?: THREE.HemisphereLight;
  private readonly rimLight?: THREE.DirectionalLight;
  private readonly scene: THREE.Scene;
  private readonly dirLight: THREE.DirectionalLight;
  private readonly ambientLight: THREE.AmbientLight;

  constructor(scene: THREE.Scene, dirLight: THREE.DirectionalLight, ambientLight: THREE.AmbientLight, _legacyCloudUniforms?: any, config: DayNightConfig = {}) {
    this.scene = scene;
    this.dirLight = dirLight;
    this.ambientLight = ambientLight;
    this.renderer = config.renderer;
    this.moonLight = config.moonLight;
    this.hemisphereLight = config.hemisphereLight;
    this.rimLight = config.rimLight;
    this.cycleDuration = (config.realSecondsPerGameHour ?? (config.cycleDuration ?? 72 * 60) / 24) * 24;
    this.initialHour = ((config.initialHour ?? 21) % 24 + 24) % 24;
    this.hour = this.initialHour;

    // The package panoramas already contain their sun/moon disks. Keep this
    // lightweight sphere hidden until disk-free panoramas are supplied.
    this.sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 20, 16),
      new THREE.MeshBasicMaterial({ color: 0xffd58a, visible: false })
    );
    this.sunMesh.name = 'celestial_sun_mesh_pending_disk_free_sky';
    this.sunMesh.visible = false;
    this.sunLight = new THREE.PointLight(0xffcc77, 0, 0);
    this.sunLight.visible = false;
    this.sunMesh.add(this.sunLight);
    scene.add(this.sunMesh);
  }

  public registerNightLight(light: THREE.PointLight): void {
    this.nightLights.set(light, light.intensity);
  }

  /** Fade authored emissive materials with the same clock as nearby lantern fills. */
  public registerNightEmissiveMaterial(material: THREE.MeshStandardMaterial): void {
    if (!this.nightEmissiveMaterials.has(material)) this.nightEmissiveMaterials.set(material, material.emissiveIntensity);
  }

  public setHour(hour: number): void {
    const normalized = ((hour % 24) + 24) % 24;
    this.time = (((normalized - this.initialHour) % 24 + 24) % 24) / 24 * this.cycleDuration;
    this.hour = normalized;
    this.applyState(new THREE.Vector3());
  }

  public setPaused(paused: boolean): void { this.paused = paused; }
  public setTimeScale(scale: number): void { this.timeScale = Math.max(0, Math.min(120, scale)); }

  public update(delta: number, cameraPosition: THREE.Vector3): void {
    if (!this.paused && Number.isFinite(delta)) {
      // Avoid large jumps after a suspended tab; gameplay normally supplies a
      // capped delta, and this is an additional guard for the clock.
      this.time = (this.time + Math.min(Math.max(delta, 0), 0.5) * this.timeScale) % this.cycleDuration;
    }
    this.hour = (this.initialHour + this.time / this.cycleDuration * 24) % 24;
    this.applyState(cameraPosition);
  }

  private applyState(cameraPosition: THREE.Vector3): void {
    const h = this.hour;
    this.phase = constellationPhaseForHour(h);
    this.daylight = daylightForHour(h);
    this.nightAmount = 1 - this.daylight;
    this.lanternIntensity = lanternLevelForHour(h);
    const palette = colorsForHour(h, this);

    directionForHour(h, this.sunDirection);
    this.moonDirection.copy(this.sunDirection).negate();
    // Reuse the one existing shadow-casting directional light: it follows
    // the sun by day and smoothly turns toward the real moon at night.
    this.keyLightRotationAxis.crossVectors(this.sunDirection, this.worldUp).normalize();
    this.keyLightDirection.copy(this.sunDirection)
      .applyAxisAngle(this.keyLightRotationAxis, Math.PI * this.nightAmount)
      .normalize();

    if (this.scene.background instanceof THREE.Color) this.scene.background.copy(palette.sky);
    if (this.scene.fog) this.scene.fog.color.copy(palette.fog);
    this.ambientLight.color.copy(palette.ambient);
    this.ambientLight.intensity = THREE.MathUtils.lerp(0.58, 0.95, this.daylight);

    this.dirLight.color.copy(palette.sunColor);
    // Raise the night key by 44%, preserving the old full-day value (1.68)
    // and reusing the single existing shadow map.
    this.dirLight.intensity = 0.26 + 1.42 * this.daylight;
    this.dirLight.position.copy(cameraPosition).addScaledVector(this.keyLightDirection, 70);
    this.dirLight.target.position.copy(cameraPosition);
    if (this.dirLight.target.parent !== this.scene) this.scene.add(this.dirLight.target);

    if (this.moonLight) {
      this.moonLight.color.copy(this.coolMoon);
      // Calibrated +38% over the prior non-shadowing fill; it follows the
      // existing celestial direction and fades out through the same clock.
      this.moonLight.intensity = 0.8 * this.nightAmount;
      this.moonLight.position.copy(cameraPosition).addScaledVector(this.moonDirection, 65);
      this.moonLight.target.position.copy(cameraPosition);
      if (this.moonLight.target.parent !== this.scene) this.scene.add(this.moonLight.target);
    }

    if (this.hemisphereLight) {
      // Preserve the daylight preset; add a restrained cool sky fill at night
      // so grass, tree canopies and the character keep readable shadow detail.
      this.hemisphereLight.intensity = THREE.MathUtils.lerp(0.78, 1.08, this.nightAmount);
    }

    if (this.rimLight) {
      // Preserve the authored rim strength, but desaturate its cyan toward a
      // cooler blue at night so it supports separation without a teal cast.
      this.rimLight.intensity = 0.9;
      this.rimLight.color.copy(this.dayRimColor).lerp(this.nightRimColor, this.nightAmount);
    }

    if (this.renderer) this.renderer.toneMappingExposure = THREE.MathUtils.lerp(1.12, 1.2, this.daylight);
    for (const [light, baseIntensity] of this.nightLights) light.intensity = baseIntensity * this.lanternIntensity;
    for (const [material, baseIntensity] of this.nightEmissiveMaterials) material.emissiveIntensity = baseIntensity * this.lanternIntensity;
    this.sunMesh.position.copy(cameraPosition).addScaledVector(this.sunDirection, 160);
  }

  public static formatHour(hour: number): string {
    const h = Math.floor(hour) % 24;
    const m = Math.floor((hour - Math.floor(hour)) * 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  public getDebugState(): { hour: string; phase: number; daylight: number; lanterns: number; sunDirection: THREE.Vector3; moonDirection: THREE.Vector3 } {
    return { hour: DayNightCycle.formatHour(this.hour), phase: this.phase, daylight: this.daylight, lanterns: this.lanternIntensity, sunDirection: this.sunDirection, moonDirection: this.moonDirection };
  }
}

/** Adapt the established constellation API's normalized night window only. */
export function constellationPhaseForHour(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  if (h < 5) return h / 5 * 0.24;
  if (h >= 20) return 0.95 + (h - 20) / 4 * 0.05;
  return 0.24 + (h - 5) / 15 * 0.71;
}

export function daylightForHour(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);
  if (h < 5 || h >= 20) return 0;
  if (h < 8) return smooth(5, 8, h);
  if (h < 17) return 1;
  return 1 - smooth(17, 20, h);
}

export function lanternLevelForHour(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);
  if (h < 5 || h >= 20) return 1;
  if (h < 8) return THREE.MathUtils.lerp(1, 0.1, smooth(5, 8, h));
  if (h < 17) return 0.1;
  return THREE.MathUtils.lerp(0.1, 1, smooth(17, 20, h));
}

export function directionForHour(hour: number, target = new THREE.Vector3()): THREE.Vector3 {
  const h = ((hour % 24) + 24) % 24;
  // Y-up world: sun rises in the east (+X), peaks at noon, and sets west (-X).
  const elevation = Math.sin((h - 6) / 12 * Math.PI) * Math.PI * 0.47;
  const azimuth = (h - 6) / 12 * Math.PI;
  const horizontal = Math.cos(elevation);
  return target.set(Math.cos(azimuth) * horizontal, Math.sin(elevation), Math.sin(azimuth) * horizontal).normalize();
}

const paletteScratch = { sky: new THREE.Color(), ambient: new THREE.Color(), sunColor: new THREE.Color() };
function colorsForHour(h: number, cycle: DayNightCycle): { sky: THREE.Color; fog: THREE.Color; ambient: THREE.Color; sunColor: THREE.Color } {
  const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);
  const color = (out: THREE.Color, from: THREE.Color, to: THREE.Color, t: number) => out.lerpColors(from, to, THREE.MathUtils.clamp(t, 0, 1));
  let sky: THREE.Color, ambient: THREE.Color, sunColor: THREE.Color;
  if (h >= 5 && h < 8) {
    const t = smooth(5, 8, h); sky = color(paletteScratch.sky, cycle['nightSky'], cycle['dawnSky'], t); ambient = color(paletteScratch.ambient, cycle['nightAmbient'], cycle['warmAmbient'], t); sunColor = color(paletteScratch.sunColor, cycle['warmSun'], cycle['warmSun'], t);
  } else if (h >= 8 && h < 17) {
    sky = color(paletteScratch.sky, cycle['dawnSky'], cycle['daySky'], smooth(8, 9, h)); ambient = color(paletteScratch.ambient, cycle['warmAmbient'], cycle['dayAmbient'], smooth(8, 9, h)); sunColor = color(paletteScratch.sunColor, cycle['warmSun'], cycle['whiteSun'], smooth(8, 10, h));
  } else if (h >= 17 && h < 18) {
    const t = smooth(17, 18, h); sky = color(paletteScratch.sky, cycle['daySky'], cycle['duskSky'], t); ambient = color(paletteScratch.ambient, cycle['dayAmbient'], cycle['warmAmbient'], t); sunColor = color(paletteScratch.sunColor, cycle['whiteSun'], cycle['warmSun'], t);
  } else if (h >= 18 && h < 19) {
    sky = cycle['duskSky']; ambient = cycle['warmAmbient']; sunColor = cycle['warmSun'];
  } else if (h >= 19 && h < 20) {
    const t = smooth(19, 20, h); sky = color(paletteScratch.sky, cycle['duskSky'], cycle['nightSky'], t); ambient = color(paletteScratch.ambient, cycle['warmAmbient'], cycle['nightAmbient'], t); sunColor = color(paletteScratch.sunColor, cycle['warmSun'], cycle['coolMoon'], t);
  } else {
    sky = cycle['nightSky']; ambient = cycle['nightAmbient']; sunColor = cycle['coolMoon'];
  }
  return { sky, fog: sky, ambient, sunColor };
}
