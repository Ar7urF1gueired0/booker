import { Router } from 'express';
import { TournamentController } from '../controllers/TournamentController.ts';

const router = Router();

// GET /api/tournaments - List all tournaments
router.get('/', TournamentController.getTournaments);

// POST /api/tournaments - Create a new tournament
router.post('/', TournamentController.createTournament);

// GET /api/tournaments/:id - Get tournament by ID
router.get('/:id', TournamentController.getTournamentById);

// PUT /api/tournaments/:id - Update tournament
router.put('/:id', TournamentController.updateTournament);

// DELETE /api/tournaments/:id - Delete tournament
router.delete('/:id', TournamentController.deleteTournament);

export default router;
