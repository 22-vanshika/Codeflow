import {
    ASTNode, Program, FunctionDeclaration, Block, VariableDeclaration,
    Assignment, BinaryExpression, Identifier, Literal, ReturnStatement,
    IfStatement, WhileStatement, CallExpression, ExpressionStatement,
    ExecutionTrace, StackFrame, ForStatement, UpdateExpression,
    ClassDeclaration, MemberExpression, NewExpression, ThisExpression, ArrayExpression,
    MultiVariableDeclaration, VisualizationHint
} from '../../../types';
import { Lexer, Parser } from './parser';
import { IExecutor } from '../../executor.interface';

class Environment {
    private vars: Map<string, any> = new Map();
    private parent: Environment | null = null;

    constructor(parent: Environment | null = null) {
        this.parent = parent;
    }

    public define(name: string, value: any) {
        this.vars.set(name, value);
    }

    public assign(name: string, value: any) {
        if (this.vars.has(name)) {
            this.vars.set(name, value);
            return;
        }
        if (this.parent) {
            this.parent.assign(name, value);
            return;
        }
        throw new Error(`Runtime Error: Undefined variable '${name}'`);
    }

    public get(name: string): any {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        throw new Error(`Runtime Error: Undefined variable '${name}'`);
    }

    public getParent(): Environment | null {
        return this.parent;
    }
}

export class Executor implements IExecutor {
    private globals: Environment = new Environment();
    private callStack: Environment[] = [];
    private traces: ExecutionTrace[] = [];
    private heap: Record<string, any> = {};
    private heapCounter: number = 0x1000;
    private inputBuffer: string[] = [];

    // Visualization context for step-by-step drawing
    private currentNodeId: string = 'start';
    private loopIterations: Map<number, number> = new Map();  // line -> iteration count

    constructor() {
        this.callStack.push(this.globals);
        // Define standard streams
        this.globals.define('cout', { __type: 'std::cout' });
        this.globals.define('std::cout', { __type: 'std::cout' });
        this.globals.define('cin', { __type: 'std::cin' });
        this.globals.define('std::cin', { __type: 'std::cin' });
        this.globals.define('endl', '\\n');
        this.globals.define('std::endl', '\\n');
    }

    private currentEnv(): Environment {
        return this.callStack[this.callStack.length - 1];
    }

    private getNextInput(): string | null {
        if (this.inputBuffer.length > 0) {
            return this.inputBuffer.shift()!;
        }
        return null;
    }

    private parseInput(input: string) {
        // Simple tokenization of input string by whitespace
        this.inputBuffer = input.trim().split(/\s+/).filter(s => s.length > 0);
    }

    public *execute(source: string, input: string = ""): Generator<ExecutionTrace> {
        this.parseInput(input);

        const lexer = new Lexer(source);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const ast = parser.parse();

        // Hoist function declarations
        if (ast.type === 'Program') {
            for (const node of ast.body) {
                if (node.type === 'FunctionDeclaration') {
                    const func = node as FunctionDeclaration;
                    this.globals.define(func.name, func);
                } else if (node.type === 'ClassDeclaration') {
                    const cls = node as ClassDeclaration;
                    this.globals.define(cls.name, cls);
                }
            }
        }

        // Find main
        const main = this.globals.get('main');
        if (!main) {
            throw new Error("Runtime Error: 'main' function not defined");
        }

        const result = yield* this.executeFunction(main as FunctionDeclaration, []);

        // Capture exit code
        if (result !== undefined) {
            const exitMsg = `\nProgram finished with exit code: ${result}`;
            this.outputBuffer += exitMsg;
            // Yield final trace to ensure output is visible
            yield this.createTrace((main as FunctionDeclaration).line || 0, 'output', `Program finished with exit code: ${result}`);
        }
    }

    private *executeFunction(func: FunctionDeclaration, args: any[]): Generator<ExecutionTrace> {
        const env = new Environment(this.globals);

        // Define arguments
        func.params.forEach((param, index) => {
            env.define(param.name, args[index]);
        });

        this.callStack.push(env);
        yield this.createTrace(func.line || 0, 'function_call', `Called ${func.name}`);

        try {
            yield* this.visitBlock(func.body);
        } catch (e: any) {
            if (e instanceof ReturnException) {
                this.callStack.pop();
                return e.value;
            }
            throw e;
        }

        this.callStack.pop();
    }

