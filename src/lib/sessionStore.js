const KEY = 'sfc_session';
const TTL = 24 * 60 * 60 * 1000; // 24 hours

export function saveSession(deck, index, score) {
  localStorage.setItem(KEY, JSON.stringify({ deck, index, score, savedAt: Date.now() }));
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (Date.now() - s.savedAt > TTL) { clearSession(); return null; }
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
