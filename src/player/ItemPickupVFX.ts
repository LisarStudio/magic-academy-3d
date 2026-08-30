import * as THREE from 'three';
import { PlayerController } from './PlayerController';

export class ItemPickupVFX {
  /**
   * Finds the hand bone node in Wukong's GLTF hierarchy, or falls back to a hand-height socket group.
   */
  public static findHandNode(player: PlayerController): THREE.Object3D {
    let handNode: THREE.Object3D | null = null;
    player.mesh.traverse((child) => {
      if (handNode) return;
      const name = child.name.toLowerCase();
      if (
        name.includes('righthand') ||
        name.includes('hand_r') ||
        name.includes('hand.r') ||
        name.includes('wrist_r') ||
        name.includes('mixamorigrighthand') ||
        name.includes('handr')
      ) {
        handNode = child;
      }
    });

    if (handNode) return handNode;

    // Fallback: create socket placed at character right hand height
    let socket = player.mesh.getObjectByName('item_hand_socket');
    if (!socket) {
      socket = new THREE.Group();
      socket.name = 'item_hand_socket';
      socket.position.set(0.3, 1.25, 0.35); // Approx hand position
      player.mesh.add(socket);
    }
    return socket;
  }

  /**
   * Plays the full epic Nintendo-style Item Pickup presentation.
   */
  public static playEpicPickup(
    player: PlayerController,
    _scene: THREE.Scene,
    itemType: 'key' | 'staff' | 'coin',
    onComplete: () => void
  ): void {
    // 1. Lock controls
    player.isControlsLocked = true;
    player.isMovementLocked = true;
    player.velocity.set(0, 0, 0);

    const handNode = this.findHandNode(player);

    // 2. Build held item mesh
    const itemGroup = new THREE.Group();
    itemGroup.name = 'epic_held_item';

    if (itemType === 'key') {
      // Golden key geometry with glowing emissive core
      const ringGeo = new THREE.TorusGeometry(0.12, 0.035, 12, 24);
      const shaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 12);
      const tooth1 = new THREE.BoxGeometry(0.08, 0.03, 0.08);
      const tooth2 = new THREE.BoxGeometry(0.06, 0.03, 0.06);

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xaa6600,
        emissiveIntensity: 0.6,
      });

      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.position.y = 0.2;

      const shaft = new THREE.Mesh(shaftGeo, goldMat);
      shaft.position.y = -0.05;

      const t1 = new THREE.Mesh(tooth1, goldMat);
      t1.position.set(0.04, -0.18, 0);

      const t2 = new THREE.Mesh(tooth2, goldMat);
      t2.position.set(0.03, -0.23, 0);

      itemGroup.add(ring, shaft, t1, t2);
      itemGroup.scale.setScalar(1.2);
    } else if (itemType === 'staff') {
      // Magic Staff with glowing orb
      const staffGeo = new THREE.CylinderGeometry(0.03, 0.035, 1.4, 12);
      const orbGeo = new THREE.SphereGeometry(0.12, 16, 16);

      const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.7 });
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x00bfff,
        emissiveIntensity: 1.5,
        roughness: 0.1,
      });

      const shaft = new THREE.Mesh(staffGeo, woodMat);
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.y = 0.7;

      itemGroup.add(shaft, orb);
    }

    // Attach item to hand
    handNode.add(itemGroup);

    // 3. Create hero PointLight near hand/torso to illuminate Wukong
    const lightColor = itemType === 'staff' ? 0x00e5ff : 0xffaa00;
    const heroLight = new THREE.PointLight(lightColor, 4.5, 6.0);
    heroLight.position.set(0, 0.2, 0.2);
    itemGroup.add(heroLight);

    // 4. Create swirling stars/sparks around player
    const sparkCount = 18;
    const sparks: THREE.Mesh[] = [];
    const sparkVels: THREE.Vector3[] = [];

    const sparkGeo = new THREE.OctahedronGeometry(0.04, 0);
    const sparkColors = [0xffd700, 0xffaa00, 0xffffff, 0xffe066];

    for (let i = 0; i < sparkCount; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: sparkColors[i % sparkColors.length],
        transparent: true,
        opacity: 0.9,
      });
      const spark = new THREE.Mesh(sparkGeo, mat);
      const angle = (i / sparkCount) * Math.PI * 2;
      const radius = 0.4 + Math.random() * 0.4;
      spark.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 0.8,
        Math.sin(angle) * radius
      );
      itemGroup.add(spark);
      sparks.push(spark);
      sparkVels.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        0.5 + Math.random() * 0.8,
        (Math.random() - 0.5) * 0.8
      ));
    }

    // 5. Play TakeItem animation clip
    player.animationController.playTakeItemAnimation(() => {
      // Cleanup after clip finishes
    });

    // 6. Presentation animation loop over ~2.0 seconds
    let elapsed = 0;
    const duration = 2.0;

    const animateSeq = () => {
      elapsed += 0.016;
      const t = Math.min(1.0, elapsed / duration);

      // Rotate item in hand
      itemGroup.rotation.y += 0.05;

      // Pulse PointLight intensity (glow wave)
      heroLight.intensity = (3.5 + Math.sin(elapsed * 10) * 1.5) * (1.0 - Math.max(0, (t - 0.7) / 0.3));

      // Swirl sparks upward
      sparks.forEach((sp, idx) => {
        sp.position.addScaledVector(sparkVels[idx], 0.016);
        sp.rotation.x += 0.1;
        sp.rotation.y += 0.1;
        (sp.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1.0 - t * 1.2);
      });

      if (elapsed < duration) {
        requestAnimationFrame(animateSeq);
      } else {
        // Fade out & cleanup
        handNode.remove(itemGroup);

        // Dispose temp meshes/materials
        itemGroup.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            (c as THREE.Mesh).geometry.dispose();
            const mat = (c as THREE.Mesh).material;
            if (Array.isArray(mat)) mat.forEach(m => m.dispose());
            else mat.dispose();
          }
        });

        // Restore player control
        player.isControlsLocked = false;
        player.isMovementLocked = false;

        // Callback (awards item / unlocks doors / updates state)
        onComplete();
      }
    };

    requestAnimationFrame(animateSeq);
  }
}
