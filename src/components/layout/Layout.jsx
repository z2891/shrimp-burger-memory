import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import ConfettiOverlay from '../common/ConfettiOverlay.jsx';

export default function Layout() {
  const location = useLocation();
  const { isAnniversary, dismissAnniversary } = useAuth();

  return (
    <div style={{
      minHeight: '100dvh',
      paddingBottom: '80px',
      paddingTop: '50px',
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
      position: 'relative',
    }}>
      {/* Anniversary celebration */}
      {isAnniversary && (
        <ConfettiOverlay onDismiss={dismissAnniversary} />
      )}

      {/* Floating hearts background */}
      <FloatingHearts />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ padding: '0 16px' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      <NavBar />
    </div>
  );
}

function FloatingHearts() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {['💕', '🫧', '✨', '🌸', '🍀', '💫'].map((emoji, i) => (
        <motion.div
          key={i}
          initial={{ y: '110vh', x: Math.random() * 100 + '%', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.6, 0.6, 0],
            x: ['calc(' + Math.random() * 100 + '%)', 'calc(' + Math.random() * 100 + '%)'],
          }}
          transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear',
          }}
          style={{ position: 'absolute', fontSize: '1.2rem' }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
