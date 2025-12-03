// @ts-nocheck
import type { Request, Response } from 'express';
import { Status } from '@prisma/client';
import { TournamentService } from '../services/TournamentService';
import type { TournamentFilters, UpdateTournamentInput } from '../services/TournamentService';
import type { AuthRequest } from '../middleware/authMiddleware';

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parseStatus = (value?: string): Status | undefined => {
  if (!value) return undefined;
  return Object.values(Status).includes(value as Status)
    ? (value as Status)
    : undefined;
};

export class TournamentController {
  static async getTournaments(req: Request, res: Response) {
    try {
      const filters: TournamentFilters = {};

      if (typeof req.query.status === "string") {
        const status = parseStatus(req.query.status);
        if (!status) {
          return res.status(400).json({ error: "Invalid status filter" });
        }
        filters.status = status;
      }

      if (typeof req.query.from === "string") {
        const from = parseDate(req.query.from);
        if (!from) {
          return res.status(400).json({ error: "Invalid from date" });
        }
        filters.from = from;
      }

      if (typeof req.query.to === "string") {
        const to = parseDate(req.query.to);
        if (!to) {
          return res.status(400).json({ error: "Invalid to date" });
        }
        filters.to = to;
      }

      const tournaments = await TournamentService.getTournaments(filters);
      res.json({ data: tournaments, count: tournaments.length });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch tournaments";
      res.status(500).json({ error: message });
    }
  }

  static async createTournament(req: AuthRequest, res: Response) {
    try {
      if (req.userRole !== "ADMIN") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const arenaId = Number(req.body.arenaId);
      const startDate = parseDate(req.body.startDate);
      const endDate = parseDate(req.body.endDate);
      const registrationDeadline = parseDate(req.body.registrationDeadline);
      const status = parseStatus(req.body.status);

      if (!req.body.name || Number.isNaN(arenaId) || !startDate) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (req.body.status && !status) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const tournament = await TournamentService.createTournament({
        name: req.body.name,
        arenaId,
        startDate,
        endDate,
        registrationDeadline,
        categoryFilter: req.body.categoryFilter ?? null,
        status,
        createdById: req.userId ?? null,
      });

      res.status(201).json({ data: tournament });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid tournament data";
      res.status(400).json({ error: message });
    }
  }

  static async getTournamentById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid tournament id" });
      }

      const tournament = await TournamentService.getTournamentById(id);

      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      res.json({ data: tournament });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Tournament not found";
      res.status(404).json({ error: message });
    }
  }

  static async updateTournament(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid tournament id" });
      }

      const existing = await TournamentService.getTournamentById(id);
      if (!existing) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      if (req.userRole !== "ADMIN" && existing.createdById !== req.userId) {
        return res
          .status(403)
          .json({ error: "Only admins or tournament owners can edit" });
      }

      const payload: UpdateTournamentInput = {};

      if (req.body.name) payload.name = req.body.name;

      if (req.body.arenaId !== undefined) {
        const arenaId = Number(req.body.arenaId);
        if (Number.isNaN(arenaId)) {
          return res.status(400).json({ error: "Invalid arenaId" });
        }
        payload.arenaId = arenaId;
      }

      if (req.body.startDate) {
        const startDate = parseDate(req.body.startDate);
        if (!startDate) {
          return res.status(400).json({ error: "Invalid startDate" });
        }
        payload.startDate = startDate;
      }

      if (req.body.endDate !== undefined) {
        const endDate = parseDate(req.body.endDate);
        if (req.body.endDate && !endDate) {
          return res.status(400).json({ error: "Invalid endDate" });
        }
        payload.endDate = endDate ?? null;
      }

      if (req.body.registrationDeadline !== undefined) {
        const registrationDeadline = parseDate(req.body.registrationDeadline);
        if (req.body.registrationDeadline && !registrationDeadline) {
          return res
            .status(400)
            .json({ error: "Invalid registrationDeadline" });
        }
        payload.registrationDeadline = registrationDeadline ?? null;
      }

      if (req.body.categoryFilter !== undefined) {
        payload.categoryFilter = req.body.categoryFilter ?? null;
      }

      if (req.body.status !== undefined) {
        const status = parseStatus(req.body.status);
        if (!status) {
          return res.status(400).json({ error: "Invalid status" });
        }
        payload.status = status;
      }

      const tournament = await TournamentService.updateTournament(id, payload);
      res.json({ data: tournament });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update tournament";
      res.status(400).json({ error: message });
    }
  }

  static async deleteTournament(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid tournament id" });
      }

      const existing = await TournamentService.getTournamentById(id);
      if (!existing) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      if (req.userRole !== "ADMIN" && existing.createdById !== req.userId) {
        return res
          .status(403)
          .json({ error: "Only admins or tournament owners can delete" });
      }

      await TournamentService.deleteTournament(id);
      res.json({ message: "Tournament deleted successfully" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete tournament";
      res.status(400).json({ error: message });
    }
  }

  static async getMyTournaments(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const tournaments = await TournamentService.getMyTournaments(req.userId);
      res.json({ data: tournaments });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch my tournaments";
      res.status(500).json({ error: message });
    }
  }
}
