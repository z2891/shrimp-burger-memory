import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryPopup from './MemoryPopup.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { USERS } from '../../utils/constants.js';

const TYPE_INFO = { first: { icon: '🏆', label: '第一次' }, photo: { icon: '📸', label: '照片' }, diary: { icon: '📔', label: '日记' }, letter: { icon: '💌', label: '信件' } };

export default function TimeMap({ memories, onAddMemory, onEditMemory, onDeleteMemory, countdowns }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAddMenu, setShowAddMenu] = useState(false);

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
        <div style={{ position: 'relative' }}>
          <button className="hand-drawn-btn primary small" onClick={() => setShowAddMenu(!showAddMenu)}>➕ 记录</button>
          {showAddMenu && (
            <>
              <div onClick={() => setShowAddMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 11 }} />
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-card)',
                  border: '2px solid var(--border-color)', boxShadow: 'var(--shadow-popup)',
                  padding: 12, display: 'flex', flexDirection: 'column', gap: 6,
                  zIndex: 12, minWidth: 180,
                }}>
                {[
                  { path: '/photos/upload', label: '📸 上传照片', desc: '选照片、加心情印记' },
                  { path: '/diary', label: '📔 写日记', desc: '打开编辑器写日记' },
                  { path: '/letters/write', label: '💌 写时光信', desc: '封印给未来的信' },
                  { path: '/firsts', label: '🏆 记录第一次', desc: '添加里程碑' },
                ].map(item => (
                  <motion.button key={item.path} whileTap={{ scale: 0.97 }}
                    onClick={() => { navigate(item.path); setShowAddMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                      borderRadius: '12px', border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)', cursor: 'pointer',
                      textAlign: 'left', fontFamily: 'var(--font-body)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-primary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.label.slice(0, 2)}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>→</span>
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </div>
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
        <WindingTimeline memories={filtered} countdowns={countdowns || []} user={user} onSelect={setSelectedMemory} />
      )}

      <AnimatePresence>
        {selectedMemory && <MemoryPopup memory={selectedMemory} onEdit={onEditMemory} onDelete={onDeleteMemory} onClose={() => setSelectedMemory(null)} />}
      </AnimatePresence>
    </div>
  );
}

