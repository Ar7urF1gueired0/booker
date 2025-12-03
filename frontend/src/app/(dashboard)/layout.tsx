'use client';

import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Proteção básica de rota: Se não tiver user, manda pro login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* O Header aparece aqui automaticamente para todas as rotas dentro de (dashboard) */}
      <Header />

      {/* pt-20 adiciona o espaçamento para compensar o Header fixed */}
      <main className="mx-auto max-w-7xl px-4 py-8 pt-24">{children}</main>
    </div>
  );
}
