import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { USERS } from '../../utils/constants.js';

export default function DiaryBook({ entries, onNewEntry }) {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);

  if (!entries || entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📔</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>还没有日记，来写第一篇吧～</p>
        <button className="hand-drawn-btn primary" onClick={onNewEntry}>
          ✏️ 写日记
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {entries.map((entry, idx) => {
        const isExpanded = expandedId === entry.id;
        const ownEntry = entry.entries[user?.username];
        const partnerKey = user?.username === 'xia-mi' ? 'han-bao' : 'xia-mi';
        const partnerEntry = entry.entries[partnerKey];
        const partner = USERS[partnerKey];
        const bothWritten = ownEntry?.content && partnerEntry?.content;

        return (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="hand-drawn-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: isExpanded ? 12 : 0,
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📅 {entry.date}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '4px 0 0' }}>
                  {entry.topic}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {bothWritten && <span>✅</span>}
                {!bothWritten && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>等待中...</span>}
                <span style={{ fontSize: '0.8rem', color: 'var(--coral)' }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
              >
                {/* Own entry */}
                <div style={{
                  background: user?.color === '#FF6B6B' ? 'var(--shrimp-light)' : 'var(--burger-light)',
                  padding: 12, borderRadius: '12px',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {user?.emoji} {user?.name}的日记
                  </div>
                  {ownEntry?.content ? (
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {ownEntry.content}
                    </p>
                  ) : (
                    <button
                      className="hand-drawn-btn primary"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                      onClick={(e) => { e.stopPropagation(); onNewEntry(entry); }}
                    >
                      ✏️ 写日记
                    </button>
                  )}
                  {ownEntry?.mood && (
                    <div style={{ marginTop: 8, fontSize: '0.75rem', opacity: 0.6 }}>
                      🎵 心情：{ownEntry.mood}
                    </div>
                  )}
                </div>

                {/* Partner entry */}
                <div style={{
                  background: partner?.color === '#FFB347' ? 'var(--burger-light)' : 'var(--shrimp-light)',
                  padding: 12, borderRadius: '12px',
                  position: 'relative',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {partner?.emoji} {partner?.name}的日记
                  </div>
                  {partnerEntry?.content ? (
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {partnerEntry.content}
                    </p>
                  ) : (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: 60, color: 'var(--text-muted)', fontSize: '0.85rem',
                    }}>
                      🔒 还没写呢～
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      <button className="hand-drawn-btn primary" onClick={() => onNewEntry(null)} style={{ alignSelf: 'center' }}>
        ✏️ 写新日记
      </button>
    </div>
  );
}
