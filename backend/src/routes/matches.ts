import { Router } from 'express';
import { MatchController } from '../controllers/MatchController.ts';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

// GET /api/matches - List all matches
router.get('/', MatchController.getMatches);

// GET /api/matches/tournament/:tournamentId - Get matches by tournament
router.get('/tournament/:tournamentId', MatchController.getMatchesByTournament);

// POST /api/matches - Create a new match
router.post('/', authMiddleware, adminMiddleware, MatchController.createMatch);

// GET /api/matches/:id - Get match by ID
router.get('/:id', MatchController.getMatchById);

// PUT /api/matches/:id - Update match
router.put('/:id', authMiddleware, adminMiddleware, MatchController.updateMatch);

// DELETE /api/matches/:id - Delete match
router.delete('/:id', authMiddleware, adminMiddleware, MatchController.deleteMatch);

export default router;
