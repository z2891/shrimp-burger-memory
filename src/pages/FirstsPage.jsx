import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';

export default function FirstsPage() {
  const { data } = useData();
  const firsts = data.firsts || [];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 20 }}>
        🏆 我们的第一次
      </h1>
      <div style={{ position: 'relative', paddingLeft: 30 }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 15, top: 0, bottom: 0,
          width: 3, background: 'var(--border-color)', borderRadius: 2,
        }} />

        {firsts.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="hand-drawn-card"
            style={{
              marginBottom: 16, padding: 16,
              position: 'relative',
              borderLeft: item.unlocked ? '3px solid var(--color-gold)' : '3px solid var(--border-color)',
            }}
          >
            {/* Timeline dot */}
            <div style={{
              position: 'absolute', left: -35, top: 20,
              width: 14, height: 14, borderRadius: '50%',
              background: item.unlocked ? 'var(--color-gold)' : 'var(--border-color)',
              border: '2px solid var(--bg-card)',
              boxShadow: '0 0 0 3px ' + (item.unlocked ? 'var(--color-gold)' : 'var(--border-color)'),
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: '1.8rem' }}>{item.badge}</span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>
                  {item.title}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.date}
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 0' }}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
