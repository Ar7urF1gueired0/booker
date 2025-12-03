import { Router } from "express";
import { ArenaController } from "../controllers/ArenaController.js";

const router = Router();

// GET /api/arenas - List all arenas (for select options)
router.get("/", ArenaController.getArenas);

// GET /api/arenas/:id - Get arena by ID
router.get("/:id", ArenaController.getArenaById);

export default router;

