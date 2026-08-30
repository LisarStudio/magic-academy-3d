import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

export interface LoadedPlayerData {
  model: THREE.Object3D;
  clips: THREE.AnimationClip[];
}

export class AssetManager {
  private fbxLoader = new FBXLoader();
  private gltfLoader = new GLTFLoader();

  /**
   * Load an FBX file, extract the first animation clip, retarget it to
   * the given model, rename it, and return it.
   */
  private async loadAndRetargetClip(
    url: string,
    clipName: string,
    targetRoot: THREE.Object3D,
    translationScale: number
  ): Promise<THREE.AnimationClip | null> {
    try {
      const fbx = await this.fbxLoader.loadAsync(url);
      if (fbx.animations && fbx.animations.length > 0) {
        let rawClip = fbx.animations[0];
        if (fbx.animations.length > 1) {
          const skeletalClip = fbx.animations.find(
            c => c.name.toLowerCase().includes('mixamo') ||
                 c.name.toLowerCase().includes('layer0') ||
                 !c.name.toLowerCase().includes('camera')
          );
          if (skeletalClip) rawClip = skeletalClip;
        }

        // 1. Prepare Target Clone (to prevent mutating the real playerModel)
        const targetClone = SkeletonUtils.clone(targetRoot);
        const targetBones: THREE.Bone[] = [];
        targetClone.traverse((c: THREE.Object3D) => { if ((c as THREE.Bone).isBone) targetBones.push(c as THREE.Bone); });
        (targetClone as any).skeleton = new THREE.Skeleton(targetBones);
        targetClone.updateMatrixWorld(true);

        // 2. Prepare Source (FBX)
        const sourceBones: THREE.Bone[] = [];
        fbx.traverse((c: THREE.Object3D) => { if ((c as THREE.Bone).isBone) sourceBones.push(c as THREE.Bone); });
        (fbx as any).skeleton = new THREE.Skeleton(sourceBones);
        fbx.updateMatrixWorld(true);

        // 3. Build Bone Mapping
        const sourceBoneNames = new Map<string, string>();
        sourceBones.forEach((b: THREE.Bone) => {
          sourceBoneNames.set(b.name.toLowerCase().replace(/[:_\-\s]/g, ''), b.name);
        });

        const targetToSourceBoneName = (targetBone: THREE.Bone) => {
          const norm = targetBone.name.toLowerCase().replace(/[:_\-\s]/g, '');
          return sourceBoneNames.get(norm) || targetBone.name;
        };

        const sourceHipName = sourceBoneNames.get('mixamorighips') || 'mixamorig:Hips';

        // ─── CRITICAL: Strip ALL position tracks from the raw FBX clip BEFORE retargeting ───
        // Root cause of floating: Mixamo FBX Hips bone has a Y position track (~90cm in T-pose).
        // SkeletonUtils.retargetClip copies this into the retargeted clip, overriding PlayerController.
        // Fix: remove ALL .position tracks from the raw FBX before retargeting.
        // PlayerController owns position. AnimationMixer owns rotations only.
        const hipsBoneKey = 'mixamorig:Hips';
        rawClip.tracks = rawClip.tracks.filter(t => {
          if (t.name.endsWith('.position')) {
            console.log(`[AssetManager] Pre-strip position track from raw FBX: "${t.name}"`);
            return false;
          }
          if (t.name.endsWith('.scale')) return false;
          return true;
        });
        void hipsBoneKey; // suppress unused warning

        // 4. Retarget
        let retargeted = SkeletonUtils.retargetClip(targetClone, fbx, rawClip, {
          // @ts-ignore
          preserveBonePositions: true, 
          hip: sourceHipName,
          getBoneName: targetToSourceBoneName,
          scale: translationScale
        });

        retargeted.name = clipName;

        // 5. Post-retarget safety strip (scale tracks and any position that slipped through)
        retargeted.tracks = retargeted.tracks.filter(t => {
          if (t.name.endsWith('.scale')) return false;
          if (t.name.endsWith('.position')) {
            console.log(`[AssetManager] Post-strip position track: "${t.name}"`);
            return false;
          }
          return true;
        });

        for (const track of retargeted.tracks) {
          // SkeletonUtils generates tracks named ".bones[mixamorig:Hips].quaternion"
          // We must strip the ".bones[]" wrapper so AnimationMixer can bind them to the Group's children
          const match = track.name.match(/\.bones\[(.*?)\]\.(.*)/);
          if (match) {
            track.name = `${match[1]}.${match[2]}`;
          }
        }

        console.log(
          `[AssetManager] ✅ '${clipName}' → ${retargeted.tracks.length} rotation tracks, ${retargeted.duration.toFixed(2)}s`
        );
        return retargeted;
      }
    } catch (err) {
      console.warn(`[AssetManager] ❌ Failed to load clip from ${url}`, err);
    }
    return null;
  }

