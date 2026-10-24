export type ControlModePreference = 'auto' | 'keyboard' | 'touch';

const CONTROL_MODE_KEY = 'lisar_control_mode';

export function getControlModePreference(): ControlModePreference {
  try {
    const stored = localStorage.getItem(CONTROL_MODE_KEY);
    if (stored === 'keyboard' || stored === 'touch') return stored;
  } catch { /* Use automatic input detection when storage is unavailable. */ }
  return 'auto';
}

/** Resolve once per game session; viewport resize/orientation never changes control mode. */
export function usesTouchControls(): boolean {
  const preference = getControlModePreference();
  if (preference === 'touch') return true;
  if (preference === 'keyboard') return false;

  const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  if (!hasTouch) return false;

  const primaryCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const primaryFinePointer = window.matchMedia?.('(pointer: fine)').matches ?? false;
  // A hybrid defaults to its primary mouse/trackpad; touch mode is explicitly selectable in Options.
  if (primaryFinePointer) return false;
  return primaryCoarsePointer || !primaryFinePointer;
}

export function setControlModePreference(preference: ControlModePreference): void {
  try {
    if (preference === 'auto') localStorage.removeItem(CONTROL_MODE_KEY);
    else localStorage.setItem(CONTROL_MODE_KEY, preference);
  } catch { /* The current session can still use automatic detection. */ }
}
