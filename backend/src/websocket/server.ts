import { WebSocketServer, WebSocket } from 'ws';
import { ExecutionController } from '../controllers/execution.controller';

export function setupWebSocket(wss: WebSocketServer) {
    const controller = new ExecutionController();

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');

        ws.on('message', (message: string) => {
            controller.handleMessage(ws, message.toString());
        });
    });
}
