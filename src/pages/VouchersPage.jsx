import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS, VOUCHER_TEMPLATES } from '../utils/constants.js';

export default function VouchersPage() {
  const { data, addVoucher, redeemVoucher } = useData();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const vouchers = data.vouchers || [];
  const partnerKey = user?.username === 'xia-mi' ? 'han-bao' : 'xia-mi';

  const handleCreate = (e) => {
    e.preventDefault();
    const title = selectedTemplate
      ? VOUCHER_TEMPLATES[selectedTemplate].title
      : newTitle;
    const desc = selectedTemplate
      ? VOUCHER_TEMPLATES[selectedTemplate].description
      : newDesc;
    const icon = selectedTemplate
      ? VOUCHER_TEMPLATES[selectedTemplate].icon
      : '🎫';

    if (!title.trim()) return;

    addVoucher({
      from: user?.username,
      title, description: desc, icon,
      isRedeemed: false, redeemedAt: null,
      createdAt: Date.now(),
    });
    setShowCreate(false); setNewTitle(''); setNewDesc(''); setSelectedTemplate(null);
  };

  const handleRedeem = (voucher) => {
    if (window.confirm('确定要兑换这张券吗？')) {
      redeemVoucher(voucher.id);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>🎫 小卖部兑换券</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          给对方发一张兑换券，ta可以来兑换哦
        </p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowCreate(!showCreate)} style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        🎫 制作兑换券
      </button>

      {showCreate && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="hand-drawn-card"
          onSubmit={handleCreate}
          style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>选择模板</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {VOUCHER_TEMPLATES.map((t, i) => (
              <button
                key={i} type="button"
                onClick={() => setSelectedTemplate(selectedTemplate === i ? null : i)}
                style={{
                  padding: '8px 12px', borderRadius: 'var(--radius-tag)',
                  border: selectedTemplate === i ? '2px solid var(--shrimp-color)' : '1px solid var(--border-color)',
                  background: selectedTemplate === i ? 'var(--shrimp-light)' : 'var(--bg-card)',
                  cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-body)',
                }}
              >
                {t.icon} {t.title}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>或自定义：</p>
          <input
            value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="券名（如：洗碗券）"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)' }}
          />
          <input
            value={newDesc} onChange={e => setNewDesc(e.target.value)}
            placeholder="描述（如：有效期永久）"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)' }}
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCreate(false)} className="hand-drawn-btn">取消</button>
            <button type="submit" className="hand-drawn-btn primary">🎫 制作</button>
          </div>
        </motion.form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {vouchers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem' }}>🎫</div>
            <p>还没有兑换券，做一张给Ta吧～</p>
          </div>
        ) : (
          vouchers.map(v => {
            const from = USERS[v.from];
            return (
              <motion.div
                key={v.id}
                className="hand-drawn-card"
                style={{
                  padding: 16,
                  borderStyle: 'dashed',
                  borderColor: v.isRedeemed ? 'var(--text-muted)' : from?.color || 'var(--border-color)',
                  opacity: v.isRedeemed ? 0.5 : 1,
                  position: 'relative',
                }}
              >
                {v.isRedeemed && (
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-15deg)',
                    fontSize: '3rem', opacity: 0.3, pointerEvents: 'none',
                  }}>
                    已兑换
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '2rem' }}>{v.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>
                      {v.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {v.description}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {from?.emoji} {from?.name} 出品
                    </div>
                  </div>
                  {!v.isRedeemed && v.from !== user?.username && (
                    <button
                      onClick={() => handleRedeem(v)}
                      className="hand-drawn-btn burger"
                      style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                    >
                      兑换
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
