import * as THREE from 'three';

export interface StaffUpgradeInfo {
  level: number;
  damageMultiplier: number;
  nextDamageMultiplier: number | null;
  nextCost: number | null;
  orbs: number;
}

/** Separate collectible currency and persistent upgrade track for the sacred staff. */
export class PowerOrbSystem {
  private readonly scene: THREE.Scene;
  private readonly onChange: (count: number) => void;
  private readonly pickups: Array<{ mesh: THREE.Group; value: number; phase: number; baseY: number }> = [];
  private readonly multipliers = [1, 1.1, 1.2, 1.35, 1.5];
  private readonly costs = [100, 250, 500, 900];
  public count = 0;
  public staffLevel = 1;

  constructor(scene: THREE.Scene, onChange: (count: number) => void) {
    this.scene = scene;
    this.onChange = onChange;
  }

  public spawn(position: THREE.Vector3, value = 15): void {
    const root = new THREE.Group();
    root.name = 'wukong_power_orb_pickup';
    root.position.copy(position).add(new THREE.Vector3(0, 0.7, 0));
    const gold = new THREE.MeshStandardMaterial({
      color: 0x6ff5ff,
      emissive: 0x12cfee,
      emissiveIntensity: 2.2,
      metalness: 0.55,
      roughness: 0.24,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.23, 1), gold);
    core.name = 'power_orb_core';
    core.castShadow = false;
    root.add(core);
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.31, 0.035, 6, 20),
      new THREE.MeshBasicMaterial({ color: 0xffdf78, toneMapped: false })
    );
    halo.rotation.x = Math.PI / 2;
    root.add(halo);
    this.scene.add(root);
    this.pickups.push({ mesh: root, value: Math.max(1, Math.floor(value)), phase: Math.random() * Math.PI * 2, baseY: root.position.y });
  }

  public update(delta: number, playerPosition: THREE.Vector3): void {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const pickup = this.pickups[i];
      pickup.mesh.rotation.y += delta * 1.5;
      pickup.mesh.position.y = pickup.baseY + Math.sin(performance.now() / 460 + pickup.phase) * 0.1;
      if (pickup.mesh.position.distanceTo(playerPosition) > 1.45) continue;
      this.count += pickup.value;
      this.scene.remove(pickup.mesh);
      pickup.mesh.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      this.pickups.splice(i, 1);
      this.onChange(this.count);
    }
  }

  public getUpgradeInfo(): StaffUpgradeInfo {
    const level = THREE.MathUtils.clamp(Math.floor(this.staffLevel), 1, 5);
    return {
      level,
      damageMultiplier: this.multipliers[level - 1],
      nextDamageMultiplier: level < 5 ? this.multipliers[level] : null,
      nextCost: level < 5 ? this.costs[level - 1] : null,
      orbs: this.count,
    };
  }

  public getStaffDamage(baseDamage: number): number {
    return baseDamage * this.multipliers[THREE.MathUtils.clamp(this.staffLevel, 1, 5) - 1];
  }

  public upgradeStaff(): 'upgraded' | 'insufficient' | 'max' {
    const info = this.getUpgradeInfo();
    if (info.level >= 5 || info.nextCost === null) return 'max';
    if (this.count < info.nextCost) return 'insufficient';
    this.count = Math.max(0, this.count - info.nextCost);
    this.staffLevel = info.level + 1;
    this.onChange(this.count);
    return 'upgraded';
  }

  public restore(count: number, level: number): void {
    this.count = Math.max(0, Math.floor(Number.isFinite(count) ? count : 0));
    this.staffLevel = THREE.MathUtils.clamp(Math.floor(Number.isFinite(level) ? level : 1), 1, 5);
    this.onChange(this.count);
  }
}
