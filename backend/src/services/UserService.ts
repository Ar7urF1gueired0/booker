import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserInput {
  fullName: string;
  email: string;
  passwordHash: string;
  role?: Role;
}

export interface UpdateUserInput {
  fullName?: string;
  role?: Role;
  locationCity?: string | null;
}

export class UserService {
  static async createUser(data: CreateUserInput) {
    if (!data.email || !data.fullName || !data.passwordHash) {
      throw new Error('Missing required user fields');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.USER,
      },
    });
  }

  static async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async updateUser(id: number, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
