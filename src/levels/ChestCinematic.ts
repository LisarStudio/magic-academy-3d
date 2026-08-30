import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { PlayerController } from '../player/PlayerController';
import { ItemPickupVFX } from '../player/ItemPickupVFX';

/**
 * ChestCinematic — Zelda-style staff pickup cinematic.
 *
 * Asset compatibility verified via binary inspection:
 *   - player.glb:             60 nodes all mixamorig:* naming, skin='Armature'
 *   - Taking_item_nowood.fbx: mixamorig:* → retargets to player.glb → AssetManager loads as 'TakeItem'
 *   - Idle.fbx/Run.fbx/Jump.fbx: mixamorig:* → loaded as 'Idle_Armed'/'Run_Armed'/'Jump_Armed'
 *   - wood.glb:               65KB, no animations, used as prop inside the chest
 *
 * State machine:
 *   CHEST_OPEN → STAFF_VISIBLE → PLAYER_TAKES_STAFF → FADE_OUT → EQUIP_STAFF → FADE_IN → GAMEPLAY_WITH_STAFF
 */
export interface ChestCinematicDeps {
  scene: THREE.Scene;
  player: PlayerController;
  /** World position of the TreasureChest (floor level) */
  chestPosition: THREE.Vector3;
  hud: {
    fadeScreenOut: (ms: number) => Promise<void>;
    fadeScreenIn: (ms: number) => Promise<void>;
    setObjective: (text: string) => void;
  };
  onComplete: () => void;
}

export class ChestCinematic {
  private staffInChest: THREE.Group | null = null;
  private bobAnimId: number | null = null;
  private deps: ChestCinematicDeps;

  constructor(deps: ChestCinematicDeps) {
    this.deps = deps;
  }

  public async run(): Promise<void> {
    const { scene, player, chestPosition, hud, onComplete } = this.deps;

    // ── STATE: CHEST_OPEN ──────────────────────────────────────────────────
    player.isMovementLocked = true;
    player.velocity.set(0, 0, 0);
    player.animationController.playState('Idle');
    console.log('[ChestCinematic] CHEST_OPEN');

    if (this.staffInChest) {
      this.staffInChest.visible = true;
      console.log('[ChestCinematic] STAFF_VISIBLE — showing existing chest prop');
    } else {
      console.log('[ChestCinematic] STAFF_VISIBLE — loading 3D staff model (baculo.glb / wood.glb)');
      try {
        const loader = new GLTFLoader();
        let gltf: any = null;
        try {
          gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/baculo.glb?v=8');
        } catch {
          gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/wood.glb?v=8');
        }

        if (gltf && gltf.scene) {
          const staffGroup = gltf.scene as THREE.Group;
          staffGroup.name = 'chest_staff_prop';

          // Apply golden glow material to staff meshes if needed
          staffGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Add to scene FIRST — Box3.setFromObject needs world matrix updated
          staffGroup.position.set(chestPosition.x, chestPosition.y + 0.35, chestPosition.z);
          scene.add(staffGroup);

          // Compute real bounding box AFTER it's in the scene graph
          const bbox = new THREE.Box3().setFromObject(staffGroup);
          const size = new THREE.Vector3();
          bbox.getSize(size);
          const largest = Math.max(size.x, size.y, size.z);
          console.log('[ChestCinematic] 3D staff native size: ' + size.x.toFixed(3) + 'w x ' + size.y.toFixed(3) + 'h x ' + size.z.toFixed(3) + 'd');

          // Scale: largest dim → 0.45m (clearly visible inside chest)
          const TARGET = 0.45;
          const sf = largest > 0.001 ? TARGET / largest : 0.15;
          staffGroup.scale.setScalar(sf);

          // Final position: center of chest interior elevated slightly so it floats majestically
          const staffY = chestPosition.y + 0.38;
          staffGroup.position.set(chestPosition.x, staffY, chestPosition.z);
          staffGroup.rotation.set(0, Math.PI * 0.25, Math.PI * 0.4);

          this.staffInChest = staffGroup;

          // Add a brilliant golden aura point light inside the chest
          const chestLight = new THREE.PointLight(0xffd700, 3.5, 5.0);
          chestLight.position.set(chestPosition.x, staffY + 0.2, chestPosition.z);
          chestLight.name = 'chest_staff_glow';
          scene.add(chestLight);

          console.log('[ChestCinematic] Staff 3D model successfully positioned in chest at:', chestPosition);
        }
      } catch (e) {
        console.warn('[ChestCinematic] Staff model load failed:', e);
      }
    }

    // Floating bob + slow spin
    if (this.staffInChest) {
      const staff = this.staffInChest;
      const baseY = staff.position.y;
      const t0 = Date.now();
      const bob = () => {
        if (!staff.parent) return; // stop if removed from scene
        const t = (Date.now() - t0) / 1000;
        staff.position.y = baseY + Math.sin(t * 2.5) * 0.035;
        staff.rotation.y = t * 1.0;
        this.bobAnimId = requestAnimationFrame(bob);
      };
      this.bobAnimId = requestAnimationFrame(bob);
    }

    // Player observes staff in open chest
    await this.wait(1000);

    // ── STATE: PLAYER_TAKES_STAFF ──────────────────────────────────────────
    console.log('[ChestCinematic] PLAYER_TAKES_STAFF');

    if (this.bobAnimId !== null) {
      cancelAnimationFrame(this.bobAnimId);
      this.bobAnimId = null;
    }

    // Attach staff directly to Wukong's hand bone so he holds it up during TakeItem!
    const handNode = ItemPickupVFX.findHandNode(player);
    if (this.staffInChest && handNode) {
      scene.remove(this.staffInChest);
      handNode.add(this.staffInChest);
      this.staffInChest.position.set(0, 0.2, 0.1);
      this.staffInChest.rotation.set(0, 0, Math.PI / 2);
      this.staffInChest.visible = true;
    }

    // Play TakeItem — resolves ONLY when mixer.finished fires. No premature disappearance.
    const animOK = await this.playTakeItemAndWait(player);
    if (!animOK) {
      await this.wait(1400);
    }

    // ── STATE: FADE_OUT ────────────────────────────────────────────────────
    console.log('[ChestCinematic] FADE_OUT — animation complete');

    if (this.staffInChest) {
      if (this.staffInChest.parent) {
        this.staffInChest.parent.remove(this.staffInChest);
      }
      this.staffInChest = null;
    }

    await hud.fadeScreenOut(500);

    // ── STATE: EQUIP_STAFF ─────────────────────────────────────────────────
    console.log('[ChestCinematic] EQUIP_STAFF — screen black');

    player.hasStaff = true;
    player.setStaffVisibility(true);
    player.attachStaffToBack();
    player.animationController.setArmed(true);

    hud.setObjective('Explora el Reino y reúne las 3 llaves místicas');
    await this.wait(300);

    // ── STATE: FADE_IN ─────────────────────────────────────────────────────
    console.log('[ChestCinematic] FADE_IN — player armed and ready');
    player.isMovementLocked = false;
    await hud.fadeScreenIn(700);

    // ── STATE: GAMEPLAY_WITH_STAFF ─────────────────────────────────────────
    console.log('[ChestCinematic] GAMEPLAY_WITH_STAFF — done');
    onComplete();
  }

