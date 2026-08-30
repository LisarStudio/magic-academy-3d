import * as THREE from 'three';

export class WandEffect {
  public wandMesh: THREE.Group;
  public tipLight: THREE.PointLight;
  private particles: THREE.Points;
  private particleGeo: THREE.BufferGeometry;
  private particlePositions: Float32Array;
  private particleColors: Float32Array;
  private particleCount = 40;
  private currentHouseColor: THREE.Color;

  constructor() {
    this.wandMesh = new THREE.Group();
    this.wandMesh.visible = false; // Hidden until staff is equipped; light attaches to real báculo
    this.currentHouseColor = new THREE.Color(0x3df3ff); // Default Magic blue

    // NOTE: No shaft/bar geometry here — the visual weapon is the real báculo from player.glb.
    // This group only carries the tip light + particle glow effect,
    // which gets repositioned to the báculo's tip when the staff is equipped.

    // Tip glow light (will be repositioned to báculo tip)
    this.tipLight = new THREE.PointLight(0x3df3ff, 1.8, 4.0);
    this.tipLight.position.set(0, 0, 0);
    this.wandMesh.add(this.tipLight);

    // Particle glow trail (follows báculo tip)
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleColors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * 0.1;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      this.particleColors[i * 3] = 0.2;
      this.particleColors[i * 3 + 1] = 0.8;
      this.particleColors[i * 3 + 2] = 1.0;
    }

    this.particleGeo = new THREE.BufferGeometry();
    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    this.particleGeo.setAttribute('color', new THREE.BufferAttribute(this.particleColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(this.particleGeo, pMat);
    this.wandMesh.add(this.particles);
  }

  public setHouseColor(hexColor: number): void {
    this.currentHouseColor.setHex(hexColor);
    this.tipLight.color.setHex(hexColor);
  }

  public getTipWorldPosition(): THREE.Vector3 {
    const pos = new THREE.Vector3();
    this.tipLight.getWorldPosition(pos);
    return pos;
  }

  public update(_delta: number): void {
    const tipPos = new THREE.Vector3(0, 0, 0.6);
    
    // Shift particle trail back
    for (let i = this.particleCount - 1; i > 0; i--) {
      this.particlePositions[i * 3] = this.particlePositions[(i - 1) * 3] + (Math.random() - 0.5) * 0.01;
      this.particlePositions[i * 3 + 1] = this.particlePositions[(i - 1) * 3 + 1] + (Math.random() - 0.5) * 0.01;
      this.particlePositions[i * 3 + 2] = this.particlePositions[(i - 1) * 3 + 2] - 0.02;

      this.particleColors[i * 3] = this.currentHouseColor.r;
      this.particleColors[i * 3 + 1] = this.currentHouseColor.g;
      this.particleColors[i * 3 + 2] = this.currentHouseColor.b;
    }

    this.particlePositions[0] = tipPos.x;
    this.particlePositions[1] = tipPos.y;
    this.particlePositions[2] = tipPos.z;

    this.particleGeo.attributes.position.needsUpdate = true;
    this.particleGeo.attributes.color.needsUpdate = true;
  }
}
