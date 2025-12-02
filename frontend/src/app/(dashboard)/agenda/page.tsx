'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AgendaPage() {
  const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const diasMes = Array.from({ length: 31 }, (_, i) => i + 1); // 1 a 31 simples

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 min-h-[600px]">
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Calendário de Jogos</h1>
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full">
             <button className="p-1 hover:bg-gray-200 rounded-full"><ChevronLeft size={20}/></button>
             <span className="font-bold text-gray-700">Setembro 2025</span>
             <button className="p-1 hover:bg-gray-200 rounded-full"><ChevronRight size={20}/></button>
          </div>
       </div>

       <div className="flex gap-8">
          {/* Calendário Esquerda */}
          <div className="flex-1">
             <div className="grid grid-cols-7 mb-4">
                {diasSemana.map(d => (
                   <div key={d} className="text-center text-xs font-bold text-gray-400">{d}</div>
                ))}
             </div>
             <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                {/* Offset para começar no dia certo (exemplo) */}
                <div className="col-span-1"></div> 
                
                {diasMes.map(dia => {
                   const isToday = dia === 19;
                   const hasEvent = dia === 19 || dia === 23;
                   return (
                      <div key={dia} className="flex flex-col items-center cursor-pointer group">
                         <div className={`
                            w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition
                            ${isToday ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200' : 'text-gray-700 hover:bg-gray-100'}
                         `}>
                            {dia}
                         </div>
                         {hasEvent && !isToday && (
                            <div className="w-1 h-1 bg-pink-400 rounded-full mt-1"></div>
                         )}
                      </div>
                   )
                })}
             </div>
             
             <button className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-cyan-600 transition">
                Adicionar Evento
             </button>
          </div>

          {/* Lista de Eventos Direita (Detalhes do dia selecionado) */}
          <div className="w-96 border-l border-gray-100 pl-8 space-y-4">
             <div className="text-cyan-500 font-bold mb-4">• 19 de Setembro 2025 •</div>
             
             {[1, 2].map((item) => (
                <div key={item} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                   <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-gray-300" />
                         <span className="font-bold text-gray-700">Amanda Rodrigues</span>
                      </div>
                      <span className="bg-cyan-100 text-cyan-600 text-xs px-2 py-1 rounded-full font-bold">18h00</span>
                   </div>
                   <p className="text-xs text-gray-500 mb-3">Academia Uniclo • Quadra Central</p>
                   <button className="w-full bg-cyan-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-cyan-600">
                      Adicionar Resultado
                   </button>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}