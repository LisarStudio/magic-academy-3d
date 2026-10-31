import * as THREE from 'three';
import { InputManager } from '../core/InputManager';
import { CameraController } from '../camera/CameraController';
import { AnimationController } from './AnimationController';
import { WandEffect } from '../spells/WandEffect';
import { StaffFactory } from './StaffFactory';
import { AttackAuraEffect } from './AttackAuraEffect';
import { type WeaponType, WEAPON_DEFINITIONS } from './WeaponConfig';

export const PLAYER_NAME = 'LISAR';

export class PlayerController {
  /** Pickups may extend the current stock; keep the cap centralized for balance tuning. */
  public static readonly MAX_LIVES = 99;
  public mesh: THREE.Group;
  public animationController: AnimationController;
  public wandEffect: WandEffect;
  public attackAura: AttackAuraEffect;

  public velocity = new THREE.Vector3();
  public isGrounded = true;
  public moveSpeed = 5.2;
  public runSpeed = 9.5;
  public jumpForce = 8.0;
  public gravity = -20.0;
  /** Tracks the top of the current airborne arc so short jumps don't use the
   * supplied free-fall pose. That clip is reserved for genuinely high drops. */
  private airApexY = 0;
  private doubleJumpPivot: THREE.Group | null = null;
  private visualModelBasePosition = new THREE.Vector3();
  private dodgeCooldown = 0;
  private dodgeInvulnerability = 0;
  private readonly dodgeDirection = new THREE.Vector3();
  private damageFlinchRemaining = 0;
  private isDying = false;
  private snakeAlertRemaining = 0;
  private snakeAlertElapsed = 0;
  private snakeAlertSprite: THREE.Sprite | null = null;
  private defaultVisualRotationZ = 0;
  private footstepClock = 0;

  public health = 100;
  public maxHealth = 100;
  public lives = 3;
  public mana = 100;
  public maxMana = 100;
  public manaRegenRate = 12.0; // Mana per second

  public isControlsLocked = false;
  public isMovementLocked = false;
  private groundRaycaster = new THREE.Raycaster();
  private colliders: THREE.Object3D[] = [];
  private solidBlockerBounds: Array<{ mesh: THREE.Mesh; bounds: THREE.Box3 }> = [];

  public onHealthChange?: (hp: number, maxHp: number) => void;
  public onManaChange?: (mp: number, maxMp: number) => void;

  // ── EXTENSIBLE WEAPON INVENTORY SYSTEM ──────────────────────────────────
  public ownedWeapons: Set<WeaponType> = new Set();
  public equippedWeapon: WeaponType | null = null;

  public get hasStaff(): boolean {
    return this.ownedWeapons.has('STAFF');
  }
  public set hasStaff(val: boolean) {
    if (val) this.ownedWeapons.add('STAFF');
    else this.ownedWeapons.delete('STAFF');
  }

  public get staffEquipped(): boolean {
    return this.equippedWeapon === 'STAFF';
  }
  public set staffEquipped(val: boolean) {
    if (val) this.equipWeapon('STAFF');
    else if (this.equippedWeapon === 'STAFF') this.unequipWeapon();
  }

  public jumpCount = 0;
  public doubleJumpSpinTimer = 0;
  public isAttacking = false;
  
  public visualModel: THREE.Object3D;

  public isArmed(): boolean {
    return this.equippedWeapon !== null;
  }

  public obtainWeapon(weaponId: WeaponType, autoEquip = true): void {
    this.ownedWeapons.add(weaponId);
    console.log(`[PlayerController] ⚔️ Weapon acquired: ${weaponId}`);
    if (autoEquip) {
      this.equipWeapon(weaponId);
    }
  }

  public equipWeapon(weaponId: WeaponType): void {
    if (!this.ownedWeapons.has(weaponId)) {
      console.warn(`[PlayerController] Cannot equip unowned weapon: ${weaponId}`);
      return;
    }
    this.equippedWeapon = weaponId;
    const def = WEAPON_DEFINITIONS[weaponId];
    this.animationController.setArmed(def.animationSet === 'WOOD');
    this.attachStaffToBack();
    console.log(`[PlayerController] ⚔️ Equipped weapon: ${weaponId} (Mode: ${def.animationSet})`);
  }

  public unequipWeapon(): void {
    this.equippedWeapon = null;
    this.animationController.setArmed(false);
    if (this.staffBackMesh) this.staffBackMesh.visible = false;
    if (this.staffHandMesh) this.staffHandMesh.visible = false;
    this.attackAura.stop();
    console.log('[PlayerController] 🤲 Unequipped all weapons (Mode: NOWOOD)');
  }

  public equipStaff(): void {
    this.equipWeapon('STAFF');
  }

  public unequipStaff(): void {
    this.unequipWeapon();
  }

