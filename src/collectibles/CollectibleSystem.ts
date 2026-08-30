import * as THREE from 'three';
import { AudioManager } from '../core/AudioManager';

export type CollectibleType = 'CARD' | 'COIN' | 'CHOCOLATE_FROG' | 'POTION_HP' | 'POTION_MP';

export class Collectible {
  public mesh: THREE.Group;
  public isCollected = false;
  public id: string;
  public type: CollectibleType;

  private floatMesh: THREE.Object3D;
  private spawnTime: number;
  private scaleFactor = 1.0;

  constructor(id: string, position: THREE.Vector3, type: CollectibleType = 'COIN', customMesh?: THREE.Object3D) {
    this.id = id;
    this.type = type;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);
    this.spawnTime = Date.now();

    if (type === 'CARD') {
      const cardGeo = new THREE.BoxGeometry(0.35, 0.55, 0.02);
      const cardMat = new THREE.MeshStandardMaterial({
        color: 0xf3c644,
        emissive: 0x996e00,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });
      this.floatMesh = new THREE.Mesh(cardGeo, cardMat);
    } else if (type === 'COIN') {
      if (customMesh) {
        this.floatMesh = customMesh.clone();
        
        // Calculate the bounding box in local/world coordinates
        const bbox = new THREE.Box3().setFromObject(this.floatMesh);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const largestDim = Math.max(size.x, size.y, size.z);

        // Scale to a slightly larger, more visible size (0.30 meters in largest dimension)
        const targetSize = 0.30;
        this.scaleFactor = largestDim > 0.001 ? (targetSize / largestDim) : 0.25;
        this.floatMesh.scale.setScalar(this.scaleFactor);

        // Pivot Correction: Shift children by -center to ensure the pivot is exactly at the geometric center.
        // This ensures it spins on its axis and floats nicely.
        for (const child of this.floatMesh.children) {
          child.position.sub(center);
        }
      } else {
        // LISAR Coin procedural mesh fallback
        const coinGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.03, 16);
        const coinMat = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          emissive: 0xaa8800,
          emissiveIntensity: 0.6,
          metalness: 0.9,
          roughness: 0.1
        });
        const mesh = new THREE.Mesh(coinGeo, coinMat);
        mesh.rotation.x = Math.PI / 2; // Stand upright
        this.floatMesh = mesh;
        this.scaleFactor = 1.0;
      }
    } else if (type === 'CHOCOLATE_FROG') {
      const frogGeo = new THREE.DodecahedronGeometry(0.18);
      const frogMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.5 });
      this.floatMesh = new THREE.Mesh(frogGeo, frogMat);
    } else {
      const isHp = type === 'POTION_HP';
      const pColor = isHp ? 0xff2244 : 0x00aaff;

      const pGroup = new THREE.Group();
      const bottleGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.4, 8);
      const bottleMat = new THREE.MeshStandardMaterial({
        color: pColor,
        emissive: pColor,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85
      });
      const bottle = new THREE.Mesh(bottleGeo, bottleMat);
      bottle.position.y = 0.2;

      const corkGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 8);
      const corkMat = new THREE.MeshStandardMaterial({ color: 0x774422 });
      const cork = new THREE.Mesh(corkGeo, corkMat);
      cork.position.y = 0.45;

      pGroup.add(bottle, cork);
      this.floatMesh = pGroup as unknown as THREE.Mesh;
    }

    this.floatMesh.castShadow = true;
    this.mesh.add(this.floatMesh);
  }

  public update(delta: number): void {
    if (this.isCollected) return;

    if (this.type === 'CHOCOLATE_FROG') {
      // Hop animation for frog
      this.floatMesh.position.y = Math.abs(Math.sin(Date.now() * 0.006)) * 0.25;
    } else if (this.type === 'COIN') {
      // Coin spinning and bouncing animation (rhythm of music on spawn)
      const timeSinceSpawn = Date.now() - this.spawnTime;
      let yOffset = Math.sin(Date.now() * 0.005) * 0.05;
      let scale = 1.0;
      
      // Spawn bounce effect
      if (timeSinceSpawn < 1000) {
        const progress = timeSinceSpawn / 1000;
        // Bounce formula: use Math.abs to keep it strictly above the floor
        yOffset += Math.abs(Math.sin(progress * Math.PI * 3.0)) * (1.0 - progress) * 1.2;
        scale = Math.min(1.0, progress * 2.0);
      }
      
      this.floatMesh.scale.setScalar(scale * this.scaleFactor);
      this.floatMesh.rotation.y += delta * 3.0;
      this.floatMesh.position.y = yOffset + 0.1; // Offset Y up so it floats cleanly above the floor
    } else {
      // Floating animation
      this.floatMesh.rotation.y += delta * 2.0;
      this.floatMesh.position.y = Math.sin(Date.now() * 0.003) * 0.12;
    }
  }
}

