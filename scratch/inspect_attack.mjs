import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { readFileSync } from 'fs';

const loader = new GLTFLoader();

THREE.FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
  try {
    const localPath = url.startsWith('/') ? url.slice(1) : url;
    const buffer = readFileSync(localPath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    onLoad(arrayBuffer);
  } catch (err) {
    if (onError) onError(err);
  }
};

async function inspectGLB() {
  console.log('Inspecting atack_wood.glb...');
  const gltf = await loader.loadAsync('public/assets/characters/atack_wood.glb');
  console.log('Animations count:', gltf.animations.length);
  if (gltf.animations && gltf.animations.length > 0) {
    for (const clip of gltf.animations) {
      console.log(`Clip: "${clip.name}", duration: ${clip.duration}s, tracks: ${clip.tracks.length}`);
    }
  }
}

inspectGLB().catch(console.error);
