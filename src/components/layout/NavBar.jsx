import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';

const NAV_ITEMS = [
  { path: '/', label: '时光', emoji: '🗺️' },
  { path: '/diary', label: '日记', emoji: '📔' },
  { path: '/photos', label: '照片', emoji: '📸' },
  { path: '/more', label: '更多', emoji: '✨' },
];

const MORE_ITEMS = [
  { path: '/letters', label: '时光信', emoji: '💌', color: '#F0C75E' },
  { path: '/expressions', label: '表达', emoji: '💝', color: '#FF6B6B' },
  { path: '/quiz', label: '问答', emoji: '🏺', color: '#B8D4E3' },
  { path: '/vouchers', label: '小卖部', emoji: '🎫', color: '#FFB347' },
  { path: '/countdowns', label: '倒数', emoji: '⏳', color: '#8CB89F' },
  { path: '/firsts', label: '第一次', emoji: '🏆', color: '#F0C75E' },
];

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Floating glass nav bar */}
      <nav className="glass" style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, borderRadius: 'var(--radius-btn)',
        border: '1.5px solid rgba(212,196,176,0.5)',
        boxShadow: 'var(--shadow-popup)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '6px 4px',
        width: 'calc(100% - 32px)', maxWidth: 600,
        gap: 2,
      }}>
        {NAV_ITEMS.map(item => (
          <motion.button
            key={item.path}
            onClick={() => { if (item.path === '/more') setShowMore(!showMore); else { navigate(item.path); setShowMore(false); } }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              padding: '6px 0', flex: 1, borderRadius: '14px',
              background: isActive(item.path) ? (item.path === '/more' ? 'var(--burger-light)' : 'var(--shrimp-light)') : 'transparent',
              cursor: 'pointer', fontSize: '0.65rem', color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: '1.3rem', transition: 'transform 0.2s' }}>{item.emoji}</span>
            <span>{item.label}</span>
            {/* Active dot */}
            {isActive(item.path) && (
              <motion.div layoutId="nav-dot" style={{
                position: 'absolute', bottom: 0, width: 5, height: 5,
                borderRadius: '50%', background: 'var(--shrimp-color)',
              }} />
            )}
          </motion.button>
        ))}
      </nav>

      {/* User badge */}
      <motion.div
        whileTap={{ scale: 0.95 }}
        onClick={logout}
        style={{
          position: 'fixed', top: 12, right: 12, zIndex: 101,
          display: 'flex', alignItems: 'center', gap: 7,
          background: (user?.color || '#ccc') + '15', padding: '5px 14px',
          borderRadius: '20px', border: `1.5px solid ${user?.color || '#ccc'}40`,
          fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)',
          cursor: 'pointer', backdropFilter: 'blur(8px)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>{user?.emoji}</span>
        <span>{user?.name}</span>
        <span style={{ fontSize: '0.6rem', opacity: 0.4, marginLeft: 2 }}>退出</span>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMore(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(61,43,31,0.2)', backdropFilter: 'blur(2px)' }}
          />
        )}
      </AnimatePresence>

      {/* More menu */}
      {showMore && (
        <motion.div
          initial={{ opacity: 0, y: 120, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          style={{
            position: 'fixed', bottom: 90, left: 16, right: 16, zIndex: 99,
            maxWidth: 600, margin: '0 auto',
            background: 'var(--bg-card)', borderRadius: 'var(--radius-card)',
            border: '2px solid var(--border-color)', boxShadow: 'var(--shadow-popup)',
            padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}
        >
          {MORE_ITEMS.map(item => (
            <motion.button
              key={item.path} whileTap={{ scale: 0.9 }}
              onClick={() => { navigate(item.path); setShowMore(false); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                padding: 12, borderRadius: '14px',
                background: isActive(item.path) ? item.color + '18' : 'var(--bg-primary)',
                border: isActive(item.path) ? `2px solid ${item.color}` : '1px solid var(--border-color)',
                cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
              <span>{item.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </>
  );
}
