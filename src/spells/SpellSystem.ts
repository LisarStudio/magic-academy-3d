import * as THREE from 'three';
import type { SpellType } from './SpellProjectile';
import { SpellProjectile } from './SpellProjectile';
import { SpellTarget } from './SpellTarget';
import { EnemyController } from '../enemies/EnemyController';
import { AudioManager } from '../core/AudioManager';
import { DestructiblePot } from '../world/DestructiblePot';
import { TreasureChest } from '../world/TreasureChest';
import { LumosGargoyle } from '../world/LumosGargoyle';
import { CollectibleSystem } from '../collectibles/CollectibleSystem';

import { TargetReticle3D } from './TargetReticle3D';

export class SpellSystem {
  private scene: THREE.Scene;
  private audioManager: AudioManager;
  private collectibleSystem!: CollectibleSystem;
  public reticle3D: TargetReticle3D;

  public projectiles: SpellProjectile[] = [];
  public targets: SpellTarget[] = [];
  public enemies: EnemyController[] = [];
  public pots: DestructiblePot[] = [];
  public chests: TreasureChest[] = [];
  public gargoyles: LumosGargoyle[] = [];

  public activeSpell: SpellType = 'FLIPENDO';
  private spellCooldown = 0;
  public onCollectStaffCallback?: () => void;

  constructor(scene: THREE.Scene, audioManager: AudioManager) {
    this.scene = scene;
    this.audioManager = audioManager;

    this.reticle3D = new TargetReticle3D();
    this.scene.add(this.reticle3D.mesh);
  }

  public setCollectibleSystem(system: CollectibleSystem): void {
    this.collectibleSystem = system;
  }

  public setActiveSpell(spell: SpellType): void {
    if (this.activeSpell !== spell) {
      this.activeSpell = spell;
      this.audioManager.playSpellSwitch();
      console.log(`[SpellSystem] Active spell switched to: ${spell}`);
    }
  }

  public castActiveSpell(origin: THREE.Vector3, direction: THREE.Vector3): boolean {
    if (this.spellCooldown > 0) return false;

    const proj = new SpellProjectile(origin, direction, this.activeSpell);
    this.projectiles.push(proj);
    this.scene.add(proj.mesh);

    if (this.activeSpell === 'FLIPENDO') {
      this.audioManager.playFlipendoCast();
    } else if (this.activeSpell === 'ALOHOMORA') {
      this.audioManager.playAlohomoraCast();
    } else if (this.activeSpell === 'LUMOS') {
      this.audioManager.playLumosCast();
    }

    this.spellCooldown = 0.12;
    return true;
  }

  public registerTarget(target: SpellTarget): void {
    this.targets.push(target);
    this.scene.add(target.mesh);
  }

  public registerEnemy(enemy: EnemyController): void {
    this.enemies.push(enemy);
  }

  public registerPot(pot: DestructiblePot): void {
    this.pots.push(pot);
  }

  public registerChest(chest: TreasureChest): void {
    this.chests.push(chest);
  }

  public registerGargoyle(gargoyle: LumosGargoyle): void {
    this.gargoyles.push(gargoyle);
  }

  public getAimedDirection(originPos: THREE.Vector3, cameraPos: THREE.Vector3, defaultDir: THREE.Vector3): THREE.Vector3 {
    let bestTargetPos: THREE.Vector3 | null = null;
    let bestScore = -Infinity;
    const maxRange = 22.0;

    const checkCandidate = (targetPos: THREE.Vector3, spellMatch: boolean) => {
      const dist = targetPos.distanceTo(cameraPos);
      if (dist > maxRange) return;

      const dirToTarget = targetPos.clone().sub(cameraPos).normalize();
      const dot = defaultDir.dot(dirToTarget);

      // Require target to be in front cone (dot > 0.85 ~ 31 degrees cone from crosshair)
      if (dot > 0.85) {
        // Score combines alignment with crosshair (dot) and proximity
        const spellBonus = spellMatch ? 0.3 : 0;
        const score = dot * 2.0 - (dist / maxRange) * 0.5 + spellBonus;
        if (score > bestScore) {
          bestScore = score;
          bestTargetPos = targetPos.clone();
        }
      }
    };

    // 1. Enemies
    for (const enemy of this.enemies) {
      if (enemy.isAlive()) {
        checkCandidate(enemy.getPosition().clone().add(new THREE.Vector3(0, 0.6, 0)), true);
      }
    }

    // 2. Pots
    for (const pot of this.pots) {
      if (!pot.isBroken) {
        checkCandidate(pot.position.clone().add(new THREE.Vector3(0, 0.4, 0)), this.activeSpell === 'FLIPENDO');
      }
    }

    // 3. Chests
    for (const chest of this.chests) {
      if (!chest.isUnlocked) {
        checkCandidate(chest.position.clone().add(new THREE.Vector3(0, 0.5, 0)), this.activeSpell === 'ALOHOMORA');
      }
    }

    // 4. Gargoyles
    for (const gargoyle of this.gargoyles) {
      if (!gargoyle.isLit) {
        checkCandidate(gargoyle.position.clone().add(new THREE.Vector3(0, 0.6, 0)), this.activeSpell === 'LUMOS');
      }
    }

    // 5. Wall Targets
    for (const target of this.targets) {
      if (!target.isActivated) {
        const wPos = new THREE.Vector3();
        target.mesh.getWorldPosition(wPos);
        checkCandidate(wPos, this.activeSpell === 'FLIPENDO');
      }
    }

    if (bestTargetPos) {
      // Subtle nudge towards target from spell launch origin
      const assistedDir = (bestTargetPos as THREE.Vector3).sub(originPos).normalize();
      // Blend 80% assisted direction with 20% default direction for natural feel
      return defaultDir.clone().lerp(assistedDir, 0.85).normalize();
    }

    return defaultDir.clone();
  }

