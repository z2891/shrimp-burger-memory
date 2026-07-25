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
        marginBottom: 24, gap: 6, flexWrap: 'wrap',
        position: 'sticky', top: 50, zIndex: 10,
        padding: '8px 12px', borderRadius: 'var(--radius-btn)',
        border: '1px solid rgba(212,196,176,0.3)',
      }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[{ key: 'all', label: '全部', e: '📋' }, { key: 'first', label: '第一次', e: '🏆' },
            { key: 'photo', label: '照片', e: '📸' }, { key: 'diary', label: '日记', e: '📔' }, { key: 'letter', label: '信件', e: '💌' },
          ].map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} className={`chip ${filter === t.key ? 'active' : ''}`}>
              {t.e} {t.label}
            </button>
          ))}
        </div>
        <button className="hand-drawn-btn primary small" onClick={() => setShowAddForm(true)}>➕ 添加</button>
      </div>

      {/* ===== WINDING TIMELINE ===== */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📜</span>
          <p className="empty-title">这里还没有回忆</p>
          <p className="empty-subtitle">点击上方"添加"写下第一个瞬间吧～</p>
          <button className="hand-drawn-btn primary" onClick={() => setShowAddForm(true)}>✨ 创建第一条回忆</button>
        </div>
      ) : (
        <WindingTimeline memories={filtered} user={user} onSelect={setSelectedMemory} />
      )}

      <AnimatePresence>
        {selectedMemory && <MemoryPopup memory={selectedMemory} onEdit={onEditMemory} onDelete={onDeleteMemory} onClose={() => setSelectedMemory(null)} />}
        {showAddForm && <AddMemoryModal user={user} onSubmit={(d) => { onAddMemory(d); setShowAddForm(false); }} onClose={() => setShowAddForm(false)} />}
      </AnimatePresence>
    </div>
  );
}

