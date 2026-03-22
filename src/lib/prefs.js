const KEY = 'sfc_prefs';
const DEFAULTS = { deckSize: 20 };

export function getPrefs() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setPrefs(updates) {
  localStorage.setItem(KEY, JSON.stringify({ ...getPrefs(), ...updates }));
}