  public updateTargetLockon(cameraPos: THREE.Vector3, aimDir: THREE.Vector3): void {
    let closestObj: THREE.Object3D | null = null;
    let closestDist = 18.0; // Max targeting range
    let requiredSpell: SpellType | 'TARGET' = 'FLIPENDO';

    // Check Enemies
    for (const enemy of this.enemies) {
      if (enemy.isAlive()) {
        const ePos = enemy.getPosition();
        const dist = ePos.distanceTo(cameraPos);
        const dirToObj = ePos.clone().sub(cameraPos).normalize();
        const dot = aimDir.dot(dirToObj);
        if (dot > 0.85 && dist < closestDist) {
          closestDist = dist;
          closestObj = enemy.mesh;
          requiredSpell = 'FLIPENDO';
        }
      }
    }

    // Check Pots
    for (const pot of this.pots) {
      if (!pot.isBroken) {
        const dist = pot.position.distanceTo(cameraPos);
        const dirToObj = pot.position.clone().sub(cameraPos).normalize();
        const dot = aimDir.dot(dirToObj);
        if (dot > 0.85 && dist < closestDist) {
          closestDist = dist;
          closestObj = pot.mesh;
          requiredSpell = 'FLIPENDO';
        }
      }
    }

    // Check Chests
    for (const chest of this.chests) {
      if (!chest.isUnlocked) {
        const dist = chest.position.distanceTo(cameraPos);
        const dirToObj = chest.position.clone().sub(cameraPos).normalize();
        const dot = aimDir.dot(dirToObj);
        if (dot > 0.85 && dist < closestDist) {
          closestDist = dist;
          closestObj = chest.mesh;
          requiredSpell = 'ALOHOMORA';
        }
      }
    }

    // Check Gargoyles
    for (const gargoyle of this.gargoyles) {
      if (!gargoyle.isLit) {
        const dist = gargoyle.position.distanceTo(cameraPos);
        const dirToObj = gargoyle.position.clone().sub(cameraPos).normalize();
        const dot = aimDir.dot(dirToObj);
        if (dot > 0.85 && dist < closestDist) {
          closestDist = dist;
          closestObj = gargoyle.mesh;
          requiredSpell = 'LUMOS';
        }
      }
    }

    // Check Wall Targets
    for (const target of this.targets) {
      if (!target.isActivated) {
        const worldPos = new THREE.Vector3();
        target.mesh.getWorldPosition(worldPos);
        const dist = worldPos.distanceTo(cameraPos);
        const dirToObj = worldPos.clone().sub(cameraPos).normalize();
        const dot = aimDir.dot(dirToObj);
        if (dot > 0.85 && dist < closestDist) {
          closestDist = dist;
          closestObj = target.mesh;
          requiredSpell = 'FLIPENDO';
        }
      }
    }

    if (closestObj) {
      this.reticle3D.attachTo(closestObj, requiredSpell);
      this.reticle3D.update(cameraPos);
    } else {
      this.reticle3D.detach();
    }
  }

