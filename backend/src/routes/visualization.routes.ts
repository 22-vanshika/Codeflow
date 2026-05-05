import { Router, Response, Request } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Visualization } from '../models/Visualization';

const router = Router();

// Save a visualization
router.post('/save', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, code, language, traceSteps, isPublic } = req.body;
        
        if (!req.user) {
            res.status(401).json({ message: 'User not found in DB' });
            return;
        }

        const newVis = new Visualization({
            userId: req.user.firebaseUid,
            title,
            description,
            code,
            language,
            traceSteps,
            isPublic
        });

        await newVis.save();
        res.status(201).json({ message: 'Visualization saved successfully', visualization: newVis });
    } catch (error) {
        console.error('Error saving visualization:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's saved visualizations
router.get('/user', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User not found in DB' });
            return;
        }

        // Return without traceSteps to save bandwidth on lists
        const visualizations = await Visualization.find({ userId: req.user.firebaseUid })
            .select('-traceSteps')
            .sort({ createdAt: -1 });
            
        res.json(visualizations);
    } catch (error) {
        console.error('Error fetching visualizations:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific visualization by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const vis = await Visualization.findById(req.params.id);
        if (!vis) {
            res.status(404).json({ message: 'Visualization not found' });
            return;
        }

        // If not public, we should check auth (simplified for now: allow if found)
        // In a real app, requireAuth and check if req.user.firebaseUid === vis.userId
        res.json(vis);
    } catch (error) {
        console.error('Error fetching visualization:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
