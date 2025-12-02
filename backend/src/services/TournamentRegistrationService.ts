import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

interface RegisterTournamentData {
  tournamentId: number;
  userId: number;
  partnerId?: number;
}

interface TournamentRegistrationResponse {
  id: number;
  tournamentId: number;
  userId: number;
  partnerId: number | null;
  registrationDate: Date;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  partner?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
}

export class TournamentRegistrationService {
  async registerUserInTournament(
    data: RegisterTournamentData
  ): Promise<TournamentRegistrationResponse> {
    // Verificar se o torneio existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: data.tournamentId },
    });

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    if (tournament.status !== Status.OPEN) {
      throw new Error('Tournament not open for registrations');
    }

    const now = new Date();
    if (tournament.registrationDeadline && tournament.registrationDeadline < now) {
      throw new Error('Registration deadline has passed');
    }

    if (tournament.startDate < now) {
      throw new Error('Tournament already started');
    }

    // Verificar se o usuário já está inscrito
    const existingRegistration = await prisma.tournamentRegistration.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId: data.tournamentId,
          userId: data.userId,
        },
      },
    });

    if (existingRegistration) {
      throw new Error('User already registered in this tournament');
    }

    // Verificar se o parceiro existe (se fornecido)
    if (data.partnerId) {
      if (data.partnerId === data.userId) {
        throw new Error('Partner cannot be the same as the user');
      }

      const partner = await prisma.user.findUnique({
        where: { id: data.partnerId },
      });

      if (!partner) {
        throw new Error('Partner not found');
      }
    }

    // Criar inscrição
    const registration = await prisma.tournamentRegistration.create({
      data: {
        tournamentId: data.tournamentId,
        userId: data.userId,
        partnerId: data.partnerId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        partner: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return registration as TournamentRegistrationResponse;
  }

  async getTournamentRegistrations(tournamentId: number) {
    // Verificar se o torneio existe
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new Error('Tournament not found');
    }

    const registrations = await prisma.tournamentRegistration.findMany({
      where: { tournamentId },
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
    });

    return registrations;
  }

  async unregisterUserFromTournament(tournamentId: number, userId: number) {
    // Verificar se a inscrição existe
    const registration = await prisma.tournamentRegistration.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    // Deletar inscrição
    await prisma.tournamentRegistration.delete({
      where: {
        id: registration.id,
      },
    });

    return { message: 'User unregistered successfully' };
  }
}