  public update(delta: number, colliders: THREE.Object3D[]): void {
    if (this.spellCooldown > 0) {
      this.spellCooldown -= delta;
    }

    // Update targets
    this.targets.forEach(t => t.update(delta));

    // Update projectiles & check collisions
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.update(delta);

      if (proj.isDead) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      // 1. FLIPENDO vs Pots
      if (proj.spellType === 'FLIPENDO') {
        let hit = false;
        for (const pot of this.pots) {
          if (!pot.isBroken && proj.mesh.position.distanceTo(pot.position) < 1.0) {
            pot.shatter(this.audioManager, this.collectibleSystem);
            this.createImpactParticles(proj.mesh.position, 0x3df3ff);
            proj.isDead = true;
            hit = true;
            break;
          }
        }
        if (hit) {
          this.scene.remove(proj.mesh);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (proj.isDead) continue;

      // 2. ALOHOMORA vs Chests
      if (proj.spellType === 'ALOHOMORA') {
        let hit = false;
        for (const chest of this.chests) {
          if (!chest.isUnlocked && proj.mesh.position.distanceTo(chest.position) < 1.4) {
            chest.unlock(this.audioManager, this.collectibleSystem, this.onCollectStaffCallback);
            this.createImpactParticles(proj.mesh.position, 0xffd700);
            proj.isDead = true;
            hit = true;
            break;
          }
        }
        if (hit) {
          this.scene.remove(proj.mesh);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (proj.isDead) continue;

      // 3. LUMOS vs LumosGargoyles
      if (proj.spellType === 'LUMOS') {
        let hit = false;
        for (const gargoyle of this.gargoyles) {
          if (!gargoyle.isLit && proj.mesh.position.distanceTo(gargoyle.position) < 1.8) {
            gargoyle.activateLumos(this.audioManager, colliders);
            this.createImpactParticles(proj.mesh.position, 0xffff88);
            proj.isDead = true;
            hit = true;
            break;
          }
        }
        if (hit) {
          this.scene.remove(proj.mesh);
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      if (proj.isDead) continue;

      // 4. Collision with Targets
      let targetHit = false;
      for (const target of this.targets) {
        if (!target.isActivated) {
          const targetWorldPos = new THREE.Vector3();
          target.mesh.getWorldPosition(targetWorldPos);
          if (proj.mesh.position.distanceTo(targetWorldPos) < 1.0) {
            target.activate();
            this.audioManager.playTargetHit();
            this.createImpactParticles(proj.mesh.position, 0x3df3ff);
            proj.isDead = true;
            targetHit = true;
            break;
          }
        }
      }
      if (targetHit) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      if (proj.isDead) continue;

      // 5. Collision with Enemies
      let enemyHit = false;
      for (const enemy of this.enemies) {
        if (enemy.isAlive()) {
          const enemyPos = enemy.getPosition();
          if (proj.mesh.position.distanceTo(enemyPos) < 1.2) {
            enemy.takeHit();
            this.audioManager.playEnemyStun();
            this.createImpactParticles(proj.mesh.position, 0x3df3ff);
            proj.isDead = true;
            enemyHit = true;
            break;
          }
        }
      }
      if (enemyHit) {
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }

      if (proj.isDead) continue;

      // 6. Check collision with static level colliders
      const projRay = new THREE.Raycaster(proj.mesh.position, proj.velocity.clone().normalize(), 0, 0.6);
      const hits = projRay.intersectObjects(colliders, true);
      if (hits.length > 0) {
        this.createImpactParticles(proj.mesh.position, 0x3df3ff);
        proj.isDead = true;
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
        continue;
      }
    }
  }

  private createImpactParticles(position: THREE.Vector3, colorHex: number = 0x3df3ff): void {
    const particleCount = 20;
    const geo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = position.x;
      posArray[i * 3 + 1] = position.y;
      posArray[i * 3 + 2] = position.z;

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 4.5
      ));
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.14,
      transparent: true,
      opacity: 1.0
    });
    const pSystem = new THREE.Points(geo, mat);
    this.scene.add(pSystem);

    // Particle burst animation tween
    let age = 0;
    const animateBurst = () => {
      age += 0.016;
      const positions = pSystem.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i].x * 0.016;
        positions[i * 3 + 1] += velocities[i].y * 0.016;
        positions[i * 3 + 2] += velocities[i].z * 0.016;
      }
      pSystem.geometry.attributes.position.needsUpdate = true;
      mat.opacity = Math.max(0, 1.0 - age * 2.5);

      if (age < 0.4) {
        requestAnimationFrame(animateBurst);
      } else {
        this.scene.remove(pSystem);
        geo.dispose();
        mat.dispose();
      }
    };
    animateBurst();
  }
}
