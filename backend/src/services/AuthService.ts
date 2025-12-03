import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  gender?: string;
  birthDate?: Date;
  locationCity?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
    photoUrl?: string;
  };
  token: string;
}

export class AuthService {
  private jwtSecret =
    process.env.JWT_SECRET || "your-secret-key-change-in-production";

  async register(data: RegisterData): Promise<AuthResponse> {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: hashedPassword,
        gender: (data.gender as any) || undefined,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        locationCity: data.locationCity,
      },
    });

    // Gerar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    // Buscar usuário por email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        photoUrl: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        photoUrl: user.photoUrl ?? undefined,
      },
      token,
    };
  }

  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
