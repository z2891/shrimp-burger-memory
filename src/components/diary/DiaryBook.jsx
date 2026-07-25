import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { USERS } from '../../utils/constants.js';

export default function DiaryBook({ entries, onNewEntry, onEditOwn }) {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);

  if (!entries || entries.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📔</span>
        <p className="empty-title">还没有日记</p>
        <p className="empty-subtitle">写下第一篇只属于你们的交换日记吧～</p>
        <button className="hand-drawn-btn primary" onClick={() => onNewEntry(null)}>✏️ 写日记</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {entries.map((entry, idx) => {
        const isExpanded = expandedId === entry.id;
        const ownEntry = entry.entries?.[user?.username];
        const partnerKey = user?.username === 'xia-mi' ? 'han-bao' : 'xia-mi';
        const partnerEntry = entry.entries?.[partnerKey];
        const partner = USERS[partnerKey];
        const bothWritten = ownEntry?.content && partnerEntry?.content;

        return (
          <motion.div key={entry.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.04 }}
            className={`hand-drawn-card${bothWritten ? '' : ' flat'}`}
            style={{ cursor: 'pointer', padding: 16 }}
            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📅 {entry.date}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: '4px 0 0' }}>{entry.topic}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {bothWritten ? (
                  <span className="tag" style={{ background: 'var(--color-gold)20', border: '1px solid var(--color-gold)50', color: 'var(--color-gold)' }}>✅ 已完成</span>
                ) : (
                  <span className="tag" style={{ opacity: 0.6 }}>等待中</span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'sans-serif' }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}
              >
                {/* Own entry */}
                <div style={{
                  background: user?.color === '#FF6B6B' ? 'var(--shrimp-light)' : 'var(--burger-light)',
                  padding: 14, borderRadius: '14px',
                  border: `1.5px solid ${user?.color || 'var(--border-color)'}30`,
                  position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {user?.emoji} {user?.name}的日记
                    </div>
                    {ownEntry?.content && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditOwn(entry); }}
                        className="hand-drawn-btn ghost small"
                        style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                        title="修改日记"
                      >✏️</button>
                    )}
                  </div>
                  {ownEntry?.content ? (
                    <>
                      {ownEntry.photo && (
                        <img src={ownEntry.photo} alt="日记配图"
                          style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 8, border: '1px solid var(--border-color)' }} />
                      )}
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{ownEntry.content}</p>
                    </>
                  ) : (
                    <button className="hand-drawn-btn primary small" onClick={(e) => { e.stopPropagation(); onNewEntry(entry); }}>
                      ✏️ 写日记
                    </button>
                  )}
                  {ownEntry?.mood && <div style={{ marginTop: 8, fontSize: '0.7rem', opacity: 0.5 }}>🎵 心情：{ownEntry.mood}</div>}
                </div>

                {/* Partner entry */}
                <div style={{
                  background: partner?.color === '#FFB347' ? 'var(--burger-light)' : 'var(--shrimp-light)',
                  padding: 14, borderRadius: '14px', position: 'relative',
                  border: `1.5px solid ${partner?.color || 'var(--border-color)'}30`,
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {partner?.emoji} {partner?.name}的日记
                  </div>
                  {partnerEntry?.content ? (
                    <>
                      {partnerEntry.photo && (
                        <img src={partnerEntry.photo} alt="日记配图"
                          style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 8, border: '1px solid var(--border-color)' }} />
                      )}
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{partnerEntry.content}</p>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 60, color: 'var(--text-muted)', fontSize: '0.85rem', gap: 6 }}>
                      <span style={{ fontSize: '1.2rem' }}>🔐</span> 还没写呢～
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      <button className="hand-drawn-btn primary" onClick={() => onNewEntry(null)} style={{ alignSelf: 'center', marginTop: 8 }}>
        ✏️ 写新日记
      </button>
    </div>
  );
}