    private *visitBlock(node: Block): Generator<ExecutionTrace> {
        for (const stmt of node.body) {
            yield* this.executeStatement(stmt);
        }
    }

    private *executeStatement(node: ASTNode): Generator<ExecutionTrace> {
        switch (node.type) {
            case 'VariableDeclaration': {
                const decl = node as VariableDeclaration;
                let value = undefined;
                if (decl.init) {
                    value = yield* this.evaluate(decl.init);
                }
                this.currentEnv().define(decl.name, value);
                yield this.createTrace(decl.line || 0, 'definition', `Declared ${decl.name} = ${value !== undefined ? value : '?'}`);
                break;
            }
            case 'MultiVariableDeclaration': {
                const multi = node as MultiVariableDeclaration;
                for (const decl of multi.declarations) {
                    yield* this.executeStatement(decl);
                }
                break;
            }
            case 'Assignment': {
                const assign = node as Assignment;
                const right = yield* this.evaluate(assign.value);

                // Handle left-hand side
                if (assign.left) {
                    if (assign.left.type === 'Identifier') {
                        const name = (assign.left as Identifier).name;
                        this.currentEnv().assign(name, right);
                        yield this.createTrace(assign.line || 0, 'assignment', `${name} = ${right}`);
                    } else if (assign.left.type === 'MemberExpression') {
                        const mem = assign.left as MemberExpression;
                        const obj = yield* this.evaluate(mem.object);
                        let target = obj;
                        if (typeof obj === 'string' && obj.startsWith('#')) target = this.heap[obj];

                        if (mem.computed) {
                            const idx = yield* this.evaluate(mem.property);
                            target[idx] = right;
                            yield this.createTrace(assign.line || 0, 'assignment', `${(mem.object as Identifier).name}[${idx}] = ${right}`);
                        } else {
                            const prop = (mem.property as Identifier).name;
                            target[prop] = right;
                            yield this.createTrace(assign.line || 0, 'assignment', `${(mem.object as Identifier).name}.${prop} = ${right}`);
                        }
                    } else if (assign.left.type === 'UpdateExpression') {
                        throw new Error(`Runtime Error: Invalid left-hand side for assignment`);
                    } else {
                        throw new Error(`Runtime Error: Invalid left-hand side for assignment: ${assign.left.type}`);
                    }
                } else {
                    // Legacy fallback if left is missing but name exists?
                    if (assign.name) {
                        this.currentEnv().assign(assign.name, right);
                        yield this.createTrace(assign.line || 0, 'assignment', `${assign.name} = ${right}`);
                    } else {
                        throw new Error(`Runtime Error: Invalid assignment`);
                    }
                }
                break;
            }
            case 'ReturnStatement': {
                const ret = node as ReturnStatement;
                let value = undefined;
                if (ret.argument) {
                    value = yield* this.evaluate(ret.argument);
                }
                yield this.createTrace(ret.line || 0, 'return', `Returned ${value}`);
                throw new ReturnException(value);
            }
            case 'ExpressionStatement': {
                const expr = node as ExpressionStatement;
                yield* this.evaluate(expr.expression);
                break;
            }
            case 'IfStatement': {
                const ifStmt = node as IfStatement;
                const test = yield* this.evaluate(ifStmt.test);
                const pathTaken = test ? 'true' : 'false';

                yield this.createTrace(ifStmt.line || 0, 'condition', `If condition: ${test}`, {
                    pathTaken: pathTaken as 'true' | 'false',
                    what: `We checked if the condition is true or false.`,
                    why: test
                        ? `The condition evaluated to TRUE, so we take the Yes ✓ branch.`
                        : `The condition evaluated to FALSE, so we take the No ✗ branch.`,
                    next: test
                        ? `We'll execute the code inside the if block.`
                        : ifStmt.alternate
                            ? `We'll execute the code inside the else block.`
                            : `We'll skip the if block and continue after it.`
                });

                if (test) {
                    yield* this.visitStatement(ifStmt.consequent);
                } else if (ifStmt.alternate) {
                    yield* this.visitStatement(ifStmt.alternate);
                }
                break;
            }
            case 'WhileStatement': {
                const loop = node as WhileStatement;
                const loopLine = loop.line || 0;
                let iteration = 0;

                while (true) {
                    const test = yield* this.evaluate(loop.test);
                    iteration++;
                    this.loopIterations.set(loopLine, iteration);

                    if (test) {
                        yield this.createTrace(loopLine, iteration === 1 ? 'loop_start' : 'loop_continue',
                            `While condition: ${test} (iteration ${iteration})`, {
                            loopIteration: iteration,
                            pathTaken: 'true',
                            what: iteration === 1
                                ? `We're entering the loop for the first time.`
                                : `We go back to the loop because the condition is still true.`,
                            why: `The condition '${test}' is TRUE, so the loop continues.`,
                            next: `We'll execute the loop body (iteration ${iteration}).`
                        });
                        yield* this.visitStatement(loop.body);
                    } else {
                        yield this.createTrace(loopLine, 'loop_end',
                            `While condition: ${test} - Loop ends`, {
                            loopIteration: iteration,
                            pathTaken: 'false',
                            what: `The loop has finished because the condition became false.`,
                            why: `The condition is now FALSE after ${iteration - 1} iteration(s).`,
                            next: `We'll continue with the code after the loop.`
                        });
                        break;
                    }
                }
                break;
            }
            case 'ForStatement': {
                const loop = node as ForStatement;
                const loopLine = loop.line || 0;
                let iteration = 0;

                // Init
                if (loop.init) {
                    yield* this.executeStatement(loop.init);
                }

                while (true) {
                    // Test
                    if (loop.test) {
                        const test = yield* this.evaluate(loop.test);
                        iteration++;
                        this.loopIterations.set(loopLine, iteration);

                        if (test) {
                            yield this.createTrace(loopLine, iteration === 1 ? 'loop_start' : 'loop_continue',
                                `For condition: ${test} (iteration ${iteration})`, {
                                loopIteration: iteration,
                                pathTaken: 'true',
                                what: iteration === 1
                                    ? `We're entering the for loop for the first time.`
                                    : `We go back to the loop because the condition is still true.`,
                                why: `The condition is TRUE, so we continue looping.`,
                                next: `We'll execute the loop body (iteration ${iteration}).`
                            });
                        } else {
                            yield this.createTrace(loopLine, 'loop_end',
                                `For condition: ${test} - Loop ends`, {
                                loopIteration: iteration,
                                pathTaken: 'false',
                                what: `The for loop has finished.`,
                                why: `The condition is now FALSE after ${iteration - 1} iteration(s).`,
                                next: `We'll continue with the code after the loop.`
                            });
                            break;
                        }
                    } else {
                        iteration++;
                    }

                    // Body
                    yield* this.visitStatement(loop.body);

                    // Update
                    if (loop.update) {
                        yield* this.evaluate(loop.update);
                    }
                }
                break;
            }
            case 'Block': {
                // Blocks create new scopes
                const env = new Environment(this.currentEnv());
                this.callStack.push(env);
                try {
                    yield* this.visitBlock(node as Block);
                } finally {
                    this.callStack.pop();
                }
                break;
            }
        }
    }

