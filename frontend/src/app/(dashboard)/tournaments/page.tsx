'use client';

import { useState } from 'react';
import { Calendar, MapPin, Filter, Trophy, Star, Clock, Plus, ChevronDown, CalendarCheck } from 'lucide-react'; // Adicionei CalendarCheck
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<'MEUS' | 'ENCONTRE'>('MEUS');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();

  // --- MOCK DADOS ---
  const myTournaments = [
    {
      id: 1,
      nome: 'Ranking 2024',
      clube: 'Academia Uniclo',
      cidade: 'São José dos Campos - SP',
      status: 'PENDENTE',
      info: 'Próximo jogo definido', // Mudamos o texto para refletir a automação
      imagem: '🎾',
    },
    {
      id: 2,
      nome: 'Torneio do Vale',
      clube: 'Club Termas',
      cidade: 'São José dos Campos - SP',
      status: 'FINALIZADO',
      posicao: '30º',
      imagem: '🏆',
    },
    {
      id: 3,
      nome: 'Beach Pro',
      clube: 'Areia Sanja',
      cidade: 'São José dos Campos - SP',
      status: 'FINALIZADO',
      posicao: '30º',
      imagem: '🥥',
    }
  ];

  const findTournaments = [
    {
      id: 101,
      nome: 'Rota 101',
      clube: 'Club Guaragua',
      cidade: 'Guaragua - SP',
      categorias: '10 categorias',
      inscricoesAbertas: 3,
      prazo: '5 dias',
      imagem: '🏖️'
    },
    {
      id: 102,
      nome: 'Torneio BeachTenis',
      clube: 'Santos Club',
      cidade: 'Santos - SP',
      categorias: '10 categorias',
      inscricoesAbertas: 3,
      prazo: '5 dias',
      imagem: '🎾'
    },
    {
      id: 103,
      nome: 'Ranking Bola Boa 2024',
      clube: 'Academia Uniclo',
      cidade: 'SJC - SP',
      categorias: '10 categorias',
      inscricoesAbertas: 3,
      prazo: '5 dias',
      imagem: '🏆'
    }
  ];

  // --- HANDLERS ---
  const handleInscricao = (torneioNome: string) => {
    const confirmou = window.confirm(`Deseja confirmar sua inscrição no ${torneioNome}?`);
    if (confirmou) {
      alert("Inscrição realizada! Seus jogos aparecerão automaticamente na Agenda.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DAS ABAS */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
         <button 
            onClick={() => { setActiveTab('MEUS'); setIsFilterOpen(false); }}
            className={`px-6 py-4 font-bold text-sm tracking-wide transition relative whitespace-nowrap ${
               activeTab === 'MEUS' ? 'text-cyan-500' : 'text-gray-400 hover:text-gray-600'
            }`}
         >
            MEUS TORNEIOS
            {activeTab === 'MEUS' && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full" />}
         </button>

         <button 
            onClick={() => { setActiveTab('ENCONTRE'); setIsFilterOpen(false); }}
            className={`px-6 py-4 font-bold text-sm tracking-wide transition relative whitespace-nowrap ${
               activeTab === 'ENCONTRE' ? 'text-cyan-500' : 'text-gray-400 hover:text-gray-600'
            }`}
         >
            ENCONTRE TORNEIOS
            {activeTab === 'ENCONTRE' && <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full" />}
         </button>
      </div>

      {/* --- BARRA DE FILTRO E AÇÕES --- */}
      <div className="flex flex-col gap-4">
        <div className="bg-gray-100 p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 pl-4 md:pl-6 shadow-inner relative">
           
           {/* Botão de Filtro */}
           <button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className={`font-bold text-gray-500 flex items-center justify-center md:justify-start gap-2 text-sm w-full md:w-auto hover:bg-gray-200 p-2 rounded-lg transition ${isFilterOpen ? 'bg-gray-200 text-gray-700' : ''}`}
           >
             <Filter size={18} /> Filtro <ChevronDown size={14} className={`transition ${isFilterOpen ? 'rotate-180' : ''}`}/>
           </button>
           
           {/* Botão Admin */}
           {activeTab === 'MEUS' && user?.role === 'ADMIN' && (
              <button 
                onClick={() => alert("Abrir modal de criação...")}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-md transition flex items-center justify-center gap-2 w-full md:w-auto"
              >
                 <Plus size={16} /> Criar Torneio
              </button>
           )}
        </div>

        {/* Dropdown do Filtro */}
        {isFilterOpen && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-top-2 duration-200">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Categoria</label>
                   <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-cyan-500">
                      <option>Todas</option>
                      <option>Profissional</option>
                      <option>Amador A</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Localização</label>
                   <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-cyan-500">
                      <option>Todas as Cidades</option>
                      <option>São José dos Campos</option>
                   </select>
                </div>
                <div className="flex items-end">
                   <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-900 transition">
                      Aplicar Filtros
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* --- CONTEÚDO DAS ABAS --- */}

      {/* ABA: MEUS TORNEIOS */}
      {activeTab === 'MEUS' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {myTournaments.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-100 transition">
               
               {/* Esquerda */}
               <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-2xl border border-gray-100 shrink-0">
                     {t.imagem}
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-800 text-lg">{t.nome}</h3>
                     <p className="text-xs text-gray-500 flex items-center gap-1">
                        {t.clube} • {t.cidade}
                     </p>
                  </div>
               </div>

               {/* Centro */}
               <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full md:w-auto bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                  {t.status === 'PENDENTE' ? (
                     <div className="flex items-center gap-3">
                        {/* Ícone indicando agendamento automático */}
                        <div className="bg-green-100 p-1.5 rounded-full text-green-600 shrink-0">
                           <CalendarCheck size={16} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                           <p className="text-sm font-semibold text-gray-700">Agendamento Automático</p>
                        </div>
                     </div>
                  ) : (
                     <>
                        <div className="flex items-center gap-2">
                           <Star size={20} className="text-cyan-500 fill-cyan-500 shrink-0" />
                           <div>
                              <p className="text-xs font-bold text-gray-400">Posição</p>
                              <p className="text-sm font-bold text-gray-700">{t.posicao}</p>
                           </div>
                        </div>
                        <div className="w-full h-px md:w-px md:h-8 bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                           <div className="bg-cyan-500 p-1 rounded-full text-white shrink-0">
                              <Trophy size={12} />
                           </div>
                           <div>
                              <p className="text-xs font-bold text-gray-400">Jogos</p>
                              <p className="text-sm font-bold text-gray-700">Finalizados</p>
                           </div>
                        </div>
                     </>
                  )}
               </div>

               {/* Direita: ALTERADO AQUI */}
               <div className="w-full md:w-auto text-right">
                  {t.status === 'PENDENTE' && (
                     <div className="flex flex-col items-end gap-1">
                        {/* Badge informativa ao invés de botão */}
                        <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-600 text-xs font-bold px-3 py-1 rounded-full">
                           <Clock size={12} />
                           Em andamento
                        </span>
                        <p 
                           onClick={() => router.push('/agenda')}
                           className="text-xs text-gray-400 hover:text-cyan-500 cursor-pointer underline decoration-dotted"
                        >
                           Ver na Agenda
                        </p>
                     </div>
                  )}
               </div>

            </div>
          ))}
        </div>
      )}

      {/* ABA: ENCONTRE TORNEIOS (Mantém igual) */}
      {activeTab === 'ENCONTRE' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
           {findTournaments.map((t) => (
             <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-100 transition">
               
               {/* Esquerda */}
               <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center text-3xl shrink-0">
                   {t.imagem}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800 text-lg">{t.nome}</h3>
                   <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin size={12} /> {t.clube} • {t.cidade}
                   </p>
                 </div>
               </div>
   
               {/* Centro */}
               <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-sm text-gray-600 w-full md:w-auto bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                  <div className="flex items-center gap-3">
                     <div className="bg-cyan-100 p-2 rounded-full text-cyan-600 shrink-0">
                        <Trophy size={20} />
                     </div>
                     <div>
                        <p className="font-bold text-gray-800">{t.categorias}</p>
                        <span className="text-xs text-gray-400">{t.inscricoesAbertas} inscrições abertas</span>
                     </div>
                  </div>
                  {/* ... Resto das infos ... */}
               </div>
   
               {/* Direita */}
               <button 
                 onClick={() => handleInscricao(t.nome)}
                 className="w-full md:w-auto px-8 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-full transition shadow-lg shadow-cyan-200"
               >
                 Inscreva-se
               </button>
   
             </div>
           ))}
        </div>
      )}
    </div>
  );
}