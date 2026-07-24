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
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>💌 时光信</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          写给未来的信，到期才能打开
        </p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => navigate('/letters/write')} style={{ marginBottom: 20, width: '100%', justifyContent: 'center' }}>
        ✍️ 写一封时光信
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {letters.map(letter => {
          const fromUser = USERS[letter.from];
          const isUnlocked = new Date(letter.unlockAt).getTime() <= now;
          const isOpened = openedId === letter.id;

          return (
            <motion.div
              key={letter.id}
              layout
              className="hand-drawn-card"
              style={{
                cursor: isUnlocked ? 'pointer' : 'default',
                opacity: isUnlocked ? 1 : 0.7,
                borderColor: isUnlocked ? 'var(--color-gold)' : 'var(--border-color)',
              }}
              onClick={() => handleOpen(letter)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Envelope */}
                <div style={{
                  width: 50, height: 50, borderRadius: '12px',
                  background: letter.sealColor + '30',
                  border: '2px solid ' + letter.sealColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  💌
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>
                    {letter.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {fromUser?.emoji} {fromUser?.name} · {
                      isUnlocked
                        ? letter.isOpened ? '已打开' : '可打开'
                        : '还有 ' + Math.ceil((new Date(letter.unlockAt).getTime() - now) / 86400000) + ' 天'
                    }
                  </div>
                </div>
                {!isUnlocked && <span>🔒</span>}
                {isUnlocked && !letter.isOpened && <span style={{ color: 'var(--color-gold)' }}>✨</span>}
              </div>

              <AnimatePresence>
                {isOpened && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      marginTop: 12, padding: 12,
                      background: letter.sealColor + '10',
                      borderRadius: '12px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {letter.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {letters.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📮</div>
            <p>还没有时光信，写一封给未来的Ta吧～</p>
          </div>
        )}
      </div>
    </div>
  );
}
