import {
    ASTNode, Program, FunctionDeclaration, Block, VariableDeclaration,
    Assignment, BinaryExpression, Identifier, Literal, ReturnStatement,
    IfStatement, WhileStatement, CallExpression, ExpressionStatement,
    ExecutionTrace, StackFrame, ForStatement, UpdateExpression
} from '../../types';
import { Lexer, Parser } from './parser';

class Environment {
    private values: Map<string, any> = new Map();
    private parent?: Environment;

    constructor(parent?: Environment) {
        this.parent = parent;
    }

    define(name: string, value: any) {
        this.values.set(name, value);
    }

    assign(name: string, value: any): boolean {
        if (this.values.has(name)) {
            this.values.set(name, value);
            return true;
        }
        if (this.parent) {
            return this.parent.assign(name, value);
        }
        return false;
    }

    get(name: string): any {
        if (this.values.has(name)) return this.values.get(name);
        if (this.parent) return this.parent.get(name);
        throw new Error(`Undefined variable '${name}'`);
    }

    getLocals(): Record<string, any> {
        const locals: Record<string, any> = {};
        for (const [key, val] of this.values.entries()) {
            locals[key] = val;
        }
        return locals;
    }
}

class FunctionObject {
    declaration: FunctionDeclaration;
    constructor(decl: FunctionDeclaration) {
        this.declaration = decl;
    }
}

export class Executor {
    private globals: Environment = new Environment();
    private stack: StackFrame[] = []; // Only for visualization context (function names)
    private functions: Map<string, FunctionObject> = new Map();
    private callStack: Environment[] = []; // Actual runtime environments

    constructor() {
        this.callStack.push(this.globals);
    }

    public *execute(source: string): Generator<ExecutionTrace> {
        const lexer = new Lexer(source);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const program = parser.parse();

        yield* this.visitProgram(program);

        // Auto-call main if exists
        if (this.functions.has('main')) {
            const main = this.functions.get('main')!;
            yield* this.callFunction(main, []);
        }
    }

    private *visitProgram(node: Program): Generator<ExecutionTrace> {
        for (const stmt of node.body) {
            if (stmt.type === 'FunctionDeclaration') {
                this.functions.set((stmt as FunctionDeclaration).name, new FunctionObject(stmt as FunctionDeclaration));
                yield this.createTrace(stmt.line || 0, 'definition', `Defined function ${(stmt as FunctionDeclaration).name}`);
            } else {
                yield* this.visitStatement(stmt);
            }
        }
    }

    private *visitStatement(node: ASTNode): Generator<ExecutionTrace, any, any> {
        switch (node.type) {
            case 'VariableDeclaration': return yield* this.visitVariableDeclaration(node as VariableDeclaration);
            case 'ExpressionStatement': return yield* this.visitExpressionStatement(node as ExpressionStatement);
            case 'ReturnStatement': return yield* this.visitReturnStatement(node as ReturnStatement);
            case 'IfStatement': return yield* this.visitIfStatement(node as IfStatement);
            case 'WhileStatement': return yield* this.visitWhileStatement(node as WhileStatement);
            case 'ForStatement': return yield* this.visitForStatement(node as ForStatement);
            case 'Block': return yield* this.visitBlock(node as Block);
            case 'Assignment': return yield* this.visitAssignment(node as Assignment);
            case 'UpdateExpression': return yield* this.visitUpdateExpression(node as UpdateExpression);
            default: throw new Error(`Unknown statement type: ${node.type}`);
        }
    }

    private *visitVariableDeclaration(node: VariableDeclaration): Generator<ExecutionTrace> {
        let value = undefined;
        if (node.init) {
            value = yield* this.evaluate(node.init);
        }
        // Default values
        if (value === undefined) {
            if (node.varType === 'int') value = 0;
            if (node.varType === 'bool') value = false;
            if (node.varType === 'string') value = "";
        }

        this.currentEnv().define(node.name, value);
        yield this.createTrace(node.line || 0, 'assignment', `Declared ${node.name} = ${value}`);
    }

    private *visitAssignment(node: Assignment): Generator<ExecutionTrace> {
        const value = yield* this.evaluate(node.value);
        this.currentEnv().assign(node.name, value);
        yield this.createTrace(node.line || 0, 'assignment', `Assigned ${node.name} = ${value}`);
    }

