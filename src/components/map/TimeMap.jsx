import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapNode from './MapNode.jsx';
import MemoryPopup from './MemoryPopup.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { MOOD_STAMPS } from '../../utils/constants.js';

export default function TimeMap({ memories, onAddMemory, onEditMemory, onDeleteMemory }) {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newMemoryPos, setNewMemoryPos] = useState(null);

  const MAP_WIDTH = 1200;
  const MAP_HEIGHT = 1800;

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.min(2, Math.max(0.5, s + delta)));
  }, []);

  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.closest('.map-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleMapClick = (e) => {
    if (isDragging || !isAdding) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left - position.x) / scale / MAP_WIDTH) * 100;
    const y = ((e.clientY - rect.top - position.y) / scale / MAP_HEIGHT) * 100;
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setNewMemoryPos({ x: Math.round(x), y: Math.round(y) });
      setIsAdding(false);
    }
  };

  const filteredMemories = filter === 'all'
    ? memories
    : memories.filter(m => m.type === filter);

  const today = new Date();
  const startDate = new Date('2026-02-14');
  const daysTogether = Math.floor((today - startDate) / 86400000);

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{
        textAlign: 'center', marginBottom: 20,
        fontFamily: 'var(--font-display)',
      }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-primary)' }}>
          🦐 虾米与汉堡的奇妙物语 🍔
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>
          我们已经在一起 {daysTogether} 天啦 ✨
        </p>
      </div>

      {/* Map Controls */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12, gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'first', 'photo', 'diary', 'letter'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '4px 12px', borderRadius: 'var(--radius-tag)',
                border: filter === t ? '2px solid var(--shrimp-color)' : '1px solid var(--border-color)',
                background: filter === t ? 'var(--shrimp-light)' : 'var(--bg-card)',
                cursor: 'pointer', fontSize: '0.75rem',
                fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
              }}
            >
              {t === 'all' ? '全部' : t === 'first' ? '🏆 第一次' : t === 'photo' ? '📸 照片' : t === 'diary' ? '📔 日记' : '💌 信件'}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setScale(s => Math.min(2, s + 0.2))}
            className="hand-drawn-btn"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >🔍+</button>
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
            className="hand-drawn-btn"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >🔍-</button>
          <button
            onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
            className="hand-drawn-btn"
            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
          >🏠</button>
        </div>
      </div>

      {/* Map Canvas */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleMapClick}
        style={{
          width: '100%', aspectRatio: '2/3', overflow: 'hidden',
          borderRadius: 'var(--radius-card)',
          border: '2px solid var(--border-color)',
          background: 'linear-gradient(180deg, #E8F4F8 0%, #F5E6D3 30%, #E8D5C0 60%, #D4C4B0 100%)',
          position: 'relative', cursor: isAdding ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {/* Map background elements */}
        <div
          className="map-bg"
          style={{
            width: MAP_WIDTH, height: MAP_HEIGHT,
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            position: 'relative',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {/* Sky */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '25%', background: 'linear-gradient(180deg, #B8D4E3 0%, #E8F4F8 100%)', borderRadius: '20px 20px 0 0' }} />

          {/* Clouds */}
          {[[100, 60], [400, 100], [700, 40], [950, 120]].map(([x, y], i) => (
            <div key={'c'+i} style={{
              position: 'absolute', left: x, top: y,
              fontSize: '3rem', opacity: 0.6,
              animation: `float ${4+i*2}s ease-in-out infinite`,
            }}>☁️</div>
          ))}

          {/* Sun */}
          <div style={{ position: 'absolute', right: 80, top: 80, fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(255,179,71,0.4))' }}>☀️</div>

          {/* Hills */}
          <div style={{ position: 'absolute', top: '22%', left: 0, right: 0, height: '15%' }}>
            <svg viewBox="0 0 1200 200" style={{ width: '100%', height: '100%' }}>
              <ellipse cx="200" cy="200" rx="300" ry="160" fill="#8CB89F" opacity="0.6" />
              <ellipse cx="600" cy="200" rx="350" ry="180" fill="#7BAF8E" opacity="0.5" />
              <ellipse cx="1000" cy="200" rx="280" ry="150" fill="#8CB89F" opacity="0.55" />
            </svg>
          </div>

          {/* River */}
          <svg viewBox="0 0 1200 1800" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <path d="M 600 350 Q 500 600 650 800 Q 800 1000 550 1200 Q 300 1400 500 1650" stroke="#B8D4E3" strokeWidth="40" fill="none" opacity="0.4" strokeLinecap="round" />
            <path d="M 600 350 Q 500 600 650 800 Q 800 1000 550 1200 Q 300 1400 500 1650" stroke="#B8D4E3" strokeWidth="15" fill="none" opacity="0.6" strokeLinecap="round" />
          </svg>

          {/* Trees */}
          {[[150, 500], [850, 550], [300, 900], [900, 800], [180, 1200], [1000, 1100], [400, 1400], [750, 1450]].map(([x, y], i) => (
            <div key={'t'+i} style={{ position: 'absolute', left: x, top: y, fontSize: '2.5rem', opacity: 0.5 }}>🌳</div>
          ))}

          {/* Houses */}
          <div style={{ position: 'absolute', left: 480, top: 420, fontSize: '3rem', opacity: 0.6 }}>🏠</div>

          {/* Memory Nodes */}
          {filteredMemories.map(memory => (
            <MapNode
              key={memory.id}
              memory={memory}
              onClick={() => setSelectedMemory(memory)}
              createdBy={memory.createdBy}
            />
          ))}
        </div>

        {/* Add memory hint */}
        {isAdding && (
          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--bg-card)', padding: '8px 16px',
            borderRadius: '20px', border: '2px solid var(--shrimp-color)',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            zIndex: 10, pointerEvents: 'none',
          }}>
            👆 点击地图放置回忆坐标
          </div>
        )}
      </div>

      {/* Add Memory Button */}
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button
          className={`hand-drawn-btn ${isAdding ? 'primary' : ''}`}
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? '❌ 取消放置' : '📍 添加回忆'}
        </button>
      </div>

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

      {/* New Memory Position Modal */}
      <AnimatePresence>
        {newMemoryPos && (
          <NewMemoryModal
            position={newMemoryPos}
            user={user}
            onSubmit={(data) => {
              onAddMemory({ ...data, position: newMemoryPos });
              setNewMemoryPos(null);
            }}
            onClose={() => setNewMemoryPos(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NewMemoryModal({ position, user, onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('photo');
  const [mood, setMood] = useState('happy-bubble');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      type,
      title,
      description,
      createdBy: user?.username,
      date: new Date().toISOString().split('T')[0],
      mood: MOOD_STAMPS.find(s => s.id === mood)?.label || '',
      moodEmoji: MOOD_STAMPS.find(s => s.id === mood)?.emoji || '',
      isFirst: type === 'first',
      badge: type === 'first' ? '⭐' : undefined,
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
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        className="hand-drawn-card"
        style={{ width: '100%', maxWidth: 400, maxHeight: '90vh', overflow: 'auto' }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
          📍 在这个位置留下回忆
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-tag)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            }}
          >
            <option value="photo">📸 照片记忆</option>
            <option value="diary">📔 日记片段</option>
            <option value="first">🏆 第一次</option>
            <option value="letter">💌 一封信</option>
          </select>
          <input
            placeholder="标题"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-tag)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            }}
          />
          <textarea
            placeholder="写下这段回忆……"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              resize: 'vertical',
            }}
          />
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6 }}>心情印记：</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {MOOD_STAMPS.slice(0, 6).map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setMood(s.id)}
                  style={{
                    padding: '4px 8px', borderRadius: 'var(--radius-tag)',
                    border: mood === s.id ? '2px solid ' + s.color : '1px solid var(--border-color)',
                    background: mood === s.id ? s.color + '20' : 'var(--bg-card)',
                    cursor: 'pointer', fontSize: '0.75rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={onClose} className="hand-drawn-btn">取消</button>
            <button type="submit" className="hand-drawn-btn primary">💾 保存回忆</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
