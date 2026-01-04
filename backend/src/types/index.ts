export interface ExecutionTrace {
    line: number;
    type: 'definition' | 'assignment' | 'return' | 'condition' | 'function_call' | 'error' | 'output';
    stack: StackFrame[];
    heap: Record<string, any>;
    output?: string;
    explanation?: string;
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

export interface ExecutionResultPayload {
    traces: ExecutionTrace[];
    analysis?: {
        title: string;
        complexity: string;
        pattern: string;
        explanation: Record<string, string>;
        overview: string;
    };
    flowchart?: string | {
        markdown: string;
        mapping: Record<string, string>; // nodeId -> line number string (Or vice versa? We need to find Node by Line. So Line -> NodeID is better, but many nodes can be on one line. Let's do a map.)
    };
}

export interface ExecutionResponse {
    type: 'EXECUTION_RESULT' | 'ERROR';
    payload: ExecutionResultPayload | string;
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
    | ArrayExpression;

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
