import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';
import { MobileInputManager } from './MobileInputManager';
import { AudioManager } from './AudioManager';
import { AssetManager } from './AssetManager';
import { PlayerController } from '../player/PlayerController';
import { AnimationController } from '../player/AnimationController';
import { CameraController } from '../camera/CameraController';
import { CinematicCamera } from '../camera/CinematicCamera';
import { CinematicManager } from '../cinematics/CinematicManager';
import { SpellSystem } from '../spells/SpellSystem';
import { CheckpointManager } from '../world/CheckpointManager';
import { CollectibleSystem } from '../collectibles/CollectibleSystem';
import { HUD } from '../ui/HUD';
import { SubtitleSystem } from '../ui/SubtitleSystem';
import { LevelToyStory } from '../levels/LevelToyStory';

export class Game {
  private sceneManager: SceneManager;
  private inputManager: InputManager;
  // @ts-ignore
  private mobileInputManager: MobileInputManager;
  private audioManager: AudioManager;
  private assetManager: AssetManager;
  private hud: HUD;
  private subtitleSystem: SubtitleSystem;

  private player!: PlayerController;
  private animationController!: AnimationController;
  private cameraController!: CameraController;
  private cinematicCamera!: CinematicCamera;
  private cinematicManager!: CinematicManager;
  private spellSystem!: SpellSystem;
  private checkpointManager!: CheckpointManager;
  private collectibleSystem!: CollectibleSystem;
  private level01!: LevelToyStory;

  private lastFrameTime = 0;
  private frameCount = 0;
  private lastFpsCalcTime = 0;
  private currentFps = 60;
  private isPaused = false;

  constructor(canvas: HTMLCanvasElement) {
    this.sceneManager = new SceneManager(canvas);
    this.inputManager = new InputManager(canvas);
    this.mobileInputManager = new MobileInputManager(this.inputManager);
    this.audioManager = new AudioManager();
    this.assetManager = new AssetManager();
    this.hud = new HUD();
    this.subtitleSystem = new SubtitleSystem();

    this.initUIListeners();
  }

