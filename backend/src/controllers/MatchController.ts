// @ts-nocheck
import type { Request, Response } from 'express';
import { Status } from '@prisma/client';
import { MatchService } from '../services/MatchService';

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parseStatus = (value?: string): Status | undefined => {
  if (!value) return undefined;
  return Object.values(Status).includes(value as Status) ? (value as Status) : undefined;
};

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
      const tournamentId = Number(req.params.tournamentId);
      if (Number.isNaN(tournamentId)) {
        return res.status(400).json({ error: 'Invalid tournament id' });
      }

      const matches = await MatchService.getMatchesByTournament(tournamentId);
      res.json({ data: matches, count: matches.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch matches';
      res.status(500).json({ error: message });
    }
  }

  static async createMatch(req: Request, res: Response) {
    try {
      const arenaId = Number(req.body.arenaId);
      const matchDate = parseDate(req.body.matchDate);
      const tournamentId =
        req.body.tournamentId !== undefined && req.body.tournamentId !== null
          ? Number(req.body.tournamentId)
          : undefined;
      const status = parseStatus(req.body.status);
      const winnerTeamId =
        req.body.winnerTeamId !== undefined && req.body.winnerTeamId !== null
          ? Number(req.body.winnerTeamId)
          : undefined;

      if (Number.isNaN(arenaId) || !matchDate) {
        return res.status(400).json({ error: 'Invalid arenaId or matchDate' });
      }

      if (
        req.body.tournamentId !== undefined &&
        req.body.tournamentId !== null &&
        Number.isNaN(tournamentId)
      ) {
        return res.status(400).json({ error: 'Invalid tournament id' });
      }

      if (req.body.status && !status) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      if (
        req.body.winnerTeamId !== undefined &&
        req.body.winnerTeamId !== null &&
        Number.isNaN(winnerTeamId)
      ) {
        return res.status(400).json({ error: 'Invalid winnerTeamId' });
      }

      const match = await MatchService.createMatch({
        arenaId,
        tournamentId,
        matchDate,
        status,
        scoreResult: req.body.scoreResult ?? null,
        winnerTeamId,
      });

      res.status(201).json({ data: match });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid match data';
      res.status(400).json({ error: message });
    }
  }

  static async getMatchById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid match id' });
      }

      const match = await MatchService.getMatchById(id);

      console.log('Fetched match:', match);

      if (!match) {
        throw res.status(404).json({ error: 'Match not found' });
      }

      res.json({ data: match });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Match not found';
      res.status(404).json({ error: message });
    }
  }

  static async updateMatch(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid match id' });
      }

      const payload: any = {};

      if (req.body.arenaId !== undefined) {
        const arenaId = Number(req.body.arenaId);
        if (Number.isNaN(arenaId)) {
          return res.status(400).json({ error: 'Invalid arenaId' });
        }
        payload.arenaId = arenaId;
      }

      if (req.body.tournamentId !== undefined) {
        if (req.body.tournamentId === null) {
          payload.tournamentId = null;
        } else {
          const tournamentId = Number(req.body.tournamentId);
          if (Number.isNaN(tournamentId)) {
            return res.status(400).json({ error: 'Invalid tournament id' });
          }
          payload.tournamentId = tournamentId;
        }
      }

      if (req.body.matchDate !== undefined) {
        const matchDate = parseDate(req.body.matchDate);
        if (!matchDate) {
          return res.status(400).json({ error: 'Invalid matchDate' });
        }
        payload.matchDate = matchDate;
      }

      if (req.body.status !== undefined) {
        const status = parseStatus(req.body.status);
        if (!status) {
          return res.status(400).json({ error: 'Invalid status' });
        }
        payload.status = status;
      }

      if (req.body.scoreResult !== undefined) {
        payload.scoreResult = req.body.scoreResult ?? null;
      }

      if (req.body.winnerTeamId !== undefined) {
        if (req.body.winnerTeamId === null) {
          payload.winnerTeamId = null;
        } else {
          const winnerTeamId = Number(req.body.winnerTeamId);
          if (Number.isNaN(winnerTeamId)) {
            return res.status(400).json({ error: 'Invalid winnerTeamId' });
          }
          payload.winnerTeamId = winnerTeamId;
        }
      }

      const match = await MatchService.updateMatch(id, payload);
      res.json({ data: match });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update match';
      res.status(400).json({ error: message });
    }
  }

  static async deleteMatch(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid match id' });
      }

      await MatchService.deleteMatch(id);
      res.json({ message: 'Match deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete match';
      res.status(400).json({ error: message });
    }
  }
}