/** ===== WINDING S-CURVE TIMELINE ===== */
function WindingTimeline({ memories, countdowns, user, onSelect }) {
  // Interleave memory cards with countdown ornaments
  // Memories carry the timeline, countdowns are smaller cards woven between them
  const cdArr = countdowns || [];
  const totalItems = memories.length + cdArr.length;
  const svgHeight = Math.max(800, totalItems * 170 + 200);

  // Build interleaved list: memory, countdown, memory, countdown...
  const items = [];
  let mi = 0, ci = 0;
  while (mi < memories.length || ci < cdArr.length) {
    if (mi < memories.length) { items.push({ type: 'memory', data: memories[mi], idx: mi }); mi++; }
    if (ci < cdArr.length) { items.push({ type: 'countdown', data: cdArr[ci], idx: ci }); ci++; }
  }

  return (
    <div style={{ position: 'relative', minHeight: svgHeight, maxWidth: 700, margin: '0 auto' }}>
      {/* SVG winding path */}
      <svg
        viewBox={`0 0 400 ${svgHeight}`}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="20%" stopColor="#F0C75E" />
            <stop offset="45%" stopColor="#FFB347" />
            <stop offset="70%" stopColor="#8CB89F" />
            <stop offset="100%" stopColor="#D4C5E8" />
          </linearGradient>
        </defs>
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

      {/* Interleaved cards and countdowns */}
      {items.map((item, pos) => {
        const t = (pos + 1) / (items.length + 1);
        const percentY = (10 + t * 87);
        const isLeft = pos % 2 === 0;

        if (item.type === 'countdown') {
          return <CountdownOrnament key={'cd-' + item.data.id} cd={item.data} isLeft={isLeft} percentY={percentY} pos={pos} />;
        }

        // Memory card
        const memory = item.data;
        const isFirst = memory.type === 'first' || memory.isFirst;
        const creator = USERS[memory.createdBy] || {};
        const hasImage = memory.mediaUrl?.startsWith('data:');

        return (
          <motion.div key={memory.id}
            initial={{ opacity: 0, y: 30, x: isLeft ? -20 : 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: item.idx * 0.03, ease: 'easeOut' }}
            onClick={() => onSelect(memory)}
            style={{
              position: 'absolute', top: percentY + '%',
              left: isLeft ? '2%' : 'auto', right: isLeft ? 'auto' : '2%',
              width: 'clamp(180px, 46%, 320px)', cursor: 'pointer', zIndex: 2,
            }}
          >
            <div style={{
              position: 'absolute', inset: -3, borderRadius: 'var(--radius-card)',
              background: isFirst ? 'rgba(240,199,94,0.2)' : 'rgba(0,0,0,0.06)',
              transform: `translateY(6px) rotate(${isLeft ? -0.5 : 0.5}deg)`, pointerEvents: 'none',
            }} />
            <div className={`hand-drawn-card flat${isFirst ? ' golden' : ''}`}
              style={{
                padding: 0, overflow: 'hidden',
                transform: `rotate(${isLeft ? 1.5 : -1.5}deg) perspective(600px) rotateY(${isLeft ? 2 : -2}deg)`,
                boxShadow: isFirst ? '0 8px 30px rgba(240,199,94,0.2), 0 2px 8px rgba(0,0,0,0.08)' : '0 6px 20px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = `rotate(${isLeft ? 0.5 : -0.5}deg) perspective(600px) rotateY(0deg) translateY(-3px)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${isLeft ? 1.5 : -1.5}deg) perspective(600px) rotateY(${isLeft ? 2 : -2}deg)`; }}
            >
              <div style={{ height: 3, background: creator.color || 'var(--border-color)', opacity: 0.45 }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{memory.date?.slice(5)}</span>
                  <span style={{ fontSize: '0.62rem', color: creator.color, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: creator.color, display: 'inline-block' }} />
                    {{ first: '第一次', photo: '照片', diary: '日记', letter: '信件' }[memory.type] || '记忆'}
                  </span>
                </div>
                {hasImage && <div style={{ marginBottom: 6, borderRadius: 8, overflow: 'hidden' }}><img src={memory.mediaUrl} alt="" style={{ width: '100%', maxHeight: 100, objectFit: 'cover', display: 'block' }} /></div>}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isFirst ? '0.92rem' : '0.82rem', margin: '0 0 2px', lineHeight: 1.3 }}>
                  {isFirst && <span style={{ marginRight: 3, fontSize: '0.85rem' }}>{memory.badge || '⭐'}</span>}{memory.title}
                </h3>
                {memory.description && <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{memory.description}</p>}
                {memory.moodEmoji && <div style={{ marginTop: 6, textAlign: isLeft ? 'left' : 'right' }}><span style={{ fontSize: '0.9rem', opacity: 0.7 }}>{memory.moodEmoji}</span></div>}
              </div>
            </div>
            <div style={{
              position: 'absolute', top: '50%', [isLeft ? 'right' : 'left']: '-10%',
              transform: 'translate(50%, -50%)', width: 12, height: 12, borderRadius: '50%',
              background: isFirst ? 'var(--color-gold)' : (creator.color || 'var(--border-color)'),
              border: '2px solid var(--bg-primary)',
              boxShadow: isFirst ? '0 0 8px rgba(240,199,94,0.5)' : `0 0 4px ${creator.color || '#ccc'}40`,
              zIndex: 3, animation: isFirst ? 'pulse 2.5s ease-in-out infinite' : 'none',
            }} />
          </motion.div>
        );
      })}
    </div>
  );
}

/** Mini countdown ornament hanging on the timeline */
function CountdownOrnament({ cd, isLeft, percentY, pos }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  const diff = new Date(cd.targetDate).getTime() - now;
  const days = diff > 0 ? Math.max(0, Math.floor(diff / 86400000)) : 0;
  const hours = diff > 0 ? Math.floor((diff % 86400000) / 3600000) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: pos * 0.02, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: percentY + '%',
        left: isLeft ? '2%' : 'auto', right: isLeft ? 'auto' : '2%',
        width: 'clamp(160px, 40%, 280px)', zIndex: 2,
        textAlign: 'center',
      }}
    >
      <div className="hand-drawn-card flat" style={{
        padding: '10px 12px',
        background: 'var(--gradient-card)',
        borderColor: diff <= 0 ? 'var(--color-gold)' : (days <= 7 ? 'var(--coral)60' : 'var(--border-color)'),
        boxShadow: diff <= 0 ? 'var(--shadow-gold)' : 'var(--shadow-soft)',
        transform: `rotate(${isLeft ? -0.8 : 0.8}deg)`,
        animation: diff <= 0 ? 'pulse 2s ease-in-out infinite' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: '1.1rem' }}>{cd.icon}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>
            {cd.title.replace(cd.icon + ' ', '')}
          </span>
        </div>
        {diff <= 0 ? (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--color-gold)' }}>🎉 就是今天！</div>
        ) : (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            <div style={{
              background: 'var(--bg-card)', border: '1.5px solid var(--border-color)',
              borderRadius: 8, padding: '4px 8px', minWidth: 36,
              fontSize: '0.95rem', fontFamily: 'var(--font-display)', color: days <= 30 ? 'var(--coral)' : 'var(--text-primary)',
            }}>{String(days).padStart(2, '0')}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>天</span>
            <div style={{
              background: 'var(--bg-card)', border: '1.5px solid var(--border-color)',
              borderRadius: 8, padding: '4px 8px', minWidth: 36,
              fontSize: '0.95rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)',
            }}>{String(hours).padStart(2, '0')}</div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>时</span>
          </div>
        )}
        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: 4 }}>
          {cd.targetDate}
        </div>
      </div>
      {/* Dot connecting to path */}
      <div style={{
        position: 'absolute', top: '50%', [isLeft ? 'right' : 'left']: '-8%',
        transform: 'translate(50%, -50%)', width: 8, height: 8, borderRadius: '50%',
        background: diff <= 0 ? 'var(--color-gold)' : 'var(--border-color)',
        border: '2px solid var(--bg-primary)',
        boxShadow: diff <= 0 ? '0 0 6px rgba(240,199,94,0.5)' : 'none',
        zIndex: 3,
      }} />
    </motion.div>
  );
}

