import * as THREE from 'three';
import { InputManager } from '../core/InputManager';
import { CameraController } from '../camera/CameraController';
import { AnimationController } from './AnimationController';
import { WandEffect } from '../spells/WandEffect';
import { ItemPickupVFX } from './ItemPickupVFX';
import { StaffFactory } from './StaffFactory';
import { AttackAuraEffect } from './AttackAuraEffect';

export const PLAYER_NAME = 'LISAR';

export class PlayerController {
  public mesh: THREE.Group;
  public animationController: AnimationController;
  public wandEffect: WandEffect;
  public attackAura: AttackAuraEffect;

  public velocity = new THREE.Vector3();
  public isGrounded = true;
  public moveSpeed = 5.2;
  public runSpeed = 8.5;
  public jumpForce = 8.0;
  public gravity = -20.0;

  public health = 100;
  public maxHealth = 100;
  public mana = 100;
  public maxMana = 100;
  public manaRegenRate = 12.0; // Mana per second

  public isControlsLocked = false;
  public isMovementLocked = false;
  private groundRaycaster = new THREE.Raycaster();
  private colliders: THREE.Object3D[] = [];

  public onHealthChange?: (hp: number, maxHp: number) => void;
  public onManaChange?: (mp: number, maxMp: number) => void;

  public hasStaff = false;
  public jumpCount = 0;
  public doubleJumpSpinTimer = 0;
  public isAttacking = false;
  
  public visualModel: THREE.Object3D;
  private defaultVisualRotationX = 0;

  constructor(modelOrGroup: THREE.Group, animationController: AnimationController) {
    this.mesh = modelOrGroup;
    // The AssetManager returns a Group containing the actual playerModel as its first child
    this.visualModel = this.mesh.children.find(c => c.type === 'Group') || this.mesh.children[0] || this.mesh;
    this.defaultVisualRotationX = this.visualModel.rotation.x;
    
    this.animationController = animationController;
    this.mesh.position.set(0, 0, 0);

    // Create the WandEffect glow (light + particles).
    this.wandEffect = new WandEffect();

    // Create smooth attack energy aura (active ONLY during atack_wood)
    this.attackAura = new AttackAuraEffect();
    this.mesh.add(this.attackAura.mesh);

    // Initialize proportional dual-mount staff system (back mount & hand mount)
    this.initStaffMeshes();
    this.setStaffVisibility(false);
  }

  public staffBackMesh: THREE.Group | null = null;
  public staffHandMesh: THREE.Group | null = null;

