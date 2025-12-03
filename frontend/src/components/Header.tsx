'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Calendar, User, LogOut } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Lista completa de páginas do sistema
  const navItems = [
    { href: '/dashboard', label: 'Início', icon: Home },
    { href: '/tournaments', label: 'Torneios', icon: Trophy },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-gray-100 bg-white/90 backdrop-blur-md z-50 h-20 flex items-center">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        
        {/* 1. Logo GoToPlay */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-xl shadow-inner transition group-hover:scale-110">
            🎾
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">
            GoToPlay
          </span>
        </Link>

        {/* 2. Navegação Central (Só aparece se tiver user logado ou se quisermos mostrar sempre) */}
        {user && (
          <nav className="hidden gap-2 md:flex bg-gray-100/50 p-1.5 rounded-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-white text-green-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }
                  `}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* 3. Área do Usuário (Direita) */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Info do Usuário (Escondido no mobile para economizar espaço) */}
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  {user.role === 'ADMIN' ? 'Administrador' : 'Atleta'}
                </p>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500 shadow-sm"
              >
                <span className="hidden md:inline">Sair</span>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="font-bold text-gray-500 hover:text-green-600 transition text-sm px-4"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-green-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-200 transition hover:bg-green-600 hover:scale-105"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}