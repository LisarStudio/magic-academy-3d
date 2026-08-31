import * as THREE from 'three';

export class StaffFactory {
  /**
   * Creates the Mythical Wukong Sacred Bo Staff (Ruyi Jingu Bang).
   * Exact world dimensions: Length = 1.20m, Shaft diameter = 3.0cm (proportional to Wukong's 1.40m height).
   */
  public static createStaff(name = 'wukong_sacred_staff'): THREE.Group {
    const group = new THREE.Group();
    group.name = name;

    // 1. Central Sacred Shaft (Dark Crimson Cinnabar Lacquer + Gold Dragon Luster)
    const shaftGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.20, 16);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x8a1c14,       // Deep sacred crimson
      roughness: 0.25,
      metalness: 0.75,
      emissive: 0x3d0804,
      emissiveIntensity: 0.4,
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);

    // 2. Imperial Gold Dragon Bands (Spiral and Collars)
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x4a3a00,
      emissiveIntensity: 0.3,
    });

    // Top and bottom heavy dragon collars
    const collarGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.12, 16);
    const topCollar = new THREE.Mesh(collarGeo, goldMat);
    topCollar.position.y = 0.46;
    const botCollar = new THREE.Mesh(collarGeo, goldMat);
    botCollar.position.y = -0.46;
    group.add(topCollar, botCollar);

    // 4 Filigree dragon rings
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.005, 8, 16), goldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = (i < 2 ? 0.40 + i * 0.12 : -0.40 - (i - 2) * 0.12);
      group.add(ring);
    }

    // 3. Glowing Radiant Azure Crystal Tips
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 2.2,
      roughness: 0.05,
      metalness: 0.1,
    });
    const tipGeo = new THREE.OctahedronGeometry(0.030, 0);
    const topTip = new THREE.Mesh(tipGeo, crystalMat);
    topTip.position.y = 0.60;
    const botTip = new THREE.Mesh(tipGeo, crystalMat);
    botTip.position.y = -0.60;
    group.add(topTip, botTip);

    return group;
  }
}
