import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodStamp, { MoodStampPicker } from '../common/MoodStamp.jsx';
import { USERS, MOOD_STAMPS } from '../../utils/constants.js';

function getMoodId(memory) {
  if (MOOD_STAMPS.find(s => s.id === memory.mood)) return memory.mood;
  const byLabel = MOOD_STAMPS.find(s => s.label === memory.mood);
  if (byLabel) return byLabel.id;
  return 'happy-bubble';
}

export default function MemoryPopup({ memory, onClose, onEdit, onDelete }) {
  const creator = USERS[memory.createdBy] || { name: '神秘人', emoji: '❓', color: '#ccc' };
  const hasImage = memory.mediaUrl && memory.mediaUrl.startsWith('data:');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: memory.title || '',
    date: memory.date || '',
    description: memory.description || '',
    mood: getMoodId(memory),
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const moodStamp = MOOD_STAMPS.find(s => s.id === form.mood);
    onEdit?.(memory.id, {
      title: form.title.trim(),
      date: form.date,
      description: form.description.trim(),
      mood: moodStamp?.id || 'happy-bubble',
      moodEmoji: moodStamp?.emoji || '🫧',
    });
    setEditing(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.form
            key="edit"
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            onClick={e => e.stopPropagation()}
            className="hand-drawn-card"
            onSubmit={handleSaveEdit}
            style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '80vh', overflow: 'auto' }}
          >
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>✏️ 编辑回忆</h3>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="标题"
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }} />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }} />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="描述……"
              style={{ padding: '12px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', resize: 'vertical' }} />
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>心情</label>
              <MoodStampPicker selected={form.mood} onSelect={(id) => setForm({ ...form, mood: id })} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditing(false)} className="hand-drawn-btn">取消</button>
              <button type="submit" className="hand-drawn-btn primary">💾 保存</button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="view"
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            onClick={e => e.stopPropagation()}
            className="hand-drawn-card"
            style={{ width: '100%', maxWidth: 380, maxHeight: '80vh', overflow: 'auto' }}
          >
            {memory.isFirst && (
              <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 8 }}>
                {memory.badge || '⭐'}
              </div>
            )}

            {hasImage && (
              <div style={{ marginBottom: 12, textAlign: 'center' }}>
                <img src={memory.mediaUrl} alt={memory.title}
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: '12px', border: '2px solid var(--border-color)' }} />
              </div>
            )}

            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: (creator.lightColor || creator.color + '22'),
                color: creator.color, padding: '2px 12px', borderRadius: 'var(--radius-tag)',
                fontSize: '0.8rem', fontFamily: 'var(--font-body)', border: '1px solid ' + creator.color + '40',
              }}>
                {memory.type === 'first' ? '🏆 第一次' : memory.type === 'photo' ? '📸 照片' : memory.type === 'diary' ? '📔 日记' : '💌 信件'}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setEditing(true)}
                  style={{ padding: '4px 8px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', cursor: 'pointer', fontSize: '0.8rem' }}
                  title="编辑">✏️</button>
                <button onClick={() => { if (window.confirm('删除这个回忆？')) { onDelete?.(memory.id); onClose(); } }}
                  style={{ padding: '4px 8px', borderRadius: 'var(--radius-tag)', border: '1px solid #FF6B6B40', background: '#FF6B6B10', cursor: 'pointer', fontSize: '0.8rem' }}
                  title="删除">🗑️</button>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>{memory.title}</h3>

            {memory.description && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16, whiteSpace: 'pre-wrap' }}>
                {memory.description}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{creator.emoji}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{creator.name} · {memory.date}</span>
              </div>
              {memory.mood && <MoodStamp moodId={getMoodId(memory)} size="small" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