  public initStaffMeshes(): void {
    // 1. Permanently hide any embedded Vaculo from player.glb
    const embeddedStaff = this.mesh.getObjectByName('Vaculo');
    if (embeddedStaff) embeddedStaff.visible = false;

    // Remove any existing back/hand staff meshes if re-binding
    if (this.staffBackMesh && this.staffBackMesh.parent) {
      this.staffBackMesh.parent.remove(this.staffBackMesh);
    }
    if (this.staffHandMesh && this.staffHandMesh.parent) {
      this.staffHandMesh.parent.remove(this.staffHandMesh);
    }

    // 2. Find Spine bone for back mounting (targeting Spine2 / Chest upper torso)
    let spineBone: THREE.Object3D | null = null;
    let rightHandBone: THREE.Object3D | null = null;

    this.mesh.traverse((child) => {
      const n = child.name.toLowerCase();
      if ((n.includes('spine2') || n.includes('chest') || n.includes('upperchest')) && !spineBone) {
        spineBone = child;
      }
      if (n.includes('righthand') && !n.includes('thumb') && !n.includes('index') && !n.includes('middle') && !n.includes('ring') && !n.includes('pinky')) {
        rightHandBone = child;
      }
    });

    if (!spineBone) {
      this.mesh.traverse((child) => {
        const n = child.name.toLowerCase();
        if ((n.includes('spine1') || n.includes('spine')) && !spineBone) {
          spineBone = child;
        }
      });
    }

    const spineName = spineBone ? (spineBone as THREE.Object3D).name : 'root';
    const handName = rightHandBone ? (rightHandBone as THREE.Object3D).name : 'root';
    console.log(`[PlayerController] Binding staff sockets — Spine: ${spineName}, RightHand: ${handName}`);

    // 3. Create Staff Back Mesh (slanted diagonally across Wukong's back: lower-left to upper-right [/])
    const backStaff = StaffFactory.createStaff('staff_on_back');
    backStaff.visible = false;
    this.staffBackMesh = backStaff;

    if (spineBone) {
      this.mesh.updateMatrixWorld(true);
      const spineWorldScale = new THREE.Vector3();
      (spineBone as THREE.Object3D).getWorldScale(spineWorldScale);
      const invX = spineWorldScale.x > 0.00001 ? 1.0 / spineWorldScale.x : 1.0;
      const invY = spineWorldScale.y > 0.00001 ? 1.0 / spineWorldScale.y : 1.0;
      const invZ = spineWorldScale.z > 0.00001 ? 1.0 / spineWorldScale.z : 1.0;
      backStaff.scale.set(invX, invY, invZ);

      // Snug against the upper thoracic back, diagonal orientation (/): lower-left waist to upper-right shoulder
      backStaff.position.set(0.02, 0.06, -0.11);
      backStaff.rotation.set(0.08, 0.0, -0.65);
      (spineBone as THREE.Object3D).add(backStaff);
    } else {
      backStaff.position.set(0.02, 1.05, -0.11);
      backStaff.rotation.set(0.08, 0.0, -0.65);
      this.mesh.add(backStaff);
    }

    // 4. Create Staff Hand Mesh (firmly gripped in right hand for attacking)
    const handStaff = StaffFactory.createStaff('staff_in_hand');
    handStaff.visible = false;
    this.staffHandMesh = handStaff;

    if (rightHandBone) {
      this.mesh.updateMatrixWorld(true);
      const handWorldScale = new THREE.Vector3();
      (rightHandBone as THREE.Object3D).getWorldScale(handWorldScale);
      const invX = handWorldScale.x > 0.00001 ? 1.0 / handWorldScale.x : 1.0;
      const invY = handWorldScale.y > 0.00001 ? 1.0 / handWorldScale.y : 1.0;
      const invZ = handWorldScale.z > 0.00001 ? 1.0 / handWorldScale.z : 1.0;
      handStaff.scale.set(invX, invY, invZ);

      handStaff.position.set(0, 0.06, 0);
      handStaff.rotation.set(Math.PI * 0.5, 0, 0);
      (rightHandBone as THREE.Object3D).add(handStaff);
    } else {
      handStaff.position.set(0.4, 1.0, 0.3);
      this.mesh.add(handStaff);
    }
  }

  public setStaffVisibility(visible: boolean): void {
    if (this.staffBackMesh) this.staffBackMesh.visible = visible;
    if (this.staffHandMesh) this.staffHandMesh.visible = false;

    const embeddedStaff = this.mesh.getObjectByName('Vaculo');
    if (embeddedStaff) embeddedStaff.visible = false;

    const attachedStaff = this.mesh.getObjectByName('magic_wand');
    if (attachedStaff) attachedStaff.visible = false;

    // Clean staff on back: NO permanent aura, NO particles, NO constant light
    if (this.wandEffect && this.wandEffect.wandMesh) {
      this.wandEffect.wandMesh.visible = false;
    }
  }

  public equipStaff(scene?: THREE.Scene): void {
    if (this.hasStaff) return;

    console.log('[PlayerController] Playing epic staff pickup animation...');
    if (scene) {
      ItemPickupVFX.playEpicPickup(this, scene, 'staff', () => {
        this.hasStaff = true;
        this.setStaffVisibility(true);
        this.attachStaffToBack();
        console.log('[PlayerController] Staff equipped! Stored on back until attack.');
      });
    } else {
      this.isControlsLocked = true;
      this.velocity.set(0, 0, 0);
      this.animationController.playTakeItemAnimation(() => {
        this.hasStaff = true;
        this.setStaffVisibility(true);
        this.attachStaffToBack();
        this.isControlsLocked = false;
        console.log('[PlayerController] Staff equipped! Stored on back until attack.');
      });
    }
  }

  public useMana(amount: number): boolean {
    if (this.mana >= amount) {
      this.mana = Math.max(0, this.mana - amount);
      this.onManaChange?.(this.mana, this.maxMana);
      return true;
    }
    return false;
  }

