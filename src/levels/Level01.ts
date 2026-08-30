import * as THREE from 'three';
import { SceneManager } from '../core/SceneManager';
import { CameraController } from '../camera/CameraController';
import { PlayerController } from '../player/PlayerController';
import { InputManager } from '../core/InputManager';
import { TextureGenerator } from '../world/TextureGenerator';
import { Door } from '../world/Door';
import { DestructiblePot } from '../world/DestructiblePot';
import { TreasureChest } from '../world/TreasureChest';
import { LumosGargoyle } from '../world/LumosGargoyle';
import { SpellTarget } from '../spells/SpellTarget';
import { SpellSystem } from '../spells/SpellSystem';
import { CheckpointManager } from '../world/CheckpointManager';
import { CollectibleSystem } from '../collectibles/CollectibleSystem';
import { TriggerZone } from '../interaction/TriggerZone';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ChestCinematic } from './ChestCinematic';

import { SubtitleSystem } from '../ui/SubtitleSystem';
import { AudioManager } from '../core/AudioManager';
import { EnemyController } from '../enemies/EnemyController';
import { GekkoNPC } from '../npc/GekkoNPC';

export class Level01 {
  private sceneManager: SceneManager;
  private cameraController: CameraController;
  private player: PlayerController;
  private inputManager: InputManager;
  private spellSystem: SpellSystem;
  private checkpointManager: CheckpointManager;
  private collectibleSystem: CollectibleSystem;
  private subtitleSystem: SubtitleSystem;
  private audioManager: AudioManager;

  public levelColliders: THREE.Object3D[] = [];
  public triggerZones: TriggerZone[] = [];
  public doors: Door[] = [];
  public pots: DestructiblePot[] = [];
  public chests: TreasureChest[] = [];
  public enemies: EnemyController[] = [];
  public gargoyles: LumosGargoyle[] = [];

  // Important Level Entities
  private staffChest!: TreasureChest;
  private doorToZone3!: Door;
  public exitDoor!: Door;

  public stateFlags = {
    introCompleted: false,
    staffFound: false,
    zone3Unlocked: false,
    gekkoTalked: false,
    levelCompleted: false
  };

  private crabsDefeated = 0;
  private gekkoNPC!: GekkoNPC;
  private floatingCoinMesh!: THREE.Group;

  constructor(
    sceneManager: SceneManager,
    cameraController: CameraController,
    player: PlayerController,
    inputManager: InputManager,
    spellSystem: SpellSystem,
    checkpointManager: CheckpointManager,
    collectibleSystem: CollectibleSystem,
    subtitleSystem: SubtitleSystem,
    audioManager: AudioManager
  ) {
    this.sceneManager = sceneManager;
    this.cameraController = cameraController;
    this.player = player;
    this.inputManager = inputManager;
    this.spellSystem = spellSystem;
    this.checkpointManager = checkpointManager;
    this.collectibleSystem = collectibleSystem;
    this.subtitleSystem = subtitleSystem;
    this.audioManager = audioManager;
  }

  public init(): void {
    this.buildCastleGreybox();
    this.setupCheckpoints();
    this.setupInteractiveProps();
    this.setupCollectibles();
    this.setupEnemies();
    this.setupNPCs();
    this.setupTriggers();
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.sceneManager.scene.add(ambientLight);
    
    this.checkpointManager.respawnPlayer(this.player);
  }

