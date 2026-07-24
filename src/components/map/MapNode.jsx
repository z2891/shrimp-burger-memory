import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext.jsx';

const TYPE_ICONS = {
  first: '🏆',
  photo: '📸',
  diary: '📔',
  letter: '💌',
};

export default function MapNode({ memory, onClick, createdBy }) {
  const { user } = useAuth();
  const isOwn = createdBy === user?.username;
  const icon = memory.badge || TYPE_ICONS[memory.type] || '📍';

  return (
    <motion.div
      initial={{ scale: 0, y: -30 }}
      animate={{ scale: 1, y: 0 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: memory.position.x + '%',
        top: memory.position.y + '%',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      {/* Pin body */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))',
      }}>
        {/* Memory icon */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: isOwn ? 'var(--shrimp-light)' : 'var(--burger-light)',
          border: '2px solid ' + (isOwn ? 'var(--shrimp-color)' : 'var(--burger-color)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem',
          animation: memory.isFirst ? 'pulse 2s ease-in-out infinite' : 'none',
        }}>
          {icon}
        </div>
        {/* Pin point */}
        <div style={{
          width: 0, height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid ' + (isOwn ? 'var(--shrimp-color)' : 'var(--burger-color)'),
          marginTop: -2,
        }} />

        {/* Title label */}
        {memory.isFirst && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-tag)',
            padding: '2px 8px',
            fontSize: '0.65rem',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-body)',
            color: 'var(--text-primary)',
            marginTop: 2,
          }}>
            {memory.title}
          </div>
        )}
      </div>

      {/* Pulse ring for "first" memories */}
      {memory.isFirst && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 50, height: 50, borderRadius: '50%',
          border: '2px solid var(--color-gold)',
          animation: 'pulse-ring 2s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}
    </motion.div>
  );
}
