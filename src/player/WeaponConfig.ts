import * as THREE from 'three';

export type WeaponType = 'STAFF' | 'SWORD' | 'SPEAR';

export interface WeaponAttachmentConfig {
  boneNameSubstrings: string[];
  fallbackBoneNames: string[];
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export interface WeaponDefinition {
  id: WeaponType;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  icon: string;
  animationSet: 'WOOD' | 'NOWOOD';
  attackAnimation: string;
  backAttachment: WeaponAttachmentConfig;
  handAttachment: WeaponAttachmentConfig;
}

/**
 * Global shared weapon attachment configurations.
 * Used by BOTH the Gameplay PlayerController and the EquipmentViewer 3D Preview.
 */
export const WEAPON_DEFINITIONS: Record<WeaponType, WeaponDefinition> = {
  STAFF: {
    id: 'STAFF',
    name: 'Báculo Sagrado (Ruyi Jingu Bang)',
    subtitle: 'Arma Mítica de Cinabrio y Oro Imperial',
    category: 'Arma de Combate Cuerpo a Cuerpo',
    description: 'Ruyi Jingu Bang: cuenta la leyenda que descansaba en las profundidades del Palacio del Dragón hasta que el Rey Mono reclamó su poder. Cambia de tamaño, obedece a su portador y despierta con cada desafío.',
    icon: '🥢',
    animationSet: 'WOOD',
    attackAnimation: 'atack_wood',
    backAttachment: {
      boneNameSubstrings: ['spine2', 'chest', 'upperchest'],
      fallbackBoneNames: ['spine1', 'spine'],
      // Calibrated against mixamorigSpine2 in metres; negative local Z keeps
      // the staff just behind the back rather than in front of the chest.
      position: new THREE.Vector3(0.04, -0.08, -0.18),
      // baculo.glb carries its own ~27 degree axis rotation, so this socket
      // roll produces the intended shoulder-to-opposite-hip diagonal.
      rotation: new THREE.Euler(0.04, -0.04, 1.26, 'XYZ')
    },
    handAttachment: {
      boneNameSubstrings: ['righthand'],
      fallbackBoneNames: ['hand_r', 'hand.r', 'right_hand'],
      position: new THREE.Vector3(0, 0.06, 0),
      rotation: new THREE.Euler(Math.PI * 0.5, 0, 0, 'XYZ')
    }
  },
  SWORD: {
    id: 'SWORD',
    name: 'Espada de Jade Celestial',
    subtitle: 'Hoja Encantada de la Academia',
    category: 'Arma de Filo Cortante',
    description: 'Espada forjada con jade místico y runas arcanas.',
    icon: '🗡️',
    animationSet: 'WOOD',
    attackAnimation: 'atack_wood',
    backAttachment: {
      boneNameSubstrings: ['spine2', 'chest', 'upperchest'],
      fallbackBoneNames: ['spine1', 'spine'],
      position: new THREE.Vector3(-0.02, 0.06, -0.11),
      rotation: new THREE.Euler(0.08, 0.0, 0.65, 'XYZ')
    },
    handAttachment: {
      boneNameSubstrings: ['righthand'],
      fallbackBoneNames: ['hand_r', 'hand.r', 'right_hand'],
      position: new THREE.Vector3(0, 0.06, 0),
      rotation: new THREE.Euler(Math.PI * 0.5, 0, 0, 'XYZ')
    }
  },
  SPEAR: {
    id: 'SPEAR',
    name: 'Lanza del Dragón del Viento',
    subtitle: 'Arma de Asta Épica',
    category: 'Arma de Asta y Alcance',
    description: 'Lanza sagrada que canaliza los vientos del reino.',
    icon: '🔱',
    animationSet: 'WOOD',
    attackAnimation: 'atack_wood',
    backAttachment: {
      boneNameSubstrings: ['spine2', 'chest', 'upperchest'],
      fallbackBoneNames: ['spine1', 'spine'],
      position: new THREE.Vector3(0.02, 0.06, -0.11),
      rotation: new THREE.Euler(0.08, 0.0, -0.65, 'XYZ')
    },
    handAttachment: {
      boneNameSubstrings: ['righthand'],
      fallbackBoneNames: ['hand_r', 'hand.r', 'right_hand'],
      position: new THREE.Vector3(0, 0.06, 0),
      rotation: new THREE.Euler(Math.PI * 0.5, 0, 0, 'XYZ')
    }
  }
};
