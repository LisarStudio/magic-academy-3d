import './style.css';
import { Game } from './core/Game';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (canvas) {
    const game = new Game(canvas);
    (window as any).gameInstance = game;
    game.start();
  }
});