  public async start(): Promise<void> {
    console.log('[Game] Initializing 3D Magic Academy Vertical Slice...');

    // 1. Load Player Model (GLB or Procedural Fallback)
    const playerData = await this.assetManager.loadPlayerModel();
    this.sceneManager.scene.add(playerData.model);

    // 2. Setup AnimationController & PlayerController
    this.animationController = new AnimationController(playerData.model, playerData.clips);
    this.player = new PlayerController(playerData.model as THREE.Group, this.animationController);

    // 3. Setup Cameras
    this.cameraController = new CameraController(this.sceneManager.camera);
    this.cinematicCamera = new CinematicCamera(this.sceneManager.camera);

    // 4. Setup Managers
    this.cinematicManager = new CinematicManager(
      this.cinematicCamera,
      this.cameraController,
      this.player,
      this.subtitleSystem,
      this.audioManager
    );

    this.spellSystem = new SpellSystem(this.sceneManager.scene, this.audioManager);
    this.checkpointManager = new CheckpointManager();
    this.collectibleSystem = new CollectibleSystem(this.sceneManager.scene, this.audioManager);

    // 5. Setup Level Toy Story
    this.level01 = new LevelToyStory(
      this.sceneManager,
      this.cameraController,
      this.player,
      this.inputManager,
      this.spellSystem,
      this.checkpointManager,
      this.collectibleSystem,
      this.subtitleSystem,
      this.audioManager
    );

    this.level01.init();

    // Focus camera on target AFTER the level is initialized and player is spawned at Checkpoint 0!
    this.cameraController.setTarget(this.player.mesh);

    // Trigger Game Intro Sequence (Cinemática Inicial con Gekko)
    this.level01.runGameIntroSequence();

    // 6. Bind Player & HUD Status Callbacks
    this.player.onHealthChange = (hp, maxHp) => this.hud.setHealth(hp, maxHp);
    this.hud.setupMobileControls(this.inputManager);
    this.spellSystem.onCollectStaffCallback = () => {
      this.player.equipStaff();
      this.subtitleSystem.show('Báculo Mágico', '¡Has encontrado el Báculo Mágico en el cofre! Hechizos desbloqueados.');
    };

    // Bind Pause Menu Save / Load buttons
    document.getElementById('btn-save-game')?.addEventListener('click', () => {
      this.saveGame();
    });
    document.getElementById('btn-load-game')?.addEventListener('click', () => {
      this.loadGame();
    });

    // 7. Bind Input Actions
    this.inputManager.onLeftClick = () => {
      if (this.player.hasStaff && !this.player.isControlsLocked && !this.player.isAttacking) {
        this.player.isAttacking = true;
        
        // Align player character rotation towards camera forward / target direction when starting attack
        const rawDir = this.cameraController.getForwardVector();
        const targetRot = Math.atan2(rawDir.x, rawDir.z);
        this.player.mesh.rotation.y = targetRot;

        this.player.attachStaffToHand();
        
        // Play atack_wood.glb animation. Physical melee hit test executes at swing impact point (~35% of gesture)
        this.animationController.playCastSpellAnimation(
          // OnCastAtMarker callback — exact moment of physical staff swing impact
          () => {
            this.audioManager.playAttackGrunt(); // Energetic hero strike shout & impact
            const playerPos = this.player.mesh.position;
            const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.mesh.quaternion);

            // 1. Physical Melee Hit Test against Enemies (within 2.8m in front cone)
            this.level01.enemies.forEach(enemy => {
              if (enemy.isAlive()) {
                const enemyPos = enemy.getPosition();
                const dist = playerPos.distanceTo(enemyPos);
                if (dist < 2.8) {
                  const toEnemy = enemyPos.clone().sub(playerPos).normalize();
                  const dot = forwardDir.dot(toEnemy);
                  if (dot > 0.3) {
                    console.log(`[Game] Physical Staff Hit on '${enemy.id}'!`);
                    enemy.takeHit(playerPos, 1);
                  }
                }
              }
            });

            // 2. Physical Melee Hit Test against Destructible Pots (within 2.5m)
            this.level01.pots.forEach(pot => {
              if (!pot.isBroken) {
                const dist = playerPos.distanceTo(pot.mesh.position);
                if (dist < 2.5) {
                  const toPot = pot.mesh.position.clone().sub(playerPos).normalize();
                  if (forwardDir.dot(toPot) > 0.3) {
                    pot.shatter(this.audioManager, (this.level01 as any).collectibleSystem);
                  }
                }
              }
            });
          },
          // OnComplete callback — animation finished, return staff to back cleanly
          () => {
            this.player.attachStaffToBack();
            this.player.isAttacking = false;
          }
        );
      }
    };

