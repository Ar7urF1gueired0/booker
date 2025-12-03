import type { Request, Response } from "express";
import { ArenaService } from "../services/ArenaService.js";

export class ArenaController {
  static async getArenas(req: Request, res: Response) {
    try {
      const arenas = await ArenaService.getArenas();
      res.json({ data: arenas });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch arenas";
      res.status(500).json({ error: message });
    }
  }

  static async getArenaById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: "Invalid arena id" });
      }

      const arena = await ArenaService.getArenaById(id);

      if (!arena) {
        return res.status(404).json({ error: "Arena not found" });
      }

      res.json({ data: arena });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Arena not found";
      res.status(404).json({ error: message });
    }
  }
}

