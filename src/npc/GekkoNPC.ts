import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class GekkoNPC {
  /** Shared scale/collider dimensions keep the visual model and gameplay blocker aligned. */
  public static readonly MODEL_SCALE = 0.31;
  public static readonly COLLIDER_RADIUS = 0.62;
  public static readonly COLLIDER_HEIGHT = 2.2;
  public static readonly HEAD_TRACKING_RADIUS = 7;
  public static readonly HEAD_YAW_LIMIT = THREE.MathUtils.degToRad(45);
  public static readonly HEAD_PITCH_UP_LIMIT = THREE.MathUtils.degToRad(25);
  public static readonly HEAD_PITCH_DOWN_LIMIT = THREE.MathUtils.degToRad(20);

  public mesh: THREE.Group;
  public mixer!: THREE.AnimationMixer;
  
  private waveAction!: THREE.AnimationAction;
  private talkAction!: THREE.AnimationAction;
  private isTalking = false;
  private headBone: THREE.Bone | null = null;
  private headYaw = 0;
  private headPitch = 0;
  private targetHeadYaw = 0;
  private targetHeadPitch = 0;
  private readonly headOffset = new THREE.Quaternion();
  private readonly headLocalTarget = new THREE.Vector3();
  private readonly headPosition = new THREE.Vector3();
  private readonly headLocalPosition = new THREE.Vector3();

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
      
      // Gekko should read slightly larger than Wukong while keeping the GLB's proportions.
      model.scale.setScalar(GekkoNPC.MODEL_SCALE);
      this.mesh.add(model);
      this.mesh.updateMatrixWorld(true);
      const modelBounds = new THREE.Box3().setFromObject(model);
      if (Number.isFinite(modelBounds.min.y)) {
        // GLB source pivot is not at the soles. Align its actual lowest point
        // with the NPC root so terrain placement does not leave Gekko hovering.
        model.position.y += this.mesh.position.y - modelBounds.min.y;
        this.mesh.updateMatrixWorld(true);
      }

      // Solid physical cylinder collider so raycasts and physical checks block player
      const physicalCollider = new THREE.Mesh(
        new THREE.CylinderGeometry(GekkoNPC.COLLIDER_RADIUS, GekkoNPC.COLLIDER_RADIUS, GekkoNPC.COLLIDER_HEIGHT, 12),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      physicalCollider.name = 'gekko_physical_solid_collider';
      physicalCollider.position.y = GekkoNPC.COLLIDER_HEIGHT / 2;
      this.mesh.add(physicalCollider);

      // The shipped Gekko GLB has a Mixamo head and neck pivot. Animate only the head;
      // AnimationMixer continues to own the base pose and receives a small additive offset.
      model.traverse((child) => {
        if ((child as THREE.Bone).isBone && /(?:mixamorig:)?head$/i.test(child.name)) {
          this.headBone = child as THREE.Bone;
        }
      });

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

  /** Pass a world-space target only while the player is nearby and no important animation is running. */
  public update(delta: number, lookTarget: THREE.Vector3 | null = null): void {
    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.targetHeadYaw = 0;
    this.targetHeadPitch = 0;
    if (this.headBone && lookTarget && !this.isTalking) {
      this.mesh.updateMatrixWorld(true);
      this.headBone.getWorldPosition(this.headPosition);
      this.headLocalTarget.copy(lookTarget);
      this.mesh.worldToLocal(this.headLocalTarget);
      this.headLocalPosition.copy(this.headPosition);
      this.mesh.worldToLocal(this.headLocalPosition);
      this.headLocalTarget.sub(this.headLocalPosition);

      const horizontalDistance = Math.hypot(this.headLocalTarget.x, this.headLocalTarget.z);
      const distance = Math.hypot(horizontalDistance, this.headLocalTarget.y);
      if (distance <= GekkoNPC.HEAD_TRACKING_RADIUS && distance > 0.001) {
        // Gekko's authored forward axis is +Z; clamp relative to the NPC's facing direction.
        this.targetHeadYaw = THREE.MathUtils.clamp(
          Math.atan2(this.headLocalTarget.x, this.headLocalTarget.z),
          -GekkoNPC.HEAD_YAW_LIMIT,
          GekkoNPC.HEAD_YAW_LIMIT
        );
        this.targetHeadPitch = THREE.MathUtils.clamp(
          Math.atan2(this.headLocalTarget.y, Math.max(horizontalDistance, 0.001)),
          -GekkoNPC.HEAD_PITCH_DOWN_LIMIT,
          GekkoNPC.HEAD_PITCH_UP_LIMIT
        );
      }
    }

    if (this.headBone) {
      const targetBlend = 1 - Math.exp(-Math.max(0, delta) / 0.24);
      this.headYaw = THREE.MathUtils.lerp(this.headYaw, this.targetHeadYaw, targetBlend);
      this.headPitch = THREE.MathUtils.lerp(this.headPitch, this.targetHeadPitch, targetBlend);
      // Apply after mixer update so each frame starts from the authored animation pose.
      this.headOffset.setFromEuler(new THREE.Euler(this.headPitch, this.headYaw, 0, 'YXZ'));
      this.headBone.quaternion.multiply(this.headOffset);
    }
  }
}
