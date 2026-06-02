import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { GithubController } from '../controllers/github.controller';

const router = Router();

// 1. Connect GitHub (Redirect to GitHub OAuth)
router.get('/connect', requireAuth, GithubController.connectGithub);

// 2. Callback from GitHub OAuth
router.get('/callback', GithubController.handleCallback);

// 3. Get User Repositories
router.get('/repos', requireAuth, GithubController.getUserRepos);

// 4. Get Directory Files
router.get('/files', requireAuth, GithubController.getDirectoryFiles);

// 5. Import File Contents
router.post('/import', requireAuth, GithubController.importFile);

export default router;
