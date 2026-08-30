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

  public setCustomMesh(customMesh: THREE.Object3D): void {
    if (this.floatMesh && this.floatMesh.parent) {
      this.mesh.remove(this.floatMesh);
    }
    this.floatMesh = customMesh.clone();
    
    // Calculate the bounding box
    const bbox = new THREE.Box3().setFromObject(this.floatMesh);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const largestDim = Math.max(size.x, size.y, size.z);

    // Scale to high-visibility size (0.55 meters)
    const targetSize = 0.55;
    this.scaleFactor = largestDim > 0.001 ? (targetSize / largestDim) : 0.4;
    this.floatMesh.scale.setScalar(this.scaleFactor);

    // Center pivot
    for (const child of this.floatMesh.children) {
      child.position.sub(center);
    }
    this.mesh.add(this.floatMesh);
  }

  public update(delta: number): void {
    if (this.isCollected) return;

    if (this.type === 'CHOCOLATE_FROG') {
      // Hop animation for frog
      this.floatMesh.position.y = Math.abs(Math.sin(Date.now() * 0.006)) * 0.25;
    } else if (this.type === 'COIN') {
      // Coin spinning and bouncing animation
      const timeSinceSpawn = Date.now() - this.spawnTime;
      let yOffset = Math.sin(Date.now() * 0.005) * 0.08;
      let scale = 1.0;
      
      if (timeSinceSpawn < 1000) {
        const progress = timeSinceSpawn / 1000;
        yOffset += Math.abs(Math.sin(progress * Math.PI * 3.0)) * (1.0 - progress) * 0.8;
        scale = Math.min(1.0, progress * 2.0);
      }
      
      this.floatMesh.scale.setScalar(scale * this.scaleFactor);
      this.floatMesh.rotation.y += delta * 3.0;
      this.floatMesh.position.y = yOffset + 0.15; // Offset Y up so it floats cleanly
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

  // High performance pre-allocated Particle Pool for item pickups (0 runtime allocations, 0 GC pauses)
  private static readonly MAX_SPARKS = 240;
  private sparkGeom: THREE.BufferGeometry;
  private sparkPositions = new Float32Array(CollectibleSystem.MAX_SPARKS * 3);
  private sparkColors = new Float32Array(CollectibleSystem.MAX_SPARKS * 3);
  private sparkVelocities = new Float32Array(CollectibleSystem.MAX_SPARKS * 3);
  private sparkAges = new Float32Array(CollectibleSystem.MAX_SPARKS);
  private sparkMaxAges = new Float32Array(CollectibleSystem.MAX_SPARKS);
  private sparkPointsMesh: THREE.Points;
  private nextSparkIdx = 0;

  constructor(scene: THREE.Scene, audioManager: AudioManager) {
    this.scene = scene;
    this.audioManager = audioManager;

    // Initialize all particles hidden underground
    for (let i = 0; i < CollectibleSystem.MAX_SPARKS; i++) {
      this.sparkPositions[i * 3 + 1] = -999;
      this.sparkAges[i] = 999;
      this.sparkMaxAges[i] = 1;
    }

    this.sparkGeom = new THREE.BufferGeometry();
    this.sparkGeom.setAttribute('position', new THREE.BufferAttribute(this.sparkPositions, 3));
    this.sparkGeom.setAttribute('color', new THREE.BufferAttribute(this.sparkColors, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.20,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sparkPointsMesh = new THREE.Points(this.sparkGeom, sparkMat);
    this.sparkPointsMesh.frustumCulled = false;
    this.scene.add(this.sparkPointsMesh);
  }

  public clearAll(): void {
    for (const item of this.collectibles) {
      if (item.mesh.parent) {
        item.mesh.parent.remove(item.mesh);
      }
    }
    this.collectibles = [];
  }

  public spawnCard(id: string, position: THREE.Vector3): void {
    if (this.collectibles.some(c => c.id === id)) return;
    const card = new Collectible(id, position, 'CARD');
    this.collectibles.push(card);
    this.scene.add(card.mesh);
  }

  public coinTemplate: THREE.Object3D | null = null;

  public setCoinTemplate(template: THREE.Object3D): void {
    this.coinTemplate = template;
    // Retroactively update all already spawned coins
    for (const item of this.collectibles) {
      if (item.type === 'COIN' && !item.isCollected) {
        item.setCustomMesh(template);
      }
    }
    console.log(`[CollectibleSystem] ✅ Retroactively updated ${this.collectibles.filter(c => c.type === 'COIN').length} coins with authentic 3D GLB model!`);
  }

  public spawnCoin(id: string, position: THREE.Vector3): void {
    if (this.collectibles.some(c => c.id === id)) return;
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
    onCollectPotion?: (type: 'POTION_HP' | 'POTION_MP' | 'CHOCOLATE_FROG') => void,
    inputKeys?: Record<string, boolean>
  ): void {
    // 1. Update Spark Particle Pool in-place (Zero Allocation)
    let activeSparks = false;
    const pArr = this.sparkPositions;
    for (let i = 0; i < CollectibleSystem.MAX_SPARKS; i++) {
      if (this.sparkAges[i] < this.sparkMaxAges[i]) {
        activeSparks = true;
        this.sparkAges[i] += delta;
        pArr[i * 3] += this.sparkVelocities[i * 3] * delta;
        pArr[i * 3 + 1] += this.sparkVelocities[i * 3 + 1] * delta;
        pArr[i * 3 + 2] += this.sparkVelocities[i * 3 + 2] * delta;
        this.sparkVelocities[i * 3 + 1] -= 9.8 * delta; // Gravity
      } else if (pArr[i * 3 + 1] !== -999) {
        pArr[i * 3 + 1] = -999;
        activeSparks = true;
      }
    }
    if (activeSparks) {
      this.sparkGeom.attributes.position.needsUpdate = true;
    }

    // 2. Proximity & Collection check
    let nearestItem: Collectible | null = null;
    let minDistance = Infinity;

    for (const item of this.collectibles) {
      if (item.isCollected) continue;

      item.update(delta);

      const dist = item.mesh.position.distanceTo(playerPos);
      if (dist < 2.2 && dist < minDistance) {
        minDistance = dist;
        nearestItem = item;
      }
    }

    const hud = (window as any).gameInstance?.hud;

    if (nearestItem) {
      let itemLabel = 'Item';
      if (nearestItem.type === 'COIN') itemLabel = 'Lisar Coin';
      else if (nearestItem.type === 'CARD') itemLabel = 'Carta Mágica';
      else if (nearestItem.type === 'CHOCOLATE_FROG') itemLabel = 'Rana de Chocolate';
      else if (nearestItem.type === 'POTION_HP') itemLabel = 'Poción de Salud';
      else if (nearestItem.type === 'POTION_MP') itemLabel = 'Poción de Maná';

      hud?.showInteractionPrompt(`Recoger ${itemLabel}`);

      // Collect instantly on contact/walkover (minDistance < 1.6) OR pressing E key
      const ePressed = inputKeys ? !!inputKeys['KeyE'] : false;
      const isTouch = hud?.isTouchDevice?.() || false;
      const isWalkover = minDistance < 1.6;

      if (isWalkover || ePressed || isTouch) {
        nearestItem.isCollected = true;
        this.scene.remove(nearestItem.mesh);
        hud?.hideInteractionPrompt();

        if (nearestItem.type === 'CARD') {
          this.collectedCount++;
          this.audioManager.playCardPickup();
          this.spawnSparks(nearestItem.mesh.position);
          onCollectCard(this.collectedCount);
        } else if (nearestItem.type === 'COIN') {
          this.coinCount++;
          this.audioManager.playBeanPickup();
          this.spawnSparks(nearestItem.mesh.position);
          onCollectCoin?.(this.coinCount);
        } else if (nearestItem.type === 'CHOCOLATE_FROG') {
          this.audioManager.playFrogPickup();
          this.spawnSparks(nearestItem.mesh.position);
          onCollectPotion?.('CHOCOLATE_FROG');
        } else if (nearestItem.type === 'POTION_HP' || nearestItem.type === 'POTION_MP') {
          this.audioManager.playPotionPickup();
          this.spawnSparks(nearestItem.mesh.position);
          onCollectPotion?.(nearestItem.type);
        }
      }
    } else {
      // If we walked away from collectible items, hide prompt
    }
  }

  public spawnSparks(pos: THREE.Vector3): void {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const idx = (this.nextSparkIdx + i) % CollectibleSystem.MAX_SPARKS;
      this.sparkPositions[idx * 3] = pos.x + (Math.random() - 0.5) * 0.15;
      this.sparkPositions[idx * 3 + 1] = pos.y + 0.35 + (Math.random() - 0.5) * 0.15;
      this.sparkPositions[idx * 3 + 2] = pos.z + (Math.random() - 0.5) * 0.15;

      this.sparkVelocities[idx * 3] = (Math.random() - 0.5) * 3.5;
      this.sparkVelocities[idx * 3 + 1] = Math.random() * 3.5 + 2.0;
      this.sparkVelocities[idx * 3 + 2] = (Math.random() - 0.5) * 3.5;

      // Golden & amber sparkling hues
      this.sparkColors[idx * 3] = 1.0;
      this.sparkColors[idx * 3 + 1] = 0.75 + Math.random() * 0.25;
      this.sparkColors[idx * 3 + 2] = 0.15;

      this.sparkAges[idx] = 0;
      this.sparkMaxAges[idx] = 0.45 + Math.random() * 0.2;
    }
    this.nextSparkIdx = (this.nextSparkIdx + count) % CollectibleSystem.MAX_SPARKS;
    this.sparkGeom.attributes.position.needsUpdate = true;
    this.sparkGeom.attributes.color.needsUpdate = true;
  }
}
