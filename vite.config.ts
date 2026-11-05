import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };
const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const git = (args: string[], fallback: string): string => {
  try { return execFileSync('git', args, { cwd: projectRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || fallback; }
  catch { return fallback; }
};
const commit = (process.env.GITHUB_SHA || git(['rev-parse', 'HEAD'], 'unknown')).toLowerCase();
const dirtyTree = process.env.GITHUB_ACTIONS === 'true' ? false : Boolean(git(['status', '--porcelain'], ''));
const buildId = process.env.BUILD_ID || `local-${Date.now().toString(36)}`;
const builtAtUTC = process.env.BUILD_TIME_UTC || new Date().toISOString();
const cacheVersion = `${version}+${commit.slice(0, 7)}${dirtyTree ? `.dirty.${buildId}` : ''}`;
const buildManifest = {
  version,
  cacheVersion,
  commit,
  buildId,
  builtAtUTC,
  dirtyWorkingTree: dirtyTree,
};

export default defineConfig({
  base: '/magic-academy-3d/', // Necesario para GitHub Pages
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the Three.js renderer and loaders in a separately cached
          // vendor file. This reduces the initial application bundle without
          // changing texture, geometry, or render quality on mobile/web.
          if (id.includes('/node_modules/three/')) return 'three-vendor';
        }
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(cacheVersion),
    __BUILD_COMMIT__: JSON.stringify(commit),
    __BUILD_ID__: JSON.stringify(buildId),
    __BUILD_TIME_UTC__: JSON.stringify(builtAtUTC),
  },
  plugins: [{
    name: 'wukong-build-manifest',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify(buildManifest, null, 2) + '\n' });
    },
  }],
});
