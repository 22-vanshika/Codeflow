import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Sync user profile after login
router.post('/sync', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, displayName, photoURL, githubAccessToken } = req.body;
        const firebaseUid = req.firebaseUid;

        if (!firebaseUid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        let user = await User.findOne({ firebaseUid });

        if (user) {
            // Update existing user
            user.email = email || user.email;
            user.displayName = displayName || user.displayName;
            user.photoURL = photoURL || user.photoURL;
            if (githubAccessToken) {
                user.githubAccessToken = githubAccessToken;
            }
            await user.save();
        } else {
            // Create new user
            user = new User({
                firebaseUid,
                email,
                displayName,
                photoURL,
                githubAccessToken
            });
            await user.save();
        }

        res.json({ message: 'User synced successfully', user });
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
             res.status(404).json({ message: 'User not found' });
             return;
        }
        res.json(req.user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
