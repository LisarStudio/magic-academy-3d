import * as THREE from 'three';

export class TextureGenerator {
  public static createStoneWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base dark stone color
    ctx.fillStyle = '#2d2838';
    ctx.fillRect(0, 0, 512, 512);

    // Stone blocks grid pattern
    const rows = 8;
    const cols = 4;
    const blockH = 512 / rows;
    const blockW = 512 / cols;

    for (let r = 0; r < rows; r++) {
      const offsetX = (r % 2) * (blockW / 2);
      for (let c = -1; c < cols + 1; c++) {
        const x = c * blockW + offsetX;
        const y = r * blockH;

        // Random stone variation
        const shade = Math.floor(40 + Math.random() * 35);
        ctx.fillStyle = `rgb(${shade + 5}, ${shade}, ${shade + 15})`;
        ctx.fillRect(x + 2, y + 2, blockW - 4, blockH - 4);

        // Stone texture noise dots
        for (let i = 0; i < 40; i++) {
          const nx = x + Math.random() * blockW;
          const ny = y + Math.random() * blockH;
          const alpha = 0.05 + Math.random() * 0.1;
          ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
          ctx.fillRect(nx, ny, 3, 3);
        }

        // Mortar lines shadow & highlight
        ctx.strokeStyle = '#120f18';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, blockW, blockH);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  public static createCheckerFloorTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    const tileSize = 64;
    for (let x = 0; x < 512; x += tileSize) {
      for (let y = 0; y < 512; y += tileSize) {
        const isDark = ((x / tileSize) + (y / tileSize)) % 2 === 0;
        ctx.fillStyle = isDark ? '#1a1824' : '#dcd6e8';
        ctx.fillRect(x, y, tileSize, tileSize);

        // Marble veining details
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + Math.random() * tileSize, y);
        ctx.lineTo(x + Math.random() * tileSize, y + tileSize);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  public static createWoodTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Dark oak wood base
    ctx.fillStyle = '#4a2e1b';
    ctx.fillRect(0, 0, 256, 256);

    // Wood grain lines
    ctx.strokeStyle = 'rgba(30, 15, 5, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 256; i += 6) {
      ctx.beginPath();
      ctx.moveTo(0, i + Math.sin(i * 0.1) * 4);
      ctx.lineTo(256, i + Math.cos(i * 0.1) * 4);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  public static createCarpetTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Burgundy carpet center
    ctx.fillStyle = '#6e1b24';
    ctx.fillRect(0, 0, 256, 256);

    // Gold embroidered border
    ctx.strokeStyle = '#f3c644';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 244, 244);

    ctx.strokeStyle = '#996e00';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 224, 224);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  public static createStainedGlassTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Arch window background
    ctx.fillStyle = '#0a0815';
    ctx.fillRect(0, 0, 256, 512);

    // Multicolored stained glass panes
    const colors = ['#9d4edd', '#3df3ff', '#f3c644', '#ff2244', '#22cc44'];
    for (let y = 50; y < 450; y += 50) {
      for (let x = 30; x < 220; x += 45) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, 40, 45);
      }
    }

    // Lead window frame grid
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 40, 216, 432);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  public static createPortraitTexture(name: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    // Gilded Frame
    ctx.fillStyle = '#d4a017';
    ctx.fillRect(0, 0, 256, 320);

    ctx.fillStyle = '#4a3000';
    ctx.fillRect(16, 16, 224, 288);

    // Canvas Oil Painting background
    ctx.fillStyle = '#221a2e';
    ctx.fillRect(24, 24, 208, 272);

    // Wizard silhouette
    ctx.fillStyle = '#dcd6e8';
    ctx.font = 'bold 20px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧙‍♂️', 128, 140);
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.fillStyle = '#f3c644';
    ctx.fillText(name, 128, 220);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
