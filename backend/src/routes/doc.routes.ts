import { Router, Response, Request } from 'express';
import { Doc } from '../models/Doc';

const router = Router();

// Get all docs organized by category or as a list
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const docs = await Doc.find({}).sort({ category: 1, createdAt: 1 });
        res.json({ docs });
    } catch (error) {
        console.error('Error fetching documentation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single doc page by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const doc = await Doc.findOne({ slug });

        if (!doc) {
            res.status(404).json({ message: 'Documentation page not found' });
            return;
        }

        res.json({ doc });
    } catch (error) {
        console.error('Error fetching doc page:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
