import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS } from '../utils/constants.js';

export default function ExpressionsPage() {
  const { data, addExpression } = useData();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const expressions = data.expressions || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    addExpression({
      author: user?.username,
      content: input.trim(),
      date: new Date().toISOString().split('T')[0],
      turn: expressions.length + 1,
    });
    setInput('');
    setShowInput(false);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>💝 "我爱你"的100种表达</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          不说"我爱你"，却能表达爱意的话 · 已写 {expressions.length} 条
        </p>
      </div>

      {/* Progress */}
      <div style={{
        height: 8, borderRadius: 4, background: 'var(--border-color)',
        marginBottom: 20, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: Math.min(expressions.length, 100) + '%' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--shrimp-color), var(--burger-color))', borderRadius: 4 }}
        />
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowInput(!showInput)} style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        {showInput ? '❌ 收起' : '💬 今天轮到谁写？'}
      </button>

      {showInput && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          style={{ marginBottom: 20 }}
        >
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            placeholder="换一种方式说爱你……"
            style={{
              width: '100%', padding: '12px', borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)',
              fontSize: '0.9rem', resize: 'vertical',
            }}
          />
          <button type="submit" className="hand-drawn-btn primary" style={{ marginTop: 8, width: '100%' }}>
            💕 提交
          </button>
        </motion.form>
      )}

      {/* Expression Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...expressions].reverse().map((expr, idx) => {
          const author = USERS[expr.author];
          return (
            <motion.div
              key={expr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="hand-drawn-card"
              style={{
                padding: 14,
                borderLeft: '3px solid ' + author?.color,
                transform: 'rotate(' + ((idx % 2 === 0 ? 1 : -1) * 0.5) + 'deg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '1.2rem' }}>{author?.emoji}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {author?.name} · 第{expr.turn}条 · {expr.date}
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                "{expr.content}"
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
