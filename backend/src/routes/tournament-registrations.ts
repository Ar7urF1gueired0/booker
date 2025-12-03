import express from 'express';
import { TournamentRegistrationController } from '../controllers/TournamentRegistrationController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/registrations/:tournamentId/register - Inscrever usuário (requer autenticação)
router.post(
  '/:tournamentId/register',
  authMiddleware,
  TournamentRegistrationController.registerInTournament
);

// GET /api/registrations/:tournamentId - Listar inscritos
router.get(
  '/:tournamentId',
  TournamentRegistrationController.getTournamentRegistrations
);

// DELETE /api/registrations/:tournamentId/unregister - Desinscrever usuário (requer autenticação)
router.delete(
  '/:tournamentId/unregister',
  authMiddleware,
  TournamentRegistrationController.unregisterFromTournament
);

export default router;
