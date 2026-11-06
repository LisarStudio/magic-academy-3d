/** Shared capability check for render and content budgets. Input mode is resolved separately. */
export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
  const limitedMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
  const limitedCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
  // A phone/tablet is not automatically a low-power device. Recent mobile
  // GPUs can render above 1x DPR; capability limits and the runtime frametime
  // controller decide when to lower resolution instead of the UA string.
  return limitedMemory || limitedCpu;
}

/** Device class is still useful for fixed-cost effects such as MSAA and shadows. */
export function isMobileDevice(): boolean {
  const nav = navigator as Navigator & { userAgent?: string };
  const mobileBrowser = /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent ?? '');
  const touchFirst = (navigator.maxTouchPoints ?? 0) > 0 &&
    (window.matchMedia?.('(pointer: coarse)').matches ?? false) &&
    !(window.matchMedia?.('(pointer: fine)').matches ?? false);
  return mobileBrowser || touchFirst;
}

export function renderPixelRatio(quality = 1): number {
  // Cap low-capability hardware at 1x. Faster Retina devices can start at
  // 1.5x and the frame-time controller steps down only if actual gameplay
  // misses its budget. Desktop retains its existing 1.5x cap.
  const lowPower = isLowPowerDevice();
  const cap = lowPower ? 1 : 1.5;
  const deviceRatio = Math.min(window.devicePixelRatio || 1, cap);
  return Math.max(0.5, deviceRatio * quality);
}
