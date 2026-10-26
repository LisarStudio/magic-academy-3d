/** Shared capability check for render and content budgets. Input mode is resolved separately. */
export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
  const mobileBrowser = /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent);
  const touchFirst = (navigator.maxTouchPoints ?? 0) > 0 &&
    (window.matchMedia?.('(pointer: coarse)').matches ?? false) &&
    !(window.matchMedia?.('(pointer: fine)').matches ?? false);
  const limitedMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const limitedCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  return mobileBrowser || touchFirst || limitedMemory || limitedCpu;
}

export function renderPixelRatio(quality = 1): number {
  // Cap very dense displays, but never render mobile below CSS-pixel density
  // by default. Previously the 0.78 cap made every phone visibly soft, while
  // multiplying DPR by the render scale before clamping prevented dynamic
  // resolution from reacting until the scale was already unusably low.
  const lowPower = isLowPowerDevice();
  const cap = lowPower ? 1.25 : 1.5;
  const deviceRatio = Math.min(window.devicePixelRatio || 1, cap);
  return Math.max(lowPower ? 0.65 : 0.7, deviceRatio * quality);
}
