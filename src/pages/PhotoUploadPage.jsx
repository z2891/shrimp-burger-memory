import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { MoodStampPicker } from '../components/common/MoodStamp.jsx';

export default function PhotoUploadPage() {
  const navigate = useNavigate();
  const { addMemory } = useData();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('happy-bubble');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMemory({
      type: 'photo',
      title: title.trim(),
      description: description.trim(),
      position: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
      date: new Date().toISOString().split('T')[0],
      createdBy: user?.username,
      mood: mood,
      moodEmoji: '📸',
      mediaUrl: photoUrl || undefined,
    });
    navigate('/photos');
  };

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', textAlign: 'center', marginBottom: 20 }}>
        📤 上传照片
      </h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hand-drawn-card"
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      >
        <div style={{
          border: '2px dashed var(--border-color)',
          borderRadius: 'var(--radius-card)',
          padding: 40, textAlign: 'center',
          background: 'var(--bg-primary)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>📸</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            点击选择照片（演示模式，使用emoji代替）
          </p>
          <input
            value={photoUrl}
            onChange={e => setPhotoUrl(e.target.value)}
            placeholder="或输入图片URL"
            style={{
              marginTop: 12, padding: '8px 12px',
              borderRadius: 'var(--radius-tag)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-body)', fontSize: '0.85rem',
              width: '100%', textAlign: 'center',
            }}
          />
        </div>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="照片标题"
          style={{
            padding: '10px 12px', borderRadius: 'var(--radius-tag)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
          }}
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="描述这个瞬间……"
          style={{
            padding: '12px', borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem', resize: 'vertical',
          }}
        />

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            🎵 心情印记
          </label>
          <MoodStampPicker selected={mood} onSelect={setMood} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => navigate('/photos')} className="hand-drawn-btn">取消</button>
          <button type="submit" className="hand-drawn-btn primary">💾 保存</button>
        </div>
      </motion.form>
    </div>
  );
}
