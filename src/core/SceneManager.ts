import * as THREE from 'three';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public dirLight!: THREE.DirectionalLight;
  public ambientLight!: THREE.AmbientLight;

  constructor(canvas: HTMLCanvasElement) {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0918); // Dark atmospheric night blue
    this.scene.fog = new THREE.FogExp2(0x0a0918, 0.025);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    this.camera.position.set(0, 3, 5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3; // Slightly brighter for dramatic night scene

    // 4. Lighting
    this.setupLighting();

    // 5. Window Resize Listener
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupLighting(): void {
    // Ambient moon glow
    this.ambientLight = new THREE.AmbientLight(0x404870, 1.0); // Stronger ambient for night scene readability
    this.scene.add(this.ambientLight);

    // Main moonlight direction
    this.dirLight = new THREE.DirectionalLight(0x7588c4, 1.8); // Stronger for dramatic shadows
    this.dirLight.position.set(20, 40, -10);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 4096;
    this.dirLight.shadow.mapSize.height = 4096;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 150;
    this.dirLight.shadow.radius = 3; // Soft shadow edges

    const shadowSize = 50; // Larger shadow frustum for better coverage
    this.dirLight.shadow.camera.left = -shadowSize;
    this.dirLight.shadow.camera.right = shadowSize;
    this.dirLight.shadow.camera.top = shadowSize;
    this.dirLight.shadow.camera.bottom = -shadowSize;
    this.dirLight.shadow.bias = -0.0003;

    this.scene.add(this.dirLight);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public render(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
