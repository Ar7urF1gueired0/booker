'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';

type MyTournament = {
  id: number;
  name: string;
  startDate: string;
  endDate?: string | null;
  registrationDeadline?: string | null;
  categoryFilter?: string | null;
  arena?: {
    name: string;
    city?: string | null;
  };
};

type CalendarCell = {
  key: string;
  label: string;
  date?: Date;
  tournaments: MyTournament[];
  isCurrentMonth: boolean;
  isToday: boolean;
};

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildRangeLabel = (tournament: MyTournament) => {
  const start = parseDate(tournament.startDate);
  if (!start) return 'Data a confirmar';

  const end = parseDate(tournament.endDate) ?? start;
  const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const startLabel = `${dateFormatter.format(start)} • ${timeFormatter.format(start)}`;
  if (!tournament.endDate || !end) {
    return startLabel;
  }

  const sameDay = start.toDateString() === end.toDateString();
  const endLabel = sameDay
    ? timeFormatter.format(end)
    : `${dateFormatter.format(end)} • ${timeFormatter.format(end)}`;

  return `${startLabel} — ${endLabel}`;
};

export default function AgendaPage() {
  const { user } = useAuth();

  const [tournaments, setTournaments] = useState<MyTournament[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => formatDateKey(today), [today]);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthStart = useMemo(
    () => new Date(currentYear, currentMonth, 1),
    [currentMonth, currentYear]
  );
  const monthEnd = useMemo(
    () => new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
    [currentMonth, currentYear]
  );

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const fetchMyTournaments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data = [] } = (await apiClient.getMyTournaments()) as { data?: MyTournament[] };
        if (!isMounted) return;
        setTournaments(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        if (!isMounted) return;
        console.error('Erro ao carregar agenda:', fetchError);
        setError('Não foi possível carregar sua agenda. Tente novamente mais tarde.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchMyTournaments();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const tournamentsInMonth = useMemo(() => {
    return tournaments
      .filter(tournament => {
        const start = parseDate(tournament.startDate);
        if (!start) return false;

        const end = parseDate(tournament.endDate) ?? start;
        return start <= monthEnd && end >= monthStart;
      })
      .sort((a, b) => {
        const startA = parseDate(a.startDate)?.getTime() ?? 0;
        const startB = parseDate(b.startDate)?.getTime() ?? 0;
        return startA - startB;
      });
  }, [tournaments, monthStart, monthEnd]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, MyTournament[]>();

    tournaments.forEach(tournament => {
      const start = parseDate(tournament.startDate);
      if (!start) return;

      const end = parseDate(tournament.endDate) ?? start;
      const rangeStart = new Date(Math.max(start.getTime(), monthStart.getTime()));
      const rangeEnd = new Date(Math.min(end.getTime(), monthEnd.getTime()));

      if (rangeStart > rangeEnd) return;

      const cursor = new Date(rangeStart);
      while (cursor <= rangeEnd) {
        const key = formatDateKey(cursor);
        const existing = map.get(key) ?? [];
        existing.push(tournament);
        map.set(key, existing);
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return map;
  }, [tournaments, monthStart, monthEnd]);

  const calendarCells = useMemo<CalendarCell[]>(() => {
    const firstWeekday = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

    const cells: CalendarCell[] = [];
    for (let index = 0; index < totalCells; index += 1) {
      const dayNumber = index - firstWeekday + 1;

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cells.push({
          key: `empty-${index}`,
          label: '',
          tournaments: [],
          isCurrentMonth: false,
          isToday: false,
        });
        continue;
      }

      const date = new Date(currentYear, currentMonth, dayNumber);
      const key = formatDateKey(date);

      cells.push({
        key,
        label: String(dayNumber),
        date,
        tournaments: eventsByDate.get(key) ?? [],
        isCurrentMonth: true,
        isToday: key === todayKey,
      });
    }

    return cells;
  }, [currentMonth, currentYear, eventsByDate, monthEnd, monthStart, todayKey]);

  const monthLabel = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600">Agenda</p>
        <h1 className="text-3xl font-bold text-gray-900">Calendário do mês</h1>
        <p className="text-gray-500">
          Visualize rapidamente em quais dias você tem torneios confirmados. Esta visão sempre
          considera o mês atual.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Mês atual</p>
              <h2 className="text-2xl font-semibold text-gray-900">{monthLabel}</h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              <CalendarDays className="h-4 w-4" />
              {tournamentsInMonth.length} torneio
              {tournamentsInMonth.length === 1 ? '' : 's'}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className={`mt-6 space-y-2 ${isLoading ? 'animate-pulse opacity-70' : ''}`}>
            <div className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
              {WEEK_DAYS.map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map(cell => (
                <div
                  key={cell.key}
                  className={`min-h-[110px] rounded-xl border p-2 text-sm transition ${
                    cell.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${cell.isToday ? 'border-cyan-400 shadow-[0_0_0_2px_rgba(6,182,212,0.15)]' : 'border-gray-100'}`}
                >
                  {cell.isCurrentMonth ? (
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                      <span>{cell.label}</span>
                      {cell.tournaments.length > 0 && (
                        <span className="text-[10px] font-bold text-cyan-600">
                          {cell.tournaments.length} evento
                          {cell.tournaments.length === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                  ) : null}

                  <div className="mt-2 space-y-1">
                    {cell.tournaments.map(tournament => (
                      <div
                        key={`${cell.key}-${tournament.id}`}
                        className="rounded-lg border border-cyan-100 bg-cyan-50/70 px-2 py-1"
                      >
                        <p className="truncate text-xs font-semibold text-gray-800">
                          {tournament.name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {new Intl.DateTimeFormat('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(parseDate(tournament.startDate) ?? new Date())}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isLoading && tournamentsInMonth.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Nenhum torneio marcado para este mês.
            </p>
          )}
        </section>

        <aside className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Próximos torneios</h3>
          <p className="text-sm text-gray-500">Lista apenas os eventos que acontecem neste mês.</p>

          <div className="mt-4 space-y-4">
            {isLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="h-20 animate-pulse rounded-2xl bg-gray-100/70"
                />
              ))}

            {!isLoading && tournamentsInMonth.length === 0 && (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
                Sem torneios agendados por enquanto.
              </div>
            )}

            {!isLoading &&
              tournamentsInMonth.map(tournament => (
                <div
                  key={tournament.id}
                  className="rounded-2xl border border-gray-100 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                >
                  <p className="text-sm font-bold text-gray-900">{tournament.name}</p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-4 w-4 text-cyan-500" />
                    {buildRangeLabel(tournament)}
                  </div>

                  {tournament.arena?.name && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="h-4 w-4 text-cyan-500" />
                      <span>
                        {tournament.arena.name}
                        {tournament.arena.city ? ` • ${tournament.arena.city}` : ''}
                      </span>
                    </div>
                  )}

                  {tournament.categoryFilter && (
                    <span className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Categoria {tournament.categoryFilter}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
