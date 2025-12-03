'use client';

import { useAuth } from '@/hooks/useAuth';
import { MapPin, Users, Camera, Edit3, Award, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();

  // Estados de Controle
  const [activeTab, setActiveTab] = useState('Principal');
  const [isEditing, setIsEditing] = useState(false);

  // --- MOCK DE DADOS ---
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
    nivel: 'Pro',
  };

  const friendsList = [
    { id: 1, name: 'Fernando Paiva', img: 'https://i.pravatar.cc/150?u=fernando' },
    { id: 2, name: 'Julia Oliveira', img: 'https://i.pravatar.cc/150?u=julia' },
    { id: 3, name: 'Carla Rodrigues', img: 'https://i.pravatar.cc/150?u=carla' },
    { id: 4, name: 'Amanda Silva', img: 'https://i.pravatar.cc/150?u=amanda' },
    { id: 5, name: 'Marcos Santos', img: 'https://i.pravatar.cc/150?u=marcos' },
    { id: 6, name: 'Ana Beatriz', img: 'https://i.pravatar.cc/150?u=ana' },
  ];

  const achievements = [
    { id: 1, title: 'Campeão Paulista', date: '03/02/2019', type: 'Mista', rank: '1º Lugar' },
    { id: 2, title: 'Ranking do Vale', date: '10/07/2019', type: 'Individual', rank: 'Campeã' },
    { id: 3, title: 'Guaragua Beach', date: '23/05/2020', type: 'Dupla', rank: '2º Lugar' },
  ];

  return (
    <div className="space-y-6 pb-12 relative">
      {/* --- CABEÇALHO DO PERFIL --- */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Capa */}
        <div className="h-48 bg-gradient-to-r from-orange-300 to-amber-200 relative">
          <button className="absolute bottom-4 right-4 bg-white/30 backdrop-blur text-white p-2 rounded-full hover:bg-white/50 transition">
            <Camera size={20} />
          </button>
        </div>

        <div className="px-8 pb-0">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
            {/* Foto de Perfil (Corrigida) */}
            <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              {user?.photoUrl ? (
                <Image src={user.photoUrl} alt="Perfil" fill className="object-cover" />
              ) : (
                <span className="text-5xl select-none pt-2">👩🏽‍🦱</span>
              )}
            </div>

            {/* Nome e Badges */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{user?.fullName || 'Usuário'}</h1>
                <span className="text-blue-500">✓</span>
              </div>
              <p className="text-gray-500 flex items-center gap-1 text-sm">
                <MapPin size={14} /> São José dos Campos - SP
              </p>
            </div>

            {/* Bolinhas de Stats */}
            <div className="flex gap-3">
              {stats.map(stat => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center w-16 h-16 bg-green-100 rounded-full border-2 border-green-200"
                >
                  <span className="font-bold text-gray-800 leading-none">{stat.value}</span>
                  <span className="text-[10px] uppercase text-green-700 font-semibold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Abas de Navegação */}
          <div className="flex gap-8 border-b border-gray-100 pb-1">
            {['Principal', 'Amigos', 'Conquistas'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold transition relative px-2 ${
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

      {/* --- CONTEÚDO DINÂMICO DAS ABAS --- */}

      {/* 1. ABA PRINCIPAL */}
      {activeTab === 'Principal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Coluna Esquerda (Info) */}
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
              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 text-green-600 border border-green-200 py-2 rounded-lg hover:bg-green-50 transition text-sm font-semibold"
              >
                <Edit3 size={16} /> Editar Perfil
              </button>
            </div>

            {/* Preview de Amigos */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
                <Users size={20} className="text-green-600" />
                Amigos
              </h3>
              <div className="flex gap-2">
                {friendsList.slice(0, 4).map(friend => (
                  <div
                    key={friend.id}
                    className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-100"
                  >
                    <Image src={friend.img} alt={friend.name} fill className="object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                  +2
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita (Criar Post) */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Exemplo de Post Recente */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src="https://i.pravatar.cc/150?u=amanda"
                    alt="Amanda"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Amanda Silva</h4>
                  <p className="text-xs text-gray-400">1 min atrás</p>
                </div>
              </div>
              <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                <span className="text-sm">📸 Foto do Jogo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ABA AMIGOS */}
      {activeTab === 'Amigos' && (
        <div className="bg-white p-6 rounded-3xl shadow-sm animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Todos os Amigos{' '}
            <span className="text-sm font-normal text-gray-400">({friendsList.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friendsList.map(friend => (
              <div
                key={friend.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition bg-gray-50/50"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image src={friend.img} alt={friend.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{friend.name}</p>
                  <button className="text-xs text-green-600 font-semibold hover:underline">
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ABA CONQUISTAS */}
      {activeTab === 'Conquistas' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm">
              Todos
            </button>
            <button className="bg-white text-gray-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50">
              Pro
            </button>
            <button className="bg-white text-gray-600 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50">
              Amador
            </button>
          </div>

          {achievements.map(item => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shrink-0">
                  <Award size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">
                    {item.rank} • {item.type} • {item.date}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                  {item.rank}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL DE EDIÇÃO --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Editar Perfil</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  defaultValue={user?.fullName}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Gênero</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Feminino</option>
                    <option>Masculino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Nível</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Pro</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Forehand</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="flex-1 py-2 bg-green-100 text-green-700 font-bold rounded-lg border border-green-200 text-sm"
                    >
                      Direita
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-2 bg-gray-50 text-gray-500 font-medium rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                    >
                      Esq.
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Backhand</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Uma mão</option>
                    <option>Duas mãos</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-full transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Dados salvos com sucesso! (Simulação)');
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 shadow-lg shadow-green-200 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
