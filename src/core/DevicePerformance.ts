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
  // Keep the framebuffer close to 1080p on dense displays. The game uses
  // dynamic resolution feedback during play to spend extra pixels only when
  // the device has frame-time headroom.
  const cap = isLowPowerDevice() ? 0.78 : 1.25;
  return Math.max(0.6, Math.min(window.devicePixelRatio * quality, cap));
}