  private async loadAndRetargetGltfClip(
    url: string,
    clipName: string,
    targetRoot: THREE.Object3D
  ): Promise<{ clip: THREE.AnimationClip; externalMeshes: THREE.Object3D[] } | null> {
    try {
      const gltf = await this.gltfLoader.loadAsync(url);
      if (gltf.animations && gltf.animations.length > 0) {
        const rawClip = gltf.animations[0];

        // Strip position and scale tracks
        rawClip.tracks = rawClip.tracks.filter(t => {
          if (t.name.endsWith('.position')) return false;
          if (t.name.endsWith('.scale')) return false;
          return true;
        });

        const targetClone = SkeletonUtils.clone(targetRoot);
        const targetBones: THREE.Bone[] = [];
        targetClone.traverse((c: THREE.Object3D) => { if ((c as THREE.Bone).isBone) targetBones.push(c as THREE.Bone); });
        (targetClone as any).skeleton = new THREE.Skeleton(targetBones);
        targetClone.updateMatrixWorld(true);

        const sourceBones: THREE.Bone[] = [];
        gltf.scene.traverse((c: THREE.Object3D) => { if ((c as THREE.Bone).isBone) sourceBones.push(c as THREE.Bone); });
        (gltf.scene as any).skeleton = new THREE.Skeleton(sourceBones);
        gltf.scene.updateMatrixWorld(true);

        const sourceBoneNames = new Map<string, string>();
        sourceBones.forEach((b: THREE.Bone) => {
          sourceBoneNames.set(b.name.toLowerCase().replace(/[:_\-\s]/g, ''), b.name);
        });

        const targetToSourceBoneName = (targetBone: THREE.Bone) => {
          const norm = targetBone.name.toLowerCase().replace(/[:_\-\s]/g, '');
          return sourceBoneNames.get(norm) || targetBone.name;
        };

        const sourceHipName = sourceBoneNames.get('mixamorighips') || 'mixamorig:Hips';

        let retargeted = SkeletonUtils.retargetClip(targetClone, gltf.scene, rawClip, {
          // @ts-ignore
          preserveBonePositions: true,
          hip: sourceHipName,
          getBoneName: targetToSourceBoneName,
          scale: 1.0
        });

        retargeted.name = clipName;

        retargeted.tracks = retargeted.tracks.filter(t => {
          if (t.name.endsWith('.scale')) return false;
          if (t.name.endsWith('.position')) return false;
          return true;
        });

        for (const track of retargeted.tracks) {
          const match = track.name.match(/\.bones\[(.*?)\]\.(.*)/);
          if (match) {
            track.name = `${match[1]}.${match[2]}`;
          }
        }

        console.log(
          `[AssetManager] ✅ GLB '${clipName}' → ${retargeted.tracks.length} rotation tracks, ${retargeted.duration.toFixed(2)}s`
        );
        
        // Extract the Cylinder staff from the GLB
        const externalMeshes: THREE.Object3D[] = [];
        const cylinder = gltf.scene.getObjectByName('Cylinder');
        if (cylinder) {
          console.log(`[AssetManager] Extracted external mesh 'Cylinder' from GLB`);
          externalMeshes.push(cylinder);
        }

        return { clip: retargeted, externalMeshes };
      }
    } catch (err) {
      console.warn(`[AssetManager] ❌ Failed to load GLB clip from ${url}`, err);
    }
    return null;
  }

