import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/tournaments
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'List tournaments' });
});

// POST /api/tournaments
router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Tournament created' });
});

// GET /api/tournaments/:id
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ message: `Get tournament ${id}` });
});

export default router;
