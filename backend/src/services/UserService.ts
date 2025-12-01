import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserInput {
  email: string;
  name?: string;
  role?: string;
}

export interface UpdateUserInput {
  name?: string;
  role?: string;
}

export class UserService {
  static async createUser(data: CreateUserInput) {
    if (!data.email) {
      throw new Error('Email is required');
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
        email: data.email,
        name: data.name || null,
        role: data.role || 'player',
      },
    });
  }

  static async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async updateUser(id: string, data: UpdateUserInput) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;

    return prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