  /**
   * Plays 'TakeItem' clip (Taking_item_nowood.fbx retargeted by AssetManager).
   * Returns true when mixer fires 'finished'.
   * Returns false immediately if clip is missing (logs all available clip names for debugging).
   */
  private playTakeItemAndWait(player: PlayerController): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const anim = player.animationController;
      const mixer = (anim as any).mixer as THREE.AnimationMixer | null;
      const allActions = (anim as any).allActions as Map<string, THREE.AnimationAction> | undefined;
      const action = mixer && allActions ? allActions.get('TakeItem') : undefined;

      if (!mixer || !action) {
        const available = allActions ? Array.from(allActions.keys()).join(', ') : 'no map';
        console.warn('[ChestCinematic] TakeItem not in allActions. Available: [' + available + ']');
        resolve(false);
        return;
      }

      console.log('[ChestCinematic] TakeItem found, duration=' + action.getClip().duration.toFixed(2) + 's');

      // Prevent AnimationController.update() from interrupting this one-shot
      (anim as any).isPlayingOneShot = true;

      const current = (anim as any).currentAction as THREE.AnimationAction | null;
      if (current && current !== action) current.fadeOut(0.15);

      // LoopOnce + clampWhenFinished so mixer fires 'finished' event
      action.reset().setLoop(THREE.LoopOnce, 1).setEffectiveWeight(1).fadeIn(0.15).play();
      action.clampWhenFinished = true;
      (anim as any).currentAction = action;

      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action === action) {
          mixer.removeEventListener('finished', onFinished as any);
          (anim as any).isPlayingOneShot = false;
          console.log('[ChestCinematic] TakeItem finished (mixer event)');
          resolve(true);
        }
      };
      mixer.addEventListener('finished', onFinished as any);
    });
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

