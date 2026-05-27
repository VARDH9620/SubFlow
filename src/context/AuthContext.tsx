import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Toast } from '../types';
import * as db from '../db/database';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<string | null>;
  register: (data: { first_name: string; last_name: string; email: string; phone: string; password: string }) => Promise<string | null>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const initAuth = async () => {
      await db.initializeDatabase();
      const stored =
        localStorage.getItem('subflow_session') ||
        sessionStorage.getItem('subflow_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const fresh = await db.getUserById(parsed.id);
          if (fresh) setUser(fresh);
        } catch { /* ignore */ }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = async (email: string, password: string, rememberMe = false): Promise<string | null> => {
    const result = await db.authenticateUser(email, password);
    if (!result) return 'Invalid email or password';
    setUser(result);
    const sessionData = JSON.stringify({ id: result.id });
    if (rememberMe) {
      localStorage.setItem('subflow_session', sessionData);
    } else {
      sessionStorage.setItem('subflow_session', sessionData);
    }
    addToast(`Welcome back, ${result.first_name}!`, 'success');
    return null;
  };

  const register = async (data: { first_name: string; last_name: string; email: string; phone: string; password: string }): Promise<string | null> => {
    const registered = await db.registerUser(data);
    if (registered) {
      // Auto-login after register
      const result = await db.authenticateUser(data.email, data.password);
      if (result) {
        setUser(result);
        sessionStorage.setItem('subflow_session', JSON.stringify({ id: result.id }));
        addToast('Account created successfully!', 'success');
        return null;
      }
    }
    return 'Email already exists';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('subflow_session');
    sessionStorage.removeItem('subflow_session');
    addToast('Logged out successfully', 'info');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updated = await db.updateUser(user.id, data);
      if (updated) {
        setUser(updated);
        addToast('Profile updated', 'success');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, toasts, addToast, removeToast }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
