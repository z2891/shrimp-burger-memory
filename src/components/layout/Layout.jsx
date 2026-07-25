import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from './NavBar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useData } from '../../contexts/DataContext.jsx';
import ConfettiOverlay from '../common/ConfettiOverlay.jsx';
import ErrorBoundary from '../common/ErrorBoundary.jsx';

export default function Layout() {
  const location = useLocation();
  const { isAnniversary, dismissAnniversary } = useAuth();
  const { loading: dataLoading } = useData();

  return (
    <div style={{
      minHeight: '100dvh', paddingBottom: '80px',
      maxWidth: '960px', margin: '0 auto', width: '100%', position: 'relative',
      paddingLeft: 'max(16px, env(safe-area-inset-left))',
      paddingRight: 'max(16px, env(safe-area-inset-right))',
    }}>
      {/* Top gradient bar */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 960, height: 50, zIndex: 50, pointerEvents: 'none',
        background: 'linear-gradient(180deg, var(--bg-primary) 60%, transparent)',
      }} />

      {isAnniversary && <ConfettiOverlay onDismiss={dismissAnniversary} />}

      <FloatingParticles />

      {dataLoading ? (
        <LoadingScreen />
      ) : (
        <ErrorBoundary key={location.pathname}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '52px 0 0', position: 'relative', zIndex: 1 }}
          >
            <Outlet />
          </motion.div>
        </ErrorBoundary>
      )}

      <NavBar />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '3rem' }}
      >💕</motion.div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--shrimp-color)', opacity: 0.5 }}
          />
        ))}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        正在加载我们的回忆...
      </p>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {['💕', '🫧', '✨', '🌸', '🍀', '💫', '⭐', '🌷'].map((emoji, i) => (
        <motion.div key={i}
          initial={{ y: '120vh', x: (15 + i * 11) + '%', opacity: 0 }}
          animate={{
            y: '-15vh',
            opacity: [0, 0.45, 0.45, 0],
            x: [(15 + i * 11) + '%', (15 + i * 11 + (i % 2 ? 8 : -8)) + '%'],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            delay: i * 2.5,
            ease: 'linear',
          }}
          style={{ position: 'absolute', fontSize: '1rem' }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
