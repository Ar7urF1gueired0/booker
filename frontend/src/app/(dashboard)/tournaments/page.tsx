'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Filter,
  Trophy,
  Star,
  Clock,
  Plus,
  ChevronDown,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Modal, ModalFormSchema } from '@/components/Modal';
import { enqueueSnackbar } from 'notistack';

type ApiTournament = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string | null;
  categoryFilter: string | null;
  status: string;
  arena: {
    id: number;
    name: string;
    address: string;
    city: string;
    contactPhone: string;
  };
  _count?: {
    registrations?: number;
    matches?: number;
  };
  registrations?: Array<{
    id: number;
    registrationDate: string;
    user: {
      id: number;
      fullName: string;
    };
  }>;
};

type MyTournament = ApiTournament;

type Arena = {
  id: number;
  name: string;
  city: string | null;
};

const buildCreateTournamentFormSchema = (arenas: Arena[]): ModalFormSchema => ({
  fields: [
    {
      name: 'name',
      label: 'Nome do Torneio',
      type: 'text',
      placeholder: 'Ex: Copa Beach 2025',
      required: true,
    },
    {
      name: 'arenaId',
      label: 'Arena',
      type: 'select',
      required: true,
      options: arenas.map(arena => ({
        label: arena.city ? `${arena.name} - ${arena.city}` : arena.name,
        value: String(arena.id),
      })),
    },
    {
      name: 'startDate',
      label: 'Data de Início',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      label: 'Data de Término',
      type: 'date',
      required: false,
    },
    {
      name: 'registrationDeadline',
      label: 'Prazo de Inscrição',
      type: 'date',
      required: false,
      description: 'Data limite para inscrições',
    },
    {
      name: 'categoryFilter',
      label: 'Categoria',
      type: 'select',
      required: false,
      options: [
        { label: 'Profissional', value: 'PRO' },
        { label: 'Amador A', value: 'A' },
        { label: 'Amador B', value: 'B' },
        { label: 'Iniciante', value: 'C' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      defaultValue: 'OPEN',
      options: [
        { label: 'Aberto', value: 'OPEN' },
        { label: 'Agendado', value: 'SCHEDULED' },
        { label: 'Em andamento', value: 'IN_PROGRESS' },
        { label: 'Finalizado', value: 'FINISHED' },
        { label: 'Cancelado', value: 'CANCELLED' },
      ],
    },
  ],
  submitLabel: 'Criar Torneio',
});

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<'MEUS' | 'ENCONTRE'>('MEUS');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [findTournaments, setFindTournaments] = useState<ApiTournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<MyTournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMyTournaments, setIsLoadingMyTournaments] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [myTournamentsError, setMyTournamentsError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [isLoadingArenas, setIsLoadingArenas] = useState(false);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<ApiTournament | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const registrationDeadlineLabel = (deadline: string | null) => {
    if (!deadline) return 'Prazo não informado';

    const parsed = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (Number.isNaN(diffDays)) return 'Prazo não informado';
    if (diffDays < 0) return 'Inscrições encerradas';
    if (diffDays === 0) return 'Último dia';
    return `${diffDays} dias para encerrar`;
  };

  const isRegistrationOpen = (deadline: string | null): boolean => {
    if (!deadline) return true; // Se não tem deadline, permite inscrição
    const parsed = new Date(deadline);
    const now = new Date();
    return parsed.getTime() >= now.getTime();
  };

  const isUserRegistered = (tournament: ApiTournament): boolean => {
    if (!user) return false;
    const tournamentWithRegistrations = tournament as MyTournament;
    if (!tournamentWithRegistrations.registrations) return false;
    return tournamentWithRegistrations.registrations.some(
      registration => registration.user?.id === user.id
    );
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return 'Data indisponível';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(parsed);
  };

  // Buscar torneios do usuário
  useEffect(() => {
    if (!user) return;

    const fetchMyTournaments = async () => {
      try {
        setIsLoadingMyTournaments(true);
        setMyTournamentsError(null);

        const { data = [] } = (await apiClient.getMyTournaments()) as { data?: MyTournament[] };
        setMyTournaments(Array.isArray(data) ? data : []);
      } catch (error) {
        setMyTournamentsError(
          'Não foi possível carregar seus torneios. Tente novamente mais tarde.'
        );
      } finally {
        setIsLoadingMyTournaments(false);
      }
    };

    fetchMyTournaments();
  }, [user]);

  // Buscar arenas para o select (apenas para admins)
  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    const fetchArenas = async () => {
      try {
        setIsLoadingArenas(true);
        const { data = [] } = (await apiClient.getArenas()) as { data?: Arena[] };
        setArenas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao buscar arenas:', error);
      } finally {
        setIsLoadingArenas(false);
      }
    };

    fetchArenas();
  }, [user?.role]);

  // Buscar torneios disponíveis
  useEffect(() => {
    const controller = new AbortController();

    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';
        const params = new URLSearchParams({
          status: 'OPEN',
          from: '2025-01-01',
          to: '2025-12-31',
        });

        const response = await fetch(`${baseUrl}/api/tournaments?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Falha ao carregar torneios');
        }

        const { data = [] } = (await response.json()) as { data?: ApiTournament[] };
        setFindTournaments(Array.isArray(data) ? data : []);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setFetchError('Não foi possível carregar os torneios. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();

    return () => controller.abort();
  }, []);

  // --- HANDLERS ---
  const openSubscribeModal = (tournament: ApiTournament) => {
    if (!user) {
      enqueueSnackbar('Você precisa estar logado para se inscrever.', { variant: 'warning' });
      return;
    }
    setSelectedTournament(tournament);
    setSubscribeModalOpen(true);
  };

  const handleSubscribe = async () => {
    if (!selectedTournament || !user) return;

    try {
      setIsSubscribing(true);
      await apiClient.registerTournament(selectedTournament.id);

      // Remove o torneio da lista de disponíveis e adiciona aos meus torneios
      setFindTournaments(prev => prev.filter(t => t.id !== selectedTournament.id));
      setMyTournaments(prev => [selectedTournament as MyTournament, ...prev]);

      setSubscribeModalOpen(false);
      setSelectedTournament(null);

      enqueueSnackbar('Inscrição realizada com sucesso! Seus jogos aparecerão na Agenda.', {
        variant: 'success',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar inscrição';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCreateTournament = async (formData: Record<string, string>) => {
    try {
      const tournamentData = {
        name: formData.name,
        arenaId: Number(formData.arenaId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        registrationDeadline: formData.registrationDeadline
          ? new Date(formData.registrationDeadline + 'T23:59:59').toISOString()
          : undefined,
        categoryFilter: formData.categoryFilter || undefined,
        status: formData.status || 'OPEN',
      };

      const { data } = await apiClient.createTournament(tournamentData);

      // Adiciona o novo torneio à lista de torneios disponíveis
      setFindTournaments(prev => [data, ...prev]);

      setIsCreateModalOpen(false);
      enqueueSnackbar('Torneio criado com sucesso!', { variant: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar torneio';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DAS ABAS */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('MEUS');
            setIsFilterOpen(false);
          }}
          className={`px-6 py-4 font-bold text-sm tracking-wide transition relative whitespace-nowrap ${
            activeTab === 'MEUS' ? 'text-cyan-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          MEUS TORNEIOS
          {activeTab === 'MEUS' && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('ENCONTRE');
            setIsFilterOpen(false);
          }}
          className={`px-6 py-4 font-bold text-sm tracking-wide transition relative whitespace-nowrap ${
            activeTab === 'ENCONTRE' ? 'text-cyan-500' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          ENCONTRE TORNEIOS
          {activeTab === 'ENCONTRE' && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-500 rounded-t-full" />
          )}
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
            <Filter size={18} /> Filtro{' '}
            <ChevronDown size={14} className={`transition ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Botão Admin */}
          {activeTab === 'MEUS' && user?.role === 'ADMIN' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
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
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Categoria
                </label>
                <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-cyan-500">
                  <option>Todas</option>
                  <option>Profissional</option>
                  <option>Amador A</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Localização
                </label>
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
          {myTournamentsError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {myTournamentsError}
            </div>
          )}

          {isLoadingMyTournaments && (
            <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              Carregando seus torneios...
            </div>
          )}

          {!isLoadingMyTournaments && !myTournamentsError && myTournaments.length === 0 && (
            <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-4 text-center">
              Você ainda não está inscrito em nenhum torneio.
            </div>
          )}

          {myTournaments.map(t => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-100 transition"
            >
              {/* Esquerda */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 bg-cyan-50 rounded-full flex items-center justify-center text-2xl border border-gray-100 shrink-0">
                  🎾
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{t.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {t.arena?.name ?? 'Arena não informada'} •{' '}
                    {t.arena?.city ?? 'Cidade não informada'}
                  </p>
                </div>
              </div>

              {/* Centro */}
              <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full md:w-auto bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl">
                {t.status === 'OPEN' ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 shrink-0">
                      <CalendarCheck size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                      <p className="text-sm font-semibold text-gray-700">Inscrito</p>
                    </div>
                  </div>
                ) : t.status === 'IN_PROGRESS' ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-1.5 rounded-full text-yellow-600 shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Status</p>
                      <p className="text-sm font-semibold text-gray-700">Em andamento</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-cyan-500 fill-cyan-500 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-400">Status</p>
                        <p className="text-sm font-bold text-gray-700">Finalizado</p>
                      </div>
                    </div>
                    <div className="w-full h-px md:w-px md:h-8 bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                      <div className="bg-cyan-500 p-1 rounded-full text-white shrink-0">
                        <Trophy size={12} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400">Partidas</p>
                        <p className="text-sm font-bold text-gray-700">{t._count?.matches ?? 0}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="w-full h-px md:w-px md:h-8 bg-gray-200"></div>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100 p-2 rounded-full text-cyan-600 shrink-0">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">
                      {formatDate(t.startDate)} - {formatDate(t.endDate)}
                    </p>
                    <span className="text-xs text-gray-400">Período</span>
                  </div>
                </div>
              </div>

              {/* Direita */}
              <div className="w-full md:w-auto text-right">
                {t.status === 'OPEN' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-600 text-xs font-bold px-3 py-1 rounded-full">
                      <Clock size={12} />
                      Aguardando início
                    </span>
                    <p
                      onClick={() => router.push('/agenda')}
                      className="text-xs text-gray-400 hover:text-cyan-500 cursor-pointer underline decoration-dotted"
                    >
                      Ver na Agenda
                    </p>
                  </div>
                )}
                {t.status === 'IN_PROGRESS' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">
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
                {t.status === 'FINISHED' && (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">
                    <Trophy size={12} />
                    Finalizado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ABA: ENCONTRE TORNEIOS (Mantém igual) */}
      {activeTab === 'ENCONTRE' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {fetchError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {fetchError}
            </div>
          )}

          {isLoading && (
            <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              Carregando torneios...
            </div>
          )}

          {!isLoading && !fetchError && findTournaments.length === 0 && (
            <div className="text-sm text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-3 py-4 text-center">
              Nenhum torneio disponível no período informado.
            </div>
          )}

          {findTournaments.map(t => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-cyan-100 transition"
            >
              {/* Esquerda */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center text-3xl shrink-0">
                  🎾
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{t.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {t.arena?.name ?? 'Arena não informada'} •{' '}
                    {t.arena?.city ?? 'Cidade não informada'}
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
                    <p className="font-bold text-gray-800">
                      {t._count?.registrations ?? 0} inscrições
                    </p>
                    <span className="text-xs text-gray-400">
                      {t._count?.matches ?? 0} partidas previstas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100 p-2 rounded-full text-cyan-600 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {formatDate(t.startDate)} - {formatDate(t.endDate)}
                    </p>
                    <span className="text-xs text-gray-400">Período do torneio</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100 p-2 rounded-full text-cyan-600 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">
                      {registrationDeadlineLabel(t.registrationDeadline)}
                    </p>
                    <span className="text-xs text-gray-400">Limite de inscrição</span>
                  </div>
                </div>
              </div>

              {/* Direita */}
              <button
                onClick={() =>
                  isRegistrationOpen(t.registrationDeadline) &&
                  !isUserRegistered(t) &&
                  openSubscribeModal(t)
                }
                disabled={!isRegistrationOpen(t.registrationDeadline) || isUserRegistered(t)}
                className={`w-full md:w-auto px-8 py-2 font-bold rounded-full transition ${
                  isUserRegistered(t)
                    ? 'bg-green-100 text-green-600 cursor-default'
                    : isRegistrationOpen(t.registrationDeadline)
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-200 cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isUserRegistered(t)
                  ? '✓ Inscrito'
                  : isRegistrationOpen(t.registrationDeadline)
                    ? 'Inscreva-se'
                    : 'Encerrado'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação de Torneio */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Criar Novo Torneio"
          subtitle={
            isLoadingArenas
              ? 'Carregando arenas...'
              : arenas.length === 0
                ? 'Nenhuma arena disponível'
                : 'Preencha as informações do torneio'
          }
          formSchema={buildCreateTournamentFormSchema(arenas)}
          onSubmit={handleCreateTournament}
        />
      )}

      {/* Modal de Confirmação de Inscrição */}
      {subscribeModalOpen && selectedTournament && (
        <Modal
          isOpen={subscribeModalOpen}
          onClose={() => {
            setSubscribeModalOpen(false);
            setSelectedTournament(null);
          }}
          title="Confirmar Inscrição"
          subtitle={selectedTournament.name}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-cyan-500" />
                <span className="text-gray-600">
                  {selectedTournament.arena?.name} - {selectedTournament.arena?.city}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-cyan-500" />
                <span className="text-gray-600">
                  {formatDate(selectedTournament.startDate)} -{' '}
                  {formatDate(selectedTournament.endDate)}
                </span>
              </div>
              {selectedTournament.registrationDeadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-cyan-500" />
                  <span className="text-gray-600">
                    Inscrições até: {formatDate(selectedTournament.registrationDeadline)}
                  </span>
                </div>
              )}
              {selectedTournament.categoryFilter && (
                <div className="flex items-center gap-2 text-sm">
                  <Trophy size={16} className="text-cyan-500" />
                  <span className="text-gray-600">
                    Categoria: {selectedTournament.categoryFilter}
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600">
              Deseja confirmar sua inscrição neste torneio? Após a confirmação, seus jogos
              aparecerão automaticamente na sua Agenda.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubscribeModalOpen(false);
                  setSelectedTournament(null);
                }}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                disabled={isSubscribing}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Inscrevendo...' : 'Confirmar Inscrição'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
