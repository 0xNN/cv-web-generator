import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('cvlabs_token');
      const savedUser = localStorage.getItem('cvlabs_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('cvlabs_token');
      localStorage.removeItem('cvlabs_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((token, user) => {
    localStorage.setItem('cvlabs_token', token);
    localStorage.setItem('cvlabs_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cvlabs_token');
    localStorage.removeItem('cvlabs_user');
    setToken(null);
    setUser(null);
  }, []);

  // Signup: POST /api/auth/signup
  const signup = useCallback(async (name, email, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registrasi gagal.');
    login(data.token, data.user);
    return data;
  }, [login]);

  // Login: POST /api/auth/login
  const signin = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal.');
    login(data.token, data.user);
    return data;
  }, [login]);

  const isAuthenticated = !!token && !!user;
  const isPro = user?.subscription_tier === 'pro';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isPro, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;