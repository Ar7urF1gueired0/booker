'use client';

import { Calendar, MapPin, Filter } from 'lucide-react';

export default function TournamentsPage() {
  const torneios = [
    {
      id: 1,
      nome: 'Rota 101',
      clube: 'Club Guaragua',
      cidade: 'Guaragua - SP',
      categorias: '10 categorias',
      inscricoesAbertas: 3,
      prazo: '5 dias',
      imagem: '🏖️'
    },
    {
      id: 2,
      nome: 'Torneio BeachTenis',
      clube: 'Santos Club',
      cidade: 'Santos - SP',
      categorias: '8 categorias',
      inscricoesAbertas: 2,
      prazo: '2 dias',
      imagem: '🎾'
    },
    {
      id: 3,
      nome: 'Ranking Bola Boa 2024',
      clube: 'Academia Uniclo',
      cidade: 'SJC - SP',
      categorias: 'Pro / A / B',
      inscricoesAbertas: 5,
      prazo: '10 dias',
      imagem: '🏆'
    }
  ];

  return (
    <div>
      {/* Abas Superiores */}
      <div className="flex border-b border-gray-200 mb-6">
         <button className="px-6 py-3 text-gray-500 hover:text-green-600 font-semibold">MEUS TORNEIOS</button>
         <button className="px-6 py-3 text-green-600 border-b-2 border-green-600 font-bold">ENCONTRE TORNEIOS</button>
         <button className="px-6 py-3 text-gray-500 hover:text-green-600 font-semibold">RANKING</button>
      </div>

      {/* Barra de Filtro */}
      <div className="bg-gray-100 p-2 rounded-xl flex items-center justify-between mb-6 pl-4">
         <span className="font-semibold text-gray-600 flex items-center gap-2">
           <Filter size={18} /> Filtros
         </span>
         {/* Você pode adicionar dropdowns aqui futuramente */}
      </div>

      {/* Lista de Cards */}
      <div className="space-y-4">
        {torneios.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition">
            
            {/* Info Principal */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">
                {t.imagem}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{t.nome}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                   <MapPin size={12} /> {t.clube} • {t.cidade}
                </p>
              </div>
            </div>

            {/* Detalhes (Categorias e Prazo) */}
            <div className="flex items-center gap-8 text-sm text-gray-600">
               <div className="flex flex-col items-center">
                  <span className="font-bold text-blue-500 text-lg">🎾</span>
                  <span>{t.categorias}</span>
                  <span className="text-xs text-gray-400">{t.inscricoesAbertas} abertas</span>
               </div>

               <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

               <div className="flex flex-col items-center">
                  <span className="font-bold text-green-500 text-lg flex items-center gap-1">
                    <Calendar size={18} />
                  </span>
                  <span className="font-bold">Prazo Inscrição</span>
                  <span className="text-xs text-gray-400">{t.prazo} restantes</span>
               </div>
            </div>

            {/* Botão de Ação */}
            <button className="w-full md:w-auto px-8 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition shadow-lg shadow-cyan-200">
              Inscreva-se
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}