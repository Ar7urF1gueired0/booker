'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  photoUrl?: string; // Adicionei opcional para não quebrar se faltar
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carregar dados do localStorage ao montar (F5)
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setIsLoading(false);
  }, []);

  // --- AQUI ESTÁ A MÁGICA DO MOCK ---
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    // 1. Simulamos um delay de 1 segundo (loading)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Criamos o Usuário Falso
    const mockUser: User = {
      id: 1,
      email: email, // O email que você digitou
      fullName: "Joana Alves Pereira",
      role: "USER",
      photoUrl: "https://i.pravatar.cc/150?img=5" // Foto aleatória
    };

    const mockToken = "token-fake-123456";

    // 3. Salvamos no estado e no LocalStorage
    try {
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // 4. Redireciona para o Dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

    // --- CÓDIGO ORIGINAL (Guardado para o futuro) ---
    /*
    try {
      const result = await apiClient.login(email, password);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
    */
  }, [router]);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    // Você pode mockar o registro também se quiser, seguindo a lógica acima!
    setIsLoading(true);
    try {
        // Mock rápido para registro também:
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockUser = { id: 2, email, fullName, role: 'USER' };
        const mockToken = "token-fake-register";
        
        setToken(mockToken);
        setUser(mockUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }, [router]);

  return { user, token, isLoading, login, register, logout };
};