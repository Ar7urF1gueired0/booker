'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

type GenderOption = 'MALE' | 'FEMALE' | 'OTHER';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<GenderOption | ''>('');
  const [birthDate, setBirthDate] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (!gender) {
      setError('Selecione um gênero');
      return;
    }

    if (!birthDate) {
      setError('Informe sua data de nascimento');
      return;
    }

    if (!locationCity.trim()) {
      setError('Informe sua cidade');
      return;
    }

    const normalizedGender = gender as GenderOption;
    const normalizedCity = locationCity.trim();

    setIsLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
        gender: normalizedGender,
        birthDate,
        locationCity: normalizedCity,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer cadastro');
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
              {/* Ilustração de jogador */}
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
              <circle cx="140" cy="100" r="35" fill="none" stroke="#F59E0B" strokeWidth="8" />
            </svg>
          </div>

          <h2 className="mt-8 text-2xl font-bold text-gray-800 text-center">🎾 Beach Tennis</h2>
          <p className="mt-2 text-gray-600 text-center">Championship Scheduling System</p>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Já tem uma conta?</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 border-2 border-green-400 text-green-600 rounded-full hover:bg-green-50 transition font-semibold"
            >
              Faça login
            </Link>
          </div>
        </div>

        {/* Lado direito - Formulário */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl border-4 border-green-400 shadow-lg p-8">
            <h1 className="text-4xl font-bold text-green-500 text-center mb-8">Cadastro</h1>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Informe seu e-mail"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Gênero</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as GenderOption | '')}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">Selecione</option>
                    <option value="FEMALE">Feminino</option>
                    <option value="MALE">Masculino</option>
                    <option value="OTHER">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cidade</label>
                <input
                  type="text"
                  placeholder="Informe sua cidade"
                  value={locationCity}
                  onChange={e => setLocationCity(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="Crie uma senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Cadastrando...' : 'Cadastre-se'}
              </button>
            </form>

            {/* Mobile - Link para login */}
            <div className="lg:hidden mt-6 text-center">
              <p className="text-gray-600 mb-3">Já tem uma conta?</p>
              <Link
                href="/login"
                className="inline-block px-6 py-2 border-2 border-green-400 text-green-600 rounded-full hover:bg-green-50 transition font-semibold"
              >
                Faça login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
