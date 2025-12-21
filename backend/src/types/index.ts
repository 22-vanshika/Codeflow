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
    | 'UpdateExpression'
    | 'ClassDeclaration'
    | 'MemberExpression'
    | 'NewExpression'
    | 'ThisExpression'
    | 'ArrayExpression';

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

export interface ClassDeclaration extends BaseASTNode {
    type: 'ClassDeclaration';
    name: string;
    members: (VariableDeclaration | FunctionDeclaration)[];
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

    // Actually, for obj.prop = val, we need MemberExpression assignment. 
    // AST usually handles this by having 'left' be an LValue (Identifier | MemberExpression).
    // Current Assignment interface enforces 'name: string'.
    // We should probably change this to 'left: Identifier | MemberExpression' or similar.
    // To avoid breaking too much, let's allow 'target' as ASTNode?
    // Or keep 'name' for now and use BinaryExpression used for logic? No, assignment is statement/expr.
    // Let's UPDATE Assignment to support MemberExpression target.
    left?: ASTNode; // If present, use this instead of name.
    name: string; // Legacy support or fall back?
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
    valueType: 'int' | 'string' | 'bool' | 'null';
}

export interface ArrayExpression extends BaseASTNode {
    type: 'ArrayExpression';
    elements: ASTNode[];
}

export interface MemberExpression extends BaseASTNode {
    type: 'MemberExpression';
    object: ASTNode;
    property: ASTNode; // Identifier (for .prop) or Expr (for [i])
    computed: boolean; // true if [] access, false if . access
}

export interface NewExpression extends BaseASTNode {
    type: 'NewExpression';
    className: string;
    arguments: ASTNode[];
}

export interface ThisExpression extends BaseASTNode {
    type: 'ThisExpression';
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
    callee: string | ASTNode; // Allow ASTNode (MemberExpression) for obj.method()
    arguments: ASTNode[];
}

export interface ExpressionStatement extends BaseASTNode {
    type: 'ExpressionStatement';
    expression: ASTNode;
}

export interface UpdateExpression extends BaseASTNode {
    type: 'UpdateExpression';
    operator: '++' | '--';
    argument: ASTNode; // Changed from Identifier to ASTNode to support obj.prop++
    prefix: boolean;
}

export type ASTNode =
    | Program
    | FunctionDeclaration
    | ClassDeclaration
    | Block
    | VariableDeclaration
    | Assignment
    | BinaryExpression
    | Identifier
    | Literal
    | ArrayExpression
    | MemberExpression
    | NewExpression
    | ThisExpression
    | ReturnStatement
    | IfStatement
    | WhileStatement
    | ForStatement
    | CallExpression
    | ExpressionStatement
    | UpdateExpression
    | MultiVariableDeclaration;

export interface MultiVariableDeclaration {
    type: 'MultiVariableDeclaration';
    declarations: VariableDeclaration[];
    line: number;
}

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
