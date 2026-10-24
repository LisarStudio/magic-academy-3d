import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  base: '/magic-academy-3d/', // Necesario para GitHub Pages
  define: {
    __APP_VERSION__: JSON.stringify(version)
  }
});
