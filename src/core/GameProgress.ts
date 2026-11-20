import type { SaveData } from './SaveSlotStore';

interface ProgressObjective {
  id: string;
  label: string;
  complete: (save: SaveData) => boolean;
}

export interface RegisteredLevelProgress {
  id: string;
  name: string;
  implemented: boolean;
  objectives: ProgressObjective[];
}

const flags = (save: SaveData): Record<string, unknown> =>
  save.stateFlags && typeof save.stateFlags === 'object' ? save.stateFlags as Record<string, unknown> : {};

/** Add future level records here; the overall percentage recalculates from
 * registered objective milestones instead of treating the first level as the
 * whole adventure. Only implemented levels contribute until more are added. */
export const GAME_LEVEL_PROGRESS: RegisteredLevelProgress[] = [
  {
    id: 'magic-academy-3d',
    name: 'Reino Celestial · Nivel introductorio',
    implemented: true,
    objectives: [
      { id: 'arrival', label: 'Inicio de aventura', complete: (save) => flags(save).introCompleted === true },
      { id: 'staff', label: 'Báculo encontrado', complete: (save) => flags(save).staffFound === true || save.hasStaff === true },
      { id: 'gekko', label: 'Misión de Gekko', complete: (save) => save.gekkoMissionState === 'REWARD_GIVEN' },
      { id: 'nezha', label: 'Nezha-X derrotado', complete: (save) => flags(save).bossDefeated === true },
      { id: 'keys', label: 'Seis llaves obtenidas', complete: (save) => Number(save.totalKeysCount) >= 6 },
      { id: 'letter', label: 'Letras de Wukong reunidas', complete: (save) => save.letterChallengeCompleted === true },
      { id: 'tree', label: 'Desafío del árbol completado', complete: (save) => save.collectedKeys?.key6_qi_celestial === true },
      { id: 'cat', label: 'Maneki Neko encontrado', complete: (save) => save.manekiNekoCollected === true },
      { id: 'level', label: 'Nivel completado', complete: (save) => flags(save).levelCompleted === true },
    ],
  },
];

export interface SaveProgressSummary {
  levelName: string;
  levelPercent: number;
  implementedContentPercent: number;
  playedSeconds: number;
  completedMilestones: number;
  totalMilestones: number;
}

export function getSaveProgress(save: SaveData): SaveProgressSummary {
  const implemented = GAME_LEVEL_PROGRESS.filter((level) => level.implemented);
  let done = 0;
  let total = 0;
  for (const level of implemented) {
    const completed = level.objectives.filter((objective) => objective.complete(save)).length;
    done += completed;
    total += level.objectives.length;
  }
  const level = GAME_LEVEL_PROGRESS.find((entry) => entry.id === save.levelId) ?? implemented[0];
  const levelDone = level ? level.objectives.filter((objective) => objective.complete(save)).length : 0;
  const levelTotal = level?.objectives.length ?? 0;
  return {
    levelName: level?.name ?? 'Nivel no registrado',
    levelPercent: levelTotal ? Math.round((levelDone / levelTotal) * 100) : 0,
    implementedContentPercent: total ? Math.round((done / total) * 100) : 0,
    playedSeconds: Math.max(0, Math.floor(Number(save.playTimeSeconds) || 0)),
    completedMilestones: levelDone,
    totalMilestones: levelTotal,
  };
}

export function formatPlayTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}
