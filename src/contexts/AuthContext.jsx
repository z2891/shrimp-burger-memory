import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnniversary, setIsAnniversary] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ add loading state

  // Reset ALL old keys that might have wrong prefixes
  useEffect(() => {
    // Wipe ALL couple_ prefixed keys from old versions
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('couple_couple_') || k === 'couple_initialized') {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Now check session
    const saved = getItem('auth_session');
    if (saved && saved.username) {
      const authData = getItem('auth', { users: {} });
      const userData = authData.users?.[saved.username];
      if (userData) {
        setUser({ username: saved.username, ...userData });
        setIsAuthenticated(true);
      }
    }
    checkAnniversary();
    setLoading(false); // ✅ auth check done
  }, []);

  function checkAnniversary() {
    const today = new Date();
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const specialDates = ['02-14', '03-20', '09-08'];
    if (specialDates.includes(mmdd)) setIsAnniversary(true);
  }

  const login = useCallback((username) => {
    const authData = getItem('auth', { users: {} });
    let userData = authData.users?.[username];

    if (!userData) {
      if (username === 'xia-mi') {
        userData = { name: '虾米', emoji: '🦐', color: '#FF6B6B' };
      } else {
        userData = { name: '汉堡', emoji: '🍔', color: '#FFB347' };
      }
      authData.users = { ...authData.users, [username]: userData };
      setItem('auth', authData);
    }

    const session = { username, loggedInAt: new Date().toISOString() };
    setItem('auth_session', session);
    setUser({ username, ...userData });
    setIsAuthenticated(true);
    checkAnniversary();
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    removeItem('auth_session');
    setUser(null);
    setIsAuthenticated(false);
    setIsAnniversary(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, isAnniversary, loading,
      login, logout, dismissAnniversary: () => setIsAnniversary(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
