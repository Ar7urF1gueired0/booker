'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          🎾 Beach Tennis
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Championship Scheduling System
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Organize seus torneios de tênis de praia de forma fácil e rápida
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-cyan-400 hover:bg-cyan-500 text-white font-bold rounded-full transition text-lg"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 border-2 border-green-400 text-green-600 hover:bg-green-50 font-bold rounded-full transition text-lg"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </main>
  );
}
