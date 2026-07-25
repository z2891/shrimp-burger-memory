import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnniversary, setIsAnniversary] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    const saved = getItem('couple_auth_session');
    if (saved && saved.username) {
      const users = getItem('couple_auth', { users: {} });
      const userData = users.users?.[saved.username];
      if (userData) {
        setUser({ username: saved.username, ...userData });
        setIsAuthenticated(true);
      }
    }
    // Check anniversary
    checkAnniversary();
  }, []);

  function checkAnniversary() {
    const today = new Date();
    const mmdd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const specialDates = ['02-14', '03-20', '09-08']; // anniversary, shrimp birthday, burger birthday
    if (specialDates.includes(mmdd)) {
      setIsAnniversary(true);
    }
  }

  const login = useCallback((username, password) => {
    const authData = getItem('couple_auth', { users: {} });
    const userData = authData.users?.[username];
    const correctPassword = '20260214';

    if (!userData) {
      return { success: false, error: '没有找到这个小伙伴哦～' };
    }
    // Accept both the stored password and the hardcoded correct one
    if (userData.password !== password && correctPassword !== password) {
      return { success: false, error: '暗号不对哦，再试试～提示：我们的纪念日 💕' };
    }

    // Auto-fix stored password if it was wrong
    if (userData.password !== correctPassword) {
      const fixedUsers = { ...authData.users, [username]: { ...userData, password: correctPassword } };
      setItem('couple_auth', { ...authData, users: fixedUsers });
      userData.password = correctPassword;
    }

    const session = { username, loggedInAt: new Date().toISOString() };
    setItem('couple_auth_session', session);
    setUser({ username, ...userData });
    setIsAuthenticated(true);
    checkAnniversary();
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    removeItem('couple_auth_session');
    setUser(null);
    setIsAuthenticated(false);
    setIsAnniversary(false);
  }, []);

  const value = { user, isAuthenticated, isAnniversary, login, logout, dismissAnniversary: () => setIsAnniversary(false) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
