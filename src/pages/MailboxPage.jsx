import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { USERS } from '../utils/constants.js';

export default function MailboxPage() {
  const { data, addMailboxLetter } = useData();
  const { user } = useAuth();
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [openedId, setOpenedId] = useState(null);

  const mailbox = data.mailbox || [];
  const partnerKey = user?.username === 'xia-mi' ? 'han-bao' : 'xia-mi';
  const partner = USERS[partnerKey];
  const myMessages = mailbox.filter(m => m.to === user?.username);
  const unreadCount = myMessages.filter(m => !m.isRead).length;

  const handleCompose = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addMailboxLetter({
      from: user?.username, to: partnerKey, title: title.trim(), content: content.trim(),
      sendAt: new Date().toISOString(), deliveredAt: new Date().toISOString(),
      isDelivered: true, isRead: false, moodStamp: 'happy-bubble',
    });
    setShowCompose(false); setTitle(''); setContent('');
  };

  const handleOpen = (msg) => {
    setOpenedId(msg.id);
  };

  return (
    <div>
      <div className="page-header">
        <h1>📬 帮我记住</h1>
        <p>{unreadCount > 0 ? `📨 你有 ${unreadCount} 条新消息！` : `把想给${partner?.emoji}${partner?.name}看的瞬间放在这里`}</p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowCompose(!showCompose)}
        style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        ✍️ 写信给{partner?.emoji}{partner?.name}
      </button>

      <AnimatePresence>
        {showCompose && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="hand-drawn-card" onSubmit={handleCompose}
            style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题" className="input-field" />
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="想说的话……" className="textarea-field" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowCompose(false)} className="hand-drawn-btn">取消</button>
              <button type="submit" className="hand-drawn-btn primary">📨 发送</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {myMessages.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📭</span><p className="empty-title">信箱空空</p><p className="empty-subtitle">等待Ta的消息～</p></div>
        ) : (
          myMessages.map(msg => {
            const from = USERS[msg.from];
            const isOpened = openedId === msg.id;
            return (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`hand-drawn-card flat`}
                style={{ padding: 14, cursor: 'pointer', borderColor: !msg.isRead ? from?.color : undefined, borderWidth: !msg.isRead ? '3px' : '2px' }}
                onClick={() => handleOpen(msg)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.3rem', animation: !msg.isRead ? 'pulse 2s ease-in-out infinite' : 'none' }}>
                    {!msg.isRead ? '📨' : '📖'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                      {msg.title} {!msg.isRead && <span className="tag" style={{ background: 'var(--coral)20', color: 'var(--coral)', borderColor: 'var(--coral)40', marginLeft: 6 }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>来自 {from?.emoji} {from?.name}</div>
                  </div>
                </div>
                <AnimatePresence>
                  {isOpened && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      style={{ marginTop: 12, padding: 12, background: from?.lightColor || 'var(--bg-primary)', borderRadius: '12px', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
