import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { VisualizationController } from '../controllers/visualization.controller';

const router = Router();

// Save a new visualization
router.post('/save', requireAuth, VisualizationController.saveVisualization);

// Get user's saved visualizations (simplified summary list, excluding traceSteps)
router.get('/user', requireAuth, VisualizationController.getUserVisualizations);

// Get a specific visualization by ID (includes complete traceSteps)
router.get('/:id', VisualizationController.getVisualizationById);

// Update an existing visualization by ID
router.put('/:id', requireAuth, VisualizationController.updateVisualization);

// Delete a visualization by ID
router.delete('/:id', requireAuth, VisualizationController.deleteVisualization);

// Duplicate an existing visualization by ID
router.post('/:id/duplicate', requireAuth, VisualizationController.duplicateVisualization);

export default router;
