import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LetterWritePage() {
  const navigate = useNavigate();
  const { addLetter } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockIn, setUnlockIn] = useState(30);
  const [sealColor, setSealColor] = useState(user?.color || '#FF6B6B');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const unlockAt = new Date(Date.now() + unlockIn * 86400000).toISOString();

    addLetter({
      from: user?.username,
      title,
      content,
      sealColor,
      writtenAt: Date.now(),
      unlockAt,
      isOpened: false,
    });

    navigate('/letters');
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 20 }}>
        ✍️ 写一封时光信
      </h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hand-drawn-card"
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            📝 标题
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="给未来某天的你……"
            style={{
              width: '100%', padding: '10px 12px',
              borderRadius: 'var(--radius-tag)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            💌 内容
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            placeholder="亲爱的……"
            style={{
              width: '100%', padding: '12px',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              lineHeight: 2, resize: 'vertical',
              background: 'repeating-linear-gradient(transparent, transparent 31px, #E8D5C0 31px, #E8D5C0 32px)',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            ⏰ 多久后送达？
          </label>
          <select
            value={unlockIn}
            onChange={e => setUnlockIn(Number(e.target.value))}
            style={{
              width: '100%', padding: '10px 12px',
              borderRadius: 'var(--radius-tag)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            }}
          >
            <option value={7}>7天后</option>
            <option value={30}>一个月后</option>
            <option value={90}>三个月后</option>
            <option value={180}>半年后</option>
            <option value={365}>一年后</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
            🎨 封印颜色
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#FF6B6B', '#FFB347', '#F0C75E', '#8CB89F', '#B8D4E3', '#F8C8D8'].map(c => (
              <button
                key={c} type="button"
                onClick={() => setSealColor(c)}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: c, border: sealColor === c ? '3px solid var(--text-primary)' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button type="button" onClick={() => navigate('/letters')} className="hand-drawn-btn">取消</button>
          <button type="submit" className="hand-drawn-btn primary">💌 封印并投递</button>
        </div>
      </motion.form>
    </div>
  );
}
