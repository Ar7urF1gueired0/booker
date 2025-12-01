import { Router } from 'express';
import { UserController } from '../controllers/UserController.ts';

const router = Router();

// GET /api/users - List all users
router.get('/', UserController.getUsers);

// POST /api/users - Create a new user
router.post('/', UserController.createUser);

// GET /api/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// GET /api/users/email/:email - Get user by email
router.get('/email/:email', UserController.getUserByEmail);

// PUT /api/users/:id - Update user
router.put('/:id', UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

export default router;
