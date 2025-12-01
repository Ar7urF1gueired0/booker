import { Response } from 'express';
import { TournamentRegistrationService } from '../services/TournamentRegistrationService.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';

const service = new TournamentRegistrationService();

export class TournamentRegistrationController {
  static async registerInTournament(req: AuthRequest, res: Response) {
    try {
      const { tournamentId } = req.params;
      const { partnerId } = req.body;
      const userId = req.userId;

      if (!tournamentId || !userId) {
        return res.status(400).json({
          error: 'Missing required fields: tournamentId, userId',
        });
      }

      const result = await service.registerUserInTournament({
        tournamentId: parseInt(tournamentId),
        userId,
        partnerId: partnerId ? parseInt(partnerId) : undefined,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Tournament not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'User already registered in this tournament') {
        return res.status(409).json({ error: error.message });
      }
      if (error.message === 'Partner not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async getTournamentRegistrations(req: AuthRequest, res: Response) {
    try {
      const { tournamentId } = req.params;

      if (!tournamentId) {
        return res.status(400).json({
          error: 'Missing required field: tournamentId',
        });
      }

      const result = await service.getTournamentRegistrations(
        parseInt(tournamentId)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Tournament not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  static async unregisterFromTournament(req: AuthRequest, res: Response) {
    try {
      const { tournamentId } = req.params;
      const userId = req.userId;

      if (!tournamentId || !userId) {
        return res.status(400).json({
          error: 'Missing required fields',
        });
      }

      const result = await service.unregisterUserFromTournament(
        parseInt(tournamentId),
        userId
      );

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Registration not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
