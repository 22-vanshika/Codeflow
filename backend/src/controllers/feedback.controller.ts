import { Request, Response } from 'express';
import { Feedback } from '../models/Feedback';
import { AuthRequest } from '../middleware/auth';

export class FeedbackController {
    // Submit feedback
    public static async submitFeedback(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { rating, helpedText, improveText, recommend, topicViewed } = req.body;

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
                userId: req.user?.firebaseUid || req.firebaseUid || req.body.userId,
                userName: req.user?.displayName || req.body.userName || 'Verified User',
                approved: true // Auto-approve to show on Home immediately
            });

            await feedback.save();
            res.status(201).json({ message: 'Feedback submitted successfully', feedback });
        } catch (error) {
            console.error('Error saving feedback:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Fetch approved feedback for testimonials
    public static async getApprovedFeedback(req: Request, res: Response): Promise<void> {
        try {
            const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
            res.json({ feedbacks });
        } catch (error) {
            console.error('Error fetching approved feedback:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Admin Moderation: Approve or Reject reviews
    public static async moderateFeedback(req: AuthRequest, res: Response): Promise<void> {
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
    }
}
