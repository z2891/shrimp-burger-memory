import { MOOD_STAMPS } from '../../utils/constants.js';

export default function MoodStamp({ moodId, size = 'medium' }) {
  const stamp = MOOD_STAMPS.find(s => s.id === moodId);
  if (!stamp) return null;

  const sizes = { small: '0.68rem', medium: '0.82rem', large: '1rem' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: stamp.color + '12', color: stamp.color,
      padding: '3px 10px', borderRadius: 'var(--radius-tag)',
      border: `1.5px solid ${stamp.color}30`,
      fontSize: sizes[size] || sizes.medium, fontFamily: 'var(--font-body)',
      transform: 'rotate(-0.8deg)',
      WebkitMaskImage: 'radial-gradient(circle at 30% 30%, black 80%, transparent 100%)', // ink-stamp texture
      position: 'relative',
    }}>
      <span style={{ opacity: 0.9 }}>{stamp.emoji}</span>
      <span style={{ opacity: 0.85 }}>{stamp.label}</span>
    </span>
  );
}

export function MoodStampPicker({ selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {MOOD_STAMPS.map(stamp => {
        const isActive = selected === stamp.id;
        return (
          <button key={stamp.id} type="button" onClick={() => onSelect(stamp.id)}
            className="chip"
            style={{
              border: isActive ? `2px solid ${stamp.color}` : undefined,
              background: isActive ? stamp.color + '15' : undefined,
              padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.2s',
            }}
          >
            <span>{stamp.emoji}</span>
            <span>{stamp.label}</span>
            {isActive && (
              <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
                <circle cx="6" cy="6" r="5" fill="none" stroke={stamp.color} strokeWidth="2" />
                <path d="M3.5 6L5 7.5L8.5 4" fill="none" stroke={stamp.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
