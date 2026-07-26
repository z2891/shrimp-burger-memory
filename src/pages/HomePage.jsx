import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TimeMap from '../components/map/TimeMap.jsx';
import { useData } from '../contexts/DataContext.jsx';
import { generateId } from '../utils/storage.js';

const ANNIVERSARY_KEY = 'couple_anniversaries';
const DEFAULT_ANNIVERSARIES = [
  { id: 'ann_main', date: '02-14', label: '纪念日 💕', isMain: true },
  { id: 'ann_shrimp_bday', date: '01-23', label: '虾米生日 🦐', forUser: 'xia-mi' },
  { id: 'ann_burger_bday', date: '12-12', label: '汉堡生日 🍔', forUser: 'han-bao' },
];
function getAnniversaries() {
  try { const r = localStorage.getItem(ANNIVERSARY_KEY); return r ? JSON.parse(r) : DEFAULT_ANNIVERSARIES; }
  catch { return DEFAULT_ANNIVERSARIES; }
}
function saveAnniversaries(d) { localStorage.setItem(ANNIVERSARY_KEY, JSON.stringify(d)); }

export default function HomePage() {
  const { data, addMemory, updateMemory, deleteMemory } = useData();
  const countdowns = data.countdowns || [];

  return (
    <div style={{ paddingBottom: 16 }}>
      <MiniCalendar countdowns={countdowns} />

      {/* Two-column layout: sidebar on desktop, stacked on mobile */}
      <div className="home-layout">
        {/* Mobile only: compact countdown strip */}
        <div className="mobile-only">
          <CountdownStrip countdowns={countdowns} />
        </div>

        <div className="home-grid">
          {/* Main timeline */}
          <div className="home-main">
            <TimeMap
              memories={data.memories || []}
              onAddMemory={(d) => addMemory({ id: generateId(), ...d })}
              onEditMemory={updateMemory}
              onDeleteMemory={deleteMemory}
            />
          </div>

          {/* Desktop sidebar */}
          <SidebarCountdowns countdowns={countdowns} />
        </div>
      </div>
    </div>
  );
}

/** ===== DESKTOP SIDEBAR COUNTDOWNS ===== */
function SidebarCountdowns({ countdowns }) {
  if (countdowns.length === 0) return null;

  return (
    <div className="home-sidebar" style={{ position: 'sticky', top: 60, alignSelf: 'flex-start' }}>
        <div className="hand-drawn-card" style={{ padding: 14 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: 12, textAlign: 'center' }}>
            ⏳ 倒数计时
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {countdowns.map(cd => (
              <SideCountdown key={cd.id} cd={cd} />
            ))}
          </div>
        </div>
    </div>
  );
}

