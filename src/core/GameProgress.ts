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
      // Progress follows the five mission portraits and five key slots shown in the level screen.
      { id: 'mission-nezha', label: 'Nezha-X mission', complete: (save) => flags(save).bossDefeated === true || save.collectedKeys?.key2_boss === true },
      { id: 'mission-gekko', label: 'Gekko mission', complete: (save) => save.collectedKeys?.key1_gekko === true || save.gekkoMissionState === 'REWARD_GIVEN' },
      { id: 'mission-twins', label: 'Silvio and Loki mission', complete: (save) => save.letterChallengeCompleted === true || save.manekiNekoCollected === true },
      { id: 'mission-crypt', label: 'Crypt mission', complete: (save) => save.collectedKeys?.key4_curiosity === true },
      { id: 'mission-nature', label: 'Nature tree mission', complete: (save) => save.collectedKeys?.key3_platform === true },
      { id: 'key-curiosity', label: 'Curiosity key', complete: (save) => save.collectedKeys?.key4_curiosity === true },
      { id: 'key-wealth', label: 'Wealth key', complete: (save) => save.collectedKeys?.key1_gekko === true },
      { id: 'key-bravery', label: 'Bravery key', complete: (save) => save.collectedKeys?.key2_boss === true },
      { id: 'key-qi', label: 'Celestial Qi key', complete: (save) => save.collectedKeys?.key6_qi_celestial === true },
      { id: 'key-nature', label: 'Nature key', complete: (save) => save.collectedKeys?.key3_platform === true },
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
