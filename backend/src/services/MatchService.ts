import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateMatchInput {
  tournamentId: string;
  court: number;
  team1Players: string[];
  team2Players: string[];
  scheduledAt: Date;
}

export interface UpdateMatchInput {
  court?: number;
  team1Players?: string[];
  team2Players?: string[];
  team1Score?: number;
  team2Score?: number;
  status?: string;
  scheduledAt?: Date;
}

export class MatchService {
  static async createMatch(data: CreateMatchInput) {
    if (!data.tournamentId || !data.court || !data.team1Players || !data.team2Players || !data.scheduledAt) {
      throw new Error('All fields are required');
    }

    return prisma.match.create({
      data: {
        tournamentId: data.tournamentId,
        court: data.court,
        team1Players: data.team1Players,
        team2Players: data.team2Players,
        scheduledAt: new Date(data.scheduledAt),
        status: 'scheduled',
      },
    });
  }

  static async getMatches() {
    return prisma.match.findMany({
      orderBy: { scheduledAt: 'asc' },
    });
  }

  static async getMatchesByTournament(tournamentId: string) {
    return prisma.match.findMany({
      where: { tournamentId },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  static async getMatchById(id: string) {
    return prisma.match.findUnique({
      where: { id },
    });
  }

  static async updateMatch(id: string, data: UpdateMatchInput) {
    const updateData: any = {};
    if (data.court !== undefined) updateData.court = data.court;
    if (data.team1Players !== undefined) updateData.team1Players = data.team1Players;
    if (data.team2Players !== undefined) updateData.team2Players = data.team2Players;
    if (data.team1Score !== undefined) updateData.team1Score = data.team1Score;
    if (data.team2Score !== undefined) updateData.team2Score = data.team2Score;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = new Date(data.scheduledAt);

    return prisma.match.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteMatch(id: string) {
    return prisma.match.delete({
      where: { id },
    });
  }
}
