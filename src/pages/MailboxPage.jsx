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

  // Messages for the current user
  const myMessages = mailbox.filter(m => m.to === user?.username);
  const unreadCount = myMessages.filter(m => !m.isRead).length;

  const handleCompose = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addMailboxLetter({
      from: user?.username,
      to: partnerKey,
      title: title.trim(),
      content: content.trim(),
      sendAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      isDelivered: true,
      isRead: false,
      moodStamp: 'happy-bubble',
    });
    setShowCompose(false);
    setTitle('');
    setContent('');
  };

  const handleOpen = (msg) => {
    setOpenedId(msg.id);
    if (!msg.isRead) {
      // Mark as read
      const updated = mailbox.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
      localStorage.setItem('couple_mailbox', JSON.stringify(updated));
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>📬 帮我记住</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          {unreadCount > 0 ? `📨 你有 ${unreadCount} 条新消息！` : '把想给对方看的瞬间放在这里'}
        </p>
      </div>

      <button className="hand-drawn-btn primary" onClick={() => setShowCompose(!showCompose)} style={{ width: '100%', justifyContent: 'center', marginBottom: 20 }}>
        ✍️ 写信给{partner?.emoji}{partner?.name}
      </button>

      {showCompose && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="hand-drawn-card"
          onSubmit={handleCompose}
          style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题"
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)' }} />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="想说的话……"
            style={{ padding: '12px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowCompose(false)} className="hand-drawn-btn">取消</button>
            <button type="submit" className="hand-drawn-btn primary">📨 发送</button>
          </div>
        </motion.form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {myMessages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem' }}>📭</div>
            <p>信箱空空，等待Ta的消息～</p>
          </div>
        ) : (
          myMessages.map(msg => {
            const from = USERS[msg.from];
            const isOpened = openedId === msg.id;
            return (
              <motion.div
                key={msg.id}
                className="hand-drawn-card"
                style={{
                  padding: 14, cursor: 'pointer',
                  borderColor: !msg.isRead ? from?.color : 'var(--border-color)',
                  borderWidth: !msg.isRead ? '3px' : '2px',
                }}
                onClick={() => handleOpen(msg)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{!msg.isRead ? '📨' : '📖'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                      {msg.title} {!msg.isRead && <span style={{ color: 'var(--coral)', fontSize: '0.7rem' }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      来自 {from?.emoji} {from?.name}
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {isOpened && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      style={{
                        marginTop: 12, padding: 12,
                        background: from?.lightColor || 'var(--bg-primary)',
                        borderRadius: '12px', fontSize: '0.9rem',
                        lineHeight: 1.8, whiteSpace: 'pre-wrap',
                      }}
                    >
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
