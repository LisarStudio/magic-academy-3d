import './style.css';
import { Game } from './core/Game';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (canvas) {
    try {
      const game = new Game(canvas);
      (window as any).gameInstance = game;
      game.start().catch((error) => game.showStartupError(error));
    } catch (error) {
      // WebGL context creation can fail on a device under GPU/memory pressure.
      // Do not leave the static HTML loading card pretending the game is still
      // progressing; show a recoverable diagnostic immediately.
      console.error('[Bootstrap] Could not initialize the game renderer:', error);
      const status = document.getElementById('loading-status');
      const percent = document.getElementById('loading-percent');
      const progress = document.getElementById('loading-progress');
      const retry = document.getElementById('btn-retry-loading');
      if (status) status.textContent = 'No se pudo iniciar el juego 3D en este navegador. Recarga la página e inténtalo de nuevo.';
      if (percent) percent.textContent = 'No se pudo iniciar';
      if (progress) {
        progress.classList.remove('loading-progress-indeterminate');
        (progress as HTMLElement).style.width = '0';
      }
      retry?.classList.remove('hidden');
      retry?.addEventListener('click', () => window.location.reload(), { once: true });
    }
  }
});