function SideCountdown({ cd }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const diff = new Date(cd.targetDate).getTime() - now;
  const days = diff > 0 ? Math.max(0, Math.floor(diff / 86400000)) : 0;
  const hours = diff > 0 ? Math.floor((diff % 86400000) / 3600000) : 0;
  const mins = diff > 0 ? Math.floor((diff % 3600000) / 60000) : 0;

  return (
    <div style={{
      background: 'var(--bg-primary)', borderRadius: 12,
      padding: 10, border: '1px solid var(--border-color)',
    }}>
      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', marginBottom: 4, textAlign: 'center' }}>
        {cd.icon} {cd.title.replace(cd.icon + ' ', '')}
      </div>
      {diff <= 0 ? (
        <div style={{ textAlign: 'center', fontSize: '0.85rem', fontFamily: 'var(--font-display)', color: 'var(--color-gold)' }}>🎉 就是今天！</div>
      ) : (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {[{ v: days, l: '天' }, { v: hours, l: '时' }, { v: mins, l: '分' }].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{
                background: 'var(--bg-card)', border: '1.5px solid var(--border-color)',
                borderRadius: 6, padding: '3px 6px', minWidth: 32,
                fontSize: '0.85rem', fontFamily: 'var(--font-display)', color: 'var(--coral)',
              }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
        {cd.targetDate}
      </div>
    </div>
  );
}

/** ===== MOBILE COUNTDOWN STRIP ===== */
function CountdownStrip({ countdowns }) {
  if (countdowns.length === 0) return null;

  return (
    <div>
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        padding: '0 0 12px', marginBottom: 4,
      }}>
        {countdowns.map(cd => {
          const diff = new Date(cd.targetDate).getTime() - Date.now();
          const days = diff > 0 ? Math.max(0, Math.floor(diff / 86400000)) : 0;
          return (
            <div key={cd.id} style={{
              flexShrink: 0, padding: '8px 14px',
              background: 'var(--bg-card)', borderRadius: 'var(--radius-tag)',
              border: '1.5px solid var(--border-color)',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.72rem', fontFamily: 'var(--font-body)',
              whiteSpace: 'nowrap',
            }}>
              <span>{cd.icon}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{cd.title.replace(cd.icon + ' ', '')}</span>
              <span style={{
                color: diff <= 0 ? 'var(--color-gold)' : (days <= 30 ? 'var(--coral)' : 'var(--text-muted)'),
                fontWeight: 600, fontSize: '0.75rem',
              }}>
                {diff <= 0 ? '🎉' : `${days}天`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** ===== MINI CALENDAR ===== */
function MiniCalendar({ countdowns }) {
  const now = new Date();
  const [anniversaries, setAnniversaries] = useState(getAnniversaries);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label: '', date: '' });

  useEffect(() => { saveAnniversaries(anniversaries); }, [anniversaries]);

  const year = now.getFullYear(), month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = `${String(month+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const markedMap = {};
  anniversaries.forEach(a => { markedMap[a.date] = a; });
  const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const WEEKDAYS = ['日','一','二','三','四','五','六'];

  const sorted = [...anniversaries].sort((a, b) => {
    const [am, ad] = a.date.split('-').map(Number);
    const [bm, bd] = b.date.split('-').map(Number);
    return ((am - month - 1 + 13) % 12) * 31 + ad - ((bm - month - 1 + 13) % 12) * 31 - bd;
  });

  const openEdit = (ann) => { setForm({ label: ann.label, date: ann.date }); setEditing(ann); };
  const openNew = () => { setForm({ label: '', date: '' }); setEditing('new'); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.date) return;
    if (editing === 'new') setAnniversaries(p => [...p, { id: generateId(), label: form.label.trim(), date: form.date }]);
    else if (editing) setAnniversaries(p => p.map(a => a.id === editing.id ? { ...a, label: form.label.trim(), date: form.date } : a));
    setEditing(null); setForm({ label: '', date: '' });
  };
  const handleDelete = (id) => {
    if (window.confirm('删除这个纪念日？')) setAnniversaries(p => p.filter(a => a.id !== id));
  };
  const daysUntil = (mmdd) => {
    const [m, d] = mmdd.split('-').map(Number);
    const n = new Date();
    const target = new Date(n.getFullYear(), m-1, d);
    if (target < new Date(n.getFullYear(), n.getMonth(), n.getDate())) target.setFullYear(target.getFullYear() + 1);
    return Math.ceil((target - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / 86400000);
  };

  return (
    <motion.div className="hand-drawn-card" style={{ padding: '8px 14px', marginBottom: 14 }}
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>

      {/* COMPACT STRIP */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
          📅 特殊日子
        </span>
        {sorted.map(a => {
          const days = daysUntil(a.date);
          return (
            <button key={a.id} onClick={() => openEdit(a)}
              style={{
                padding: '3px 10px', borderRadius: 'var(--radius-tag)',
                border: `1.5px solid ${a.forUser==='xia-mi'?'var(--shrimp-color)':a.forUser==='han-bao'?'var(--burger-color)':'var(--color-gold)'}50`,
                background: a.forUser==='xia-mi'?'var(--shrimp-light)':a.forUser==='han-bao'?'var(--burger-light)':'var(--gradient-golden)',
                cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}
            >
              <span>{a.label}</span>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>{a.date}</span>
              {days === 0 ? (
                <span style={{ fontSize: '0.65rem' }}>🎉</span>
              ) : (
                <span style={{
                  fontSize: '0.56rem', background: 'rgba(0,0,0,0.06)',
                  padding: '1px 6px', borderRadius: 20, whiteSpace: 'nowrap',
                  color: days <= 30 ? 'var(--coral)' : 'var(--text-muted)',
                }}>
                  还有{days}天
                </span>
              )}
            </button>
          );
        })}
        <button onClick={openNew} style={{ fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-muted)', padding: '0 2px' }}>➕</button>
        <button onClick={() => setExpanded(!expanded)}
          style={{ fontSize: '0.66rem', cursor: 'pointer', color: 'var(--text-muted)', marginLeft: 'auto', padding: '2px 4px', fontFamily: 'var(--font-body)' }}>
          {expanded ? '收起' : '月历'}
        </button>
      </div>

      {/* EXPANDABLE CALENDAR GRID */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border-color)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 2 }}>
              {WEEKDAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:'0.55rem', color:'var(--text-muted)', padding:'1px 0' }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {Array.from({length: firstDay}).map((_,i) => <div key={'e'+i} />)}
              {Array.from({length: daysInMonth}).map((_,i) => {
                const day = i+1;
                const mmdd = `${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const m = markedMap[mmdd];
                const isToday = mmdd === todayStr;
                return (
                  <div key={day} onClick={() => m ? openEdit(m) : null}
                    style={{
                      textAlign:'center', padding:'1px 0', borderRadius:'3px', cursor: m?'pointer':'default',
                      background: m ? (m.forUser==='xia-mi'?'var(--shrimp-light)':m.forUser==='han-bao'?'var(--burger-light)':'var(--gradient-golden)') : 'transparent',
                      border: isToday ? '1.5px solid var(--coral)' : '1px solid transparent',
                      fontSize:'0.58rem', color: isToday ? 'var(--coral)' : (m ? 'var(--text-primary)' : 'var(--text-muted)'),
                      fontWeight: (m || isToday) ? 700 : 400, fontFamily: 'var(--font-body)',
                    }}>
                    {day}
                    {m && <div style={{fontSize:'0.4rem',lineHeight:1,opacity:0.7}}>{m.label.slice(0,3)}</div>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setEditing(null)} className="modal-backdrop" style={{zIndex:160}}>
            <motion.form initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}}
              onClick={e=>e.stopPropagation()} className="modal-card" onSubmit={handleSave}
              style={{display:'flex',flexDirection:'column',gap:12}}>
              <h3 style={{fontFamily:'var(--font-display)',fontSize:'1rem',margin:0}}>
                {editing==='new' ? '➕ 添加纪念日' : '✏️ 编辑'}
              </h3>
              <input value={form.label} onChange={e=>setForm({...form,label:e.target.value})} placeholder="标签" className="input-field" />
              <input value={form.date} onChange={e=>setForm({...form,date:e.target.value})} placeholder="MM-DD" className="input-field" maxLength={5} />
              <p style={{fontSize:'0.62rem',color:'var(--text-muted)'}}>格式：02-14 表示2月14日</p>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                {editing && editing!=='new' && (
                  <button type="button" onClick={()=>handleDelete(editing.id)} className="hand-drawn-btn small" style={{color:'var(--coral)'}}>🗑️ 删除</button>
                )}
                <div style={{display:'flex',gap:8,marginLeft:'auto'}}>
                  <button type="button" onClick={()=>setEditing(null)} className="hand-drawn-btn small">取消</button>
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
