import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { ProfileController } from '../controllers/profile.controller';

const router = Router();

// Get profile details
router.get('/', requireAuth, ProfileController.getProfile);

// Update profile details
router.patch('/', requireAuth, ProfileController.updateProfile);

// Avatar upload (supporting both direct file, base64 data, or public URLs)
router.post('/avatar', requireAuth, ProfileController.updateAvatar);

export default router;
