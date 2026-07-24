import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAll, addItem, updateItem, deleteItem, generateId } from '../utils/storage.js';
import { initializeMockData } from '../data/mockMemories.js';

const DataContext = createContext(null);

const KEYS = {
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

export function DataProvider({ children }) {
  const [data, setData] = useState({});

  // Initialize and load all data
  useEffect(() => {
    initializeMockData();
    loadAll();
  }, []);

  function loadAll() {
    const all = {};
    Object.keys(KEYS).forEach(k => { all[k] = getAll(KEYS[k]); });
    setData(all);
  }

  const refresh = useCallback((key) => {
    setData(prev => ({ ...prev, [key]: getAll(KEYS[key]) }));
  }, []);

  // Generic CRUD
  const add = useCallback((key, item) => {
    const newItem = { ...item, id: item.id || generateId() };
    addItem(KEYS[key], newItem);
    refresh(key);
    return newItem;
  }, [refresh]);

  const update = useCallback((key, id, updates) => {
    updateItem(KEYS[key], id, updates);
    refresh(key);
  }, [refresh]);

  const remove = useCallback((key, id) => {
    deleteItem(KEYS[key], id);
    refresh(key);
  }, [refresh]);

  // Specialized operations
  const addMemory = useCallback((memory) => add('memories', memory), [add]);
  const updateMemory = useCallback((id, updates) => update('memories', id, updates), [update]);
  const deleteMemory = useCallback((id) => remove('memories', id), [remove]);

  const addDiaryEntry = useCallback((entry) => add('diary', entry), [add]);
  const updateDiaryEntry = useCallback((id, updates) => update('diary', id, updates), [update]);

  const addLetter = useCallback((letter) => add('letters', letter), [add]);
  const openLetter = useCallback((id) => update('letters', id, { isOpened: true }), [update]);

  const addVoucher = useCallback((v) => add('vouchers', v), [add]);
  const redeemVoucher = useCallback((id) => update('vouchers', id, { isRedeemed: true, redeemedAt: Date.now() }), [update]);

  const addExpression = useCallback((expr) => add('expressions', expr), [add]);

  const submitQuizAnswer = useCallback((quizId, username, content) => {
    const quiz = data.quiz?.find(q => q.id === quizId);
    if (!quiz) return;
    const answers = { ...quiz.answers, [username]: { content, submittedAt: Date.now() } };
    const revealed = answers['xia-mi']?.content && answers['han-bao']?.content;
    update('quiz', quizId, { answers, revealed });
  }, [data.quiz, update]);

  const addQuiz = useCallback((q) => add('quiz', q), [add]);

  const addCountdown = useCallback((cd) => add('countdowns', cd), [add]);
  const deleteCountdown = useCallback((id) => remove('countdowns', id), [remove]);

  const addFirst = useCallback((f) => add('firsts', f), [add]);
  const addMailboxLetter = useCallback((letter) => add('mailbox', letter), [add]);

  const value = {
    data,
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
    addFirst, addMailboxLetter,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export default DataContext;
