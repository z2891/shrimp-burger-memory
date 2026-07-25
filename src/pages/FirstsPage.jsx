import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';

const BADGES = ['📸', '🤝', '💕', '🍳', '✈️', '🌈', '🎆', '🎂', '💯', '⭐', '🎁', '🏠', '💍', '🎓'];

export default function FirstsPage() {
  const { data, addFirst, updateFirst, deleteFirst } = useData();
  const firsts = data.firsts || [];
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({ title: '', date: '', description: '', badge: '⭐' });

  const openNew = () => {
    setForm({ title: '', date: '', description: '', badge: '⭐' });
    setEditing('new');
  };

  const openEdit = (item) => {
    setForm({ title: item.title, date: item.date, description: item.description, badge: item.badge });
    setEditing(item);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    if (editing === 'new') {
      addFirst({ title: form.title.trim(), date: form.date, description: form.description.trim(), badge: form.badge, unlocked: true });
    } else if (editing) {
      updateFirst(editing.id, { title: form.title.trim(), date: form.date, description: form.description.trim(), badge: form.badge });
    }
    setEditing(null);
  };

  const handleDelete = (item) => {
    if (window.confirm(`确定要删除"${item.title}"吗？`)) {
      deleteFirst(item.id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: 0 }}>
          🏆 我们的第一次
        </h1>
        <button className="hand-drawn-btn primary" onClick={openNew} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
          ➕ 添加
        </button>
      </div>

      <div style={{ position: 'relative', paddingLeft: 30 }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 15, top: 0, bottom: 0,
          width: 3, background: 'var(--border-color)', borderRadius: 2,
        }} />

        {[...firsts].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="hand-drawn-card"
            style={{
              marginBottom: 16, padding: 16,
              position: 'relative',
              borderLeft: item.unlocked ? '3px solid var(--color-gold)' : '3px solid var(--border-color)',
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: 'absolute', left: -35, top: 20,
              width: 14, height: 14, borderRadius: '50%',
              background: item.unlocked ? 'var(--color-gold)' : 'var(--border-color)',
              border: '2px solid var(--bg-card)',
              boxShadow: '0 0 0 3px ' + (item.unlocked ? 'var(--color-gold)' : 'var(--border-color)'),
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{item.badge}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  📅 {item.date}
                </div>
                {item.description && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 0' }}>
                    {item.description}
                  </p>
                )}
              </div>
              {/* Edit/Delete buttons */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(item)}
                  style={{
                    padding: '4px 8px', borderRadius: 'var(--radius-tag)',
                    border: '1px solid var(--border-color)', background: 'var(--bg-card)',
                    cursor: 'pointer', fontSize: '0.75rem',
                  }}
                  title="编辑"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  style={{
                    padding: '4px 8px', borderRadius: 'var(--radius-tag)',
                    border: '1px solid #FF6B6B40', background: '#FF6B6B10',
                    cursor: 'pointer', fontSize: '0.75rem',
                  }}
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {firsts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem' }}>🏆</div>
            <p>还没有"第一次"记录，来添加一个吧～</p>
          </div>
        )}
      </div>

      {/* Edit / New Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.form
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="hand-drawn-card"
              onSubmit={handleSave}
              style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)' }}>
                {editing === 'new' ? '➕ 添加"第一次"' : '✏️ 编辑'}
              </h3>

              {/* Badge picker */}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>图标</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {BADGES.map(b => (
                    <button
                      key={b} type="button"
                      onClick={() => setForm({ ...form, badge: b })}
                      style={{
                        fontSize: '1.3rem', padding: '4px 8px',
                        borderRadius: '8px', cursor: 'pointer',
                        border: form.badge === b ? '2px solid var(--shrimp-color)' : '1px solid var(--border-color)',
                        background: form.badge === b ? 'var(--shrimp-light)' : 'var(--bg-card)',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="标题（如：第一次合照）"
                style={{
                  padding: '10px 12px', borderRadius: 'var(--radius-tag)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                }}
              />

              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                style={{
                  padding: '10px 12px', borderRadius: 'var(--radius-tag)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                }}
              />

              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="描述这个瞬间……"
                style={{
                  padding: '12px', borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-body)', fontSize: '0.9rem', resize: 'vertical',
                }}
              />

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
