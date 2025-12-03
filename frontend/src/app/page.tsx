'use client';

import { LandingHeader } from '@/components/LandingHeader';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image'; 
import { enqueueSnackbar } from 'notistack';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      enqueueSnackbar('Usuário e/ou Senha inválidos', { variant: 'error', autoHideDuration: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Cabeçalho "Acesso / Sobre" */}
      <div className="max-w-7xl mx-auto w-full z-10">
        <LandingHeader />
      </div>

      <main className="flex-1 flex items-center justify-center p-4 relative">
        {/* Elementos decorativos de fundo (Bola de tênis gigante e suave) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl -z-0 opacity-50 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-100 rounded-full blur-3xl -z-0 opacity-50 -translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center z-10">
          
          {/* --- LADO ESQUERDO: A Imagem do Tenista --- */}
          <div className="hidden lg:flex flex-col items-center justify-center relative">
             {/* Container da imagem com tamanho controlado */}
             <div className="relative w-full max-w-[500px] h-auto aspect-square">
               <Image 
                 src="/tenista.png"  // <--- Certifique-se que o arquivo está em public/tenista.png
                 alt="Ilustração Tenista"
                 fill
                 className="object-contain drop-shadow-lg"
                 priority
               />
             </div>

             {/* Link de cadastro abaixo da imagem */}
             <div className="mt-8 text-center">
                <p className="text-gray-600 font-bold mb-2">Não tem uma conta?</p>
                <Link 
                  href="/register" 
                  className="inline-block px-8 py-2 border-2 border-green-400 text-green-600 font-bold rounded-full hover:bg-green-50 transition"
                >
                  Cadastre-se
                </Link>
             </div>
          </div>

          {/* --- LADO DIREITO: Card de Acesso (Login) --- */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-green-100 w-full max-w-md mx-auto relative">
            {/* Borda verde lateral estilo "Book" se quiser, ou apenas borda simples */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-cyan-500 rounded-l-3xl"></div>
            
            <h2 className="text-5xl text-center font-thin text-green-500/80 mb-10 tracking-wide font-sans">
              Acesso
            </h2>

            <div className="w-24 h-1 bg-gray-200 mx-auto mb-10 rounded-full"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2">Login</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Informe seu e-mail"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-semibold mb-2">Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Informe sua senha"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/50 transition"
                />
              </div>

              <div className="text-right">
                <Link href="/esqueci-senha" className="text-sm text-cyan-500 font-bold hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full shadow-lg shadow-cyan-200/50 transition transform active:scale-95"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>

          {/* Mobile: Link de cadastro (caso a imagem suma em telas pequenas) */}
          <div className="lg:hidden text-center mt-4">
             <p className="text-gray-500 mb-2">Ainda não tem conta?</p>
             <Link href="/register" className="text-green-600 font-bold hover:underline">
               Cadastre-se aqui
             </Link>
          </div>

        </div>
      </main>
    </div>
  );
}