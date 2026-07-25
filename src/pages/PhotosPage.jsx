import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';

const CARDS = [
  { path: '/firsts', emoji: '🏆', title: '我们的第一次', subtitle: '里程碑', color: '#F0C75E' },
  { path: '/photos/secret', emoji: '🌹', title: '秘密花园', subtitle: '暗号进入', color: '#E8A598' },
  { path: '/photos/upload', emoji: '📤', title: '上传照片', subtitle: '加心情印记', color: '#8CB89F' },
  { path: '/mailbox', emoji: '📬', title: '帮我记住', subtitle: '迟到的分享', color: '#B8D4E3' },
];

export default function PhotosPage() {
  const navigate = useNavigate();
  const { data } = useData();
  const photoMemories = (data.memories || []).filter(m => m.type === 'photo');

  return (
    <div>
      <div className="page-header"><h1>📸 我们的相册</h1></div>

      {/* 4-card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {CARDS.map((card, i) => (
          <motion.button key={card.path}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -3 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(card.path)}
            className="hand-drawn-card"
            style={{ padding: 22, textAlign: 'center', cursor: 'pointer', borderColor: card.color + '50' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{card.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{card.title}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{card.subtitle}</div>
          </motion.button>
        ))}
      </div>

      {photoMemories.length > 0 && (
        <div>
          <h3 className="section-title">📷 最近的照片记忆</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {photoMemories.slice(0, 5).map(m => (
              <div key={m.id} className="hand-drawn-card flat" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {m.mediaUrl?.startsWith('data:') ? (
                    <img src={m.mediaUrl} alt={m.title} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '2px solid var(--border-color)' }} />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--bg-primary)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📸</div>
                  )}
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>{m.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
