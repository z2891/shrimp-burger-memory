import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function CountdownTimer({ targetDate }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const diff = new Date(targetDate).getTime() - now;
  if (diff <= 0) return <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-gold)' }}>🎉 就是今天！</div>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[{ v: d, l: '天' }, { v: h, l: '时' }, { v: m, l: '分' }, { v: s, l: '秒' }].map(({ v, l }) => (
        <div key={l} style={{ textAlign: 'center' }}>
          <div style={{
            background: 'var(--bg-card)', border: '2px solid var(--border-color)',
            borderRadius: '10px', padding: '8px 12px', minWidth: 48,
            fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--coral)',
            boxShadow: 'var(--shadow-soft)',
          }}>{String(v).padStart(2, '0')}</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
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
    addCountdown({ title: icon + ' ' + title.trim(), targetDate, createdBy: user?.username, icon });
    setShowCreate(false); setTitle(''); setTargetDate(''); setIcon('⏳');
  };

  return (
    <div>
      <div className="page-header">
        <h1>⏳ 一起倒数吧</h1>
        <p>设定期待的事件，一起等待那天到来 💫</p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowCreate(!showCreate)}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        ➕ {showCreate ? '收起' : '新建倒数'}
      </button>

      <AnimatePresence>
        {showCreate && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="hand-drawn-card" onSubmit={handleCreate}
            style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['⏳','🏖️','🎂','💕','✈️','🏠','🎄','🎁'].map(i => (
                <button key={i} type="button" onClick={() => setIcon(i)}
                  className="chip" style={{ borderColor: icon === i ? 'var(--shrimp-color)' : undefined, background: icon === i ? 'var(--shrimp-light)' : undefined, fontSize: '1.3rem', padding: '4px 8px' }}>
                  {i}
                </button>
              ))}
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="倒数什么？" className="input-field" />
            <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="input-field" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowCreate(false)} className="hand-drawn-btn">取消</button>
              <button type="submit" className="hand-drawn-btn primary">创建</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {countdowns.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">⏳</span><p className="empty-title">还没有倒数</p></div>
        ) : (
          countdowns.map(cd => (
            <motion.div key={cd.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="hand-drawn-card" style={{ padding: 20, textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 14 }}>
                {cd.icon} {cd.title.replace(cd.icon + ' ', '')}
              </h3>
              <CountdownTimer targetDate={cd.targetDate} />
              <button onClick={() => { if (window.confirm('删除这个倒数？')) deleteCountdown(cd.id); }}
                style={{ marginTop: 12, fontSize: '0.68rem', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                删除
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
