import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS } from '../utils/constants.js';

const WATERCOLORS = ['#FFE0E0', '#FFF0D0', '#E8F4E8', '#E8F0F8', '#F5E6FF', '#FFF5E0', '#E0F4F4', '#FDE2D3'];

export default function ExpressionsPage() {
  const { data, addExpression } = useData();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const expressions = data.expressions || [];
  const count = expressions.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    addExpression({ author: user?.username, content: input.trim(), date: new Date().toISOString().split('T')[0], turn: count + 1 });
    setInput(''); setShowInput(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>💝 100种表达</h1>
        <p>不说"我爱你"，却能表达爱意的话 · 已写 <strong style={{ color: 'var(--coral)' }}>{count}</strong> 条</p>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 4, background: 'var(--bg-card)', border: '1px solid var(--border-color)', marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: Math.min(count, 100) + '%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, var(--shrimp-color), var(--color-gold), var(--burger-color))' }} />
        {count >= 100 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', right: 4, top: -2, fontSize: '1rem' }}>🎉</motion.div>
        )}
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowInput(!showInput)}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        {showInput ? '❌ 收起' : '💬 写下今天的表达'}
      </button>

      {showInput && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={3}
            placeholder="换一种方式说爱你……" className="textarea-field" />
          <button type="submit" className="hand-drawn-btn primary" style={{ marginTop: 8, width: '100%' }}>💕 提交</button>
        </motion.form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...expressions].reverse().map((expr, idx) => {
          const author = USERS[expr.author];
          const bgColor = WATERCOLORS[idx % WATERCOLORS.length];
          return (
            <motion.div key={expr.id}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: idx * 0.02 }}
              className="hand-drawn-card flat"
              style={{
                padding: 14, borderLeft: `3px solid ${author?.color || '#ccc'}`,
                background: `linear-gradient(135deg, var(--bg-card), ${bgColor})`,
                transform: `rotate(${(idx % 2 === 0 ? 0.8 : -0.8)}deg)`,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: '1.1rem' }}>{author?.emoji}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{author?.name} · 第{expr.turn}条 · {expr.date}</span>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic' }}>
                "{expr.content}"
              </p>
            </motion.div>
          );
        })}
        {count === 0 && (
          <div className="empty-state">
            <span className="empty-icon">💝</span>
            <p className="empty-title">还没有表达</p>
            <p className="empty-subtitle">写下第一条吧～</p>
          </div>
        )}
      </div>
    </div>
  );
}