export class CollectibleSystem {
  public collectibles: Collectible[] = [];
  public collectedCount = 0;
  public coinCount = 0;
  public totalCards = 3;
  private audioManager: AudioManager;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, audioManager: AudioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
  }

  public spawnCard(id: string, position: THREE.Vector3): void {
    const card = new Collectible(id, position, 'CARD');
    this.collectibles.push(card);
    this.scene.add(card.mesh);
  }

  public coinTemplate: THREE.Object3D | null = null;

  public spawnCoin(id: string, position: THREE.Vector3): void {
    const coin = new Collectible(id, position, 'COIN', this.coinTemplate || undefined);
    this.collectibles.push(coin);
    this.scene.add(coin.mesh);
  }

  public spawnFrog(id: string, position: THREE.Vector3): void {
    const frog = new Collectible(id, position, 'CHOCOLATE_FROG');
    this.collectibles.push(frog);
    this.scene.add(frog.mesh);
  }

  public spawnPotion(id: string, position: THREE.Vector3, type: 'POTION_HP' | 'POTION_MP'): void {
    const potion = new Collectible(id, position, type);
    this.collectibles.push(potion);
    this.scene.add(potion.mesh);
  }

  public update(
    playerPos: THREE.Vector3,
    delta: number,
    onCollectCard: (count: number) => void,
    onCollectCoin?: (totalCoins: number) => void,
    onCollectPotion?: (type: 'POTION_HP' | 'POTION_MP' | 'CHOCOLATE_FROG') => void
  ): void {
    for (const item of this.collectibles) {
      if (item.isCollected) continue;

      item.update(delta);

      // Check distance to player
      if (item.mesh.position.distanceTo(playerPos) < 1.2) {
        item.isCollected = true;
        this.scene.remove(item.mesh);

        if (item.type === 'CARD') {
          this.collectedCount++;
          this.audioManager.playCardPickup();
          onCollectCard(this.collectedCount);
        } else if (item.type === 'COIN') {
          this.coinCount++;
          this.audioManager.playBeanPickup(); // We can reuse the sound
          this.spawnSparks(item.mesh.position);
          onCollectCoin?.(this.coinCount);
        } else if (item.type === 'CHOCOLATE_FROG') {
          this.audioManager.playFrogPickup();
          onCollectPotion?.('CHOCOLATE_FROG');
        } else if (item.type === 'POTION_HP' || item.type === 'POTION_MP') {
          this.audioManager.playPotionPickup();
          onCollectPotion?.(item.type);
        }
      }
    }
  }

  private spawnSparks(pos: THREE.Vector3): void {
    const particleCount = 20;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    const baseColor = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y + 0.5;
      positions[i * 3 + 2] = pos.z;

      // Random color variation for each spark
      const c = baseColor.clone().offsetHSL(Math.random() * 0.2 - 0.1, 0, Math.random() * 0.2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      velocities.push(
        (Math.random() - 0.5) * 4,
        Math.random() * 4 + 2,
        (Math.random() - 0.5) * 4
      );
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geom, mat);
    this.scene.add(points);

    let age = 0;
    const animate = () => {
      age += 0.016;
      if (age > 0.6) {
        this.scene.remove(points);
        geom.dispose();
        mat.dispose();
        return;
      }
      const p = geom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        p[i * 3] += velocities[i * 3] * 0.016;
        p[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
        p[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;
        velocities[i * 3 + 1] -= 9.8 * 0.016; // gravity
      }
      geom.attributes.position.needsUpdate = true;
      mat.opacity = 1 - (age / 0.6);
      requestAnimationFrame(animate);
    };
    animate();
  }
}
