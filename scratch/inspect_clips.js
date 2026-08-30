// C:/Users/peter/.gemini/antigravity-ide/scratch/magic-academy-3d/scratch/inspect_clips.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { readFileSync } from 'fs';

// FBXLoader needs a loading manager or we can pass a custom arraybuffer loader
// Since node doesn't have fetch, we mock load to read from filesystem.
const fbxLoader = new FBXLoader();

// Mock the file loading in three.js FileLoader
THREE.FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
  try {
    // Convert public URL to absolute local path
    const localPath = url.startsWith('/') ? url.slice(1) : url;
    const buffer = readFileSync(localPath);
    // Convert Node Buffer to ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    onLoad(arrayBuffer);
  } catch (err) {
    if (onError) onError(err);
  }
};

async function inspectClip(file, label) {
  console.log(`\n========================================`);
  console.log(`INSPECTING ${label} (${file})`);
  console.log(`========================================`);
  try {
    const fbx = await fbxLoader.loadAsync(file);
    if (!fbx.animations || fbx.animations.length === 0) {
      console.log('No animations found!');
      return;
    }
    const clip = fbx.animations[0];
    console.log(`Clip Name: ${clip.name}`);
    console.log(`Duration: ${clip.duration} seconds`);
    console.log(`Track Count: ${clip.tracks.length}`);
    
    // Look for root-level or hips-level tracks
    const rootTracks = clip.tracks.filter(t => t.name.includes('Hips') || t.name.split('.').length <= 2);
    console.log(`\nRoot / Hips tracks found (${rootTracks.length}):`);
    for (const track of rootTracks) {
      console.log(`Track: ${track.name} (${track.type})`);
      console.log(`  Keyframes: ${track.times.length}`);
      if (track.times.length > 0) {
        // Print first keyframe value
        let valStr = '';
        if (track.name.endsWith('.position')) {
          valStr = `[${track.values[0].toFixed(3)}, ${track.values[1].toFixed(3)}, ${track.values[2].toFixed(3)}]`;
        } else if (track.name.endsWith('.quaternion')) {
          valStr = `[x:${track.values[0].toFixed(3)}, y:${track.values[1].toFixed(3)}, z:${track.values[2].toFixed(3)}, w:${track.values[3].toFixed(3)}]`;
        } else {
          valStr = `(raw length: ${track.values.length})`;
        }
        console.log(`  First val: ${valStr}`);
      }
    }
  } catch (err) {
    console.error(`Error loading ${file}:`, err);
  }
}

async function run() {
  await inspectClip('/public/assets/characters/Idle.fbx', 'Idle (Armed)');
  await inspectClip('/public/assets/characters/Idle_nowood.fbx', 'Idle (Unarmed)');
  await inspectClip('/public/assets/characters/Run.fbx', 'Run (Armed)');
  await inspectClip('/public/assets/characters/Running_nowood.fbx', 'Run (Unarmed)');
}

run();