  public restoreMana(amount: number): void {
    this.mana = Math.min(this.maxMana, this.mana + amount);
    this.onManaChange?.(this.mana, this.maxMana);
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.onHealthChange?.(this.health, this.maxHealth);
    const hud = (window as any).gameInstance?.hud;
    if (hud) {
      hud.setHealth(this.health, this.maxHealth);
    }
  }

  public isInvulnerable = false;

  public takeDamage(amount: number, respawnPos?: THREE.Vector3): void {
    if (this.isInvulnerable || this.isControlsLocked || this.isMovementLocked) {
      // Immune while performing TakeItem animation or watching cinematics
      return;
    }
    this.health = Math.max(0, this.health - amount);
    this.onHealthChange?.(this.health, this.maxHealth);

    if (this.health <= 0) {
      // Respawn
      this.health = this.maxHealth;
      this.mana = this.maxMana;
      this.onHealthChange?.(this.health, this.maxHealth);
      this.onManaChange?.(this.mana, this.maxMana);

      if (respawnPos) {
        this.mesh.position.copy(respawnPos);
      }
    }
  }

  public setColliders(colliders: THREE.Object3D[]): void {
    this.colliders = colliders;
  }

  public forceIdle(): void {
    // Reset any active one-shot animation locks in the mixer so we don't freeze in rigid pose
    (this.animationController as any).isPlayingOneShot = false;
    this.animationController.playState('Idle', 0.1);
    this.velocity.set(0, 0, 0);
  }

  private wallRaycaster = new THREE.Raycaster();
  private readonly PLAYER_RADIUS = 0.4;
  private static readonly TEMP_GROUND_ORIGIN = new THREE.Vector3();
  private static readonly RAY_OFFSET = new THREE.Vector3(0, 0.4, 0);
  private static readonly DOWN_DIR = new THREE.Vector3(0, -1, 0);
  private static readonly TEMP_NORM = new THREE.Vector3();

