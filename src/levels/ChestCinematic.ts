import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { PlayerController } from '../player/PlayerController';

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
      console.log('[ChestCinematic] STAFF_VISIBLE — loading baculo.glb?v=7');
      try {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(import.meta.env.BASE_URL + 'assets/characters/baculo.glb?v=7');
        this.staffInChest = gltf.scene;
        this.staffInChest.name = 'chest_staff_prop';

        // Add to scene FIRST — Box3.setFromObject needs world matrix updated
        this.staffInChest.position.set(chestPosition.x, chestPosition.y + 0.3, chestPosition.z);
        scene.add(this.staffInChest);

        // Compute real bounding box AFTER it's in the scene graph
        const bbox = new THREE.Box3().setFromObject(this.staffInChest);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const largest = Math.max(size.x, size.y, size.z);
        console.log('[ChestCinematic] baculo.glb native: ' + size.x.toFixed(3) + 'w x ' + size.y.toFixed(3) + 'h x ' + size.z.toFixed(3) + 'd (largest: ' + largest.toFixed(3) + ')');

        // Scale: largest dim → 0.32m (fits inside 0.7m chest with margin)
        const TARGET = 0.32;
        const sf = largest > 0.001 ? TARGET / largest : 0.1;
        this.staffInChest.scale.setScalar(sf);
        console.log('[ChestCinematic] Scale factor: ' + sf.toFixed(4) + ' (target ' + TARGET + 'm)');

        // Final position: center of chest interior
        const staffY = chestPosition.y + 0.30;
        this.staffInChest.position.set(chestPosition.x, staffY, chestPosition.z);
        // Lay horizontally as if resting on chest floor
        this.staffInChest.rotation.set(0, Math.PI * 0.25, Math.PI * 0.5);
        console.log('[ChestCinematic] Staff world pos: (' + chestPosition.x.toFixed(2) + ', ' + staffY.toFixed(2) + ', ' + chestPosition.z.toFixed(2) + ')');
      } catch (e) {
        console.warn('[ChestCinematic] baculo.glb load failed:', e);
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

    // Staff disappears as player reaches for it (visual: player grabbed it)
    if (this.staffInChest) {
      this.staffInChest.visible = false;
      if (this.bobAnimId !== null) {
        cancelAnimationFrame(this.bobAnimId);
        this.bobAnimId = null;
      }
    }

    // Play TakeItem — resolves ONLY when mixer.finished fires. No setTimeout.
    const animOK = await this.playTakeItemAndWait(player);
    if (!animOK) {
      await this.wait(600); // safety pause if clip was missing
    }

    // ── STATE: FADE_OUT ────────────────────────────────────────────────────
    // This code runs ONLY after the animation ended.
    console.log('[ChestCinematic] FADE_OUT — animation complete');

    if (this.staffInChest) {
      scene.remove(this.staffInChest);
      this.staffInChest = null;
    }

    await hud.fadeScreenOut(700);

    // ── STATE: EQUIP_STAFF ─────────────────────────────────────────────────
    // Screen is fully black — swap animations invisibly
    console.log('[ChestCinematic] EQUIP_STAFF — screen black');

    player.hasStaff = true;
    player.setStaffVisibility(true);
    player.animationController.setArmed(true);

    hud.setObjective('Usa Force Blast en el objetivo sobre la puerta');
    await this.wait(400);

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

