export interface StackFrame {
    function: string;
    locals: Record<string, any>;
}

// Three-part beginner explanation for each step
export interface VisualizationExplanation {
    what: string;   // What just happened
    why: string;    // Why it happened
    next: string;   // What will be checked next
}

// Visualization hints for step-by-step animation
export interface VisualizationHint {
    nodeId: string;                     // Current flowchart node
    pathTaken?: 'true' | 'false';       // For conditions - which branch taken
    loopIteration?: number;             // For loops - which iteration
    dataStructureOp?: {
        type: 'push' | 'pop' | 'insert' | 'remove' | 'access' | 'update';
        target: string;                 // Variable name
        value?: any;
        index?: number;
    };
    explanation: VisualizationExplanation;
}

export interface ExecutionTrace {
    line: number;
    type: 'definition' | 'assignment' | 'return' | 'condition' | 'function_call' | 'error' | 'output' | 'loop_start' | 'loop_continue' | 'loop_end';
    explanation: string;
    stack: StackFrame[];
    heap: Record<string, any>;
    output?: string;
    visualization?: VisualizationHint;
}

export interface AlgorithmAnalysis {
    title: string;
    complexity: string;
    pattern: string;
    explanation: Record<string, string>;
    overview: string;
}

// Flowchart node metadata for visualization
export interface FlowchartNodeMetadata {
    type: 'decision' | 'loop' | 'process' | 'data_structure' | 'call' | 'return' | 'start' | 'end' | 'merge';
    branches?: { label: string; targetNodeId: string }[];
    dataStructure?: 'stack' | 'queue' | 'array' | 'linkedlist' | 'tree' | 'graph' | 'dp' | 'map';
    condition?: string;
}

export interface FlowchartData {
    markdown: string;
    mapping: Record<string, string>;                    // line -> nodeId
    nodeMetadata: Record<string, FlowchartNodeMetadata>;
    executionOrder: string[];
}

export interface RunResult {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
}

export interface ExecutionResult {
    traces: ExecutionTrace[];
    analysis: AlgorithmAnalysis;
    flowchart: string | FlowchartData;
}

// =====================================================
// Blackboard-Style Trace Types for Step-by-Step Visualization
// =====================================================

export interface PointerVisual {
    name: string;           // e.g., "L", "R", "i", "j"
    index: number;
    color: 'red' | 'blue' | 'green' | 'orange' | 'purple';
    action: 'static' | 'move' | 'highlight';
}

export interface ArrayVisual {
    type: 'array_1d';
    target: string;         // Variable name
    values: any[];
    pointers: PointerVisual[];
    highlightIndices?: number[];
    swapIndices?: [number, number];
}

export interface CallStackVisual {
    type: 'call_stack';
    frames: { functionName: string; args: Record<string, any>; returnValue?: any }[];
    activeFrame: number;
}

export type VisualInstruction = ArrayVisual | CallStackVisual;

export interface PatternInfo {
    name: string;           // e.g., "Two-Pointer", "Sliding Window"
    description: string;
    color: string;          // For UI badge
}

export interface TeacherNote {
    what: string;           // What just happened
    why: string;            // Why it matters
    next: string;           // What will be checked next
}

export interface TraceStep {
    step: number;
    line: number;
    lineContent: string;
    pattern?: PatternInfo;
    variables: Record<string, any>;
    visuals?: VisualInstruction;
    teacherNote: TeacherNote;
    type: 'assignment' | 'condition' | 'loop_start' | 'loop_continue' | 'loop_end' | 'function_call' | 'return' | 'comparison';
}

export interface TraceResult {
    success: boolean;
    steps: TraceStep[];
    pattern?: PatternInfo;
    totalSteps: number;
    error?: string;
}
