import { Request, Response } from 'express';

export class TournamentController {
  static async getTournaments(req: Request, res: Response) {
    try {
      res.json({ tournaments: [] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tournaments' });
    }
  }

  static async createTournament(req: Request, res: Response) {
    try {
      const { name, format, courts, playersPerMatch } = req.body;
      res.status(201).json({ id: '1', name, format, courts, playersPerMatch });
    } catch (error) {
      res.status(400).json({ error: 'Invalid tournament data' });
    }
  }

  static async getTournamentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      res.json({ id, name: 'Tournament' });
    } catch (error) {
      res.status(404).json({ error: 'Tournament not found' });
    }
  }
}
