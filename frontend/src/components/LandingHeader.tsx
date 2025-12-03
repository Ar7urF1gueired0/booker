'use client';

import Link from 'next/link';

export function LandingHeader() {
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-gray-800 flex items-center gap-1">
          <span className="text-3xl">GoToPlay🎾</span>
        </div>
      </div>

      {/* Navegação Simplificada */}
      <nav className="hidden md:flex items-center gap-8">
        <Link 
          href="/" 
          className="text-gray-800 font-semibold border-b-2 border-green-400 pb-1"
        >
          Acesso
        </Link>
        <Link 
          href="/sobre" 
          className="text-gray-500 font-medium hover:text-green-600 transition"
        >
          Sobre
        </Link>
        {/* Avaliações e Contato foram removidos conforme solicitado */}
      </nav>
    </header>
  );
}