  public update(delta: number, input: InputManager, cameraController: CameraController): void {
    // ── Fail-Safe Control Recovery ──────────────────────────────────────────
    // If controls are locked but NO cinematic or pickup sequence is active, force-unlock!
    const level = (window as any).gameInstance?.level01;
    const isCinematic = level?.isCinematicPlaying;
    const isOneShot = (this.animationController as any)?.isPlayingOneShot;

    if (this.isControlsLocked && !isCinematic && !isOneShot) {
      console.warn('[PlayerController] 🔓 Safety Recovery: Clearing stuck control lock flag for gameplay!');
      this.isControlsLocked = false;
      this.isMovementLocked = false;
      this.isAttacking = false;
    }

    // ── Enforce Strict Staff Weapon Visibility and WOOD/NOWOOD Animation Sync ──
    if (this.hasStaff) {
      if (!this.animationController.isArmed) {
        this.animationController.setArmed(true);
      }
      if (this.isAttacking) {
        if (this.staffBackMesh && this.staffBackMesh.visible) this.staffBackMesh.visible = false;
        if (this.staffHandMesh && !this.staffHandMesh.visible) this.staffHandMesh.visible = true;
      } else {
        if (this.staffHandMesh && this.staffHandMesh.visible) this.staffHandMesh.visible = false;
        if (this.staffBackMesh && !this.staffBackMesh.visible) this.staffBackMesh.visible = true;
      }
    } else {
      if (this.animationController.isArmed) {
        this.animationController.setArmed(false);
      }
      if (this.staffBackMesh && this.staffBackMesh.visible) this.staffBackMesh.visible = false;
      if (this.staffHandMesh && this.staffHandMesh.visible) this.staffHandMesh.visible = false;
    }

    if (this.isControlsLocked) {
      this.animationController.update(delta);
      return;
    }

    const isPlayerChild = (obj: THREE.Object3D): boolean => {
      let curr: THREE.Object3D | null = obj;
      while (curr) {
        if (curr === this.mesh) return true;
        curr = curr.parent;
      }
      return false;
    };

    // 1. Ground Check (Surface normal validation + Self-mesh exclusion)
    PlayerController.TEMP_GROUND_ORIGIN.copy(this.mesh.position).add(PlayerController.RAY_OFFSET);
    this.groundRaycaster.set(PlayerController.TEMP_GROUND_ORIGIN, PlayerController.DOWN_DIR);
    this.groundRaycaster.far = 1.2;
    const rawGroundHits = this.groundRaycaster.intersectObjects(this.colliders, true);

    let validGroundHit: THREE.Intersection | null = null;
    for (const hit of rawGroundHits) {
      if (isPlayerChild(hit.object)) continue;
      if (!hit.face) continue;
      PlayerController.TEMP_NORM.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
      // Accept walkable floor surfaces and steps/ramps ahead up to +0.45m
      if (PlayerController.TEMP_NORM.y >= 0.40 && hit.point.y <= this.mesh.position.y + 0.45 && hit.point.y >= this.mesh.position.y - 1.2) {
        validGroundHit = hit;
        break;
      }
    }

    const prevVelY = this.velocity.y;
    const terrainY = level?.getTerrainHeight ? level.getTerrainHeight(this.mesh.position.x, this.mesh.position.z) : 0.0;
    
    // Exact floor level: static collider if walked on, otherwise natural terrain
    const floorY = validGroundHit ? validGroundHit.point.y : terrainY;

    if (this.mesh.position.y <= floorY + 0.45 && this.velocity.y <= 0) {
      this.isGrounded = true;
      this.velocity.y = 0;
      this.mesh.position.y = floorY; // feet snap cleanly to floor

      const dangerousFall = prevVelY < -12.0;

      this.jumpCount = 0;
      this.doubleJumpSpinTimer = 0;
      this.visualModel.rotation.x = this.defaultVisualRotationX;

      if (dangerousFall) {
        this.triggerHardLanding();
      }
    } else {
      this.isGrounded = false;
      if (!this.isMovementLocked) {
        this.velocity.y += this.gravity * delta;
      }
    }

    // Bind dynamic onJumpPress
    if (!input.onJumpPress) {
      input.onJumpPress = () => {
        if (this.isControlsLocked || this.isMovementLocked) return;
        const audioManager = (window as any).gameInstance?.audioManager;

        if (this.isGrounded) {
          this.velocity.y = this.jumpForce;
          this.isGrounded = false;
          this.jumpCount = 1;
          this.animationController.playState('Jump');
          if (audioManager) audioManager.playJumpGrunt();
        } else if (this.jumpCount === 1) {
          this.velocity.y = this.jumpForce * 0.95;
          this.jumpCount = 2;
          this.doubleJumpSpinTimer = 0.4;
          if (!this.hasStaff) {
            this.animationController.playState('Wukong_NoWood_DoubleJump' as any);
          } else {
            this.animationController.playState('Jump');
          }
          if (audioManager) audioManager.playJumpGrunt();
        }
      };
    }

    // Process double jump visual frontflip spin (forward rotation)
    if (this.doubleJumpSpinTimer > 0) {
      this.doubleJumpSpinTimer -= delta;
      const progress = 1.0 - (this.doubleJumpSpinTimer / 0.4);
      this.visualModel.rotation.x = this.defaultVisualRotationX + progress * Math.PI * 2;
      if (this.doubleJumpSpinTimer <= 0) {
        this.visualModel.rotation.x = this.defaultVisualRotationX;
      }
    }

    // 2. Movement Direction relative to Camera
    const forward = cameraController.getForwardVector();
    const right = cameraController.getRightVector();

    let moveX = 0;
    let moveZ = 0;

    if (!this.isMovementLocked) {
      const touchMag = Math.hypot(input.touchAnalogX, input.touchAnalogZ);
      if (touchMag > 0.05) {
        moveX = input.touchAnalogX;
        moveZ = input.touchAnalogZ;
      } else {
        if (input.moveForward) moveZ += 1;
        if (input.moveBackward) moveZ -= 1;
        if (input.moveLeft) moveX -= 1;
        if (input.moveRight) moveX += 1;
      }
    }

    const moveDir = new THREE.Vector3()
      .addScaledVector(forward, moveZ)
      .addScaledVector(right, moveX)
      .normalize();

    const isMoving = moveDir.lengthSq() > 0.01;
    const touchMag = Math.hypot(input.touchAnalogX, input.touchAnalogZ);
    const isSprinting = input.isRunning || touchMag > 0.45;
    const currentSpeed = isSprinting ? this.runSpeed : this.moveSpeed;

    if (isMoving) {
      this.velocity.x = moveDir.x * currentSpeed;
      this.velocity.z = moveDir.z * currentSpeed;

      // Smooth Rotation to facing direction
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      const currentRot = this.mesh.rotation.y;
      let diff = targetRotation - currentRot;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.mesh.rotation.y += diff * Math.min(1.0, delta * 15.0);
    } else {
      if (this.isGrounded) {
        this.velocity.x = 0;
        this.velocity.z = 0;
      } else {
        this.velocity.x *= 0.85;
        this.velocity.z *= 0.85;
      }
    }

    // 4. Wall Collision — Raycast in movement direction before applying position
    const horizontalVel = new THREE.Vector3(this.velocity.x, 0, this.velocity.z);
    const horizontalSpeed = horizontalVel.length();

    if (horizontalSpeed > 0.1 && this.colliders.length > 0) {
      const moveAmount = horizontalSpeed * delta;
      const moveNorm = horizontalVel.clone().normalize();

      // Cast ray from upper body height (0.85m) so step risers (0.35m) don't block movement as walls
      const rayOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, 0.85, 0));
      this.wallRaycaster.set(rayOrigin, moveNorm);
      this.wallRaycaster.far = this.PLAYER_RADIUS + moveAmount;

