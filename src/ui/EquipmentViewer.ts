import * as THREE from 'three';
import { PlayerController } from '../player/PlayerController';
import { StaffFactory } from '../player/StaffFactory';
import { type WeaponType, WEAPON_DEFINITIONS } from '../player/WeaponConfig';
import type { StaffUpgradeInfo } from '../collectibles/PowerOrbSystem';

interface StaffUpgradeAccess {
  getStaffUpgradeInfo(): StaffUpgradeInfo;
  purchaseStaffUpgrade(): 'upgraded' | 'insufficient' | 'max';
}

export class EquipmentViewer {
  private player: PlayerController;
  private progression: StaffUpgradeAccess;
  private canvas: HTMLCanvasElement | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private previewMesh: THREE.Group | null = null;
  private isDragging = false;
  private lastPointerX = 0;
  private isVisible = false;
  private animFrameId: number | null = null;
  private clock = new THREE.Clock();
  private upgradeFeedback = '';
  private resizeObserver: ResizeObserver | null = null;

  constructor(player: PlayerController, progression: StaffUpgradeAccess) {
    this.player = player;
    this.progression = progression;
    this.initDOM();
  }

  private initDOM(): void {
    const tabPause = document.getElementById('tab-btn-pause');
    const tabEquip = document.getElementById('tab-btn-equipment');
    const contentPause = document.getElementById('pause-tab-content-pause');
    const contentEquip = document.getElementById('pause-tab-content-equipment');
    tabPause?.addEventListener('click', () => {
      tabPause.classList.add('active'); tabEquip?.classList.remove('active');
      contentPause?.classList.remove('hidden'); contentEquip?.classList.add('hidden');
      this.hide3DPreview();
    });
    tabEquip?.addEventListener('click', () => {
      tabEquip.classList.add('active'); tabPause?.classList.remove('active');
      contentPause?.classList.add('hidden'); contentEquip?.classList.remove('hidden');
      this.show3DPreview(); this.renderWeaponList();
    });
    this.canvas = document.getElementById('equipment-canvas') as HTMLCanvasElement | null;
    if (this.canvas) this.bindDragEvents(this.canvas);
  }

  public onPauseOpened(): void {
    const tabPause = document.getElementById('tab-btn-pause');
    const tabEquip = document.getElementById('tab-btn-equipment');
    const contentPause = document.getElementById('pause-tab-content-pause');
    const contentEquip = document.getElementById('pause-tab-content-equipment');
    if (tabPause?.classList.contains('active')) {
      contentPause?.classList.remove('hidden'); contentEquip?.classList.add('hidden'); this.hide3DPreview();
    } else if (tabEquip?.classList.contains('active')) {
      contentPause?.classList.add('hidden'); contentEquip?.classList.remove('hidden');
      this.show3DPreview(); this.renderWeaponList();
    }
  }

  public onPauseClosed(): void { this.hide3DPreview(); }

