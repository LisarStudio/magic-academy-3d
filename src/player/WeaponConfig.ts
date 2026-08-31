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
    description: 'Báculo legendario del Rey Mono forjado en cinabrio sagrado y oro imperial. Permite ejecutar la técnica de golpe marcial atack_wood.',
    icon: '🥢',
    animationSet: 'WOOD',
    attackAnimation: 'atack_wood',
    backAttachment: {
      boneNameSubstrings: ['spine2', 'chest', 'upperchest'],
      fallbackBoneNames: ['spine1', 'spine'],
      // Position snug against thoracic upper back, lower-left to upper-right diagonal [/]
      position: new THREE.Vector3(0.02, 0.06, -0.11),
      rotation: new THREE.Euler(0.08, 0.0, -0.65, 'XYZ')
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
