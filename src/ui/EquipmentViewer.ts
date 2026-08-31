import * as THREE from 'three';
import { PlayerController } from '../player/PlayerController';
import { StaffFactory } from '../player/StaffFactory';
import { type WeaponType, WEAPON_DEFINITIONS } from '../player/WeaponConfig';

export class EquipmentViewer {
  private player: PlayerController;
  private canvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private previewMesh: THREE.Group | null = null;
  private previewMixer: THREE.AnimationMixer | null = null;
  private previewStaffBack: THREE.Group | null = null;

  private isDragging = false;
  private lastPointerX = 0;
  private isVisible = false;
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();

  constructor(player: PlayerController) {
    this.player = player;
    this.initDOM();
  }

  private initDOM(): void {
    const tabPause = document.getElementById('tab-btn-pause');
    const tabEquip = document.getElementById('tab-btn-equipment');
    const contentPause = document.getElementById('pause-tab-content-pause');
    const contentEquip = document.getElementById('pause-tab-content-equipment');

    if (tabPause && tabEquip && contentPause && contentEquip) {
      tabPause.addEventListener('click', () => {
        tabPause.classList.add('active');
        tabEquip.classList.remove('active');
        contentPause.classList.remove('hidden');
        contentEquip.classList.add('hidden');
        this.hide3DPreview();
      });

      tabEquip.addEventListener('click', () => {
        tabEquip.classList.add('active');
        tabPause.classList.remove('active');
        contentPause.classList.add('hidden');
        contentEquip.classList.remove('hidden');
        this.show3DPreview();
        this.renderWeaponList();
      });
    }

    this.canvas = document.getElementById('equipment-canvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.bindDragEvents(this.canvas);
    }
  }

  public onPauseOpened(): void {
    const tabPause = document.getElementById('tab-btn-pause');
    const tabEquip = document.getElementById('tab-btn-equipment');
    const contentPause = document.getElementById('pause-tab-content-pause');
    const contentEquip = document.getElementById('pause-tab-content-equipment');

    if (tabPause?.classList.contains('active')) {
      contentPause?.classList.remove('hidden');
      contentEquip?.classList.add('hidden');
      this.hide3DPreview();
    } else if (tabEquip?.classList.contains('active')) {
      contentPause?.classList.add('hidden');
      contentEquip?.classList.remove('hidden');
      this.show3DPreview();
      this.renderWeaponList();
    }
  }

  public onPauseClosed(): void {
    this.hide3DPreview();
  }

