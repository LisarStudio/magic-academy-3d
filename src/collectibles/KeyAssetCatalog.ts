import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type ProgressKeyId =
  | 'key1_gekko'
  | 'key2_boss'
  | 'key3_platform'
  | 'key4_curiosity'
  | 'key5_pots'
  | 'key6_gargoyles';

export interface KeyAssetDefinition {
  name: string;
  /** Fixed visual slot in the five-key HUD; never based on pickup order. */
  slotIndex: 0 | 1 | 2 | 3 | 4;
  modelUrl: string;
  iconUrl: string;
  magicColor: number;
}

const root = './assets/keys';

// Five authored keys are present in D:\Wukong\Keys. The sixth progression ID
// (gems/pots) deliberately has no visual assignment until its approved asset is supplied.
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
    // Legacy save/progression ID: this original asset is the Nature key.
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
  key6_gargoyles: {
    name: 'Llave del Secreto',
    slotIndex: 3,
    modelUrl: `${root}/models/llave_de_la_fortaleaza.glb`,
    iconUrl: `${root}/icons/llave_fortaleza_hud.png`,
    magicColor: 0xffbd70,
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
