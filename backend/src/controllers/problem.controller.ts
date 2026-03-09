import { Request, Response } from 'express';
import { ProblemService } from '../services/problem.service';

const problemService = new ProblemService();

export class ProblemController {
    public static async importProblem(req: Request, res: Response): Promise<void> {
        try {
            const { url } = req.body;

            if (!url) {
                res.status(400).json({ success: false, error: 'URL is required' });
                return;
            }

            if (!url.includes('leetcode.com/problems/')) {
                 res.status(400).json({ success: false, error: 'Only LeetCode problem URLs are supported currently.' });
                 return;
            }

            const problemData = await problemService.fetchFromLeetCode(url);
            res.json({ success: true, data: problemData });

        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}