  private initThreeScene(): void {
    if (!this.canvas) return;

    const width = this.canvas.clientWidth || 280;
    const height = this.canvas.clientHeight || 320;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 20);
    this.camera.position.set(0, 0.95, 2.6);
    this.camera.lookAt(0, 0.85, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // Studio Lighting for Equipment Preview
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6a3, 2.0);
    keyLight.position.set(2, 4, 3);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3df3ff, 1.6);
    rimLight.position.set(-2, 2, -2);
    this.scene.add(rimLight);

    // Build Preview Model Clone
    this.rebuildPreviewModel();
  }

  private rebuildPreviewModel(): void {
    if (!this.scene) return;

    let previousRotationY = 0;
    if (this.previewMesh) {
      previousRotationY = this.previewMesh.rotation.y;
      this.scene.remove(this.previewMesh);
      this.previewMesh = null;
    }

    // Clone character visual model hierarchy
    const cloned = this.player.visualModel.clone(true) as THREE.Group;
    cloned.position.set(0, 0, 0);
    cloned.rotation.set(0, previousRotationY, 0);
    this.previewMesh = cloned;
    this.scene.add(cloned);

    // Attach weapon socket using shared configuration
    const def = WEAPON_DEFINITIONS.STAFF;
    let spineBone: THREE.Object3D | null = null;
    cloned.traverse((child) => {
      const n = child.name.toLowerCase();
      if (def.backAttachment.boneNameSubstrings.some(sub => n.includes(sub)) && !spineBone) {
        spineBone = child;
      }
    });
    if (!spineBone) {
      cloned.traverse((child) => {
        const n = child.name.toLowerCase();
        if (def.backAttachment.fallbackBoneNames.some(sub => n.includes(sub)) && !spineBone) spineBone = child;
      });
    }

    this.previewStaffBack = StaffFactory.createStaff('preview_staff_back');
    this.previewStaffBack.visible = this.player.staffEquipped;

    if (spineBone) {
      cloned.updateMatrixWorld(true);
      const spineWorldScale = new THREE.Vector3();
      (spineBone as THREE.Object3D).getWorldScale(spineWorldScale);
      // Strictly uniform scale to guarantee zero deformation in 3D preview
      const uniformInv = spineWorldScale.x > 0.00001 ? 1.0 / spineWorldScale.x : 1.0;
      this.previewStaffBack.scale.set(uniformInv, uniformInv, uniformInv);
      this.previewStaffBack.position.copy(def.backAttachment.position);
      this.previewStaffBack.rotation.copy(def.backAttachment.rotation);
      (spineBone as THREE.Object3D).add(this.previewStaffBack);
    } else {
      this.previewStaffBack.position.set(0.02, 1.05, -0.11);
      this.previewStaffBack.rotation.copy(def.backAttachment.rotation);
      cloned.add(this.previewStaffBack);
    }

    // Play Idle Animation reflecting real equipped state (WOOD vs NOWOOD)
    this.previewMixer = new THREE.AnimationMixer(cloned);
    const idleActionName = this.player.staffEquipped ? 'Idle_Armed' : 'Idle_Unarmed';
    const fallbackIdle = (this.player.animationController as any).allActions?.get(idleActionName) ||
                         (this.player.animationController as any).allActions?.get(this.player.staffEquipped ? 'Wukong_Wood_Idle' : 'Wukong_NoWood_Idle') ||
                         (this.player.animationController as any).allActions?.get('Idle');

    if (fallbackIdle && fallbackIdle.getClip) {
      const clip = fallbackIdle.getClip();
      const action = this.previewMixer.clipAction(clip);
      action.play();
    }
  }

  public show3DPreview(): void {
    if (!this.renderer) {
      this.initThreeScene();
    } else {
      this.rebuildPreviewModel();
    }
    this.isVisible = true;
    this.clock.start();
    this.renderLoop();
  }

  public hide3DPreview(): void {
    this.isVisible = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private renderLoop = (): void => {
    if (!this.isVisible) return;
    this.animFrameId = requestAnimationFrame(this.renderLoop);

    const delta = this.clock.getDelta();
    if (this.previewMixer) {
      this.previewMixer.update(delta);
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  private bindDragEvents(canvas: HTMLCanvasElement): void {
    // Mouse Drag 360° Rotation
    canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging || !this.previewMesh) return;
      const dx = e.clientX - this.lastPointerX;
      this.lastPointerX = e.clientX;
      this.previewMesh.rotation.y += dx * 0.015;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Drag 360° Rotation
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.isDragging = true;
        this.lastPointerX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || !this.previewMesh || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - this.lastPointerX;
      this.lastPointerX = e.touches[0].clientX;
      this.previewMesh.rotation.y += dx * 0.015;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    }, { passive: true });
  }

  public renderWeaponList(): void {
    const listEl = document.getElementById('equipment-weapon-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (this.player.ownedWeapons.size === 0) {
      listEl.innerHTML = `
        <div class="equipment-empty-hint">
          <div style="font-size: 28px; margin-bottom: 8px;">🗝️</div>
          <div style="font-weight: bold; color: #ffd700; margin-bottom: 4px;">Sin Armas Equipables</div>
          <div style="font-size: 12px; color: #a0aec0; line-height: 1.4;">
            Explora el santuario superior y abre el cofre sagrado para obtener el <b>Báculo Mítico</b> del Rey Mono.
          </div>
        </div>
      `;
      return;
    }

    // Render all owned weapons in inventory
    this.player.ownedWeapons.forEach((weaponId: WeaponType) => {
      const def = WEAPON_DEFINITIONS[weaponId];
      const isEquipped = this.player.equippedWeapon === weaponId;

      const card = document.createElement('div');
      card.className = `weapon-card ${isEquipped ? 'equipped' : ''}`;
      card.innerHTML = `
        <div class="weapon-card-header">
          <div class="weapon-icon">${def.icon}</div>
          <div class="weapon-info">
            <div class="weapon-name">${def.name}</div>
            <div class="weapon-type">${def.category}</div>
          </div>
          <div class="weapon-badge ${isEquipped ? 'badge-equipped' : 'badge-stored'}">
            ${isEquipped ? '✓ EQUIPADO' : 'NO EQUIPADO'}
          </div>
        </div>
        <div class="weapon-desc">
          ${def.description}
        </div>
        <div class="weapon-actions">
          <button id="btn-toggle-${weaponId}" class="btn-equip-action ${isEquipped ? 'unequip' : 'equip'}">
            ${isEquipped ? 'DESEQUIPAR' : 'EQUIPAR'}
          </button>
        </div>
      `;

      listEl.appendChild(card);

      const btnToggle = card.querySelector(`#btn-toggle-${weaponId}`);
      if (btnToggle) {
        btnToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          if (isEquipped) {
            this.player.unequipWeapon();
          } else {
            this.player.equipWeapon(weaponId);
          }

          // Instant real-time update in 3D preview and UI
          this.rebuildPreviewModel();
          this.renderWeaponList();
        });
      }
    });
  }
}
