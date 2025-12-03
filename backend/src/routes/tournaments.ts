import { Router } from 'express';
import { TournamentController } from '../controllers/TournamentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET /api/tournaments - List all tournaments
router.get("/", TournamentController.getTournaments);

// POST /api/tournaments - Create a new tournament
router.post("/", authMiddleware, TournamentController.createTournament);

// GET /api/tournaments/my - Get my tournaments (DEVE vir ANTES de /:id)
router.get("/my", authMiddleware, TournamentController.getMyTournaments);

// GET /api/tournaments/:id - Get tournament by ID
router.get("/:id", TournamentController.getTournamentById);

// PUT /api/tournaments/:id - Update tournament
router.put("/:id", authMiddleware, TournamentController.updateTournament);

// DELETE /api/tournaments/:id - Delete tournament
router.delete("/:id", authMiddleware, TournamentController.deleteTournament);

export default router;
