// C:/Users/peter/.gemini/antigravity-ide/scratch/magic-academy-3d/scratch/inspect_rotations.js
const fs = require('fs');

function scanRotations(filePath) {
  console.log(`\n=== Scanning Rotations in ${filePath} ===`);
  const buf = fs.readFileSync(filePath);
  const text = buf.toString('latin1');

  // Let's find mixamorig:Hips rotation tracks
  // In FBX format, nodes are like "Model", "NodeAttribute", "AnimationCurve" etc.
  // Let's search for "Hips" and see if there are any rotation properties or curves
  // We can look at the raw binary/text to find keywords like "Hips" and "Lcl Rotation"
  
  // Let's find occurrences of "Hips"
  let pos = 0;
  const occurrences = [];
  while ((pos = text.indexOf('Hips', pos)) !== -1) {
    occurrences.push(pos);
    pos += 4;
  }
  console.log(`Found ${occurrences.length} occurrences of Hips`);

  // Let's search for "Lcl Rotation" which indicates local rotation values
  let rotPos = 0;
  const rotOccurrences = [];
  while ((rotPos = text.indexOf('Lcl Rotation', rotPos)) !== -1) {
    rotOccurrences.push(rotPos);
    rotPos += 12;
  }
  console.log(`Found ${rotOccurrences.length} occurrences of Lcl Rotation`);

  // Let's print around the first few occurrences of Lcl Rotation
  for (let i = 0; i < Math.min(5, rotOccurrences.length); i++) {
    const start = Math.max(0, rotOccurrences[i] - 100);
    const end = Math.min(text.length, rotOccurrences[i] + 200);
    console.log(`--- Match ${i} at position ${rotOccurrences[i]} ---`);
    const snippet = buf.slice(start, end).toString('utf8');
    // Replace non-printable characters with .
    let clean = '';
    for (let j = 0; j < snippet.length; j++) {
      const code = snippet.charCodeAt(j);
      if (code >= 32 && code < 127) clean += snippet[j];
      else if (snippet[j] === '\n') clean += '\n';
      else clean += '.';
    }
    console.log(clean);
  }
}

scanRotations('public/assets/characters/Idle.fbx');
scanRotations('public/assets/characters/Idle_nowood.fbx');
