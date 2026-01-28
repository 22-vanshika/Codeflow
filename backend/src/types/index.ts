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
    explanation: {
        what: string;                   // What just happened
        why: string;                    // Why it happened  
        next: string;                   // What will be checked next
    };
}

export interface RunResult {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
}

export interface ExecutionTrace {
    line: number;
    type: 'definition' | 'assignment' | 'return' | 'condition' | 'function_call' | 'error' | 'output' | 'loop_start' | 'loop_continue' | 'loop_end';
    stack: StackFrame[];
    heap: Record<string, any>;
    output?: string;
    explanation?: string;
    visualization?: VisualizationHint;  // Enhanced visualization data
}

export interface StackFrame {
    function: string;
    locals: Record<string, any>;
}

export interface ExecutionRequest {
    code: string;
    input?: string;
    language?: string;
}

// Flowchart node metadata for visualization
export interface FlowchartNodeMetadata {
    type: 'decision' | 'loop' | 'process' | 'data_structure' | 'call' | 'return' | 'start' | 'end' | 'merge';
    branches?: { label: string; targetNodeId: string }[];
    dataStructure?: 'stack' | 'queue' | 'array' | 'linkedlist' | 'tree' | 'graph' | 'dp' | 'map';
    condition?: string;     // For decision/loop nodes
}

export interface FlowchartData {
    markdown: string;
    mapping: Record<string, string>;                    // line -> nodeId
    nodeMetadata: Record<string, FlowchartNodeMetadata>; // nodeId -> metadata
    executionOrder: string[];                           // nodeIds in order they can be visited
}

export interface ExecutionResultPayload {
    traces: ExecutionTrace[];
    analysis?: {
        title: string;
        timeComplexity: string;
        spaceComplexity: string;
        complexityExplanation?: string;
        pattern: string;
        explanation: Record<string, string>;
        overview: string;
    };
    flowchart?: string | FlowchartData;
}

export interface ExecutionResponse {
    type: 'EXECUTION_RESULT' | 'ERROR' | 'VALIDATION_RESULT' | 'RUN_RESULT';
    payload: ExecutionResultPayload | string | ValidationPayload | RunResult;
}

// Validation types for auto-fix protocol
export interface ValidationPayload {
    isValid: boolean;
    canAutoFix: boolean;
    issues: ValidationIssue[];
    fixedCode?: string;
    fixExplanations?: FixExplanation[];
    complexityWarning?: string;
}

export interface ValidationIssue {
    type: 'syntax' | 'missing_main' | 'missing_header' | 'infinite_loop' | 'infinite_recursion' | 'undefined_behavior' | 'runtime_risk';
    severity: 'error' | 'warning' | 'info';
    line?: number;
    message: string;
    beginnerMessage: string;
    canFix: boolean;
}

export interface FixExplanation {
    whatWasWrong: string;
    whyItBlocked: string;
    whatWasChanged: string;
    originalSnippet?: string;
    fixedSnippet?: string;
}

// AST Types
export type ASTNode =
    | Program
    | FunctionDeclaration
    | Block
    | VariableDeclaration
    | MultiVariableDeclaration
    | Assignment
    | BinaryExpression
    | Identifier
    | Literal
    | ReturnStatement
    | IfStatement
    | WhileStatement
    | ForStatement
    | CallExpression
    | ExpressionStatement
    | UpdateExpression
    | ClassDeclaration
    | MemberExpression
    | NewExpression
    | ThisExpression
    | ThisExpression
    | ArrayExpression
    | BreakStatement;

export interface BreakStatement extends BaseNode {
    type: 'BreakStatement';
}

export interface BaseNode {
    type: string;
    line?: number;
}

export interface Program extends BaseNode {
    type: 'Program';
    body: ASTNode[];
}

export interface Block extends BaseNode {
    type: 'Block';
    body: ASTNode[];
}

export interface FunctionDeclaration extends BaseNode {
    type: 'FunctionDeclaration';
    name: string;
    returnType?: string;
    params: { name: string; type: string }[];
    body: Block;
}

export interface VariableDeclaration extends BaseNode {
    type: 'VariableDeclaration';
    name: string;
    varType?: string;
    init?: ASTNode;
}

export interface MultiVariableDeclaration extends BaseNode {
    type: 'MultiVariableDeclaration';
    declarations: VariableDeclaration[];
}

export interface Assignment extends BaseNode {
    type: 'Assignment';
    left?: ASTNode; // Can be Identifier or MemberExpression
    name?: string; // Legacy fallback
    value: ASTNode;
}

export interface BinaryExpression extends BaseNode {
    type: 'BinaryExpression';
    operator: string;
    left: ASTNode;
    right: ASTNode;
}

export interface Identifier extends BaseNode {
    type: 'Identifier';
    name: string;
}

export interface Literal extends BaseNode {
    type: 'Literal';
    value: any;
    valueType?: string;
}

export interface ReturnStatement extends BaseNode {
    type: 'ReturnStatement';
    argument?: ASTNode;
}

export interface IfStatement extends BaseNode {
    type: 'IfStatement';
    test: ASTNode;
    consequent: ASTNode; // Block or Statement
    alternate?: ASTNode;
}

export interface WhileStatement extends BaseNode {
    type: 'WhileStatement';
    test: ASTNode;
    body: ASTNode;
}

export interface ForStatement extends BaseNode {
    type: 'ForStatement';
    init?: ASTNode;
    test?: ASTNode;
    update?: ASTNode;
    body: ASTNode;
}

export interface CallExpression extends BaseNode {
    type: 'CallExpression';
    callee: ASTNode | string;
    arguments: ASTNode[];
}

export interface ExpressionStatement extends BaseNode {
    type: 'ExpressionStatement';
    expression: ASTNode;
}

export interface UpdateExpression extends BaseNode {
    type: 'UpdateExpression';
    operator: '++' | '--';
    prefix: boolean;
    argument: ASTNode;
}

export interface ClassDeclaration extends BaseNode {
    type: 'ClassDeclaration';
    name: string;
    members: ASTNode[];
}

export interface MemberExpression extends BaseNode {
    type: 'MemberExpression';
    object: ASTNode;
    property: ASTNode;
    computed: boolean; // true for arr[i], false for obj.prop
}

export interface NewExpression extends BaseNode {
    type: 'NewExpression';
    className: string;
    arguments: ASTNode[];
}

export interface ThisExpression extends BaseNode {
    type: 'ThisExpression';
}

export interface ArrayExpression extends BaseNode {
    type: 'ArrayExpression';
    elements: ASTNode[];
}
