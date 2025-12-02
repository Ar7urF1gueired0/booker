'use client';

import { useAuth } from '@/hooks/useAuth';

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Olá, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Bem-vindo ao seu painel.</p>
        </div>
        <button className="rounded-full bg-green-500 px-6 py-2 font-bold text-white transition hover:bg-green-600 shadow-lg">
          + Novo Torneio
        </button>
      </div>

      {/* Grid de Estatísticas (Exemplo) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Torneios Ativos</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">3</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Próximo Jogo</h3>
          <p className="mt-2 text-xl font-bold text-green-600">Hoje, 19:00</p>
          <p className="text-sm text-gray-500">vs. Dupla Alpha</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Ranking</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">#42</p>
        </div>
      </div>
    </div>
  );
}