    // Helper to handle Block or Single Statement
    private *visitStatement(node: ASTNode): Generator<ExecutionTrace> {
        if (node.type === 'Block') {
            yield* this.executeStatement(node);
        } else {
            // For single statements in loop bodies etc, execute directly
            yield* this.executeStatement(node);
        }
    }

    private *evaluate(node: ASTNode): Generator<any, any, any> {
        switch (node.type) {
            case 'Literal': return (node as Literal).value;
            case 'Identifier': return this.currentEnv().get((node as Identifier).name);
            case 'BinaryExpression': {
                const bin = node as BinaryExpression;
                const left = yield* this.evaluate(bin.left);

                // Special handling for cin >>
                if (bin.operator === '>>' && left && left.__type === 'std::cin') {
                    const name = (bin.right as Identifier).name;
                    const rawVal = this.getNextInput();
                    let val: any = rawVal;

                    if (val === null) {
                        throw new Error(`Runtime Error: Input stream exhausted. Please provide input for '${name}'.`);
                    }
                    if (!isNaN(Number(val))) {
                        val = Number(val);
                    }

                    this.currentEnv().assign(name, val);
                    yield this.createTrace(bin.line || 0, 'function_call', `Input ${val} into ${name}`);
                    return left; // Return cin object for chaining
                }

                // Normal binary ops...
                const right = yield* this.evaluate(bin.right);

                // cout << 
                if (bin.operator === '<<' && left && (left.__type === 'std::cout')) {
                    // Check for endl
                    const outputVal = (right === '\\n') ? '\n' : right;
                    this.outputBuffer += outputVal;
                    yield this.createTrace(bin.line || 0, 'output', `Output: ${JSON.stringify(outputVal)}`);
                    return left; // Return cout object for chaining
                }

                switch (bin.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    case '%': return left % right;
                    case '==': return left === right;
                    case '!=': return left !== right;
                    case '<': return left < right;
                    case '>': return left > right;
                    case '<=': return left <= right;
                    case '>=': return left >= right;
                    case '&&': return left && right;
                    case '||': return left || right;
                    default: throw new Error(`Unknown operator ${bin.operator}`);
                }
            }
            case 'CallExpression': {
                const call = node as CallExpression;
                let callee;
                if (typeof call.callee === 'string') {
                    // This shouldn't happen based on types but for safety
                    callee = this.currentEnv().get(call.callee);
                } else {
                    callee = yield* this.evaluate(call.callee as ASTNode);
                }

                const args = [];
                for (const arg of call.arguments) {
                    args.push(yield* this.evaluate(arg));
                }

                if (callee && callee.type === 'FunctionDeclaration') {
                    // User defined function
                    return yield* this.executeFunction(callee, args);
                } else if (typeof callee === 'function') {
                    // Built-in function (if any) or method
                    return callee(...args);
                } else if (callee && callee.__type === 'std::vector_push_back') {
                    // Handle push_back
                    const vec = callee.instance;
                    vec.push(args[0]);
                    return;
                }
                // ... Handle other mocks
                throw new Error(`Runtime Error: ${call.callee} is not a function`);
            }
            case 'NewExpression': {
                const newExpr = node as NewExpression;
                const address = `#${(this.heapCounter++).toString(16)}`;

                if (newExpr.className === 'int') {
                    this.heap[address] = 0; // Default
                } else {
                    // Assume class
                    const cls = this.globals.get(newExpr.className) as ClassDeclaration;
                    if (!cls) throw new Error(`Unknown class ${newExpr.className}`);

                    const instance: any = {};
                    // Initialize members
                    for (const mem of cls.members) {
                        if (mem.type === 'VariableDeclaration') {
                            const decl = mem as VariableDeclaration;
                            instance[decl.name] = undefined;
                        }
                    }
                    this.heap[address] = instance;
                }

                yield this.createTrace(newExpr.line || 0, 'definition', `Allocated new ${newExpr.className} at ${address}`);
                return address;
            }
            case 'MemberExpression': {
                const mem = node as MemberExpression;
                const obj = yield* this.evaluate(mem.object);

                if (mem.computed) {
                    // Array access
                    const idx = yield* this.evaluate(mem.property);
                    return obj[idx];
                } else {
                    const prop = (mem.property as Identifier).name;
                    // Check if obj is pointer
                    if (typeof obj === 'string' && obj.startsWith('#')) {
                        const target = this.heap[obj];
                        return target[prop];
                    }
                    // Direct member access
                    // Special case for vector methods
                    if (Array.isArray(obj)) {
                        if (prop === 'push_back') {
                            return { __type: 'std::vector_push_back', instance: obj };
                        }
                        if (prop === 'size') return () => obj.length;
                    }

                    return obj[prop];
                }
            }
            case 'ThisExpression': return this.currentEnv().get('this');
            case 'ArrayExpression': {
                // Return array literal
                const arr = node as ArrayExpression;
                const elements = [];
                for (const el of arr.elements) {
                    elements.push(yield* this.evaluate(el));
                }
                return elements;
            }
            case 'UpdateExpression': {
                const upd = node as UpdateExpression;
                if (upd.argument.type !== 'Identifier') throw new Error("Update only supported on identifiers");
                const name = (upd.argument as Identifier).name;
                const env = this.currentEnv();
                const val = env.get(name);
                if (upd.operator === '++') {
                    if (upd.prefix) { env.assign(name, val + 1); return val + 1; }
                    else { env.assign(name, val + 1); return val; }
                } else {
                    if (upd.prefix) { env.assign(name, val - 1); return val - 1; }
                    else { env.assign(name, val - 1); return val; }
                }
            }
            default:
                // TODO: Handle UnaryExpression separately if needed for *ptr
                throw new Error(`Runtime Error: Unknown node type ${node.type}`);
        }
    }

