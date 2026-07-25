// ============================================
// Supabase storage layer
// ============================================
import { supabase } from '../lib/supabase.js';

const TABLE_MAP = {
  memories: 'couple_memories',
  diary: 'couple_diary',
  letters: 'couple_letters',
  vouchers: 'couple_vouchers',
  expressions: 'couple_expressions',
  quiz: 'couple_quiz',
  countdowns: 'couple_countdowns',
  firsts: 'couple_firsts',
  mailbox: 'couple_mailbox',
};

export async function getItem(key, defaultValue = null) {
  // Only used for auth/auth_session — still localStorage
  try {
    const raw = localStorage.getItem('couple_' + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch { return defaultValue; }
}

export function setItem(key, value) {
  // Only used for auth/auth_session — still localStorage
  try {
    localStorage.setItem('couple_' + key, JSON.stringify(value));
    return true;
  } catch { return false; }
}

export function removeItem(key) {
  localStorage.removeItem('couple_' + key);
}

// --- Supabase CRUD ---
export async function getAll(collectionKey) {
  const table = TABLE_MAP[collectionKey];
  if (!table) return [];
  const { data, error } = await supabase.from(table).select('*').order('date', { ascending: false });
  if (error) { console.warn('Supabase getAll error:', error); return []; }
  return data || [];
}

export async function getById(collectionKey, id) {
  const table = TABLE_MAP[collectionKey];
  if (!table) return null;
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function addItem(collectionKey, item) {
  const table = TABLE_MAP[collectionKey];
  if (!table) return null;
  const { error } = await supabase.from(table).insert(item);
  if (error) { console.warn('Supabase insert error:', error); return null; }
  return item;
}

export async function updateItem(collectionKey, id, updates) {
  const table = TABLE_MAP[collectionKey];
  if (!table) return null;
  const { error } = await supabase.from(table).update(updates).eq('id', id);
  if (error) { console.warn('Supabase update error:', error); return null; }
  return { id, ...updates };
}

export async function deleteItem(collectionKey, id) {
  const table = TABLE_MAP[collectionKey];
  if (!table) return [];
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) { console.warn('Supabase delete error:', error); }
  return [];
}

// --- Generate ID ---
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
