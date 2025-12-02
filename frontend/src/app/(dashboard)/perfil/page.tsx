'use client';

import { useAuth } from '@/hooks/useAuth';
import { MapPin, Users, Camera, Edit3 } from 'lucide-react'; 
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Principal');

  // Mock de dados (Futuramente virá do Prisma/API)
  const stats = [
    { label: 'Jogos', value: 98 },
    { label: 'Torneios', value: 40 },
    { label: 'Rankings', value: 30 },
  ];

  const info = {
    genero: 'Feminino',
    idade: '30 anos',
    forehand: 'Direita',
    backhand: 'Uma mão',
    nivel: 'Pro'
  };

  return (
    <div className="space-y-6">
      {/* --- CABEÇALHO DO PERFIL --- */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Capa */}
        <div className="h-48 bg-gradient-to-r from-orange-300 to-amber-200 relative">
           <button className="absolute bottom-4 right-4 bg-white/30 backdrop-blur text-white p-2 rounded-full hover:bg-white/50 transition">
             <Camera size={20} />
           </button>
        </div>

        <div className="px-8 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            {/* Foto de Perfil */}
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center overflow-hidden">
               {/* <img src={user?.photoUrl} /> */}
               <span className="text-4xl">👩🏽‍🦱</span>
            </div>

            {/* Nome e Badges */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{user?.fullName}</h1>
                <span className="text-blue-500">✓</span> {/* Ícone de verificado */}
              </div>
              <p className="text-gray-500 flex items-center gap-1 text-sm">
                <MapPin size={14} /> São José dos Campos - SP
              </p>
            </div>

            {/* Bolinhas de Stats (Verdes) */}
            <div className="flex gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center w-16 h-16 bg-green-100 rounded-full border-2 border-green-200">
                  <span className="font-bold text-gray-800 leading-none">{stat.value}</span>
                  <span className="text-[10px] uppercase text-green-700 font-semibold">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="flex gap-8 border-b border-gray-100 pb-1 overflow-x-auto">
            {['Principal', 'Amigos', 'Seguindo', 'Conquistas', 'Fotos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition relative ${
                  activeTab === tab ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- COLUNA DA ESQUERDA (Info) --- */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Informações</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Gênero</span>
                  <span className="font-medium text-gray-700">{info.genero}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Idade</span>
                  <span className="font-medium text-gray-700">{info.idade}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Forehand</span>
                  <span className="font-medium text-gray-700">{info.forehand}</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="text-gray-500">Backhand</span>
                  <span className="font-medium text-gray-700">{info.backhand}</span>
                </li>
              </ul>
              <button className="w-full mt-4 flex items-center justify-center gap-2 text-green-600 border border-green-200 py-2 rounded-lg hover:bg-green-50 transition text-sm font-semibold">
                <Edit3 size={16} /> Editar Perfil
              </button>
           </div>

           {/* Amigos (Mock) */}
           <div className="bg-white p-6 rounded-2xl shadow-sm">
              {/* 2. Adicionei o ícone Users aqui para utilizá-lo */}
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                 <Users size={20} className="text-green-600" /> 
                 Amigos
              </h3>
              <div className="flex gap-2">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                 ))}
              </div>
           </div>
        </div>

        {/* --- COLUNA PRINCIPAL (Feed/Conquistas) --- */}
        <div className="lg:col-span-2 space-y-6">
           {/* Área de Criar Post */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-10">
              <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
                <Camera size={32} />
              </div>
              <h3 className="font-bold text-gray-700">Compartilhe sua jogada!</h3>
              <p className="text-sm text-gray-400 mb-4">Arraste fotos ou clique para selecionar</p>
              <button className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-50">
                Selecionar do Computador
              </button>
           </div>

           {/* Post Exemplo */}
           <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-gray-200 rounded-full" />
                 <div>
                    <h4 className="font-bold text-gray-800 text-sm">Amanda Silva</h4>
                    <p className="text-xs text-gray-400">1 min atrás</p>
                 </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                 [Foto da Raquete na Areia]
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}