import type { Request, Response } from 'express';
import { TournamentService } from '../services/TournamentService.ts';

export class TournamentController {
  static async getTournaments(req: Request, res: Response) {
    try {
      const tournaments = await TournamentService.getTournaments();
      res.json({ data: tournaments, count: tournaments.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tournaments';
      res.status(500).json({ error: message });
    }
  }

  static async createTournament(req: Request, res: Response) {
    try {
      const { name, format, courts, playersPerMatch, createdBy } = req.body;

      if (!name || !format || !courts || !playersPerMatch || !createdBy) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const tournament = await TournamentService.createTournament({
        name,
        format,
        courts: parseInt(courts, 10),
        playersPerMatch: parseInt(playersPerMatch, 10),
        createdBy,
      });

      res.status(201).json({ data: tournament });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid tournament data';
      res.status(400).json({ error: message });
    }
  }

  static async getTournamentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tournament = await TournamentService.getTournamentById(id);

      if (!tournament) {
        return res.status(404).json({ error: 'Tournament not found' });
      }

      res.json({ data: tournament });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tournament not found';
      res.status(404).json({ error: message });
    }
  }

  static async updateTournament(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, format, courts, playersPerMatch } = req.body;

      const updateData: Record<string, any> = {};
      if (name) updateData.name = name;
      if (format) updateData.format = format;
      if (courts) updateData.courts = parseInt(courts, 10);
      if (playersPerMatch) updateData.playersPerMatch = parseInt(playersPerMatch, 10);

      const tournament = await TournamentService.updateTournament(id, updateData);
      res.json({ data: tournament });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update tournament';
      res.status(400).json({ error: message });
    }
  }

  static async deleteTournament(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await TournamentService.deleteTournament(id);
      res.json({ message: 'Tournament deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete tournament';
      res.status(400).json({ error: message });
    }
  }
}
