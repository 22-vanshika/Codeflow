import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from './websocket/server';
import cors from 'cors';
import { PORT } from './config';

const app = express();
app.use(cors());
app.use(express.json());

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
