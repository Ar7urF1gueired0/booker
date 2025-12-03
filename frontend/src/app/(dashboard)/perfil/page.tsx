'use client';

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { Mail, ShieldCheck, Hash } from 'lucide-react';

const getInitials = (fullName?: string | null) => {
  if (!fullName) return '?';
  const parts = fullName
    .split(' ')
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export default function ProfilePage() {
  const { user } = useAuth();

  const infoRows = [
    {
      label: 'Nome completo',
      value: user?.fullName ?? 'Não informado',
    },
    {
      label: 'E-mail',
      value: user?.email ?? 'Não informado',
      icon: <Mail size={16} className="text-cyan-500" />,
    },
    {
      label: 'Identificador',
      value: user ? `#${user.id}` : 'Não disponível',
      icon: <Hash size={16} className="text-cyan-500" />,
    },
    {
      label: 'Nível de acesso',
      value: user?.role === 'ADMIN' ? 'Administrador' : 'Atleta',
      icon: <ShieldCheck size={16} className="text-cyan-500" />,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <section className="rounded-3xl bg-white shadow-sm overflow-hidden">
        <div className="h-32 bg-green-200" />

        <div className="px-6 pb-8 -mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="relative w-28 h-28 rounded-3xl border-4 border-white bg-gray-100 shadow-xl overflow-hidden shrink-0">
            {user?.photoUrl ? (
              <Image src={user.photoUrl} alt={user.fullName} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-50">
                <span className="text-3xl font-semibold text-gray-500">
                  {getInitials(user?.fullName)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Perfil</p>
            <h1 className="text-3xl font-bold text-gray-900">{user?.fullName ?? 'Usuário'}</h1>
            <p className="text-sm text-gray-500">{user?.email ?? 'E-mail não informado'}</p>

            <div className="mt-4 inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
              {user?.role === 'ADMIN' ? 'Administrador' : 'Atleta'}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Dados disponíveis
            </p>
            <h2 className="text-xl font-bold text-gray-900">Informações básicas</h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">Fonte: sessão autenticada</span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {infoRows.map(row => (
            <div
              key={row.label}
              className="rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-2">
                {row.icon}
                {row.label}
              </dt>
              <dd className="mt-1 text-base font-semibold text-gray-800">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800">Mais dados em breve</h3>
        <p className="mt-2 text-sm text-gray-500">
          Ainda não coletamos informações adicionais (gênero, idade, habilidades ou conquistas).
          Assim que estiverem disponíveis na API, elas aparecerão aqui automaticamente.
        </p>
      </section>
    </div>
  );
}
