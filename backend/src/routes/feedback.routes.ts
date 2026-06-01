import { Router, Request, Response } from 'express';
import { Feedback } from '../models/Feedback';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Submit feedback
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { rating, helpedText, improveText, recommend, topicViewed, userId, userName } = req.body;

        if (!rating || !helpedText || recommend === undefined) {
            res.status(400).json({ message: 'Missing required feedback fields' });
            return;
        }

        // Validate rating range
        const ratingVal = Number(rating);
        if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
            res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
            return;
        }

        // Validate word count >= 25 words on helpedText
        const wordCount = helpedText.trim().split(/\s+/).filter(Boolean).length;
        if (wordCount < 25) {
            res.status(400).json({ message: 'Feedback description must be at least 25 words long.' });
            return;
        }

        const feedback = new Feedback({
            rating: ratingVal,
            helpedText,
            improveText,
            recommend: !!recommend,
            topicViewed: topicViewed || 'Algorithm Visualization',
            userId: userId || 'anonymous',
            userName: userName || 'Anonymous User',
            approved: false // Default to false, manually approved for Home testimonials
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch approved feedback for testimonials
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
        res.json({ feedbacks });
    } catch (error) {
        console.error('Error fetching approved feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Alias for approved public feedback
router.get('/public', async (req: Request, res: Response): Promise<void> => {
    try {
        const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
        res.json({ feedbacks });
    } catch (error) {
        console.error('Error fetching approved feedback:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Moderation: Approve or Reject reviews
router.patch('/admin/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { approved } = req.body;

        if (approved === undefined) {
            res.status(400).json({ message: 'Missing approved field in body' });
            return;
        }

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            res.status(404).json({ message: 'Feedback not found' });
            return;
        }

        feedback.approved = !!approved;
        await feedback.save();

        res.json({ message: `Feedback status updated to ${approved ? 'approved' : 'rejected'}`, feedback });
    } catch (error) {
        console.error('Error updating feedback status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

