import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { MoodStampPicker } from '../common/MoodStamp.jsx';
import { DIARY_TOPICS } from '../../utils/constants.js';

export default function DiaryEditor({ existingEntry, onSave, onCancel }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState(existingEntry?.topic || '');
  const [mood, setMood] = useState('happy-bubble');
  const [showTopics, setShowTopics] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !topic.trim()) return;
    onSave({
      date: existingEntry?.date || new Date().toISOString().split('T')[0],
      topic: topic || DIARY_TOPICS[0],
      content: content.trim(),
      mood,
      writtenBy: user?.username,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hand-drawn-card"
      style={{ maxWidth: 450, margin: '0 auto' }}
    >
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
        {existingEntry ? '✏️ 回复日记' : '✏️ 写日记'}
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Topic */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📝 主题</label>
            <button
              type="button"
              onClick={() => setShowTopics(!showTopics)}
              style={{ fontSize: '0.75rem', color: 'var(--coral)', cursor: 'pointer' }}
            >
              💡 灵感
            </button>
          </div>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="今天想写什么？"
            style={{
              width: '100%', padding: '8px 12px',
              borderRadius: 'var(--radius-tag)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            }}
          />
          {showTopics && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {DIARY_TOPICS.map((t, i) => (
                <button
                  key={i} type="button"
                  onClick={() => { setTopic(t); setShowTopics(false); }}
                  style={{
                    padding: '4px 8px', fontSize: '0.7rem',
                    borderRadius: 'var(--radius-tag)',
                    border: '1px solid var(--border-color)',
                    background: topic === t ? 'var(--shrimp-light)' : 'var(--bg-card)',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            💭 想说的话
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            placeholder="亲爱的，今天……"
            style={{
              width: '100%', padding: '12px',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              lineHeight: 2,
              resize: 'vertical',
              background: 'repeating-linear-gradient(transparent, transparent 31px, #E8D5C0 31px, #E8D5C0 32px)',
            }}
          />
        </div>

        {/* Mood */}
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            🎵 今日心情
          </label>
          <MoodStampPicker selected={mood} onSelect={setMood} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          {onCancel && (
            <button type="button" onClick={onCancel} className="hand-drawn-btn">取消</button>
          )}
          <button type="submit" className="hand-drawn-btn primary">
            💾 保存日记
          </button>
        </div>
      </form>
    </motion.div>
  );
}
