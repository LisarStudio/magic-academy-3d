export const SAVE_SLOTS_KEY = 'lisar_savegame_slots_v1';
export const LEGACY_SAVE_KEY = 'lisar_savegame';
export const ACTIVE_SAVE_SLOT_KEY = 'lisar_active_save_slot_v1';
export const SAVE_SLOT_COUNT = 3;

export interface SaveData {
  version?: number;
  slotId?: number;
  levelId?: string;
  playerPos?: { x?: number; y?: number; z?: number };
  playerRotY?: number;
  health?: number;
  lives?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
  hasStaff?: boolean;
  staffEquipped?: boolean;
  powerOrbs?: number;
  staffUpgradeLevel?: number;
  coinsCount?: number;
  collectedCoinIds?: string[];
  gekkoMissionState?: 'NOT_STARTED' | 'MISSION_ACTIVE' | 'MISSION_COMPLETE' | 'REWARD_GIVEN';
  checkpointId?: number;
  collectedKeys?: Record<string, boolean>;
  totalKeysCount?: number;
  curiosityHatchOpen?: boolean;
  curiosityChestOpen?: boolean;
  collectedLifePickupIds?: string[];
  letterChallengeCompleted?: boolean;
  manekiNekoCollected?: boolean;
  stateFlags?: Record<string, boolean>;
  playTimeSeconds?: number;
  timestamp?: number;
  [key: string]: unknown;
}

export type SaveSlots = Array<SaveData | null>;

export function isValidSaveData(value: unknown): value is SaveData {
  if (!value || typeof value !== 'object') return false;
  const data = value as SaveData;
  if (data.version !== undefined && (!Number.isInteger(data.version) || data.version < 1 || data.version > 8)) return false;
  const pos = data.playerPos;
  return !!pos && [pos.x, pos.y, pos.z].every((part) => typeof part === 'number' && Number.isFinite(part) && Math.abs(part) < 10000);
}

/** Read the three-slot store and migrate the previous single save into slot I
 * without removing the original key, so an interrupted migration loses nothing. */
export function getSaveSlots(): SaveSlots {
  const slots: SaveSlots = Array.from({ length: SAVE_SLOT_COUNT }, () => null);
  try {
    const stored = localStorage.getItem(SAVE_SLOTS_KEY);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
            if (isValidSaveData(parsed[i])) slots[i] = parsed[i] as SaveData;
          }
          return slots;
        }
      } catch { /* recover from a damaged new index using the untouched legacy save */ }
    }

    const legacy = localStorage.getItem(LEGACY_SAVE_KEY);
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      if (isValidSaveData(parsed)) {
        slots[0] = parsed;
        localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
      }
    }
  } catch (error) {
    console.warn('[SaveSlots] Could not read or migrate save slots.', error);
  }
  return slots;
}

export function setSaveSlot(slotId: number, data: SaveData): void {
  if (!Number.isInteger(slotId) || slotId < 0 || slotId >= SAVE_SLOT_COUNT) throw new RangeError('Invalid save slot.');
  const slots = getSaveSlots();
  slots[slotId] = { ...data, slotId };
  localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
  localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, String(slotId));
}

export function deleteSaveSlot(slotId: number): void {
  if (!Number.isInteger(slotId) || slotId < 0 || slotId >= SAVE_SLOT_COUNT) throw new RangeError('Invalid save slot.');
  const slots = getSaveSlots();
  slots[slotId] = null;
  localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
  if (getActiveSaveSlot() === slotId) localStorage.removeItem(ACTIVE_SAVE_SLOT_KEY);
}

export function getActiveSaveSlot(): number {
  try {
    const parsed = Number(localStorage.getItem(ACTIVE_SAVE_SLOT_KEY));
    if (Number.isInteger(parsed) && parsed >= 0 && parsed < SAVE_SLOT_COUNT) return parsed;
  } catch { /* fall back to the original first slot */ }
  return 0;
}
