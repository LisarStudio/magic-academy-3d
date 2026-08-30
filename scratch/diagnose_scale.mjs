import * as THREE from 'three';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Using Three.js FBXLoader and GLTFLoader requires a DOM environment in Node.js,
// which is annoying to set up.
// Alternatively, we can just read the JSON chunks of the GLB and print the node translations!

function inspectGLB(filePath) {
  const buf = readFileSync(filePath);
  const jsonChunkLength = buf.readUInt32LE(12);
  const jsonStr = buf.slice(20, 20 + jsonChunkLength).toString('utf8');
  const glb = JSON.parse(jsonStr);
  
  console.log(`\n--- INSPECTING ${filePath} ---`);
  
  // Find Armature node
  const armatureNode = glb.nodes.find(n => n.name === 'Armature');
  console.log('Armature Scale:', armatureNode?.scale || 'Not found / Default [1,1,1]');
  console.log('Armature Rotation:', armatureNode?.rotation || 'Not found / Default');
  
  // Find mixamorig:Hips node
  const hipsNode = glb.nodes.find(n => n.name === 'mixamorig:Hips');
  console.log('mixamorig:Hips Translation:', hipsNode?.translation || 'Not found');
  console.log('mixamorig:Hips Rotation:', hipsNode?.rotation || 'Not found');
  
  // Find Spine node
  const spineNode = glb.nodes.find(n => n.name === 'mixamorig:Spine');
  console.log('mixamorig:Spine Translation:', spineNode?.translation || 'Not found');
}

inspectGLB('public/assets/characters/player.glb');
inspectGLB('public/assets/characters/wood.glb');