  private initThreeScene(): void {
    if (!this.canvas) return;
    const width = this.canvas.clientWidth || 280;
    const height = this.canvas.clientHeight || 280;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 20);
    this.camera.position.set(0, 0, 2.25);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const key = new THREE.DirectionalLight(0xffe6a3, 2.2); key.position.set(2, 3, 3); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x3df3ff, 1.7); rim.position.set(-2, 1, -2); this.scene.add(rim);
    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => {
      if (!this.canvas || !this.renderer || !this.camera) return;
      const w = this.canvas.clientWidth || 280;
      const h = this.canvas.clientHeight || 280;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    });
    this.resizeObserver.observe(this.canvas);
    this.rebuildPreviewModel();
  }

  private rebuildPreviewModel(): void {
    if (!this.scene) return;
    const previousRotationY = this.previewMesh?.rotation.y ?? 0;
    if (this.previewMesh) this.scene.remove(this.previewMesh);
    const staff = StaffFactory.createStaff('equipment_staff_preview');
    // StaffFactory builds the shaft around its midpoint, making the origin the
    // true pivot and keeping it centered during both drag and idle rotation.
    staff.position.set(0, 0, 0);
    staff.rotation.set(0, previousRotationY, -0.52);
    staff.scale.setScalar(1.35);
    this.previewMesh = staff;
    this.scene.add(staff);
  }

  public show3DPreview(): void {
    if (!this.renderer) this.initThreeScene(); else this.rebuildPreviewModel();
    this.isVisible = true;
    this.clock.start();
    this.renderLoop();
  }

  public hide3DPreview(): void {
    this.isVisible = false;
    if (this.animFrameId !== null) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null; }
  }

  private renderLoop = (): void => {
    if (!this.isVisible) return;
    this.animFrameId = requestAnimationFrame(this.renderLoop);
    const delta = this.clock.getDelta();
    if (!this.isDragging && this.previewMesh) this.previewMesh.rotation.y += delta * 0.32;
    if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
  };

  private bindDragEvents(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('pointerdown', (event) => {
      this.isDragging = true; this.lastPointerX = event.clientX; canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!this.isDragging || !this.previewMesh) return;
      this.previewMesh.rotation.y += (event.clientX - this.lastPointerX) * 0.015;
      this.lastPointerX = event.clientX;
    });
    const stop = () => { this.isDragging = false; };
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('lostpointercapture', stop);
  }

  public renderWeaponList(): void {
    const listEl = document.getElementById('equipment-weapon-list');
    if (listEl) {
      listEl.innerHTML = '';
      if (this.player.ownedWeapons.size === 0) {
        listEl.innerHTML = `<div class="equipment-empty-hint"><div style="font-size:28px;margin-bottom:8px">🗝️</div><div style="font-weight:bold;color:#ffd700;margin-bottom:4px">Sin armas equipables</div><div style="font-size:12px;color:#a0aec0;line-height:1.4">Explora el santuario y abre el cofre sagrado para obtener el Báculo Sagrado.</div></div>`;
      } else {
        this.player.ownedWeapons.forEach((weaponId: WeaponType) => {
          const def = WEAPON_DEFINITIONS[weaponId];
          const isEquipped = this.player.equippedWeapon === weaponId;
          const card = document.createElement('div');
          card.className = `weapon-card ${isEquipped ? 'equipped' : ''}`;
          card.innerHTML = `<div class="weapon-card-header"><div class="weapon-icon">${def.icon}</div><div class="weapon-info"><div class="weapon-name">${def.name}</div><div class="weapon-type">${def.category}</div></div><div class="weapon-badge ${isEquipped ? 'badge-equipped' : 'badge-stored'}">${isEquipped ? '✓ EQUIPADO' : 'NO EQUIPADO'}</div></div><div class="weapon-desc">${def.description}</div><div class="weapon-actions"><button class="btn-equip-action ${isEquipped ? 'unequip' : 'equip'}">${isEquipped ? 'DESEQUIPAR' : 'EQUIPAR'}</button></div>`;
          listEl.appendChild(card);
          card.querySelector('button')?.addEventListener('click', (event) => {
            event.preventDefault(); event.stopPropagation();
            if (isEquipped) this.player.unequipWeapon(); else this.player.equipWeapon(weaponId);
            this.rebuildPreviewModel(); this.renderWeaponList();
          });
        });
      }
    }
    this.renderUpgradePanel();
  }

  public refreshProgression(): void { if (this.isVisible) this.renderUpgradePanel(); }

  private renderUpgradePanel(): void {
    const panel = document.getElementById('staff-upgrade-panel');
    if (!panel) return;
    const info = this.progression.getStaffUpgradeInfo();
    const ownsStaff = this.player.ownedWeapons.has('STAFF');
    const nextDamage = info.nextDamageMultiplier === null ? '—' : `${Math.round(info.nextDamageMultiplier * 100)}%`;
    const price = info.nextCost === null ? 'Nivel máximo' : `${info.nextCost} orbes`;
    panel.innerHTML = `<div class="equipment-section-title">MEJORAR BÁCULO</div><div class="staff-upgrade-card"><p class="staff-upgrade-lore">Cuenta la leyenda que este báculo descansaba en las profundidades del Palacio del Dragón, hasta que el Rey Mono reclamó su poder. Capaz de cambiar de tamaño y obedecer únicamente a su verdadero portador, su fuerza despierta con cada desafío superado.</p><div class="staff-upgrade-stats"><span>Nivel ${info.level} / 5</span><span>Daño ${Math.round(info.damageMultiplier * 100)}%</span></div><div class="staff-upgrade-stats"><span>Orbes disponibles</span><strong>✦ ${info.orbs}</strong></div><div class="staff-upgrade-stats"><span>Siguiente nivel</span><span>${nextDamage}</span></div><button id="btn-upgrade-staff" class="btn-magic primary staff-upgrade-button" ${!ownsStaff || info.level >= 5 ? 'disabled' : ''}>${ownsStaff ? `MEJORAR · ${price}` : 'ENCUENTRA EL BÁCULO'}</button><p class="staff-upgrade-feedback" role="status">${this.upgradeFeedback}</p></div>`;
    panel.querySelector('#btn-upgrade-staff')?.addEventListener('click', (event) => {
      event.preventDefault();
      if (!ownsStaff) return;
      const result = this.progression.purchaseStaffUpgrade();
      this.upgradeFeedback = result === 'upgraded' ? '¡Mejora desbloqueada!' : result === 'insufficient' ? 'Aún necesitas más orbes.' : 'El báculo alcanzó su máximo poder.';
      this.renderUpgradePanel();
    });
  }
}
