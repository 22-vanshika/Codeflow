import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { UserController } from '../controllers/user.controller';

const router = Router();

// Sync user profile after login
router.post('/sync', requireAuth, UserController.syncUser);

// Get user DSA progress
router.get('/progress', requireAuth, UserController.getProgress);

// Update user DSA progress
router.post('/progress', requireAuth, UserController.updateProgress);

export default router;
