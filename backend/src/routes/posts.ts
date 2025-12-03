import { Router } from 'express';
import { PostController } from '../controllers/PostController.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = Router();

// GET /api/posts - List all posts
router.get('/', authMiddleware, PostController.getPosts);

// POST /api/posts - Create a new post
router.post('/', authMiddleware, PostController.createPost);

export default router;
