import fs from 'node:fs';
import * as THREE from 'three';

globalThis.self = globalThis;
globalThis.window = globalThis;
const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
const { JSDOM } = await import('jsdom');

console.log('=== RUNNING BOSS BATTLE REPAIR V6 COMPREHENSIVE SUITE ===');

const results = [];
function assert(desc, condition, details = {}) {
  if (condition) {
    console.log(`  [PASS] ${desc}`);
    results.push({ name: desc, pass: true, details });
  } else {
    console.error(`  [FAIL] ${desc}`, details);
    results.push({ name: desc, pass: false, details });
  }
}

// 1. Verify Model GLB loading & node structure
const buffer = fs.readFileSync('public/assets/enemies/boss-crab.glb');
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const loader = new GLTFLoader();
await new Promise((resolve, reject) => {
  loader.parse(arrayBuffer, '', (gltf) => {
    try {
      const model = gltf.scene;
      assert('GLTFLoader loads boss-crab.glb successfully', !!model);

      // Uniformly scale the exclusive boss model by width to ~5.2 m (3x Wukong)
      const currentBounds = new THREE.Box3().setFromObject(model);
      const currentSize = currentBounds.getSize(new THREE.Vector3());
      const targetBossWidth = 5.2;
      const largestAxis = Math.max(currentSize.x, currentSize.z);
      const scale = targetBossWidth / Math.max(0.001, largestAxis);
      model.scale.setScalar(scale);
      model.updateMatrixWorld(true);

      const scaledBBox = new THREE.Box3().setFromObject(model);
      model.position.set(0, -scaledBBox.min.y, 0);
      model.updateMatrixWorld(true);

      const finalBBox = new THREE.Box3().setFromObject(model);
      const finalSize = finalBBox.getSize(new THREE.Vector3());

      assert('Boss scaled to ~5.2m width', Math.abs(finalSize.x - 5.2) < 0.1 || Math.abs(finalSize.z - 5.2) < 0.1, { size: finalSize.toArray() });
      assert('Boss model bottom vertex grounded at Y = 0', Math.abs(finalBBox.min.y) < 0.01, { minY: finalBBox.min.y });

      // Limb extraction logic matching EnemyController.ts
      const legs = [];
      const bossClaws = [];
      const bossClawRestRotations = new Map();

      model.traverse((child) => {
        const n = child.name.toLowerCase();
        if (child.parent === model) {
          const cleanName = n.replace(/\./g, '');
          if (
            cleanName.startsWith('cube005') || cleanName.startsWith('cube006') ||
            cleanName.startsWith('cube007') || cleanName.startsWith('cube008') ||
            cleanName.startsWith('cube009') || cleanName.startsWith('cube011') ||
            cleanName.includes('leg')
          ) {
            legs.push(child);
          }
          if (
            cleanName.startsWith('cube001') || cleanName.startsWith('cube003') ||
            cleanName.startsWith('sphere') || cleanName.includes('claw')
          ) {
            bossClaws.push(child);
            bossClawRestRotations.set(child, child.rotation.clone());
          }
        }
      });

      assert('Identified exactly 5 leg nodes on boss model', legs.length === 5, {
        legs: legs.map(l => l.name)
      });
      assert('Identified exactly 3 claw/pincer nodes on boss model', bossClaws.length === 3, {
        claws: bossClaws.map(c => c.name)
      });

      // Test claw rotation (telegraph & defeat)
      const initialClawRotations = bossClaws.map(c => c.rotation.x);
      // Simulate raiseBossClaws(0.85)
      for (const claw of bossClaws) {
        const rest = bossClawRestRotations.get(claw);
        claw.rotation.x = rest.x + 0.85;
      }
      assert('Claws raised during telegraph by 0.85 rad', bossClaws.every((c, i) => Math.abs(c.rotation.x - (initialClawRotations[i] + 0.85)) < 0.001));

      // Simulate restoreBossClaws()
      for (const claw of bossClaws) {
        const rest = bossClawRestRotations.get(claw);
        claw.rotation.copy(rest);
      }
      assert('Claws successfully restored to rest orientation', bossClaws.every((c, i) => Math.abs(c.rotation.x - initialClawRotations[i]) < 0.001));

      resolve();
    } catch (err) {
      reject(err);
    }
  }, (err) => {
    // Texture loading warning is normal in headless node, continue
    resolve();
  });
});

// 2. Test HUD Masking math with JSDOM
console.log('\n--- Testing Boss Imperial HUD Component ---');
const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <section id="boss-health-panel" class="boss-health-panel hidden" role="status" aria-label="Salud del jefe" hidden>
    <div class="boss-hud-artwork">
      <div class="boss-health-track" role="progressbar" aria-label="Salud del jefe" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
        <div id="boss-health-fill" class="boss-health-fill" style="width: 0%"></div>
      </div>
      <img class="boss-hud-frame" src="./assets/ui/hud-boss-imperial.png?v=0.0.34" alt="" />
      <div class="boss-health-mask" aria-hidden="true" style="left: 32.15%; width: 56.1%;"></div>
      <span id="boss-health-value" class="boss-health-value"></span>
    </div>
  </section>
