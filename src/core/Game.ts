import * as THREE from 'three';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';
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
import { EquipmentViewer } from '../ui/EquipmentViewer';
import { MobileTouchControls } from '../ui/MobileTouchControls';
import { MainMenu, type MenuState, type StartMode } from '../ui/MainMenu';

export class Game {
  private sceneManager: SceneManager;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private assetManager: AssetManager;
  private mainMenu: MainMenu;
  private menuState: MenuState = 'Loading';
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
    this.audioManager = new AudioManager();
    this.assetManager = new AssetManager();
    this.hud = new HUD();
    this.subtitleSystem = new SubtitleSystem();

    this.mainMenu = new MainMenu({
      onStateChange: (state) => { this.menuState = state; },
      onStartIntroMusic: () => this.audioManager.startIntroMusic(),
      onBeginTransition: () => {
        this.audioManager.resume();
        this.inputManager.resetInputs();
        if (!this.hud.isTouchDevice()) this.inputManager.requestPointerLock();
      },
      onTransitionComplete: (mode) => {
        this.beginGameplay(mode);
        this.sceneManager.render();
      },
      onPreferences: ({ music, effects, quality }) => {
        this.audioManager.setMusicVolume(music);
        this.audioManager.setSFXVolume(effects);
        const maxDpr = window.innerWidth <= 1024 ? 1.0 : 1.5;
        this.sceneManager.renderer.setPixelRatio(Math.min(window.devicePixelRatio * quality, maxDpr));
        this.sceneManager.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      onSelect: () => this.audioManager.playMenuSelect()
    });
    this.assetManager.onProgress = (loaded, total, url) => this.mainMenu.setLoadingProgress(loaded, total, url);

    this.initUIListeners();
  }

