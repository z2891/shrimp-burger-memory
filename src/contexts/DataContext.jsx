import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAll, addItem, updateItem, deleteItem, generateId } from '../utils/storage.js';

const DataContext = createContext(null);

const KEYS = {
  memories: 'memories',
  diary: 'diary',
  letters: 'letters',
  vouchers: 'vouchers',
  expressions: 'expressions',
  quiz: 'quiz',
  countdowns: 'countdowns',
  firsts: 'firsts',
  mailbox: 'mailbox',
};

export function DataProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // Load all data from Supabase on mount
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const keys = Object.keys(KEYS);
    const results = await Promise.all(keys.map(k => getAll(KEYS[k]).catch(() => [])));
    const all = {};
    keys.forEach((k, i) => { all[k] = results[i] || []; });
    setData(all);
    setLoading(false);
  }

  const refresh = useCallback(async (key) => {
    const items = await getAll(KEYS[key]).catch(() => []);
    setData(prev => ({ ...prev, [key]: items }));
  }, []);

  // Generic CRUD (async)
  const add = useCallback(async (key, item) => {
    const newItem = { ...item, id: item.id || generateId() };
    await addItem(KEYS[key], newItem);
    await refresh(key);
    return newItem;
  }, [refresh]);

  const update = useCallback(async (key, id, updates) => {
    await updateItem(KEYS[key], id, updates);
    await refresh(key);
  }, [refresh]);

  const remove = useCallback(async (key, id) => {
    await deleteItem(KEYS[key], id);
    await refresh(key);
  }, [refresh]);

  // Specialized operations
  const addMemory = useCallback((memory) => add('memories', memory), [add]);
  const updateMemory = useCallback((id, updates) => update('memories', id, updates), [update]);
  const deleteMemory = useCallback((id) => remove('memories', id), [remove]);

  const addDiaryEntry = useCallback((entry) => add('diary', entry), [add]);
  const updateDiaryEntry = useCallback((id, updates) => update('diary', id, updates), [update]);

  const addLetter = useCallback((letter) => add('letters', letter), [add]);
  const openLetter = useCallback((id) => update('letters', id, { is_opened: true }), [update]);

  const addVoucher = useCallback((v) => add('vouchers', v), [add]);
  const redeemVoucher = useCallback((id) => update('vouchers', id, { is_redeemed: true, redeemed_at: Date.now() }), [update]);

  const addExpression = useCallback((expr) => add('expressions', expr), [add]);

  const submitQuizAnswer = useCallback(async (quizId, username, content) => {
    const quiz = data.quiz?.find(q => q.id === quizId);
    if (!quiz) return;
    const answers = { ...quiz.answers, [username]: { content, submittedAt: Date.now() } };
    const revealed = answers['xia-mi']?.content && answers['han-bao']?.content;
    await update('quiz', quizId, { answers, revealed });
  }, [data.quiz, update]);

  const addQuiz = useCallback((q) => add('quiz', q), [add]);

  const addCountdown = useCallback((cd) => add('countdowns', cd), [add]);
  const deleteCountdown = useCallback((id) => remove('countdowns', id), [remove]);

  const addFirst = useCallback((f) => add('firsts', f), [add]);
  const updateFirst = useCallback((id, updates) => update('firsts', id, updates), [update]);
  const deleteFirst = useCallback((id) => remove('firsts', id), [remove]);
  const addMailboxLetter = useCallback((letter) => add('mailbox', letter), [add]);

  const value = {
    data,
    loading,
    loadAll,
    // Generic
    add, update, remove,
    // Specialized
    addMemory, updateMemory, deleteMemory,
    addDiaryEntry, updateDiaryEntry,
    addLetter, openLetter,
    addVoucher, redeemVoucher,
    addExpression,
    submitQuizAnswer, addQuiz,
    addCountdown, deleteCountdown,
    addFirst, updateFirst, deleteFirst, addMailboxLetter,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export default DataContext;
