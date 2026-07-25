import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryPopup from './MemoryPopup.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { MOOD_STAMPS, USERS } from '../../utils/constants.js';

const TYPE_ICONS = { first: '🏆', photo: '📸', diary: '📔', letter: '💌' };

export default function TimeMap({ memories, onAddMemory, onEditMemory, onDeleteMemory }) {
  const { user } = useAuth();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sort by date, newest at top
  const sorted = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = filter === 'all' ? sorted : sorted.filter(m => m.type === filter);

  // Group by year for section headers
  const grouped = {};
  filtered.forEach(m => {
    const year = m.date?.slice(0, 4) || '未知';
    if (!grouped[year]) grouped[year] = [];
    grouped[year].push(m);
  });

  const today = new Date();
  const startDate = new Date('2026-02-14');
  const daysTogether = Math.floor((today - startDate) / 86400000);

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: '0 0 4px' }}>
          🦐 虾米与汉堡的时光轴 🍔
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          我们已经在一起 {daysTogether} 天啦 ✨
        </p>
      </div>

      {/* Filter + Add */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20, gap: 8, flexWrap: 'wrap',
        position: 'sticky', top: 50, zIndex: 10,
        background: 'var(--bg-primary)', padding: '8px 0',
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: '全部', emoji: '📋' },
            { key: 'first', label: '第一次', emoji: '🏆' },
            { key: 'photo', label: '照片', emoji: '📸' },
            { key: 'diary', label: '日记', emoji: '📔' },
            { key: 'letter', label: '信件', emoji: '💌' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              style={{
                padding: '5px 10px', borderRadius: 'var(--radius-tag)',
                border: filter === t.key ? '2px solid var(--shrimp-color)' : '1px solid var(--border-color)',
                background: filter === t.key ? 'var(--shrimp-light)' : 'var(--bg-card)',
                cursor: 'pointer', fontSize: '0.72rem',
                fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <button className="hand-drawn-btn primary" onClick={() => setShowAddForm(true)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          ➕ 添加
        </button>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 12 }}>📜</div>
          <p style={{ fontFamily: 'var(--font-body)' }}>这里还没有回忆</p>
          <p style={{ fontSize: '0.8rem', marginTop: 4 }}>点击上方"添加"写下第一个瞬间吧～</p>
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 28 }}>
          {/* Winding timeline path */}
          <div style={{
            position: 'absolute', left: 13, top: 8, bottom: 8, width: 3,
            borderRadius: 2,
            background: 'linear-gradient(180deg, var(--shrimp-color), var(--color-gold), var(--burger-color), var(--color-leaf), var(--shrimp-color))',
            opacity: 0.6,
          }} />

          {filtered.map((memory, idx) => {
            const creator = USERS[memory.createdBy] || {};
            const isOwn = memory.createdBy === user?.username;
            const isFirst = memory.type === 'first';
            const hasImage = memory.mediaUrl?.startsWith('data:');

            // Alternating visual treatment
            const isLeft = idx % 2 === 0;

            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 1), duration: 0.4, ease: 'easeOut' }}
                onClick={() => setSelectedMemory(memory)}
                style={{
                  position: 'relative', marginBottom: 20, cursor: 'pointer',
                  paddingLeft: isLeft ? 0 : 14, paddingRight: isLeft ? 14 : 0,
                }}
              >
                {/* Dot on the line */}
                <div style={{
                  position: 'absolute', left: -17, top: 18,
                  width: 15, height: 15, borderRadius: '50%',
                  background: isFirst ? 'var(--color-gold)' : creator.color || 'var(--border-color)',
                  border: '3px solid var(--bg-card)',
                  boxShadow: isFirst
                    ? `0 0 0 3px var(--color-gold), 0 0 12px rgba(240,199,94,0.3)`
                    : `0 0 0 3px ${creator.color}40`,
                  zIndex: 2,
                  animation: isFirst ? 'pulse 2s ease-in-out infinite' : 'none',
                }} />

                {/* Card */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: isFirst ? '20px 6px 20px 6px' : 'var(--radius-card)',
                  border: isFirst ? '2px solid var(--color-gold)' : '1.5px solid var(--border-color)',
                  boxShadow: isFirst ? '0 4px 16px rgba(240,199,94,0.15)' : 'var(--shadow-soft)',
                  overflow: 'hidden',
                  transform: `rotate(${(idx % 3 - 1) * 0.3}deg)`,
                }}>
                  {/* Top strip with type color */}
                  <div style={{
                    height: 3,
                    background: creator.color || 'var(--border-color)',
                    opacity: 0.5,
                  }} />

                  <div style={{ padding: '12px 14px' }}>
                    {/* Date badge */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 6,
                    }}>
                      <span style={{
                        fontSize: '0.7rem', color: 'var(--text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}>
                        📅 {memory.date}
                      </span>
                      <span style={{
                        fontSize: '0.68rem', padding: '1px 8px',
                        borderRadius: 'var(--radius-tag)',
                        background: (creator.lightColor || creator.color + '18'),
                        border: '1px solid ' + (creator.color || '#ccc') + '30',
                        color: creator.color || 'var(--text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}>
                        {{ first: '🏆 第一次', photo: '📸 照片', diary: '📔 日记', letter: '💌 信件' }[memory.type] || '📍 记忆'}
                      </span>
                    </div>

                    {/* Image thumbnail if exists */}
                    {hasImage && (
                      <div style={{ marginBottom: 8 }}>
                        <img
                          src={memory.mediaUrl}
                          alt={memory.title}
                          style={{
                            width: '100%', maxHeight: 160,
                            objectFit: 'cover', borderRadius: 8,
                            border: '1px solid var(--border-color)',
                          }}
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isFirst ? '1.05rem' : '0.95rem',
                      margin: '0 0 4px',
                      color: 'var(--text-primary)',
                    }}>
                      {isFirst && <span style={{ marginRight: 4 }}>{memory.badge || '⭐'}</span>}
                      {memory.title}
                    </h3>

                    {/* Description preview */}
                    {memory.description && (
                      <p style={{
                        fontSize: '0.8rem', color: 'var(--text-secondary)',
                        lineHeight: 1.6, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {memory.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginTop: 8,
                    }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {creator.emoji} {creator.name}
                      </span>
                      {memory.moodEmoji && (
                        <span style={{ fontSize: '0.9rem' }}>{memory.moodEmoji}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Memory Popup */}
      <AnimatePresence>
        {selectedMemory && (
          <MemoryPopup
            memory={selectedMemory}
            onEdit={onEditMemory}
            onDelete={onDeleteMemory}
            onClose={() => setSelectedMemory(null)}
          />
        )}
      </AnimatePresence>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddMemoryModal
            user={user}
            onSubmit={(data) => {
              onAddMemory(data);
              setShowAddForm(false);
            }}
            onClose={() => setShowAddForm(false)}
          />
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

  const BADGES = ['⭐', '📸', '💕', '🏆', '🍳', '✈️', '🌈', '🎆', '🎂', '💍'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const moodStamp = MOOD_STAMPS.find(s => s.id === mood);
    onSubmit({
      type,
      title: title.trim(),
      description: description.trim(),
      date,
      createdBy: user?.username,
      mood: moodStamp?.id || 'happy-bubble',
      moodEmoji: moodStamp?.emoji || '🫧',
      isFirst: type === 'first',
      badge: type === 'first' ? badge : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.form
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="hand-drawn-card"
        onSubmit={handleSubmit}
        style={{ width: '100%', maxWidth: 400, maxHeight: '90vh', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>➕ 添加回忆</h3>

        <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', background: 'var(--bg-card)' }}>
          <option value="photo">📸 照片记忆</option>
          <option value="diary">📔 日记片段</option>
          <option value="first">🏆 第一次</option>
          <option value="letter">💌 一封信</option>
        </select>

        {type === 'first' && (
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>图标</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {BADGES.map(b => (
                <button key={b} type="button" onClick={() => setBadge(b)}
                  style={{ fontSize: '1.1rem', padding: '3px 6px', borderRadius: 6, cursor: 'pointer', border: badge === b ? '2px solid var(--shrimp-color)' : '1px solid var(--border-color)', background: badge === b ? 'var(--shrimp-light)' : 'var(--bg-card)' }}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="标题 *" style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', background: 'var(--bg-card)' }} />

        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius-tag)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', background: 'var(--bg-card)' }} />

        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="描述这个瞬间……" style={{ padding: '12px', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-body)', fontSize: '0.9rem', resize: 'vertical', background: 'var(--bg-card)' }} />

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>心情印记</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {MOOD_STAMPS.slice(0, 8).map(s => (
              <button key={s.id} type="button" onClick={() => setMood(s.id)}
                style={{ padding: '4px 8px', borderRadius: 'var(--radius-tag)', border: mood === s.id ? '2px solid ' + s.color : '1px solid var(--border-color)', background: mood === s.id ? s.color + '20' : 'var(--bg-card)', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-body)' }}>
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
