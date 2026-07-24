import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span>🎉 就是今天！</span>;

  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', fontFamily: 'var(--font-display)' }}>
      {[
        { val: timeLeft.days, label: '天' },
        { val: timeLeft.hours, label: '时' },
        { val: timeLeft.minutes, label: '分' },
        { val: timeLeft.seconds, label: '秒' },
      ].map(({ val, label }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            background: 'var(--bg-card)', border: '2px solid var(--border-color)',
            borderRadius: '8px', padding: '6px 10px', minWidth: 44,
            fontSize: '1.2rem', color: 'var(--coral)',
          }}>
            {String(val).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

function calcTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function CountdownsPage() {
  const { data, addCountdown, deleteCountdown } = useData();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('⏳');

  const countdowns = data.countdowns || [];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;
    addCountdown({ title: icon + ' ' + title, targetDate, createdBy: user?.username, icon });
    setShowCreate(false); setTitle(''); setTargetDate(''); setIcon('⏳');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>⏳ 一起倒数吧</h1>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowCreate(!showCreate)} style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        ➕ 新建倒数
      </button>

      {showCreate && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="hand-drawn-card"
          onSubmit={handleCreate}
          style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['⏳', '🏖️', '🎂', '💕', '✈️', '🏠', '🎄', '🎁'].map(i => (
              <button key={i} type="button" onClick={() => setIcon(i)} style={{
                fontSize: '1.5rem', padding: 4, borderRadius: 8,
                border: icon === i ? '2px solid var(--shrimp-color)' : '1px solid transparent',
                background: icon === i ? 'var(--shrimp-light)' : 'transparent',
                cursor: 'pointer',
              }}>{i}</button>
            ))}
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="倒数什么？"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)' }} />
          <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)' }} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCreate(false)} className="hand-drawn-btn">取消</button>
            <button type="submit" className="hand-drawn-btn primary">创建</button>
          </div>
        </motion.form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {countdowns.map(cd => (
          <motion.div key={cd.id} className="hand-drawn-card" style={{ padding: 20, textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 12 }}>
              {cd.icon} {cd.title.replace(cd.icon + ' ', '')}
            </h3>
            <CountdownTimer targetDate={cd.targetDate} />
            <button
              onClick={() => { if (window.confirm('删除这个倒数？')) deleteCountdown(cd.id); }}
              style={{ marginTop: 12, fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              删除
            </button>
          </motion.div>
        ))}
        {countdowns.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem' }}>⏳</div>
            <p>还没有倒数，创建一个吧～</p>
          </div>
        )}
      </div>
    </div>
  );
}
