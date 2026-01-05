// Trace types for step-by-step execution visualization

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

export interface LinkedListVisual {
    type: 'linked_list';
    nodes: { value: any; id: string }[];
    currentNodeId?: string;
    highlightEdge?: [string, string];
}

export interface TreeVisual {
    type: 'tree';
    nodes: { value: any; id: string; parentId?: string }[];
    currentNodeId?: string;
}

export interface CallStackVisual {
    type: 'call_stack';
    frames: { functionName: string; args: Record<string, any>; returnValue?: any }[];
    activeFrame: number;
}

export type VisualInstruction = ArrayVisual | LinkedListVisual | TreeVisual | CallStackVisual;

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
    output?: string;
}

// Pattern detection helpers
export const ALGORITHM_PATTERNS: Record<string, PatternInfo> = {
    'two-pointer': {
        name: 'Two-Pointer',
        description: 'Uses two pointers moving towards each other or in the same direction',
        color: '#f59e0b'
    },
    'sliding-window': {
        name: 'Sliding Window',
        description: 'Maintains a window of elements that slides over the data',
        color: '#8b5cf6'
    },
    'binary-search': {
        name: 'Binary Search',
        description: 'Divides search space in half each iteration',
        color: '#ec4899'
    },
    'recursion': {
        name: 'Recursion',
        description: 'Function calls itself to solve smaller subproblems',
        color: '#06b6d4'
    },
    'linear-traversal': {
        name: 'Linear Traversal',
        description: 'Iterates through data structure once',
        color: '#22c55e'
    },
    'divide-conquer': {
        name: 'Divide & Conquer',
        description: 'Breaks problem into smaller subproblems, solves, and combines',
        color: '#f43f5e'
    }
};
