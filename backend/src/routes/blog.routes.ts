import { Router, Response, Request } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Blog } from '../models/Blog';

const router = Router();

// 1. Get all blogs & interview experiences
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json({ blogs });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. Search blogs by query/tag/company
router.get('/search', async (req: Request, res: Response): Promise<void> => {
    try {
        const { query, tag, company, category } = req.query;
        const filter: any = {};

        if (category) {
            filter.category = category;
        }
        if (company) {
            filter.company = new RegExp(company as string, 'i');
        }
        if (tag) {
            filter.tags = tag;
        }
        if (query) {
            filter.$or = [
                { title: new RegExp(query as string, 'i') },
                { excerpt: new RegExp(query as string, 'i') },
                { content: new RegExp(query as string, 'i') }
            ];
        }

        const blogs = await Blog.find(filter).sort({ createdAt: -1 });
        res.json({ blogs });
    } catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Get single blog by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            res.status(404).json({ message: 'Blog post not found' });
            return;
        }

        res.json({ blog });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 4. Toggle bookmark for blog (using id or slug)
router.post('/bookmark', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { blogId, slug } = req.body;
        const firebaseUid = req.firebaseUid;

        if (!firebaseUid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!blogId && !slug) {
            res.status(400).json({ message: 'Missing blogId or slug' });
            return;
        }

        const query = blogId ? { _id: blogId } : { slug };
        const blog = await Blog.findOne(query);

        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }

        const bookmarkedIndex = blog.bookmarks.indexOf(firebaseUid);
        let bookmarked = false;

        if (bookmarkedIndex > -1) {
            // Remove bookmark
            blog.bookmarks.splice(bookmarkedIndex, 1);
        } else {
            // Add bookmark
            blog.bookmarks.push(firebaseUid);
            bookmarked = true;
        }

        await blog.save();

        res.json({
            message: bookmarked ? 'Blog bookmarked' : 'Bookmark removed',
            bookmarked,
            bookmarksCount: blog.bookmarks.length
        });
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Alternative RESTful bookmark route by ID
router.post('/:id/bookmark', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const firebaseUid = req.firebaseUid;

        if (!firebaseUid) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            res.status(404).json({ message: 'Blog not found' });
            return;
        }

        const bookmarkedIndex = blog.bookmarks.indexOf(firebaseUid);
        let bookmarked = false;

        if (bookmarkedIndex > -1) {
            blog.bookmarks.splice(bookmarkedIndex, 1);
        } else {
            blog.bookmarks.push(firebaseUid);
            bookmarked = true;
        }

        await blog.save();

        res.json({
            message: bookmarked ? 'Blog bookmarked' : 'Bookmark removed',
            bookmarked
        });
    } catch (error) {
        console.error('Error toggling bookmark by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 5. Create new blog or interview experience
router.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, excerpt, content, category, company, sourceUrl } = req.body;

        if (!title || !excerpt || !content) {
            res.status(400).json({ message: 'Title, excerpt, and content are required' });
            return;
        }

        const user = req.user;
        const authorName = user?.displayName || user?.email?.split('@')[0] || 'Member';
        const initials = authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'M';

        // Helper to generate slug
        let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        if (!baseSlug) baseSlug = 'post';
        const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

        // Calculate read time
        const wordCount = content.split(/\s+/).length;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        // Pick random gradient
        const gradients = [
            'from-primary/20 via-accent-cyan/10 to-transparent',
            'from-secondary/20 via-accent-purple/10 to-transparent',
            'from-accent-orange/20 via-accent-red/10 to-transparent',
            'from-accent-green/20 via-accent-cyan/10 to-transparent'
        ];
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];

        const date = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        const newBlog = new Blog({
            slug,
            title,
            excerpt,
            content,
            date,
            readTime,
            author: authorName,
            authorInitials: initials,
            gradient,
            category: category || 'Tutorial',
            company,
            sourceUrl
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
