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

// Get user DSA progress
router.get('/progress', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const firebaseUid = req.firebaseUid;
        console.log('[GET /progress] Fetching for UID:', firebaseUid);
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            console.warn('[GET /progress] User not found in DB for UID:', firebaseUid);
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const progressObj = Object.fromEntries(user.progress || new Map());
        console.log('[GET /progress] Success. Items found:', Object.keys(progressObj).length);
        res.json({ progress: progressObj });
    } catch (error) {
        console.error('[GET /progress] Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user DSA progress
router.post('/progress', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const firebaseUid = req.firebaseUid;
        const { progress } = req.body;
        console.log('[POST /progress] Updating for UID:', firebaseUid, 'Items:', Object.keys(progress || {}).length);
        
        if (!progress || typeof progress !== 'object') {
            res.status(400).json({ message: 'Invalid progress data' });
            return;
        }

        let user = await User.findOne({ firebaseUid });
        if (!user) {
            console.warn('[POST /progress] User not found for UID:', firebaseUid);
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Update Map correctly for Mongoose
        user.progress = new Map(Object.entries(progress));
        await user.save();

        console.log('[POST /progress] Successfully saved.');
        res.json({ message: 'Progress updated', progress: Object.fromEntries(user.progress) });
    } catch (error) {
        console.error('[POST /progress] Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
