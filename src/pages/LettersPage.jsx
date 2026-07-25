import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS } from '../utils/constants.js';

export default function LettersPage() {
  const navigate = useNavigate();
  const { data, openLetter } = useData();
  const { user } = useAuth();
  const [openedId, setOpenedId] = useState(null);
  const letters = data.letters || [];
  const now = Date.now();

  const handleOpen = (letter) => {
    if (new Date(letter.unlockAt).getTime() > now) return;
    setOpenedId(letter.id);
    if (!letter.isOpened) openLetter(letter.id);
  };

  return (
    <div>
      <div className="page-header">
        <h1>💌 时光信</h1>
        <p>写给未来的信，到期才能打开 ✨</p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => navigate('/letters/write')}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        ✍️ 写一封时光信
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {letters.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📮</span>
            <p className="empty-title">还没有时光信</p>
            <p className="empty-subtitle">写一封给未来的Ta吧～</p>
          </div>
        ) : (
          letters.map(letter => {
            const fromUser = USERS[letter.from];
            const isUnlocked = new Date(letter.unlockAt).getTime() <= now;
            const isOpened = openedId === letter.id;

            return (
              <motion.div key={letter.id}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`hand-drawn-card flat${isUnlocked ? ' golden' : ''}`}
                style={{ padding: 16, cursor: isUnlocked ? 'pointer' : 'default', opacity: isUnlocked ? 1 : 0.7 }}
                onClick={() => handleOpen(letter)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Wax seal */}
                  <div style={{
                    width: 54, height: 54, borderRadius: '50%',
                    background: `radial-gradient(circle at 40% 40%, ${letter.sealColor}, ${letter.sealColor}88)`,
                    border: `2.5px solid ${letter.sealColor}`, boxShadow: `0 0 8px ${letter.sealColor}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', color: '#fff',
                  }}>💌</div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{letter.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {fromUser?.emoji} {fromUser?.name} ·
                      {isUnlocked ? (letter.isOpened ? ' 已打开' : ' ✨ 可打开') : ` 还有 ${Math.ceil((new Date(letter.unlockAt).getTime() - now) / 86400000)} 天`}
                    </div>
                  </div>
                  {!isUnlocked && <span style={{ fontSize: '1.3rem' }}>🔒</span>}
                  {isUnlocked && !letter.isOpened && <span style={{ fontSize: '1.3rem', animation: 'pulse 1.5s ease-in-out infinite' }}>✨</span>}
                </div>

                <AnimatePresence>
                  {isOpened && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      style={{ marginTop: 14, padding: 14, background: letter.sealColor + '08', borderRadius: '14px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', borderTop: `1px solid ${letter.sealColor}20` }}>
                      {letter.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
