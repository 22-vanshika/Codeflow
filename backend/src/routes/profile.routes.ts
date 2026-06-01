import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

// Get profile details
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const firebaseUid = req.firebaseUid;
        const user = await User.findOne({ firebaseUid });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            user: {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                bio: user.bio || '',
                githubUrl: user.githubUrl || '',
                linkedinUrl: user.linkedinUrl || '',
                portfolioUrl: user.portfolioUrl || '',
                streak: user.streak || 0,
                lastActiveDate: user.lastActiveDate,
                activityLogs: user.activityLogs || []
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update profile details
router.patch('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const firebaseUid = req.firebaseUid;
        const { displayName, bio, githubUrl, linkedinUrl, portfolioUrl, photoURL } = req.body;

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (displayName !== undefined) user.displayName = displayName;
        if (bio !== undefined) user.bio = bio;
        if (githubUrl !== undefined) user.githubUrl = githubUrl;
        if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
        if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
        if (photoURL !== undefined) user.photoURL = photoURL;

        // Log recent activity for updating profile settings
        user.activityLogs.unshift({
            title: 'Updated profile settings',
            type: 'profile_update',
            createdAt: new Date()
        });

        // Limit activity logs to top 20 items to prevent unbounded array growth
        if (user.activityLogs.length > 20) {
            user.activityLogs = user.activityLogs.slice(0, 20);
        }

        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Avatar upload (supporting both direct file, base64 data, or public URLs)
router.post('/avatar', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { avatarUrl } = req.body;

        if (!avatarUrl) {
            res.status(400).json({ message: 'Missing avatar URL' });
            return;
        }

        const firebaseUid = req.firebaseUid;
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Save avatar url to database
        user.photoURL = avatarUrl;
        
        user.activityLogs.unshift({
            title: 'Updated profile avatar',
            type: 'avatar_update',
            createdAt: new Date()
        });
        if (user.activityLogs.length > 20) {
            user.activityLogs = user.activityLogs.slice(0, 20);
        }

        await user.save();

        res.json({
            message: 'Avatar updated successfully',
            photoURL: avatarUrl
        });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
