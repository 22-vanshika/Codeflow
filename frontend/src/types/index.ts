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
        isRejected?: boolean;
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
    visuals?: any;
    assignmentDetail?: any;
}

export interface ComplexityBreakdownItem {
    operation: string;
    complexity: string;
}

export interface SpaceBreakdownItem {
    structure: string;
    complexity: string;
}

export interface LearningModeDetails {
    bruteForce: {
        time: string;
        space: string;
        explanation?: string;
    };
    optimized: {
        time: string;
        space: string;
        explanation?: string;
    };
    improvement: string;
    optimizationReason: string;
}

export interface ComplexityDetectionDetail {
    title: string;
    detectedType: string;
    codeSnippet: string;
    complexity: string;
    explanation: string;
    visualTree?: string[];
}

export interface AlgorithmAnalysis {
    title: string;
    timeComplexity: string;
    spaceComplexity: string;
    complexityExplanation?: string;
    pattern: string;
    explanation: Record<string, string>;
    overview: string;
    timeBreakdown?: ComplexityBreakdownItem[];
    spaceBreakdown?: SpaceBreakdownItem[];
    stepExplanations?: string[];
    detections?: ComplexityDetectionDetail[];
    learningMode?: LearningModeDetails;
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
    windowRange?: [number, number];
}

export interface CallStackVisual {
    type: 'call_stack';
    frames: { functionName: string; args: Record<string, any>; returnValue?: any }[];
    activeFrame: number;
}

export interface TreeVisual {
    type: 'tree';
    nodes: { value: any; id: string; parentId?: string }[];
    currentNodeId?: string;
    activeNodes?: string[];
    visitedNodes?: string[];
    pointers?: { name: string; nodeId: string; color: string }[];
}

export interface LinkedListVisual {
    type: 'linked_list';
    target: string;
    nodes: { id: string; value: any; next?: string | null; prev?: string | null }[];
    pointers: { name: string; nodeId: string; color: string }[];
    hasCycle?: boolean;
    cycleStartId?: string;
}

export interface GraphNode {
    id: string;
    value: any;
    label?: string;
}

export interface GraphEdge {
    from: string;
    to: string;
    label?: string;
    directed?: boolean;
    weight?: number;
}

export interface GraphVisual {
    type: 'graph';
    nodes: GraphNode[];
    edges: GraphEdge[];
    activeNodes?: string[];
    visitedNodes?: string[];
    activeEdges?: {from: string, to: string}[];
    adjacencyList?: Record<string, string[]>;
}

export interface StackQueueVisual {
    type: 'stack' | 'queue';
    target: string;
    elements: any[];
    pointers?: {name: string, index: number, color?: string}[];
    activeIndices?: number[];
}

export interface HashMapVisual {
    type: 'hash_map';
    target: string;
    entries: { key: any; value: any }[];
    activeKeys?: any[];
}

export type VisualInstruction = ArrayVisual | TreeVisual | GraphVisual | StackQueueVisual | CallStackVisual | HashMapVisual;

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
    assignmentDetail?: any;
}

export interface TraceResult {
    success: boolean;
    steps: TraceStep[];
    pattern?: PatternInfo;
    totalSteps: number;
    error?: string;
    output?: string;
    analysis?: AlgorithmAnalysis;
}
