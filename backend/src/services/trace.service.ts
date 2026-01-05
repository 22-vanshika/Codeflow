import { Lexer, Parser } from '../engine/languages/cpp/parser';
import {
    TraceStep,
    TraceResult,
    PatternInfo,
    VisualInstruction,
    ArrayVisual,
    CallStackVisual,
    TeacherNote,
    ALGORITHM_PATTERNS
} from '../types/trace.types';
import { ASTNode, Program, FunctionDeclaration, Block } from '../types';

/**
 * TraceService - Generates step-by-step execution traces with:
 * 1. Visual instructions (array pointers, highlights)
 * 2. Pattern recognition (Two-Pointer, Sliding Window, etc.)
 * 3. Pedagogical "Teacher's Notes" for each step
 */
export class TraceService {
    private steps: TraceStep[] = [];
    private readonly MAX_TOTAL_STEPS = 5000;
    private stepCounter: number = 0;
    private variables: Record<string, any> = {};
    private callStack: { functionName: string; args: Record<string, any>; returnValue?: any }[] = [];
    private detectedPattern: PatternInfo | null = null;
    private codeLines: string[] = [];
    private outputBuffer: string[] = [];

    // Track pointers for pattern visualization
    private trackedPointers: Map<string, { index: number; color: 'red' | 'blue' | 'green' | 'orange' | 'purple' }> = new Map();
    private trackedArrays: Map<string, any[]> = new Map();

    /**
     * Generate a full execution trace for the given code
     */
    public generateTrace(code: string): TraceResult {
        try {
            // Reset state
            this.steps = [];
            this.stepCounter = 0;
            this.variables = {};
            this.callStack = [];
            this.trackedPointers.clear();
            this.trackedArrays.clear();
            this.outputBuffer = [];
            this.codeLines = code.split('\n');

            // Parse code
            const lexer = new Lexer(code);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const ast = parser.parse();

            // Detect pattern before execution
            this.detectedPattern = this.detectPattern(code, ast);

            // Execute and trace
            const result = this.traceProgram(ast);
            if (result !== undefined) {
                this.outputBuffer.push(`Program finished with exit code: ${result}`);
            }

            return {
                success: true,
                steps: this.steps,
                pattern: this.detectedPattern || undefined,
                totalSteps: this.steps.length,
                output: this.outputBuffer.join('\n')
            };
        } catch (error: any) {
            return {
                success: false,
                steps: this.steps,
                totalSteps: this.steps.length,
                error: error.message || 'Trace generation failed'
            };
        }
    }

    /**
     * Detect algorithm pattern from code structure
     */
    private detectPattern(code: string, ast: Program): PatternInfo | null {
        const lowerCode = code.toLowerCase();

        // Two-Pointer detection
        if (this.hasTwoPointerPattern(code)) {
            return ALGORITHM_PATTERNS['two-pointer'];
        }

        // Sliding Window detection
        if (this.hasSlidingWindowPattern(code)) {
            return ALGORITHM_PATTERNS['sliding-window'];
        }

        // Binary Search detection
        if (this.hasBinarySearchPattern(code)) {
            return ALGORITHM_PATTERNS['binary-search'];
        }

        // Recursion detection
        if (this.hasRecursionPattern(ast)) {
            return ALGORITHM_PATTERNS['recursion'];
        }

        // Default to linear traversal if there's a loop
        if (code.includes('for') || code.includes('while')) {
            return ALGORITHM_PATTERNS['linear-traversal'];
        }

        return null;
    }

