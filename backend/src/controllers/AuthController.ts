// @ts-nocheck
import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { fullName, email, password, gender, birthDate, locationCity } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({
          error: 'Missing required fields: fullName, email, password',
        });
      }

      const result = await authService.register({
        fullName,
        email,
        password,
        gender,
        birthDate,
        locationCity,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing required fields: email, password',
        });
      }

      const result = await authService.login({
        email,
        password,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
