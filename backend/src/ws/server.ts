import { WebSocketServer, WebSocket } from 'ws';
import { Executor } from '../languages/cpp/executor';
import { ExecutionTrace } from '../types';

interface Message {
    type: string;
    payload?: any;
}

export function setupWebSocket(wss: WebSocketServer) {
    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected');

        ws.on('message', async (message: string) => {
            try {
                const msg: Message = JSON.parse(message.toString());

                if (msg.type === 'EXECUTE') {
                    // Support legacy string payload or new object payload
                    let code = "";
                    let input = "";

                    if (typeof msg.payload === 'string') {
                        code = msg.payload;
                    } else {
                        code = msg.payload.code || "";
                        input = msg.payload.input || "";
                    }

                    console.log(`Executing code length: ${code.length}, Input length: ${input.length}`);

                    try {
                        const executor = new Executor();
                        const generator = executor.execute(code, input);
                        const traces: ExecutionTrace[] = [];
                        let i = 0;
                        const MAX_STEPS = 2000;

                        for (const trace of generator) {
                            traces.push(trace);
                            i++;
                            if (i > MAX_STEPS) {
                                ws.send(JSON.stringify({ type: 'ERROR', payload: 'Execution limit exceeded (Infinite Loop?)' }));
                                return;
                            }
                        }

                        // Send all traces at once for now? Or stream?
                        // Streaming is cooler, but "Play" usually needs full trace or buffered.
                        // Let's send a TRACE_BATCH or just one by one.
                        // Sending one by one might overwhelm if too fast, but this is local.
                        // Better: Send 'EXECUTION_RESULT' with full array.

                        ws.send(JSON.stringify({
                            type: 'EXECUTION_RESULT',
                            payload: traces
                        }));

                    } catch (execError: any) {
                        console.error('Execution Error:', execError);
                        ws.send(JSON.stringify({ type: 'ERROR', payload: execError.message }));
                    }
                }
            } catch (e) {
                console.error('WS Error:', e);
            }
        });
    });
}
