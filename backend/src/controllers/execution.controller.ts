import { WebSocket } from 'ws';
import { ExecutionService } from '../services/execution.service';
import { ExecutionRequest, ExecutionResponse } from '../types';

export class ExecutionController {
    private executionService: ExecutionService;

    constructor() {
        this.executionService = new ExecutionService();
    }

    public handleMessage(ws: WebSocket, message: string) {
        try {
            const msg = JSON.parse(message);

            if (msg.type === 'EXECUTE') {
                this.handleExecute(ws, msg.payload);
            }
        } catch (e) {
            console.error('Error handling message:', e);
            this.sendError(ws, 'Invalid message format');
        }
    }

    private handleExecute(ws: WebSocket, payload: any) {
        try {
            let code = "";
            let input = "";

            if (typeof payload === 'string') {
                code = payload;
            } else {
                code = payload.code || "";
                input = payload.input || "";
            }

            console.log(`Executing code length: ${code.length}`);

            const traces = this.executionService.execute(code, input);

            const response: ExecutionResponse = {
                type: 'EXECUTION_RESULT',
                payload: traces
            };

            ws.send(JSON.stringify(response));

        } catch (e: any) {
            console.error('Execution Error:', e);
            this.sendError(ws, e.message || 'Execution failed');
        }
    }

    private sendError(ws: WebSocket, message: string) {
        const response: ExecutionResponse = {
            type: 'ERROR',
            payload: message
        };
        ws.send(JSON.stringify(response));
    }
}
