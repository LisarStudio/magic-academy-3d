import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class GekkoNPC {
  public mesh: THREE.Group;
  public mixer!: THREE.AnimationMixer;
  
  private waveAction!: THREE.AnimationAction;
  private talkAction!: THREE.AnimationAction;
  private isTalking = false;

  constructor(position: THREE.Vector3, rotationY: number = 0) {
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);
    this.mesh.rotation.y = rotationY;
  }

  public async loadModels(): Promise<void> {
    const loader = new GLTFLoader();

    try {
      // Load Base mesh with wave animation
      const waveGltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/gekko_wave.glb');
      const model = waveGltf.scene;
      
      // Setup shadows and fix transparency
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          const material = (child as THREE.Mesh).material;
          if (material) {
            const fixMaterial = (mat: any) => {
              mat.transparent = false;
              mat.depthWrite = true;
              mat.alphaTest = 0.5;
              mat.needsUpdate = true;
            };
            if (Array.isArray(material)) {
              material.forEach(fixMaterial);
            } else {
              fixMaterial(material);
            }
          }
        }
      });
      
      // Scale down Gekko to fit the player's size
      model.scale.set(0.25, 0.25, 0.25);
      this.mesh.add(model);

      // Solid physical cylinder collider so raycasts and physical checks block player
      const physicalCollider = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 2.4, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      physicalCollider.name = 'gekko_physical_solid_collider';
      physicalCollider.position.y = 1.2;
      this.mesh.add(physicalCollider);

      // Floating NPC speech / quest indicator
      const indicatorMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 1.5 });
      const indicator = new THREE.Mesh(new THREE.OctahedronGeometry(0.25, 0), indicatorMat);
      indicator.position.y = 2.4;
      indicator.name = 'gekko_quest_indicator';
      this.mesh.add(indicator);

      this.mixer = new THREE.AnimationMixer(model);

      // Extract wave animation
      if (waveGltf.animations && waveGltf.animations.length > 0) {
        this.waveAction = this.mixer.clipAction(waveGltf.animations[0]);
        this.waveAction.play();
      }

      // Load talks animation
      const talksGltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/gekko_talks.glb');
      if (talksGltf.animations && talksGltf.animations.length > 0) {
        this.talkAction = this.mixer.clipAction(talksGltf.animations[0]);
      }
    } catch (error) {
      console.warn('Failed to load Gekko models (gekko_wave.glb / gekko_talks.glb). Please ensure files exist in public/assets/characters/.', error);
      
      // Fallback mesh if missing
      const fallbackGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.0);
      const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
      fallbackMesh.position.y = 1.0;
      this.mesh.add(fallbackMesh);
    }
  }

  public setTalking(talking: boolean): void {
    if (this.isTalking === talking) return;
    this.isTalking = talking;

    if (this.mixer) {
      if (talking && this.talkAction) {
        if (this.waveAction) this.waveAction.crossFadeTo(this.talkAction, 0.5, true);
        this.talkAction.reset().play();
        
        // The talks animation natively rotates the character sideways.
        // We counter-rotate the internal model so he keeps facing the player.
        // We use -Math.PI / 2 because in the screenshot he was facing right instead of forward.
        const model = this.mesh.children[0];
        if (model) model.rotation.y = -Math.PI / 2;

      } else if (!talking && this.waveAction) {
        if (this.talkAction) this.talkAction.crossFadeTo(this.waveAction, 0.5, true);
        this.waveAction.reset().play();
        
        const model = this.mesh.children[0];
        if (model) model.rotation.y = 0;
      }
    }
  }

  public update(delta: number): void {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}
