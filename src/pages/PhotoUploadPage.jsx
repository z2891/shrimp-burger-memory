import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { MoodStampPicker } from '../components/common/MoodStamp.jsx';

export default function PhotoUploadPage() {
  const navigate = useNavigate();
  const { addMemory } = useData();
  const { user } = useAuth();
  const fileRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('happy-bubble');
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress and convert to base64
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Resize large images to save localStorage space
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 800, maxH = 800;
        let w = img.width, h = img.height;
        if (w > maxW) { h = h * maxW / w; w = maxW; }
        if (h > maxH) { w = w * maxH / h; h = maxH; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPreview(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !preview) return;
    setUploading(true);

    addMemory({
      type: 'photo',
      title: title.trim() || '未命名照片',
      description: description.trim(),
      position: { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 },
      date: new Date().toISOString().split('T')[0],
      createdBy: user?.username,
      mood: mood,
      moodEmoji: '📸',
      mediaUrl: preview || undefined,
    });
    setTimeout(() => {
      setUploading(false);
      navigate('/photos');
    }, 300);
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
        {/* Photo selector */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          {preview ? (
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <img
                src={preview}
                alt="预览"
                style={{
                  maxWidth: '100%', maxHeight: 300,
                  borderRadius: 'var(--radius-card)',
                  border: '2px solid var(--border-color)',
                }}
              />
              <button
                type="button"
                onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                style={{
                  position: 'absolute', top: 8, right: 8,
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '50%', width: 30, height: 30,
                  cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-card)',
                padding: 40, textAlign: 'center',
                background: 'var(--bg-primary)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>📸</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
                点击选择照片
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                支持 JPG/PNG，自动压缩
              </p>
            </div>
          )}
        </div>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="照片标题"
          style={{
            padding: '10px 12px', borderRadius: 'var(--radius-tag)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-body)', fontSize: '0.9rem',
            background: 'var(--bg-card)',
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
            background: 'var(--bg-card)',
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
          <button
            type="submit"
            className="hand-drawn-btn primary"
            disabled={uploading}
            style={{ opacity: uploading ? 0.6 : 1 }}
          >
            {uploading ? '⏳ 保存中...' : '💾 保存'}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
