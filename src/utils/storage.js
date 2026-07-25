// ============================================
// Auth-only localStorage (session is per-device)
// All shared data now goes through Supabase in DataContext
// ============================================

export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem('couple_' + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch { return defaultValue; }
}

export function setItem(key, value) {
  try { localStorage.setItem('couple_' + key, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function removeItem(key) {
  localStorage.removeItem('couple_' + key);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
