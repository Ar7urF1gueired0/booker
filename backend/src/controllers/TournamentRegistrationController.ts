import type { Response } from 'express';
import { TournamentRegistrationService } from '../services/TournamentRegistrationService';
import type { AuthRequest } from '../middleware/authMiddleware';

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

      const parsedTournamentId = Number(tournamentId);
      if (Number.isNaN(parsedTournamentId)) {
        return res.status(400).json({ error: 'Invalid tournament id' });
      }

      let parsedPartnerId: number | undefined;
      if (partnerId !== undefined) {
        parsedPartnerId = Number(partnerId);
        if (Number.isNaN(parsedPartnerId)) {
          return res.status(400).json({ error: 'Invalid partner id' });
        }
      }

      const result = await service.registerUserInTournament({
        tournamentId: parsedTournamentId,
        userId,
        partnerId: parsedPartnerId,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Tournament not found') {
        return res.status(404).json({ error: error.message });
      }

      const handledErrors = [
        'Tournament not open for registrations',
        'Registration deadline has passed',
        'Tournament already started',
        'Partner cannot be the same as the user',
        'Partner not found',
      ];

      if (handledErrors.includes(error.message)) {
        return res.status(400).json({ error: error.message });
      }

      if (error.message === 'User already registered in this tournament') {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: error.message });
    }
  }

  static async getTournamentRegistrations(req: AuthRequest, res: Response) {
    try {
      const { tournamentId } = req.params;

      if (!tournamentId) {
        return res.status(400).json({ error: 'Missing required field: tournamentId' });
      }

      const parsedTournamentId = Number(tournamentId);
      if (Number.isNaN(parsedTournamentId)) {
        return res.status(400).json({ error: 'Invalid tournament id' });
      }

      const result = await service.getTournamentRegistrations(parsedTournamentId);
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
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const parsedTournamentId = Number(tournamentId);
      if (Number.isNaN(parsedTournamentId)) {
        return res.status(400).json({ error: 'Invalid tournament id' });
      }

      const result = await service.unregisterUserFromTournament(parsedTournamentId, userId);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Registration not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
