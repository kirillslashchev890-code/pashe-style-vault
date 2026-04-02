const ACCESSIBILITY_KEY = "pashe_accessibility_mode_v1";

const canUseDom = () => typeof window !== "undefined" && typeof document !== "undefined";

export const isAccessibilityModeEnabled = () => {
  if (!canUseDom()) return false;
  return window.localStorage.getItem(ACCESSIBILITY_KEY) === "true";
};

export const setAccessibilityMode = (enabled: boolean) => {
  if (!canUseDom()) return;
  window.localStorage.setItem(ACCESSIBILITY_KEY, String(enabled));
  document.documentElement.classList.toggle("accessibility-mode", enabled);
};

export const initAccessibilityMode = () => {
  if (!canUseDom()) return false;
  const enabled = isAccessibilityModeEnabled();
  document.documentElement.classList.toggle("accessibility-mode", enabled);
  return enabled;
};

export const toggleAccessibilityMode = () => {
  const next = !isAccessibilityModeEnabled();
  setAccessibilityMode(next);
  return next;
};