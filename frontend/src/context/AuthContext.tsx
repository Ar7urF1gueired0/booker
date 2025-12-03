'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setApiAuthToken } from '@/lib/api';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  photoUrl?: string;
}

interface AuthSession {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  register: (fullName: string, email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (!savedToken || !savedUser) {
    return null;
  }

  try {
    return {
      token: savedToken,
      user: JSON.parse(savedUser) as User,
    };
  } catch (error) {
    console.error('Failed to parse stored session', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

const persistSession = (session: AuthSession | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return;
  }

  localStorage.setItem('token', session.token);
  localStorage.setItem('user', JSON.stringify(session.user));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  console.log('user', user);

  useEffect(() => {
    const storedSession = readStoredSession();
    if (storedSession) {
      setToken(storedSession.token);
      setUser(storedSession.user);
      setApiAuthToken(storedSession.token);
    } else {
      setApiAuthToken(null);
    }
    setIsLoading(false);
  }, []);

  const applySession = useCallback((session: AuthSession | null) => {
    if (!session) {
      setToken(null);
      setUser(null);
      setApiAuthToken(null);
      persistSession(null);
      return;
    }

    setToken(session.token);
    setUser(session.user);
    setApiAuthToken(session.token);
    persistSession(session);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = (await apiClient.login(email, password)) as AuthSession;
        applySession(result);
        router.push('/dashboard');
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [applySession, router]
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = (await apiClient.register(fullName, email, password)) as AuthSession;
        applySession(result);
        router.push('/dashboard');
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [applySession, router]
  );

  const logout = useCallback(() => {
    applySession(null);
    router.push('/login');
  }, [applySession, router]);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