    private outputBuffer: string = "";

    // Create enhanced trace with three-part beginner explanation
    private createTrace(
        line: number,
        type: ExecutionTrace['type'],
        explanation: string,
        vizContext?: {
            nodeId?: string;
            pathTaken?: 'true' | 'false';
            loopIteration?: number;
            what?: string;
            why?: string;
            next?: string;
            dataStructureOp?: VisualizationHint['dataStructureOp'];
        }
    ): ExecutionTrace {
        const stack: StackFrame[] = this.callStack.slice(1).map(env => ({
            function: 'unknown',
            locals: this.extractLocals(env)
        }));

        // Generate beginner-friendly three-part explanation
        const visualization: VisualizationHint = {
            nodeId: vizContext?.nodeId || this.currentNodeId,
            pathTaken: vizContext?.pathTaken,
            loopIteration: vizContext?.loopIteration,
            dataStructureOp: vizContext?.dataStructureOp,
            explanation: {
                what: vizContext?.what || this.generateWhat(type, explanation),
                why: vizContext?.why || this.generateWhy(type, explanation),
                next: vizContext?.next || this.generateNext(type)
            }
        };

        return {
            line,
            type,
            explanation,
            stack,
            heap: { ...this.heap },
            output: this.outputBuffer,
            visualization
        };
    }

