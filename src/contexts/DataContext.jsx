import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

const DataContext = createContext(null);

const TABLES = {
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
  const [loading, setLoading] = useState(true);

  // Load all data from Supabase on mount
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const keys = Object.keys(TABLES);
    try {
      const results = await Promise.all(
        keys.map(k => {
          let q = supabase.from(TABLES[k]).select('*');
          // Only add order for tables that actually have a 'date' column
          if (['couple_memories', 'couple_diary', 'couple_expressions', 'couple_firsts'].includes(TABLES[k])) {
            q = q.order('date', { ascending: false });
          } else if (TABLES[k] === 'couple_vouchers') {
            q = q.order('createdAt', { ascending: false });
          }
          return q.then(({ data: rows, error }) => {
            if (error) { console.warn(`Supabase loadAll ${k}:`, error.message); return []; }
            return rows || [];
          }).catch(e => { console.warn(`Supabase loadAll ${k} exception:`, e); return []; });
        })
      );
      const all = {};
      keys.forEach((k, i) => { all[k] = results[i] || []; });
      setData(all);

      // One-time sync: create timeline cards for existing diary/letters that don't have one yet
      await syncMissingTimelineEntries(all);

    } catch (e) { console.warn('loadAll fatal:', e); }
    setLoading(false);
  }

  // Sync missing timeline entries from diary, letters, firsts
  async function syncMissingTimelineEntries(all) {
    const memories = all.memories || [];
    const diaries = all.diary || [];
    const letters = all.letters || [];

    // Match by deterministic ID — if a timeline card with the source ID already exists, skip.
    // This ensures deleted cards aren't recreated on next load.
    const existingIds = new Set(memories.map(m => m.id));
    const toAdd = [];

    diaries.forEach(entry => {
      const memId = 'mem_diary_' + entry.id;
      if (existingIds.has(memId)) return;
      const shrimpEntry = entry.entries?.['xia-mi'];
      const burgerEntry = entry.entries?.['han-bao'];
      const content = shrimpEntry?.content || burgerEntry?.content || '';
      const createdBy = shrimpEntry?.content ? 'xia-mi' : (burgerEntry?.content ? 'han-bao' : 'xia-mi');
      if (!content) return;
      toAdd.push({
        id: memId, type: 'diary', title: entry.topic || '无主题日记',
        description: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        date: entry.date || '', createdBy, mood: 'cozy', moodEmoji: '📔',
      });
    });

    letters.forEach(letter => {
      const memId = 'mem_letter_' + letter.id;
      if (existingIds.has(memId)) return;
      if (!letter.content) return;
      const desc = (letter.content || '').slice(0, 150) + ((letter.content || '').length > 150 ? '...' : '');
      toAdd.push({
        id: memId, type: 'letter', title: '💌 ' + (letter.title || '一封时光信'),
        description: desc,
        date: new Date(letter.writtenAt || Date.now()).toISOString().split('T')[0],
        createdBy: letter.from || 'xia-mi', mood: 'excited', moodEmoji: '💌',
      });
    });

    // Sync firsts to timeline
    const firsts = all.firsts || [];
    firsts.forEach(f => {
      const memId = 'mem_first_' + f.id;
      if (existingIds.has(memId)) return;
      toAdd.push({
        id: memId, type: 'first', title: f.title,
        description: f.description || '', date: f.date || '',
        createdBy: 'xia-mi', isFirst: true, badge: f.badge || '⭐',
        mood: 'happy-bubble', moodEmoji: '🏆',
      });
    });

    if (toAdd.length > 0) {
      console.log('Syncing', toAdd.length, 'missing timeline entries');
      for (const item of toAdd) {
        const { error } = await supabase.from('couple_memories').upsert(item, { onConflict: 'id' });
        if (error) console.warn('Sync insert error:', error.message);
      }
      // Reload memories
      const { data: fresh } = await supabase.from('couple_memories').select('*').order('date', { ascending: false });
      if (fresh) setData(prev => ({ ...prev, memories: fresh }));
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Optimistic CRUD — update local state immediately, sync to Supabase in background
  const add = useCallback(async (key, item) => {
    const newItem = { ...item, id: item.id || generateId() };
    // Optimistic: add to local state immediately
    setData(prev => ({ ...prev, [key]: [...(prev[key] || []), newItem] }));
    // Sync to Supabase
    supabase.from(TABLES[key]).insert(newItem).then(({ error }) => {
      if (error) console.warn(`Supabase insert ${key}:`, error);
    });
    return newItem;
  }, []);

  const update = useCallback(async (key, id, updates) => {
    // Optimistic: update local state immediately
    setData(prev => ({
      ...prev,
      [key]: (prev[key] || []).map(item => item.id === id ? { ...item, ...updates } : item),
    }));
    // Sync to Supabase
    supabase.from(TABLES[key]).update(updates).eq('id', id).then(({ error }) => {
      if (error) console.warn(`Supabase update ${key}:`, error);
    });
  }, []);

  const remove = useCallback(async (key, id) => {
    // Optimistic: remove from local state immediately
    setData(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(item => item.id !== id),
    }));
    // Sync to Supabase
    supabase.from(TABLES[key]).delete().eq('id', id).then(({ error }) => {
      if (error) console.warn(`Supabase delete ${key}:`, error);
    });
  }, []);

  // --- Specialized operations (all column names match SQL schema) ---
  const addMemory = useCallback((m) => add('memories', m), [add]);
  const updateMemory = useCallback((id, u) => update('memories', id, u), [update]);
  const deleteMemory = useCallback((id) => remove('memories', id), [remove]);

  const addDiaryEntry = useCallback((e) => add('diary', e), [add]);
  const updateDiaryEntry = useCallback((id, u) => update('diary', id, u), [update]);

  const addLetter = useCallback((l) => add('letters', l), [add]);
  const openLetter = useCallback((id) => update('letters', id, { isOpened: true }), [update]);

  const addVoucher = useCallback((v) => add('vouchers', v), [add]);
  const redeemVoucher = useCallback((id) => update('vouchers', id, { isRedeemed: true, redeemedAt: Date.now() }), [update]);

  const addExpression = useCallback((e) => add('expressions', e), [add]);

  const submitQuizAnswer = useCallback(async (quizId, username, content) => {
    setData(prev => {
      const quizList = [...(prev.quiz || [])];
      const idx = quizList.findIndex(q => q.id === quizId);
      if (idx === -1) return prev;
      const quiz = { ...quizList[idx] };
      quiz.answers = { ...quiz.answers, [username]: { content, submittedAt: Date.now() } };
      quiz.revealed = quiz.answers['xia-mi']?.content && quiz.answers['han-bao']?.content;
      quizList[idx] = quiz;
      // Sync
      supabase.from('couple_quiz').update({ answers: quiz.answers, revealed: quiz.revealed }).eq('id', quizId);
      return { ...prev, quiz: quizList };
    });
  }, []);

  const addQuiz = useCallback((q) => add('quiz', q), [add]);

  const addCountdown = useCallback((c) => add('countdowns', c), [add]);
  const deleteCountdown = useCallback((id) => remove('countdowns', id), [remove]);

  const addFirst = useCallback((f) => add('firsts', f), [add]);
  const updateFirst = useCallback((id, u) => update('firsts', id, u), [update]);
  const deleteFirst = useCallback((id) => remove('firsts', id), [remove]);
  const addMailboxLetter = useCallback((l) => add('mailbox', l), [add]);

  const value = {
    data, loading, loadAll,
    add, update, remove,
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
