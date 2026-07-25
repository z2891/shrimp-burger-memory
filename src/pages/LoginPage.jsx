import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [openingDoor, setOpeningDoor] = useState(null);

  const handleEnter = (username) => {
    setOpeningDoor(username);
    login(username);
    setTimeout(() => navigate('/'), 1200);
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: 20, overflow: 'hidden', position: 'relative',
    }}>
      {/* Starry background */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          style={{
            position: 'absolute',
            left: Math.random() * 100 + '%',
            top: Math.random() * 60 + '%',
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 ' + (2+Math.random()*4) + 'px #fff',
          }}
        />
      ))}

      {/* Moon */}
      <div style={{ position: 'absolute', top: '8%', right: '15%', fontSize: '4rem', opacity: 0.8 }}>🌙</div>

      {/* Title */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ textAlign: 'center', marginBottom: 48, zIndex: 1 }}
      >
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏰</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem', color: '#FDE2D3',
          margin: '0 0 8px',
        }}>
          虾米与汉堡
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#B8A899', fontSize: '1rem',
        }}>
          的秘密星球
        </p>
      </motion.div>

      {/* Two Doors */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          display: 'flex', gap: 24, zIndex: 1,
          flexWrap: 'wrap', justifyContent: 'center',
        }}
      >
        {/* 虾米's Door */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleEnter('xia-mi')}
          style={{
            width: 160, padding: '32px 20px',
            borderRadius: '24px 8px 20px 12px',
            background: 'linear-gradient(135deg, #FFE0E0, #FFB3B3)',
            border: '3px solid #FF6B6B',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)',
          }}
        >
          {/* Door glow */}
          <div style={{
            position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
            width: 60, height: 60, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,107,0.3), transparent)',
          }} />
          <div style={{ fontSize: '3rem', marginBottom: 10 }}>🦐</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem', color: '#D94444',
          }}>
            虾米请进
          </div>
          <div style={{ fontSize: '0.7rem', color: '#D9444488', marginTop: 4 }}>
            点我进门 →
          </div>
        </motion.button>

        {/* 汉堡's Door */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => handleEnter('han-bao')}
          style={{
            width: 160, padding: '32px 20px',
            borderRadius: '24px 8px 20px 12px',
            background: 'linear-gradient(135deg, #FFF0D0, #FFD699)',
            border: '3px solid #FFB347',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(255, 179, 71, 0.3)',
          }}
        >
          <div style={{
            position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
            width: 60, height: 60, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,179,71,0.3), transparent)',
          }} />
          <div style={{ fontSize: '3rem', marginBottom: 10 }}>🍔</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem', color: '#E89920',
          }}>
            汉堡请进
          </div>
          <div style={{ fontSize: '0.7rem', color: '#E8992088', marginTop: 4 }}>
            点我进门 →
          </div>
        </motion.button>
      </motion.div>

      <p style={{
        fontFamily: 'var(--font-body)',
        color: '#8B7355', fontSize: '0.8rem',
        zIndex: 1, marginTop: 32,
        textAlign: 'center',
      }}>
        选一扇门，进入我们的秘密星球 ✨
      </p>

      {/* Door Opening Animation */}
      {openingDoor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: openingDoor === 'xia-mi'
              ? 'linear-gradient(135deg, #ffffff, #FFE0E0)'
              : 'linear-gradient(135deg, #ffffff, #FFF0D0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ fontSize: '5rem' }}
          >
            {openingDoor === 'xia-mi' ? '🦐' : '🍔'}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem', color: 'var(--text-primary)',
              marginTop: 16,
            }}
          >
            {openingDoor === 'xia-mi' ? '虾米' : '汉堡'}，欢迎回来 💕
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