/** ===== WINDING S-CURVE TIMELINE ===== */
function WindingTimeline({ memories, user, onSelect }) {
  // We use an SVG path that winds down the page. Cards alternate left/right.
  // SVG viewBox height scales with number of items.
  const svgHeight = Math.max(800, memories.length * 200 + 100);

  return (
    <div style={{ position: 'relative', minHeight: svgHeight }}>
      {/* SVG winding path */}
      <svg
        viewBox={`0 0 400 ${svgHeight}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--shrimp-color)" />
            <stop offset="25%" stopColor="var(--color-gold)" />
            <stop offset="50%" stopColor="var(--burger-color)" />
            <stop offset="75%" stopColor="var(--color-leaf)" />
            <stop offset="100%" stopColor="var(--color-lavender)" />
          </linearGradient>
          {/* Correct the gradient for SVG by using direct colors */}
          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="20%" stopColor="#F0C75E" />
            <stop offset="45%" stopColor="#FFB347" />
            <stop offset="70%" stopColor="#8CB89F" />
            <stop offset="100%" stopColor="#D4C5E8" />
          </linearGradient>
        </defs>

        {/* Main winding path — S-curve */}
        <path
          d={`M 200 20 C 80 ${svgHeight * 0.08}, 320 ${svgHeight * 0.15}, 200 ${svgHeight * 0.22}
              C 80 ${svgHeight * 0.29}, 320 ${svgHeight * 0.36}, 200 ${svgHeight * 0.43}
              C 80 ${svgHeight * 0.50}, 320 ${svgHeight * 0.57}, 200 ${svgHeight * 0.64}
              C 80 ${svgHeight * 0.71}, 320 ${svgHeight * 0.78}, 200 ${svgHeight * 0.85}
              C 150 ${svgHeight * 0.88}, 130 ${svgHeight * 0.92}, 200 ${svgHeight * 0.97}`}
          fill="none" stroke="url(#curveGrad)" strokeWidth="5" strokeLinecap="round"
          opacity="0.35"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
        />
        {/* Thinner inner line */}
        <path
          d={`M 200 20 C 80 ${svgHeight * 0.08}, 320 ${svgHeight * 0.15}, 200 ${svgHeight * 0.22}
              C 80 ${svgHeight * 0.29}, 320 ${svgHeight * 0.36}, 200 ${svgHeight * 0.43}
              C 80 ${svgHeight * 0.50}, 320 ${svgHeight * 0.57}, 200 ${svgHeight * 0.64}
              C 80 ${svgHeight * 0.71}, 320 ${svgHeight * 0.78}, 200 ${svgHeight * 0.85}
              C 150 ${svgHeight * 0.88}, 130 ${svgHeight * 0.92}, 200 ${svgHeight * 0.97}`}
          fill="none" stroke="url(#curveGrad)" strokeWidth="1.5" strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {/* Cards */}
      {memories.map((memory, idx) => {
        const isLeft = idx % 2 === 0;
        // Calculate position along the SVG path (0..1)
        const t = (idx + 1) / (memories.length + 1);
        const percentY = (15 + t * 82); // 15% to 97% of container
        const isFirst = memory.type === 'first' || memory.isFirst;
        const creator = USERS[memory.createdBy] || {};
        const hasImage = memory.mediaUrl?.startsWith('data:');

        return (
          <motion.div key={memory.id}
            initial={{ opacity: 0, y: 30, x: isLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: idx * 0.04, ease: 'easeOut' }}
            onClick={() => onSelect(memory)}
            style={{
              position: 'absolute',
              top: percentY + '%',
              left: isLeft ? '2%' : 'auto',
              right: isLeft ? 'auto' : '2%',
              width: '46%',
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            {/* Connecting line from card to path */}
            <div style={{
              position: 'absolute',
              top: '50%',
              [isLeft ? 'right' : 'left']: '-12%',
              width: '12%',
              height: 2,
              background: creator.color || 'var(--border-color)',
              opacity: 0.5,
            }}>
              {/* Small dot at path end */}
            </div>

            {/* Shadow layer for 3D depth */}
            <div style={{
              position: 'absolute', inset: -3,
              borderRadius: 'var(--radius-card)',
              background: isFirst ? 'rgba(240,199,94,0.2)' : 'rgba(0,0,0,0.06)',
              transform: `translateY(6px) rotate(${isLeft ? -0.5 : 0.5}deg)`,
              pointerEvents: 'none',
            }} />

            {/* Card */}
            <div className={`hand-drawn-card flat${isFirst ? ' golden' : ''}`}
              style={{
                padding: 0, overflow: 'hidden',
                transform: `rotate(${isLeft ? 1.5 : -1.5}deg) perspective(600px) rotateY(${isLeft ? 2 : -2}deg)`,
                boxShadow: isFirst
                  ? '0 8px 30px rgba(240,199,94,0.2), 0 2px 8px rgba(0,0,0,0.08)'
                  : '0 6px 20px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)',
                borderColor: isFirst ? 'var(--color-gold)' : 'var(--border-color)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = `rotate(${isLeft ? 0.5 : -0.5}deg) perspective(600px) rotateY(0deg) translateY(-3px)`; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${isLeft ? 1.5 : -1.5}deg) perspective(600px) rotateY(${isLeft ? 2 : -2}deg)`; e.currentTarget.style.boxShadow = isFirst ? '0 8px 30px rgba(240,199,94,0.2), 0 2px 8px rgba(0,0,0,0.08)' : '0 6px 20px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)'; }}
            >
              {/* Color strip */}
              <div style={{ height: 3, background: creator.color || 'var(--border-color)', opacity: 0.45 }} />

              <div style={{ padding: '10px 12px' }}>
                {/* Meta row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {memory.date?.slice(5)}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: creator.color || 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: creator.color, display: 'inline-block' }} />
                    {{ first: '第一次', photo: '照片', diary: '日记', letter: '信件' }[memory.type] || '记忆'}
                  </span>
                </div>

                {/* Thumbnail */}
                {hasImage && (
                  <div style={{ marginBottom: 6, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={memory.mediaUrl} alt="" style={{ width: '100%', maxHeight: 100, objectFit: 'cover', display: 'block' }} />
                  </div>
                )}

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: isFirst ? '0.92rem' : '0.82rem',
                  margin: '0 0 2px', lineHeight: 1.3,
                }}>
                  {isFirst && <span style={{ marginRight: 3, fontSize: '0.85rem' }}>{memory.badge || '⭐'}</span>}
                  {memory.title}
                </h3>

                {/* Description */}
                {memory.description && (
                  <p style={{
                    fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {memory.description}
                  </p>
                )}

                {/* Emotion emoji tag */}
                {memory.moodEmoji && (
                  <div style={{ marginTop: 6, textAlign: isLeft ? 'left' : 'right' }}>
                    <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{memory.moodEmoji}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dot on the path */}
            <div style={{
              position: 'absolute', top: '50%',
              [isLeft ? 'right' : 'left']: '-14%',
              transform: 'translate(50%, -50%)',
              width: 12, height: 12, borderRadius: '50%',
              background: isFirst ? 'var(--color-gold)' : (creator.color || 'var(--border-color)'),
              border: '2px solid var(--bg-primary)',
              boxShadow: isFirst ? '0 0 8px rgba(240,199,94,0.5)' : `0 0 4px ${creator.color || '#ccc'}40`,
              zIndex: 3,
              animation: isFirst ? 'pulse 2.5s ease-in-out infinite' : 'none',
            }} />
          </motion.div>
        );
      })}
    </div>
  );
}

/** ===== ADD MEMORY MODAL ===== */
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
    const s = MOOD_STAMPS.find(x => x.id === mood);
    onSubmit({
      type, title: title.trim(), description: description.trim(), date,
      createdBy: user?.username, mood: s?.id || 'happy-bubble',
      moodEmoji: s?.emoji || '🫧',
      isFirst: type === 'first', badge: type === 'first' ? badge : undefined,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="modal-backdrop">
      <motion.form initial={{ scale: 0.95, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 30 }}
        onClick={e => e.stopPropagation()} className="modal-card" onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>➕ 添加回忆</h3>
        <select value={type} onChange={e => setType(e.target.value)} className="input-field">
          <option value="photo">📸 照片记忆</option><option value="diary">📔 日记片段</option>
          <option value="first">🏆 第一次</option><option value="letter">💌 一封信</option>
        </select>
        {type === 'first' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {BADGES.map(b => (
              <button key={b} type="button" onClick={() => setBadge(b)} className="chip"
                style={{ borderColor: badge === b ? 'var(--color-gold)' : undefined, background: badge === b ? 'var(--gradient-golden)' : undefined, fontSize: '1.1rem' }}>{b}</button>
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
              <button key={s.id} type="button" onClick={() => setMood(s.id)} className="chip"
                style={{ borderColor: mood === s.id ? s.color : undefined, background: mood === s.id ? s.color + '15' : undefined }}>{s.emoji} {s.label}</button>
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
