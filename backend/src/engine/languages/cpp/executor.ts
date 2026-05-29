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
    public heap: Record<string, any> | null = null;

    constructor(parent: Environment | null = null, heap: Record<string, any> | null = null) {
        this.parent = parent;
        this.heap = heap || (parent ? parent.heap : null);
    }

    public define(name: string, value: any) {
        this.vars.set(name, value);
    }

    public assign(name: string, value: any) {
        if (this.vars.has(name)) {
            this.vars.set(name, value);
            return;
        }
        if (this.heap) {
            try {
                const thisAddr = this.vars.has('this') ? this.vars.get('this') : ((this.parent as any) ? (this.parent as any).get('this') : null);
                if (thisAddr && typeof thisAddr === 'string' && thisAddr.startsWith('#')) {
                    const target = this.heap[thisAddr];
                    if (target && name in target) {
                        target[name] = value;
                        return;
                    }
                }
            } catch (e) {}
        }
        const parentEnv = this.parent;
        if (parentEnv) {
            parentEnv.assign(name, value);
            return;
        }
        throw new Error(`Runtime Error: Undefined variable '${name}'`);
    }

    public get(name: string): any {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        if (this.heap) {
            try {
                const thisAddr = this.vars.has('this') ? this.vars.get('this') : ((this.parent as any) ? (this.parent as any).get('this') : null);
                if (thisAddr && typeof thisAddr === 'string' && thisAddr.startsWith('#')) {
                    const target = this.heap[thisAddr];
                    if (target && name in target) {
                        return target[name];
                    }
                }
            } catch (e) {}
        }
        const parentEnv = this.parent;
        if (parentEnv) {
            return parentEnv.get(name);
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
        this.globals.heap = this.heap;
        this.callStack.push(this.globals);
        // Define standard streams
        this.globals.define('cout', { __type: 'std::cout' });
        this.globals.define('std::cout', { __type: 'std::cout' });
        this.globals.define('cin', { __type: 'std::cin' });
        this.globals.define('std::cin', { __type: 'std::cin' });
        this.globals.define('endl', '\n');
        this.globals.define('std::endl', '\n');
        this.globals.define('nullptr', null);
        this.globals.define('NULL', null);
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
        console.log("DEBUG: Tokens:", tokens.slice(0, 50).map(t => t.value));
        const ast = parser.parse();

        if (ast.type === 'Program') {
            console.log("DEBUG: Program Body Types:", ast.body.map(n => n.type));
            for (const node of ast.body) {
                if (node.type === 'FunctionDeclaration') {
                    const func = node as FunctionDeclaration;
                    this.globals.define(func.name, func);
                } else if (node.type === 'ClassDeclaration') {
                    const cls = node as ClassDeclaration;
                    this.globals.define(cls.name, cls);
                } else if (node.type === 'VariableDeclaration' || node.type === 'MultiVariableDeclaration') {
                    // Global variable, execute it
                    yield* this.executeStatement(node);
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
        (env as any).functionName = func.name;

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

    private *executeConstructor(func: FunctionDeclaration, address: string, args: any[]): Generator<ExecutionTrace, string, any> {
        const env = new Environment(this.globals);
        (env as any).functionName = `${func.name}::Constructor`;
        env.define('this', address);

        // Define arguments
        func.params.forEach((param, index) => {
            env.define(param.name, args[index]);
        });

        this.callStack.push(env);
        yield this.createTrace(func.line || 0, 'function_call', `Running constructor ${func.name}`);

        try {
            yield* this.visitBlock(func.body);
        } catch (e: any) {
            if (e instanceof ReturnException) {
                this.callStack.pop();
                return address;
            }
            throw e;
        }

        this.callStack.pop();
        return address;
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
                    const evaluated = yield* this.evaluate(decl.init);
                    if (Array.isArray(evaluated) && evaluated.length === 0 && decl.arrayDimensions && decl.arrayDimensions.length > 0) {
                        const createArray = (dims: number[]): any[] => {
                            if (dims.length === 0) return 0 as any;
                            const size = dims[0];
                            const arr = new Array(size);
                            if (dims.length === 1) {
                                for (let i = 0; i < size; i++) {
                                    const t = decl.varType || '';
                                    if (t.includes('int') || t.includes('float') || t.includes('double') || t.includes('long')) arr[i] = 0;
                                    else if (t.includes('bool')) arr[i] = false;
                                    else if (t.includes('string')) arr[i] = "";
                                    else if (t.includes('char')) arr[i] = '\0';
                                    else arr[i] = {};
                                }
                            } else {
                                for (let i = 0; i < size; i++) {
                                    arr[i] = createArray(dims.slice(1));
                                }
                            }
                            return arr;
                        };
                        value = createArray(decl.arrayDimensions);
                    } else {
                        value = evaluated;
                    }
                } else if (decl.arrayDimensions && decl.arrayDimensions.length > 0) {
                    // ... array init (existing)
                    // (Keep existing CreateArray logic here or reference it? 
                    // The tool replaces chunks, so I need to preserve the array logic or rewrite it.
                    // I will rewrite the array logic to be safe, or just insert the else if after it).
                    // Better to just target the end of array logic block or before it.
                    // Let's replace the whole block to be safe.
                    const createArray = (dims: number[]): any[] => {
                        if (dims.length === 0) return 0 as any;
                        const size = dims[0];
                        const arr = new Array(size);
                        if (dims.length === 1) {
                            for (let i = 0; i < size; i++) {
                                const t = decl.varType || '';
                                if (t.includes('int') || t.includes('float') || t.includes('double') || t.includes('long')) arr[i] = 0;
                                else if (t.includes('bool')) arr[i] = false;
                                else if (t.includes('string')) arr[i] = "";
                                else if (t.includes('char')) arr[i] = '\0';
                                else arr[i] = {};
                            }
                        } else {
                            for (let i = 0; i < size; i++) {
                                arr[i] = createArray(dims.slice(1));
                            }
                        }
                        return arr;
                    };
                    value = createArray(decl.arrayDimensions);
                } else if (decl.varType) {
                    // Default initialization for STL types
                    const t = decl.varType;
                    if (t.includes('vector') || t.includes('stack') || t.includes('queue')) {
                        value = [];
                    } else if (t.includes('map')) {
                        value = new Map();
                    } else if (t.includes('pair')) {
                        value = { first: 0, second: 0 };
                    } else if (t.includes('string')) {
                        value = "";
                    } else if (t.includes('int') || t.includes('double')) {
                        // Optional: init primitives to 0? C++ global vars are 0, locals are garbage.
                        // But for visualization, 0 is safer/cleaner.
                        // Let's stick to undefined for locals to show "garbage" or uninit?
                        // User asked for correctness. Undefined might crash if used.
                        // Let's leave primitives as undefined unless user wants safe mode.
                    }
                }
                this.currentEnv().define(decl.name, value);
                yield this.createTrace(decl.line || 0, 'definition', `Declared ${decl.name} = ${value !== undefined ? JSON.stringify(value) : '?'}`);
                break;
            }
            case 'MultiVariableDeclaration': {
                const multi = node as MultiVariableDeclaration;
                for (const decl of multi.declarations) {
                    yield* this.executeStatement(decl);
                }
                break;
            }
            case 'ClassDeclaration': {
                const cls = node as ClassDeclaration;
                this.currentEnv().define(cls.name, cls);
                yield this.createTrace(cls.line || 0, 'definition', `Defined struct ${cls.name}`);
                break;
            }
            case 'Assignment': {
                const assign = node as Assignment;
                yield* this.evaluate(assign); // Handled in evaluate
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
            case 'BreakStatement': {
                yield this.createTrace(node.line || 0, 'condition', 'Breaking out of the loop', {
                    pathTaken: 'true',
                    what: 'We encountered a break statement.',
                    why: 'The program explicitly requested to stop the loop.',
                    next: 'We will exit the loop immediately.'
                });
                throw new BreakException();
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
                        try {
                            yield* this.visitStatement(loop.body);
                        } catch (e: any) {
                            if (e instanceof BreakException) {
                                yield this.createTrace(loopLine, 'loop_end',
                                    `Loop broken - exiting`, {
                                    loopIteration: iteration,
                                    pathTaken: 'true',
                                    what: `We are exiting the loop due to a break statement.`,
                                    why: `A break statement was executed inside the loop.`,
                                    next: `We'll continue with the code after the loop.`
                                });
                                break;
                            }
                            throw e;
                        }
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

                if ((loop as any).isRangeFor) {
                    const rangeVar = (loop as any).rangeVariable as VariableDeclaration;
                    const container = yield* this.evaluate((loop as any).rangeContainer);
                    let items: any[] = [];
                    if (Array.isArray(container)) {
                        items = container;
                    } else if (container instanceof Map) {
                        items = Array.from(container.entries()).map(([k, v]) => ({ first: k, second: v }));
                    } else if (typeof container === 'string') {
                        items = container.split('');
                    }

                    for (const item of items) {
                        iteration++;
                        this.loopIterations.set(loopLine, iteration);

                        const env = new Environment(this.currentEnv());
                        env.define(rangeVar.name, item);
                        this.callStack.push(env);

                        yield this.createTrace(loopLine, iteration === 1 ? 'loop_start' : 'loop_continue',
                            `Iterating: ${rangeVar.name} = ${typeof item === 'object' && item !== null ? JSON.stringify(item) : item} (iteration ${iteration})`, {
                            loopIteration: iteration,
                            pathTaken: 'true',
                            what: `We are iterating over the container. Current element: ${rangeVar.name} = ${typeof item === 'object' && item !== null ? JSON.stringify(item) : item}`,
                            why: `Range-based for loop is processing next item in the container.`,
                            next: `Execute the loop body.`
                        });

                        try {
                            yield* this.visitStatement(loop.body);
                        } catch (e: any) {
                            if (e instanceof BreakException) {
                                yield this.createTrace(loopLine, 'loop_end',
                                    `Loop broken - exiting`, {
                                    loopIteration: iteration,
                                    pathTaken: 'true',
                                    what: `We are exiting the loop due to a break statement.`,
                                    why: `A break statement was executed inside the loop.`,
                                    next: `We'll continue with the code after the loop.`
                                });
                                this.callStack.pop();
                                break;
                            }
                            this.callStack.pop();
                            throw e;
                        }

                        this.callStack.pop();
                    }

                    yield this.createTrace(loopLine, 'loop_end',
                        `Range-based loop ends`, {
                        loopIteration: iteration,
                        pathTaken: 'false',
                        what: `The range-based for loop has finished iterating.`,
                        why: `All items in the container have been processed.`,
                        next: `We'll continue with the code after the loop.`
                    });
                    break;
                }

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
                    try {
                        yield* this.visitStatement(loop.body);
                    } catch (e: any) {
                        if (e instanceof BreakException) {
                            yield this.createTrace(loopLine, 'loop_end',
                                `Loop broken - exiting`, {
                                loopIteration: iteration,
                                pathTaken: 'true',
                                what: `We are exiting the loop due to a break statement.`,
                                why: `A break statement was executed inside the loop.`,
                                next: `We'll continue with the code after the loop.`
                            });
                            break;
                        }
                        throw e;
                    }

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
            case 'Assignment': {
                const assign = node as Assignment;
                let right = yield* this.evaluate(assign.value);

                if (assign.operator && assign.operator !== '=' && assign.left) {
                    // We need current value of left
                    let currentVal: any;
                    // Simplify: reuse evaluate logic partially?
                    // Or just handle Identifier/MemberExpr read
                    if (assign.left.type === 'Identifier') {
                        currentVal = this.currentEnv().get((assign.left as Identifier).name);
                    } else if (assign.left.type === 'MemberExpression') {
                        const mem = assign.left as MemberExpression;
                        const obj = yield* this.evaluate(mem.object);
                        if (mem.computed) {
                            const idx = yield* this.evaluate(mem.property);
                            currentVal = obj[idx];
                        } else {
                            const prop = (mem.property as Identifier).name;
                            currentVal = obj[prop];
                        }
                    }

                    const op = assign.operator.replace('=', ''); // += -> +
                    if (op === '+') {
                        if (typeof currentVal === 'string' || typeof right === 'string') {
                            right = String(currentVal) + String(right);
                        } else {
                            right = currentVal + right;
                        }
                    } else if (op === '-') right = currentVal - right;
                    else if (op === '*') right = currentVal * right;
                    else if (op === '/') right = currentVal / right;
                    else if (op === '%') right = currentVal % right;
                }

                // Handle left-hand side assignment
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
                            if (typeof obj === 'string') {
                                const strArr = obj.split('');
                                strArr[idx] = right;
                                const newStr = strArr.join('');
                                if (mem.object.type === 'Identifier') {
                                    const varName = (mem.object as Identifier).name;
                                    this.currentEnv().assign(varName, newStr);
                                }
                                yield this.createTrace(assign.line || 0, 'assignment', `${(mem.object as Identifier).name}[${idx}] = ${right}`);
                            } else if (target instanceof Map) {
                                target.set(idx, right);
                                yield this.createTrace(assign.line || 0, 'assignment', `Map[${idx}] = ${right}`);
                            } else {
                                target[idx] = right;
                                yield this.createTrace(assign.line || 0, 'assignment', `${(mem.object as Identifier).name}[${idx}] = ${right}`);
                            }
                        } else {
                            const prop = (mem.property as Identifier).name;
                            if (target instanceof Map) {
                                // Map string key?
                                target.set(prop, right);
                            } else {
                                target[prop] = right;
                            }
                            yield this.createTrace(assign.line || 0, 'assignment', `${(mem.object as Identifier).name}.${prop} = ${right}`);
                        }
                    } else {
                        throw new Error(`Runtime Error: Invalid left-hand side for assignment: ${assign.left.type}`);
                    }
                }
                return right;
            }
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

                const right = yield* this.evaluate(bin.right);

                if (bin.operator === '+') {
                    if (typeof left === 'string' || typeof right === 'string') {
                        return String(left) + String(right);
                    }
                    return left + right;
                }

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
                    case '/': {
                        if (typeof left === 'number' && typeof right === 'number') {
                            if (Number.isInteger(left) && Number.isInteger(right)) {
                                return Math.trunc(left / right);
                            }
                            return left / right;
                        }
                        return left / right;
                    }
                    case '%': return left % right;
                    case '==': {
                        if (left && typeof left === 'object' && 'container' in left && right && typeof right === 'object' && 'container' in right) {
                            if (left.isEnd && right.isEnd) return true;
                            if (left.isEnd || right.isEnd) return false;
                            return left.key === right.key || left.index === right.index;
                        }
                        return left === right;
                    }
                    case '!=': {
                        if (left && typeof left === 'object' && 'container' in left && right && typeof right === 'object' && 'container' in right) {
                            if (left.isEnd && right.isEnd) return false;
                            if (left.isEnd || right.isEnd) return true;
                            return left.key !== right.key && left.index !== right.index;
                        }
                        return left !== right;
                    }
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
                // Check if it's a method call on a standard type (String, Vector)
                // Check if it's a method call on a standard type (String, Vector)
                if (typeof call.callee !== 'string' && call.callee.type === 'MemberExpression') {
                    // ... existing handled
                } else if (typeof call.callee !== 'string' && call.callee.type === 'Identifier') {
                    // Global function calls like sort(), min(), max()
                    const funcName = (call.callee as Identifier).name;

                    if (funcName === 'sort') {
                        // sort(v.begin(), v.end())
                        // Arguments are iterators. Mock iterators as simple indices or object refs?
                        // In our mock, begin() returns 0, end() returns length.
                        // But we need the container.
                        // Arguments might include the container if we simplify?
                        // "sort(v.begin(), v.end())" -> args[0]=0, args[1]=length.
                        // We lost the container ref!
                        // For now, let's assume valid C++ is passed.
                        // Limitation: We can't easily find 'v' from 'v.begin()'.
                        // Workaround: If arguments are just numbers, we can't sort.
                        // We need arguments to carry container info.
                        // Fix: Mock begin() to return {container: obj, index: 0}.

                        // Re-eval arguments logic for begin/end calls?
                        // We are evaluating args before this check.
                        // We need to update MemberExpression evaluate to return Iterator object?
                        // Let's do that in next chunk.

                        // Assuming we updated begin/end:
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (args[0] && args[0].container && Array.isArray(args[0].container)) {
                            const arr = args[0].container;
                            arr.sort((a: any, b: any) => a - b);
                            yield this.createTrace(call.line || 0, 'function_call', `Sorted container`);
                            return;
                        }
                    } else if (funcName === 'max') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        return Math.max(args[0], args[1]);
                    } else if (funcName === 'min') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        return Math.min(args[0], args[1]);
                    } else if (funcName === 'make_pair') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        return { first: args[0], second: args[1] };
                    }
                }
                if (typeof call.callee !== 'string' && call.callee.type === 'MemberExpression') {
                    const mem = call.callee as MemberExpression;
                    const obj = yield* this.evaluate(mem.object);
                    const method = (mem.property as Identifier).name;

                    if (typeof obj === 'string') {
                        if (method === 'substr') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            yield this.createTrace(call.line || 0, 'function_call', `Called string.substr`);
                            return obj.substr(args[0], args[1]);
                        }
                        if (method === 'find') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            yield this.createTrace(call.line || 0, 'function_call', `Called string.find`);
                            return obj.indexOf(args[0]);
                        }
                        if (method === 'size' || method === 'length') {
                            return obj.length;
                        }
                    } else if (Array.isArray(obj)) {
                        // Vector / Stack / Queue mocks using JS Array
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (method === 'push_back' || method === 'push') {
                            obj.push(args[0]);
                            yield this.createTrace(call.line || 0, 'function_call', `Pushed ${args[0]}`);
                            return;
                        }
                        if (method === 'pop_back' || method === 'pop') {
                            const val = obj.pop();
                            yield this.createTrace(call.line || 0, 'function_call', `Popped ${val}`);
                            return;
                        }
                        if (method === 'resize') {
                            const newSize = args[0];
                            const defaultVal = args[1] !== undefined ? args[1] : 0;
                            if (newSize > obj.length) {
                                while (obj.length < newSize) obj.push(defaultVal);
                            } else {
                                obj.length = newSize;
                            }
                            yield this.createTrace(call.line || 0, 'function_call', `Resized vector to ${newSize}`);
                            return;
                        }
                        if (method === 'assign') {
                            const newSize = args[0];
                            const defaultVal = args[1];
                            obj.length = 0;
                            for (let idx = 0; idx < newSize; idx++) obj.push(defaultVal);
                            yield this.createTrace(call.line || 0, 'function_call', `Assigned vector size ${newSize}`);
                            return;
                        }
                        if (method === 'clear') {
                            obj.length = 0;
                            yield this.createTrace(call.line || 0, 'function_call', `Cleared vector`);
                            return;
                        }
                        if (method === 'emplace_back') {
                            obj.push(args[0]);
                            yield this.createTrace(call.line || 0, 'function_call', `Pushed ${args[0]}`);
                            return;
                        }
                        if (method === 'size') return obj.length;
                        if (method === 'empty') return obj.length === 0;
                        if (method === 'top' || method === 'back') return obj[obj.length - 1];
                        if (method === 'front') return obj[0];
                        if (method === 'begin') return { container: obj, index: 0 }; // Mock iterator
                        if (method === 'end') return { container: obj, index: obj.length };
                    } else if (obj instanceof Map) {
                        // Map Mocks
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (method === 'insert') {
                            // map.insert({k,v}) ? or pair?
                            // Typically map[k]=v used.
                            return;
                        }
                        if (method === 'count') {
                            return obj.has(args[0]) ? 1 : 0;
                        }
                        if (method === 'find') {
                            const key = args[0];
                            if (obj.has(key)) {
                                return { container: obj, key: key, isEnd: false, first: key, get second() { return obj.get(key); } };
                            } else {
                                return { container: obj, isEnd: true };
                            }
                        }
                        if (method === 'empty') return obj.size === 0;
                        if (method === 'end') return { container: obj, isEnd: true };
                        if (method === 'size') return obj.size;
                        if (method === 'erase') {
                            obj.delete(args[0]);
                            yield this.createTrace(call.line || 0, 'function_call', `Erased key ${args[0]}`);
                            return;
                        }
                    }
                }

                // Normal function call
                // const funcName = (call.callee as Identifier).name; // This line was not in the original code, but was in the instruction's context. Removing it to avoid introducing new changes.
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

                if (newExpr.className === 'int' || newExpr.className === 'double') {
                    this.heap[address] = 0; // Default
                } else if (newExpr.className === 'string') {
                    this.heap[address] = "";
                } else if (['vector', 'stack', 'queue'].includes(newExpr.className)) {
                    // Arrays or objects wrapping arrays
                    this.heap[address] = [];
                    // Store metadata if needed, but array is flexible.
                } else if (['pair'].includes(newExpr.className)) {
                    this.heap[address] = { first: 0, second: 0 };
                } else {
                    // Assume class
                    let cls: ClassDeclaration | undefined;
                    try {
                        cls = this.currentEnv().get(newExpr.className);
                    } catch (e) {
                        // ignore undefined
                    }

                    if (!cls) {
                        // Fallback for untyped/template-stripped IDs
                        this.heap[address] = {};
                    } else {
                        const instance: any = {};
                        const createDefaultValue = (decl: VariableDeclaration): any => {
                            if (decl.arrayDimensions && decl.arrayDimensions.length > 0) {
                                const createArray = (dims: number[]): any[] => {
                                    if (dims.length === 0) return 0 as any;
                                    const size = dims[0];
                                    const arr = new Array(size);
                                    if (dims.length === 1) {
                                        for (let i = 0; i < size; i++) {
                                            const t = decl.varType || '';
                                            if (t.includes('int') || t.includes('float') || t.includes('double') || t.includes('long')) arr[i] = 0;
                                            else if (t.includes('bool')) arr[i] = false;
                                            else if (t.includes('string')) arr[i] = "";
                                            else if (t.includes('char')) arr[i] = '\0';
                                            else arr[i] = null;
                                        }
                                    } else {
                                        for (let i = 0; i < size; i++) {
                                            arr[i] = createArray(dims.slice(1));
                                        }
                                    }
                                    return arr;
                                };
                                return createArray(decl.arrayDimensions);
                            }
                            const t = decl.varType || '';
                            if (t.includes('vector') || t.includes('stack') || t.includes('queue')) return [];
                            if (t.includes('map')) return new Map();
                            if (t.includes('pair')) return { first: 0, second: 0 };
                            if (t.includes('string')) return "";
                            if (t.includes('int') || t.includes('double') || t.includes('float') || t.includes('char')) return 0;
                            return null;
                        };

                        // Initialize members
                        for (const mem of cls.members) {
                            if (mem.type === 'VariableDeclaration') {
                                const decl = mem as VariableDeclaration;
                                instance[decl.name] = createDefaultValue(decl);
                            } else if (mem.type === 'MultiVariableDeclaration') {
                                const multi = mem as MultiVariableDeclaration;
                                for (const decl of multi.declarations) {
                                    instance[decl.name] = createDefaultValue(decl);
                                }
                            }
                        }
                        this.heap[address] = instance;

                        // Check for constructor and run it
                        const ctor = cls.members.find(
                            m => m.type === 'FunctionDeclaration' && (m as FunctionDeclaration).name === newExpr.className
                        ) as FunctionDeclaration | undefined;

                        if (ctor) {
                            const args = [];
                            for (const arg of newExpr.arguments) {
                                args.push(yield* this.evaluate(arg));
                            }
                            yield* this.executeConstructor(ctor, address, args);
                        }
                    }
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
                    if (obj instanceof Map) {
                        // Default C++ specific: accessing map[k] inserts default if not found
                        if (!obj.has(idx)) {
                            obj.set(idx, 0); // Default to 0 for C++ frequency maps
                        }
                        return obj.get(idx);
                    }
                    return obj[idx];
                } else {
                    const prop = (mem.property as Identifier).name;
                    // Check if obj is pointer
                    if (typeof obj === 'string' && obj.startsWith('#')) {
                        const target = this.heap[obj];
                        return target[prop];
                    }
                    if (typeof obj === 'string') {
                        if (prop === 'size' || prop === 'length') {
                            return () => obj.length;
                        }
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
            case 'ConditionalExpression': {
                const cond = node as any;
                const test = yield* this.evaluate(cond.test);
                if (test) {
                    return yield* this.evaluate(cond.consequent);
                } else {
                    return yield* this.evaluate(cond.alternate);
                }
            }
            case 'CastExpression': {
                return yield* this.evaluate((node as any).argument);
            }
            case 'UnaryExpression': {
                const unary = node as any;
                const val = yield* this.evaluate(unary.argument);
                if (unary.operator === '!') {
                    return !val;
                }
                if (unary.operator === '-') {
                    return -val;
                }
                return val;
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
            function: (env as any).functionName || 'unknown',
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

        const visuals = this.generateVisuals();

        return {
            line,
            type,
            explanation,
            stack,
            heap: { ...this.heap },
            output: this.outputBuffer,
            visualization,
            visuals
        };
    }

    private generateVisuals(): any | undefined {
        const topEnv = this.currentEnv();
        if (!topEnv) return undefined;

        const locals = this.extractLocals(topEnv);
        const globals = this.extractLocals(this.globals);
        const allVars = { ...globals, ...locals };

        const hasRecursion = this.callStack.length > 2;

        const isTreeNode = (addr: string): boolean => {
            if (typeof addr !== 'string' || !addr.startsWith('#')) return false;
            const node = this.heap[addr];
            return node && ('left' in node) && ('right' in node);
        };

        const isListNode = (addr: string): boolean => {
            if (typeof addr !== 'string' || !addr.startsWith('#')) return false;
            const node = this.heap[addr];
            return node && ('next' in node);
        };

        // 1. Binary Tree Detection
        for (const [name, val] of Object.entries(locals)) {
            if (isTreeNode(val)) {
                const nodes: any[] = [];
                const queue: string[] = [val];
                const visited = new Set<string>();

                nodes.push({ id: val, value: this.heap[val].val !== undefined ? this.heap[val].val : this.heap[val].value });
                visited.add(val);

                let headIdx = 0;
                while (headIdx < queue.length) {
                    const currAddr = queue[headIdx++];
                    const currNode = this.heap[currAddr];

                    if (currNode.left && isTreeNode(currNode.left) && !visited.has(currNode.left)) {
                        visited.add(currNode.left);
                        nodes.push({ id: currNode.left, value: this.heap[currNode.left].val !== undefined ? this.heap[currNode.left].val : this.heap[currNode.left].value, parentId: currAddr });
                        queue.push(currNode.left);
                    }
                    if (currNode.right && isTreeNode(currNode.right) && !visited.has(currNode.right)) {
                        visited.add(currNode.right);
                        nodes.push({ id: currNode.right, value: this.heap[currNode.right].val !== undefined ? this.heap[currNode.right].val : this.heap[currNode.right].value, parentId: currAddr });
                        queue.push(currNode.right);
                    }
                }

                const activeNodes: string[] = [];
                for (const [vName, vVal] of Object.entries(locals)) {
                    if (visited.has(vVal)) activeNodes.push(vVal);
                }

                return {
                    type: 'tree',
                    nodes,
                    currentNodeId: val,
                    activeNodes,
                    visitedNodes: Array.from(visited)
                };
            }
        }

        // 2. Linked List Detection
        for (const [name, val] of Object.entries(locals)) {
            if (isListNode(val)) {
                const nodes: any[] = [];
                let currAddr = val;
                let prevAddr = undefined;
                const visited = new Set<string>();

                while (currAddr && isListNode(currAddr) && !visited.has(currAddr)) {
                    visited.add(currAddr);
                    const currNode = this.heap[currAddr];
                    nodes.push({ id: currAddr, value: currNode.val !== undefined ? currNode.val : currNode.value, parentId: prevAddr });
                    prevAddr = currAddr;
                    currAddr = currNode.next;
                }

                const activeNodes: string[] = [];
                for (const [vName, vVal] of Object.entries(locals)) {
                    if (visited.has(vVal)) activeNodes.push(vVal);
                }

                return {
                    type: 'tree',
                    nodes,
                    currentNodeId: val,
                    activeNodes,
                    visitedNodes: Array.from(visited)
                };
            }
        }

        // 3. Graph Adjacency List Detection
        const adj = allVars['adj'];
        if (adj && Array.isArray(adj) && adj.every(row => Array.isArray(row))) {
            const nodes: any[] = [];
            const edges: any[] = [];
            const adjacencyList: Record<string, string[]> = {};

            adj.forEach((row, i) => {
                nodes.push({ id: String(i), value: i, label: `Node ${i}` });
                adjacencyList[String(i)] = row.map(String);
                row.forEach(neighbor => {
                    edges.push({ from: String(i), to: String(neighbor), directed: true });
                });
            });

            const visVarName = Object.keys(allVars).find(k => ['visited', 'vis', 'seen'].includes(k.toLowerCase()));
            const visitedNodes: string[] = [];
            if (visVarName) {
                const visArray = allVars[visVarName];
                if (Array.isArray(visArray)) {
                    visArray.forEach((isVis, idx) => {
                        if (isVis) visitedNodes.push(String(idx));
                    });
                }
            }

            const activeNodes: string[] = [];
            const activeEdges: any[] = [];
            for (const [vName, vVal] of Object.entries(locals)) {
                if (typeof vVal === 'number' && vVal >= 0 && vVal < adj.length) {
                    activeNodes.push(String(vVal));
                }
            }

            return {
                type: 'graph',
                nodes,
                edges,
                activeNodes,
                visitedNodes,
                activeEdges,
                adjacencyList
            };
        }

        // 4. Stack / Queue Detection
        for (const [name, val] of Object.entries(locals)) {
            if (Array.isArray(val) && ['s', 'st', 'stack', 'q', 'qu', 'queue'].some(p => name.toLowerCase().includes(p))) {
                const isStack = name.toLowerCase().includes('stack') || name.toLowerCase().includes('s');
                return {
                    type: isStack ? 'stack' : 'queue',
                    target: name,
                    elements: val,
                    activeIndices: val.length > 0 ? [val.length - 1] : []
                };
            }
        }

        // 5. Map / HashMap Detection
        for (const [name, val] of Object.entries(locals)) {
            if (val instanceof Map) {
                const entries = Array.from(val.entries()).map(([k, v]) => ({ key: k, value: v }));
                return {
                    type: 'hash_map',
                    target: name,
                    entries,
                    activeKeys: entries.map(e => e.key)
                };
            }
        }

        // 6. 1D Array / Vector Detection
        for (const [name, val] of Object.entries(locals)) {
            if (Array.isArray(val) && val.every(el => typeof el !== 'object')) {
                const pointers: any[] = [];
                const highlightIndices: number[] = [];

                for (const [vName, vVal] of Object.entries(locals)) {
                    if (typeof vVal === 'number' && ['i', 'j', 'left', 'right', 'l', 'r', 'mid', 'low', 'high', 'start', 'end'].includes(vName.toLowerCase())) {
                        if (vVal >= 0 && vVal < val.length) {
                            const color = ['left', 'l', 'low', 'start', 'i'].includes(vName.toLowerCase()) ? 'red' :
                                          ['right', 'r', 'high', 'end', 'j'].includes(vName.toLowerCase()) ? 'blue' :
                                          ['mid', 'middle'].includes(vName.toLowerCase()) ? 'green' : 'orange';
                            pointers.push({
                                name: vName.toUpperCase().charAt(0),
                                index: vVal,
                                color,
                                action: 'static'
                            });
                            highlightIndices.push(vVal);
                        }
                    }
                }

                return {
                    type: 'array_1d',
                    target: name,
                    values: val,
                    pointers,
                    highlightIndices
                };
            }
        }

        if (hasRecursion) {
            const frames = this.callStack.slice(1).map(env => ({
                functionName: (env as any).functionName || 'unknown',
                args: this.extractLocals(env)
            }));
            return {
                type: 'call_stack',
                frames,
                activeFrame: frames.length - 1
            };
        }

        return undefined;
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

class BreakException { }

