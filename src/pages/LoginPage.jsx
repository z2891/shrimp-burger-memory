import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [openingDoor, setOpeningDoor] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Fix: generate star positions ONCE — not on every render
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 65,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 2.5,
    })), []
  );

  // Shooting star
  const [shootingStar, setShootingStar] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStar({
        left: Math.random() * 60 + 20,
        top: Math.random() * 30,
        delay: 0,
        key: Date.now(),
      });
    }, 4000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (shouldNavigate && isAuthenticated) {
      const timer = setTimeout(() => navigate('/'), 900);
      return () => clearTimeout(timer);
    }
  }, [shouldNavigate, isAuthenticated, navigate]);

  const handleEnter = (username) => {
    setOpeningDoor(username);
    login(username);
    setTimeout(() => setShouldNavigate(true), 150);
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(175deg, #0d0d2b 0%, #1a1a3e 30%, #162040 70%, #0f1835 100%)',
      padding: 20, overflow: 'hidden', position: 'relative',
    }}>
      {/* Stars with glow */}
      {stars.map(s => (
        <motion.div key={s.id}
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: s.left + '%', top: s.top + '%',
            width: s.size, height: s.size, borderRadius: '50%',
            background: '#fff',
            boxShadow: `0 0 ${s.size * 2}px #fff, 0 0 ${s.size * 4}px rgba(255,255,255,0.3)`,
          }}
        />
      ))}

      {/* Shooting star */}
      {shootingStar && (
        <motion.div key={shootingStar.key}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: -400, y: 400, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeIn' }}
          style={{
            position: 'absolute', left: shootingStar.left + '%', top: shootingStar.top + '%',
            width: 2, height: 2, borderRadius: '50%', background: '#fff',
            boxShadow: '0 0 6px 2px rgba(255,255,255,0.6), -8px 8px 4px -2px rgba(255,255,255,0.2)',
          }}
        />
      )}

      {/* Moon with glow */}
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '6%', right: '12%', fontSize: '4.5rem', filter: 'drop-shadow(0 0 20px rgba(253,226,211,0.25))' }}
      >🌙</motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ textAlign: 'center', marginBottom: 44, zIndex: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: '3.2rem', marginBottom: 8, filter: 'drop-shadow(0 0 16px rgba(253,226,211,0.2))' }}
        >🏰</motion.div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', color: '#FDE2D3', margin: '0 0 8px', textShadow: '0 2px 12px rgba(253,226,211,0.15)' }}>
          虾米与汉堡
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: '#B8A899', fontSize: '0.95rem' }}>
          的秘密星球
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        style={{ display: 'flex', gap: 28, zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {/* Shrimp door */}
        <DoorCard emoji="🦐" name="虾米" color="#FF6B6B" gradient="linear-gradient(145deg, #FFE8E8, #FFB8B8)" onClick={() => handleEnter('xia-mi')} />

        {/* Burger door */}
        <DoorCard emoji="🍔" name="汉堡" color="#FFB347" gradient="linear-gradient(145deg, #FFF4E0, #FFD699)" onClick={() => handleEnter('han-bao')} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ fontFamily: 'var(--font-body)', color: '#8B7355', fontSize: '0.78rem', zIndex: 1, marginTop: 36, textAlign: 'center' }}
      >
        选一扇门，进入我们的秘密星球 ✨
      </motion.p>

      {/* Door Opening transition */}
      {openingDoor && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: openingDoor === 'xia-mi'
              ? 'linear-gradient(160deg, #fff, #FFE0E0, #FFD0D0)'
              : 'linear-gradient(160deg, #fff, #FFF0D0, #FFE0B0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -200 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            style={{ fontSize: '5.5rem' }}
          >
            {openingDoor === 'xia-mi' ? '🦐' : '🍔'}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: 18 }}
          >
            {openingDoor === 'xia-mi' ? '虾米' : '汉堡'}，欢迎回家 💕
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}

function DoorCard({ emoji, name, color, gradient, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -4 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      style={{
        width: 150, padding: '28px 16px',
        borderRadius: '28px 10px 24px 14px',
        background: gradient, border: `3px solid ${color}`,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: `0 8px 32px ${color}40, inset 0 1px 0 rgba(255,255,255,0.4)`,
      }}
    >
      {/* Inner glow */}
      <div style={{
        position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
        width: 50, height: 50, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}30, transparent)`,
      }} />
      {/* Inner decorative border */}
      <div style={{
        position: 'absolute', inset: 6, borderRadius: 'inherit',
        border: `1px dashed ${color}50`, pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '2.8rem', marginBottom: 8, position: 'relative', zIndex: 2 }}>{emoji}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: color, position: 'relative', zIndex: 2 }}>
        {name}请进
      </div>
      <div style={{ fontSize: '0.65rem', color: color + '99', marginTop: 3, position: 'relative', zIndex: 2 }}>
        点我进门 →
      </div>
    </motion.button>
  );
}
