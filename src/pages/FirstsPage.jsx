import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';

const BADGES = ['📸','🤝','💕','🍳','✈️','🌈','🎆','🎂','💯','⭐','🎁','🏠','💍','🎓'];

export default function FirstsPage() {
  const { data, addFirst, updateFirst, deleteFirst } = useData();
  const firsts = data.firsts || [];
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', description: '', badge: '⭐' });

  const openNew = () => { setForm({ title: '', date: '', description: '', badge: '⭐' }); setEditing('new'); };
  const openEdit = (item) => { setForm({ title: item.title, date: item.date, description: item.description, badge: item.badge }); setEditing(item); };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    if (editing === 'new') addFirst({ title: form.title.trim(), date: form.date, description: form.description.trim(), badge: form.badge, unlocked: true });
    else updateFirst(editing.id, { title: form.title.trim(), date: form.date, description: form.description.trim(), badge: form.badge });
    setEditing(null);
  };

  const handleDelete = (item) => { if (window.confirm(`删除「${item.title}」？`)) deleteFirst(item.id); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>🏆 我们的第一次</h1>
        <button className="hand-drawn-btn primary small" onClick={openNew}>➕ 添加</button>
      </div>

      <div style={{ position: 'relative', paddingLeft: 30 }}>
        <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 2, background: 'var(--border-color)', borderRadius: 1, opacity: 0.5 }} />

        {[...firsts].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: idx * 0.04 }}
            className="hand-drawn-card flat" style={{
              marginBottom: 16, padding: 16, position: 'relative',
              borderLeft: item.unlocked ? '3px solid var(--color-gold)' : '3px solid var(--border-color)',
            }}>
            <div style={{ position: 'absolute', left: -34, top: 20, width: 16, height: 16, borderRadius: '50%',
              background: item.unlocked ? 'var(--color-gold)' : 'var(--border-color)',
              border: '3px solid var(--bg-card)',
              boxShadow: `0 0 0 3px ${item.unlocked ? 'var(--color-gold)' : 'var(--border-color)'}`,
              animation: item.unlocked ? 'pulse 3s ease-in-out infinite' : 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{item.badge}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', margin: 0 }}>{item.title}</h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>📅 {item.date}</div>
                {item.description && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>{item.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => openEdit(item)} className="hand-drawn-btn ghost small" style={{ padding: '3px 8px' }} title="编辑">✏️</button>
                <button onClick={() => handleDelete(item)} className="hand-drawn-btn ghost small" style={{ padding: '3px 8px', color: 'var(--coral)' }} title="删除">🗑️</button>
              </div>
            </div>
          </motion.div>
        ))}

        {firsts.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🏆</span>
            <p className="empty-title">还没有"第一次"记录</p>
            <p className="empty-subtitle">点击上方"添加"记录你们的里程碑吧～</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="modal-backdrop">
            <motion.form initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
              onClick={e => e.stopPropagation()} className="modal-card" onSubmit={handleSave}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>{editing === 'new' ? '➕ 添加第一次' : '✏️ 编辑'}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {BADGES.map(b => (
                  <button key={b} type="button" onClick={() => setForm({ ...form, badge: b })}
                    className="chip" style={{ borderColor: form.badge === b ? 'var(--color-gold)' : undefined, background: form.badge === b ? 'var(--gradient-golden)' : undefined, fontSize: '1.1rem' }}>
                    {b}
                  </button>
                ))}
              </div>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="标题" className="input-field" />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="描述这个瞬间……" className="textarea-field" />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditing(null)} className="hand-drawn-btn">取消</button>
                <button type="submit" className="hand-drawn-btn primary">💾 保存</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
