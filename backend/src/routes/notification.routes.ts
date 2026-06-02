import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

// Get user notifications in reverse chronological order
router.get('/', requireAuth, NotificationController.getUserNotifications);

// Mark notification as read
router.patch('/:id', requireAuth, NotificationController.markAsRead);

export default router;
