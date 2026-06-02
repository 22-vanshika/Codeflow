import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Visualization } from '../models/Visualization';
import { recordUserActivity } from '../services/activity';

export class VisualizationController {
    // Save a new visualization
    public static async saveVisualization(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { title, description, code, language, traceSteps, isPublic, settings, metadata } = req.body;
            
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
                isPublic,
                settings,
                metadata
            });

            await newVis.save();
            await recordUserActivity(req.user);
            res.status(201).json({ message: 'Visualization saved successfully', visualization: newVis });
        } catch (error) {
            console.error('Error saving visualization:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Get user's saved visualizations (simplified summary list, excluding traceSteps)
    public static async getUserVisualizations(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not found in DB' });
                return;
            }

            const visualizations = await Visualization.find({ userId: req.user.firebaseUid })
                .select('-traceSteps')
                .sort({ updatedAt: -1 }); // Default to last updated first
                
            res.json(visualizations);
        } catch (error) {
            console.error('Error fetching visualizations:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Get a specific visualization by ID (includes complete traceSteps)
    public static async getVisualizationById(req: Request, res: Response): Promise<void> {
        try {
            const vis = await Visualization.findById(req.params.id);
            if (!vis) {
                res.status(404).json({ message: 'Visualization not found' });
                return;
            }
            res.json(vis);
        } catch (error) {
            console.error('Error fetching visualization:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Update an existing visualization by ID
    public static async updateVisualization(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not found in DB' });
                return;
            }

            const vis = await Visualization.findById(req.params.id);
            if (!vis) {
                res.status(404).json({ message: 'Visualization not found' });
                return;
            }

            // Verify ownership
            if (vis.userId !== req.user.firebaseUid) {
                res.status(403).json({ message: 'Forbidden: You do not own this visualization' });
                return;
            }

            const { title, description, code, language, traceSteps, isPublic, settings, metadata } = req.body;

            if (title !== undefined) vis.title = title;
            if (description !== undefined) vis.description = description;
            if (code !== undefined) vis.code = code;
            if (language !== undefined) vis.language = language;
            if (traceSteps !== undefined) vis.traceSteps = traceSteps;
            if (isPublic !== undefined) vis.isPublic = isPublic;
            if (settings !== undefined) vis.settings = settings;
            if (metadata !== undefined) vis.metadata = metadata;

            await vis.save();
            res.json({ message: 'Visualization updated successfully', visualization: vis });
        } catch (error) {
            console.error('Error updating visualization:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Delete a visualization by ID
    public static async deleteVisualization(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not found in DB' });
                return;
            }

            const vis = await Visualization.findById(req.params.id);
            if (!vis) {
                res.status(404).json({ message: 'Visualization not found' });
                return;
            }

            // Verify ownership
            if (vis.userId !== req.user.firebaseUid) {
                res.status(403).json({ message: 'Forbidden: You do not own this visualization' });
                return;
            }

            await vis.deleteOne();
            res.json({ message: 'Visualization deleted successfully' });
        } catch (error) {
            console.error('Error deleting visualization:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Duplicate an existing visualization by ID
    public static async duplicateVisualization(req: AuthRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not found in DB' });
                return;
            }

            const vis = await Visualization.findById(req.params.id);
            if (!vis) {
                res.status(404).json({ message: 'Visualization not found' });
                return;
            }

            // Create duplicate (copying all fields, renaming title, assigning new userId)
            const duplicateVis = new Visualization({
                userId: req.user.firebaseUid,
                title: `${vis.title} (Copy)`,
                description: vis.description,
                code: vis.code,
                language: vis.language,
                traceSteps: vis.traceSteps,
                isPublic: vis.isPublic,
                settings: vis.settings,
                metadata: vis.metadata
            });

            await duplicateVis.save();
            res.status(201).json({ message: 'Visualization duplicated successfully', visualization: duplicateVis });
        } catch (error) {
            console.error('Error duplicating visualization:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}
