import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PostService {
  static async getPosts() {
    return prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
          },
        },
      },
    });
  }
}
