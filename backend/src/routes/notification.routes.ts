import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';

const router = Router();

// Get user notifications in reverse chronological order
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const firebaseUid = req.firebaseUid;
        const notifications = await Notification.find({ userId: firebaseUid }).sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark notification as read
router.patch('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const firebaseUid = req.firebaseUid;

        const notification = await Notification.findOne({ _id: id, userId: firebaseUid });
        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        notification.read = true;
        await notification.save();

        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