    private *visitExpressionStatement(node: ExpressionStatement): Generator<ExecutionTrace> {
        yield* this.evaluate(node.expression);
    }

    private *visitReturnStatement(node: ReturnStatement): Generator<ExecutionTrace, any, any> {
        let value = undefined;
        if (node.argument) {
            value = yield* this.evaluate(node.argument);
        }
        yield this.createTrace(node.line || 0, 'return', `Returned ${value !== undefined ? value : ''}`);
        return { isReturn: true, value };
    }

    private *visitIfStatement(node: IfStatement): Generator<ExecutionTrace> {
        const test = yield* this.evaluate(node.test);
        yield this.createTrace(node.line || 0, 'condition', `If check: ${test}`);

        if (test) {
            yield* this.visitBlock(node.consequent);
        } else if (node.alternate) {
            yield* this.visitBlock(node.alternate);
        }
    }

    private *visitWhileStatement(node: WhileStatement): Generator<ExecutionTrace> {
        while (true) {
            const test = yield* this.evaluate(node.test);
            yield this.createTrace(node.line || 0, 'loop', `Loop condition: ${test}`);
            if (!test) break;
            yield* this.visitBlock(node.body);
        }
    }

    private *visitForStatement(node: ForStatement): Generator<ExecutionTrace> {
        // Create a new scope for the loop (for init variables like 'int i = 0')
        const loopEnv = new Environment(this.currentEnv());
        this.callStack.push(loopEnv);

        // 1. Init
        if (node.init) {
            if (node.init.type === 'VariableDeclaration') {
                yield* this.visitVariableDeclaration(node.init as VariableDeclaration);
            } else {
                yield* this.visitStatement(node.init); // ExpressionStatement or Assignment
            }
        }

        while (true) {
            // 2. Test
            let shouldRun = true;
            if (node.test) {
                const testVal = yield* this.evaluate(node.test);
                yield this.createTrace(node.line || 0, 'loop', `Loop condition: ${testVal}`);
                shouldRun = !!testVal;
            } else {
                yield this.createTrace(node.line || 0, 'loop', `Loop condition (omitted): true`);
            }

            if (!shouldRun) break;

            // 3. Body
            yield* this.visitBlock(node.body);

            // 4. Update
            if (node.update) {
                // Visit as statement
                if (node.update.type === 'Assignment' || node.update.type === 'UpdateExpression') {
                    yield* this.visitStatement(node.update);
                } else {
                    yield* this.evaluate(node.update);
                }
            }
        }

        this.callStack.pop();
    }

    private *visitUpdateExpression(node: UpdateExpression): Generator<ExecutionTrace> {
        const currentVal = this.lookup(node.argument.name);
        let newVal = currentVal;
        if (node.operator === '++') newVal = Number(currentVal) + 1;
        if (node.operator === '--') newVal = Number(currentVal) - 1;

        this.currentEnv().assign(node.argument.name, newVal);
        yield this.createTrace(node.line || 0, 'assignment', `Updated ${node.argument.name} to ${newVal}`);
        return node.prefix ? newVal : currentVal;
    }

    private *visitBlock(node: Block): Generator<ExecutionTrace, any, any> {
        // create new scope? C++ has block scope. 
        // For simplicity, let's just reuse current function scope or create a block scope.
        // Let's create block scope.
        const blockEnv = new Environment(this.currentEnv());
        this.callStack.push(blockEnv); // Push block env

        // We don't push stack frame for block, but we do track variables?
        // Current visualization expectation: StackFrames are Functions only.
        // Locals in StackFrame should merge?
        // For now, simpler: Variables are fetched from current env chain up to function boundary.

        for (const stmt of node.body) {
            const result = yield* this.visitStatement(stmt);
            if (result && result.isReturn) {
                this.callStack.pop();
                return result;
            }
        }
        this.callStack.pop();
    }

