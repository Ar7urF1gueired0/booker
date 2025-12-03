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

  static async createPost(data: { contentText: string; imageUrl: string, userId: number }) {
    const { contentText, imageUrl, userId } = data;

    
    const createdPost = await prisma.post.create({
      data: {
        contentText,
        imageUrl,
        userId
      },
    });

    return createdPost;
  }
}
