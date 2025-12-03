import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ArenaService {
  static async getArenas() {
    return prisma.arena.findMany({
      select: {
        id: true,
        name: true,
        city: true,
      },
      orderBy: { name: "asc" },
    });
  }

  static async getArenaById(id: number) {
    return prisma.arena.findUnique({
      where: { id },
    });
  }
}

