import type { Request, Response } from 'express';
import { MatchService } from '../services/MatchService.ts';

export class MatchController {
  static async getMatches(req: Request, res: Response) {
    try {
      const matches = await MatchService.getMatches();
      res.json({ data: matches, count: matches.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch matches';
      res.status(500).json({ error: message });
    }
  }

  static async getMatchesByTournament(req: Request, res: Response) {
    try {
      const { tournamentId } = req.params;
      const matches = await MatchService.getMatchesByTournament(tournamentId);
      res.json({ data: matches, count: matches.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch matches';
      res.status(500).json({ error: message });
    }
  }

  static async createMatch(req: Request, res: Response) {
    try {
      const { tournamentId, court, team1Players, team2Players, scheduledAt } = req.body;

      if (!tournamentId || !court || !team1Players || !team2Players || !scheduledAt) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const match = await MatchService.createMatch({
        tournamentId,
        court: parseInt(court, 10),
        team1Players: Array.isArray(team1Players) ? team1Players : [team1Players],
        team2Players: Array.isArray(team2Players) ? team2Players : [team2Players],
        scheduledAt: new Date(scheduledAt),
      });

      res.status(201).json({ data: match });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid match data';
      res.status(400).json({ error: message });
    }
  }

  static async getMatchById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const match = await MatchService.getMatchById(id);

      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      res.json({ data: match });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Match not found';
      res.status(404).json({ error: message });
    }
  }

  static async updateMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { court, team1Players, team2Players, team1Score, team2Score, status, scheduledAt } = req.body;

      const updateData: any = {};
      if (court !== undefined) updateData.court = parseInt(court, 10);
      if (team1Players !== undefined) updateData.team1Players = Array.isArray(team1Players) ? team1Players : [team1Players];
      if (team2Players !== undefined) updateData.team2Players = Array.isArray(team2Players) ? team2Players : [team2Players];
      if (team1Score !== undefined) updateData.team1Score = parseInt(team1Score, 10);
      if (team2Score !== undefined) updateData.team2Score = parseInt(team2Score, 10);
      if (status !== undefined) updateData.status = status;
      if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);

      const match = await MatchService.updateMatch(id, updateData);
      res.json({ data: match });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update match';
      res.status(400).json({ error: message });
    }
  }

  static async deleteMatch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await MatchService.deleteMatch(id);
      res.json({ message: 'Match deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete match';
      res.status(400).json({ error: message });
    }
  }
}
