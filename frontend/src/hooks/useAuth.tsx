import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, setTokens, clearTokens } from '../api/client';

type Role = 'viewer' | 'judge' | 'admin';

interface User { id: string; username: string; role: Role }

interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isJudge: boolean;          // админ тоже судья
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(u => setUser(u as User))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const { access_token, refresh_token } = await api.login(username, password);
    setTokens(access_token, refresh_token);
    const u = await api.me();
    setUser(u as User);
  };

  const register = async (username: string, password: string) => {
    await api.register(username, password);
    await login(username, password);
  };

  const logout = async () => {
    try { await api.logout(); } catch { /* игнорируем */ }
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: user?.role === 'admin',
      isJudge: user?.role === 'admin' || user?.role === 'judge',
      login, register, logout,
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