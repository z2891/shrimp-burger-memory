import { motion } from 'framer-motion';
import MoodStamp from '../common/MoodStamp.jsx';
import { USERS, MOOD_STAMPS } from '../../utils/constants.js';

function getMoodId(memory) {
  // Try by exact id match first
  if (MOOD_STAMPS.find(s => s.id === memory.mood)) return memory.mood;
  // Try by label match
  const byLabel = MOOD_STAMPS.find(s => s.label === memory.mood);
  if (byLabel) return byLabel.id;
  // Fallback
  return 'happy-bubble';
}

export default function MemoryPopup({ memory, onClose }) {
  const creator = USERS[memory.createdBy] || { name: '神秘人', emoji: '❓', color: '#ccc' };
  const hasImage = memory.mediaUrl && memory.mediaUrl.startsWith('data:');

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
        exit={{ scale: 0.8, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="hand-drawn-card"
        style={{ width: '100%', maxWidth: 380, maxHeight: '80vh', overflow: 'auto' }}
      >
        {/* Badge for firsts */}
        {memory.isFirst && (
          <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 8 }}>
            {memory.badge || '⭐'}
          </div>
        )}

        {/* Photo image */}
        {hasImage && (
          <div style={{ marginBottom: 12, textAlign: 'center' }}>
            <img
              src={memory.mediaUrl}
              alt={memory.title}
              style={{
                maxWidth: '100%', maxHeight: 200,
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
              }}
            />
          </div>
        )}

        {/* Type tag */}
        <div style={{ marginBottom: 12 }}>
          <span style={{
            background: (creator.lightColor || creator.color + '22'),
            color: creator.color,
            padding: '2px 12px', borderRadius: 'var(--radius-tag)',
            fontSize: '0.8rem', fontFamily: 'var(--font-body)',
            border: '1px solid ' + creator.color + '40',
          }}>
            {memory.type === 'first' ? '🏆 第一次' : memory.type === 'photo' ? '📸 照片' : memory.type === 'diary' ? '📔 日记' : '💌 信件'}
          </span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>
          {memory.title}
        </h3>

        {memory.description && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '0.95rem',
            color: 'var(--text-secondary)', lineHeight: 1.8,
            marginBottom: 16, whiteSpace: 'pre-wrap',
          }}>
            {memory.description}
          </p>
        )}

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.2rem' }}>{creator.emoji}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {creator.name} · {memory.date}
            </span>
          </div>
          {memory.mood && <MoodStamp moodId={getMoodId(memory)} size="small" />}
        </div>
      </motion.div>
    </motion.div>
  );
}
