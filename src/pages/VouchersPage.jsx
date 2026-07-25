import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const partner = USERS[partnerKey];

  const handleCreate = (e) => {
    e.preventDefault();
    const title = selectedTemplate !== null ? VOUCHER_TEMPLATES[selectedTemplate].title : newTitle;
    const desc = selectedTemplate !== null ? VOUCHER_TEMPLATES[selectedTemplate].description : newDesc;
    const icon = selectedTemplate !== null ? VOUCHER_TEMPLATES[selectedTemplate].icon : '🎫';
    if (!title.trim()) return;
    addVoucher({ from: user?.username, title, description: desc, icon, isRedeemed: false, redeemedAt: null, createdAt: Date.now() });
    setShowCreate(false); setNewTitle(''); setNewDesc(''); setSelectedTemplate(null);
  };

  const handleRedeem = (v) => {
    if (window.confirm(`确定要兑换「${v.title}」吗？`)) redeemVoucher(v.id);
  };

  return (
    <div>
      <div className="page-header">
        <h1>🎫 小卖部兑换券</h1>
        <p>给对方发券，ta来兑换。点击「兑换」后券上会盖上可爱戳记～</p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowCreate(!showCreate)}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        🎫 {showCreate ? '收起' : '制作兑换券'}
      </button>

      <AnimatePresence>
        {showCreate && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="hand-drawn-card" onSubmit={handleCreate}
            style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>选择模板</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {VOUCHER_TEMPLATES.map((t, i) => (
                <button key={i} type="button" onClick={() => setSelectedTemplate(selectedTemplate === i ? null : i)}
                  className="chip" style={{
                    borderColor: selectedTemplate === i ? 'var(--shrimp-color)' : undefined,
                    background: selectedTemplate === i ? 'var(--shrimp-light)' : undefined,
                  }}>
                  {t.icon} {t.title}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>或自定义：</p>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="券名（如：洗碗券）" className="input-field" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="描述（如：有效期永久）" className="input-field" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowCreate(false)} className="hand-drawn-btn">取消</button>
              <button type="submit" className="hand-drawn-btn primary">🎫 制作</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {vouchers.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎫</span>
            <p className="empty-title">还没有兑换券</p>
            <p className="empty-subtitle">做一张券给Ta，比如"按摩券"、"免生气金牌"～</p>
          </div>
        ) : (
          vouchers.map(v => {
            const from = USERS[v.from];
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="hand-drawn-card flat"
                style={{
                  padding: 18, opacity: v.isRedeemed ? 0.55 : 1,
                  borderStyle: v.isRedeemed ? 'solid' : 'dashed',
                  borderTop: '2px dashed var(--border-color)',
                  position: 'relative', overflow: 'hidden',
                }}>
                {/* Perforated top edge */}
                <div style={{ position: 'absolute', top: -4, left: 16, right: 16, height: 6, display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bg-primary)', border: '1.5px solid var(--border-color)', flexShrink: 0 }} />
                  ))}
                </div>

                {/* Redeemed stamp */}
                {v.isRedeemed && (
                  <div style={{
                    position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%) rotate(-18deg)',
                    fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: '#E89920',
                    border: '3px solid #E89920', borderRadius: '12px', padding: '6px 20px',
                    opacity: 0.35, pointerEvents: 'none', zIndex: 1,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}>已兑换</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 'var(--radius-card)', fontSize: '2rem',
                    background: from?.color + '15', border: `2px solid ${from?.color || 'var(--border-color)'}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{v.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>{v.title}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0' }}>{v.description}</p>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {from?.emoji} {from?.name} 出品
                      {v.isRedeemed && v.redeemedAt && (
                        <span> · 已兑换于 {new Date(v.redeemedAt).toLocaleDateString('zh-CN')}</span>
                      )}
                    </div>
                  </div>
                  {!v.isRedeemed && v.from !== user?.username && (
                    <button onClick={() => handleRedeem(v)} className="hand-drawn-btn burger-btn small" style={{ padding: '7px 18px', flexShrink: 0 }}>
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
