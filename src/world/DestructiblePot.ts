import * as THREE from 'three';
import { AudioManager } from '../core/AudioManager';
import { CollectibleSystem } from '../collectibles/CollectibleSystem';

export class DestructiblePot {
  public mesh: THREE.Group;
  public isBroken = false;
  public position: THREE.Vector3;
  public onDestruct?: () => void;

  private bodyMesh: THREE.Mesh;
  private scene: THREE.Scene;

  constructor(position: THREE.Vector3, scene: THREE.Scene) {
    this.position = position.clone();
    this.scene = scene;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    // Clay pot geometry (HP1 PC style ceramic urn)
    const potGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 12);
    const potMat = new THREE.MeshStandardMaterial({
      color: 0xa0522d, // Terracotta brown
      roughness: 0.8,
      metalness: 0.1
    });

    this.bodyMesh = new THREE.Mesh(potGeo, potMat);
    this.bodyMesh.position.y = 0.45;
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.mesh.add(this.bodyMesh);

    // Decorative rim
    const rimGeo = new THREE.TorusGeometry(0.36, 0.04, 8, 16);
    const rim = new THREE.Mesh(rimGeo, potMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.9;
    this.mesh.add(rim);

    scene.add(this.mesh);
  }

  public shatter(audioManager: AudioManager, collectibleSystem: CollectibleSystem): void {
    if (this.isBroken) return;
    this.isBroken = true;

    if (this.onDestruct) {
      this.onDestruct();
    }

    // Play shatter sound
    audioManager.playPotShatter();

    // Spawn broken ceramic debris pieces
    const shardCount = 8;
    const shardGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const shardMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.9 });
    const shardGroup = new THREE.Group();
    shardGroup.position.copy(this.mesh.position);

    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set(
        (Math.random() - 0.5) * 0.4,
        0.2 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.4
      );
      shardGroup.add(shard);
    }
    this.scene.add(shardGroup);

    // Remove main intact pot
    this.scene.remove(this.mesh);

    // Animate shards falling
    let age = 0;
    const animateShards = () => {
      age += 0.016;
      shardGroup.children.forEach(s => {
        s.position.y -= 2.0 * 0.016; // gravity
        s.rotation.x += 0.1;
        s.rotation.y += 0.1;
      });

      if (age < 0.6) {
        requestAnimationFrame(animateShards);
      } else {
        this.scene.remove(shardGroup);
      }
    };
    animateShards();

    // Spawn 2-3 Bertie Bott Beans or a Chocolate Frog
    const rand = Math.random();
    if (rand < 0.3) {
      collectibleSystem.spawnFrog('frog_' + Date.now(), new THREE.Vector3(this.position.x, 0.2, this.position.z));
    } else {
      if (Math.random() > 0.5) {
        collectibleSystem.spawnCoin(
          `pot_coin_${Date.now()}`,
          this.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0))
        );
      }
    }
  }
}
