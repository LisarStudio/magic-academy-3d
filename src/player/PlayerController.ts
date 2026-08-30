import * as THREE from 'three';
import { InputManager } from '../core/InputManager';
import { CameraController } from '../camera/CameraController';
import { AnimationController } from './AnimationController';
import { WandEffect } from '../spells/WandEffect';
import { ItemPickupVFX } from './ItemPickupVFX';

export const PLAYER_NAME = 'LISAR';

export class PlayerController {
  public mesh: THREE.Group;
  public animationController: AnimationController;
  public wandEffect: WandEffect;

  public velocity = new THREE.Vector3();
  public isGrounded = true;
  public moveSpeed = 4.5;
  public runSpeed = 7.5;
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
    // It starts hidden and detached. It attaches to the real báculo when the staff is equipped.
    this.wandEffect = new WandEffect();

    // Initially staff is hidden until collected from chest
    this.setStaffVisibility(false);
  }

  public setStaffVisibility(visible: boolean): void {
    // Show/hide the real báculo embedded in the character model
    const embeddedStaff = this.mesh.getObjectByName('Vaculo');
    if (embeddedStaff) embeddedStaff.visible = visible;

    const attachedStaff = this.mesh.getObjectByName('magic_wand');
    if (attachedStaff) attachedStaff.visible = visible;

    if (visible) {
      // Attach the glow effect to the báculo's tip.
      // Prefer the Vaculo (embedded in player.glb); fallback to baculo.glb attached to RightHand.
      const staffRoot = embeddedStaff || attachedStaff;
      if (staffRoot) {
        // Place the glow group at the top of the staff.
        // The báculo mesh has its tip roughly at local Y=+0.8 (will be fine-tuned visually).
        this.wandEffect.wandMesh.position.set(0, 0.8, 0);
        this.wandEffect.wandMesh.rotation.set(0, 0, 0);
        staffRoot.add(this.wandEffect.wandMesh);
      } else {
        // No báculo found in model — attach to player root as fallback
        this.wandEffect.wandMesh.position.set(0.35, 1.6, 0.2);
        this.mesh.add(this.wandEffect.wandMesh);
      }
      this.wandEffect.wandMesh.visible = true;
    } else {
      // Detach glow from wherever it is and hide it
      this.wandEffect.wandMesh.visible = false;
      if (this.wandEffect.wandMesh.parent) {
        this.wandEffect.wandMesh.parent.remove(this.wandEffect.wandMesh);
      }
    }
  }

  public equipStaff(scene?: THREE.Scene): void {
    if (this.hasStaff) return;

    console.log('[PlayerController] Playing epic staff pickup animation...');
    if (scene) {
      ItemPickupVFX.playEpicPickup(this, scene, 'staff', () => {
        this.hasStaff = true;
        this.setStaffVisibility(true);
        console.log('[PlayerController] Staff equipped! Spells unlocked and Armed animations active.');
      });
    } else {
      this.isControlsLocked = true;
      this.velocity.set(0, 0, 0);
      this.animationController.playTakeItemAnimation(() => {
        this.hasStaff = true;
        this.setStaffVisibility(true);
        this.isControlsLocked = false;
        console.log('[PlayerController] Staff equipped! Spells unlocked and Armed animations active.');
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
  }

  public takeDamage(amount: number, respawnPos?: THREE.Vector3): void {
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

  public update(delta: number, input: InputManager, cameraController: CameraController): void {
    if (this.isControlsLocked) {
      this.animationController.update(delta);
      return;
    }

    // 1. Ground Check
    // AUTHORITY: PlayerController owns position exclusively.
    // AnimationMixer owns bone rotations only (Hips position tracks stripped in AssetManager).
    // Model pivot is at feet (Y=0 of this.mesh = bottom of character).
    const origin = new THREE.Vector3().copy(this.mesh.position).add(new THREE.Vector3(0, 0.4, 0));
    this.groundRaycaster.set(origin, new THREE.Vector3(0, -1, 0));
    const groundHits = this.groundRaycaster.intersectObjects(this.colliders, true);

    const prevVelY = this.velocity.y;
    this.isGrounded = groundHits.length > 0 && groundHits[0].distance <= 0.8; // Increased from 0.5 for slope tolerance

    if (this.isGrounded && this.velocity.y <= 0) {
      this.velocity.y = 0;
      this.mesh.position.y = groundHits[0].point.y; // feet snap to floor surface
      
      const dangerousFall = prevVelY < -15.0;

      this.jumpCount = 0;
      this.doubleJumpSpinTimer = 0;
      this.visualModel.rotation.x = this.defaultVisualRotationX;

      if (dangerousFall) {
        this.triggerHardLanding();
      }
    } else if (!this.isMovementLocked) {
      this.velocity.y += this.gravity * delta;
    }

    // Bind dynamic onJumpPress
    if (!input.onJumpPress) {
      input.onJumpPress = () => {
        if (this.isControlsLocked || this.isMovementLocked) return;
        if (this.isGrounded) {
          this.velocity.y = this.jumpForce;
          this.isGrounded = false;
          this.jumpCount = 1;
          this.animationController.playState('Jump');
        } else if (this.jumpCount === 1) {
          this.velocity.y = this.jumpForce * 0.95;
          this.jumpCount = 2;
          this.doubleJumpSpinTimer = 0.4;
          // Play special Wukong double jump if unarmed, else standard jump
          if (!this.hasStaff) {
            this.animationController.playState('Wukong_NoWood_DoubleJump' as any);
          } else {
            this.animationController.playState('Jump');
          }
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
    const currentSpeed = input.isRunning ? this.runSpeed : this.moveSpeed;

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
      this.velocity.x *= 0.8; // Friction — original value
      this.velocity.z *= 0.8;
    }

    // 3. Jump (handled by input.onJumpPress callback)

    // 4. Wall Collision — Raycast in movement direction before applying position
    const horizontalVel = new THREE.Vector3(this.velocity.x, 0, this.velocity.z);
    const horizontalSpeed = horizontalVel.length();

    if (horizontalSpeed > 0.1 && this.colliders.length > 0) {
      const moveAmount = horizontalSpeed * delta;
      const moveNorm = horizontalVel.clone().normalize();

      // Cast ray from chest height in movement direction
      const rayOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, 0.5, 0));
      this.wallRaycaster.set(rayOrigin, moveNorm);
      this.wallRaycaster.far = this.PLAYER_RADIUS + moveAmount;

      const wallHits = this.wallRaycaster.intersectObjects(this.colliders, true);

      if (wallHits.length > 0 && wallHits[0].distance < this.PLAYER_RADIUS + moveAmount) {
        const wallNormal = wallHits[0].face?.normal?.clone() || new THREE.Vector3(0, 0, 1);
        wallNormal.transformDirection(wallHits[0].object.matrixWorld);
        
        // Only treat as a wall if it is a steep vertical surface (abs(normal.y) < 0.4)
        // Walkable slopes and ramps (normal.y > 0.4) are ignored so they don't block movement
        if (Math.abs(wallNormal.y) < 0.4) {
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

    // Apply final position
    this.mesh.position.x += this.velocity.x * delta;
    this.mesh.position.y += this.velocity.y * delta;
    this.mesh.position.z += this.velocity.z * delta;

    // Post-movement ground re-snap for smooth slope traversal
    // Without this, moving horizontally on a slope causes one frame of being airborne
    // which triggers gravity and makes uphill movement feel heavy
    if (this.isGrounded && this.velocity.y === 0 && this.colliders.length > 0) {
      const snapOrigin = this.mesh.position.clone().add(new THREE.Vector3(0, 1.0, 0));
      this.groundRaycaster.set(snapOrigin, new THREE.Vector3(0, -1, 0));
      const snapHits = this.groundRaycaster.intersectObjects(this.colliders, true);
      if (snapHits.length > 0 && snapHits[0].distance <= 1.8) {
        this.mesh.position.y = snapHits[0].point.y;
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
    this.animationController.update(delta);

    // 7. Abyss Death (Fall off map)
    if (this.mesh.position.y < -10 && !this.isMovementLocked) {
      this.respawnFromAbyss();
    }
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
    const backStaff = this.mesh.getObjectByName('Vaculo') || this.mesh.getObjectByName('magic_wand');
    const attackStaff = this.mesh.getObjectByName('atack_wood_staff');

    // Hide the staff on the back
    if (backStaff) {
      backStaff.visible = false;
    }

    // Show the staff in the hand (extracted from atack_wood.glb)
    if (attackStaff) {
      attackStaff.visible = true;
      // Move light effect to attack staff tip
      if (this.wandEffect && this.wandEffect.wandMesh) {
        this.wandEffect.wandMesh.position.set(0, 0.8, 0); // Adjust tip offset if needed for atack_wood_staff
        attackStaff.add(this.wandEffect.wandMesh);
      }
    }
  }

  public attachStaffToBack(): void {
    const backStaff = this.mesh.getObjectByName('Vaculo') || this.mesh.getObjectByName('magic_wand');
    const attackStaff = this.mesh.getObjectByName('atack_wood_staff');

    // Show the staff on the back
    if (backStaff) {
      backStaff.visible = true;
      // Move light effect back to the back staff
      if (this.wandEffect && this.wandEffect.wandMesh) {
        this.wandEffect.wandMesh.position.set(0, 0.8, 0);
        backStaff.add(this.wandEffect.wandMesh);
      }
    }

    // Hide the staff in the hand
    if (attackStaff) {
      attackStaff.visible = false;
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

  private triggerHardLanding(): void {
    if (this.isControlsLocked || this.isMovementLocked) return;

    this.isControlsLocked = true;
    this.isMovementLocked = true;
    this.velocity.set(0, 0, 0);

    const dmg = this.maxHealth * 0.20;
    this.takeDamage(dmg);

    console.log('[PlayerController] Triggered dangerous fall: playing Wukong_NoWood_HardLanding...');
    this.animationController.playHardLanding(() => {
      this.isControlsLocked = false;
      this.isMovementLocked = false;
    });
  }
}
