import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateTournamentInput {
  name: string;
  arenaId: number;
  startDate: Date;
  endDate?: Date | null;
  registrationDeadline?: Date | null;
  categoryFilter?: string | null;
  status?: Status;
  createdById?: number | null;
}

export interface UpdateTournamentInput {
  name?: string;
  arenaId?: number;
  startDate?: Date;
  endDate?: Date | null;
  registrationDeadline?: Date | null;
  categoryFilter?: string | null;
  status?: Status;
}

export interface TournamentFilters {
  status?: Status;
  from?: Date;
  to?: Date;
}

const baseInclude = {
  arena: true,
  createdBy: {
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  },
  _count: {
    select: {
      registrations: true,
      matches: true,
    },
  },
};

export class TournamentService {
  static async createTournament(data: CreateTournamentInput) {
    if (!data.name || !data.arenaId || !data.startDate) {
      throw new Error("Missing required fields");
    }

    return prisma.tournament.create({
      data: {
        name: data.name,
        arenaId: data.arenaId,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        registrationDeadline: data.registrationDeadline ?? null,
        categoryFilter: data.categoryFilter ?? null,
        status: data.status ?? Status.OPEN,
        createdById: data.createdById ?? null,
      },
      include: baseInclude,
    });
  }

  static async getTournaments(filters: TournamentFilters = {}) {
    return prisma.tournament.findMany({
      orderBy: { startDate: "asc" },
      include: { ...baseInclude, registrations: { include: { user: true } } },
    });
  }

  static async getTournamentById(id: number) {
    return prisma.tournament.findUnique({
      where: { id },
      include: {
        ...baseInclude,
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                level: true,
              },
            },
            partner: {
              select: {
                id: true,
                fullName: true,
                email: true,
                level: true,
              },
            },
          },
        },
        matches: {
          orderBy: { matchDate: "asc" },
        },
      },
    });
  }

  static async updateTournament(id: number, data: UpdateTournamentInput) {
    return prisma.tournament.update({
      where: { id },
      data,
      include: baseInclude,
    });
  }

  static async deleteTournament(id: number) {
    return prisma.tournament.delete({
      where: { id },
    });
  }
  static async getMyTournaments(userId: number) {
    return prisma.tournament.findMany({
      where: { registrations: { some: { userId } } },
      include: {
        ...baseInclude,
        registrations: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
