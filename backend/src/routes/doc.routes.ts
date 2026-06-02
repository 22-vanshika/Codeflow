import { Router } from 'express';
import { DocController } from '../controllers/doc.controller';

const router = Router();

// Get all docs organized by category or as a list
router.get('/', DocController.getAllDocs);

// Get single doc page by slug
router.get('/:slug', DocController.getDocBySlug);

export default router;
