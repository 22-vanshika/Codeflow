export interface StackFrame {
    function: string;
    locals: Record<string, any>;
}

export interface ExecutionTrace {
    line: number;
    type: 'assignment' | 'comparison' | 'function_call' | 'return' | 'loop' | 'condition' | 'init' | 'definition';
    explanation: string;
    stack: StackFrame[];
    heap: Record<string, any>;
}
