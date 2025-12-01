import express from 'express';
import { TournamentRegistrationController } from '../controllers/TournamentRegistrationController.ts';

const router = express.Router();

// POST /api/registrations/:tournamentId/register - Inscrever usuário
router.post(
  '/:tournamentId/register',
  TournamentRegistrationController.registerInTournament
);

// GET /api/registrations/:tournamentId - Listar inscritos
router.get(
  '/:tournamentId',
  TournamentRegistrationController.getTournamentRegistrations
);

// DELETE /api/registrations/:tournamentId/unregister - Desinscrever usuário
router.delete(
  '/:tournamentId/unregister',
  TournamentRegistrationController.unregisterFromTournament
);

export default router;
