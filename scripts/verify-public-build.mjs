import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'dist';
const basePath = '/magic-academy-3d/';
const html = await readFile(join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(join(root, 'version.json'), 'utf8'));
const expectedCommit = process.env.GITHUB_SHA?.toLowerCase();

if (!html.includes(basePath)) throw new Error(`Built HTML is missing GitHub Pages base path ${basePath}`);
if (!manifest.commit || manifest.commit === 'unknown') throw new Error('Build manifest has no Git commit SHA.');
if (expectedCommit && manifest.commit !== expectedCommit) throw new Error(`Build manifest SHA ${manifest.commit} differs from ${expectedCommit}.`);
if (!manifest.buildId || !manifest.builtAtUTC || !manifest.version) throw new Error('Build manifest is missing version, build ID, or UTC timestamp.');

const bundledFiles = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)]
  .map((match) => match[1].split('?')[0])
  .filter((path) => path.startsWith(basePath));
if (!bundledFiles.some((path) => path.endsWith('.js'))) throw new Error('No hashed JavaScript entry was found in dist/index.html.');
if (!bundledFiles.some((path) => path.endsWith('.css'))) throw new Error('No hashed stylesheet was found in dist/index.html.');
for (const path of bundledFiles) await access(join(root, path.slice(basePath.length)));

const missionAssets = ['silvio', 'loki'].map((name) => `assets/npc/twin-cats/${name}.glb`);
missionAssets.push('assets/npc/twin-cats/hud-silvio-loki.png');
missionAssets.push('assets/quest/maneki_neko.png');
missionAssets.push('assets/quest/maneki_neko.glb');
missionAssets.push('assets/dialogue-huds/Silvio_Loki_Dialogue.png');
missionAssets.push('assets/dialogue-huds/Gekko_Dialogue.png');
missionAssets.push('assets/dialogue-huds/Nezha_X_Dialogue.png');
for (const letter of ['w', 'u', 'k', 'o', 'n', 'g']) {
  missionAssets.push(`assets/letter-challenge/letter-${letter}.glb`);
  missionAssets.push(`assets/letter-challenge/${letter.toUpperCase()}.png`);
  missionAssets.push(`assets/letter-challenge/hud-${letter.toUpperCase()}.png`);
}

for (const path of [
  'assets/characters/wukong_2.0_rigged.glb',
  'assets/cinematics/optimized/wukong-intro-desktop.mp4',
  'assets/collectibles/teara-wukong-vida.glb',
  'assets/enemies/boss-crab.glb',
  'assets/ui/hud-boss-imperial.png',
  'assets/music/Silvio_OST.mp3',
  ...missionAssets,
]) {
  await access(join(root, path));
}

console.log(JSON.stringify({
  result: 'PASS',
  version: manifest.version,
  cacheVersion: manifest.cacheVersion,
  commit: manifest.commit,
  buildId: manifest.buildId,
  builtAtUTC: manifest.builtAtUTC,
  dirtyWorkingTree: manifest.dirtyWorkingTree,
  bundledFiles,
  criticalAssets: 6 + missionAssets.length,
}, null, 2));
