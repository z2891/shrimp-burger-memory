// ============================================
// localStorage abstraction layer
// Designed for easy migration to Supabase
// ============================================

const STORAGE_PREFIX = 'couple_';

function getKey(key) {
  return STORAGE_PREFIX + key;
}

export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('localStorage full or unavailable:', e);
    return false;
  }
}

export function removeItem(key) {
  localStorage.removeItem(getKey(key));
}

// --- Generic CRUD helpers ---
export function getAll(collectionKey) {
  return getItem(collectionKey, []);
}

export function getById(collectionKey, id) {
  const items = getAll(collectionKey);
  return items.find(item => item.id === id) || null;
}

export function addItem(collectionKey, item) {
  const items = getAll(collectionKey);
  items.push(item);
  setItem(collectionKey, items);
  return item;
}

export function updateItem(collectionKey, id, updates) {
  const items = getAll(collectionKey);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  setItem(collectionKey, items);
  return items[index];
}

export function deleteItem(collectionKey, id) {
  const items = getAll(collectionKey);
  const filtered = items.filter(item => item.id !== id);
  setItem(collectionKey, filtered);
  return filtered;
}

// --- Export/Import for migration ---
export function exportAll() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_PREFIX)) {
      data[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  return data;
}

export function importAll(data) {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });
}

// --- Generate ID ---
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
