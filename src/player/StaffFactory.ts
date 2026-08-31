import * as THREE from 'three';

export class StaffFactory {
  /**
   * Creates a single, perfectly proportioned, beautiful golden bo staff.
   * Total length: 1.15m, Shaft radius: 0.016m (proportional to Wukong's 1.4m height).
   */
  public static createStaff(name = 'wukong_staff'): THREE.Group {
    const group = new THREE.Group();
    group.name = name;

    // Slender golden bo staff (length = 1.15m, radius = 0.016m)
    const shaftGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.15, 16);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0xd49510,
      metalness: 0.90,
      roughness: 0.20,
      emissive: 0x4a3200,
      emissiveIntensity: 0.35
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    group.add(shaft);

    // Ornate Golden Dragon Collars at top & bottom
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffe066,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x332200,
      emissiveIntensity: 0.2
    });
    const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.007, 8, 16), ringMat);
    topRing.position.y = 0.48;
    topRing.rotation.x = Math.PI / 2;
    const botRing = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.007, 8, 16), ringMat);
    botRing.position.y = -0.48;
    botRing.rotation.x = Math.PI / 2;
    group.add(topRing, botRing);

    // Glowing Azure Crystal Tips
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x3dfff5,
      emissive: 0x3dfff5,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.2
    });
    const topCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.032), crystalMat);
    topCrystal.position.y = 0.56;
    const botCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.032), crystalMat);
    botCrystal.position.y = -0.56;
    group.add(topCrystal, botCrystal);

    return group;
  }
}