    private hasTwoPointerPattern(code: string): boolean {
        // Look for left/right, i/j pointer pairs with convergence
        const hasLeftRight = /\b(left|l)\b.*\b(right|r)\b/i.test(code) ||
            /\bright\b.*\bleft\b/i.test(code);
        const hasPointerIncDec = /left\s*\+\+|right\s*--|i\s*\+\+.*j\s*--/i.test(code);
        const hasConvergence = /while\s*\([^)]*<[^)]*\)/i.test(code);

        return (hasLeftRight && hasPointerIncDec) ||
            (hasLeftRight && hasConvergence);
    }

    private hasSlidingWindowPattern(code: string): boolean {
        // Look for window start/end or substr operations
        const hasWindowVars = /\b(window|start|end|windowStart|windowEnd)\b/i.test(code);
        const hasSubstring = /substr|substring/i.test(code);
        const hasWindowSize = /\bk\b|\bwindowSize\b/i.test(code);

        return hasWindowVars || (hasSubstring && hasWindowSize);
    }

    private hasBinarySearchPattern(code: string): boolean {
        // Look for mid calculation and halving logic
        const hasMid = /\bmid\b.*=.*\/\s*2|\bmiddle\b/i.test(code);
        const hasHalving = /low.*high|left.*right/i.test(code);

        return hasMid && hasHalving;
    }

    private hasRecursionPattern(ast: Program): boolean {
        // Check if any function calls itself
        for (const node of ast.body) {
            if (node.type === 'FunctionDeclaration') {
                const funcDecl = node as FunctionDeclaration;
                if (this.containsSelfCall(funcDecl.body, funcDecl.name)) {
                    return true;
                }
            }
        }
        return false;
    }

    private containsSelfCall(node: ASTNode, funcName: string): boolean {
        if (!node) return false;

        if (node.type === 'CallExpression') {
            const callee = (node as any).callee;
            const calleeName = typeof callee === 'string' ? callee : callee?.name;
            if (calleeName === funcName) return true;
        }

        // Recursively check children
        for (const key of Object.keys(node)) {
            const value = (node as any)[key];
            if (Array.isArray(value)) {
                for (const child of value) {
                    if (child && typeof child === 'object' && this.containsSelfCall(child, funcName)) {
                        return true;
                    }
                }
            } else if (value && typeof value === 'object' && 'type' in value) {
                if (this.containsSelfCall(value, funcName)) return true;
            }
        }
        return false;
    }

    /**
     * Trace program execution
     */
    private traceProgram(program: Program): any {
        // Find main function
        const mainFunc = program.body.find(
            node => node.type === 'FunctionDeclaration' && (node as FunctionDeclaration).name === 'main'
        ) as FunctionDeclaration | undefined;

        if (mainFunc) {
            this.callStack.push({ functionName: 'main', args: {} });
            const result = this.traceBlock(mainFunc.body);
            this.callStack.pop();
            return result;
        }
    }

    /**
     * Trace a block of statements
     */
    private traceBlock(block: Block): any {
        for (const stmt of block.body) {
            const result = this.traceStatement(stmt);
            if (result !== undefined && stmt.type === 'ReturnStatement') {
                return result;
            }
        }
        return undefined;
    }

    /**
     * Trace a single statement
     */
    private traceStatement(node: ASTNode): any {
        const line = node.line || 0;
        const lineContent = this.codeLines[line - 1]?.trim() || '';

        switch (node.type) {
            case 'VariableDeclaration':
                return this.traceVariableDeclaration(node as any, line, lineContent);

            case 'MultiVariableDeclaration':
                return this.traceMultiVariableDeclaration(node as any, line, lineContent);

            case 'Assignment':
                return this.traceAssignment(node as any, line, lineContent);

            case 'IfStatement':
                return this.traceIfStatement(node as any, line, lineContent);

            case 'WhileStatement':
                return this.traceWhileStatement(node as any, line, lineContent);

            case 'ForStatement':
                return this.traceForStatement(node as any, line, lineContent);

            case 'ReturnStatement':
                return this.traceReturnStatement(node as any, line, lineContent);

            case 'ExpressionStatement':
                return this.traceStatement((node as any).expression);

            case 'UpdateExpression':
                return this.traceUpdateExpression(node as any, line, lineContent);

            default:
                return undefined;
        }
    }

    private traceVariableDeclaration(node: any, line: number, lineContent: string): void {
        const name = node.name;
        const value = node.init ? this.evaluate(node.init) : undefined;
        this.variables[name] = value;

        // Track arrays and pointers for visualization
        if (Array.isArray(value)) {
            this.trackedArrays.set(name, value);
        }
        if (this.isPointerVariable(name)) {
            this.trackedPointers.set(name, {
                index: typeof value === 'number' ? value : 0,
                color: this.getPointerColor(name)
            });
        }

        this.addStep(line, lineContent, 'assignment',
            this.createTeacherNote(
                `Created variable "${name}" with value ${this.formatValue(value)}`,
                `Variables store data that we can use and modify throughout our program`,
                `Continue to the next line of code`
            )
        );
    }

    private traceMultiVariableDeclaration(node: any, line: number, lineContent: string): void {
        for (const decl of node.declarations) {
            this.traceVariableDeclaration(decl, line, lineContent);
        }
    }

    private traceAssignment(node: any, line: number, lineContent: string): void {
        const name = node.left?.name || node.name;
        const oldValue = this.variables[name];
        const newValue = this.evaluate(node.value);
        this.variables[name] = newValue;

        // Update pointer tracking
        if (this.trackedPointers.has(name) && typeof newValue === 'number') {
            const pointer = this.trackedPointers.get(name)!;
            pointer.index = newValue;
        }

        this.addStep(line, lineContent, 'assignment',
            this.createTeacherNote(
                `Updated "${name}" from ${this.formatValue(oldValue)} to ${this.formatValue(newValue)}`,
                `Reassigning variables allows us to track changing state`,
                `Continue execution with the new value`
            )
        );
    }

    private traceIfStatement(node: any, line: number, lineContent: string): any {
        const conditionResult = this.evaluate(node.test);

        this.addStep(line, lineContent, 'condition',
            this.createTeacherNote(
                `Checking condition: ${this.formatCondition(node.test)} → ${conditionResult ? 'TRUE' : 'FALSE'}`,
                conditionResult
                    ? `The condition is true, so we enter the if-block`
                    : `The condition is false, so we ${node.alternate ? 'go to the else-block' : 'skip the if-block'}`,
                conditionResult
                    ? `Execute the code inside the if-block`
                    : node.alternate ? `Execute the else-block` : `Continue after the if statement`
            )
        );

        if (conditionResult) {
            if (node.consequent.type === 'Block') {
                return this.traceBlock(node.consequent);
            } else {
                return this.traceStatement(node.consequent);
            }
        } else if (node.alternate) {
            if (node.alternate.type === 'Block') {
                return this.traceBlock(node.alternate);
            } else {
                return this.traceStatement(node.alternate);
            }
        }
    }

    private traceWhileStatement(node: any, line: number, lineContent: string): any {
        let iteration = 0;
        const maxIterations = 1000; // Prevent infinite loops

        while (iteration < maxIterations) {
            const conditionResult = this.evaluate(node.test);

            this.addStep(line, lineContent, iteration === 0 ? 'loop_start' : 'loop_continue',
                this.createTeacherNote(
                    `Loop check (iteration ${iteration + 1}): ${this.formatCondition(node.test)} → ${conditionResult ? 'TRUE' : 'FALSE'}`,
                    conditionResult
                        ? `The condition is still true, so we continue looping`
                        : `The condition is now false, so we exit the loop`,
                    conditionResult
                        ? `Execute the loop body again`
                        : `Continue after the while loop`
                )
            );

            if (!conditionResult) break;

            if (node.body.type === 'Block') {
                this.traceBlock(node.body);
            } else {
                this.traceStatement(node.body);
            }

            iteration++;
        }
    }

    private traceForStatement(node: any, line: number, lineContent: string): any {
        // Initialize
        if (node.init) {
            this.traceStatement(node.init);
        }

        let iteration = 0;
        const maxIterations = 1000;

        while (iteration < maxIterations) {
            // Test condition
            const conditionResult = node.test ? this.evaluate(node.test) : true;

            this.addStep(line, lineContent, iteration === 0 ? 'loop_start' : 'loop_continue',
                this.createTeacherNote(
                    `For loop check (iteration ${iteration + 1}): ${node.test ? this.formatCondition(node.test) : 'always true'} → ${conditionResult ? 'TRUE' : 'FALSE'}`,
                    conditionResult
                        ? `Loop condition met, entering iteration ${iteration + 1}`
                        : `Loop condition failed, exiting the for loop`,
                    conditionResult
                        ? `Execute the loop body`
                        : `Continue after the for loop`
                )
            );

            if (!conditionResult) break;

            // Execute body
            if (node.body.type === 'Block') {
                this.traceBlock(node.body);
            } else {
                this.traceStatement(node.body);
            }

            // Update
            if (node.update) {
                this.traceStatement(node.update);
            }

            iteration++;
        }
    }

    private traceReturnStatement(node: any, line: number, lineContent: string): any {
        const value = node.argument ? this.evaluate(node.argument) : undefined;

        this.addStep(line, lineContent, 'return',
            this.createTeacherNote(
                `Returning ${this.formatValue(value)} from function`,
                `Return statements exit the current function and send a value back to the caller`,
                `Control returns to where this function was called`
            )
        );

        return value;
    }

    private traceUpdateExpression(node: any, line: number, lineContent: string): void {
        const name = node.argument.name;
        const oldValue = this.variables[name];
        const newValue = node.operator === '++' ? oldValue + 1 : oldValue - 1;
        this.variables[name] = newValue;

        // Update pointer tracking
        if (this.trackedPointers.has(name)) {
            const pointer = this.trackedPointers.get(name)!;
            pointer.index = newValue;
        }

        const action = node.operator === '++' ? 'Incremented' : 'Decremented';

        this.addStep(line, lineContent, 'assignment',
            this.createTeacherNote(
                `${action} "${name}" from ${oldValue} to ${newValue}`,
                this.getPointerMoveExplanation(name, node.operator),
                `Continue with the new pointer position`
            )
        );
    }

    /**
     * Add a step to the trace
     */
    private addStep(
        line: number,
        lineContent: string,
        type: TraceStep['type'],
        teacherNote: TeacherNote
    ): void {
        if (this.steps.length >= this.MAX_TOTAL_STEPS) {
            throw new Error('Trace limit exceeded (program too long or infinite loop detected)');
        }

        this.stepCounter++;

        const step: TraceStep = {
            step: this.stepCounter,
            line,
            lineContent,
            type,
            variables: { ...this.variables },
            teacherNote,
            pattern: this.detectedPattern || undefined,
            visuals: this.generateVisuals()
        };

        this.steps.push(step);
    }

    /**
     * Generate visual instructions based on current state
     */
    private generateVisuals(): VisualInstruction | undefined {
        // For Two-Pointer pattern, always show array visualization
        if (this.detectedPattern?.name === 'Two-Pointer' && this.trackedPointers.size >= 2) {
            // Get pointer values
            const leftPointer = this.trackedPointers.get('left') ||
                this.trackedPointers.get('l') ||
                this.trackedPointers.get('i');
            const rightPointer = this.trackedPointers.get('right') ||
                this.trackedPointers.get('r') ||
                this.trackedPointers.get('j');

            if (leftPointer && rightPointer) {
                // Create a conceptual array based on pointer range
                const minIndex = 0;
                const maxIndex = Math.max(rightPointer.index + 1, leftPointer.index + 1, 9);
                const conceptualArray = Array.from({ length: maxIndex }, (_, i) => i);

                const pointers = [...this.trackedPointers.entries()].map(([name, data]) => ({
                    name: this.getPointerLabel(name),
                    index: data.index,
                    color: data.color,
                    action: 'static' as const
                }));

                const visual: ArrayVisual = {
                    type: 'array_1d',
                    target: 'indices',
                    values: conceptualArray,
                    pointers,
                    highlightIndices: [leftPointer.index, rightPointer.index]
                };

                return visual;
            }
        }

        // If we have explicit arrays and pointers, create array visualization
        if (this.trackedArrays.size > 0 && this.trackedPointers.size > 0) {
            const [arrayName, arrayValues] = [...this.trackedArrays.entries()][0];

            const pointers = [...this.trackedPointers.entries()].map(([name, data]) => ({
                name: this.getPointerLabel(name),
                index: data.index,
                color: data.color,
                action: 'static' as const
            }));

            const visual: ArrayVisual = {
                type: 'array_1d',
                target: arrayName,
                values: arrayValues,
                pointers
            };

            return visual;
        }

        // For Linear Traversal with a single pointer, show array visualization
        if (this.detectedPattern?.name === 'Linear Traversal' && this.trackedPointers.size >= 1) {
            const pointer = [...this.trackedPointers.entries()][0];
            if (pointer) {
                const [name, data] = pointer;
                const arraySize = Math.max(data.index + 3, 10);
                const conceptualArray = Array.from({ length: arraySize }, (_, i) => i);

                const visual: ArrayVisual = {
                    type: 'array_1d',
                    target: 'indices',
                    values: conceptualArray,
                    pointers: [{
                        name: this.getPointerLabel(name),
                        index: data.index,
                        color: data.color,
                        action: 'static' as const
                    }],
                    highlightIndices: [data.index]
                };

                return visual;
            }
        }

        // If we have recursion, show call stack
        if (this.callStack.length > 1 || this.detectedPattern?.name === 'Recursion') {
            const visual: CallStackVisual = {
                type: 'call_stack',
                frames: [...this.callStack],
                activeFrame: this.callStack.length - 1
            };
            return visual;
        }

        return undefined;
    }

    /**
     * Evaluate an expression and return its value
     */
    private evaluate(node: ASTNode): any {
        if (!node) return undefined;

        switch (node.type) {
            case 'Literal':
                return (node as any).value;

            case 'Identifier':
                return this.variables[(node as any).name];

            case 'BinaryExpression': {
                const left = this.evaluate((node as any).left);
                const right = this.evaluate((node as any).right);
                return this.applyOperator((node as any).operator, left, right);
            }

            case 'MemberExpression': {
                const obj = this.evaluate((node as any).object);
                const prop = (node as any).computed
                    ? this.evaluate((node as any).property)
                    : (node as any).property.name;
                return Array.isArray(obj) ? obj[prop] : obj?.[prop];
            }

            case 'ArrayExpression':
                return (node as any).elements.map((el: ASTNode) => this.evaluate(el));

            case 'UpdateExpression': {
                const name = (node as any).argument.name;
                const oldValue = this.variables[name];
                const newValue = (node as any).operator === '++' ? oldValue + 1 : oldValue - 1;
                this.variables[name] = newValue;
                return (node as any).prefix ? newValue : oldValue;
            }

            default:
                return undefined;
        }
    }

    private applyOperator(op: string, left: any, right: any): any {
        switch (op) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return Math.floor(left / right);
            case '%': return left % right;
            case '<': return left < right;
            case '>': return left > right;
            case '<=': return left <= right;
            case '>=': return left >= right;
            case '==': return left === right;
            case '!=': return left !== right;
            case '&&': return left && right;
            case '||': return left || right;
            default: return undefined;
        }
    }

    // Helper methods
    private isPointerVariable(name: string): boolean {
        const pointerNames = ['left', 'right', 'l', 'r', 'i', 'j', 'low', 'high', 'mid', 'start', 'end'];
        return pointerNames.includes(name.toLowerCase());
    }

    private getPointerColor(name: string): 'red' | 'blue' | 'green' | 'orange' | 'purple' {
        const lowerName = name.toLowerCase();
        if (['left', 'l', 'low', 'start', 'i'].includes(lowerName)) return 'red';
        if (['right', 'r', 'high', 'end', 'j'].includes(lowerName)) return 'blue';
        if (['mid', 'middle'].includes(lowerName)) return 'green';
        return 'orange';
    }

    private getPointerLabel(name: string): string {
        const lowerName = name.toLowerCase();
        if (['left', 'l'].includes(lowerName)) return 'L';
        if (['right', 'r'].includes(lowerName)) return 'R';
        if (['mid', 'middle'].includes(lowerName)) return 'M';
        return name.toUpperCase().charAt(0);
    }

    private getPointerMoveExplanation(name: string, operator: string): string {
        const lowerName = name.toLowerCase();
        const direction = operator === '++' ? 'forward (right)' : 'backward (left)';

        if (['left', 'l'].includes(lowerName)) {
            return operator === '++'
                ? 'Moving the Left pointer forward to consider larger values'
                : 'Moving the Left pointer backward to reconsider smaller values';
        }
        if (['right', 'r'].includes(lowerName)) {
            return operator === '--'
                ? 'Moving the Right pointer backward to consider smaller values'
                : 'Moving the Right pointer forward to consider more values';
        }

        return `Moving pointer "${name}" ${direction}`;
    }

    private formatValue(value: any): string {
        if (value === undefined) return 'undefined';
        if (value === null) return 'null';
        if (Array.isArray(value)) return `[${value.join(', ')}]`;
        if (typeof value === 'string') return `"${value}"`;
        return String(value);
    }

    private formatCondition(node: ASTNode): string {
        if (node.type === 'BinaryExpression') {
            const binNode = node as any;
            const left = this.formatExpressionSimple(binNode.left);
            const right = this.formatExpressionSimple(binNode.right);
            return `${left} ${binNode.operator} ${right}`;
        }
        return this.formatExpressionSimple(node);
    }

    private formatExpressionSimple(node: ASTNode): string {
        if (node.type === 'Identifier') return (node as any).name;
        if (node.type === 'Literal') return String((node as any).value);
        if (node.type === 'BinaryExpression') {
            const binNode = node as any;
            return `(${this.formatExpressionSimple(binNode.left)} ${binNode.operator} ${this.formatExpressionSimple(binNode.right)})`;
        }
        return '...';
    }

    private createTeacherNote(what: string, why: string, next: string): TeacherNote {
        return { what, why, next };
    }
}