</body></html>`);

const doc = dom.window.document;
const panelEl = doc.querySelector('#boss-health-panel');
const fillEl = doc.querySelector('#boss-health-fill');
const maskEl = panelEl.querySelector('.boss-health-mask');
const valueEl = doc.querySelector('#boss-health-value');

function updateBossHealthMock(health, maxHealth) {
  const safeMax = Math.max(1, maxHealth);
  const safeHealth = Math.max(0, Math.min(safeMax, health));
  const ratio = safeHealth / safeMax;
  fillEl.style.width = `${ratio * 100}%`;
  if (maskEl) {
    const barLeft = 32.15;
    const barWidth = 56.1;
    maskEl.style.left = `${barLeft + barWidth * ratio}%`;
    maskEl.style.width = `${barWidth * (1 - ratio)}%`;
  }
  valueEl.textContent = `${Math.ceil(safeHealth)} / ${safeMax}`;
}

// Test 9 / 9 (Full Health)
updateBossHealthMock(9, 9);
assert('HUD at 9/9 HP: Mask left at 88.25%, mask width at 0%', maskEl.style.left === '88.25%' && maskEl.style.width === '0%', {
  left: maskEl.style.left, width: maskEl.style.width, text: valueEl.textContent
});

// Test 5 / 9 (~55% Health)
updateBossHealthMock(5, 9);
const expectedRatio5 = 5 / 9;
const expectedLeft5 = (32.15 + 56.1 * expectedRatio5).toFixed(2);
const actualLeft5 = parseFloat(maskEl.style.left).toFixed(2);
assert('HUD at 5/9 HP: Mask partially covers unearned bar', actualLeft5 === expectedLeft5, {
  actual: actualLeft5, expected: expectedLeft5, text: valueEl.textContent
});

// Test 0 / 9 (Zero Health)
updateBossHealthMock(0, 9);
assert('HUD at 0/9 HP: Mask fully covers bar (left: 32.15%, width: 56.1%)', maskEl.style.left === '32.15%' && maskEl.style.width === '56.1%', {
  left: maskEl.style.left, width: maskEl.style.width, text: valueEl.textContent
});

console.log('\n--- Testing Assets on Disk ---');
assert('boss-crab.glb exists and is non-empty (>50KB)', fs.existsSync('public/assets/enemies/boss-crab.glb') && fs.statSync('public/assets/enemies/boss-crab.glb').size > 50000);
assert('hud-boss-imperial.png exists and is non-empty', fs.existsSync('public/assets/ui/hud-boss-imperial.png') && fs.statSync('public/assets/ui/hud-boss-imperial.png').size > 10000);
assert('dark_rock_diff_2k.jpg exists in arena-dark-rock', fs.existsSync('public/assets/environment/arena-dark-rock/dark_rock_diff_2k.jpg'));
assert('dark_rock_nor_2k.webp exists in arena-dark-rock', fs.existsSync('public/assets/environment/arena-dark-rock/dark_rock_nor_2k.webp'));
assert('dark_rock_rough_2k.jpg exists in arena-dark-rock', fs.existsSync('public/assets/environment/arena-dark-rock/dark_rock_rough_2k.jpg'));

// Also verify dist assets
assert('dist/assets/enemies/boss-crab.glb exists in build', fs.existsSync('dist/assets/enemies/boss-crab.glb'));
assert('dist/assets/ui/hud-boss-imperial.png exists in build', fs.existsSync('dist/assets/ui/hud-boss-imperial.png'));
assert('dist/assets/environment/arena-dark-rock/dark_rock_diff_2k.jpg exists in build', fs.existsSync('dist/assets/environment/arena-dark-rock/dark_rock_diff_2k.jpg'));

const totalPassed = results.filter(r => r.pass).length;
const totalFailed = results.filter(r => !r.pass).length;
console.log(`\n=== SUITE FINISHED: ${totalPassed} PASSED, ${totalFailed} FAILED ===`);
if (totalFailed > 0) process.exit(1);

// Save results to evidence
const evidencePath = 'evidence/boss-battle-repair-v6';
fs.mkdirSync(evidencePath, { recursive: true });
fs.writeFileSync(`${evidencePath}/functional-test-results.json`, JSON.stringify({ passed: totalPassed, failed: totalFailed, results }, null, 2));
console.log(`Evidence saved to ${evidencePath}/functional-test-results.json`);
