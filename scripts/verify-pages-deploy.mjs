const site = new URL(process.env.PAGES_URL || 'https://lisarstudio.github.io/magic-academy-3d/');
const expectedCommit = process.env.GITHUB_SHA?.toLowerCase();
if (!expectedCommit) throw new Error('GITHUB_SHA is required to verify the deployed version.');

async function get(url, method = 'GET') {
  return fetch(url, { method, cache: 'no-store', headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } });
}

const missionAssets = ['silvio', 'loki'].map((name) => `assets/npc/twin-cats/${name}.glb`);
missionAssets.push('assets/npc/twin-cats/hud-silvio-loki.png');
missionAssets.push('assets/quest/maneki_neko.png');
missionAssets.push('assets/quest/maneki_neko.glb');
for (const letter of ['w', 'u', 'k', 'o', 'n', 'g']) {
  missionAssets.push(`assets/letter-challenge/letter-${letter}.glb`);
  missionAssets.push(`assets/letter-challenge/${letter.toUpperCase()}.png`);
  missionAssets.push(`assets/letter-challenge/hud-${letter.toUpperCase()}.png`);
}
const criticalAssets = [
  'assets/characters/wukong_2.0_rigged.glb',
  'assets/cinematics/optimized/wukong-intro-desktop.mp4',
  'assets/collectibles/teara-wukong-vida.glb',
  'assets/enemies/boss-crab.glb',
  'assets/ui/hud-boss-imperial.png',
  'assets/music/Silvio_OST.mp3',
  ...missionAssets,
];

let verified;
let lastFailure = 'Pages did not serve the expected manifest.';
for (let attempt = 1; attempt <= 24; attempt++) {
  try {
    const versionUrl = new URL(`version.json?verify=${expectedCommit}-${Date.now()}`, site);
    const versionResponse = await get(versionUrl);
    if (!versionResponse.ok) {
      lastFailure = `Version endpoint returned HTTP ${versionResponse.status}.`;
      console.log(`${lastFailure} Waiting (${attempt}/24).`);
    } else {
      const manifest = await versionResponse.json();
      if (manifest.commit !== expectedCommit) {
        lastFailure = `Pages serves commit ${manifest.commit ?? 'without a commit SHA'}.`;
        console.log(`${lastFailure} Waiting (${attempt}/24).`);
      } else {
        const htmlResponse = await get(site);
        if (!htmlResponse.ok) {
          lastFailure = `Published HTML returned HTTP ${htmlResponse.status}.`;
        } else {
          const html = await htmlResponse.text();
          const bundles = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css)(?:\?[^\"]*)?)"/g)]
            .map((match) => new URL(match[1], site));
          const js = bundles.find((asset) => asset.pathname.endsWith('.js'));
          const css = bundles.find((asset) => asset.pathname.endsWith('.css'));
          if (!js || !css) {
            lastFailure = 'Published HTML is missing a JavaScript or CSS bundle.';
          } else {
            const checks = await Promise.all([
              ...bundles.map(async (asset) => ({ path: asset.href, response: await get(asset, 'HEAD') })),
              ...criticalAssets.map(async (path) => {
                const url = new URL(path, site);
                return { path, response: await get(url, 'HEAD') };
              }),
            ]);
            const missing = checks.filter(({ response }) => !response.ok);
            if (missing.length > 0) {
              lastFailure = `Pages is still propagating ${missing.map(({ path, response }) => `${path} (HTTP ${response.status})`).join(', ')}.`;
            } else {
              verified = { manifest, bundles, checkedCriticalAssets: criticalAssets.length };
              break;
            }
          }
        }
        console.log(`${lastFailure} Waiting (${attempt}/24).`);
      }
    }
  } catch (error) {
    lastFailure = `Pages verification request failed: ${error instanceof Error ? error.message : String(error)}.`;
    console.log(`${lastFailure} Waiting (${attempt}/24).`);
  }
  if (attempt < 24) await new Promise((resolve) => setTimeout(resolve, 10000));
}

if (!verified) throw new Error(`Published version did not pass live verification: ${lastFailure}`);

console.log(JSON.stringify({
  result: 'PASS',
  url: site.href,
  version: verified.manifest.version,
  cacheVersion: verified.manifest.cacheVersion,
  commit: verified.manifest.commit,
  buildId: verified.manifest.buildId,
  builtAtUTC: verified.manifest.builtAtUTC,
  checkedBundles: verified.bundles.map((asset) => asset.href),
  checkedCriticalAssets: verified.checkedCriticalAssets,
}, null, 2));
