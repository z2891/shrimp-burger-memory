import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const creator = USERS[memory.createdBy] || { name: '?', emoji: '❓', color: '#ccc' };
  const hasImage = memory.mediaUrl?.startsWith('data:');
  const isDiaryOrLetter = memory.type === 'diary' || memory.type === 'letter';
  const [editing, setEditing] = useState(false);
  const [fullImage, setFullImage] = useState(false);
  const [form, setForm] = useState({
    title: memory.title || '', date: memory.date || '',
    description: memory.description || '', mood: getMoodId(memory),
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const moodStamp = MOOD_STAMPS.find(s => s.id === form.mood);
    onEdit?.(memory.id, {
      title: form.title.trim(), date: form.date,
      description: form.description.trim(),
      mood: moodStamp?.id || 'happy-bubble', moodEmoji: moodStamp?.emoji || '🫧',
    });
    setEditing(false);
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="modal-backdrop">

      <AnimatePresence mode="wait">
        {fullImage && hasImage ? (
          <motion.div key="zoom" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
            onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={memory.mediaUrl} alt={memory.title}
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: 12, cursor: 'pointer' }}
              onClick={() => setFullImage(false)} />
            <p style={{ textAlign: 'center', color: '#fff', fontSize: '0.75rem', marginTop: 8 }}>点击图片关闭大图</p>
          </motion.div>
        ) : editing ? (
          <motion.form key="edit" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()} className="modal-card" onSubmit={handleSaveEdit}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>✏️ 编辑回忆</h3>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="标题" className="input-field" />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="描述……" className="textarea-field" />
            <div><label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>心情</label>
              <MoodStampPicker selected={form.mood} onSelect={(id) => setForm({ ...form, mood: id })} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditing(false)} className="hand-drawn-btn">取消</button>
              <button type="submit" className="hand-drawn-btn primary">💾 保存</button>
            </div>
          </motion.form>
        ) : (
          <motion.div key="view" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
            onClick={e => e.stopPropagation()} className="modal-card">
            {memory.isFirst && <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 6 }}>{memory.badge || '⭐'}</div>}

            {hasImage && (
              <div style={{ marginBottom: 12, textAlign: 'center', cursor: 'zoom-in' }} onClick={() => setFullImage(true)}>
                <img src={memory.mediaUrl} alt={memory.title}
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12, border: '2px solid var(--border-color)' }} />
              </div>
            )}

            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tag" style={{ background: (creator.lightColor || creator.color + '15'), border: `1px solid ${creator.color}30`, color: creator.color }}>
                {{ first: '🏆 第一次', photo: '📸 照片', diary: '📔 日记', letter: '💌 信件' }[memory.type] || '📍 记忆'}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => setEditing(true)} className="hand-drawn-btn ghost small" style={{ padding: '3px 8px', fontSize: '0.8rem' }}>✏️</button>
                <button onClick={() => { if (window.confirm('删除这个回忆？')) { onDelete?.(memory.id); onClose(); } }}
                  className="hand-drawn-btn ghost small" style={{ padding: '3px 8px', fontSize: '0.8rem', color: 'var(--coral)' }}>🗑️</button>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 8 }}>{memory.title}</h3>
            {memory.description && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 14, whiteSpace: 'pre-wrap' }}>{memory.description}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{creator.emoji} {creator.name} · {memory.date}</span>
              {memory.mood && <MoodStamp moodId={getMoodId(memory)} size="small" />}
            </div>

            {/* Quick links back to original content */}
            {isDiaryOrLetter && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border-color)' }}>
                <button
                  onClick={() => {
                    onClose();
                    if (memory.type === 'diary') navigate('/diary');
                    else if (memory.type === 'letter') navigate('/letters');
                  }}
                  className="hand-drawn-btn small"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  {memory.type === 'diary' ? '📔 查看完整日记' : '💌 查看完整信件'} →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
