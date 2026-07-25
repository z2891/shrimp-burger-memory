import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryPopup from './MemoryPopup.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { MOOD_STAMPS, USERS } from '../../utils/constants.js';

const TYPE_INFO = { first: { icon: '🏆', label: '第一次' }, photo: { icon: '📸', label: '照片' }, diary: { icon: '📔', label: '日记' }, letter: { icon: '💌', label: '信件' } };

const BADGES = ['⭐', '📸', '💕', '🏆', '🍳', '✈️', '🌈', '🎆', '🎂', '💍'];

export default function TimeMap({ memories, onAddMemory, onEditMemory, onDeleteMemory }) {
  const { user } = useAuth();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const sorted = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = filter === 'all' ? sorted : sorted.filter(m => m.type === filter);

  // Group by year-month for headers
  const grouped = {};
  filtered.forEach(m => {
    const label = m.date?.slice(0, 7) || '未知';
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(m);
  });
  const groupEntries = Object.entries(grouped);

  const today = new Date();
  const startDate = new Date('2026-02-14');
  const daysTogether = Math.floor((today - startDate) / 86400000);

  return (
    <div>
      {/* Page header */}
      <div className="page-header" style={{ marginTop: 4 }}>
        <h1>🦐 虾米与汉堡的时光轴 🍔</h1>
        <p>我们已经在一起 <strong style={{ color: 'var(--coral)' }}>{daysTogether}</strong> 天啦 ✨</p>
      </div>

      {/* Sticky filter bar */}
      <div className="glass" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, gap: 6, flexWrap: 'wrap',
        position: 'sticky', top: 50, zIndex: 10,
        padding: '8px 12px', borderRadius: 'var(--radius-btn)',
        border: '1px solid rgba(212,196,176,0.3)',
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '全部', e: '📋' },
            { key: 'first', label: '第一次', e: '🏆' },
            { key: 'photo', label: '照片', e: '📸' },
            { key: 'diary', label: '日记', e: '📔' },
            { key: 'letter', label: '信件', e: '💌' },
          ].map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)}
              className={`chip ${filter === t.key ? 'active' : ''}`}
            >{t.e} {t.label}</button>
          ))}
        </div>
        <button className="hand-drawn-btn primary small" onClick={() => setShowAddForm(true)}>➕ 添加</button>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📜</span>
          <p className="empty-title">这里还没有回忆</p>
          <p className="empty-subtitle">点击上方"添加"写下第一个瞬间吧～</p>
          <button className="hand-drawn-btn primary" onClick={() => setShowAddForm(true)}>✨ 创建第一条回忆</button>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* Timeline gradient line */}
          <div style={{
            position: 'absolute', left: 12, top: 8, bottom: 8,
            width: 3, borderRadius: 2,
            background: 'linear-gradient(180deg, var(--shrimp-color), var(--color-gold), var(--burger-color), var(--color-leaf), var(--color-lavender), var(--shrimp-color))',
            opacity: 0.5,
          }} />

          {groupEntries.map(([label, items]) => (
            <div key={label} style={{ marginBottom: 8 }}>
              {/* Month divider */}
              <div style={{
                position: 'relative', paddingLeft: 16, marginBottom: 12, marginTop: 4,
                fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--text-muted)',
              }}>
                <span style={{
                  position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
                  width: 9, height: 9, borderRadius: '50%', background: 'var(--border-color)',
                }} />
                📅 {label}
              </div>

              {items.map((memory, idx) => {
                const creator = USERS[memory.createdBy] || {};
                const isFirst = memory.type === 'first' || memory.isFirst;
                const hasImage = memory.mediaUrl?.startsWith('data:');

                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: idx * 0.03, duration: 0.35 }}
                    onClick={() => setSelectedMemory(memory)}
                    style={{
                      position: 'relative', marginBottom: 16, cursor: 'pointer',
                    }}
                  >
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: -19, top: 18, zIndex: 2,
                      width: 16, height: 16, borderRadius: '50%',
                      background: isFirst ? 'var(--color-gold)' : (creator.color || 'var(--border-color)'),
                      border: '3px solid var(--bg-primary)',
                      boxShadow: isFirst
                        ? '0 0 0 3px var(--color-gold), 0 0 12px rgba(240,199,94,0.35)'
                        : `0 0 0 3px ${creator.color || '#ccc'}20`,
                      animation: isFirst ? 'pulse 2s ease-in-out infinite' : 'none',
                    }} />

                    {/* Card */}
                    <div className={`hand-drawn-card flat${isFirst ? ' golden' : ''}`}
                      style={{
                        padding: 0, overflow: 'hidden',
                        transform: `rotate(${(idx % 3 - 1) * 0.2}deg)`,
                      }}
                    >
                      <div style={{ height: 3, background: creator.color || 'var(--border-color)', opacity: 0.4 }} />
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>📅 {memory.date}</span>
                          <span className="tag" style={{
                            background: (creator.lightColor || creator.color + '15'),
                            border: `1px solid ${creator.color || '#ccc'}30`,
                            color: creator.color || 'var(--text-muted)',
                          }}>
                            {TYPE_INFO[memory.type]?.icon || '📍'} {TYPE_INFO[memory.type]?.label || '记忆'}
                          </span>
                        </div>

                        {hasImage && (
                          <div style={{ marginBottom: 8 }}>
                            <img src={memory.mediaUrl} alt={memory.title}
                              style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }} />
                          </div>
                        )}

                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isFirst ? '1rem' : '0.9rem', margin: '0 0 4px' }}>
                          {isFirst && <span style={{ marginRight: 4 }}>{memory.badge || '⭐'}</span>}
                          {memory.title}
                        </h3>

                        {memory.description && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0,
                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {memory.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{creator.emoji} {creator.name}</span>
                          {memory.moodEmoji && <span style={{ fontSize: '0.85rem' }}>{memory.moodEmoji}</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedMemory && (
          <MemoryPopup memory={selectedMemory} onEdit={onEditMemory} onDelete={onDeleteMemory} onClose={() => setSelectedMemory(null)} />
        )}
        {showAddForm && (
          <AddMemoryModal user={user} onSubmit={(data) => { onAddMemory(data); setShowAddForm(false); }} onClose={() => setShowAddForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddMemoryModal({ user, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('photo');
  const [mood, setMood] = useState('happy-bubble');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [badge, setBadge] = useState('⭐');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const moodStamp = MOOD_STAMPS.find(s => s.id === mood);
    onSubmit({
      type, title: title.trim(), description: description.trim(), date,
      createdBy: user?.username, mood: moodStamp?.id || 'happy-bubble',
      moodEmoji: moodStamp?.emoji || '🫧',
      isFirst: type === 'first', badge: type === 'first' ? badge : undefined,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="modal-backdrop">
      <motion.form initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
        onClick={e => e.stopPropagation()} className="modal-card" onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>➕ 添加回忆</h3>

        <select value={type} onChange={e => setType(e.target.value)} className="input-field">
          <option value="photo">📸 照片记忆</option>
          <option value="diary">📔 日记片段</option>
          <option value="first">🏆 第一次</option>
          <option value="letter">💌 一封信</option>
        </select>

        {type === 'first' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {BADGES.map(b => (
              <button key={b} type="button" onClick={() => setBadge(b)}
                className="chip" style={{ border: badge === b ? '2px solid var(--color-gold)' : undefined, background: badge === b ? 'var(--gradient-golden)' : undefined, fontSize: '1.1rem' }}>
                {b}
              </button>
            ))}
          </div>
        )}

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题 *" className="input-field" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="描述这个瞬间……" className="textarea-field" />

        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>心情印记</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {MOOD_STAMPS.slice(0, 8).map(s => (
              <button key={s.id} type="button" onClick={() => setMood(s.id)}
                className="chip" style={{ border: mood === s.id ? `2px solid ${s.color}` : undefined, background: mood === s.id ? s.color + '15' : undefined }}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="hand-drawn-btn">取消</button>
          <button type="submit" className="hand-drawn-btn primary">💾 保存</button>
        </div>
      </motion.form>
    </motion.div>
  );
}
