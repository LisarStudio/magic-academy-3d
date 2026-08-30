import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.self = global.window; // Important for some Three.js internals

import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { readFileSync, writeFileSync } from 'fs';

// Mock FileLoader
THREE.Cache.enabled = false;
const originalLoad = THREE.FileLoader.prototype.load;
THREE.FileLoader.prototype.load = function (url, onLoad, onProgress, onError) {
  try {
    const data = readFileSync(url);
    // FBXLoader expects ArrayBuffer
    const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    onLoad(ab);
  } catch (e) {
    if (onError) onError(e);
  }
};

const loader = new FBXLoader();
loader.load('public/assets/characters/Idle.fbx', (object) => {
  const out = [];
  function printNode(node, depth = 0) {
    const indent = '  '.repeat(depth);
    const pos = ` pos:[${node.position.toArray().map(n=>n.toFixed(3)).join(',')}]`;
    const rot = ` rot:[${node.quaternion.toArray().map(n=>n.toFixed(3)).join(',')}]`;
    const scl = ` scl:[${node.scale.toArray().map(n=>n.toFixed(3)).join(',')}]`;
    out.push(`${indent}- ${node.name || 'unnamed'}${pos}${rot}${scl}`);
    
    for (const child of node.children) {
      printNode(child, depth + 1);
    }
  }
  
  printNode(object, 0);
  
  // Also print the tracks of the animation!
  if (object.animations && object.animations.length > 0) {
    out.push('\n=== ANIMATION TRACKS ===');
    const clip = object.animations[0];
    for (const track of clip.tracks) {
      // Just print track name and number of keys
      out.push(`Track: ${track.name} (${track.values.length} values)`);
    }
  }
  
  writeFileSync('scratch/fbx_nodes.txt', out.join('\n'));
  console.log('Dumped FBX nodes to scratch/fbx_nodes.txt');
}, undefined, (e) => {
  console.error(e);
});
