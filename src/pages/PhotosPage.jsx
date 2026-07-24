import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';

export default function PhotosPage() {
  const navigate = useNavigate();
  const { data } = useData();
  const memories = (data.memories || []).filter(m => m.type === 'photo');
  const firsts = data.firsts || [];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 20 }}>
        📸 我们的相册
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Photos grid */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/firsts')}
          className="hand-drawn-card"
          style={{ padding: 20, textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏆</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>我们的第一次</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {firsts.length} 个里程碑
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/photos/secret')}
          className="hand-drawn-card"
          style={{ padding: 20, textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🌹</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>秘密花园</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            画个爱心开启
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/photos/upload')}
          className="hand-drawn-card"
          style={{ padding: 20, textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📤</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>上传照片</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            加上心情印记
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/mailbox')}
          className="hand-drawn-card"
          style={{ padding: 20, textAlign: 'center', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📬</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>帮我记住</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            迟到的分享
          </div>
        </motion.button>
      </div>

      {/* Recent photos */}
      {memories.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>📷 最近的照片记忆</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {memories.slice(0, 5).map(m => (
              <div key={m.id} className="hand-drawn-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>📸</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.date}</div>
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
