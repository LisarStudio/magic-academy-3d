// C:/Users/peter/.gemini/antigravity-ide/scratch/magic-academy-3d/scratch/inspect_hips_rotation.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { readFileSync } from 'fs';

const fbxLoader = new FBXLoader();

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

async function inspectHips(file, label) {
  try {
    const fbx = await fbxLoader.loadAsync(file);
    if (!fbx.animations || fbx.animations.length === 0) return;
    const clip = fbx.animations[0];
    
    // Find Hips tracks
    const hipsTracks = clip.tracks.filter(t => t.name.toLowerCase().includes('hips'));
    console.log(`\n--- Hips tracks in ${label} (${file}) ---`);
    for (const track of hipsTracks) {
      console.log(`Track name in file: "${track.name}"`);
      if (track.name.endsWith('.quaternion')) {
        console.log(`  Keyframes: ${track.times.length}`);
        console.log(`  First quaternion val: [x:${track.values[0].toFixed(5)}, y:${track.values[1].toFixed(5)}, z:${track.values[2].toFixed(5)}, w:${track.values[3].toFixed(5)}]`);
      }
      if (track.name.endsWith('.position')) {
        console.log(`  First position val: [${track.values[0].toFixed(5)}, ${track.values[1].toFixed(5)}, ${track.values[2].toFixed(5)}]`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await inspectHips('/public/assets/characters/Idle.fbx', 'Idle (Armed)');
  await inspectHips('/public/assets/characters/Idle_nowood.fbx', 'Idle (Unarmed)');
  await inspectHips('/public/assets/characters/Run.fbx', 'Run (Armed)');
  await inspectHips('/public/assets/characters/Running_nowood.fbx', 'Run (Unarmed)');
}

run();
