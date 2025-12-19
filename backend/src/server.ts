import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from './ws/server';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

setupWebSocket(wss);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
