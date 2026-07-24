import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SecretGardenPage() {
  const canvasRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  // Auto-unlock as demo (real implementation would use gesture recognition)
  const handleSecretPassword = () => {
    const pw = prompt('输入秘密暗号：', 'iloveyou');
    if (pw === 'iloveyou') {
      setIsUnlocked(true);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 20 }}>
        🌹 秘密花园
      </h1>

      {!isUnlocked ? (
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hand-drawn-card"
            style={{ padding: 40, marginBottom: 20 }}
          >
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔐</div>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
              这里藏着我们最私密的瞬间
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
              画一颗爱心，或者说出暗号才能进入哦～
            </p>
          </motion.div>

          <canvas
            ref={canvasRef}
            width={280}
            height={200}
            style={{
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--radius-card)',
              background: 'var(--bg-card)',
              marginBottom: 16,
              touchAction: 'none',
            }}
          />

          <div>
            <button className="hand-drawn-btn primary" onClick={handleSecretPassword}>
              🔑 用暗号解锁
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: '2rem' }}>🌸</span>
            <p style={{ color: 'var(--text-secondary)' }}>欢迎来到我们的秘密花园</p>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {['😘', '🤫', '💕', '🫣', '😴🥰', '🤗'].map((emoji, i) => (
              <div key={i} className="hand-drawn-card" style={{
                padding: 30, textAlign: 'center', fontSize: '3rem',
                minHeight: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {emoji}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
