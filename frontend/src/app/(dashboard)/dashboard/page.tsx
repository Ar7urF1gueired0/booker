'use client';

import { useAuth } from '@/hooks/useAuth';
import { Image as ImageIcon, MapPin, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();

  // --- MOCKS DE DADOS ---
  const posts = [
    {
      id: 1,
      author: "Amanda Silva",
      time: "1 min",
      avatar: "https://i.pravatar.cc/150?u=amanda",
      image: "https://images.unsplash.com/photo-1622163642998-1ea36b1adde3?q=80&w=800&auto=format&fit=crop", // Foto de tênis genérica
      content: "Treino de hoje cedo! 🎾☀️"
    }
  ];

  const friends = [
    { id: 1, name: "Fernando Paiva", avatar: "https://i.pravatar.cc/150?u=fernando" },
    { id: 2, name: "Julia Oliveira", avatar: "https://i.pravatar.cc/150?u=julia" },
    { id: 3, name: "Carla Rodrigues", avatar: "https://i.pravatar.cc/150?u=carla" },
  ];

  // Dias do calendário (mock visual)
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* --- COLUNA ESQUERDA (2/3 da tela) - FEED --- */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 1. Criar Publicação */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-4">Criar Publicação</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 h-32 flex flex-col items-center justify-center text-gray-400 gap-2 cursor-pointer hover:bg-gray-100 transition">
             <div className="bg-white p-2 rounded-full shadow-sm">
                <ImageIcon size={24} className="text-gray-600" />
             </div>
             <span className="text-sm font-medium">Arraste as fotos aqui</span>
             <button className="text-xs text-cyan-500 font-bold border border-cyan-200 px-3 py-1 rounded-full bg-white">
               Selecionar do Computador
             </button>
          </div>
        </div>

        {/* 2. Lista de Posts */}
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            {/* Cabeçalho do Post */}
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image src={post.avatar} alt={post.author} width={40} height={40} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{post.author}</h3>
                    <p className="text-xs text-gray-400">{post.time}</p>
                  </div>
               </div>
               <button className="text-gray-400 hover:text-gray-600">
                 <MoreHorizontal size={20} />
               </button>
            </div>

            {/* Imagem do Post */}
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-4 bg-gray-100">
              <Image 
                src={post.image} 
                alt="Post content" 
                fill 
                className="object-cover"
              />
            </div>

            {/* Ações (Curtir/Comentar - Opcional) */}
            <div className="flex gap-4">
               {/* Você pode adicionar botões de like aqui depois */}
            </div>
          </div>
        ))}
      </div>

      {/* --- COLUNA DIREITA (1/3 da tela) - WIDGETS --- */}
      <div className="space-y-6">
        
        {/* 1. Widget de Perfil */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           {/* Capa Mini */}
           <div className="h-24 bg-[url('https://images.unsplash.com/photo-1534067783865-9c24738596ac?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
           
           <div className="px-6 pb-6 relative">
              {/* Foto sobreposta */}
              <div className="w-16 h-16 rounded-full border-4 border-white absolute -top-8 left-6 overflow-hidden bg-gray-200">
                 {/* Usando o mock do user ou um placeholder */}
                 <Image src="https://i.pravatar.cc/150?img=5" alt="User" width={64} height={64} />
              </div>

              <div className="mt-10 mb-6">
                 <h3 className="font-bold text-gray-800 text-lg">{user?.fullName || "Joana Alves Pereira"}</h3>
                 <p className="text-xs text-gray-400">@joana.alves</p>
              </div>

              <div className="space-y-3">
                 <h4 className="font-bold text-gray-700 text-sm mb-2 border-b border-gray-100 pb-2">Informações</h4>
                 <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500">Gênero</span>
                    <span className="text-gray-800 font-medium text-right">Feminino</span>
                    
                    <span className="text-gray-500">Idade</span>
                    <span className="text-gray-800 font-medium text-right">30 anos</span>
                    
                    <span className="text-gray-500">Forehand</span>
                    <span className="text-gray-800 font-medium text-right">Direita</span>
                    
                    <span className="text-gray-500">Backhand</span>
                    <span className="text-gray-800 font-medium text-right">Uma mão</span>
                 </div>
              </div>
           </div>
        </div>

        {/* 2. Widget de Calendário (Mini) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700 text-sm">Jogos Setembro 2025</h3>
              <div className="flex gap-1">
                 <ChevronLeft size={16} className="text-gray-400 cursor-pointer" />
                 <ChevronRight size={16} className="text-gray-400 cursor-pointer" />
              </div>
           </div>

           {/* Grid de Dias */}
           <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2 text-gray-400 font-bold">
              <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
           </div>
           <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {calendarDays.map(day => {
                const isEvent = day === 19 || day === 23;
                const isSelected = day === 1;
                return (
                  <div key={day} className="relative flex justify-center items-center h-8 cursor-pointer">
                    <span className={`
                      w-7 h-7 flex items-center justify-center rounded-full z-10
                      ${isSelected ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}
                    `}>
                      {day}
                    </span>
                    {isEvent && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-pink-400 rounded-full"></span>
                    )}
                  </div>
                )
              })}
           </div>
        </div>

        {/* 3. Widget de Amigos */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-bold text-gray-700 text-sm mb-4">Amigos</h3>
           <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {friends.map(friend => (
                 <div key={friend.id} className="flex flex-col items-center min-w-[70px]">
                    <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border border-gray-200">
                       <Image src={friend.avatar} alt={friend.name} width={48} height={48} />
                    </div>
                    <span className="text-[10px] text-center text-gray-600 font-medium leading-tight">
                      {friend.name.split(' ')[0]}<br/>{friend.name.split(' ')[1]}
                    </span>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}