import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from './websocket/server';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { PORT } from './config';
import problemRoutes from './routes/problem.route';
import userRoutes from './routes/user.routes';
import visualizationRoutes from './routes/visualization.routes';
import feedbackRoutes from './routes/feedback.routes';
import profileRoutes from './routes/profile.routes';
import dashboardRoutes from './routes/dashboard.routes';
import githubRoutes from './routes/github.routes';
import blogRoutes from './routes/blog.routes';
import docRoutes from './routes/doc.routes';
import notificationRoutes from './routes/notification.routes';
import { connectDB } from './config/db';
import { initFirebaseAdmin } from './config/firebase';

const app = express();

// Security and Optimization Middlewares
app.use(helmet());
app.use(compression());

app.use(cors());
app.use(express.json());

// Initialize DB and Firebase
connectDB();
initFirebaseAdmin();

// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/visualizations', visualizationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/notifications', notificationRoutes);


const server = createServer(app);
const wss = new WebSocketServer({ server });

setupWebSocket(wss);

app.get('/', (req, res) => {
    res.send('Engine Online Backend is running');
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
