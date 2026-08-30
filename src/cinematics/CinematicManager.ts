import * as THREE from 'three';
import { CinematicCamera } from '../camera/CinematicCamera';
import { CameraController } from '../camera/CameraController';
import { PlayerController } from '../player/PlayerController';
import { SubtitleSystem } from '../ui/SubtitleSystem';
import { NPCController } from '../npc/NPCController';
import { Door } from '../world/Door';
import { AudioManager } from '../core/AudioManager';

export type CinematicAction = (mgr: CinematicManager) => Promise<void>;

export class CinematicManager {
  public cinematicCamera: CinematicCamera;
  public cameraController: CameraController;
  public playerController: PlayerController;
  public subtitleSystem: SubtitleSystem;
  public audioManager: AudioManager;

  public isPlayingSequence = false;
  private skipRequested = false;

  constructor(
    cinematicCamera: CinematicCamera,
    cameraController: CameraController,
    playerController: PlayerController,
    subtitleSystem: SubtitleSystem,
    audioManager: AudioManager
  ) {
    this.cinematicCamera = cinematicCamera;
    this.cameraController = cameraController;
    this.playerController = playerController;
    this.subtitleSystem = subtitleSystem;
    this.audioManager = audioManager;
  }

  public async play(actions: CinematicAction[]): Promise<void> {
    this.isPlayingSequence = true;
    this.skipRequested = false;
    this.playerController.isControlsLocked = true;

    for (const action of actions) {
      if (this.skipRequested) {
        console.log('[CinematicManager] Sequence skipped by user.');
        break;
      }
      await action(this);
    }

    this.isPlayingSequence = false;
    this.playerController.isControlsLocked = false;
    this.subtitleSystem.hide();
    this.cinematicCamera.stop();
  }

  public requestSkip(): void {
    if (this.isPlayingSequence) {
      this.skipRequested = true;
      this.subtitleSystem.hide();
    }
  }
}

// Action Helper functions
export function fadeIn(_durationSeconds: number): CinematicAction {
  return async () => {
    // Fade overlay effect
    await new Promise((r) => setTimeout(r, 200));
  };
}

export function fadeOut(_durationSeconds: number): CinematicAction {
  return async () => {
    await new Promise((r) => setTimeout(r, 200));
  };
}

export function cameraMove(
  fromPos: THREE.Vector3,
  toPos: THREE.Vector3,
  fromLookAt: THREE.Vector3,
  toLookAt: THREE.Vector3,
  durationSeconds: number
): CinematicAction {
  return async (mgr) => {
    await mgr.cinematicCamera.moveCamera(fromPos, toPos, fromLookAt, toLookAt, durationSeconds);
  };
}

export function subtitle(speaker: string, text: string, displayTimeSeconds: number = 3.0): CinematicAction {
  return async (mgr) => {
    mgr.subtitleSystem.show(speaker, text);
    const ms = displayTimeSeconds * 1000;
    const start = Date.now();
    while (Date.now() - start < ms) {
      if ((mgr as unknown as { skipRequested: boolean }).skipRequested) break;
      await new Promise((r) => setTimeout(r, 50));
    }
  };
}

export function wait(seconds: number): CinematicAction {
  return async (mgr) => {
    const ms = seconds * 1000;
    const start = Date.now();
    while (Date.now() - start < ms) {
      if ((mgr as unknown as { skipRequested: boolean }).skipRequested) break;
      await new Promise((r) => setTimeout(r, 50));
    }
  };
}

export function moveNPC(npc: NPCController, targetPos: THREE.Vector3, durationSeconds: number): CinematicAction {
  return async () => {
    const start = Date.now();
    const durationMs = durationSeconds * 1000;
    while (Date.now() - start < durationMs) {
      const delta = 0.016;
      if (npc.moveTowards(targetPos, delta, 3.0)) break;
      await new Promise((r) => setTimeout(r, 16));
    }
  };
}

export function openDoor(door: Door): CinematicAction {
  return async (mgr) => {
    door.open(mgr.audioManager);
    await new Promise((r) => setTimeout(r, 500));
  };
}

export function playSound(soundType: 'cast' | 'hit' | 'door' | 'card' | 'victory'): CinematicAction {
  return async (mgr) => {
    switch (soundType) {
      case 'cast': mgr.audioManager.playSpellCast(); break;
      case 'hit': mgr.audioManager.playTargetHit(); break;
      case 'door': mgr.audioManager.playDoorOpen(); break;
      case 'card': mgr.audioManager.playCardPickup(); break;
      case 'victory': mgr.audioManager.playVictoryJingle(); break;
    }
  };
}

export function returnControlToPlayer(): CinematicAction {
  return async (mgr) => {
    mgr.playerController.isControlsLocked = false;
    mgr.subtitleSystem.hide();
  };
}
