import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTournamentInput {
  name: string;
  format: string;
  courts: number;
  playersPerMatch: number;
  createdBy: string;
}

export interface UpdateTournamentInput {
  name?: string;
  format?: string;
  courts?: number;
  playersPerMatch?: number;
}

export class TournamentService {
  static async createTournament(data: CreateTournamentInput) {
    if (!data.name || !data.format || !data.courts || !data.playersPerMatch || !data.createdBy) {
      throw new Error('All fields are required');
    }

    return prisma.tournament.create({
      data,
    });
  }

  static async getTournaments() {
    return prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getTournamentById(id: string) {
    return prisma.tournament.findUnique({
      where: { id },
    });
  }

  static async updateTournament(id: string, data: UpdateTournamentInput) {
    return prisma.tournament.update({
      where: { id },
      data,
    });
  }

  static async deleteTournament(id: string) {
    return prisma.tournament.delete({
      where: { id },
    });
  }
}