  public async start(): Promise<void> {
    console.log('[Game] Initializing 3D Magic Academy Vertical Slice...');
    this.mainMenu.setStartupLoadingStatus('Preparando la música y el primer cuadro de la introducción…');
    const musicPreparation = this.audioManager.prepareMusic().then(() => true, (error: unknown) => {
      console.warn('[Game] Could not prepare Wukong music before the intro:', error);
      return false;
    });
    const introVideoPreparation = this.mainMenu.prepareIntroVideo().then(() => true, (error: unknown) => {
      console.error('[Game] Intro video could not be decoded:', error);
      return false;
    });

    // Start drawing and launch the cinematic as soon as its own media is ready.
    // Waiting for all gameplay clips, the level and shader compilation here
    // previously kept the blue backdrop onscreen during the whole preparation.
    this.lastFrameTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
    const [musicReady, videoReady] = await Promise.all([musicPreparation, introVideoPreparation]);
    if (musicReady && videoReady) {
      // Present the intro's first frame before the heavier model and animation
      // downloads start. On cold Chrome sessions those FBX requests could starve
      // the 16 MB intro video while every resource competed for network capacity.
      await this.mainMenu.playIntro();
    } else {
      const message = !videoReady
        ? 'No se pudo preparar el v?deo de intro. Comprueba la conexi?n y vuelve a intentarlo.'
        : 'No se pudo preparar la m?sica de la aventura. Comprueba la conexi?n y vuelve a intentarlo.';
      this.mainMenu.showLoadingError(message, () => void this.retryIntroMedia());
    }

    // 1. Load Player Model (GLB or Procedural Fallback)
    const playerData = await this.assetManager.loadPlayerModel();
    this.sceneManager.scene.add(playerData.model);

    // 2. Setup AnimationController & PlayerController
    this.animationController = new AnimationController(playerData.model, playerData.clips);
    this.player = new PlayerController(playerData.model as THREE.Group, this.animationController);
    this.player.isControlsLocked = true;
    this.player.isMovementLocked = true;
    this.inputManager.canInteract = () => this.canUseGameplayActions();
    this.inputManager.canAttack = () => this.canUseGameplayActions();

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

    await this.level01.init();

    // Focus camera on target AFTER the level is initialized and player is spawned at Checkpoint 0!
    this.cameraController.setTarget(this.player.mesh);

    // Pre-compile WebGL shaders & pipeline into GPU memory to eliminate runtime shader compilation stutter
    const backStaffWasVisible = this.player.staffBackMesh?.visible ?? false;
    const handStaffWasVisible = this.player.staffHandMesh?.visible ?? false;
    try {
      // The sockets are normally hidden until pickup. Compile their shared
      // materials before the player can interact with the chest.
      if (this.player.staffBackMesh) this.player.staffBackMesh.visible = true;
      if (this.player.staffHandMesh) this.player.staffHandMesh.visible = true;
      this.sceneManager.renderer.compile(this.sceneManager.scene, this.sceneManager.camera);
      console.log('[Game] ✅ Pre-compiled all WebGL shaders and materials into GPU memory.');
    } catch (e) {
      console.warn('[Game] Shader precompilation warning:', e);
    } finally {
      if (this.player.staffBackMesh) this.player.staffBackMesh.visible = backStaffWasVisible;
      if (this.player.staffHandMesh) this.player.staffHandMesh.visible = handStaffWasVisible;
    }

    // 6. Bind Player & HUD Status Callbacks
    this.player.onHealthChange = (hp, maxHp) => this.hud.setHealth(hp, maxHp);
    this.hud.mobileControls = new MobileTouchControls(this.inputManager);
    this.hud.equipmentViewer = new EquipmentViewer(this.player);

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
      if (!this.canUseGameplayActions()) return;

      if (!this.player.isArmed()) {
        // Unarmed: Execute martial arts kick attack
        this.inputManager.onKick?.();
        return;
      }

      // Armed with staff: Execute sacred bo staff attack swing
      this.player.isAttacking = true;
      
      // Align player character rotation towards camera forward / target direction when starting attack
      const rawDir = this.cameraController.getForwardVector();
      const targetRot = Math.atan2(rawDir.x, rawDir.z);
      this.player.mesh.rotation.y = targetRot;

      // Switch weapon socket: Back -> Hand
      this.player.attachStaffToHand();
      this.player.triggerAttackAura();
      
      // Play atack_wood (atack_wood.glb) animation.
      this.animationController.playAtackWood(
        // OnCastAtMarker callback — exact moment of physical staff swing impact
        () => {
          this.audioManager.playAttackGrunt(); // Energetic hero strike shout & impact
          const playerPos = this.player.mesh.position;
          const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.player.mesh.quaternion);

          // 1. Physical Melee Hit Test against Enemies (within 3.0m in front cone)
          this.level01.enemies.forEach(enemy => {
            if (enemy.isAlive() && enemy.isBossVulnerable) {
              const enemyPos = enemy.getPosition();
              const dist = playerPos.distanceTo(enemyPos);
              const maxHitDist = enemy.id === 'crab_boss' ? 5.2 : 3.0;
              if (dist < maxHitDist) {
                const toEnemy = enemyPos.clone().sub(playerPos);
                toEnemy.y = 0;
                if (toEnemy.lengthSq() > 0.0001) toEnemy.normalize();
                else toEnemy.copy(forwardDir);
                const dot = forwardDir.dot(toEnemy);
                if (dot > 0.15 || dist < 1.8 || enemy.id === 'crab_boss') {
                  console.log(`[Game] Physical Staff Hit on '${enemy.id}'!`);
                  try {
                    enemy.takeHit(playerPos, 1);
                    this.audioManager.playHitImpact();
                    this.spellSystem.createImpactParticles(enemyPos.clone().add(new THREE.Vector3(0, 0.5, 0)), 0xffd700);
                  } catch (err) {
                    console.warn('[Game] Error taking hit on enemy:', err);
                  }
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
        // OnComplete callback — animation finished, return staff to back cleanly and fade aura off
        () => {
          this.player.attachStaffToBack();
          this.player.stopAttackAura();
          this.player.isAttacking = false;
        }
      );
    };

    this.inputManager.onKick = () => {
      console.log('[Game] onKick callback triggered. HasStaff:', this.player.hasStaff, 'isControlsLocked:', this.player.isControlsLocked, 'isAttacking:', this.player.isAttacking);
      if (this.canUseGameplayActions()) {
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
              if (enemy.isAlive() && enemy.isBossVulnerable) {
                const enemyPos = enemy.getPosition();
                const dist = playerPos.distanceTo(enemyPos);
                const maxHitDist = enemy.id === 'crab_boss' ? 5.2 : 2.6;
                if (dist < maxHitDist) {
                  const dirToEnemy = enemyPos.clone().sub(playerPos);
                  dirToEnemy.y = 0;
                  if (dirToEnemy.lengthSq() > 0.0001) {
                    dirToEnemy.normalize();
                  } else {
                    dirToEnemy.copy(forwardDir);
                  }
                  const dot = forwardDir.dot(dirToEnemy);
                  if (dot > 0.20 || dist < 1.8 || enemy.id === 'crab_boss') {
                    try {
                      enemy.takeHit(playerPos, 1);
                      this.audioManager.playHitImpact();
                      this.spellSystem.createImpactParticles(enemyPos.clone().add(new THREE.Vector3(0, 0.5, 0)), 0xffa500);
                    } catch (err) {
                      console.warn('[Game] Error taking hit on enemy:', err);
                    }
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
      if (this.menuState !== 'Playing') return;
      if (this.level01?.stateFlags?.levelCompleted) return; // Don't pause if dead/won
      
      this.isPaused = !isLocked;
      const pauseScreen = document.getElementById('pause-screen');
      if (this.isPaused) {
        pauseScreen?.classList.remove('hidden');
      } else {
        pauseScreen?.classList.add('hidden');
      }
    };

    this.mainMenu.setGameplayReady(true);
  }

  private initUIListeners(): void {
    const btnReplay = document.getElementById('btn-replay');
    const btnContinue = document.getElementById('btn-victory-continue');
    const btnResume = document.getElementById('btn-resume');
    this.inputManager.onPauseToggle = () => {
      if (this.menuState === 'Playing') this.togglePause();
    };

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

    const btnResumeEquip = document.getElementById('btn-resume-equip');
    btnResumeEquip?.addEventListener('click', () => {
      this.audioManager.resume();
      this.togglePause(false);
    });
    btnResumeEquip?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.audioManager.resume();
      this.togglePause(false);
    }, { passive: false });
  }

  private beginGameplay(mode: StartMode): void {
    this.audioManager.resume();
    this.audioManager.startGameplayMusic();
    this.inputManager.resetInputs();

    if (mode === 'continue') {
      this.loadGame();
    } else {
      this.player.mesh.position.set(0, 0.2, 10);
      this.player.mesh.rotation.set(0, Math.PI, 0);
      this.player.velocity.set(0, 0, 0);
    }

    this.level01.stateFlags.introCompleted = true;
    this.player.isAttacking = false;
    this.player.isMovementLocked = false;
    this.player.isControlsLocked = false;
    this.player.forceIdle();
    this.cameraController.setTarget(this.player.mesh);
    this.cameraController.snapBehindTarget();
    this.isPaused = false;
    document.getElementById('pause-screen')?.classList.add('hidden');
    this.hud.showGameplayHUD();
    // Grass is downloaded and instanced after the first playable frame, in
    // small sector batches, so it cannot hold the menu or transition hostage.
    void this.level01.loadGrassInBackground();
  }

  private async retryIntroMedia(): Promise<void> {
    try {
      await this.audioManager.prepareMusic();
      await this.mainMenu.prepareIntroVideo();
      await this.mainMenu.playIntro(true);
    } catch (error) {
      console.error('[Game] Intro media retry failed:', error);
      this.mainMenu.showLoadingError('El vídeo o la música todavía no están disponibles. Inténtalo de nuevo.', () => void this.retryIntroMedia());
    }
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

  public showStartupError(error: unknown): void {
    console.error('[Game] Startup failed:', error);
    this.mainMenu.showLoadingError('No se pudo preparar la aventura. Comprueba los recursos y vuelve a intentarlo.');
  }

  private loop(currentTime: number): void {
    // Limit movement and collision updates after a slow mobile frame; a 100 ms
    // step moves Wukong almost a meter at sprint speed and looks like teleporting.
    const elapsed = Math.max(0, (currentTime - this.lastFrameTime) / 1000);
    const delta = Math.min(1 / 30, elapsed);
    // Keep animation playback on real elapsed time while movement/physics use
    // the bounded step above; otherwise the full pickup clip can take many
    // tens of seconds on a throttled device and outlive its timeline.
    const animationDelta = Math.min(0.5, elapsed);
    this.lastFrameTime = currentTime;
    this.hud.mobileControls?.setGameplayEnabled(this.menuState === 'Playing' && !this.isPaused);

    if (!this.isPaused) {
      this.update(delta, animationDelta);
    }
    // HTML video owns the Loading, Intro, MenuIdle and StartingGame screens.
    // Redrawing an empty/covered WebGL scene at 60 Hz competes with video
    // decoding on phones; render continuously only after gameplay begins.
    if (this.menuState === 'Playing') this.sceneManager.render();

    // Calculate FPS
    this.frameCount++;
    if (currentTime - this.lastFpsCalcTime >= 1000) {
      this.currentFps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsCalcTime = currentTime;
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  private update(delta: number, animationDelta: number): void {
    if (this.menuState !== 'Playing') return;
    this.inputManager.beginFrame();
    // Update Game Components
    if (this.cinematicCamera.isActive()) {
      this.cinematicCamera.update(delta);
      // Still update player animations during cinematics
      this.player.update(delta, this.inputManager, this.cameraController, animationDelta);
    } else {
      this.player.update(delta, this.inputManager, this.cameraController, animationDelta);
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

  private canUseGameplayActions(): boolean {
    return this.menuState === 'Playing' && !this.isPaused && !!this.player &&
      !this.player.isControlsLocked && !this.player.isMovementLocked && !this.player.isAttacking;
  }

  public saveGame(): void {
    const saveData = {
      version: 2,
      levelId: 'magic-academy-3d',
      playerPos: { x: this.player.mesh.position.x, y: this.player.mesh.position.y, z: this.player.mesh.position.z },
      playerRotY: this.player.mesh.rotation.y,
      health: this.player.health,
      maxHealth: this.player.maxHealth,
      mana: this.player.mana,
      maxMana: this.player.maxMana,
      hasStaff: this.player.hasStaff,
      staffEquipped: this.player.staffEquipped,
      coinsCount: this.collectibleSystem.coinCount,
      gekkoMissionState: this.level01.gekkoMissionState,
      checkpointId: this.checkpointManager.getCurrentCheckpointId(),
      collectedKeys: this.level01.collectedKeys,
      totalKeysCount: this.level01.totalKeysCount,
      curiosityHatchOpen: this.level01.isLavaVaultOpen,
      curiosityChestOpen: this.level01.curiosityChestOpen,
      stateFlags: {
        staffFound: this.level01.stateFlags.staffFound,
        gekkoTalked: this.level01.stateFlags.gekkoTalked,
        bossCinematicPlayed: this.level01.stateFlags.bossCinematicPlayed,
        bossDefeated: this.level01.stateFlags.bossDefeated
      },
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
      if (data.version !== undefined && data.version !== 1 && data.version !== 2) throw new Error('Versión de partida no compatible.');
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
        // Old saves only had hasStaff; treat that as equipped so continuing
        // a collected-staff save restores both the weapon mode and back socket.
        this.player.obtainWeapon('STAFF', data.staffEquipped !== false);
        if (data.staffEquipped === false) this.player.unequipStaff();
      }
      if (data.coinsCount !== undefined) {
        this.collectibleSystem.coinCount = data.coinsCount;
        this.hud.setCoinCount(this.collectibleSystem.coinCount);
      }
      if (data.gekkoMissionState) {
        this.level01.gekkoMissionState = data.gekkoMissionState;
      }
      if (typeof data.checkpointId === 'number') this.checkpointManager.setActiveCheckpoint(data.checkpointId);
      if (data.collectedKeys && typeof data.collectedKeys === 'object') {
        const migratedKeys = { ...data.collectedKeys };
        if (migratedKeys.key4_gargoyles === true) migratedKeys.key6_gargoyles = true;
        delete migratedKeys.key4_gargoyles;
        Object.assign(this.level01.collectedKeys, migratedKeys);
        this.level01.totalKeysCount = Number(data.totalKeysCount) || 0;
        this.hud.setKeyCount(this.level01.totalKeysCount);
      }
      if (data.stateFlags && typeof data.stateFlags === 'object') {
        Object.assign(this.level01.stateFlags, data.stateFlags);
      }
      this.level01.restoreStaffChest();
      this.level01.restoreCuriosityPuzzle(
        data.curiosityHatchOpen === true || (data.version === 1 && (Number(data.totalKeysCount) || 0) >= 3),
        data.curiosityChestOpen === true,
        data.version === 1 && (Number(data.totalKeysCount) || 0) >= 3
      );
      // Older saves only recorded that the intro cinematic had played. Allow
      // that encounter to be attempted again unless its victory was saved.
      this.level01.stateFlags.bossDefeated = data.stateFlags?.bossDefeated === true;
      this.level01.stateFlags.bossCinematicPlayed = this.level01.stateFlags.bossDefeated;
      this.level01.restoreBossDefeated();
      this.level01.stateFlags.introCompleted = true;
      this.subtitleSystem.show('Cargado', '¡Partida cargada exitosamente!');
      console.log('[SaveSystem] Game loaded:', data);
    } catch (e) {
      console.error('[SaveSystem] Error loading savegame:', e);
    }
  }
}
