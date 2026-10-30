import * as THREE from 'three';

/**
 * Compact Golden Temple look for authored ceremonial architecture.
 * A 16³ LUT is packed into one 256x16 RGBA texture and sampled in the existing
 * material shader after tone mapping but before output color-space conversion.
 * This keeps the renderer's ACES/sRGB pipeline intact and leaves HTML HUD/UI
 * untouched. The texture is shared and tiny (16 KiB).
 */
const SIZE = 16;
const LUT_WIDTH = SIZE * SIZE;
const LUT_HEIGHT = SIZE;
const goldenLut = makeGoldenTempleTexture();

export const GOLDEN_TEMPLE_PRESET = Object.freeze({
  name: 'Golden Temple',
  inputSpace: 'linear tone-mapped RGB',
  outputSpace: 'linear RGB before renderer outputColorSpace conversion',
  interpolation: 'trilinear',
  intensity: 0.62,
});

export function applyGoldenTempleLut(root: THREE.Object3D, intensity = GOLDEN_TEMPLE_PRESET.intensity): number {
  const strength = THREE.MathUtils.clamp(intensity, 0, 1);
  const clones = new Map<THREE.Material, THREE.Material>();
  let applied = 0;
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const original = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const graded = original.map((material) => {
      if (!(material instanceof THREE.MeshStandardMaterial) || material.userData.goldenTempleLut) return material;
      let clone = clones.get(material);
      if (!clone) {
        clone = material.clone();
        const baseCompile = clone.onBeforeCompile;
        const baseKey = clone.customProgramCacheKey();
        clone.onBeforeCompile = (shader, renderer) => {
          baseCompile.call(clone, shader, renderer);
          shader.uniforms.goldenTempleLut = { value: goldenLut };
          shader.uniforms.goldenTempleStrength = { value: strength };
          shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `uniform sampler2D goldenTempleLut;
             uniform float goldenTempleStrength;
             vec3 goldenTempleSample(vec3 color) {
               vec3 p = clamp(color, 0.0, 1.0) * ${SIZE - 1}.0;
               float b0 = floor(p.b);
               float b1 = min(b0 + 1.0, ${SIZE - 1}.0);
               vec2 uv0 = vec2((b0 * ${SIZE}.0 + p.r + 0.5) / ${LUT_WIDTH}.0, (p.g + 0.5) / ${LUT_HEIGHT}.0);
               vec2 uv1 = vec2((b1 * ${SIZE}.0 + p.r + 0.5) / ${LUT_WIDTH}.0, (p.g + 0.5) / ${LUT_HEIGHT}.0);
               return mix(texture2D(goldenTempleLut, uv0).rgb, texture2D(goldenTempleLut, uv1).rgb, fract(p.b));
             }
             void main() {`
          );
          shader.fragmentShader = shader.fragmentShader.replace(
            '#include <tonemapping_fragment>',
            '#include <tonemapping_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, goldenTempleSample(gl_FragColor.rgb), goldenTempleStrength);'
          );
        };
        clone.customProgramCacheKey = () => `${baseKey}|golden-temple-lut-16-v1`;
        clone.userData.goldenTempleLut = true;
        clone.needsUpdate = true;
        clones.set(material, clone);
        applied++;
      }
      return clone;
    });
    mesh.material = Array.isArray(mesh.material) ? graded : graded[0];
  });
  return applied;
}

function makeGoldenTempleTexture(): THREE.DataTexture {
  const data = new Uint8Array(LUT_WIDTH * LUT_HEIGHT * 4);
  let i = 0;
  // Pack the blue slices horizontally, with green as the texture row and red
  // as the coordinate inside each slice. This matches goldenTempleSample().
  for (let g = 0; g < SIZE; g++) {
    for (let b = 0; b < SIZE; b++) {
      for (let r = 0; r < SIZE; r++) {
        const color = grade(r / (SIZE - 1), g / (SIZE - 1), b / (SIZE - 1));
        data[i++] = Math.round(color[0] * 255);
        data[i++] = Math.round(color[1] * 255);
        data[i++] = Math.round(color[2] * 255);
        data[i++] = 255;
      }
    }
  }
  const texture = new THREE.DataTexture(data, LUT_WIDTH, LUT_HEIGHT, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.name = 'golden_temple_lut_16x16x16';
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function grade(r: number, g: number, b: number): [number, number, number] {
  // Gentle cinematic contrast, cool shadow separation, amber highlights,
  // and restrained saturation. Values remain scene colors, not flat palette replacements.
  let rr = (r - 0.5) * 1.055 + 0.5;
  let gg = (g - 0.5) * 1.055 + 0.5;
  let bb = (b - 0.5) * 1.055 + 0.5;
  const luminance = rr * 0.2126 + gg * 0.7152 + bb * 0.0722;
  const shadow = 1 - smoothstep(0.035, 0.48, luminance);
  const highlight = smoothstep(0.38, 0.92, luminance);
  rr += 0.014 * shadow + 0.075 * highlight;
  gg += 0.018 * shadow + 0.032 * highlight;
  bb += 0.038 * shadow - 0.075 * highlight;
  const luma = rr * 0.2126 + gg * 0.7152 + bb * 0.0722;
  rr = luma + (rr - luma) * 1.045;
  gg = luma + (gg - luma) * 1.045;
  bb = luma + (bb - luma) * 1.045;
  return [clamp01(rr), clamp01(gg), clamp01(bb)];
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
