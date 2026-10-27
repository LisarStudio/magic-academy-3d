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
  // Keep a native CSS-pixel floor so dynamic resolution cannot turn the game
  // visibly soft on phones or on standard-density displays. High-DPI panels
  // retain extra detail, with a lower cap on mobile to protect GPU memory.
  const lowPower = isLowPowerDevice();
  const cap = lowPower ? 1.25 : 1.5;
  const deviceRatio = Math.min(window.devicePixelRatio || 1, cap);
  return Math.max(1, deviceRatio * quality);
}
