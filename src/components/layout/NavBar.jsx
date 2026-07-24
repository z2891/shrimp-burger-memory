import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';

const NAV_ITEMS = [
  { path: '/', label: '时光地图', emoji: '🗺️' },
  { path: '/diary', label: '交换日记', emoji: '📔' },
  { path: '/photos', label: '照片', emoji: '📸' },
  { path: '/more', label: '更多', emoji: '✨' },
];

const MORE_ITEMS = [
  { path: '/letters', label: '时光信', emoji: '💌' },
  { path: '/expressions', label: '100种表达', emoji: '💝' },
  { path: '/quiz', label: '问答罐', emoji: '🏺' },
  { path: '/vouchers', label: '小卖部', emoji: '🎫' },
  { path: '/countdowns', label: '倒数吧', emoji: '⏳' },
  { path: '/firsts', label: '第一次', emoji: '🏆' },
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
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg-card)', borderTop: '2px solid var(--border-color)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
      }}>
        {NAV_ITEMS.map(item => (
          <motion.button
            key={item.path}
            onClick={() => { if (item.path === '/more') setShowMore(!showMore); else navigate(item.path); }}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '4px 12px', borderRadius: '12px',
              background: isActive(item.path) ? 'var(--shrimp-light)' : 'transparent',
              border: isActive(item.path) ? '2px solid var(--shrimp-color)' : '2px solid transparent',
              cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div style={{
        position: 'fixed', top: 12, right: 16, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 8,
        background: (user?.color || '#ccc') + '22', padding: '6px 14px',
        borderRadius: '20px', border: '2px solid ' + (user?.color || '#ccc'),
        fontFamily: 'var(--font-body)', fontSize: '0.85rem',
        cursor: 'pointer',
      }} onClick={logout}>
        <span>{user?.emoji}</span>
        <span>{user?.name}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>退出</span>
      </div>

      {showMore && (
        <>
          <div onClick={() => setShowMore(false)} style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.2)' }} />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 99,
              background: 'var(--bg-card)', borderRadius: 'var(--radius-card)',
              border: '2px solid var(--border-color)', boxShadow: 'var(--shadow-popup)',
              padding: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
            }}
          >
            {MORE_ITEMS.map(item => (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => { navigate(item.path); setShowMore(false); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: 12, borderRadius: '12px',
                  background: isActive(item.path) ? 'var(--burger-light)' : 'var(--bg-primary)',
                  border: isActive(item.path) ? '2px solid var(--burger-color)' : '1px solid var(--border-color)',
                  cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </>
  );
}
