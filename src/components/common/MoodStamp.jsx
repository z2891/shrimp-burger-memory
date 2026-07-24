import { MOOD_STAMPS } from '../../utils/constants.js';

export default function MoodStamp({ moodId, size = 'medium' }) {
  const stamp = MOOD_STAMPS.find(s => s.id === moodId);
  if (!stamp) return null;

  const sizes = { small: '0.7rem', medium: '0.85rem', large: '1.1rem' };
  const fontSize = sizes[size] || sizes.medium;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: stamp.color + '18', color: stamp.color,
      padding: '2px 10px', borderRadius: 'var(--radius-tag)',
      border: '1px solid ' + stamp.color + '40',
      fontSize, fontFamily: 'var(--font-body)',
    }}>
      <span>{stamp.emoji}</span>
      <span>{stamp.label}</span>
    </span>
  );
}

export function MoodStampPicker({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {MOOD_STAMPS.map(stamp => (
        <button
          key={stamp.id}
          onClick={() => onSelect(stamp.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 12px', borderRadius: 'var(--radius-tag)',
            border: selected === stamp.id ? '2px solid ' + stamp.color : '1px solid var(--border-color)',
            background: selected === stamp.id ? stamp.color + '20' : 'var(--bg-card)',
            cursor: 'pointer', fontSize: '0.8rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--text-primary)',
            transition: 'all 0.2s',
          }}
        >
          <span>{stamp.emoji}</span>
          <span>{stamp.label}</span>
        </button>
      ))}
    </div>
  );
}