      const rawWallHits = this.wallRaycaster.intersectObjects(this.colliders, true);
      const wallHits = rawWallHits.filter(h => !isPlayerChild(h.object));

      if (wallHits.length > 0 && wallHits[0].distance < this.PLAYER_RADIUS + moveAmount) {
        const hitObject = wallHits[0].object;
        const objName = (hitObject.name || '').toLowerCase();
        const isStairStep = objName.includes('step') || objName.includes('stair') || objName.includes('ramp');

        // Ignore stair steps so Wukong glides up them smoothly
        if (!isStairStep) {
          const wallNormal = wallHits[0].face?.normal?.clone() || new THREE.Vector3(0, 0, 1);
          wallNormal.transformDirection(hitObject.matrixWorld);

          // Only treat as a wall if it is a steep vertical surface (abs(normal.y) < 0.35)
          if (Math.abs(wallNormal.y) < 0.35) {
            wallNormal.y = 0;
            wallNormal.normalize();

            // Remove the component of velocity going into the wall
            const dot = this.velocity.x * wallNormal.x + this.velocity.z * wallNormal.z;
            if (dot < 0) {
              this.velocity.x -= dot * wallNormal.x;
              this.velocity.z -= dot * wallNormal.z;
            }
          }
        }
      }

      // Auto-step climbing: Cast low ray at foot/knee height to detect steps up to 0.45m
      const lowRayOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, 0.15, 0));
      this.wallRaycaster.set(lowRayOrigin, moveNorm);
      this.wallRaycaster.far = this.PLAYER_RADIUS + 0.3;
      const rawStepHits = this.wallRaycaster.intersectObjects(this.colliders, true);
      const stepHits = rawStepHits.filter(h => !isPlayerChild(h.object));
      if (stepHits.length > 0 && stepHits[0].distance <= this.PLAYER_RADIUS + 0.3) {
        const stepPt = stepHits[0].point;
        const stepHeight = stepPt.y - this.mesh.position.y;
        if (stepHeight > 0.05 && stepHeight <= 0.45 && this.isGrounded) {
          this.mesh.position.y += stepHeight * 0.4; // Smoothly step up
        }
      }
    }

    // Apply final position
    this.mesh.position.x += this.velocity.x * delta;
    this.mesh.position.y += this.velocity.y * delta;
    this.mesh.position.z += this.velocity.z * delta;

    // Post-movement ground re-snap for smooth slope and ramp traversal
    if (this.isGrounded && this.velocity.y === 0 && this.colliders.length > 0) {
      const snapOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, 0.4, 0));
      this.groundRaycaster.set(snapOrigin, PlayerController.DOWN_DIR);
      this.groundRaycaster.far = 1.0;
      const rawSnapHits = this.groundRaycaster.intersectObjects(this.colliders, true);
      for (const hit of rawSnapHits) {
        if (isPlayerChild(hit.object)) continue;
        if (!hit.face) continue;
        const norm = hit.face.normal.clone();
        norm.transformDirection(hit.object.matrixWorld);
        if (norm.y >= 0.4 && hit.point.y <= this.mesh.position.y + 0.45 && hit.point.y >= this.mesh.position.y - 0.6) {
          this.mesh.position.y = hit.point.y;
          break;
        }
      }
    }

    // Resolve radial collisions at hip and shoulder heights ONLY when airborne.
    // When grounded, the forward-direction wall raycast above already handles true walls.
    // Running this pass while grounded causes the player to be pushed sideways against
    // the faces of individual stair steps, blocking forward movement up inclines.
    if (this.colliders.length > 0 && !this.isGrounded) {
      const checkHeights = [0.5, 1.0];
      const checkDirs = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0.707, 0, 0.707),
        new THREE.Vector3(-0.707, 0, 0.707),
        new THREE.Vector3(0.707, 0, -0.707),
        new THREE.Vector3(-0.707, 0, -0.707)
      ];

      for (const height of checkHeights) {
        const rayOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, height, 0));
        for (const dir of checkDirs) {
          this.wallRaycaster.set(rayOrigin, dir);
          this.wallRaycaster.far = this.PLAYER_RADIUS;
          const hits = this.wallRaycaster.intersectObjects(this.colliders, true);

          if (hits.length > 0 && hits[0].distance < this.PLAYER_RADIUS) {
            const normal = hits[0].face?.normal?.clone() || dir.clone().negate();
            normal.transformDirection(hits[0].object.matrixWorld);

            // Only push away from steep vertical surfaces (abs(normal.y) < 0.35)
            if (Math.abs(normal.y) < 0.35) {
              const overlap = this.PLAYER_RADIUS - hits[0].distance;
              normal.y = 0;
              const nLen = normal.length();
              if (nLen > 0.0001) {
                normal.divideScalar(nLen);
                this.mesh.position.addScaledVector(normal, overlap);
                const dot = this.velocity.x * normal.x + this.velocity.z * normal.z;
                if (dot < 0) {
                  this.velocity.x -= dot * normal.x;
                  this.velocity.z -= dot * normal.z;
                }
              }
            }
          }
        }
      }
    }

    // Align visual model to ground perfectly during Hard Landing squat pose
    const targetVisualY = (this.animationController.getCurrentState() === 'Wukong_NoWood_HardLanding') ? -0.18 : 0.0;
    this.visualModel.position.y = THREE.MathUtils.lerp(this.visualModel.position.y, targetVisualY, delta * 12.0);

    // 5. Select Animation State — always use Run for any movement (Walk = Run at lower speed)
    if (this.isGrounded && !this.isAttacking) {
      if (isMoving) {
        this.animationController.playState('Run');
      } else {
        this.animationController.playState('Idle');
      }
    }

    // 6. Passive Mana Regeneration & Wand Effect Update
    if (this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + this.manaRegenRate * delta);
      this.onManaChange?.(this.mana, this.maxMana);
    }

    this.wandEffect.update(delta);
    this.attackAura.update(delta);
    this.animationController.update(delta);

    // 7. Abyss Death (Fall off map)
    if (this.mesh.position.y < -10 && !this.isMovementLocked) {
      this.respawnFromAbyss();
    }
  }

  public triggerAttackAura(): void {
    this.attackAura.trigger();
  }

  public stopAttackAura(): void {
    this.attackAura.stop();
  }

  private isRespawning = false;
  private respawnFromAbyss(): void {
    if (this.isRespawning) return;
    this.isRespawning = true;
    this.isMovementLocked = true;
    
    // Take fall damage
    this.takeDamage(20);

    const hud = (window as any).gameInstance?.hud;
    hud?.fadeScreenOut(500).then(() => {
      // Respawn at a safe point (e.g. origin or a predefined safe spot)
      // For now, we will just place them near the start of the level
      this.mesh.position.set(0, 0, 0);
      this.velocity.set(0, 0, 0);
      
      setTimeout(() => {
        hud?.fadeScreenIn(500).then(() => {
          this.isMovementLocked = false;
          this.isRespawning = false;
        });
      }, 500);
    });
  }

  public attachStaffToHand(): void {
    if (!this.hasStaff) return;
    if (this.staffBackMesh) this.staffBackMesh.visible = false;
    if (this.staffHandMesh) {
      this.staffHandMesh.visible = true;
    }
  }

  public attachStaffToBack(): void {
    if (!this.hasStaff) return;
    if (this.staffHandMesh) this.staffHandMesh.visible = false;
    if (this.staffBackMesh) {
      this.staffBackMesh.visible = true;
      // Clean staff on back: NO permanent aura, NO glow, NO floating particles
      if (this.wandEffect && this.wandEffect.wandMesh) {
        this.wandEffect.wandMesh.visible = false;
      }
      this.attackAura.stop();
    }
  }

  public getSpellLaunchPosition(): THREE.Vector3 {
    // 1. Get exact world position of the wand's tip glow effect
    if (this.wandEffect && this.wandEffect.wandMesh.visible) {
      const tipPos = new THREE.Vector3();
      this.wandEffect.wandMesh.getWorldPosition(tipPos);
      return tipPos;
    }

    // 2. Check for attached procedural/fallback staff crystal tip

    // 2. Check for right hand bone of player.glb
    let rightHand: THREE.Object3D | null = null;
    this.mesh.traverse((child) => {
      const n = child.name.toLowerCase();
      if (n.includes('righthand') && !n.includes('thumb') && !n.includes('index') && !n.includes('middle') && !n.includes('ring') && !n.includes('pinky')) {
        rightHand = child;
      }
    });

    if (rightHand) {
      const handPos = new THREE.Vector3();
      (rightHand as THREE.Object3D).getWorldPosition(handPos);
      // Project slightly forward/upward from hand bone position
      const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion);
      return handPos.add(new THREE.Vector3(0, 0.3, 0)).addScaledVector(forwardDir, 0.5);
    }

    // 3. Fallback: use player head position and project forward
    const fallback = new THREE.Vector3().copy(this.mesh.position);
    fallback.y += 1.4;
    return fallback.addScaledVector(new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y), 0.6);
  }

  private createDustImpactVFX(origin: THREE.Vector3): void {
    if (!this.mesh.parent) return;
    const scene = this.mesh.parent;
    const dustCount = 18;
    const dustMeshes: THREE.Mesh[] = [];
    const dustVels: THREE.Vector3[] = [];

    const geo = new THREE.SphereGeometry(0.12, 6, 6);
    for (let i = 0; i < dustCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xccccaa,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      const dust = new THREE.Mesh(geo, mat);
      dust.position.copy(origin).add(new THREE.Vector3(0, 0.05, 0));

      const angle = (i / dustCount) * Math.PI * 2;
      const speed = 2.0 + Math.random() * 2.5;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        0.4 + Math.random() * 0.8,
        Math.sin(angle) * speed
      );

      scene.add(dust);
      dustMeshes.push(dust);
      dustVels.push(vel);
    }

    let age = 0;
    const duration = 0.55;
    const anim = () => {
      age += 0.016;
      const t = age / duration;
      dustMeshes.forEach((d, idx) => {
        d.position.addScaledVector(dustVels[idx], 0.016);
        dustVels[idx].y -= 4.0 * 0.016;
        d.scale.addScalar(0.016 * 3.0);
        (d.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - t * 1.3);
      });

      if (age < duration) {
        requestAnimationFrame(anim);
      } else {
        dustMeshes.forEach(d => {
          scene.remove(d);
          d.geometry.dispose();
          (d.material as THREE.Material).dispose();
        });
      }
    };
    requestAnimationFrame(anim);
  }

  private triggerHardLanding(): void {
    if (this.isControlsLocked || this.isMovementLocked) return;

    this.isControlsLocked = true;
    this.isMovementLocked = true;
    this.velocity.set(0, 0, 0);

    const dmg = this.maxHealth * 0.15;
    this.takeDamage(dmg);

    const audioManager = (window as any).gameInstance?.audioManager;
    if (audioManager) {
      audioManager.playHardLandingImpact('stone');
      audioManager.playHardLandingGrunt();
    }

    this.createDustImpactVFX(this.mesh.position.clone());

    console.log('[PlayerController] Triggered dangerous fall: playing Wukong_NoWood_HardLanding with dust VFX...');
    this.animationController.playHardLanding(() => {
      this.isControlsLocked = false;
      this.isMovementLocked = false;
    });
  }
}