    private *callFunction(func: FunctionObject, args: any[]): Generator<ExecutionTrace, any, any> {
        // 1. Create new Environment for Function
        const funcEnv = new Environment(this.globals); // Closures? C++ functions are usually global or behave so (except lambdas). Global parent is safe for now.

        // 2. Bind Params
        for (let i = 0; i < func.declaration.params.length; i++) {
            const paramName = func.declaration.params[i].name;
            funcEnv.define(paramName, args[i]);
        }

        // 3. Push Stack Frame
        this.callStack.push(funcEnv);
        this.stack.push({
            function: func.declaration.name,
            locals: funcEnv.getLocals() // Initial locals
        });

        yield this.createTrace(func.declaration.line || 0, 'function_call', `Called function ${func.declaration.name}`);

        // 4. Exec Body
        // Function body is a Block, so visitBlock will create ANOTHER scope? 
        // C++ function body IS the scope.
        // We can manually visit block statements without creating extra scope if we want, or just let visitBlock handle it.
        // visitBlock does `new Environment(currentEnv)`. So we'd have FuncEnv -> BlockEnv.
        // This is fine and correct for { int a; { int a } }.

        let returnValue = undefined;

        // We manually iterate block body to avoid extra scope OR just let it be.
        // Let's manually iterate to keep params in the same scope as top-level vars in function.
        for (const stmt of func.declaration.body.body) {
            const result = yield* this.visitStatement(stmt);
            if (result && result.isReturn) {
                returnValue = result.value;
                break;
            }
        }

        // 5. Pop
        this.stack.pop();
        this.callStack.pop();
        return returnValue;
    }

    private *evaluate(node: ASTNode): Generator<ExecutionTrace, any, any> {
        switch (node.type) {
            case 'Literal': return (node as Literal).value;
            case 'Identifier': return this.lookup((node as Identifier).name);
            case 'BinaryExpression': {
                const bin = node as BinaryExpression;
                const left = yield* this.evaluate(bin.left);
                const right = yield* this.evaluate(bin.right);
                switch (bin.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return Math.floor(left / right); // Integer division usually
                    case '<': return left < right;
                    case '>': return left > right;
                    case '<=': return left <= right;
                    case '>=': return left >= right;
                    case '==': return left === right;
                    case '!=': return left !== right;
                }
                break;
            }
            case 'CallExpression': {
                const call = node as CallExpression;
                const func = this.functions.get(call.callee);
                if (!func) throw new Error(`Function ${call.callee} not found`);

                const args = [];
                for (const arg of call.arguments) {
                    args.push(yield* this.evaluate(arg));
                }
                return yield* this.callFunction(func, args);
            }
        }
        return undefined;
    }

    private currentEnv(): Environment {
        return this.callStack[this.callStack.length - 1];
    }

    private lookup(name: string): any {
        return this.currentEnv().get(name);
    }

    private createTrace(line: number, type: ExecutionTrace['type'], explanation: string): ExecutionTrace {
        // Snapshot locals for current function frame
        // We need to update the top stack frame with CURRENT execution state of variables
        if (this.stack.length > 0) {
            // Update top frame locals
            const currentLocals = this.currentEnv().getLocals();
            // Merge with params? funcEnv has params. blockEnv has block variables. 
            // We might want to flatten the scope chain for the visualization of "Current Locals".
            // A simple way: walk up env chain until we hit globals or stop.

            // Better: this.stack stores the "Visual" stack frame.
            // We should update `this.stack[this.stack.length-1].locals`.
            this.stack[this.stack.length - 1].locals = this.flattenLocals();
        }

        return {
            line,
            type,
            explanation,
            stack: JSON.parse(JSON.stringify(this.stack)), // Deep copy
            heap: {}
        };
    }

    private flattenLocals(): Record<string, any> {
        // Walk from current env up to (but not including) globals
        let locals: Record<string, any> = {};
        let env: Environment | undefined = this.currentEnv();
        while (env && env !== this.globals) {
            locals = { ...locals, ...env.getLocals() }; // Inner overwrites outer (shadowing)
            // env = env.parent; // Accessing private property? Need getter or public
            // I defined parent as private. Let's assume Environment logic allows access or I fix it.
            // Since I am inside same module/class/code, I can't access private field of another instance strictly in TS unless I cast to any or change visibility.
            // I should add `getParent()`
            env = (env as any).parent;
        }
        return locals;
    }
}
