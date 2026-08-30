// C:/Users/peter/.gemini/antigravity-ide/scratch/magic-academy-3d/scratch/inspect_all_clips.js
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

async function checkClips(file) {
  try {
    const fbx = await fbxLoader.loadAsync(file);
    console.log(`\n=== Clips in ${file} ===`);
    if (!fbx.animations || fbx.animations.length === 0) {
      console.log('No animations found!');
      return;
    }
    fbx.animations.forEach((clip, idx) => {
      console.log(`Clip ${idx}: "${clip.name}" | Duration: ${clip.duration.toFixed(3)}s | Tracks: ${clip.tracks.length}`);
    });
  } catch (e) {
    console.error(e);
  }
}

async function run() {
  await checkClips('/public/assets/characters/Run.fbx');
  await checkClips('/public/assets/characters/Idle.fbx');
  await checkClips('/public/assets/characters/Jump.fbx');
  await checkClips('/public/assets/characters/Idle_nowood.fbx');
}

run();
