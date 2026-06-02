import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { BlogController } from '../controllers/blog.controller';

const router = Router();

// 1. Get all blogs & interview experiences
router.get('/', BlogController.getAllBlogs);

// 2. Search blogs by query/tag/company
router.get('/search', BlogController.searchBlogs);

// 3. Get single blog by slug
router.get('/:slug', BlogController.getBlogBySlug);

// 4. Toggle bookmark for blog (using id or slug)
router.post('/bookmark', requireAuth, BlogController.toggleBookmark);

// Alternative RESTful bookmark route by ID
router.post('/:id/bookmark', requireAuth, BlogController.toggleBookmarkById);

// 5. Create new blog or interview experience
router.post('/', requireAuth, BlogController.createBlog);

export default router;
