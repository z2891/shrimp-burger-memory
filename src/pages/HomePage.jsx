import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeMap from '../components/map/TimeMap.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { generateId } from '../utils/storage.js';

// Anniversary dates — stored in localStorage, editable
const ANNIVERSARY_KEY = 'couple_anniversaries';
const DEFAULT_ANNIVERSARIES = [
  { id: 'ann_main', date: '02-14', label: '在一起的纪念日 💕', isMain: true },
  { id: 'ann_shrimp_bday', date: '03-20', label: '虾米的生日 🦐', forUser: 'xia-mi' },
  { id: 'ann_burger_bday', date: '09-08', label: '汉堡的生日 🍔', forUser: 'han-bao' },
];

function getAnniversaries() {
  try {
    const raw = localStorage.getItem(ANNIVERSARY_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_ANNIVERSARIES;
  } catch { return DEFAULT_ANNIVERSARIES; }
}
function saveAnniversaries(data) { localStorage.setItem(ANNIVERSARY_KEY, JSON.stringify(data)); }

export default function HomePage() {
  const { data, addMemory, updateMemory, deleteMemory } = useData();
  const memories = data.memories || [];

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Mini calendar */}
      <MiniCalendar />

      <div style={{ margin: '24px 0 8px' }} />

      <TimeMap
        memories={memories}
        onAddMemory={(d) => addMemory({ id: generateId(), ...d })}
        onEditMemory={updateMemory}
        onDeleteMemory={deleteMemory}
      />
    </div>
  );
}

/** ===== MINI CALENDAR WIDGET ===== */
function MiniCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed
  const [anniversaries, setAnniversaries] = useState(() => getAnniversaries());
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ label: '', date: '' });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => { saveAnniversaries(anniversaries); }, [anniversaries]);

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = `${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  // Marked dates
  const markedMap = {};
  anniversaries.forEach(a => { markedMap[a.date] = a; });

  // Chinese month names
  const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const WEEKDAYS = ['日','一','二','三','四','五','六'];

  const prevMonth = () => { if (month === 0) { setYear(y => y-1); setMonth(11); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y+1); setMonth(0); } else setMonth(m => m+1); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); };

  const handleDelete = (id) => {
    if (window.confirm('删除这个纪念日？')) {
      setAnniversaries(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.date) return;
    if (editing === 'new') {
      setAnniversaries(prev => [...prev, { id: generateId(), label: form.label.trim(), date: form.date }]);
    } else if (editing) {
      setAnniversaries(prev => prev.map(a => a.id === editing.id ? { ...a, label: form.label.trim(), date: form.date } : a));
    }
    setEditing(null); setShowAdd(false); setForm({ label: '', date: '' });
  };

  const openEdit = (ann) => { setForm({ label: ann.label, date: ann.date }); setEditing(ann); };
  const openNew = () => { setForm({ label: '', date: '' }); setEditing('new'); setShowAdd(true); };

  return (
    <motion.div className="hand-drawn-card" style={{ padding: 16, marginBottom: 12 }}
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prevMonth} style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 6px' }}>◀</button>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0, minWidth: 90, textAlign: 'center', cursor: 'pointer' }} onClick={goToday}>
            📅 {year}年 {MONTHS[month]}
          </h3>
          <button onClick={nextMonth} style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 6px' }}>▶</button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={openNew} className="hand-drawn-btn small" style={{ padding: '3px 10px' }}>➕</button>
          <button onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 4px' }}>
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      {!collapsed && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}>
          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {WEEKDAYS.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.62rem', color: 'var(--text-muted)', padding: '2px 0', fontFamily: 'var(--font-body)' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={'e'+i} style={{ aspectRatio: '1', minHeight: 32 }} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const mmdd = `${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
              const isMarked = markedMap[mmdd];
              const isToday = mmdd === todayStr;

              return (
                <motion.div key={day} whileHover={{ scale: 1.08 }}
                  onClick={() => isMarked ? openEdit(isMarked) : null}
                  style={{
                    aspectRatio: '1', minHeight: 32,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '10px',
                    background: isMarked
                      ? (isMarked.isMain ? 'var(--shrimp-light)' : 'var(--bg-card)')
                      : 'transparent',
                    border: isToday ? '2px solid var(--coral)' : (isMarked ? `1.5px solid ${isMarked.forUser === 'xia-mi' ? 'var(--shrimp-color)' : isMarked.forUser === 'han-bao' ? 'var(--burger-color)' : 'var(--color-gold)'}` : '1px solid transparent'),
                    cursor: isMarked ? 'pointer' : 'default',
                    fontSize: '0.72rem', color: isToday ? 'var(--coral)' : (isMarked ? 'var(--text-primary)' : 'var(--text-muted)'),
                    fontFamily: 'var(--font-body)', fontWeight: isToday ? 700 : 400,
                    position: 'relative',
                    transition: 'all 0.15s',
                  }}
                >
                  <span>{day}</span>
                  {isMarked && <span style={{ fontSize: '0.55rem', position: 'absolute', bottom: 1 }}>{isMarked.label.slice(0, 3)}</span>}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
            {anniversaries.map(a => (
              <span key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer' }}
                onClick={() => openEdit(a)}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
                  background: a.forUser === 'xia-mi' ? 'var(--shrimp-color)' : a.forUser === 'han-bao' ? 'var(--burger-color)' : 'var(--color-gold)',
                }} />
                {a.label}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.55rem' }}>{a.date}</span>
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {(editing || showAdd) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setEditing(null); setShowAdd(false); }}
            className="modal-backdrop" style={{ zIndex: 160 }}>
            <motion.form initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="modal-card" onSubmit={handleSaveEdit}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>
                {editing === 'new' ? '➕ 添加纪念日' : '✏️ 编辑纪念日'}
              </h3>
              <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                placeholder="标签（如：虾米的生日）" className="input-field" />
              <input type="text" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                placeholder="日期 (MM-DD，如 02-14)" className="input-field"
                pattern="\d{2}-\d{2}" maxLength={5} />
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>格式：月份-日期，如02-14表示2月14日</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                <div>
                  {editing && editing !== 'new' && (
                    <button type="button" onClick={() => handleDelete(editing.id)}
                      className="hand-drawn-btn small" style={{ color: 'var(--coral)', borderColor: 'var(--coral)40' }}>
                      🗑️ 删除
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => { setEditing(null); setShowAdd(false); }} className="hand-drawn-btn small">取消</button>
                  <button type="submit" className="hand-drawn-btn primary small">💾 保存</button>
                </div>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
