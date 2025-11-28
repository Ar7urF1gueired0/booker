import type { Request, Response } from 'express';
import { UserService } from '../services/UserService.ts';

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
      const { email, name, role } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const user = await UserService.createUser({
        email,
        name: name || undefined,
        role: role || 'player',
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
      const user = await UserService.getUserById(id);

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
      const { name, role } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role;

      const user = await UserService.updateUser(id, updateData);
      res.json({ data: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      res.status(400).json({ error: message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      res.status(400).json({ error: message });
    }
  }
}
