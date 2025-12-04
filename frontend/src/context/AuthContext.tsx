'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegisterPayload, UpdateUserPayload, apiClient, setApiAuthToken } from '@/lib/api';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  photoUrl?: string;
  // Optional profile fields (may come from full user fetch)
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthDate?: string | null;
  forehand?: string | null;
  backhand?: string | null;
  level?: string | null;
  locationCity?: string | null;
  coverUrl?: string | null;
  // Display-friendly fields added by the client
  displayGender?: string | null;
  age?: number | null;
  displayForehand?: string | null;
  displayBackhand?: string | null;
}

// Helper to compute age from birth date
const computeAge = (birthDate?: string | null): number | null => {
  if (!birthDate) return null;
  const bd = new Date(birthDate);
  if (Number.isNaN(bd.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - bd.getFullYear();
  const m = today.getMonth() - bd.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) {
    age -= 1;
  }
  return age;
};

// Normalize server user to include display-friendly fields
const normalizeProfileFields = (u: any): User => {
  if (!u) return u;

  const genderMap: Record<string, string> = {
    MALE: 'Masculino',
    FEMALE: 'Feminino',
    OTHER: 'Outro',
  };

  const forehandMap: Record<string, string> = {
    RIGHT: 'Direito',
    LEFT: 'Esquerdo',
  };

  const backhandMap: Record<string, string> = {
    ONE_HAND: 'Uma mão',
    TWO_HANDS: 'Duas mãos',
  };

  const displayGender = u.gender ? genderMap[u.gender] ?? String(u.gender) : null;
  const age = computeAge(u.birthDate ?? u.birthDate?.toString?.());
  const displayForehand = u.forehand ? forehandMap[u.forehand] ?? String(u.forehand) : null;
  const displayBackhand = u.backhand ? backhandMap[u.backhand] ?? String(u.backhand) : null;

  return {
    ...u,
    displayGender,
    age,
    displayForehand,
    displayBackhand,
  } as User;
};

interface AuthSession {
  token: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (_email: string, _password: string) => Promise<AuthSession>;
  register: (_data: RegisterPayload) => Promise<AuthSession>;
  updateProfile: (_data: UpdateUserPayload) => Promise<User>;
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
      setApiAuthToken(storedSession.token);

      // Try to fetch the full user profile to enrich stored session
      (async () => {
        try {
          const resp = await apiClient.getUserById(storedSession.user.id);
          const fullUser = resp?.data ?? resp ?? storedSession.user;
          const normalized = normalizeProfileFields(fullUser);
          setUser(normalized);
          // Persist normalized user as well
          persistSession({ token: storedSession.token, user: normalized });
        } catch (err) {
          // fallback to stored user if fetch fails
          setUser(storedSession.user);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setApiAuthToken(null);
      setIsLoading(false);
    }
  }, []);

  const applySession = useCallback((session: AuthSession | null) => {
    if (!session) {
      setToken(null);
      setUser(null);
      setApiAuthToken(null);
      persistSession(null);
      return;
    }

    // Normalize profile fields for display (age, labels)
    const normalizedUser = normalizeProfileFields(session.user as any);

    setToken(session.token);
    setUser(normalizedUser);
    setApiAuthToken(session.token);
    persistSession({ token: session.token, user: normalizedUser });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const result = (await apiClient.login(email, password)) as AuthSession;

        // Try to fetch full user profile (includes gender, forehand, backhand, etc.)
        let fullUser = result.user;
        try {
          const resp = await apiClient.getUserById(result.user.id);
          fullUser = resp?.data ?? resp;
        } catch (err) {
          console.warn('Failed to fetch full user profile after login', err);
        }

        applySession({ token: result.token, user: fullUser });
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
    async (data: RegisterPayload) => {
      setIsLoading(true);
      try {
        const result = (await apiClient.register(data)) as AuthSession;

        // Fetch the full user profile after registration (server may return minimal user)
        let fullUser = result.user;
        try {
          const resp = await apiClient.getUserById(result.user.id);
          fullUser = resp?.data ?? resp;
        } catch (err) {
          console.warn('Failed to fetch full user profile after register', err);
        }

        applySession({ token: result.token, user: fullUser });
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

  const updateProfile = useCallback(
    async (data: UpdateUserPayload) => {
      if (!user || !token) {
        throw new Error('Sua sessão expirou, faça login novamente.');
      }
      setIsLoading(true);
      try {
        const response = (await apiClient.updateUser(user.id, data)) as { data: User };
        const updatedUser = response?.data;
        if (!updatedUser) {
          throw new Error('Resposta inválida do servidor');
        }
        applySession({
          token,
          user: {
            ...user,
            ...updatedUser,
          },
        });
        return updatedUser;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user, token, applySession]
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
    updateProfile,
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