  public async loadPlayerModel(): Promise<LoadedPlayerData> {
    try {
      // ── 1. Load base character mesh (unarmed pose) ──
      console.log('[AssetManager] Loading base character model...');
      let playerModel: THREE.Group | null = null;
      let hasEmbeddedStaff = false;
      let translationScaleFactor = 1.0; // Default factor (no scaling for fallback FBX)

      // Try loading player.glb first (custom character Lisar)
      try {
        console.log('[AssetManager] Loading player.glb via GLTFLoader...');
        const gltf = await this.gltfLoader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/player.glb?v=7');
        playerModel = gltf.scene;
        console.log('[AssetManager] ✅ Loaded player.glb successfully');

        // Look for embedded staff mesh "Vaculo" and hide it initially
        playerModel.traverse((child) => {
          if (child.name.toLowerCase().includes('vaculo')) {
            child.visible = false;
            hasEmbeddedStaff = true;
            console.log('[AssetManager] Found and hidden embedded staff (Vaculo) in player.glb');
          }
        });

        // Pivot Correction: mixamorig:Hips has a massive -4.86m Z offset in player.glb's bind pose.
        // We reset Z to 0 so the character centers perfectly on the physics capsule.
        const hips = playerModel.getObjectByName('mixamorig:Hips');
        if (hips) {
          hips.position.z = 0;
          console.log('[AssetManager] Corrected mixamorig:Hips initial Z position to 0');
        }

        // Detect Armature scale to compensate for it in the animation retargeting translation scale
        const armature = playerModel.getObjectByName('Armature');
        let armScale = 1.0;
        if (armature) {
          armScale = armature.scale.x;
        }
        
        // Convert FBX centimeters to GLTF meters (0.01) AND divide by the armature scale.
        // If armature scale is S, translation must be (FBX_val * 0.01) / S
        translationScaleFactor = 0.01 / armScale;
        console.log(`[AssetManager] GLTF detected. Armature scale = ${armScale.toFixed(4)}. Base scale factor = ${translationScaleFactor.toFixed(5)}`);
      } catch (err) {
        console.warn('[AssetManager] player.glb failed to load, falling back to FBX', err);
      }

      // Fallback to FBX if GLTF failed
      if (!playerModel) {
        try {
          playerModel = await this.fbxLoader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/Idle_nowood.fbx?v=7');
        } catch {
          console.warn('[AssetManager] Idle_nowood.fbx failed, trying Wukong_NoWood.fbx');
          playerModel = await this.fbxLoader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/Wukong_NoWood.fbx');
        }
      }

      // Print skeleton bone names for debugging
      const boneNames: string[] = [];
      playerModel.traverse((child) => {
        if ((child as any).isBone) boneNames.push(child.name);
      });
      console.log('[AssetManager] Skeleton bones found:', boneNames.slice(0, 15).join(', '), boneNames.length > 15 ? `... (${boneNames.length} total)` : '');

      // ── 2. Auto-scale to ~1.7m AND pin feet to Y=0 ──
      const bbox = new THREE.Box3().setFromObject(playerModel);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      if (size.y > 0) {
        const scaleFactor = 1.7 / size.y;
        playerModel.scale.setScalar(scaleFactor);
        console.log(`[AssetManager] Auto-scaled by ${scaleFactor.toFixed(3)} (${size.y.toFixed(2)}m → 1.7m)`);
      }

      // Pin feet to Y=0: recalculate bbox after scaling, then offset the model
      // so bbox.min.y = 0 (feet touch the ground, same as NPC).
      // NOTE: This is still needed for the initial T-pose visual alignment.
      // The AnimationMixer no longer drives Hips position, so this offset is stable.
      {
        const bboxAfterScale = new THREE.Box3().setFromObject(playerModel);
        const feetOffset = bboxAfterScale.min.y;
        if (Math.abs(feetOffset) > 0.001) {
          playerModel.position.y -= feetOffset;
          console.log(`[AssetManager] Pinned feet to Y=0 in T-pose (shifted by ${(-feetOffset).toFixed(4)}m)`);
        }
      }

      // ── 2b. Enable shadows and optimize materials for premium visual look (anisotropy, matte skin, PBR roughness) ──
      playerModel.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          const mesh = child as THREE.Mesh;
          const material = mesh.material;
          if (material) {
            const processMat = (mat: any) => {
              mat.shadowSide = THREE.DoubleSide;
              
              // Disable transparency on opaque meshes to fix sorting glitches
              if (mat.transparent && mat.opacity >= 0.99) {
                mat.transparent = false;
                mat.depthWrite = true;
              }
              
              // Sharp textures with high-grade anisotropic filtering
              if (mat.map) {
                mat.map.anisotropy = 16;
                mat.map.minFilter = THREE.LinearMipmapLinearFilter;
                mat.map.magFilter = THREE.LinearFilter;
                mat.map.needsUpdate = true;
              }
              
              // PBR material optimizations for professional finish
              const name = child.name.toLowerCase();
              if (name.includes('cabeza') || name.includes('skin') || name.includes('face') || name.includes('pierna') || name.includes('brazo')) {
                mat.roughness = 0.85; // Skin: matte
                mat.metalness = 0.0;
              } else if (name.includes('hair') || name.includes('cabello') || name.includes('ceja')) {
                mat.roughness = 0.75;
                mat.metalness = 0.1;
              } else if (name.includes('vaculo') || name.includes('baculo') || name.includes('metal') || name.includes('oro') || name.includes('gold')) {
                mat.roughness = 0.2; // Shiny gold
                mat.metalness = 0.85;
                if (name.includes('vaculo')) {
                  mat.emissive = new THREE.Color(0x3a2e00);
                  mat.emissiveIntensity = 0.2;
                }
              } else {
                mat.roughness = 0.65; // Clothes
                mat.metalness = 0.05;
              }
              mat.needsUpdate = true;
            };

            if (Array.isArray(material)) {
              material.forEach(processMat);
            } else {
              processMat(material);
            }
          }
        }
      });

      // ── 3. Attach baculo.glb staff to Right Hand bone ONLY if we don't have an embedded staff ──
      if (!hasEmbeddedStaff) {
        try {
          const staffGltf = await this.gltfLoader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/baculo.glb?v=7');
          const staffScene = staffGltf.scene;
          staffScene.name = 'magic_wand';
          staffScene.visible = false; // Hidden until picked up

          // Find right hand bone (Mixamo naming)
          let rightHand: THREE.Object3D | null = null;
          playerModel.traverse((child) => {
            const n = child.name.toLowerCase();
            if (n.includes('righthand') && !n.includes('thumb') && !n.includes('index') && !n.includes('middle') && !n.includes('ring') && !n.includes('pinky')) {
              rightHand = child;
            }
          });

          if (rightHand) {
            // Scale & position relative to hand bone
            // Assuming baculo.glb is correctly scaled or we apply a mild scale
            staffScene.scale.setScalar(1.0);
            staffScene.position.set(0, 0.05, 0); // Directly in hand
            staffScene.rotation.set(Math.PI * 0.5, 0, 0);
            (rightHand as THREE.Object3D).add(staffScene);
            console.log('[AssetManager] ✅ Attached baculo.glb to bone:', (rightHand as THREE.Object3D).name);
          } else {
            // Fallback
            staffScene.scale.setScalar(0.01);
            staffScene.position.set(0, 0, 0);
            playerModel.add(staffScene);
            console.warn('[AssetManager] ⚠️ No RightHand bone found, attached staff to root');
          }
        } catch (e) {
          console.warn('[AssetManager] Could not load baculo.glb staff', e);
        }
      }

      // ── 4. Load and retarget ALL animation clips ──
      const clips: THREE.AnimationClip[] = [];

      // Unarmed set (from FBX -> apply translationScaleFactor)
      // Crucial: we load Idle_nowood.fbx as the Idle_Unarmed clip so the character stays still in Idle.
      const idleUnarmed = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Idle_nowood.fbx?v=7', 'Idle_Unarmed', playerModel, translationScaleFactor);
      if (idleUnarmed) clips.push(idleUnarmed);

      const runUnarmed = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Running_nowood.fbx?v=7', 'Run_Unarmed', playerModel, translationScaleFactor);
      if (runUnarmed) clips.push(runUnarmed);

      const jumpUnarmed = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Jumping_nowood.fbx?v=7', 'Jump_Unarmed', playerModel, translationScaleFactor);
      if (jumpUnarmed) clips.push(jumpUnarmed);

      const wukongDoubleJump = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/wukong_no_wood_double_jumpFront Flip.fbx?v=7', 'Wukong_NoWood_DoubleJump', playerModel, translationScaleFactor);
      if (wukongDoubleJump) clips.push(wukongDoubleJump);

      const takeItem = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Taking_item_nowood.fbx?v=7', 'TakeItem', playerModel, translationScaleFactor);
      if (takeItem) clips.push(takeItem);

      const wukongKick = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Wukong_no_wood_kik.fbx?v=7', 'Wukong_NoWood_Kick', playerModel, translationScaleFactor);
      if (wukongKick) clips.push(wukongKick);

      const wukongHardLanding = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/wukong_no_woodHard Landing.fbx?v=7', 'Wukong_NoWood_HardLanding', playerModel, translationScaleFactor);
      if (wukongHardLanding) clips.push(wukongHardLanding);

      // Armed set (from FBX -> apply translationScaleFactor)
      const idleArmed = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Idle.fbx?v=7', 'Idle_Armed', playerModel, translationScaleFactor);
      if (idleArmed) clips.push(idleArmed);

      const runArmed = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Run.fbx?v=7', 'Run_Armed', playerModel, translationScaleFactor);
      if (runArmed) clips.push(runArmed);

      const jumpArmed = await this.loadAndRetargetClip(import.meta.env.BASE_URL + 'assets/characters/Jump.fbx?v=7', 'Jump_Armed', playerModel, translationScaleFactor);
      if (jumpArmed) clips.push(jumpArmed);

      // Load atack_wood.glb for CastSpell animation and extract its built-in staff
      const castSpellData = await this.loadAndRetargetGltfClip(import.meta.env.BASE_URL + 'assets/characters/atack_wood.glb', 'CastSpell', playerModel);
      if (castSpellData) {
        clips.push(castSpellData.clip);
        
        // Attach the extracted staff to the player's LeftHand
        castSpellData.externalMeshes.forEach(mesh => {
          if (mesh.name === 'Cylinder') {
            mesh.name = 'atack_wood_staff';
            mesh.visible = false; // Hidden by default
            
            let leftHand: THREE.Object3D | null = null;
            playerModel.traverse((child) => {
              const n = child.name.toLowerCase();
              if (n.includes('lefthand') && !n.includes('thumb') && !n.includes('index') && !n.includes('middle') && !n.includes('ring') && !n.includes('pinky')) {
                leftHand = child;
              }
            });
            if (leftHand) {
              // Re-parent the cylinder to the player's left hand exactly where it was relative to the GLB's left hand
              // Since it was already a child of mixamorig:LeftHand in the GLB, its position/rotation/scale is local to the hand.
              (leftHand as THREE.Object3D).add(mesh);
              console.log(`[AssetManager] Attached 'atack_wood_staff' to LeftHand`);
            }
          }
        });
      }

      console.log(`[AssetManager] 🎬 Total clips loaded: ${clips.length} → [${clips.map((c) => c.name).join(', ')}]`);

      return { model: playerModel, clips };
    } catch (err) {
      console.error('[AssetManager] Failed to load player model:', err);
      return { model: this.createProceduralPlayer(), clips: [] };
    }
  }


  public createProceduralPlayer(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'ProceduralPlayer';

    const robeMat = new THREE.MeshStandardMaterial({ color: 0x1f1838, roughness: 0.6, metalness: 0.2 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf3c644, metalness: 0.8, roughness: 0.3 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd3b6, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 0.7 });
    const staffWoodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1b, roughness: 0.8 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.48, 1.3, 12), robeMat);
    body.position.y = 0.75;
    body.name = 'body';
    body.castShadow = true;
    group.add(body);

    const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.12, 12), goldTrimMat);
    sash.position.y = 0.75;
    group.add(sash);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), skinMat);
    head.position.y = 1.52;
    head.castShadow = true;
    group.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), hairMat);
    hair.position.y = 1.54;
    group.add(hair);

    const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x3df3ff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.08, 1.54, 0.21);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.08, 1.54, 0.21);
    group.add(eyeL, eyeR);

    const staffGroup = new THREE.Group();
    staffGroup.name = 'magic_wand';
    staffGroup.position.set(0.42, 0.85, 0.2);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 1.8, 10), staffWoodMat);
    shaft.position.y = 0.4;
    staffGroup.add(shaft);

    const headRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 8, 16), goldTrimMat);
    headRing.position.y = 1.25;
    staffGroup.add(headRing);

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0x3df3ff }));
    orb.position.y = 1.25;
    orb.name = 'staff_crystal_tip';
    staffGroup.add(orb);

    const staffLight = new THREE.PointLight(0x3df3ff, 2.5, 4.0);
    staffLight.position.y = 1.25;
    staffGroup.add(staffLight);

    group.add(staffGroup);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.38, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x120d20 });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.name = 'leg_L';
    legL.position.set(-0.14, 0.19, 0);
    legL.castShadow = true;
    const legR = new THREE.Mesh(legGeo, legMat);
    legR.name = 'leg_R';
    legR.position.set(0.14, 0.19, 0);
    legR.castShadow = true;
    group.add(legL, legR);

    return group;
  }
}
