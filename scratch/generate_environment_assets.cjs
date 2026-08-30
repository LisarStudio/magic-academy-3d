// Polyfill FileReader for Node.js GLTFExporter
global.FileReader = class FileReader {
  readAsDataURL(blob) {
    if (blob && typeof blob.arrayBuffer === 'function') {
      blob.arrayBuffer().then(ab => {
        const buf = Buffer.from(ab);
        this.result = 'data:application/octet-stream;base64,' + buf.toString('base64');
        if (this.onload) this.onload();
      });
    } else {
      const buf = Buffer.from(blob);
      this.result = 'data:application/octet-stream;base64,' + buf.toString('base64');
      if (this.onload) this.onload();
    }
  }
  readAsArrayBuffer(blob) {
    if (blob && typeof blob.arrayBuffer === 'function') {
      blob.arrayBuffer().then(ab => {
        this.result = ab;
        if (this.onload) this.onload();
      });
    } else {
      this.result = blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength);
      if (this.onload) this.onload();
    }
  }
};

const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'public', 'assets', 'environment');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function exportGLTF(scene, filename) {
  const exporter = new GLTFExporter();
  const gltf = await exporter.parseAsync(scene, { binary: false });
  const filePath = path.join(outputDir, filename);
  const content = typeof gltf === 'string' ? gltf : JSON.stringify(gltf, null, 2);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Exported ${filename} (${(content.length / 1024).toFixed(1)} KB)`);
}

async function generateAssets() {
  console.log('Building 3D environment GLTF assets...');

  // 1. TREE CONIFER / PINE
  {
    const scene = new THREE.Scene();
    scene.name = 'tree_conifer';

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.85 });
    const needleMat1 = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });
    const needleMat2 = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.65 });
    const needleMat3 = new THREE.MeshStandardMaterial({ color: 0x40916c, roughness: 0.6 });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.55, 6.0, 10), barkMat);
    trunk.position.y = 3.0;
    scene.add(trunk);

    const tierHeights = [2.8, 4.0, 5.1, 6.0, 6.8];
    const tierRadii = [2.2, 1.8, 1.4, 1.0, 0.6];
    const tierMats = [needleMat1, needleMat2, needleMat2, needleMat3, needleMat3];

    tierHeights.forEach((h, idx) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(tierRadii[idx], 1.6, 10), tierMats[idx]);
      cone.position.y = h;
      scene.add(cone);
    });

    await exportGLTF(scene, 'tree_conifer.glb');
  }

  // 2. TREE OAK
  {
    const scene = new THREE.Scene();
    scene.name = 'tree_oak';

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.85 });
    const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.65 });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.6 });

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 4.5, 10), barkMat);
    trunk.position.y = 2.25;
    scene.add(trunk);

    // Main branches
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.5, 8), barkMat);
    b1.position.set(0.6, 3.2, 0);
    b1.rotation.z = -0.4;
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 2.2, 8), barkMat);
    b2.position.set(-0.6, 3.0, 0.4);
    b2.rotation.z = 0.45;
    b2.rotation.x = 0.3;
    scene.add(b1, b2);

    // Foliage clusters
    const clusterPositions = [
      { pos: [0, 5.2, 0], r: 1.8, mat: leafMat1 },
      { pos: [1.2, 4.5, 0.4], r: 1.4, mat: leafMat2 },
      { pos: [-1.2, 4.3, 0.6], r: 1.3, mat: leafMat1 },
      { pos: [0, 4.2, -1.2], r: 1.4, mat: leafMat2 },
      { pos: [0, 6.0, 0], r: 1.2, mat: leafMat2 },
    ];

    clusterPositions.forEach((c) => {
      const geo = new THREE.IcosahedronGeometry(c.r, 2);
      const posAttr = geo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        const noise = (Math.sin(x * 3.0) + Math.cos(y * 3.0) + Math.sin(z * 3.0)) * 0.15;
        posAttr.setXYZ(i, x + noise, y + noise, z + noise);
      }
      geo.computeVertexNormals();

      const cluster = new THREE.Mesh(geo, c.mat);
      cluster.position.set(...c.pos);
      scene.add(cluster);
    });

    await exportGLTF(scene, 'tree_oak.glb');
  }

  // 3. BUSH MEADOW
  {
    const scene = new THREE.Scene();
    scene.name = 'bush_meadow';

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.6 });

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6), stemMat);
    stem.position.y = 0.4;
    scene.add(stem);

    const bushClusters = [
      [0, 0.8, 0, 0.75],
      [0.45, 0.7, 0.3, 0.55],
      [-0.45, 0.65, -0.2, 0.5],
      [0.2, 0.65, -0.4, 0.52],
      [-0.3, 0.75, 0.35, 0.58],
    ];

    bushClusters.forEach(([x, y, z, r]) => {
      const geo = new THREE.IcosahedronGeometry(r, 2);
      const posAttr = geo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const vz = posAttr.getZ(i);
        const n = Math.sin(vx * 5.0) * 0.08;
        posAttr.setXYZ(i, vx + n, vy + n, vz + n);
      }
      geo.computeVertexNormals();

      const m = new THREE.Mesh(geo, leafMat);
      m.position.set(x, y, z);
      scene.add(m);
    });

    await exportGLTF(scene, 'bush_meadow.glb');
  }

  // 4. FLOWER DAISY
  {
    const scene = new THREE.Scene();
    scene.name = 'flower_daisy';

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.7 });
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.4 });
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.45, 8), stemMat);
    stem.position.y = 0.225;
    scene.add(stem);

    const center = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12), centerMat);
    center.position.y = 0.45;
    scene.add(center);

    const petalCount = 8;
    const petalGeo = new THREE.BoxGeometry(0.04, 0.008, 0.14);
    petalGeo.translate(0, 0, 0.07);

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(0, 0.45, 0);
      petal.rotation.y = (i / petalCount) * Math.PI * 2;
      petal.rotation.x = -0.08;
      scene.add(petal);
    }

    await exportGLTF(scene, 'flower_daisy.glb');
  }

  // 5. FLOWER BUTTERCUP
  {
    const scene = new THREE.Scene();
    scene.name = 'flower_buttercup';

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x33691e, roughness: 0.7 });
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xffd600, roughness: 0.35 });

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.4, 8), stemMat);
    stem.position.y = 0.2;
    scene.add(stem);

    const petalCount = 5;
    const petalGeo = new THREE.BoxGeometry(0.06, 0.012, 0.12);
    petalGeo.translate(0, 0, 0.06);

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(0, 0.4, 0);
      petal.rotation.y = (i / petalCount) * Math.PI * 2;
      petal.rotation.x = 0.15;
      scene.add(petal);
    }

    await exportGLTF(scene, 'flower_buttercup.glb');
  }

  console.log('✨ All 3D environment GLTF assets generated successfully!');
}

(async () => {
  try {
    await generateAssets();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
