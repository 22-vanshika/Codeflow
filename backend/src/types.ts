// AST Types
export type NodeType =
    | 'Program'
    | 'FunctionDeclaration'
    | 'Block'
    | 'VariableDeclaration'
    | 'Assignment'
    | 'BinaryExpression'
    | 'Identifier'
    | 'Literal'
    | 'ReturnStatement'
    | 'IfStatement'
    | 'WhileStatement'
    | 'ForStatement'
    | 'CallExpression'
    | 'ExpressionStatement'
    | 'UpdateExpression';

export interface BaseASTNode {
    type: NodeType;
    line?: number;
}

export interface Program extends BaseASTNode {
    type: 'Program';
    body: ASTNode[];
}

export interface FunctionDeclaration extends BaseASTNode {
    type: 'FunctionDeclaration';
    name: string;
    returnType: string;
    params: { name: string; type: string }[];
    body: Block;
}

export interface Block extends BaseASTNode {
    type: 'Block';
    body: ASTNode[];
}

export interface VariableDeclaration extends BaseASTNode {
    type: 'VariableDeclaration';
    varType: string;
    name: string;
    init?: ASTNode;
}

export interface Assignment extends BaseASTNode {
    type: 'Assignment';
    name: string;
    value: ASTNode;
}

export interface BinaryExpression extends BaseASTNode {
    type: 'BinaryExpression';
    operator: string;
    left: ASTNode;
    right: ASTNode;
}

export interface Identifier extends BaseASTNode {
    type: 'Identifier';
    name: string;
}

export interface Literal extends BaseASTNode {
    type: 'Literal';
    value: any;
    valueType: 'int' | 'string' | 'bool';
}

export interface ReturnStatement extends BaseASTNode {
    type: 'ReturnStatement';
    argument?: ASTNode;
}

export interface IfStatement extends BaseASTNode {
    type: 'IfStatement';
    test: ASTNode;
    consequent: Block;
    alternate?: Block;
}

export interface WhileStatement extends BaseASTNode {
    type: 'WhileStatement';
    test: ASTNode;
    body: Block;
}

export interface ForStatement extends BaseASTNode {
    type: 'ForStatement';
    init?: ASTNode;
    test?: ASTNode;
    update?: ASTNode;
    body: Block;
}

export interface CallExpression extends BaseASTNode {
    type: 'CallExpression';
    callee: string;
    arguments: ASTNode[];
}

export interface ExpressionStatement extends BaseASTNode {
    type: 'ExpressionStatement';
    expression: ASTNode;
}

export interface UpdateExpression extends BaseASTNode {
    type: 'UpdateExpression';
    operator: '++' | '--';
    argument: Identifier;
    prefix: boolean;
}

export type ASTNode =
    | Program
    | FunctionDeclaration
    | Block
    | VariableDeclaration
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
    | UpdateExpression;

// Execution Trace Types
export interface ExecutionTrace {
    line: number;
    type: 'assignment' | 'comparison' | 'function_call' | 'return' | 'loop' | 'condition' | 'init' | 'definition';
    explanation: string;
    stack: StackFrame[];
    heap: Record<string, any>;
}

export interface StackFrame {
    function: string;
    locals: Record<string, any>;
}
