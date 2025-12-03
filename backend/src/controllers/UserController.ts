import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { UserService } from '../services/UserService';

export class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getUsers();
      res.json({ data: users, count: users.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      res.status(500).json({ error: message });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { email, fullName, password, role } = req.body;

      if (!email || !fullName || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const roleValue =
        role && Object.values(Role).includes(role as Role) ? (role as Role) : Role.USER;

      const user = await UserService.createUser({
        email,
        fullName,
        passwordHash: hashedPassword,
        role: roleValue,
      });

      res.status(201).json({ data: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid user data';
      res.status(400).json({ error: message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (Number.isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      const user = await UserService.getUserById(parsedId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ data: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'User not found';
      res.status(404).json({ error: message });
    }
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ data: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'User not found';
      res.status(404).json({ error: message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (Number.isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      const updateData: any = {};
      if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
      if (req.body.locationCity !== undefined) {
        updateData.locationCity = req.body.locationCity ?? null;
      }
      if (req.body.photoUrl !== undefined) {
        const photoValue = req.body.photoUrl;
        if (photoValue === null || photoValue === '') {
          updateData.photoUrl = null;
        } else if (typeof photoValue === 'string') {
          updateData.photoUrl = photoValue;
        } else {
          return res.status(400).json({ error: 'Invalid photoUrl' });
        }
      }
      if (req.body.role !== undefined) {
        if (!Object.values(Role).includes(req.body.role as Role)) {
          return res.status(400).json({ error: 'Invalid role' });
        }
        updateData.role = req.body.role as Role;
      }

      const user = await UserService.updateUser(parsedId, updateData);
      res.json({ data: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      res.status(400).json({ error: message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (Number.isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      await UserService.deleteUser(parsedId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(400).json({ error: message });
    }
  }
}
