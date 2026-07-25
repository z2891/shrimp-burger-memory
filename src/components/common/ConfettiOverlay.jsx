import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const COLORS = ['#FF6B6B', '#FFB347', '#F0C75E', '#8CB89F', '#B8D4E3', '#F8C8D8', '#E8A598'];
const EMOJIS = ['🎉', '💕', '✨', '🌸', '🎂', '💖', '🥳'];

export default function ConfettiOverlay({ onDismiss }) {
  const [particles, setParticles] = useState([]);
  const [message] = useState(() => {
    const today = new Date();
    const mmdd = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    if (mmdd === '02-14') return '💕 今天是我们的纪念日（情人节）！';
    if (mmdd === '01-23') return '🦐 虾米生日快乐！';
    if (mmdd === '12-12') return '🍔 汉堡生日快乐！';
    return '🎉 今天是特别的日子！';
  });

  useEffect(() => {
    const p = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 3,
      size: 10 + Math.random() * 20,
    }));
    setParticles(p);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
      onClick={onDismiss}
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -50, x: p.x + '%', opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: 360 + Math.random() * 720,
            x: [p.x + '%', (p.x + (Math.random() - 0.5) * 40) + '%'],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            fontSize: p.size + 'px',
            top: 0,
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          border: '2px solid var(--border-color)',
          padding: '32px 40px',
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          color: 'var(--text-primary)',
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎊</div>
        <div>{message}</div>
        <div style={{ fontSize: '0.9rem', marginTop: 12, opacity: 0.6 }}>
          点击任意处继续
        </div>
      </motion.div>
    </motion.div>
  );
}
