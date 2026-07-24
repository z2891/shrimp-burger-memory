import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedDoor, setSelectedDoor] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOpening, setIsOpening] = useState(false);

  const handleDoorClick = (username) => {
    setSelectedDoor(username);
    setPassword('');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedDoor || !password) return;

    const result = login(selectedDoor, password);
    if (result.success) {
      setIsOpening(true);
      setTimeout(() => navigate('/'), 1000);
    } else {
      setError(result.error);
    }
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
        style={{ textAlign: 'center', marginBottom: 40, zIndex: 1 }}
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
      <div style={{
        display: 'flex', gap: 24, zIndex: 1,
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {/* 虾米's Door */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDoorClick('xia-mi')}
          style={{
            width: 140, padding: '24px 16px',
            borderRadius: 'var(--radius-card)',
            background: selectedDoor === 'xia-mi'
              ? 'linear-gradient(135deg, #FFE0E0, #FFB3B3)'
              : 'linear-gradient(135deg, #3D2B1F, #5C4033)',
            border: selectedDoor === 'xia-mi'
              ? '3px solid #FF6B6B'
              : '2px solid #8B7355',
            cursor: 'pointer',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🦐</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', color: selectedDoor === 'xia-mi' ? '#D94444' : '#FDE2D3',
          }}>
            虾米请进
          </div>
          {selectedDoor === 'xia-mi' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 12, height: 12, borderRadius: '50%',
                background: '#FF6B6B',
              }}
            />
          )}
        </motion.button>

        {/* 汉堡's Door */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDoorClick('han-bao')}
          style={{
            width: 140, padding: '24px 16px',
            borderRadius: 'var(--radius-card)',
            background: selectedDoor === 'han-bao'
              ? 'linear-gradient(135deg, #FFF0D0, #FFD699)'
              : 'linear-gradient(135deg, #3D2B1F, #5C4033)',
            border: selectedDoor === 'han-bao'
              ? '3px solid #FFB347'
              : '2px solid #8B7355',
            cursor: 'pointer',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🍔</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', color: selectedDoor === 'han-bao' ? '#E89920' : '#FDE2D3',
          }}>
            汉堡请进
          </div>
          {selectedDoor === 'han-bao' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 12, height: 12, borderRadius: '50%',
                background: '#FFB347',
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Password Form */}
      <AnimatePresence>
        {selectedDoor && (
          <motion.form
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            onSubmit={handleLogin}
            style={{
              marginTop: 24, zIndex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
            }}
          >
            <div style={{
              fontFamily: 'var(--font-body)',
              color: '#B8A899', fontSize: '0.9rem',
            }}>
              请输入暗号
            </div>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="🔒 暗号"
              autoFocus
              style={{
                width: 240, padding: '12px 16px',
                borderRadius: '25px',
                border: error ? '2px solid #FF6B6B' : '2px solid #8B7355',
                background: 'rgba(255,255,255,0.1)',
                color: '#FDE2D3', fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                outline: 'none',
              }}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: '#FF6B6B', fontSize: '0.85rem' }}
              >
                {error}
              </motion.div>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 32px', borderRadius: '25px',
                border: 'none',
                background: selectedDoor === 'xia-mi'
                  ? 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'
                  : 'linear-gradient(135deg, #FFB347, #FFC773)',
                color: '#fff', fontSize: '1rem',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              🚪 开门
            </motion.button>
            <p style={{ color: '#8B7355', fontSize: '0.75rem', marginTop: 4 }}>
              提示：我们的纪念日（2026.02.14）💕
            </p>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Door Opening Animation */}
      {isOpening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 999,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ fontSize: '4rem' }}
          >
            {selectedDoor === 'xia-mi' ? '🦐' : '🍔'}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
