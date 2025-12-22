import { IExecutor } from '../engine/executor.interface';
import { Executor } from '../engine/languages/cpp/executor';
import { ExecutionTrace } from '../types';

export class ExecutionService {
    private executor: IExecutor;
    private readonly MAX_STEPS = 2000;

    constructor() {
        // In a real app, we might select the executor based on language
        this.executor = new Executor();
    }

    public execute(code: string, input: string = ""): ExecutionTrace[] {
        if (!code || code.trim().length === 0) {
            throw new Error("Code cannot be empty");
        }

        const generator = this.executor.execute(code, input);
        const traces: ExecutionTrace[] = [];
        let i = 0;

        for (const trace of generator) {
            traces.push(trace);
            i++;
            if (i > this.MAX_STEPS) {
                // We could throw or just return truncated
                console.warn("Execution limit exceeded");
                // Add a special trace or just return what we have?
                // For now, let's append an error-like trace explanation or handled by frontend
                break;
            }
        }

        return traces;
    }
}
