// @ts-nocheck
import type { Request, Response } from 'express';
import { PostService } from '../services/PostService';

interface CreatePostRequest extends Request {
    userId?: number;
  }

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



  static async createPost(req: CreatePostRequest, res: Response) {
    try {
      const { contentText, imageUrl } = req.body;
      const { userId } = req;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const newPost = await PostService.createPost({ contentText, imageUrl, userId });
      res.status(201).json(newPost);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      res.status(500).json({ error: message });
    }
  }
}
