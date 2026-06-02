import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

// Get dashboard statistics
router.get('/', requireAuth, DashboardController.getDashboardStats);

export default router;
