import * as THREE from 'three';
import { PlayerController } from '../player/PlayerController';

export interface CheckpointData {
  id: number;
  position: THREE.Vector3;
  rotationY: number;
}

export class CheckpointManager {
  private checkpoints: CheckpointData[] = [];
  private currentCheckpointIndex = 0;
  public abyssYThreshold = -8.0; // Y height at which player dies/respawns

  public addCheckpoint(id: number, position: THREE.Vector3, rotationY = 0): void {
    this.checkpoints.push({ id, position: position.clone(), rotationY });
  }

  public setActiveCheckpoint(id: number): void {
    const idx = this.checkpoints.findIndex((c) => c.id === id);
    if (idx !== -1 && idx > this.currentCheckpointIndex) {
      this.currentCheckpointIndex = idx;
      console.log(`[CheckpointManager] Activated Checkpoint #${id}`);
    }
  }

  public update(player: PlayerController): boolean {
    // Check if player fell into pit
    if (player.mesh.position.y < this.abyssYThreshold) {
      this.respawnPlayer(player);
      return true;
    }
    return false;
  }

  public respawnPlayer(player: PlayerController): void {
    const cp = this.checkpoints[this.currentCheckpointIndex];
    if (cp) {
      player.mesh.position.copy(cp.position);
      player.mesh.rotation.y = cp.rotationY;
      player.velocity.set(0, 0, 0);
      console.log(`[CheckpointManager] Player respawned at Checkpoint #${cp.id}`);
    }
  }

  public getCurrentCheckpointId(): number {
    return this.checkpoints[this.currentCheckpointIndex]?.id ?? 0;
  }

  public getActiveCheckpointPosition(): THREE.Vector3 {
    return this.checkpoints[this.currentCheckpointIndex]?.position.clone() ?? new THREE.Vector3(0, 0.2, 12);
  }
}
