import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type ProgressKeyId =
  | 'key1_gekko'
  | 'key2_boss'
  | 'key3_platform'
  | 'key4_curiosity'
  | 'key5_pots'
  | 'key6_qi_celestial';

export interface KeyAssetDefinition {
  name: string;
  /** Fixed visual slot in the progression HUD; never based on pickup order. */
  slotIndex: 0 | 1 | 2 | 3 | 4 | 5;
  modelUrl: string;
  iconUrl: string;
  magicColor: number;
}

// Use Vite's deployment base rather than a document-relative URL. A relative
// `./assets/...` path breaks when the game is opened from a nested/local route
// or after a host rewrites the page path, leaving acquired-key icons broken.
const root = `${import.meta.env.BASE_URL}assets/keys`;

// All six progression keys have dedicated visual entries; key5_pots uses a unique procedural model.
export const KEY_ASSETS: Partial<Record<ProgressKeyId, KeyAssetDefinition>> = {
  key1_gekko: {
    name: 'Llave de la Riqueza',
    slotIndex: 1,
    modelUrl: `${root}/models/llave_de_la_riqueza.glb`,
    iconUrl: `${root}/icons/llave_riqueza_hud.png`,
    magicColor: 0xffc94e,
  },
  key2_boss: {
    name: 'Llave de la Valentía',
    slotIndex: 2,
    modelUrl: `${root}/models/llave_del_aura.glb`,
    iconUrl: `${root}/icons/llave_aura_hud.png`,
    magicColor: 0x62dfff,
  },
  key3_platform: {
    // Preserve the original fixed world pickup and its dedicated HUD art.
    name: 'Llave de la Naturaleza',
    slotIndex: 4,
    modelUrl: `${root}/models/llave_de_la_naturaleza.glb`,
    iconUrl: `${root}/icons/llave_naturaleza.png`,
    magicColor: 0x79e6a3,
  },
  key4_curiosity: {
    name: 'Llave de la Curiosidad',
    slotIndex: 0,
    modelUrl: `${root}/models/llave_del_misterio.glb`,
    iconUrl: `${root}/icons/llave_misterio_hud.png`,
    magicColor: 0xc49aff,
  },
  key6_qi_celestial: {
    name: 'Llave del Qi Celestial',
    slotIndex: 3,
    modelUrl: `${root}/models/llave_qi_celestial.glb`,
    iconUrl: `${root}/icons/llave_qi_celestial.png`,
    magicColor: 0xffc54e,
  },
  key5_pots: {
    name: 'Llave de Destrucción (Gemas)',
    slotIndex: 5,
    modelUrl: '',
    iconUrl: `${root}/icons/llave_gemas_hud.svg`,
    magicColor: 0xff493c,
  },
};

const loader = new GLTFLoader();
const modelCache = new Map<string, Promise<THREE.Group>>();

export function getKeyAsset(id: string): KeyAssetDefinition | undefined {
  return KEY_ASSETS[id as ProgressKeyId];
}

export function loadKeyModel(id: string): Promise<THREE.Group> {
  const asset = getKeyAsset(id);
  if (!asset) return Promise.reject(new Error(`No hay un modelo aprobado asignado a ${id}`));

  if (id === 'key5_pots') {
    const gold = new THREE.MeshStandardMaterial({ color: 0xffc84a, metalness: 0.72, roughness: 0.28, emissive: 0x6b3300, emissiveIntensity: 0.3 });
    const ruby = new THREE.MeshStandardMaterial({ color: 0xc92535, metalness: 0.42, roughness: 0.2, emissive: 0x70101b, emissiveIntensity: 0.55 });
    const key = new THREE.Group();
    key.name = 'authored_key5_pots';
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.055, 8, 24), gold);
    ring.position.y = 0.38;
    key.add(ring);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 1), ruby);
    gem.position.set(0, 0.38, 0.035);
    key.add(gem);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.65, 8), gold);
    shaft.position.y = -0.08;
    key.add(shaft);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 6, 16), gold);
    collar.position.y = -0.4;
    key.add(collar);
    for (const side of [-1, 1]) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.08), gold);
      tooth.position.set(side * 0.09, -0.34, 0);
      key.add(tooth);
    }
    key.scale.setScalar(0.72);
    key.traverse((object) => { if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).castShadow = false; });
    return Promise.resolve(key);
  }

  let modelPromise = modelCache.get(asset.modelUrl);
  if (!modelPromise) {
    modelPromise = loader.loadAsync(asset.modelUrl).then((gltf) => {
      const model = gltf.scene;
      model.name = `authored_key_${id}`;
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = false;
          object.receiveShadow = false;
        }
      });
      return model;
    }).catch((error) => {
      modelCache.delete(asset.modelUrl);
      throw error;
    });
    modelCache.set(asset.modelUrl, modelPromise);
  }

  return modelPromise.then((model) => {
    const instance = model.clone(true);
    instance.scale.setScalar(0.72);
    return instance;
  });
}

export function preloadKeyModel(id: string): Promise<void> {
  return loadKeyModel(id).then(() => undefined);
}
