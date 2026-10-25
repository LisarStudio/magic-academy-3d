import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

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
    __APP_VERSION__: JSON.stringify(version)
  }
});
