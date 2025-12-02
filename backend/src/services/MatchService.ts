import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateMatchInput {
  arenaId: number;
  tournamentId?: number;
  matchDate: Date;
  status?: Status;
  scoreResult?: string | null;
  winnerTeamId?: number | null;
}

export interface UpdateMatchInput {
  arenaId?: number;
  tournamentId?: number | null;
  matchDate?: Date;
  status?: Status;
  scoreResult?: string | null;
  winnerTeamId?: number | null;
}

const matchInclude = {
  arena: true,
  tournament: {
    select: {
      id: true,
      name: true,
      startDate: true,
    },
  },
};

export class MatchService {
  static async createMatch(data: CreateMatchInput) {
    if (!data.arenaId || !data.matchDate) {
      throw new Error('Missing required fields');
    }

    return prisma.match.create({
      data: {
        arenaId: data.arenaId,
        tournamentId: data.tournamentId ?? null,
        matchDate: data.matchDate,
        status: data.status ?? Status.SCHEDULED,
        scoreResult: data.scoreResult ?? null,
        winnerTeamId: data.winnerTeamId ?? null,
      },
      include: matchInclude,
    });
  }

  static async getMatches() {
    return prisma.match.findMany({
      orderBy: { matchDate: 'asc' },
      include: matchInclude,
    });
  }

  static async getMatchesByTournament(tournamentId: number) {
    return prisma.match.findMany({
      where: { tournamentId },
      orderBy: { matchDate: 'asc' },
      include: matchInclude,
    });
  }

  static async getMatchById(id: number) {
    return prisma.match.findUnique({
      where: { id },
      include: matchInclude,
    });
  }

  static async updateMatch(id: number, data: UpdateMatchInput) {
    return prisma.match.update({
      where: { id },
      data,
      include: matchInclude,
    });
  }

  static async deleteMatch(id: number) {
    return prisma.match.delete({
      where: { id },
    });
  }
}