    // Generate "What just happened" explanation
    private generateWhat(type: ExecutionTrace['type'], explanation: string): string {
        switch (type) {
            case 'definition':
                return `We created a new variable. ${explanation}`;
            case 'assignment':
                return `We updated a variable's value. ${explanation}`;
            case 'condition':
                return `We checked a condition. ${explanation}`;
            case 'loop_start':
                return `We entered a loop and will repeat until the condition becomes false.`;
            case 'loop_continue':
                return `We go back to the loop because the condition is still true.`;
            case 'loop_end':
                return `The loop has finished because the condition became false.`;
            case 'function_call':
                return `We called a function. ${explanation}`;
            case 'return':
                return `We returned a value and exited the function. ${explanation}`;
            case 'output':
                return `We printed something to the screen. ${explanation}`;
            default:
                return explanation;
        }
    }

    // Generate "Why it happened" explanation  
    private generateWhy(type: ExecutionTrace['type'], explanation: string): string {
        switch (type) {
            case 'definition':
                return `Every variable needs to be created before we can use it.`;
            case 'assignment':
                return `The variable's value was computed from the expression on the right side.`;
            case 'condition':
                if (explanation.includes('true') || explanation.includes('True')) {
                    return `The condition evaluated to TRUE, so we take the Yes branch.`;
                } else if (explanation.includes('false') || explanation.includes('False')) {
                    return `The condition evaluated to FALSE, so we take the No branch.`;
                }
                return `The condition determines which path the program takes.`;
            case 'loop_start':
            case 'loop_continue':
                return `The loop condition is still true, so we continue repeating.`;
            case 'loop_end':
                return `The loop condition became false, so we stop repeating.`;
            case 'function_call':
                return `Functions help organize code into reusable pieces.`;
            case 'return':
                return `The function completed its work and sent back a result.`;
            case 'output':
                return `We want to show this value to the user.`;
            default:
                return `This is part of the program's execution flow.`;
        }
    }

    // Generate "What will be checked next" explanation
    private generateNext(type: ExecutionTrace['type']): string {
        switch (type) {
            case 'definition':
            case 'assignment':
                return `We'll move to the next statement in the program.`;
            case 'condition':
                return `We'll execute the code inside the chosen branch.`;
            case 'loop_start':
            case 'loop_continue':
                return `We'll run the code inside the loop body.`;
            case 'loop_end':
                return `We'll continue with the code after the loop.`;
            case 'function_call':
                return `We'll execute the code inside the function.`;
            case 'return':
                return `Control returns to where the function was called.`;
            case 'output':
                return `We'll move to the next statement.`;
            default:
                return `The program continues to the next step.`;
        }
    }

    private extractLocals(env: Environment): Record<string, any> {
        // Access private var via any cast or making public
        return Object.fromEntries((env as any).vars);
    }
}

class ReturnException {
    constructor(public value: any) { }
}