  constructor(modelOrGroup: THREE.Group, animationController: AnimationController, staffModel: THREE.Group | null = null) {
    this.mesh = modelOrGroup;
    // The AssetManager returns a Group containing the actual playerModel as its first child
    this.visualModel = this.mesh.children.find(c => c.type === 'Group') || this.mesh.children[0] || this.mesh;
    this.defaultVisualRotationZ = this.visualModel.rotation.z;
    this.createDoubleJumpPivot();
    
    this.animationController = animationController;
    this.staffModelTemplate = staffModel;
    this.mesh.position.set(0, 0, 0);
    this.createSnakeAlertSprite();

    // Create the WandEffect glow (light + particles).
    this.wandEffect = new WandEffect();

    // Create smooth attack energy aura (active ONLY during atack_wood, attached to hand staff)
    this.attackAura = new AttackAuraEffect();

    // Initialize proportional dual-mount staff system (back mount & hand mount)
    this.initStaffMeshes();
    // Prepare the chest presentation mesh up front. The weapon pickup must not
    // clone/rebuild a rigged attachment during the interaction.
    this.staffPickupProp = this.createStaffVisual('staff_pickup_prop', 0.62);
    this.staffPickupProp.visible = false;
    this.setStaffVisibility(false);
  }

  /**
   * The imported character's visual root is placed at the feet. Wrap it in a
   * pivot located at the rig's pelvis so the double-jump spin turns around the
   * body's center instead of sweeping the whole character around the feet.
   * The wrapper is neutral at rest, preserving the existing bind pose.
   */
  private createDoubleJumpPivot(): void {
    const model = this.visualModel;
    const parent = model.parent;
    if (!parent || parent === model) {
      this.visualModelBasePosition.copy(model.position);
      return;
    }

    this.mesh.updateMatrixWorld(true);
    const pivotInParent = new THREE.Vector3();
    let hipsBone: THREE.Object3D | null = null;
    this.mesh.traverse((object) => {
      if (hipsBone || !(object as THREE.Bone).isBone) return;
      if (/(hips|pelvis)/i.test(object.name)) hipsBone = object;
    });

    if (hipsBone) {
      (hipsBone as THREE.Object3D).getWorldPosition(pivotInParent);
      parent.worldToLocal(pivotInParent);
    } else {
      // Fallback for alternate rigs: use the vertical midpoint of the visible
      // character bounds, converted into the visual root's parent space.
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      pivotInParent.set(
        (bounds.min.x + bounds.max.x) * 0.5,
        bounds.min.y + size.y * 0.52,
        (bounds.min.z + bounds.max.z) * 0.5
      );
      parent.worldToLocal(pivotInParent);
    }

    const originalPosition = model.position.clone();
    const pivot = new THREE.Group();
    pivot.name = 'wukong_double_jump_hip_pivot';
    pivot.position.copy(pivotInParent);
    parent.add(pivot);
    parent.remove(model);
    model.position.copy(originalPosition).sub(pivotInParent);
    pivot.add(model);

    this.doubleJumpPivot = pivot;
    this.visualModelBasePosition.copy(model.position);
  }

  public staffBackMesh: THREE.Group | null = null;
  public staffHandMesh: THREE.Group | null = null;
  private staffModelTemplate: THREE.Group | null = null;
  private staffPickupProp: THREE.Group | null = null;

