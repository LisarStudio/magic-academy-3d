import * as THREE from 'three';
import type { PlayerController } from '../player/PlayerController';
import { ItemPickupVFX } from '../player/ItemPickupVFX';
import { WEAPON_DEFINITIONS } from '../player/WeaponConfig';

export interface ChestCinematicDeps {
  scene: THREE.Scene;
  player: PlayerController;
  chestPosition: THREE.Vector3;
  hud: {
    fadeScreenOut: (ms: number) => Promise<void>;
    fadeScreenIn: (ms: number) => Promise<void>;
    setObjective: (text: string) => void;
  };
  onComplete: () => void;
}

/** Keeps the pickup in the live game render loop: it never covers the scene with a black fade. */
export class ChestCinematic {
  private staffInChest: THREE.Group | null = null;
  private bobAnimId: number | null = null;
  private running = false;
  private contacted = false;
  private deps: ChestCinematicDeps;

  constructor(deps: ChestCinematicDeps) {
    this.deps = deps;
  }

  public async run(): Promise<void> {
    if (this.running || this.deps.player.hasStaff) return;
    this.running = true;
    const { player, hud, onComplete } = this.deps;
    player.isControlsLocked = true;
    player.isMovementLocked = true;
    player.velocity.set(0, 0, 0);

    try {
      await this.alignToChest();
      this.spawnChestStaff();
      await new Promise<void>((resolve) => {
        player.animationController.playTakeItemAnimation(
          () => {
            if (this.contacted) return;
            this.contacted = true;
            this.moveStaffToHand();
            // The acquisition is committed once, at the clip's hand-contact marker.
            player.obtainWeapon('STAFF', false);
          },
          (completed) => {
            if (!completed) console.warn('[ChestCinematic] TakeItem did not reach its mixer finished event; recovering the interaction.');
            resolve();
          }
        );
      });

      this.stopStaffBob();
      if (this.staffInChest?.parent) this.staffInChest.parent.remove(this.staffInChest);
      this.staffInChest = null;
      player.equipWeapon('STAFF');
      player.animationController.playState('Idle', 0.18);
      hud.setObjective('Explora el Reino y reúne las 3 llaves místicas');
    } catch (error) {
      console.error('[ChestCinematic] Pickup failed; restoring a playable state:', error);
      this.stopStaffBob();
      if (this.staffInChest?.parent) this.staffInChest.parent.remove(this.staffInChest);
      this.staffInChest = null;
      // The chest has already opened, so preserve the acquired item on recovery.
      if (!player.hasStaff) player.obtainWeapon('STAFF', false);
      player.equipWeapon('STAFF');
      player.animationController.playState('Idle', 0.18);
    } finally {
      player.isControlsLocked = false;
      player.isMovementLocked = false;
      player.velocity.set(0, 0, 0);
      this.running = false;
      onComplete();
    }
  }

  private async alignToChest(): Promise<void> {
    const { player, chestPosition } = this.deps;
    const startPosition = player.mesh.position.clone();
    const radial = new THREE.Vector2(startPosition.x - chestPosition.x, startPosition.z - chestPosition.z);
    if (radial.lengthSq() < 0.0001) radial.set(0, 1);
    radial.normalize();

    // Keep the player on the same side of the chest and outside its footprint.
    const targetPosition = new THREE.Vector3(
      chestPosition.x + radial.x * 1.45,
      startPosition.y,
      chestPosition.z + radial.y * 1.45
    );
    const startYaw = player.mesh.rotation.y;
    const targetYaw = Math.atan2(-radial.x, -radial.y);
    const yawDelta = THREE.MathUtils.euclideanModulo(targetYaw - startYaw + Math.PI, Math.PI * 2) - Math.PI;
    const startTime = performance.now();
    const durationMs = 360;

    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = t * t * (3 - 2 * t);
        player.mesh.position.lerpVectors(startPosition, targetPosition, eased);
        player.mesh.rotation.y = startYaw + yawDelta * eased;
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  private spawnChestStaff(): void {
    const { scene, chestPosition } = this.deps;
    const staff = this.deps.player.cloneStaffProp('chest_staff_prop');
    if (!staff) throw new Error('The player staff mesh was not prepared before chest interaction.');
    staff.position.set(chestPosition.x, chestPosition.y + 0.82, chestPosition.z);
    staff.rotation.set(0, Math.PI * 0.25, Math.PI * 0.35);
    scene.add(staff);
    this.staffInChest = staff;

    const baseY = staff.position.y;
    const start = performance.now();
    const bob = (now: number) => {
      if (!staff.parent || this.contacted) return;
      const t = (now - start) / 1000;
      staff.position.y = baseY + Math.sin(t * 2.5) * 0.055;
      staff.rotation.y = t * 1.2;
      this.bobAnimId = requestAnimationFrame(bob);
    };
    this.bobAnimId = requestAnimationFrame(bob);
  }

  private moveStaffToHand(): void {
    const { player } = this.deps;
    const staff = this.staffInChest;
    const hand = ItemPickupVFX.findHandNode(player);
    if (!staff || !hand) return;
    this.stopStaffBob();

    hand.attach(staff); // Object3D.attach preserves the chest prop's current world transform.
    const config = WEAPON_DEFINITIONS.STAFF.handAttachment;
    const targetPosition = player.staffHandMesh?.position ?? config.position;
    const targetQuaternion = player.staffHandMesh?.quaternion ?? new THREE.Quaternion().setFromEuler(config.rotation);
    const targetScale = player.staffHandMesh?.scale ?? new THREE.Vector3(1, 1, 1);
    const fromPosition = staff.position.clone();
    const fromQuaternion = staff.quaternion.clone();
    const fromScale = staff.scale.clone();
    const started = performance.now();
    const duration = 320;

    const animate = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = t * t * (3 - 2 * t);
      staff.position.lerpVectors(fromPosition, targetPosition, eased);
      staff.quaternion.slerpQuaternions(fromQuaternion, targetQuaternion, eased);
      staff.scale.lerpVectors(fromScale, targetScale, eased);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  private stopStaffBob(): void {
    if (this.bobAnimId !== null) cancelAnimationFrame(this.bobAnimId);
    this.bobAnimId = null;
  }
}
