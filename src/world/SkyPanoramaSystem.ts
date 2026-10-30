import * as THREE from 'three';

export type SkyPhase = 'noche' | 'amanecer' | 'dia' | 'atardecer';

export interface SkyBlendState {
  from: SkyPhase;
  to: SkyPhase;
  blend: number;
}

const PANORAMAS: Record<SkyPhase, string> = {
  noche: 'wukong_sky_noche.webp',
  amanecer: 'wukong_sky_amanecer.webp',
  dia: 'wukong_sky_dia.webp',
  atardecer: 'wukong_sky_atardecer.webp',
};

/** One low-cost inward-facing dome. Keeps only the active pair of LDR skies resident. */
export class SkyPanoramaSystem {
  public readonly mesh: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
  private readonly loader = new THREE.TextureLoader();
  private readonly resident = new Map<SkyPhase, THREE.Texture>();
  private requestedKey = '';
  private activeKey = '';
  private requestVersion = 0;
  private readonly basePath: string;

  constructor(anchor: THREE.Group, basePath = `${import.meta.env.BASE_URL}assets/environment/sky-cycle/`) {
    this.basePath = basePath;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uSkyA: { value: null },
        uSkyB: { value: null },
        uBlend: { value: 0 },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform sampler2D uSkyA;
        uniform sampler2D uSkyB;
        uniform float uBlend;
        varying vec2 vUv;
        void main(){
          vec4 a=texture2D(uSkyA,vUv);
          vec4 b=texture2D(uSkyB,vUv);
          gl_FragColor=mix(a,b,clamp(uBlend,0.0,1.0));
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(178, 48, 32), material);
    this.mesh.name = 'celestial_panorama_dome';
    this.mesh.renderOrder = -10;
    this.mesh.frustumCulled = false;
    anchor.add(this.mesh);
  }

  public async loadInitial(renderer: THREE.WebGLRenderer, state: SkyBlendState): Promise<void> {
    await this.ensurePair(renderer, state, true);
  }

  public update(renderer: THREE.WebGLRenderer, state: SkyBlendState): void {
    const key = `${state.from}:${state.to}`;
    if (this.activeKey === key) this.mesh.material.uniforms.uBlend.value = state.blend;
    if (key !== this.requestedKey) void this.ensurePair(renderer, state, false);
  }

  public dispose(): void {
    this.resident.forEach((texture) => texture.dispose());
    this.resident.clear();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }

  private async ensurePair(renderer: THREE.WebGLRenderer, state: SkyBlendState, initial: boolean): Promise<void> {
    const key = `${state.from}:${state.to}`;
    if (key === this.requestedKey && this.hasPair(state)) return;
    this.requestedKey = key;
    const version = ++this.requestVersion;
    const phases = [...new Set([state.from, state.to])];
    try {
      for (const phase of phases) {
        if (!this.resident.has(phase)) {
          const texture = await this.loader.loadAsync(`${this.basePath}${PANORAMAS[phase]}`);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.anisotropy = 1;
          this.resident.set(phase, texture);
        }
      }
      if (version !== this.requestVersion) return;
      const a = this.resident.get(state.from)!;
      const b = this.resident.get(state.to)!;
      this.mesh.material.uniforms.uSkyA.value = a;
      this.mesh.material.uniforms.uSkyB.value = b;
      this.mesh.material.uniforms.uBlend.value = state.blend;
      this.activeKey = key;
      renderer.initTexture(a);
      if (b !== a) renderer.initTexture(b);
      this.resident.forEach((texture, phase) => {
        if (!phases.includes(phase)) {
          texture.dispose();
          this.resident.delete(phase);
        }
      });
    } catch (error) {
      if (version === this.requestVersion) {
        this.requestedKey = '';
        console.error('[Sky] Panorama load failed; previous valid sky remains visible.', error);
      }
      if (initial) throw error;
    }
  }

  private hasPair(state: SkyBlendState): boolean {
    return this.resident.has(state.from) && this.resident.has(state.to);
  }
}

export function skyBlendForHour(hour: number): SkyBlendState {
  const h = ((hour % 24) + 24) % 24;
  const smooth = (value: number) => {
    const t = THREE.MathUtils.clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  };
  // Load the pair up to one simulated hour before its visual blend begins.
  if (h >= 5 && h < 6) return { from: 'noche', to: 'amanecer', blend: smooth(h - 5) };
  if (h >= 6 && h < 7) return { from: 'amanecer', to: 'dia', blend: 0 };
  if (h >= 7 && h < 8) return { from: 'amanecer', to: 'dia', blend: smooth(h - 7) };
  if (h >= 8 && h < 17) return { from: 'dia', to: 'atardecer', blend: 0 };
  if (h >= 17 && h < 18) return { from: 'dia', to: 'atardecer', blend: smooth(h - 17) };
  if (h >= 18 && h < 19) return { from: 'atardecer', to: 'noche', blend: 0 };
  if (h >= 19 && h < 20) return { from: 'atardecer', to: 'noche', blend: smooth(h - 19) };
  return { from: 'noche', to: 'amanecer', blend: 0 };
}
