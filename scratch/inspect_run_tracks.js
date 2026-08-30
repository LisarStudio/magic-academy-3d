// C:/Users/peter/.gemini/antigravity-ide/scratch/magic-academy-3d/scratch/inspect_run_tracks.js
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

async function run() {
  try {
    const fbx = await fbxLoader.loadAsync('/public/assets/characters/Run.fbx');
    const clip = fbx.animations[0];
    console.log(`=== Tracks in Run.fbx ===`);
    console.log(`Clip Name: "${clip.name}"`);
    console.log(`Duration: ${clip.duration}s`);
    console.log(`Total tracks: ${clip.tracks.length}`);
    
    // Print a few tracks to see their names and keyframe counts
    for (let i = 0; i < Math.min(25, clip.tracks.length); i++) {
      const track = clip.tracks[i];
      console.log(`Track ${i}: "${track.name}" | Keys: ${track.times.length} | Type: ${track.type}`);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
