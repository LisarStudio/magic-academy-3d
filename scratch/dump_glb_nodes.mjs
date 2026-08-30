import { readFileSync, writeFileSync } from 'fs';

function dumpNodes(filePath) {
  const buf = readFileSync(filePath);
  const jsonChunkLength = buf.readUInt32LE(12);
  const jsonStr = buf.slice(20, 20 + jsonChunkLength).toString('utf8');
  const glb = JSON.parse(jsonStr);
  
  const nodes = glb.nodes;
  const out = [];
  
  function printNode(index, depth = 0) {
    const node = nodes[index];
    const indent = '  '.repeat(depth);
    const pos = node.translation ? ` pos:[${node.translation.map(n=>n.toFixed(3)).join(',')}]` : '';
    const rot = node.rotation ? ` rot:[${node.rotation.map(n=>n.toFixed(3)).join(',')}]` : '';
    const scl = node.scale ? ` scl:[${node.scale.map(n=>n.toFixed(3)).join(',')}]` : '';
    
    out.push(`${indent}- [${index}] ${node.name || 'unnamed'}${pos}${rot}${scl}`);
    
    if (node.children) {
      for (const childIdx of node.children) {
        printNode(childIdx, depth + 1);
      }
    }
  }
  
  // Find roots (nodes not present in any children array)
  const childSet = new Set();
  for (const n of nodes) {
    if (n.children) {
      for (const c of n.children) childSet.add(c);
    }
  }
  
  const roots = [];
  for (let i = 0; i < nodes.length; i++) {
    if (!childSet.has(i)) roots.push(i);
  }
  
  for (const rootIdx of roots) {
    printNode(rootIdx, 0);
  }
  
  return out.join('\n');
}

const pNodes = dumpNodes('public/assets/characters/player.glb');
writeFileSync('scratch/player_nodes.txt', pNodes);
console.log('Dumped player nodes to scratch/player_nodes.txt');
