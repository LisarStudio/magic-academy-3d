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
  // Preserve a useful pixel density on phones. The previous 0.5x floor
  // compounded with adaptive scaling and made the whole scene visibly blocky.
  const lowPower = isLowPowerDevice();
  const mobile = isMobileDevice();
  const cap = mobile ? (lowPower ? 1.25 : 1.5) : (lowPower ? 1 : 1.5);
  const deviceRatio = Math.min(window.devicePixelRatio || 1, cap);
  const qualityFloor = mobile ? 0.9 : 0.65;
  return Math.max(mobile ? 0.9 : 0.65, deviceRatio * Math.max(qualityFloor, quality));
}
