import { IExecutor } from '../engine/executor.interface';
import { Executor } from '../engine/languages/cpp/executor';
import { ExecutionTrace } from '../types';
import { AiService } from './ai.service';

export class ExecutionService {
    private executor: IExecutor;
    private aiService: AiService;
    private readonly MAX_STEPS = 2000;

    constructor() {
        // In a real app, we might select the executor based on language
        this.executor = new Executor();
        this.aiService = new AiService();
    }

    public async execute(code: string, input: string = ""): Promise<{ traces: ExecutionTrace[], analysis: any, flowchart: string }> {
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
                console.warn("Execution limit exceeded");
                break;
            }
        }

        // Parallel AI analysis
        const [analysis, flowchart] = await Promise.all([
            this.aiService.analyzeCode(code),
            this.aiService.generateFlowchart(code)
        ]);

        return {
            traces,
            analysis,
            flowchart
        };
    }
}
