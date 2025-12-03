import type { Request, Response } from 'express';
import { PostService } from '../services/PostService.ts';

export class PostController {
  static async getPosts(_req: Request, res: Response) {
    try {
      const posts = await PostService.getPosts();
      res.json({ data: posts, count: posts.length });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch posts';
      res.status(500).json({ error: message });
    }
  }
}