  private createStaffVisual(name: string, scale: number): THREE.Group {
    const mount = new THREE.Group();
    mount.name = name;
    if (this.staffModelTemplate) {
      // Object3D.clone shares immutable geometry and materials, so the back
      // and hand sockets do not duplicate GPU buffers or parse the GLB again.
      const authoredStaff = this.staffModelTemplate.clone(true);
      authoredStaff.name = `${name}_baculo_glb`;
      authoredStaff.scale.multiplyScalar(scale);
      authoredStaff.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });
      mount.add(authoredStaff);
    } else {
      // Keep a known-safe fallback if the optional weapon asset cannot load.
      const fallback = StaffFactory.createStaff(`${name}_fallback`);
      fallback.scale.setScalar(scale);
      mount.add(fallback);
    }
    return mount;
  }

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

    const def = WEAPON_DEFINITIONS.STAFF;

    // Find the hand for the weapon grip. The back socket is attached in model-root
    // space below so it cannot inherit an arbitrary spine-bone orientation.
    let rightHandBone: THREE.Object3D | null = null;

    this.mesh.traverse((child) => {
      const n = child.name.toLowerCase();
      if (def.handAttachment.boneNameSubstrings.some(sub => n.includes(sub)) && !n.includes('thumb') && !n.includes('index') && !n.includes('middle') && !n.includes('ring') && !n.includes('pinky')) {
        rightHandBone = child;
      }
    });
    const handName = rightHandBone ? (rightHandBone as THREE.Object3D).name : 'root';
    console.log(`[PlayerController] Binding staff sockets — Back: model root, RightHand: ${handName}`);

    // 3. Create the carried weapon on a dedicated model-root back socket.
    // 100% CLEAN PHYSICAL PBR — NO aura, NO particles, NO emissive glow
    const backStaff = this.createStaffVisual('staff_on_back', 0.62);
    backStaff.visible = false;
    this.staffBackMesh = backStaff;

    const backSocket = new THREE.Group();
    backSocket.name = 'wukong_sacred_staff_back_socket';
    // The GLB template is normalized to 1.22 m. Carry it at ~0.76 m and
    // cancel the player visual-root scale exactly once.
    backStaff.scale.setScalar(1);
    backStaff.position.set(0, 0, 0);
    backStaff.rotation.set(0, 0, 0);
    backSocket.add(backStaff);

    this.mesh.updateMatrixWorld(true);
    this.visualModel.updateMatrixWorld(true);
    const modelWorldScale = new THREE.Vector3();
    this.visualModel.getWorldScale(modelWorldScale);
    const safeModelScale = new THREE.Vector3(
      Math.max(modelWorldScale.x, 0.00001),
      Math.max(modelWorldScale.y, 0.00001),
      Math.max(modelWorldScale.z, 0.00001)
    );
    backStaff.scale.set(1 / safeModelScale.x, 1 / safeModelScale.y, 1 / safeModelScale.z);
    backSocket.position.copy(def.backAttachment.position).divide(safeModelScale);
    backSocket.rotation.copy(def.backAttachment.rotation);
    this.visualModel.add(backSocket);

    // 4. Create Staff Hand Mesh (firmly gripped in right hand for attacking)
    const handStaff = this.createStaffVisual('staff_in_hand', 0.82);
    handStaff.visible = false;
    this.staffHandMesh = handStaff;

    // Attach attack aura sheath strictly to hand staff (active ONLY during atack_wood swing)
    handStaff.add(this.attackAura.mesh);

    if (rightHandBone) {
      this.mesh.updateMatrixWorld(true);
      const handWorldScale = new THREE.Vector3();
      (rightHandBone as THREE.Object3D).getWorldScale(handWorldScale);
      const uniformInv = handWorldScale.x > 0.00001 ? 1.0 / handWorldScale.x : 1.0;
      handStaff.scale.set(uniformInv, uniformInv, uniformInv);

      handStaff.position.copy(def.handAttachment.position).divide(handWorldScale);
      handStaff.rotation.copy(def.handAttachment.rotation);
      (rightHandBone as THREE.Object3D).add(handStaff);
    } else {
      handStaff.position.set(0.4, 1.0, 0.3);
      this.mesh.add(handStaff);
    }
  }

  public setStaffVisibility(visible: boolean): void {
    this.attackAura.stop();
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

  /** Clone the already-built staff geometry/materials for chest presentation. */
  public cloneStaffProp(name = 'staff_pickup_prop'): THREE.Group | null {
    // Shader warmup gets a cheap shared-geometry clone of the neutral pickup
    // prefab. Never clone the back socket: its inverse parent-scale is specific
    // to that mount and sends the chest prop to the wrong transform space.
    const source = this.staffPickupProp;
    if (!source) return null;
    const prop = source.clone(true);
    prop.name = name;
    prop.position.set(0, 0, 0);
    prop.rotation.set(0, 0, 0);
    prop.scale.set(1, 1, 1);
    prop.visible = true;
    return prop;
  }

  /** Reuse the prebuilt 3D pickup prop; ownership transfers to the chest scene. */
  public takePreparedStaffPickupProp(): THREE.Group | null {
    const prop = this.staffPickupProp;
    if (!prop) return null;
    if (prop.parent) prop.parent.remove(prop);
    prop.name = 'chest_staff_prop';
    prop.position.set(0, 0, 0);
    prop.rotation.set(0, 0, 0);
    prop.scale.set(1, 1, 1);
    prop.visible = true;
    return prop;
  }

  public releasePreparedStaffPickupProp(): void {
    if (!this.staffPickupProp) return;
    if (this.staffPickupProp.parent) this.staffPickupProp.parent.remove(this.staffPickupProp);
    this.staffPickupProp.visible = false;
    this.staffPickupProp.position.set(0, 0, 0);
    this.staffPickupProp.rotation.set(0, 0, 0);
    this.staffPickupProp.scale.set(1, 1, 1);
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
  public onRespawn?: () => void;
  public onLivesChange?: (lives: number) => void;
  public onGameOver?: () => void;

  public grantLife(amount = 1): boolean {
    const nextLives = Math.min(PlayerController.MAX_LIVES, this.lives + Math.max(0, Math.floor(amount)));
    if (nextLives === this.lives) return false;
    this.lives = nextLives;
    this.onLivesChange?.(this.lives);
    return true;
  }

  public takeDamage(amount: number, respawnPos?: THREE.Vector3): void {
    if (this.isDying || this.isInvulnerable || this.isControlsLocked || this.isMovementLocked) {
      // Immune while performing TakeItem animation or watching cinematics
      return;
    }
    this.health = Math.max(0, this.health - amount);
    this.onHealthChange?.(this.health, this.maxHealth);

    if (this.health <= 0) {
      this.lives = Math.max(0, this.lives - 1);
      this.onLivesChange?.(this.lives);
      this.isDying = true;
      this.isControlsLocked = true;
      this.isMovementLocked = true;
      this.isAttacking = false;
      this.velocity.set(0, 0, 0);
      this.animationController.playDeathAnimation(() => {
        this.isDying = false;
        if (this.lives === 0) {
          this.onGameOver?.();
          return;
        }
        // Preserve existing life/checkpoint rules; only sequence the supplied death clip first.
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.onHealthChange?.(this.health, this.maxHealth);
        this.onManaChange?.(this.mana, this.maxMana);
        if (respawnPos) this.mesh.position.copy(respawnPos);
        this.onRespawn?.();
        this.isControlsLocked = false;
        this.isMovementLocked = false;
        this.forceIdle();
      });
      return;
    }
    this.damageFlinchRemaining = 0.28;
    this.animationController.playImpactReaction();
  }

  public reactToSnakeAmbush(onReactionStart: () => void = () => {}): void {
    this.animationController.playSnakeSurprise(() => {
      this.showSnakeAlert();
      onReactionStart();
    });
  }

  private createSnakeAlertSprite(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.shadowColor = '#ff7a22'; ctx.shadowBlur = 18;
    ctx.fillStyle = '#24120b'; ctx.strokeStyle = '#ffe08a'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.roundRect(28, 10, 72, 108, 32); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = '#ffcf55'; ctx.font = 'bold 88px system-ui, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', 64, 62);
    ctx.fillStyle = '#ff8b36'; ctx.beginPath(); ctx.arc(64, 100, 6, 0, Math.PI * 2); ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, opacity: 0 });
    this.snakeAlertSprite = new THREE.Sprite(material);
    this.snakeAlertSprite.name = 'snake_surprise_alert';
    this.snakeAlertSprite.position.set(0, 2.35, 0);
    this.snakeAlertSprite.scale.set(0.42, 0.42, 1);
    this.snakeAlertSprite.visible = false;
    this.mesh.add(this.snakeAlertSprite);
  }

  private showSnakeAlert(): void {
    if (!this.snakeAlertSprite) return;
    this.snakeAlertRemaining = 0.9;
    this.snakeAlertElapsed = 0;
    this.snakeAlertSprite.visible = true;
    this.snakeAlertSprite.material.opacity = 1;
  }

  private updateSnakeAlert(delta: number): void {
    if (!this.snakeAlertSprite || this.snakeAlertRemaining <= 0) return;
    this.snakeAlertElapsed += delta;
    this.snakeAlertRemaining = Math.max(0, this.snakeAlertRemaining - delta);
    this.snakeAlertSprite.position.y = 2.35 + Math.sin(this.snakeAlertElapsed * 8) * 0.08;
    this.snakeAlertSprite.material.opacity = Math.min(1, this.snakeAlertRemaining * 2.2);
    if (this.snakeAlertRemaining === 0) this.snakeAlertSprite.visible = false;
  }

  public setColliders(colliders: THREE.Object3D[]): void {
    this.colliders = colliders;
    this.solidBlockerBounds = [];
    const includeBlocker = (object: THREE.Object3D) => {
      const name = (object.name || '').toLowerCase();
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh && (mesh.userData.solidPlayerBlocker === true || name === 'porcelain_guardian_blocker')) {
        object.updateWorldMatrix(true, false);
        this.solidBlockerBounds.push({ mesh, bounds: new THREE.Box3().setFromObject(mesh) });
      }
    };
    for (const collider of colliders) collider.traverse(includeBlocker);
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
  // Start well above the root and cast through a generous recovery window.
  // A short foot ray could start underneath the thin temple paving after a
  // missed frame, then fall back to the lower terrain forever (visible as
  // Wukong sinking through paths and landings).
  private static readonly RAY_OFFSET = new THREE.Vector3(0, 2.2, 0);
  private static readonly DOWN_DIR = new THREE.Vector3(0, -1, 0);
  private static readonly TEMP_NORM = new THREE.Vector3();

  public update(delta: number, input: InputManager, cameraController: CameraController, animationDelta = delta): void {
    this.updateSnakeAlert(delta);
    if (this.isDying) {
      this.isControlsLocked = true;
      this.isMovementLocked = true;
      this.velocity.set(0, 0, 0);
      this.animationController.update(animationDelta);
      return;
    }
    const wasGroundedAtFrameStart = this.isGrounded;
    // ── Fail-Safe Control Recovery ──────────────────────────────────────────
    // If controls are locked but NO cinematic or pickup sequence is active, force-unlock!
    const level = (window as any).gameInstance?.level01;
    const isGameOver = (window as any).gameInstance?.isGameOver?.() === true;
    const isCinematic = level?.isCinematicPlaying;
    const isOneShot = (this.animationController as any)?.isPlayingOneShot;

    if (this.isControlsLocked && !isCinematic && !isOneShot && !isGameOver) {
      console.warn('[PlayerController] 🔓 Safety Recovery: Clearing stuck control lock flag for gameplay!');
      this.isControlsLocked = false;
      this.isMovementLocked = false;
      this.isAttacking = false;
    }

    this.dodgeCooldown = Math.max(0, this.dodgeCooldown - delta);
    if (this.dodgeInvulnerability > 0) {
      this.dodgeInvulnerability = Math.max(0, this.dodgeInvulnerability - delta);
      if (this.dodgeInvulnerability === 0) this.isInvulnerable = false;
    }
    const nearbyBossWindup = !this.isControlsLocked && !this.isMovementLocked && !this.isAttacking &&
      (level?.enemies as Array<{ isAttackWindup?: boolean; getPosition?: () => THREE.Vector3 }> | undefined)?.some(enemy =>
        enemy.isAttackWindup && enemy.getPosition && enemy.getPosition().distanceToSquared(this.mesh.position) < 36
      ) === true;
    (window as any).gameInstance?.hud?.showDodgeWarning?.(nearbyBossWindup);
    // Backward dodge is shared by S/Down and the existing touch stick. The
    // analog stick does not set moveBackward, so checking only the keyboard
    // flag made the promised dodge impossible on phones.
    const pressingBack = input.moveBackward || (input.touchAnalogZ < -0.55 && Math.abs(input.touchAnalogX) < 0.5);
    if (nearbyBossWindup && pressingBack && this.dodgeCooldown <= 0) {
      this.dodgeCooldown = 1.15;
      this.dodgeInvulnerability = 0.48;
      this.isInvulnerable = true;
      this.dodgeDirection.set(0, 0, -1).applyQuaternion(this.mesh.quaternion).setY(0).normalize();
      this.velocity.x = this.dodgeDirection.x * 7.2;
      this.velocity.z = this.dodgeDirection.z * 7.2;
      this.animationController.playBackwardDodge(() => {
        if (!this.isControlsLocked && !this.isAttacking) this.animationController.playState(this.isGrounded ? 'Idle' : 'Fall', 0.14);
      });
    }

    // ── Enforce Strict Staff Weapon Visibility and WOOD/NOWOOD Animation Sync ──
    if (this.isArmed()) {
      if (!this.animationController.isArmed) {
        this.animationController.setArmed(true);
      }
      if (this.isAttacking) {
        if (this.staffBackMesh && this.staffBackMesh.visible) this.staffBackMesh.visible = false;
        if (this.staffHandMesh && !this.staffHandMesh.visible) this.staffHandMesh.visible = true;
      } else {
        if (this.staffHandMesh && this.staffHandMesh.visible) this.staffHandMesh.visible = false;
        // An equipped staff remains visible on Wukong's back at every camera
        // distance. Hiding it based on camera distance made it disappear in
        // overview shots and on some desktop/mobile camera framings.
        const backStaffShouldShow = !this.isAttacking;
        if (this.staffBackMesh && this.staffBackMesh.visible !== backStaffShouldShow) {
          this.staffBackMesh.visible = backStaffShouldShow;
        }
      }
    } else {
      if (this.animationController.isArmed) {
        this.animationController.setArmed(false);
      }
      if (this.staffBackMesh && this.staffBackMesh.visible) this.staffBackMesh.visible = false;
      if (this.staffHandMesh && this.staffHandMesh.visible) this.staffHandMesh.visible = false;
    }

    if (this.isControlsLocked) {
      this.animationController.update(animationDelta);
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
    this.groundRaycaster.far = 4.8;
    const rawGroundHits = this.groundRaycaster.intersectObjects(this.colliders, true);

    let validGroundHit: THREE.Intersection | null = null;
    for (const hit of rawGroundHits) {
      if (isPlayerChild(hit.object)) continue;
      if (!hit.face) continue;
      PlayerController.TEMP_NORM.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
      const isAuthoredRecoverySurface = hit.object.userData.walkableSupport === true;
      // Accept walkable floors, including a nearby surface above the terrain.
      // The lower bound also recovers from a shallow fall-through instead of
      // letting the player keep descending below a valid path/floor collider.
      // Explicit temple/stair supports get a larger upward recovery window:
      // if a landing frame was missed at the doorway, Wukong can settle onto
      // the deck instead of remaining embedded below it. The snap itself still
      // only happens while descending, never during an upward jump.
      const maxSupportAboveRoot = isAuthoredRecoverySurface ? 2.0 : 0.45;
      if (PlayerController.TEMP_NORM.y >= 0.40 && hit.point.y <= this.mesh.position.y + maxSupportAboveRoot && hit.point.y >= this.mesh.position.y - 2.4) {
        validGroundHit = hit;
        break;
      }
    }

    const prevVelY = this.velocity.y;
    const terrainY = level?.getTerrainHeight ? level.getTerrainHeight(this.mesh.position.x, this.mesh.position.z) : 0.0;
    
    // Exact floor level: static collider if walked on, otherwise natural terrain
    // Outdoor floors cannot resolve below the sampled terrain surface: during
    // fast diagonal movement a nearby decorative/platform collider could
    // otherwise win the ray and pull Wukong underneath a hillside. The lower
    // crypt keeps its explicit collision floor without snapping back outdoors.
    const isInCrypt = level?.isPlayerInsideCuriosityCrypt?.() === true;
    // Use the same sampled ground and walkable surface regardless of the
    // character's current height. Previously a fall below -1.5 m switched to
    // collider-only resolution, which could leave Wukong embedded underground.
    const floorY = isInCrypt
      ? (validGroundHit?.point.y ?? terrainY)
      : Math.max(terrainY, validGroundHit?.point.y ?? -Infinity);

    if (this.mesh.position.y <= floorY + 0.45 && this.velocity.y <= 0) {
      this.isGrounded = true;
      this.velocity.y = 0;
      this.mesh.position.y = floorY; // feet snap cleanly to floor
      this.airApexY = floorY;

      const dangerousFall = prevVelY < -12.0;

      this.jumpCount = 0;
      this.doubleJumpSpinTimer = 0;
      if (this.doubleJumpPivot) this.doubleJumpPivot.rotation.x = 0;

      if (dangerousFall) {
        this.triggerHardLanding();
      }
    } else if (!isInCrypt && this.mesh.position.y < floorY - 0.45) {
      // Recovery for a missed collision frame / steep terrain seam. Clamp the
      // root to the actual terrain immediately rather than letting gravity
      // carry the character through the surface for seconds.
      this.mesh.position.y = floorY;
      this.velocity.y = 0;
      this.isGrounded = true;
      this.jumpCount = 0;
      this.airApexY = floorY;
    } else {
      this.isGrounded = false;
      if (wasGroundedAtFrameStart) this.airApexY = this.mesh.position.y;
      else this.airApexY = Math.max(this.airApexY, this.mesh.position.y);
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
          this.airApexY = this.mesh.position.y;
          this.jumpCount = 1;
          this.animationController.playState('Jump');
          if (audioManager) audioManager.playJumpGrunt();
        } else if (this.jumpCount === 1) {
          this.velocity.y = this.jumpForce * 0.95;
          this.airApexY = this.mesh.position.y;
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
      if (this.doubleJumpPivot) this.doubleJumpPivot.rotation.x = progress * Math.PI * 2;
      if (this.doubleJumpSpinTimer <= 0) {
        if (this.doubleJumpPivot) this.doubleJumpPivot.rotation.x = 0;
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

    // A hit flinch is interruptible: movement should switch the pose on this
    // same simulation tick instead of sliding with Reaction still clamped.
    if (isMoving) this.interruptHitReactionForCommand(input);

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
    let stepUpTargetY: number | null = null;

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
        let canClimbActualStep = false;
        const wallNormal = wallHits[0].face?.normal?.clone() || new THREE.Vector3(0, 0, 1);
        wallNormal.transformDirection(hitObject.matrixWorld);
        if (!isStairStep && this.isGrounded && Math.abs(wallNormal.y) < 0.35) {
          // Imported temple risers don't necessarily have useful names. Probe
          // the walkable top just ahead; climb only if it is genuinely within
          // the same 45 cm step limit used by the grounding solver.
          const ahead = this.mesh.position.clone().addScaledVector(moveNorm, this.PLAYER_RADIUS + moveAmount + 0.08);
          ahead.y += 0.62;
          this.groundRaycaster.set(ahead, PlayerController.DOWN_DIR);
          this.groundRaycaster.far = 1.12;
          const support = this.groundRaycaster.intersectObjects(this.colliders, true)
            .find((hit) => {
              if (isPlayerChild(hit.object) || !hit.face) return false;
              const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
              return normal.y >= 0.4 && hit.point.y > this.mesh.position.y + 0.025 && hit.point.y <= this.mesh.position.y + 0.45;
            });
          if (support) {
            stepUpTargetY = support.point.y;
            canClimbActualStep = true;
          }
        }

        // Ignore named steps and unnamed risers only when a walkable top was found.
        if (!isStairStep && !canClimbActualStep) {
          // Only treat as a wall if it is a steep vertical surface (abs(normal.y) < 0.35)
          if (Math.abs(wallNormal.y) < 0.35) {
            wallNormal.y = 0;
            wallNormal.normalize();
            // Double-sided structural colliders can be hit from either side.
            // Orient the response normal against movement so the inward and
            // outward approaches are both stopped instead of only one face.
            if (wallNormal.dot(moveNorm) > 0) wallNormal.negate();

            // Remove the component of velocity going into the wall
            const dot = this.velocity.x * wallNormal.x + this.velocity.z * wallNormal.z;
            if (dot < 0) {
              this.velocity.x -= dot * wallNormal.x;
              this.velocity.z -= dot * wallNormal.z;
            }
          }
        }
      }

    }

    // Sweep the player's horizontal footprint against static temple/guardian
    // blockers. A ray can miss when a frame starts inside a proxy, and a
    // destination-only overlap test can tunnel through a thin wall on a long
    // frame. Axis-separated sweeps also preserve sliding along the wall.
    if (horizontalSpeed > 0.001 && this.solidBlockerBounds.length > 0) {
      const currentX = this.mesh.position.x;
      const currentZ = this.mesh.position.z;
      const desiredX = currentX + this.velocity.x * delta;
      const desiredZ = currentZ + this.velocity.z * delta;
      const bodyBottom = this.mesh.position.y + 0.08;
      const bodyTop = this.mesh.position.y + 1.45;
      const axisIsBlocked = (axis: 'x' | 'z', startX: number, startZ: number, endX: number, endZ: number): boolean => {
        for (const entry of this.solidBlockerBounds) {
          const box = entry.bounds;
          if (bodyTop <= box.min.y || bodyBottom >= box.max.y) continue;
          const minX = box.min.x - this.PLAYER_RADIUS;
          const maxX = box.max.x + this.PLAYER_RADIUS;
          const minZ = box.min.z - this.PLAYER_RADIUS;
          const maxZ = box.max.z + this.PLAYER_RADIUS;
          const inside = (x: number, z: number) => x >= minX && x <= maxX && z >= minZ && z <= maxZ;
          if (inside(startX, startZ)) {
            // If a saved position or earlier frame already put Wukong inside
            // a wall, permit recovery only through the nearest face. Without
            // this guard an endpoint outside the box could tunnel completely
            // through it while starting from an overlap.
            const faces = [
              { axis: 'x' as const, distance: startX - minX, edge: minX, direction: -1 },
              { axis: 'x' as const, distance: maxX - startX, edge: maxX, direction: 1 },
              { axis: 'z' as const, distance: startZ - minZ, edge: minZ, direction: -1 },
              { axis: 'z' as const, distance: maxZ - startZ, edge: maxZ, direction: 1 }
            ].sort((a, b) => a.distance - b.distance);
            const nearest = faces[0];
            if (nearest.axis !== axis) return true;
            const startAxis = axis === 'x' ? startX : startZ;
            const endAxis = axis === 'x' ? endX : endZ;
            const otherAxis = axis === 'x' ? endZ : endX;
            const otherMin = axis === 'x' ? minZ : minX;
            const otherMax = axis === 'x' ? maxZ : maxX;
            if (nearest.direction < 0) {
              if (endAxis >= startAxis || endAxis < nearest.edge || otherAxis < otherMin || otherAxis > otherMax) return true;
              continue;
            }
            if (endAxis <= startAxis || endAxis > nearest.edge || otherAxis < otherMin || otherAxis > otherMax) return true;
            continue;
          }

          // Because this is an axis-only sweep, the orthogonal coordinate is
          // constant. Test directional entry across either expanded face so
          // touching a wall while moving away does not trap the player.
          if (axis === 'x') {
            const overlapsWall = startZ >= minZ && startZ <= maxZ;
            const entersWall = (startX <= minX && endX > minX) || (startX >= maxX && endX < maxX);
            if (overlapsWall && entersWall) return true;
          } else {
            const overlapsWall = startX >= minX && startX <= maxX;
            const entersWall = (startZ <= minZ && endZ > minZ) || (startZ >= maxZ && endZ < maxZ);
            if (overlapsWall && entersWall) return true;
          }
        }
        return false;
      };

      let resolvedX = currentX;
      if (Math.abs(desiredX - currentX) > 1e-6 && !axisIsBlocked('x', currentX, currentZ, desiredX, currentZ)) {
        resolvedX = desiredX;
      } else if (Math.abs(desiredX - currentX) > 1e-6) {
        this.velocity.x = 0;
      }

      let resolvedZ = currentZ;
      if (Math.abs(desiredZ - currentZ) > 1e-6 && !axisIsBlocked('z', resolvedX, currentZ, resolvedX, desiredZ)) {
        resolvedZ = desiredZ;
      } else if (Math.abs(desiredZ - currentZ) > 1e-6) {
        this.velocity.z = 0;
      }

      this.velocity.x = (resolvedX - currentX) / Math.max(delta, 0.0001);
      this.velocity.z = (resolvedZ - currentZ) / Math.max(delta, 0.0001);
    }

    // Apply final position
    this.mesh.position.x += this.velocity.x * delta;
    if (stepUpTargetY !== null && this.isGrounded) {
      this.mesh.position.y = stepUpTargetY;
      this.velocity.y = 0;
    } else {
      this.mesh.position.y += this.velocity.y * delta;
    }
    this.mesh.position.z += this.velocity.z * delta;

    // Re-sample support at the *new* X/Z after horizontal movement. Using only
    // the pre-move height let Wukong trail behind terrain on slopes and sink at
    // seams, especially where the approach meets the temple apron.
    if (this.isGrounded && this.velocity.y === 0) {
      const levelAfterMove = (window as any).gameInstance?.level01;
      let supportY = levelAfterMove?.getTerrainHeight
        ? levelAfterMove.getTerrainHeight(this.mesh.position.x, this.mesh.position.z)
        : 0;
      if (this.colliders.length > 0) {
        PlayerController.TEMP_GROUND_ORIGIN.copy(this.mesh.position).add(PlayerController.RAY_OFFSET);
        this.groundRaycaster.set(PlayerController.TEMP_GROUND_ORIGIN, PlayerController.DOWN_DIR);
        this.groundRaycaster.far = 4.8;
        const rawSnapHits = this.groundRaycaster.intersectObjects(this.colliders, true);
        for (const hit of rawSnapHits) {
          if (isPlayerChild(hit.object) || !hit.face) continue;
          const norm = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
          if (norm.y >= 0.4 && hit.point.y <= this.mesh.position.y + 0.55 && hit.point.y >= this.mesh.position.y - 2.4) {
            supportY = Math.max(supportY, hit.point.y);
            break;
          }
        }
      }
      this.mesh.position.y = supportY;
    }

    // Trigger recorded footsteps from grounded locomotion, after movement and
    // floor snapping. The source material selects a random prepared sample.
    const canStep = isMoving && this.isGrounded && !this.isAttacking && !this.isMovementLocked;
    if (canStep) {
      this.footstepClock += Math.min(delta, 0.1);
      const stepPeriod = isSprinting ? 0.34 : 0.49;
      if (this.footstepClock >= stepPeriod) {
        this.footstepClock %= stepPeriod;
        const audioManager = (window as any).gameInstance?.audioManager;
        if (audioManager?.playFootstep) {
          const object = validGroundHit?.object;
          const surfaceParts: string[] = [];
          let surfaceObject: THREE.Object3D | null = object ?? null;
          while (surfaceObject) {
            if (surfaceObject.name) surfaceParts.push(surfaceObject.name.toLowerCase());
            const materials = (surfaceObject as THREE.Mesh).material;
            if (materials) {
              for (const material of Array.isArray(materials) ? materials : [materials]) {
                if (material.name) surfaceParts.push(material.name.toLowerCase());
              }
            }
            surfaceObject = surfaceObject.parent;
          }
          const surfaceId = surfaceParts.join(' ');
          const naturalSurface = /grass|terrain|ground|soil|earth|sand|dirt|lawn|field|meadow/.test(surfaceId);
          const hardSurface = /stone|path|pavement|brick|wood|timber|floor|temple|pavilion|stair|step|bridge|platform|basalt|marble|tile|causeway|crypt/.test(surfaceId);
          // Natural terrain has no collision mesh and therefore falls back to
          // grass; named structure/path colliders use the supplied walk set.
          audioManager.playFootstep(hardSurface && !naturalSurface ? 'walk' : 'grass', isSprinting);
        }
      }
    } else {
      this.footstepClock = 0;
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
              if (normal.dot(dir) > 0) normal.negate();
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
    const targetModelY = this.visualModelBasePosition.y + targetVisualY;
    this.visualModel.position.y = THREE.MathUtils.lerp(this.visualModel.position.y, targetModelY, delta * 12.0);
    this.damageFlinchRemaining = Math.max(0, this.damageFlinchRemaining - delta);
    const flinchProgress = 1 - this.damageFlinchRemaining / 0.28;
    this.visualModel.rotation.z = this.defaultVisualRotationZ + Math.sin(flinchProgress * Math.PI) * 0.09;

    // 5. Select Animation State — always use Run for any movement (Walk = Run at lower speed)
    // The supplied wukong_falling_air clip is for high falls. Normal jumps keep
    // their jump pose through the short descent instead of snapping into a
    // slow, hunched free-fall animation at the apex.
    const highFall = this.velocity.y < -8.0 && this.airApexY - this.mesh.position.y > 2.0;
    if (!this.isGrounded && !this.isAttacking && highFall) {
      this.animationController.playState('Fall', 0.12);
    } else if (this.isGrounded && !this.isAttacking) {
      if (isMoving) {
        this.animationController.playState(isSprinting ? 'Sprint' : 'Run');
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
    this.animationController.update(animationDelta);

    // 7. Abyss Death (Fall off map)
    if (this.mesh.position.y < -10 && !this.isMovementLocked) {
      this.respawnFromAbyss();
    }
  }

  /** Let a new player command cancel only the temporary damage reaction. */
  public interruptHitReactionForCommand(input?: InputManager): void {
    if (this.isDying || this.isControlsLocked || this.isMovementLocked) return;

    let nextState: 'Idle' | 'Run' | 'Sprint' | 'Jump' | 'Fall' = 'Idle';
    if (!this.isGrounded) {
      const highFall = this.velocity.y < -8 && this.airApexY - this.mesh.position.y > 2;
      nextState = highFall ? 'Fall' : 'Jump';
    } else if (input) {
      const moving = input.moveForward || input.moveBackward || input.moveLeft || input.moveRight ||
        Math.hypot(input.touchAnalogX, input.touchAnalogZ) > 0.15;
      if (moving) {
        const touchMagnitude = Math.hypot(input.touchAnalogX, input.touchAnalogZ);
        nextState = input.isRunning || touchMagnitude > 0.45 ? 'Sprint' : 'Run';
      }
    } else if (Math.hypot(this.velocity.x, this.velocity.z) > 0.08) {
      nextState = 'Run';
    }

    this.animationController.interruptHitReaction(nextState);
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
      this.attackAura.trigger();
    }
  }

  public attachStaffToBack(): void {
    if (!this.hasStaff) return;
    this.attackAura.stop();
    if (this.staffHandMesh) this.staffHandMesh.visible = false;
    if (this.staffBackMesh) {
      this.staffBackMesh.visible = true;
      // Clean staff on back: NO permanent aura, NO glow, NO floating particles
      if (this.wandEffect && this.wandEffect.wandMesh) {
        this.wandEffect.wandMesh.visible = false;
      }
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