    this.inputManager.onKick = () => {
      console.log('[Game] onKick callback triggered. HasStaff:', this.player.hasStaff, 'isControlsLocked:', this.player.isControlsLocked, 'isAttacking:', this.player.isAttacking);
      if (!this.player.isControlsLocked && !this.player.isAttacking) {
        this.player.isAttacking = true;
        this.player.isMovementLocked = true;
        this.player.isControlsLocked = true;
        this.player.velocity.set(0, 0, 0);

        // Soft target assist (max 4.5 meters, prioritized by front cone & proximity)
        let bestEnemy = null;
        let bestScore = Infinity;
        const playerPos = this.player.mesh.position;
        const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.mesh.quaternion);

        this.level01.enemies.forEach(enemy => {
          if (enemy.isAlive()) {
            const enemyPos = enemy.getPosition();
            const toEnemy = enemyPos.clone().sub(playerPos);
            const dist = toEnemy.length();
            if (dist < 4.5) {
              toEnemy.normalize();
              const dot = forwardDir.dot(toEnemy);
              const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
              
              // Only assist if enemy is within front cone (<= 70 degrees)
              // or extremely close (< 1.5m, then allow up to 110 degrees)
              if (angle < 1.22 || (dist < 1.5 && angle < 1.91)) {
                // Score combines distance and angle deviation
                const score = dist * (1.0 + angle);
                if (score < bestScore) {
                  bestScore = score;
                  bestEnemy = enemy;
                }
              }
            }
          }
        });

        if (bestEnemy) {
          const enemyPos = (bestEnemy as any).getPosition();
          const targetDir = enemyPos.clone().sub(playerPos);
          targetDir.y = 0;
          const tdLen = targetDir.length();
          // SAFETY: skip rotation assist if player is on top of enemy (avoids NaN in rotation)
          if (tdLen > 0.001) {
            targetDir.divideScalar(tdLen);
            const targetRot = Math.atan2(targetDir.x, targetDir.z);
            let diff = targetRot - this.player.mesh.rotation.y;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            // Limit the correction to maximum 45 degrees (Math.PI / 4) to keep it subtle
            const maxGiro = Math.PI / 4;
            const actualGiro = Math.max(-maxGiro, Math.min(maxGiro, diff));
            this.player.mesh.rotation.y += actualGiro;
            console.log('[Game] Soft Assist applied. Rotating Wukong by', (actualGiro * 180 / Math.PI).toFixed(1), 'deg');
          }
        }

        this.audioManager.playAttackGrunt();

        this.animationController.playWukongKick(
          () => {
            const playerPos = this.player.mesh.position;
            const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.mesh.quaternion);

            this.level01.enemies.forEach(enemy => {
              if (enemy.isAlive()) {
                const enemyPos = enemy.getPosition();
                const dist = playerPos.distanceTo(enemyPos);
                const maxHitDist = enemy.id === 'crab_boss' ? 4.5 : 2.2;
                if (dist < maxHitDist) {
                  const dirToEnemy = enemyPos.clone().sub(playerPos);
                  if (dirToEnemy.lengthSq() > 0.0001) {
                    dirToEnemy.normalize();
                  } else {
                    dirToEnemy.copy(forwardDir);
                  }
                  const dot = forwardDir.dot(dirToEnemy);
                  if (dot > 0.35 || enemy.id === 'crab_boss') { // Always allow hitting boss if in range
                    enemy.takeHit(playerPos);
                    this.audioManager.playHitImpact();
                    // @ts-ignore
                    this.spellSystem.createImpactParticles(enemyPos.clone().add(new THREE.Vector3(0, 0.5, 0)), 0xffa500);
                  }
                }
              }
            });
          },
          () => {
            this.player.isAttacking = false;
            this.player.isMovementLocked = false;
            this.player.isControlsLocked = false;
          }
        );
      }
    };

    this.inputManager.onSelectSpell = (idx: number) => {
      const spells: import('../spells/SpellProjectile').SpellType[] = ['FLIPENDO', 'ALOHOMORA', 'LUMOS'];
      const spellName = spells[idx % spells.length] || 'FLIPENDO';
      this.spellSystem.setActiveSpell(spellName);
      this.hud.setActiveSpellSlot(spellName);
    };

    this.inputManager.onSkipSubtitle = () => {
      this.cinematicManager.requestSkip();
    };

    this.inputManager.onToggleDebug = () => {
      this.hud.toggleDebug();
    };

    this.inputManager.onPointerLockChange = (isLocked) => {
      if (isLocked) {
        this.audioManager.resume();
      }
      if (!this.level01?.stateFlags?.introCompleted) return; // Don't pause during start screen
      if (this.level01?.stateFlags?.levelCompleted) return; // Don't pause if dead/won
      
      this.isPaused = !isLocked;
      const pauseScreen = document.getElementById('pause-screen');
      if (this.isPaused) {
        pauseScreen?.classList.remove('hidden');
      } else {
        pauseScreen?.classList.add('hidden');
      }
    };

    // 8. Start Game Loop
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  private initUIListeners(): void {
    const btnStart = document.getElementById('btn-start');
    const startScreen = document.getElementById('start-screen');
    const btnReplay = document.getElementById('btn-replay');
    const btnContinue = document.getElementById('btn-continue');
    const btnResume = document.getElementById('btn-resume');
    this.inputManager.onPauseToggle = () => this.togglePause();

    const onStartGame = (e?: Event) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      startScreen?.classList.add('hidden');
      this.audioManager.resume();
      if (!this.hud.isTouchDevice()) {
        this.inputManager.requestPointerLock();
      }
      this.audioManager.startBGM();
      this.hud.showGameplayHUD();
      this.inputManager.resetInputs();
      this.player.isControlsLocked = false;
      this.player.isMovementLocked = false;
      this.player.isAttacking = false;
      if (this.level01) {
        (this.level01 as any).isCinematicPlaying = false;
        this.level01.stateFlags.introCompleted = true;
      }
    };

    btnStart?.addEventListener('click', onStartGame);
    btnStart?.addEventListener('touchstart', onStartGame, { passive: false });

    btnReplay?.addEventListener('click', () => {
      window.location.reload();
    });

    btnContinue?.addEventListener('click', () => {
      window.location.reload();
    });

    btnResume?.addEventListener('click', () => {
      this.audioManager.resume();
      this.togglePause(false);
    });
  }

  public togglePause(forceState?: boolean): void {
    const nextState = forceState !== undefined ? forceState : !this.isPaused;
    this.isPaused = nextState;

    if (this.isPaused) {
      this.inputManager.resetInputs();
      this.hud.showPauseMenu(true);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } else {
      this.inputManager.resetInputs();
      this.hud.showPauseMenu(false);
      if (!this.hud.isTouchDevice()) {
        this.inputManager.requestPointerLock();
      }
    }
  }

  private loop(currentTime: number): void {
    const delta = Math.min(0.1, (currentTime - this.lastFrameTime) / 1000);
    this.lastFrameTime = currentTime;

    if (!this.isPaused) {
      this.update(delta);
    }
    this.sceneManager.render();

    // Calculate FPS
    this.frameCount++;
    if (currentTime - this.lastFpsCalcTime >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsCalcTime = currentTime;
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  private update(delta: number): void {
    // Update Game Components
    if (this.cinematicCamera.isActive()) {
      this.cinematicCamera.update(delta);
      // Still update player animations during cinematics
      this.player.update(delta, this.inputManager, this.cameraController);
    } else {
      this.player.update(delta, this.inputManager, this.cameraController);
      this.cameraController.update(delta, this.inputManager);
    }

    this.spellSystem.update(delta, this.level01.levelColliders);
    this.spellSystem.updateTargetLockon(this.cameraController.camera.position, this.cameraController.getForwardVector());
    this.level01.update(delta, this.player.mesh.position);

    if (this.player.hasStaff && document.pointerLockElement) {
      this.hud.showReticle(true);
    } else {
      this.hud.showReticle(false);
    }

    // Update Debug Panel
    this.hud.updateDebugStats(
      this.currentFps,
      this.player.mesh.position.x,
      this.player.mesh.position.y,
      this.player.mesh.position.z,
      this.player.isGrounded ? 'Grounded' : 'Airborne',
      this.animationController.getCurrentState(),
      this.checkpointManager.getCurrentCheckpointId()
    );

    // Render is handled in loop()
  }

  public saveGame(): void {
    const saveData = {
      playerPos: { x: this.player.mesh.position.x, y: this.player.mesh.position.y, z: this.player.mesh.position.z },
      playerRotY: this.player.mesh.rotation.y,
      health: this.player.health,
      maxHealth: this.player.maxHealth,
      mana: this.player.mana,
      maxMana: this.player.maxMana,
      hasStaff: this.player.hasStaff,
      coinsCount: this.collectibleSystem.coinCount,
      gekkoMissionState: this.level01.gekkoMissionState,
      timestamp: Date.now()
    };
    localStorage.setItem('lisar_savegame', JSON.stringify(saveData));
    this.subtitleSystem.show('Guardado', '¡Partida guardada exitosamente!');
    console.log('[SaveSystem] Game saved:', saveData);
  }

  public loadGame(): void {
    const raw = localStorage.getItem('lisar_savegame');
    if (!raw) {
      this.subtitleSystem.show('Guardado', 'No se encontró ninguna partida guardada.');
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (data.playerPos) {
        this.player.mesh.position.set(data.playerPos.x, data.playerPos.y, data.playerPos.z);
      }
      if (data.playerRotY !== undefined) {
        this.player.mesh.rotation.y = data.playerRotY;
      }
      if (data.health !== undefined) {
        this.player.health = data.health;
        this.hud.setHealth(this.player.health, this.player.maxHealth);
      }
      if (data.mana !== undefined) {
        this.player.mana = data.mana;
        this.hud.setMana(this.player.mana, this.player.maxMana);
      }
      if (data.hasStaff) {
        this.player.hasStaff = true;
        this.player.setStaffVisibility(true);
        this.player.attachStaffToBack();
      }
      if (data.coinsCount !== undefined) {
        this.collectibleSystem.coinCount = data.coinsCount;
        this.hud.setCoinCount(this.collectibleSystem.coinCount);
      }
      if (data.gekkoMissionState) {
        this.level01.gekkoMissionState = data.gekkoMissionState;
      }
      this.subtitleSystem.show('Cargado', '¡Partida cargada exitosamente!');
      console.log('[SaveSystem] Game loaded:', data);
    } catch (e) {
      console.error('[SaveSystem] Error loading savegame:', e);
    }
  }
}
