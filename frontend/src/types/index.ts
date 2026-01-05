export interface StackFrame {
    function: string;
    locals: Record<string, any>;
}

export interface ExecutionTrace {
    line: number;
    type: string;
    explanation: string;
    stack: StackFrame[];
    heap: Record<string, any>;
    output?: string;
}

export interface AlgorithmAnalysis {
    title: string;
    complexity: string;
    pattern: string;
    explanation: Record<string, string>;
    overview: string;
}

export interface ExecutionResult {
    traces: ExecutionTrace[];
    analysis: AlgorithmAnalysis;
    flowchart: string;
}
