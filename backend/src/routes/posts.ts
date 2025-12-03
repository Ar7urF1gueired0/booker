import { Router } from 'express';
import { PostController } from '../controllers/PostController.ts';

const router = Router();

// GET /api/posts - List all posts
router.get('/', PostController.getPosts);

export default router;