  private buildCastleGreybox(): void {
    const scene = this.sceneManager.scene;

    const stoneTex = TextureGenerator.createStoneWallTexture();
    stoneTex.repeat.set(2, 6);
    const checkerTex = TextureGenerator.createAncientRuinedFlagstonesTexture();
    checkerTex.repeat.set(4, 15);

    const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.7 });
    const floorMat = new THREE.MeshStandardMaterial({ map: checkerTex, roughness: 0.3 });

    // Zone 1: Entrance Corridor (0 to -20)
    const z1Floor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 20), floorMat);
    z1Floor.position.set(0, -0.2, -10);
    scene.add(z1Floor);
    this.levelColliders.push(z1Floor);

    const z1WallL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 20), stoneMat);
    z1WallL.position.set(-4.2, 3, -10);
    const z1WallR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 20), stoneMat);
    z1WallR.position.set(4.2, 3, -10);
    scene.add(z1WallL, z1WallR);
    this.levelColliders.push(z1WallL, z1WallR);

    // Zone 2: Chest Room (-20 to -40)
    const z2Floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 20), stoneMat);
    z2Floor.position.set(0, -0.2, -30);
    scene.add(z2Floor);
    this.levelColliders.push(z2Floor);

    const z2WallL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 20), stoneMat);
    z2WallL.position.set(-8.2, 3, -30);
    const z2WallR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 20), stoneMat);
    z2WallR.position.set(8.2, 3, -30);
    scene.add(z2WallL, z2WallR);
    this.levelColliders.push(z2WallL, z2WallR);

    this.doorToZone3 = new Door('door_zone3', new THREE.Vector3(0, 0, -40), 0, true);
    scene.add(this.doorToZone3.mesh);
    this.doors.push(this.doorToZone3);
    this.levelColliders.push(this.doorToZone3.mesh);

    // Zone 3: First Corridor (-40 to -70)
    const z3Floor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 30), floorMat);
    z3Floor.position.set(0, -0.2, -55);
    scene.add(z3Floor);
    this.levelColliders.push(z3Floor);

    // Zone 4: Great Hall (Platforms) (-70 to -110)
    const z4Floor = new THREE.Mesh(new THREE.BoxGeometry(24, 0.4, 40), stoneMat);
    z4Floor.position.set(0, -0.2, -90);
    scene.add(z4Floor);
    this.levelColliders.push(z4Floor);

    // Zone 5: Final Arena (-110 to -140)
    const z5Floor = new THREE.Mesh(new THREE.BoxGeometry(20, 0.4, 30), floorMat);
    z5Floor.position.set(0, -0.2, -125);
    scene.add(z5Floor);
    this.levelColliders.push(z5Floor);

    this.exitDoor = new Door('door_exit', new THREE.Vector3(0, 0, -140), 0, true);
    scene.add(this.exitDoor.mesh);
    this.doors.push(this.exitDoor);
    this.levelColliders.push(this.exitDoor.mesh);

    // Add backwall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(20, 6, 0.4), stoneMat);
    backWall.position.set(0, 3, 0);
    scene.add(backWall);
    this.levelColliders.push(backWall);

    this.cameraController.setCollisionObjects(this.levelColliders);
    this.player.setColliders(this.levelColliders);
  }

  private setupCheckpoints(): void {
    this.checkpointManager.addCheckpoint(0, new THREE.Vector3(0, 0.2, -2), 0);
    this.checkpointManager.addCheckpoint(1, new THREE.Vector3(0, 0.2, -22), 0); // Chest room
    this.checkpointManager.addCheckpoint(2, new THREE.Vector3(0, 0.2, -42), 0); // Corridor
    this.checkpointManager.addCheckpoint(3, new THREE.Vector3(0, 0.2, -75), 0); // Great hall
    this.checkpointManager.addCheckpoint(4, new THREE.Vector3(0, 0.2, -112), 0); // Final arena
  }

  private setupInteractiveProps(): void {
    const scene = this.sceneManager.scene;

    // Destructible Pots
    const potPositions = [
      new THREE.Vector3(-3, 0, -15),
      new THREE.Vector3(3, 0, -15),
      new THREE.Vector3(-6, 0, -35),
      new THREE.Vector3(6, 0, -35),
      new THREE.Vector3(-3.5, 0, -28.5), // Pot for Gekko
      new THREE.Vector3(0, 0, -50),
      new THREE.Vector3(-10, 0, -90),
      new THREE.Vector3(10, 0, -90)
    ];

    potPositions.forEach(pos => {
      const pot = new DestructiblePot(pos, scene);
      this.pots.push(pot);
      this.spellSystem.registerPot(pot);
      this.levelColliders.push(pot.mesh);
    });

    // The Staff Chest in Zone 2
    this.staffChest = new TreasureChest(new THREE.Vector3(0, 0, -35), Math.PI);
    scene.add(this.staffChest.mesh);
    this.chests.push(this.staffChest);
    this.spellSystem.registerChest(this.staffChest);
    this.levelColliders.push(this.staffChest.mesh);

    // Target to open door 3
    const doorTarget = new SpellTarget('target_door3', new THREE.Vector3(0, 3, -39.5), false);
    doorTarget.onActivate = () => {
      if (!this.stateFlags.zone3Unlocked) {
        this.stateFlags.zone3Unlocked = true;
        this.doorToZone3.open();
        this.subtitleSystem.show('LISAR', '¡La puerta se ha abierto!');
      }
    };
    this.spellSystem.registerTarget(doorTarget);
  }

  private setupCollectibles(): void {
    // Cards (3)
    this.collectibleSystem.spawnCard('card_1', new THREE.Vector3(7, 0.5, -38));
    this.collectibleSystem.spawnCard('card_2', new THREE.Vector3(-11, 0.5, -95));
    this.collectibleSystem.spawnCard('card_3', new THREE.Vector3(9, 0.5, -135));
  }

  private createSparks(pos: THREE.Vector3): void {
    const geom = new THREE.BufferGeometry();
    const count = 12;
    const positions = new Float32Array(count * 3);
    const velocities: number[] = [];
    for(let i=0; i<count; i++) {
      positions[i*3] = pos.x + (Math.random() - 0.5)*0.5;
      positions[i*3+1] = pos.y + Math.random()*0.5;
      positions[i*3+2] = pos.z + (Math.random() - 0.5)*0.5;
      velocities.push(
        (Math.random() - 0.5) * 2,
        Math.random() * 2 + 1,
        (Math.random() - 0.5) * 2
      );
    }
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffd700, size: 0.1, transparent: true });
    const points = new THREE.Points(geom, mat);
    this.sceneManager.scene.add(points);
    
    let age = 0;
    const animate = () => {
      age += 0.016;
      if (age > 0.5) {
        this.sceneManager.scene.remove(points);
        geom.dispose();
        mat.dispose();
        return;
      }
      const p = geom.attributes.position.array as Float32Array;
      for(let i=0; i<count; i++) {
        p[i*3] += velocities[i*3] * 0.016;
        p[i*3+1] += velocities[i*3+1] * 0.016;
        p[i*3+2] += velocities[i*3+2] * 0.016;
        velocities[i*3+1] -= 9.8 * 0.016; // gravity
      }
      geom.attributes.position.needsUpdate = true;
      mat.opacity = 1 - (age / 0.5);
      requestAnimationFrame(animate);
    };
    animate();
  }

  private spawnAllCoins(): void {
    const coinPositions = [
      new THREE.Vector3(-1.5, 0.5, -20),
      new THREE.Vector3(1.5, 0.5, -20),
      new THREE.Vector3(0, 0.5, -22),
      new THREE.Vector3(-2, 0.5, -25),
      new THREE.Vector3(2, 0.5, -25),
      new THREE.Vector3(-1, 0.5, -28),
      new THREE.Vector3(1, 0.5, -28),
      new THREE.Vector3(-3, 0.5, -31),
      new THREE.Vector3(3, 0.5, -31),
      new THREE.Vector3(0, 0.5, -34),
      
      // Corridor to Great Hall
      new THREE.Vector3(0, 0.5, -45),
      new THREE.Vector3(-2, 0.5, -50),
      new THREE.Vector3(2, 0.5, -55),
      new THREE.Vector3(0, 0.5, -60),
      new THREE.Vector3(-2, 0.5, -65),
      new THREE.Vector3(2, 0.5, -70),
      
      // Great Hall scattered
      new THREE.Vector3(-8, 0.5, -75),
      new THREE.Vector3(8, 0.5, -75),
      new THREE.Vector3(-6, 0.5, -80),
      new THREE.Vector3(6, 0.5, -80),
      new THREE.Vector3(-10, 0.5, -85),
      new THREE.Vector3(10, 0.5, -85),
      new THREE.Vector3(-4, 0.5, -90),
      new THREE.Vector3(4, 0.5, -90),
      
      // Leading to exit
      new THREE.Vector3(0, 0.5, -100),
      new THREE.Vector3(-3, 0.5, -110),
      new THREE.Vector3(3, 0.5, -115),
      new THREE.Vector3(-2, 0.5, -120),
      new THREE.Vector3(2, 0.5, -125),
      new THREE.Vector3(0, 0.5, -130),
      new THREE.Vector3(-1.5, 0.5, -135),
      new THREE.Vector3(1.5, 0.5, -135),
      new THREE.Vector3(0, 0.5, -138)
    ];

    let index = 0;
    const spawnNext = () => {
        if (index >= coinPositions.length) return;
        const pos = coinPositions[index];
        this.createSparks(pos);
        this.collectibleSystem.spawnCoin(`coin_${index}`, pos);
        
        // Play harmonic spawn sound
        this.audioManager.playCoinSpawnHarmonic(index);

        index++;
        setTimeout(spawnNext, 120); // 120ms between spawns
    };

    spawnNext();
  }

  private setupNPCs(): void {
    // Instantiate Gekko
    // Rotate 180 degrees from before so he faces the player, not giving his back
    this.gekkoNPC = new GekkoNPC(new THREE.Vector3(-1.5, 0, -28.5), -Math.PI * 0.75);
    this.gekkoNPC.loadModels();
    this.sceneManager.scene.add(this.gekkoNPC.mesh);

    // Add Gekko's collider so player doesn't walk through him
    const gekkoCollider = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2), new THREE.MeshBasicMaterial({visible: false}));
    gekkoCollider.position.copy(this.gekkoNPC.mesh.position);
    this.sceneManager.scene.add(gekkoCollider);
    this.levelColliders.push(gekkoCollider);

    // Setup floating coin for dialogue (above the pot)
    this.floatingCoinMesh = new THREE.Group();
    this.floatingCoinMesh.position.set(-3.5, 1.2, -28.5); 
    this.floatingCoinMesh.scale.set(0.6, 0.6, 0.6); // Escala más pequeña según referencia

    this.floatingCoinMesh.visible = false;
    this.sceneManager.scene.add(this.floatingCoinMesh);

    const loader = new GLTFLoader();
    loader.load(
      import.meta.env.BASE_URL + 'assets/collectibles/lisar coin.glb?v=7',
      (gltf) => { 
        this.floatingCoinMesh.add(gltf.scene.clone()); 
        // Pasamos el modelo al sistema de coleccionables para que todas las monedas usen este modelo
        this.collectibleSystem.coinTemplate = gltf.scene;
      },
      undefined,
      (err) => { console.warn("Failed to load LISAR coin model", err); }
    );
  }

  private setupEnemies(): void {
    // Zone 3: 1 Crab
    const crab1 = new EnemyController('crab_1', new THREE.Vector3(0, 0, -60), [
      new THREE.Vector3(-2, 0, -60), new THREE.Vector3(2, 0, -60)
    ]);
    // Zone 4: 2 Crabs
    const crab2 = new EnemyController('crab_2', new THREE.Vector3(-5, 0, -85));
    const crab3 = new EnemyController('crab_3', new THREE.Vector3(5, 0, -95));
    // Zone 5: 3 Crabs (Arena)
    const crab4 = new EnemyController('crab_4', new THREE.Vector3(0, 0, -120));
    const crab5 = new EnemyController('crab_5', new THREE.Vector3(-6, 0, -125));
    const crab6 = new EnemyController('crab_6', new THREE.Vector3(6, 0, -125));

    this.enemies.push(crab1, crab2, crab3, crab4, crab5, crab6);

    this.enemies.forEach(e => {
      e.loadModel();
      this.sceneManager.scene.add(e.mesh);
      this.spellSystem.registerEnemy(e);

      e.onAttackPlayer = (dmg) => {
        const cp = this.checkpointManager.getActiveCheckpointPosition();
        this.player.takeDamage(dmg, cp);
        this.audioManager.playPlayerHurt();
        const hud = (window as any).gameInstance?.hud;
        if (hud) hud.triggerDamageFlash();
      };

      e.onDeath = () => {
        this.crabsDefeated++;
        if (this.crabsDefeated >= 6) {
          this.exitDoor.open();
          this.subtitleSystem.show('LISAR', '¡La puerta de salida está abierta!');
        }
      };
    });
  }
  private setupTriggers(): void {
    const tIntro = new TriggerZone('trig_intro', new THREE.Vector3(-5, -1, -5), new THREE.Vector3(5, 5, 2), () => {
      if (!this.stateFlags.introCompleted) {
        this.stateFlags.introCompleted = true;
        this.subtitleSystem.show('Sistema', 'Avanza y encuentra tu báculo mágico en el cofre');
        (window as any).gameInstance?.hud.setObjective('Encuentra el báculo en el cofre');
      }
    });
    this.triggerZones.push(tIntro);

    // Contact trigger (tight box around Gekko and the Pot)
    const tGekko = new TriggerZone('trig_gekko', new THREE.Vector3(-4.5, -1, -30.0), new THREE.Vector3(0.5, 5, -27.0), async () => {
      if (!this.stateFlags.gekkoTalked) {
        this.stateFlags.gekkoTalked = true;
        
        const cinematicCamera = (window as any).gameInstance?.cinematicCamera;
        const hud = (window as any).gameInstance?.hud;

        if (cinematicCamera && hud) {
          // 1. Fade out to start the cinematic
          await hud.fadeScreenOut(500);

          // Lock controls completely so physics/input don't override the forced pose
          this.player.isControlsLocked = true;
          this.player.isMovementLocked = true;

          // Position Player at the left, facing Gekko (right)
          this.player.mesh.position.set(-2.5, 0, -27.5);
          this.player.mesh.rotation.set(0, Math.PI * 0.5, 0);
          this.player.forceIdle();
          
          // Position Gekko at the right, facing Player (left)
          this.gekkoNPC.mesh.position.set(-0.5, 0, -27.5);
          this.gekkoNPC.mesh.rotation.set(0, -Math.PI * 0.5, 0);
          this.gekkoNPC.setTalking(true);

          // Floating coin in the center between them
          this.floatingCoinMesh.position.set(-1.5, 1.4, -27.5);
          this.floatingCoinMesh.visible = true;

          this.subtitleSystem.hide();

          // Snap camera immediately to show both characters side-by-side
          const endPos = new THREE.Vector3(-1.5, 1.2, -24.5); 
          const endLookAt = new THREE.Vector3(-1.5, 1.0, -27.5); 
          cinematicCamera.moveCamera(endPos, endPos, endLookAt, endLookAt, 999.0);

          // 2. Fade back in
          await hud.fadeScreenIn(500);

          let cinematicSkipped = false;

          const finishCinematic = async () => {
            if (cinematicSkipped) return;
            cinematicSkipped = true;
            window.removeEventListener('keydown', skipHandler);
            hud.hideDialogue();
            
            // Fade out
            await hud.fadeScreenOut(500);
            
            // Revert characters and camera silently
            cinematicCamera.abort();
            this.player.isControlsLocked = false;
            this.player.isMovementLocked = false;
            
            this.gekkoNPC.setTalking(false);
            this.gekkoNPC.mesh.position.set(-1.5, 0, -28.5);
            this.gekkoNPC.mesh.rotation.set(0, -Math.PI * 0.75, 0);
            this.floatingCoinMesh.visible = false;
            
            // Fade back in
            await hud.fadeScreenIn(500);

            // Spawn coins
            this.spawnAllCoins();
          };

          const skipHandler = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
              finishCinematic();
            }
          };
          window.addEventListener('keydown', skipHandler);

          // 3. Show dialogue
          if (!cinematicSkipped) {
            hud.showTypewriterDialogue('Gekko', '¡Hola! Necesito que recolectes 33 monedas LISAR para darte una recompensa muy especial. ¡Están por todo el mapa!', () => {
              if (cinematicSkipped) return;
              setTimeout(() => {
                if (cinematicSkipped) return;
                finishCinematic();
              }, 4000);
            });
          }
        }
      }
    });
    this.triggerZones.push(tGekko);

    const tExit = new TriggerZone('trig_exit', new THREE.Vector3(-5, -1, -142), new THREE.Vector3(5, 5, -138), () => {
      if (!this.stateFlags.levelCompleted && this.exitDoor.isOpen) {
        this.stateFlags.levelCompleted = true;
        (window as any).gameInstance?.hud.showVictoryScreen(this.collectibleSystem.collectedCount, "05:00");
        document.exitPointerLock();
      }
    });
    this.triggerZones.push(tExit);
  }

  public update(delta: number, playerPos: THREE.Vector3): void {
    this.triggerZones.forEach(t => t.check(playerPos));
    this.doors.forEach(d => d.update(delta));
    
    // Update NPC
    if (this.gekkoNPC) {
      this.gekkoNPC.update(delta);
    }
    
    if (this.floatingCoinMesh && this.floatingCoinMesh.visible) {
      this.floatingCoinMesh.rotation.y += delta * 2;
      this.floatingCoinMesh.position.y = 1.5 + Math.sin(Date.now() / 300) * 0.1;
    }

    
    this.enemies.forEach(e => {
      if (e.isAlive()) e.update(delta, playerPos, this.levelColliders);
    });

    this.collectibleSystem.update(
      playerPos,
      delta,
      (cards) => {
        const hud = (window as any).gameInstance?.hud;
        if (hud) hud.setCardCount(cards, 3);
      },
      (coins) => {
        const hud = (window as any).gameInstance?.hud;
        if (hud) hud.setCoinCount(coins);
      }
    );

    // ── Chest Interaction — Staff Pickup ──────────────────────────────────────
    //
    // State machine: CHEST_OPEN → STAFF_VISIBLE → PLAYER_TAKES_STAFF
    //              → FADE_OUT → EQUIP_STAFF → FADE_IN → GAMEPLAY_WITH_STAFF
    //
    if (!this.stateFlags.staffFound && this.staffChest.mesh.position.distanceTo(playerPos) < 2.0) {
      const hud = (window as any).gameInstance?.hud;
      hud?.showInteractionPrompt('Abrir Cofre');

      if (this.inputManager.keys['KeyE'] && !this.staffChest.isUnlocked) {
        // Set flags immediately to prevent double-trigger
        this.stateFlags.staffFound = true;
        this.staffChest.isUnlocked = true;
        hud?.hideInteractionPrompt();

        // Open the chest lid visually (no staff spawn — ChestCinematic handles that)
        this.staffChest.unlock(this.audioManager, this.collectibleSystem, undefined);

        // Run the strict Zelda-style cinematic state machine
        const cinematic = new ChestCinematic({
          scene: this.sceneManager.scene,
          player: this.player,
          chestPosition: this.staffChest.mesh.position.clone(),
          hud: {
            fadeScreenOut: (ms) => hud.fadeScreenOut(ms),
            fadeScreenIn: (ms) => hud.fadeScreenIn(ms),
            setObjective: (text) => hud.setObjective(text),
          },
          onComplete: () => {
            console.log('[Level01] Staff cinematic complete — gameplay resumes with staff.');
          },
        });

        // Fire-and-forget: cinematic manages all state internally
        cinematic.run().catch(err => {
          console.error('[Level01] ChestCinematic error:', err);
          // Safety: always restore movement on error
          this.player.isMovementLocked = false;
        });
      }
    } else {
      (window as any).gameInstance?.hud?.hideInteractionPrompt();
    }
  }
}
