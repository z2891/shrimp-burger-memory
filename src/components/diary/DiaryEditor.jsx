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

  const wordCount = content.trim() ? content.trim().length : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="hand-drawn-card" style={{ maxWidth: 450, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>
          {existingEntry ? '💌 回复日记' : '✏️ 写日记'}
        </h3>
        {wordCount > 0 && (
          <span className="tag" style={{ background: 'var(--shrimp-light)' }}>{wordCount} 字</span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Topic */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>📝 主题</label>
            <button type="button" onClick={() => setShowTopics(!showTopics)}
              style={{ fontSize: '0.72rem', color: 'var(--coral)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              💡 灵感
            </button>
          </div>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="今天想写什么？" className="input-field" />
          {showTopics && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              {DIARY_TOPICS.map((t, i) => (
                <button key={i} type="button" onClick={() => { setTopic(t); setShowTopics(false); }}
                  className="chip" style={{ background: topic === t ? 'var(--shrimp-light)' : undefined, borderColor: topic === t ? 'var(--shrimp-color)' : undefined }}>
                  {t}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Content with lined paper */}
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>💭 想说的话</label>
          <div style={{ position: 'relative' }}>
            {/* Paper tear edge */}
            <div style={{
              height: 6, background: 'var(--bg-card)',
              borderRadius: 'var(--radius-card) var(--radius-card) 0 0',
              border: '1.5px solid var(--border-color)', borderBottom: 'none',
              marginBottom: -1,
            }} />
            <textarea
              value={content} onChange={e => setContent(e.target.value)} rows={8}
              placeholder="亲爱的，今天……"
              className="textarea-field lined"
              style={{
                borderRadius: '0 0 var(--radius-card) var(--radius-card)',
                borderTop: '1.5px dashed var(--border-color)',
                minHeight: 200,
              }}
            />
          </div>
        </div>

        {/* Mood */}
        <div>
          <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>🎵 今日心情</label>
          <MoodStampPicker selected={mood} onSelect={setMood} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          {onCancel && <button type="button" onClick={onCancel} className="hand-drawn-btn">取消</button>}
          <button type="submit" className="hand-drawn-btn primary" disabled={!content.trim()}>💾 保存日记</button>
        </div>
      </form>
    </motion.div>
  );
}
