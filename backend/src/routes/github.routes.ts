import { Router, Response, Request } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import axios from 'axios';

const router = Router();

// 1. Connect GitHub (Redirect to GitHub OAuth)
router.get('/connect', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:5000/api/github/callback';
        
        // Save user UID in session state if we want, or pass it as state parameter in OAuth
        const state = req.firebaseUid; 

        if (!clientId) {
            // No CLIENT_ID in env? Fallback to mock integration instantly
            console.log('GitHub Client ID not set. Redirecting to mock callback.');
            res.redirect(`${redirectUri}?code=mock_code_12345&state=${state}`);
            return;
        }

        const oauthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user&state=${state}`;
        res.redirect(oauthUrl);
    } catch (error) {
        console.error('Error in GitHub connect:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. Callback from GitHub OAuth
router.get('/callback', async (req: Request, res: Response): Promise<void> => {
    try {
        const { code, state } = req.query;
        const firebaseUid = state as string;

        if (!code || !firebaseUid) {
            res.status(400).send('Missing code or state');
            return;
        }

        let accessToken = 'mock_github_access_token_xyz';

        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;

        if (clientId && clientSecret && code !== 'mock_code_12345') {
            // Exchange code for real access token
            const tokenResponse = await axios.post(
                'https://github.com/login/oauth/access_token',
                {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code,
                },
                {
                    headers: { Accept: 'application/json' },
                }
            );
            accessToken = tokenResponse.data.access_token || accessToken;
        }

        // Save token to user profile
        const user = await User.findOne({ firebaseUid });
        if (user) {
            user.githubAccessToken = accessToken;
            user.activityLogs.unshift({
                title: 'Connected GitHub account 🔗',
                type: 'github_connect',
                createdAt: new Date()
            });
            await user.save();
        }

        // Redirect back to frontend profile settings page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/profile-settings?github=connected`);
    } catch (error) {
        console.error('Error in GitHub callback:', error);
        res.status(500).send('Authentication failed');
    }
});

// 3. Get User Repositories
router.get('/repos', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const firebaseUid = req.firebaseUid;
        const user = await User.findOne({ firebaseUid });

        if (!user || !user.githubAccessToken) {
            res.status(400).json({ message: 'GitHub not connected' });
            return;
        }

        if (user.githubAccessToken === 'mock_github_access_token_xyz') {
            // Return mock repositories
            res.json({
                repos: [
                    { id: 1, name: 'codeflow-algorithms', fullName: 'user/codeflow-algorithms', description: 'Sample algorithm implementations.' },
                    { id: 2, name: 'leetcode-solutions', fullName: 'user/leetcode-solutions', description: 'Solutions for popular coding problems.' },
                    { id: 3, name: 'data-structures-cpp', fullName: 'user/data-structures-cpp', description: 'C++ tree, graph, and list containers.' }
                ]
            });
            return;
        }

        // Fetch real repositories from GitHub API
        const reposResponse = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: {
                Authorization: `token ${user.githubAccessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        const repos = reposResponse.data.map((r: any) => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            description: r.description
        }));

        res.json({ repos });
    } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ message: 'Failed to fetch repositories' });
    }
});

// 4. Get Directory Files
router.get('/files', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { repo, path = '' } = req.query;
        if (!repo) {
            res.status(400).json({ message: 'Missing repo parameter' });
            return;
        }

        const firebaseUid = req.firebaseUid;
        const user = await User.findOne({ firebaseUid });

        if (!user || !user.githubAccessToken) {
            res.status(400).json({ message: 'GitHub not connected' });
            return;
        }

        if (user.githubAccessToken === 'mock_github_access_token_xyz') {
            // Return mock files
            res.json({
                files: [
                    { name: 'quicksort.cpp', path: 'quicksort.cpp', type: 'file' },
                    { name: 'binary_search.cpp', path: 'binary_search.cpp', type: 'file' },
                    { name: 'lru_cache.cpp', path: 'lru_cache.cpp', type: 'file' },
                    { name: 'helpers', path: 'helpers', type: 'dir' }
                ]
            });
            return;
        }

        // Fetch files from real GitHub API
        const filesResponse = await axios.get(`https://api.github.com/repos/${repo}/contents/${path}`, {
            headers: {
                Authorization: `token ${user.githubAccessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        const files = filesResponse.data.map((f: any) => ({
            name: f.name,
            path: f.path,
            type: f.type // 'file' or 'dir'
        }));

        res.json({ files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ message: 'Failed to fetch directory tree' });
    }
});

// 5. Import File Contents
router.post('/import', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { repo, path } = req.body;
        if (!repo || !path) {
            res.status(400).json({ message: 'Missing repo or path' });
            return;
        }

        const firebaseUid = req.firebaseUid;
        const user = await User.findOne({ firebaseUid });

        if (!user || !user.githubAccessToken) {
            res.status(400).json({ message: 'GitHub not connected' });
            return;
        }

        if (user.githubAccessToken === 'mock_github_access_token_xyz') {
            // Return mock code contents
            let content = `// Starter code imported from GitHub: ${path}\n#include <iostream>\nusing namespace std;\n\nvoid solve() {\n    // Write your code here\n}\n\nint main() {\n    solve();\n    return 0;\n}`;
            if (path.includes('quicksort')) {
                content = `// QuickSort imported from GitHub\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid quickSort(vector<int>& arr, int low, int high) {\n    // Implement quicksort partition\n}`;
            } else if (path.includes('binary_search')) {
                content = `// Binary Search imported from GitHub\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& arr, int target) {\n    int low = 0, high = arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}`;
            }

            res.json({ content });
            return;
        }

        // Fetch file content from real GitHub API
        const fileResponse = await axios.get(`https://api.github.com/repos/${repo}/contents/${path}`, {
            headers: {
                Authorization: `token ${user.githubAccessToken}`,
                Accept: 'application/vnd.github.v3.raw'
            }
        });

        res.json({ content: fileResponse.data });
    } catch (error) {
        console.error('Error importing file:', error);
        res.status(500).json({ message: 'Failed to import file content' });
    }
});

export default router;
