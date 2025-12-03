'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { enqueueSnackbar } from 'notistack';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.log(err.message);
      enqueueSnackbar(err.message, { variant: 'error', autoHideDuration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Lado esquerdo - Ilustração */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md">
            <svg
              className="w-full h-auto"
              viewBox="0 0 400 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ilustração simples de jogador de tênis */}
              <circle cx="200" cy="100" r="40" fill="#E8A87C" />
              <path
                d="M 200 140 L 200 220"
                stroke="#F97316"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 200 160 L 140 120"
                stroke="#FCA5A5"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 200 160 L 260 120"
                stroke="#FCA5A5"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 200 220 L 160 300"
                stroke="#10B981"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 200 220 L 240 300"
                stroke="#10B981"
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Raquete */}
              <circle cx="140" cy="100" r="35" fill="none" stroke="#F59E0B" strokeWidth="8" />
              <path d="M 140 100 L 120 80" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="mt-8 text-2xl font-bold text-gray-800 text-center">🎾 Beach Tennis</h2>
          <p className="mt-2 text-gray-600 text-center">Championship Scheduling System</p>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Não tem uma conta?</p>
            <Link
              href="/register"
              className="inline-block px-6 py-2 border-2 border-green-400 text-green-600 rounded-full hover:bg-green-50 transition font-semibold"
            >
              Cadastre-se
            </Link>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl border-4 border-green-400 shadow-lg p-8">
            <h1 className="text-4xl font-bold text-green-500 text-center mb-8">Acesso</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Login</label>
                <input
                  type="email"
                  placeholder="Informe seu e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="Informe sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="text-center">
                <a href="#" className="text-cyan-500 hover:text-cyan-600 text-sm font-semibold">
                  Esqueceu sua senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Mobile - Link para cadastro */}
            <div className="lg:hidden mt-6 text-center">
              <p className="text-gray-600 mb-3">Não tem uma conta?</p>
              <Link
                href="/register"
                className="inline-block px-6 py-2 border-2 border-green-400 text-green-600 rounded-full hover:bg-green-50 transition font-semibold"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
