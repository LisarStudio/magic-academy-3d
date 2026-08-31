import * as THREE from 'three';
import { PlayerController } from '../player/PlayerController';
import { StaffFactory } from './../player/StaffFactory';

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
    // Reset to default active tab when pause opens
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

    const width = this.canvas.clientWidth || 300;
    const height = this.canvas.clientHeight || 360;

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

    if (this.previewMesh) {
      this.scene.remove(this.previewMesh);
      this.previewMesh = null;
    }

    // Clone character visual model hierarchy
    const cloned = this.player.visualModel.clone(true) as THREE.Group;
    cloned.position.set(0, 0, 0);
    cloned.rotation.set(0, 0, 0);
    this.previewMesh = cloned;
    this.scene.add(cloned);

    // Attach staff on back if equipped
    let spineBone: THREE.Object3D | null = null;
    cloned.traverse((child) => {
      const n = child.name.toLowerCase();
      if ((n.includes('spine2') || n.includes('chest') || n.includes('upperchest')) && !spineBone) {
        spineBone = child;
      }
    });
    if (!spineBone) {
      cloned.traverse((child) => {
        const n = child.name.toLowerCase();
        if ((n.includes('spine1') || n.includes('spine')) && !spineBone) spineBone = child;
      });
    }

    this.previewStaffBack = StaffFactory.createStaff('preview_staff_back');
    this.previewStaffBack.visible = this.player.staffEquipped;

    if (spineBone) {
      cloned.updateMatrixWorld(true);
      const spineWorldScale = new THREE.Vector3();
      (spineBone as THREE.Object3D).getWorldScale(spineWorldScale);
      const invX = spineWorldScale.x > 0.00001 ? 1.0 / spineWorldScale.x : 1.0;
      const invY = spineWorldScale.y > 0.00001 ? 1.0 / spineWorldScale.y : 1.0;
      const invZ = spineWorldScale.z > 0.00001 ? 1.0 / spineWorldScale.z : 1.0;
      this.previewStaffBack.scale.set(invX, invY, invZ);
      this.previewStaffBack.position.set(0.02, 0.06, -0.11);
      this.previewStaffBack.rotation.set(0.08, 0.0, -0.65);
      (spineBone as THREE.Object3D).add(this.previewStaffBack);
    } else {
      this.previewStaffBack.position.set(0.02, 1.05, -0.11);
      this.previewStaffBack.rotation.set(0.08, 0.0, -0.65);
      cloned.add(this.previewStaffBack);
    }

    // Play Idle Animation
    this.previewMixer = new THREE.AnimationMixer(cloned);
    const idleActionName = this.player.staffEquipped ? 'Wukong_Wood_Idle' : 'Wukong_NoWood_Idle';
    const fallbackIdle = (this.player.animationController as any).allActions?.get(idleActionName) ||
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
    // Mouse Drag Rotation
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

    // Touch Drag Rotation
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

    if (!this.player.hasStaff) {
      listEl.innerHTML = `
        <div class="equipment-empty-hint">
          <div style="font-size: 28px; margin-bottom: 8px;">🗝️</div>
          <div style="font-weight: bold; color: #ffd700; margin-bottom: 4px;">Sin Armas Equipables</div>
          <div style="font-size: 12px; color: #a0aec0; line-height: 1.4;">
            Explora el templo superior y abre el cofre sagrado para obtener el <b>Báculo Mítico</b> del Rey Mono.
          </div>
        </div>
      `;
      return;
    }

    const isEquipped = this.player.staffEquipped;

    const card = document.createElement('div');
    card.className = `weapon-card ${isEquipped ? 'equipped' : ''}`;
    card.innerHTML = `
      <div class="weapon-card-header">
        <div class="weapon-icon">🥢</div>
        <div class="weapon-info">
          <div class="weapon-name">Báculo Sagrado (Ruyi Jingu Bang)</div>
          <div class="weapon-type">Arma de Combate Cuerpo a Cuerpo</div>
        </div>
        <div class="weapon-badge ${isEquipped ? 'badge-equipped' : 'badge-stored'}">
          ${isEquipped ? 'EQUIPADO' : 'GUARDADO'}
        </div>
      </div>
      <div class="weapon-desc">
        Báculo legendario del Rey Mono forjado en cinabrio sagrado y oro imperial. Permite ejecutar la técnica de golpe marcial <i>atack_wood</i>.
      </div>
      <div class="weapon-actions">
        <button id="btn-toggle-equip-staff" class="btn-equip-action ${isEquipped ? 'unequip' : 'equip'}">
          ${isEquipped ? 'DESEQUIPAR BÁCULO' : 'EQUIPAR BÁCULO'}
        </button>
      </div>
    `;

    listEl.appendChild(card);

    const btnToggle = document.getElementById('btn-toggle-equip-staff');
    if (btnToggle) {
      btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.player.staffEquipped) {
          this.player.unequipStaff();
        } else {
          this.player.equipStaff();
        }

        // Refresh UI & 3D preview
        this.rebuildPreviewModel();
        this.renderWeaponList();
      });
    }
  }
}
