const site = new URL(process.env.PAGES_URL || 'https://lisarstudio.github.io/magic-academy-3d/');
const expectedCommit = process.env.GITHUB_SHA?.toLowerCase();
if (!expectedCommit) throw new Error('GITHUB_SHA is required to verify the deployed version.');

async function get(url, method = 'GET') {
  return fetch(url, { method, cache: 'no-store', headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } });
}

let manifest;
for (let attempt = 1; attempt <= 24; attempt++) {
  try {
    const url = new URL(`version.json?verify=${expectedCommit}-${Date.now()}`, site);
    const response = await get(url);
    if (response.ok) {
      const current = await response.json();
      if (current.commit === expectedCommit) { manifest = current; break; }
      console.log(`Pages still serves ${current.commit ?? 'an older manifest'}; waiting (${attempt}/24).`);
    } else {
      console.log(`Version endpoint returned HTTP ${response.status}; waiting (${attempt}/24).`);
    }
  } catch (error) {
    console.log(`Pages is not ready yet (${attempt}/24): ${error.message}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 10000));
}
if (!manifest) throw new Error(`Published version did not converge to expected commit ${expectedCommit}.`);

const htmlResponse = await get(site);
if (!htmlResponse.ok) throw new Error(`Published HTML returned HTTP ${htmlResponse.status}.`);
const html = await htmlResponse.text();
const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^"]*)?)"/g)]
  .map((match) => new URL(match[1], site));
for (const suffix of ['.js', '.css']) {
  const asset = assets.find((url) => url.pathname.endsWith(suffix));
  if (!asset) throw new Error(`Published HTML has no ${suffix} asset.`);
  const response = await get(asset, 'HEAD');
  if (!response.ok) throw new Error(`Published ${suffix} asset returned HTTP ${response.status}: ${asset}`);
}
for (const path of [
  'assets/characters/wukong_2.0_rigged.glb',
  'assets/cinematics/optimized/wukong-intro-desktop.mp4',
  'assets/collectibles/teara-wukong-vida.glb',
]) {
  const response = await get(new URL(path, site), 'HEAD');
  if (!response.ok) throw new Error(`Published critical asset returned HTTP ${response.status}: ${path}`);
}

console.log(JSON.stringify({
  result: 'PASS',
  url: site.href,
  version: manifest.version,
  cacheVersion: manifest.cacheVersion,
  commit: manifest.commit,
  buildId: manifest.buildId,
  builtAtUTC: manifest.builtAtUTC,
  checkedBundles: assets.map((asset) => asset.href),
  checkedCriticalAssets: 3,
}, null, 2));
