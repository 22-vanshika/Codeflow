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

function safeStringify(obj: any): string {
    const seen = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    });
}

function createMapWithValType(tVar: string): Map<any, any> {
    const m = new Map();
    let valType = 'int';
    let depth = 0;
    let firstLess = tVar.indexOf('<');
    if (firstLess !== -1) {
        let commaIdx = -1;
        for (let i = firstLess + 1; i < tVar.length; i++) {
            if (tVar[i] === '<') depth++;
            else if (tVar[i] === '>') depth--;
            else if (tVar[i] === ',' && depth === 0) {
                commaIdx = i;
                break;
            }
        }
        if (commaIdx !== -1) {
            valType = tVar.substring(commaIdx + 1, tVar.lastIndexOf('>')).trim();
        }
    }
    (m as any).__valType = valType;
    return m;
}

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

    public has(name: string): boolean {
        return this.vars.has(name);
    }

    public assign(name: string, value: any) {
        if (this.vars.has(name)) {
            this.vars.set(name, value);
            return;
        }
        try {
            const thisVal = this.vars.has('this') ? this.vars.get('this') : ((this.parent as any) ? (this.parent as any).get('this') : null);
            let target: any = null;
            if (thisVal) {
                if (typeof thisVal === 'string' && thisVal.startsWith('#') && this.heap) {
                    target = this.heap[thisVal];
                } else if (typeof thisVal === 'object') {
                    target = thisVal;
                }
            }
            if (target && name in target) {
                target[name] = value;
                return;
            }
        } catch (e) {}
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
        try {
            const thisVal = this.vars.has('this') ? this.vars.get('this') : ((this.parent as any) ? (this.parent as any).get('this') : null);
            let target: any = null;
            if (thisVal) {
                if (typeof thisVal === 'string' && thisVal.startsWith('#') && this.heap) {
                    target = this.heap[thisVal];
                } else if (typeof thisVal === 'object') {
                    target = thisVal;
                }
            }
            if (target) {
                if (name in target) {
                    return target[name];
                }
                const className = target.__className;
                if (className) {
                    // Check if parent/global environment has class declaration to look up method
                    let current: Environment | null = this;
                    while (current && current.getParent()) {
                        current = current.getParent();
                    }
                    if (current) {
                        let cls: ClassDeclaration | undefined;
                        try {
                            cls = current.get(className);
                        } catch (e) {}
                        if (cls && cls.type === 'ClassDeclaration') {
                            const method = cls.members.find(
                                m => m.type === 'FunctionDeclaration' && (m as FunctionDeclaration).name === name
                            ) as FunctionDeclaration | undefined;
                            if (method) {
                                return {
                                    __type: 'std::class_method',
                                    method,
                                    instance: thisVal
                                };
                            }
                        }
                    }
                }
            }
        } catch (e) {}
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

function isType(tVar: string, name: string): boolean {
    if (!tVar) return false;
    const clean = tVar.replace(/\bconst\b/g, '')
                      .replace(/\bstd::/g, '')
                      .replace(/[&*]/g, '')
                      .trim();
    return clean.startsWith(name);
}

function isVector(t: string): boolean { return isType(t, 'vector') || isType(t, 'std::vector'); }
function isList(t: string): boolean { return isType(t, 'list') || isType(t, 'std::list'); }
function isMap(t: string): boolean { return isType(t, 'map') || isType(t, 'unordered_map') || isType(t, 'std::map') || isType(t, 'std::unordered_map'); }
function isSet(t: string): boolean { return isType(t, 'set') || isType(t, 'unordered_set') || isType(t, 'multiset') || isType(t, 'std::set') || isType(t, 'std::unordered_set') || isType(t, 'std::multiset'); }
function isPriorityQueue(t: string): boolean { return isType(t, 'priority_queue') || isType(t, 'std::priority_queue'); }
function isStack(t: string): boolean { return isType(t, 'stack') || isType(t, 'std::stack'); }
function isQueue(t: string): boolean { return isType(t, 'queue') || isType(t, 'std::queue'); }
function isDeque(t: string): boolean { return isType(t, 'deque') || isType(t, 'std::deque'); }
function isStringStream(t: string): boolean { return isType(t, 'stringstream') || isType(t, 'std::stringstream'); }

export class Executor implements IExecutor {
    private globals: Environment = new Environment();
    private callStack: Environment[] = [];
    private traces: ExecutionTrace[] = [];
    private heap: Record<string, any> = {};
    private heapCounter: number = 0x1000;
    private inputBuffer: string[] = [];
    private callDepth: number = 0;
    private readonly MAX_CALL_DEPTH = 1000;

    // Visualization context for step-by-step drawing
    private currentNodeId: string = 'start';
    private currentLine: number = 0;
    private sourceLines: string[] = [];
    private loopIterations: Map<number, number> = new Map();  // line -> iteration count
    private activeSwapArrayName?: string;
    private activeSwapIndices?: [number, number];
    private pointerToContainer: Map<string, string> = new Map();

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
        this.globals.define('boolalpha', '');
        this.globals.define('noboolalpha', '');
        this.globals.define('string::npos', -1);
        this.globals.define('std::string::npos', -1);

        // Standard integer limits
        this.globals.define('INT_MAX', 2147483647);
        this.globals.define('INT_MIN', -2147483648);
        this.globals.define('std::INT_MAX', 2147483647);
        this.globals.define('std::INT_MIN', -2147483648);

        // Standard library helpers
        this.globals.define('abs', Math.abs);
        this.globals.define('std::abs', Math.abs);
        this.globals.define('isdigit', (c: any) => typeof c === 'string' && /^\d$/.test(c));
        this.globals.define('std::isdigit', (c: any) => typeof c === 'string' && /^\d$/.test(c));
        this.globals.define('isalnum', (c: any) => typeof c === 'string' && /^[a-zA-Z0-9]$/.test(c));
        this.globals.define('std::isalnum', (c: any) => typeof c === 'string' && /^[a-zA-Z0-9]$/.test(c));
        this.globals.define('tolower', (c: any) => typeof c === 'string' ? c.toLowerCase() : c);
        this.globals.define('std::tolower', (c: any) => typeof c === 'string' ? c.toLowerCase() : c);
        this.globals.define('toupper', (c: any) => typeof c === 'string' ? c.toUpperCase() : c);
        this.globals.define('std::toupper', (c: any) => typeof c === 'string' ? c.toUpperCase() : c);
        this.globals.define('stoll', Number);
        this.globals.define('std::stoll', Number);
        this.globals.define('stoi', Number);
        this.globals.define('std::stoi', Number);
        this.globals.define('to_string', String);
        this.globals.define('std::to_string', String);

        // Accumulate and memset
        this.globals.define('accumulate', (startIt: any, endIt: any, initVal: number) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                return arr.reduce((sum: number, val: number) => sum + val, initVal);
            }
            return initVal;
        });
        this.globals.define('std::accumulate', (startIt: any, endIt: any, initVal: number) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                return arr.reduce((sum: number, val: number) => sum + val, initVal);
            }
            return initVal;
        });

        const recursiveFill = (arr: any[], val: number) => {
            for (let i = 0; i < arr.length; i++) {
                if (Array.isArray(arr[i])) {
                    recursiveFill(arr[i], val);
                } else {
                    arr[i] = val;
                }
            }
        };
        this.globals.define('memset', (ptr: any, val: number, size: number) => {
            if (Array.isArray(ptr)) {
                recursiveFill(ptr, val);
            }
            return ptr;
        });
        this.globals.define('std::memset', (ptr: any, val: number, size: number) => {
            if (Array.isArray(ptr)) {
                recursiveFill(ptr, val);
            }
            return ptr;
        });

        // Lower bound
        this.globals.define('lower_bound', (startIt: any, endIt: any, val: number) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                let l = startIt.index || 0;
                let r = endIt.index !== undefined ? endIt.index : arr.length;
                while (l < r) {
                    const mid = Math.floor((l + r) / 2);
                    if (arr[mid] >= val) r = mid;
                    else l = mid + 1;
                }
                return { container: arr, index: l };
            }
            return { container: [], index: 0 };
        });
        this.globals.define('std::lower_bound', (startIt: any, endIt: any, val: number) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                let l = startIt.index || 0;
                let r = endIt.index !== undefined ? endIt.index : arr.length;
                while (l < r) {
                    const mid = Math.floor((l + r) / 2);
                    if (arr[mid] >= val) r = mid;
                    else l = mid + 1;
                }
                return { container: arr, index: l };
            }
            return { container: [], index: 0 };
        });

        // Long limits
        this.globals.define('LONG_MIN', BigInt('-9223372036854775808') as any);
        this.globals.define('std::LONG_MIN', BigInt('-9223372036854775808') as any);
        this.globals.define('LONG_MAX', BigInt('9223372036854775807') as any);
        this.globals.define('std::LONG_MAX', BigInt('9223372036854775807') as any);

        // max_element, min_element, reverse
        const maxElem = (startIt: any, endIt: any) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                let maxVal = -Infinity;
                let maxIdx = -1;
                for (let i = startIt.index || 0; i < (endIt.index !== undefined ? endIt.index : arr.length); i++) {
                    if (arr[i] > maxVal) {
                        maxVal = arr[i];
                        maxIdx = i;
                    }
                }
                return { container: arr, index: maxIdx };
            }
            return { container: [], index: 0 };
        };
        this.globals.define('max_element', maxElem);
        this.globals.define('std::max_element', maxElem);

        const minElem = (startIt: any, endIt: any) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                let minVal = Infinity;
                let minIdx = -1;
                for (let i = startIt.index || 0; i < (endIt.index !== undefined ? endIt.index : arr.length); i++) {
                    if (arr[i] < minVal) {
                        minVal = arr[i];
                        minIdx = i;
                    }
                }
                return { container: arr, index: minIdx };
            }
            return { container: [], index: 0 };
        };
        this.globals.define('min_element', minElem);
        this.globals.define('std::min_element', minElem);

        const revIt = function*(this: Executor, startIt: any, endIt: any) {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                const containerName = startIt.containerName || 'array';
                let l = startIt.index || 0;
                let r = (endIt.index !== undefined ? endIt.index : arr.length) - 1;
                while (l < r) {
                    const tmp = arr[l];
                    arr[l] = arr[r];
                    arr[r] = tmp;
                    this.activeSwapArrayName = containerName;
                    this.activeSwapIndices = [l, r];
                    yield this.createTrace(this.currentLine || 0, 'assignment', `Reversing array: swapped index ${l} and ${r} (${arr[r]} ⇄ ${arr[l]})`);
                    this.activeSwapArrayName = undefined;
                    this.activeSwapIndices = undefined;
                    l++; r--;
                }
            }
        };
        this.globals.define('reverse', revIt);
        this.globals.define('std::reverse', revIt);

        // std::count - count occurrences of value in range
        const countFn = (startIt: any, endIt: any, val: any) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                const s = startIt.index || 0;
                const e = endIt && endIt.index !== undefined ? endIt.index : arr.length;
                return arr.slice(s, e).filter((v: any) => v === val).length;
            }
            if (Array.isArray(startIt)) {
                return startIt.filter((v: any) => v === val).length;
            }
            return 0;
        };
        this.globals.define('count', countFn);
        this.globals.define('std::count', countFn);

        // std::fill - fill range with value
        const fillFn = (startIt: any, endIt: any, val: any) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                const s = startIt.index || 0;
                const e = endIt && endIt.index !== undefined ? endIt.index : arr.length;
                for (let i = s; i < e; i++) arr[i] = val;
            }
        };
        this.globals.define('fill', fillFn);
        this.globals.define('std::fill', fillFn);

        // std::iota - fill with increasing values
        const iotaFn = (startIt: any, endIt: any, val: any) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                const s = startIt.index || 0;
                const e = endIt && endIt.index !== undefined ? endIt.index : arr.length;
                for (let i = s; i < e; i++) { arr[i] = val; val++; }
            }
        };
        this.globals.define('iota', iotaFn);
        this.globals.define('std::iota', iotaFn);

        // std::rotate 
        const rotateFn = (first: any, middle: any, last: any) => {
            if (first && first.container) {
                const arr = first.container;
                const f = first.index || 0;
                const m = middle && middle.index !== undefined ? middle.index : f + 1;
                const l = last && last.index !== undefined ? last.index : arr.length;
                const part = arr.splice(f, m - f);
                arr.splice(l - (m - f), 0, ...part);
            }
        };
        this.globals.define('rotate', rotateFn);
        this.globals.define('std::rotate', rotateFn);

        // std::unique - remove consecutive duplicates
        const uniqueFn = (startIt: any, endIt: any) => {
            if (startIt && startIt.container) {
                const arr = startIt.container;
                const s = startIt.index || 0;
                const e = endIt && endIt.index !== undefined ? endIt.index : arr.length;
                let newEnd = s;
                for (let i = s; i < e; i++) {
                    if (i === s || arr[i] !== arr[i-1]) { arr[newEnd++] = arr[i]; }
                }
                return { container: arr, index: newEnd };
            }
            return endIt;
        };
        this.globals.define('unique', uniqueFn);
        this.globals.define('std::unique', uniqueFn);
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
        const generator = this.executeInternal(source, input);
        let count = 0;
        let lastTrace: ExecutionTrace | undefined;
        try {
            for (const trace of generator) {
                count++;
                lastTrace = trace;
                if (count <= 1000) {
                    yield trace;
                }
            }
        } catch (e: any) {
            throw e;
        }
        if (count > 1000 && lastTrace) {
            yield lastTrace;
        }
    }

    private *executeInternal(source: string, input: string = ""): Generator<ExecutionTrace> {
        this.parseInput(input);
        this.pointerToContainer.clear();
        this.sourceLines = source.split('\n');

        const lexer = new Lexer(source);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);

        const ast = parser.parse();

        if (ast.type === 'Program') {

            for (const node of ast.body) {
                if (node.type === 'FunctionDeclaration') {
                    const func = node as FunctionDeclaration;
                    this.globals.define(func.name, func);
                } else if (node.type === 'ClassDeclaration') {
                    const cls = node as ClassDeclaration;
                    this.globals.define(cls.name, cls);
                    const registerNested = (c: ClassDeclaration) => {
                        for (const member of c.members) {
                            if (member.type === 'ClassDeclaration') {
                                const nestedCls = member as ClassDeclaration;
                                this.globals.define(nestedCls.name, nestedCls);
                                registerNested(nestedCls);
                            }
                        }
                    };
                    registerNested(cls);
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

    private getDefaultValueForDeclaration(decl: VariableDeclaration): any {
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
                        else if (t.includes('*')) arr[i] = null;
                        else arr[i] = {};
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
        if (decl.varType) {
            const t = decl.varType;
            if (isPriorityQueue(t)) {
                return { __type: 'std::priority_queue', elements: [], isMinHeap: t.includes('greater') };
            } else if (isVector(t) || isStack(t) || isList(t)) {
                const value: any[] = [];
                if (isList(t)) (value as any).__type = 'std::list';
                else if (isStack(t)) (value as any).__type = 'std::stack';
                else if (isVector(t)) (value as any).__type = 'std::vector';
                return value;
            } else if (isQueue(t)) {
                const value: any[] = [];
                (value as any).__type = 'std::queue';
                return value;
            } else if (isDeque(t)) {
                const value: any[] = [];
                (value as any).__type = 'std::deque';
                return value;
            } else if (isMap(t)) {
                return createMapWithValType(t);
            } else if (isSet(t)) {
                return new Set();
            } else if (isType(t, 'pair')) {
                return { first: 0, second: 0 };
            } else if (isType(t, 'string')) {
                return "";
            } else if (isType(t, 'int') || isType(t, 'double') || isType(t, 'float') || isType(t, 'bool') || isType(t, 'char') || isType(t, 'long') || isType(t, 'size_t') || isType(t, 'unsigned')) {
                return 0;
            }
        }
        return undefined;
    }

    private preAllocateVariables(block: Block, env: Environment) {
        const self = this;
        function scan(node: ASTNode) {
            if (!node) return;
            if (node.type === 'VariableDeclaration') {
                const decl = node as VariableDeclaration;
                if (!env.has(decl.name)) {
                    const val = self.getDefaultValueForDeclaration(decl);
                    env.define(decl.name, val);
                }
            } else if (node.type === 'MultiVariableDeclaration') {
                const multi = node as MultiVariableDeclaration;
                for (const decl of multi.declarations) {
                    if (!env.has(decl.name)) {
                        const val = self.getDefaultValueForDeclaration(decl);
                        env.define(decl.name, val);
                    }
                }
            } else {
                for (const key of Object.keys(node)) {
                    const child = (node as any)[key];
                    if (child && typeof child === 'object') {
                        if (Array.isArray(child)) {
                            child.forEach(scan);
                        } else if (child.type) {
                            scan(child);
                        }
                    }
                }
            }
        }
        if (block && block.body) {
            for (const stmt of block.body) {
                scan(stmt);
            }
        }
    }

    private *executeFunction(func: FunctionDeclaration, args: any[], thisObj?: any): Generator<ExecutionTrace> {
        if (this.callDepth >= this.MAX_CALL_DEPTH) {
            throw new Error(`Runtime Error: Maximum recursion depth exceeded (${this.MAX_CALL_DEPTH} levels). Check for infinite recursion.`);
        }
        this.callDepth++;
        const env = new Environment(this.globals);
        (env as any).functionName = func.name;
        if (thisObj !== undefined) {
            env.define('this', thisObj);
        }

        // Define arguments
        func.params.forEach((param, index) => {
            env.define(param.name, args[index]);
        });

        this.callStack.push(env);
        this.preAllocateVariables(func.body, env);
        yield this.createTrace(func.line || 0, 'function_call', `Called ${func.name}`);

        try {
            yield* this.visitBlock(func.body);
        } catch (e: any) {
            if (e instanceof ReturnException) {
                this.callStack.pop();
                this.callDepth--;
                return e.value;
            }
            throw e;
        }

        this.callStack.pop();
        this.callDepth--;
    }

    private *executeClosure(closure: any, args: any[]): Generator<ExecutionTrace> {
        const func = closure.declaration;
        const env = new Environment(closure.lexicalEnv);
        (env as any).functionName = func.name || 'lambda';

        // Define arguments
        func.params.forEach((param: any, index: number) => {
            env.define(param.name, args[index]);
        });

        this.callStack.push(env);
        yield this.createTrace(func.line || 0, 'function_call', `Called lambda`);

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
        this.currentLine = node.line || this.currentLine || 0;
        switch (node.type) {
            case 'VariableDeclaration': {
                const decl = node as VariableDeclaration;
                let value: any = undefined;
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
                                else if (t.includes('*')) arr[i] = null;
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
                    // Default initialization for STL and user-defined types
                    const t = decl.varType;
                    if (isPriorityQueue(t)) {
                        value = { __type: 'std::priority_queue', elements: [], isMinHeap: t.includes('greater') };
                    } else if (isVector(t) || isStack(t) || isList(t)) {
                        value = [];
                        if (isList(t)) (value as any).__type = 'std::list';
                        else if (isStack(t)) (value as any).__type = 'std::stack';
                        else if (isVector(t)) (value as any).__type = 'std::vector';
                    } else if (isQueue(t)) {
                        value = [];
                        (value as any).__type = 'std::queue';
                    } else if (isDeque(t)) {
                        value = [];
                        (value as any).__type = 'std::deque';
                    } else if (isMap(t)) {
                        value = createMapWithValType(t);
                    } else if (isSet(t)) {
                        value = new Set();
                    } else if (isType(t, 'pair')) {
                        value = { first: 0, second: 0 };
                    } else if (isType(t, 'string')) {
                        value = "";
                    } else if (isType(t, 'int') || isType(t, 'double') || isType(t, 'float') || isType(t, 'bool') || isType(t, 'char') || isType(t, 'long') || isType(t, 'size_t') || isType(t, 'unsigned')) {
                        value = 0;
                    } else {
                        // User-defined class default initialization
                        let cls: ClassDeclaration | undefined;
                        try {
                            cls = this.currentEnv().get(t);
                        } catch (e) {}

                        if (cls && cls.type === 'ClassDeclaration') {
                            const instance: any = { __className: t };
                            const createDefaultValue = (d: VariableDeclaration): any => {
                                 if (d.arrayDimensions && d.arrayDimensions.length > 0) {
                                     const createArray = (dims: number[]): any[] => {
                                         if (dims.length === 0) return 0 as any;
                                         const size = dims[0];
                                         const arr = new Array(size);
                                         if (dims.length === 1) {
                                             for (let i = 0; i < size; i++) {
                                                 const tVar = d.varType || '';
                                                 if (tVar.includes('int') || tVar.includes('float') || tVar.includes('double') || tVar.includes('long')) arr[i] = 0;
                                                 else if (tVar.includes('bool')) arr[i] = false;
                                                 else if (tVar.includes('string')) arr[i] = "";
                                                 else if (tVar.includes('char')) arr[i] = '\0';
                                                 else arr[i] = null;
                                             }
                                         } else {
                                             for (let i = 0; i < size; i++) {
                                                 arr[i] = createArray(dims.slice(1));
                                             }
                                         }
                                         return arr;
                                     };
                                     return createArray(d.arrayDimensions);
                                 }
                                 const tVar = d.varType || '';
                                 if (isPriorityQueue(tVar)) return { __type: 'std::priority_queue', elements: [], isMinHeap: tVar.includes('greater') };
                                 if (isVector(tVar) || isStack(tVar) || isList(tVar)) {
                                     const arr: any[] = [];
                                     if (isList(tVar)) (arr as any).__type = 'std::list';
                                     else if (isStack(tVar)) (arr as any).__type = 'std::stack';
                                     else if (isVector(tVar)) (arr as any).__type = 'std::vector';
                                     return arr;
                                 }
                                 if (isQueue(tVar)) {
                                     const q: any[] = [];
                                     (q as any).__type = 'std::queue';
                                     return q;
                                 }
                                 if (isDeque(tVar)) {
                                     const dq: any[] = [];
                                     (dq as any).__type = 'std::deque';
                                     return dq;
                                 }
                                 if (isMap(tVar)) {
                                     return createMapWithValType(tVar);
                                 }
                                 if (isSet(tVar)) return new Set();
                                 if (isType(tVar, 'pair')) return { first: 0, second: 0 };
                                 if (isType(tVar, 'string')) return "";
                                 if (isType(tVar, 'int') || isType(tVar, 'double') || isType(tVar, 'float') || isType(tVar, 'char') || isType(tVar, 'long')) return 0;
                                 if (tVar.includes('*')) return null;
                                 return null;
                             };
                            for (const mem of cls.members) {
                                if (mem.type === 'VariableDeclaration') {
                                    const d = mem as VariableDeclaration;
                                    let val = createDefaultValue(d);
                                    if (d.init) {
                                        val = yield* this.evaluate(d.init);
                                    }
                                    instance[d.name] = val;
                                } else if (mem.type === 'MultiVariableDeclaration') {
                                    const multi = mem as MultiVariableDeclaration;
                                    for (const d of multi.declarations) {
                                        let val = createDefaultValue(d);
                                        if (d.init) {
                                            val = yield* this.evaluate(d.init);
                                        }
                                        instance[d.name] = val;
                                    }
                                }
                            }
                            value = instance;
                        }
                    }
                }
                this.currentEnv().define(decl.name, value);
                yield this.createTrace(decl.line || 0, 'definition', `Declared ${decl.name} = ${value !== undefined ? safeStringify(value) : '?'}`, {
                    astNode: decl.init || undefined,
                    assignmentDetail: {
                        sources: decl.init ? this.extractSources(decl.init) : [],
                        dest: { name: decl.name },
                        value: value
                    }
                });
                break;
            }
            case 'MultiVariableDeclaration': {
                const multi = node as MultiVariableDeclaration;
                for (const decl of multi.declarations) {
                    yield* this.executeStatement(decl);
                }
                break;
            }
            case 'StructuredBindingDeclaration': {
                const sb = node as any;
                const evaluated = yield* this.evaluate(sb.init);
                for (let i = 0; i < sb.names.length; i++) {
                    const name = sb.names[i];
                    let val: any = undefined;
                    if (evaluated && typeof evaluated === 'object') {
                        if (i === 0 && 'first' in evaluated) val = evaluated.first;
                        else if (i === 1 && 'second' in evaluated) val = evaluated.second;
                        else if (Array.isArray(evaluated)) val = evaluated[i];
                        else val = evaluated[name];
                    }
                    this.currentEnv().define(name, val);
                }
                yield this.createTrace(sb.line || 0, 'definition', `Unpacked ${sb.names.join(', ')}`, {
                    astNode: sb.init || undefined
                });
                break;
            }
            case 'ClassDeclaration': {
                const cls = node as ClassDeclaration;
                console.log("DEBUG ClassDeclaration name =", cls.name, "members =", cls.members.map(m => ({ type: m.type, name: (m as any).name })));
                this.currentEnv().define(cls.name, cls);
                for (const member of cls.members) {
                    if (member.type === 'ClassDeclaration') {
                        this.currentEnv().define((member as ClassDeclaration).name, member);
                    }
                }
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
                yield this.createTrace(ret.line || 0, 'return', `Returned ${value}`, {
                    astNode: ret.argument || undefined
                });
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
                    why: test
                        ? `Condition is TRUE → entering if-block`
                        : ifStmt.alternate
                            ? `Condition is FALSE → entering else-block`
                            : `Condition is FALSE → skipping if-block`,
                    next: test
                        ? `Execute if-block.`
                        : ifStmt.alternate
                            ? `Execute else-block.`
                            : `Skip to after the if-block.`,
                    astNode: ifStmt.test
                });

                if (test) {
                    yield* this.visitStatement(ifStmt.consequent);
                } else if (ifStmt.alternate) {
                    yield* this.visitStatement(ifStmt.alternate);
                }
                break;
            }
            case 'BreakStatement': {
                yield this.createTrace(node.line || 0, 'condition', 'break — exiting loop', {
                    pathTaken: 'true',
                    why: 'break statement → exits loop immediately',
                    next: 'Continue after the loop.'
                });
                throw new BreakException();
            }
            case 'ContinueStatement': {
                yield this.createTrace(node.line || 0, 'condition', 'continue — skip to next iteration', {
                    pathTaken: 'true',
                    why: 'continue statement → skips rest of this iteration',
                    next: 'Jump to the next loop iteration.'
                });
                throw new ContinueException();
            }
            case 'DeleteStatement': {
                const del = node as any;
                const addr = yield* this.evaluate(del.argument);
                if (typeof addr === 'string' && addr.startsWith('#')) {
                    delete this.heap[addr];
                }
                yield this.createTrace(del.line || 0, 'definition', `Deleted heap allocated node at ${addr}`);
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
                            `while: condition = true (iteration ${iteration})`, {
                            loopIteration: iteration,
                            pathTaken: 'true',
                            why: `Iteration ${iteration}: condition is true → entering loop body`,
                            next: `Run loop body (iteration ${iteration}).`,
                            astNode: loop.test
                        });
                        try {
                            yield* this.visitStatement(loop.body);
                        } catch (e: any) {
                            if (e instanceof BreakException) {
                                yield this.createTrace(loopLine, 'loop_end',
                                    `while: break — exiting after iteration ${iteration}`, {
                                    loopIteration: iteration,
                                    pathTaken: 'true',
                                    why: `break statement executed → loop exits`,
                                    next: `Continue after the loop.`
                                });
                                break;
                            }
                            if (e instanceof ContinueException) {
                                continue;
                            }
                            throw e;
                        }
                    } else {
                        yield this.createTrace(loopLine, 'loop_end',
                            `while: condition = false — loop exits after ${iteration - 1} iteration(s)`, {
                            loopIteration: iteration,
                            pathTaken: 'false',
                            why: `Condition is false after ${iteration - 1} iteration(s) → loop done`,
                            next: `Continue after the loop.`,
                            astNode: loop.test
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
                    const rangeVar = (loop as any).rangeVariable as any;
                    let container = yield* this.evaluate((loop as any).rangeContainer);
                    if (typeof container === 'string' && container.startsWith('#')) {
                        container = this.heap[container];
                    }
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
                        if (rangeVar.type === 'StructuredBindingDeclaration') {
                            const sb = rangeVar as any;
                            const val1 = item && item.first !== undefined ? item.first : (Array.isArray(item) ? item[0] : undefined);
                            const val2 = item && item.second !== undefined ? item.second : (Array.isArray(item) ? item[1] : undefined);
                            env.define(sb.names[0], val1);
                            env.define(sb.names[1], val2);
                        } else {
                            env.define(rangeVar.name, item);
                        }
                        this.callStack.push(env);

                        const iterLabel = rangeVar.type === 'StructuredBindingDeclaration' 
                            ? `[${(rangeVar as any).names.join(', ')}]` 
                            : rangeVar.name;

                        // Store the current iteration index so generateVisuals can highlight it
                        env.define('__rangeForIndex', iteration - 1);
                        env.define('__rangeForArray', rangeVar.type !== 'StructuredBindingDeclaration' ? rangeVar.name : '');

                        const itemStr = typeof item === 'object' && item !== null ? safeStringify(item) : item;
                        yield this.createTrace(loopLine, iteration === 1 ? 'loop_start' : 'loop_continue',
                            `for: ${iterLabel} = ${itemStr} (iteration ${iteration})`, {
                            loopIteration: iteration,
                            pathTaken: 'true',
                            why: `Iteration ${iteration}: ${iterLabel} = ${itemStr}`,
                            next: `Run loop body.`,
                            astNode: (loop as any).rangeContainer || undefined
                        });

                        try {
                            yield* this.visitStatement(loop.body);
                        } catch (e: any) {
                            if (e instanceof BreakException) {
                                yield this.createTrace(loopLine, 'loop_end',
                                    `for: break — exiting after iteration ${iteration}`, {
                                    loopIteration: iteration,
                                    pathTaken: 'true',
                                    why: `break executed → loop exits`,
                                    next: `Continue after the loop.`
                                });
                                this.callStack.pop();
                                break;
                            }
                            if (e instanceof ContinueException) {
                                this.callStack.pop();
                                continue;
                            }
                            this.callStack.pop();
                            throw e;
                        }

                        this.callStack.pop();
                    }

                    yield this.createTrace(loopLine, 'loop_end',
                        `for: all ${iteration} element(s) processed — loop done`, {
                        loopIteration: iteration,
                        pathTaken: 'false',
                        why: `All ${iteration} element(s) processed → loop exits`,
                        next: `Continue after the loop.`
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
                                `for: condition = true (iteration ${iteration})`, {
                                loopIteration: iteration,
                                pathTaken: 'true',
                                why: `Iteration ${iteration}: condition is true → run loop body`,
                                next: `Run loop body (iteration ${iteration}).`,
                                astNode: loop.test
                            });
                        } else {
                            yield this.createTrace(loopLine, 'loop_end',
                                `for: condition = false — loop exits after ${iteration - 1} iteration(s)`, {
                                loopIteration: iteration,
                                pathTaken: 'false',
                                why: `Condition is false after ${iteration - 1} iteration(s) → loop done`,
                                next: `Continue after the loop.`,
                                astNode: loop.test
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
                                `for: break — exiting after iteration ${iteration}`, {
                                loopIteration: iteration,
                                pathTaken: 'true',
                                why: `break executed → loop exits`,
                                next: `Continue after the loop.`
                            });
                            break;
                        }
                        if (e instanceof ContinueException) {
                            if (loop.update) {
                                yield* this.evaluate(loop.update);
                            }
                            continue;
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
                    const isCharComp = typeof currentVal === 'string' && currentVal.length === 1 && typeof right === 'number';
                    let cVal = isCharComp ? currentVal.charCodeAt(0) : currentVal;
                    let rVal = right;
                    let res: any;

                    if (op === '+') {
                        if (!isCharComp && (typeof currentVal === 'string' || typeof right === 'string')) {
                            res = String(currentVal) + String(right);
                        } else {
                            res = cVal + rVal;
                        }
                    } else if (op === '-') res = cVal - rVal;
                    else if (op === '*') res = cVal * rVal;
                    else if (op === '/') res = cVal / rVal;
                    else if (op === '%') res = cVal % rVal;
                    else if (op === '&') res = cVal & rVal;
                    else if (op === '|') res = cVal | rVal;
                    else if (op === '^') res = cVal ^ rVal;
                    else if (op === '<<') res = cVal << rVal;
                    else if (op === '>>') res = cVal >> rVal;

                    if (isCharComp) {
                        right = String.fromCharCode(res);
                    } else {
                        right = res;
                    }
                }

                // Handle left-hand side assignment
                if (assign.left) {
                    if (assign.left.type === 'Identifier') {
                        const name = (assign.left as Identifier).name;
                        this.currentEnv().assign(name, right);
                        yield this.createTrace(assign.line || 0, 'assignment', `${name} = ${right}`, {
                            astNode: assign.value,
                            assignmentDetail: {
                                sources: this.extractSources(assign.value),
                                dest: this.extractDest(assign.left),
                                value: right
                            }
                        });
                    } else if (assign.left.type === 'MemberExpression') {
                        const mem = assign.left as MemberExpression;
                        const obj = yield* this.evaluate(mem.object);
                        let target = obj;
                        if (typeof obj === 'string' && obj.startsWith('#')) target = this.heap[obj];
                        else if (obj && typeof obj === 'object' && 'container' in obj && 'index' in obj) {
                            target = obj.container[obj.index];
                        }

                        if (mem.computed) {
                            if (mem.object.type === 'Identifier' && mem.property.type === 'Identifier') {
                                const objName = (mem.object as Identifier).name;
                                const propName = (mem.property as Identifier).name;
                                this.pointerToContainer.set(propName, objName);
                            }
                            const idx = yield* this.evaluate(mem.property);
                            if (typeof obj === 'string' && !obj.startsWith('#')) {
                                const strArr = obj.split('');
                                strArr[idx] = right;
                                const newStr = strArr.join('');
                                if (mem.object.type === 'Identifier') {
                                    const varName = (mem.object as Identifier).name;
                                    this.currentEnv().assign(varName, newStr);
                                }
                                yield this.createTrace(assign.line || 0, 'assignment', `${this.getNodeString(mem.object)}[${idx}] = ${right}`, {
                                    astNode: assign.value,
                                    assignmentDetail: {
                                        sources: this.extractSources(assign.value),
                                        dest: this.extractDest(assign.left),
                                        value: right
                                    }
                                });
                            } else if (target instanceof Map) {
                                target.set(idx, right);
                                yield this.createTrace(assign.line || 0, 'assignment', `${this.getNodeString(mem.object)}[${idx}] = ${right}`, {
                                    astNode: assign.value,
                                    assignmentDetail: {
                                        sources: this.extractSources(assign.value),
                                        dest: this.extractDest(assign.left),
                                        value: right
                                    }
                                });
                            } else {
                                target[idx] = right;
                                this.trackMatrixAccess(target, idx);
                                yield this.createTrace(assign.line || 0, 'assignment', `${this.getNodeString(mem.object)}[${idx}] = ${right}`, {
                                    astNode: assign.value,
                                    assignmentDetail: {
                                        sources: this.extractSources(assign.value),
                                        dest: this.extractDest(assign.left),
                                        value: right
                                    }
                                });
                            }
                        } else {
                            const prop = (mem.property as Identifier).name;
                            if (target instanceof Map) {
                                // Map string key?
                                target.set(prop, right);
                            } else {
                                target[prop] = right;
                            }
                            yield this.createTrace(assign.line || 0, 'assignment', `${this.getNodeString(mem.object)}.${prop} = ${right}`, {
                                astNode: assign.value,
                                assignmentDetail: {
                                    sources: this.extractSources(assign.value),
                                    dest: this.extractDest(assign.left),
                                    value: right
                                }
                            });
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

                if (bin.operator === '&&') {
                    if (!left) return false;
                    const rightVal = yield* this.evaluate(bin.right);
                    return !!rightVal;
                }
                if (bin.operator === '||') {
                    if (left) return true;
                    const rightVal = yield* this.evaluate(bin.right);
                    return !!rightVal;
                }

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

                const isChar = (v: any) => typeof v === 'string' && v.length === 1;
                let lVal = left;
                let rVal = right;

                if (bin.operator === '+') {
                    if (left && typeof left === 'object' && 'container' in left && 'index' in left && typeof right === 'number') {
                        return { ...left, index: left.index + right };
                    }
                    if (right && typeof right === 'object' && 'container' in right && 'index' in right && typeof left === 'number') {
                        return { ...right, index: right.index + left };
                    }
                    if (isChar(left) && typeof right === 'number') {
                        return left.charCodeAt(0) + right;
                    }
                    if (isChar(right) && typeof left === 'number') {
                        return left + right.charCodeAt(0);
                    }
                    if (typeof left === 'string' || typeof right === 'string') {
                        return String(left) + String(right);
                    }
                    return left + right;
                }

                if (isChar(left)) lVal = left.charCodeAt(0);
                if (isChar(right)) rVal = right.charCodeAt(0);

                // cout <<  — use raw `right` (before isChar charcode conversion)
                if (bin.operator === '<<' && left && (left.__type === 'std::cout')) {
                    const rawRight = right; // original value before any charcode conversion

                    // ── stream manipulators (boolalpha, noboolalpha, '') — silently ignore ──
                    if (rawRight === '' || rawRight === null || rawRight === undefined) {
                        return left;
                    }

                    // ── endl / newline ──────────────────────────────────────────────
                    const isEndl = rawRight === '\n' || rawRight === '\\n';
                    if (isEndl) {
                        this.outputBuffer += '\n';
                        // Show a trace so the user sees the newline
                        const sofar = this.outputBuffer.trimEnd().replace(/\n/g, ' ↵ ');
                        yield this.createTrace(bin.line || 0, 'output', `↵  New line (endl)`, {
                            why: sofar ? `Output so far: "${sofar}"` : `Output buffer is now on a new line`
                        });
                        return left;
                    }

                    // ── Determine what to append to the output buffer ───────────────
                    let printedStr: string;
                    let displayStr: string;  // human-friendly label for the trace

                    if (typeof rawRight === 'string') {
                        printedStr = rawRight;
                        if (rawRight === ' ') {
                            displayStr = `" " (space)`;
                        } else if (rawRight.length === 1) {
                            // single char literal  e.g. 'a'
                            displayStr = rawRight;
                        } else {
                            displayStr = `"${rawRight}"`;
                        }
                    } else if (typeof rawRight === 'number') {
                        printedStr = String(rawRight);
                        displayStr  = String(rawRight);
                    } else if (typeof rawRight === 'boolean') {
                        printedStr = rawRight ? 'true' : 'false';
                        displayStr  = printedStr;
                    } else {
                        // arrays, maps, objects
                        printedStr = safeStringify(rawRight);
                        displayStr  = printedStr;
                    }

                    this.outputBuffer += printedStr;

                    // Build a running "output so far" view (replace newlines with ↵)
                    const bufView = this.outputBuffer.replace(/\n/g, ' ↵ ');
                    yield this.createTrace(bin.line || 0, 'output', `Printed: ${displayStr}`, {
                        why: `Output so far: "${bufView}"`
                    });
                    return left; // Return cout for chaining  (cout << a << b)
                }

                switch (bin.operator) {
                    case '+': return lVal + rVal;
                    case '-': {
                        if (lVal && typeof lVal === 'object' && 'container' in lVal && 'index' in lVal) {
                            if (rVal && typeof rVal === 'object' && 'container' in rVal && 'index' in rVal) {
                                return lVal.index - rVal.index;
                            }
                            if (typeof rVal === 'number') {
                                return { ...lVal, index: lVal.index - rVal };
                            }
                        }
                        return lVal - rVal;
                    }
                    case '*': return lVal * rVal;
                    case '/': {
                        if (typeof lVal === 'number' && typeof rVal === 'number') {
                            if (Number.isInteger(lVal) && Number.isInteger(rVal)) {
                                return Math.trunc(lVal / rVal);
                            }
                            return lVal / rVal;
                        }
                        return lVal / rVal;
                    }
                    case '%': return lVal % rVal;
                    case '==': {
                        if (lVal && typeof lVal === 'object' && 'container' in lVal && rVal && typeof rVal === 'object' && 'container' in rVal) {
                            if (lVal.isEnd && rVal.isEnd) return true;
                            if (lVal.isEnd || rVal.isEnd) return false;
                            return lVal.key === rVal.key || lVal.index === rVal.index;
                        }
                        return lVal === rVal;
                    }
                    case '!=': {
                        if (lVal && typeof lVal === 'object' && 'container' in lVal && rVal && typeof rVal === 'object' && 'container' in rVal) {
                            if (lVal.isEnd && rVal.isEnd) return false;
                            if (lVal.isEnd || rVal.isEnd) return true;
                            return lVal.key !== rVal.key && lVal.index !== rVal.index;
                        }
                        return lVal !== rVal;
                    }
                    case '<': return lVal < rVal;
                    case '>': return lVal > rVal;
                    case '<=': return lVal <= rVal;
                    case '>=': return lVal >= rVal;
                    case '&&': return lVal && rVal;
                    case '||': return lVal || rVal;
                    case '&': return lVal & rVal;
                    case '|': return lVal | rVal;
                    case '^': return lVal ^ rVal;
                    case '<<': return lVal << rVal;
                    case '>>': return lVal >> rVal;
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
                    const funcName = (call.callee as Identifier).name;

                    // STL Constructor Calls Interception, e.g. vector<int>(n, 0)
                    if (isVector(funcName)) {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        // Determine default fill value based on inner type
                        const innerTypeMatch = funcName.match(/vector\s*<(.+)>$/);
                        const innerType = innerTypeMatch ? innerTypeMatch[1].trim() : 'int';
                        const isInnerVector = isVector(innerType);
                        const isInnerString = innerType === 'string' || innerType === 'std::string';
                        const isInnerBool = innerType === 'bool';
                        const getDefault = () => {
                            if (isInnerVector) return [];
                            if (isInnerString) return '';
                            if (isInnerBool) return false;
                            if (isMap(innerType)) return new Map();
                            if (isSet(innerType)) return new Set();
                            return 0;
                        };
                        let vec: any[] = [];
                        if (args.length === 1 && typeof args[0] === 'number') {
                            vec = new Array(args[0]).fill(null).map(() => getDefault());
                        } else if (args.length === 2 && typeof args[0] === 'number') {
                            // Could be fill value or iterator-based copy
                            if (typeof args[1] === 'object' && args[1] !== null && 'container' in args[1]) {
                                // Iterator-based copy - iterate from args[0].begin to args[1].end
                                vec = [];
                            } else {
                                // Fill with default value - create fresh arrays for vector<vector<>>
                                let fillVal = args[1];
                                if (typeof fillVal === 'string' && fillVal.startsWith('#')) {
                                    fillVal = this.heap[fillVal];
                                }
                                vec = new Array(args[0]).fill(null).map(() => Array.isArray(fillVal) ? [...fillVal] : fillVal);
                            }
                        }
                        (vec as any).__type = 'std::vector';
                        return vec;
                    }
                    if (isStack(funcName)) {
                        const s: any[] = [];
                        (s as any).__type = 'std::stack';
                        return s;
                    }
                    if (isQueue(funcName)) {
                        const q: any[] = [];
                        (q as any).__type = 'std::queue';
                        return q;
                    }
                    if (isDeque(funcName)) {
                        const dq: any[] = [];
                        (dq as any).__type = 'std::deque';
                        return dq;
                    }
                    // string(n, ch) constructor
                    if (funcName === 'string' || funcName === 'std::string') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        if (args.length === 2 && typeof args[0] === 'number') {
                            return String(args[1]).repeat(args[0]);
                        } else if (args.length === 1) {
                            return String(args[0]);
                        }
                        return '';
                    }
                    if (isSet(funcName)) {
                        return new Set();
                    }
                    if (isMap(funcName)) {
                        return new Map();
                    }
                    if (isPriorityQueue(funcName)) {
                        return { __type: 'std::priority_queue', elements: [], isMinHeap: funcName.includes('greater') };
                    }

                    // Global Mock Functions
                    if (funcName === 'sizeof') {
                        const argVal = yield* this.evaluate(call.arguments[0]);
                        if (Array.isArray(argVal)) return argVal.length * 4;
                        return 4;
                    }
                    if (funcName === 'begin' || funcName === 'std::begin') {
                        const argVal = yield* this.evaluate(call.arguments[0]);
                        return { container: argVal, index: 0, containerName: this.getNodeString(call.arguments[0]) };
                    }
                    if (funcName === 'end' || funcName === 'std::end') {
                        const argVal = yield* this.evaluate(call.arguments[0]);
                        return { container: argVal, index: Array.isArray(argVal) ? argVal.length : (argVal.size || 0), containerName: this.getNodeString(call.arguments[0]) };
                    }
                    if (funcName === 'getline' || funcName === 'std::getline') {
                        const ssArg = call.arguments[0];
                        const tokenArg = call.arguments[1];
                        const ss = yield* this.evaluate(ssArg);
                        const actualSs = (typeof ss === 'string' && ss.startsWith('#')) ? this.heap[ss] : ss;
                        if (actualSs && actualSs.__type === 'std::stringstream') {
                            if (actualSs.index < actualSs.tokens.length) {
                                const val = actualSs.tokens[actualSs.index++];
                                if (tokenArg.type === 'Identifier') {
                                    this.currentEnv().assign((tokenArg as Identifier).name, val);
                                }
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return false;
                    }
                    if (funcName === 'memset') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        const target = (typeof args[0] === 'string' && args[0].startsWith('#')) ? this.heap[args[0]] : args[0];
                        const val = args[1];
                        const fillArray = (arr: any) => {
                            if (Array.isArray(arr)) {
                                for (let i = 0; i < arr.length; i++) {
                                    if (Array.isArray(arr[i])) fillArray(arr[i]);
                                    else arr[i] = val;
                                }
                            }
                        };
                        fillArray(target);
                        return args[0];
                    }
                    if (funcName === 'equal') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        const iter1 = args[0];
                        const iter2 = args[1];
                        const iter3 = args[2];
                        if (iter1 && iter2 && iter3 && iter1.container && iter3.container) {
                            const c1 = iter1.container;
                            const c2 = iter3.container;
                            const len = iter2.index - iter1.index;
                            for (let i = 0; i < len; i++) {
                                if (c1[iter1.index + i] !== c2[iter3.index + i]) return false;
                            }
                            return true;
                        }
                        return false;
                    }
                    if (funcName === 'accumulate' || funcName === 'std::accumulate') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        const iter1 = args[0];
                        const iter2 = args[1];
                        let sum = args[2];
                        if (iter1 && iter2 && iter1.container) {
                            const arr = iter1.container;
                            for (let i = iter1.index; i < iter2.index; i++) {
                                sum += arr[i];
                            }
                        }
                        return sum;
                    }
                    if (funcName === 'abs' || funcName === 'std::abs') {
                        const val = yield* this.evaluate(call.arguments[0]);
                        return Math.abs(val);
                    }
                    if (funcName === 'stoi' || funcName === 'std::stoi') {
                        const val = yield* this.evaluate(call.arguments[0]);
                        return parseInt(val);
                    }
                    if (funcName === 'to_string' || funcName === 'std::to_string') {
                        const val = yield* this.evaluate(call.arguments[0]);
                        return String(val);
                    }
                    if (funcName === 'next' || funcName === 'std::next') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        return { container: args[0].container, index: args[0].index + (args[1] || 1) };
                    }
                    if (funcName === 'prev' || funcName === 'std::prev') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                        return { container: args[0].container, index: args[0].index - (args[1] || 1) };
                    }

                    if (funcName === 'sort' || funcName === 'std::sort') {
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (args[0] && args[0].container) {
                            if (Array.isArray(args[0].container)) {
                                const arr = args[0].container;
                                const start = args[0].index !== undefined ? args[0].index : 0;
                                const end = (args[1] && args[1].index !== undefined) ? args[1].index : arr.length;
                                const sub = arr.slice(start, end);
                                const comparator = args[2];
                                if (comparator && (comparator.type === 'FunctionDeclaration' || comparator.__type === 'std::closure')) {
                                    // Lambda or function comparator
                                    sub.sort((a: any, b: any) => {
                                        const runGen = (gen: Generator<any, any, any>) => {
                                            let res = gen.next();
                                            while (!res.done) {
                                                res = gen.next();
                                            }
                                            return res.value;
                                        };
                                        let isLessThan: any;
                                        if (comparator.__type === 'std::closure') {
                                            isLessThan = runGen(this.executeClosure(comparator, [a, b]));
                                        } else {
                                            isLessThan = runGen(this.executeFunction(comparator, [a, b]));
                                        }
                                        return isLessThan ? -1 : 1;
                                    });
                                } else {
                                    sub.sort((a: any, b: any) => typeof a === 'string' ? a.localeCompare(b) : a - b);
                                }
                                for (let i = 0; i < sub.length; i++) {
                                    arr[start + i] = sub[i];
                                }
                                yield this.createTrace(call.line || 0, 'function_call', `Sorted container`);
                                return;
                            } else if (typeof args[0].container === 'string') {
                                const sortedStr = args[0].container.split('').sort().join('');
                                const mem0 = call.arguments[0] as MemberExpression;
                                if (mem0 && mem0.object) {
                                    if (mem0.object.type === 'Identifier') {
                                        const name = (mem0.object as Identifier).name;
                                        this.currentEnv().assign(name, sortedStr);
                                    }
                                }
                                yield this.createTrace(call.line || 0, 'function_call', `Sorted string`);
                                return;
                            }
                        }
                        return;
                    } else if (funcName === 'max' || funcName === 'std::max') {
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
                    } else if (funcName === 'swap' || funcName === 'std::swap') {
                        const arg0 = call.arguments[0];
                        let arg1 = call.arguments[1];
                        if (!arg1 && arg0 && arg0.type === 'MemberExpression') {
                            const mem = arg0 as MemberExpression;
                            if (mem.object && mem.object.type === 'MemberExpression') {
                                const outerMem = mem.object as MemberExpression;
                                const transposedInner: MemberExpression = {
                                    type: 'MemberExpression',
                                    object: outerMem.object,
                                    property: mem.property,
                                    computed: outerMem.computed,
                                    line: mem.line
                                };
                                const transposedOuter: MemberExpression = {
                                    type: 'MemberExpression',
                                    object: transposedInner,
                                    property: outerMem.property,
                                    computed: mem.computed,
                                    line: mem.line
                                };
                                arg1 = transposedOuter;
                            }
                        }
                        if (arg0 && arg1 && arg0.type === 'MemberExpression' && arg1.type === 'MemberExpression') {
                            const mem0 = arg0 as MemberExpression;
                            const mem1 = arg1 as MemberExpression;
                            const obj0 = yield* this.evaluate(mem0.object);
                            const obj1 = yield* this.evaluate(mem1.object);
                            const prop0 = mem0.computed ? yield* this.evaluate(mem0.property) : (mem0.property as Identifier).name;
                            const prop1 = mem1.computed ? yield* this.evaluate(mem1.property) : (mem1.property as Identifier).name;
                            
                            const target0 = (typeof obj0 === 'string' && obj0.startsWith('#')) ? this.heap[obj0] : obj0;
                            const target1 = (typeof obj1 === 'string' && obj1.startsWith('#')) ? this.heap[obj1] : obj1;
                            
                            const val0 = target0[prop0];
                            const val1 = target1[prop1];
                            const temp = target0[prop0];
                            target0[prop0] = target1[prop1];
                            target1[prop1] = temp;
                            
                            const name0 = this.getEvaluatedNodeString(mem0);
                            const name1 = this.getEvaluatedNodeString(mem1);

                            const containerName0 = mem0.object.type === 'Identifier' ? (mem0.object as Identifier).name : '';
                            const containerName1 = mem1.object.type === 'Identifier' ? (mem1.object as Identifier).name : '';
                            const isSameContainer = containerName0 && containerName0 === containerName1;
                            
                            if (isSameContainer && typeof prop0 === 'number' && typeof prop1 === 'number') {
                                this.activeSwapArrayName = containerName0;
                                const idx0 = prop0;
                                const idx1 = prop1;
                                this.activeSwapIndices = [Math.min(idx0, idx1), Math.max(idx0, idx1)];
                            }

                            yield this.createTrace(call.line || 0, 'assignment', `Swapped ${name0} and ${name1} (values: ${val0} ⇄ ${val1})`);
                            
                            this.activeSwapArrayName = undefined;
                            this.activeSwapIndices = undefined;
                            return;
                        } else if (arg0.type === 'Identifier' && arg1.type === 'Identifier') {
                            const name0 = (arg0 as Identifier).name;
                            const name1 = (arg1 as Identifier).name;
                            const env = this.currentEnv();
                            const val0 = env.get(name0);
                            const val1 = env.get(name1);
                            env.assign(name0, val1);
                            env.assign(name1, val0);
                            yield this.createTrace(call.line || 0, 'assignment', `Swapped ${name0} and ${name1} (values: ${val0} ⇄ ${val1})`);
                            return;
                        }
                    }
                }
                if (typeof call.callee !== 'string' && call.callee.type === 'MemberExpression') {
                    const mem = call.callee as MemberExpression;
                    let obj = yield* this.evaluate(mem.object);
                    if (typeof obj === 'string' && obj.startsWith('#')) {
                        obj = this.heap[obj];
                    }
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
                            const idx = obj.indexOf(args[0]);
                            return idx === -1 ? -1 : idx; // C++: string::npos is -1 in our context
                        }
                        if (method === 'find_first_not_of') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const chars = String(args[0]);
                            const start = args[1] !== undefined ? args[1] : 0;
                            for (let i = start; i < obj.length; i++) {
                                if (!chars.includes(obj[i])) return i;
                            }
                            return -1; // string::npos
                        }
                        if (method === 'find_first_of') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const chars = String(args[0]);
                            const start = args[1] !== undefined ? args[1] : 0;
                            for (let i = start; i < obj.length; i++) {
                                if (chars.includes(obj[i])) return i;
                            }
                            return -1;
                        }
                        if (method === 'find_last_not_of') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const chars = String(args[0]);
                            for (let i = obj.length - 1; i >= 0; i--) {
                                if (!chars.includes(obj[i])) return i;
                            }
                            return -1;
                        }
                        if (method === 'find_last_of') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const chars = String(args[0]);
                            for (let i = obj.length - 1; i >= 0; i--) {
                                if (chars.includes(obj[i])) return i;
                            }
                            return -1;
                        }
                        if (method === 'append') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const newStr = obj + String(args[0]);
                            // Assign back to the variable
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, newStr);
                            }
                            return newStr;
                        }
                        if (method === 'insert') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const pos = args[0];
                            const str = args[1] !== undefined ? String(args[1]) : String(args[0]);
                            let newStr = obj;
                            if (args.length >= 2) {
                                newStr = obj.slice(0, pos) + str + obj.slice(pos);
                            }
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, newStr);
                            }
                            return newStr;
                        }
                        if (method === 'erase') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const pos = args[0] !== undefined ? args[0] : 0;
                            const count = args[1] !== undefined ? args[1] : obj.length;
                            const newStr = obj.slice(0, pos) + obj.slice(pos + count);
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, newStr);
                            }
                            return newStr;
                        }
                        if (method === 'replace') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const pos = args[0];
                            const count = args[1];
                            const replacement = String(args[2]);
                            const newStr = obj.slice(0, pos) + replacement + obj.slice(pos + count);
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, newStr);
                            }
                            return newStr;
                        }
                        if (method === 'push_back') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            const newStr = obj + String(args[0]);
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, newStr);
                            }
                            return;
                        }
                        if (method === 'pop_back') {
                            const newStr = obj.slice(0, -1);
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, newStr);
                            }
                            return;
                        }
                        if (method === 'back') return obj[obj.length - 1];
                        if (method === 'front') return obj[0];
                        if (method === 'empty') return obj.length === 0;
                        if (method === 'clear') {
                            if (mem.object.type === 'Identifier') {
                                this.currentEnv().assign((mem.object as Identifier).name, '');
                            }
                            return;
                        }
                        if (method === 'size' || method === 'length') {
                            return obj.length;
                        }
                        if (method === 'begin') return { container: obj, index: 0, containerName: this.getNodeString(mem.object) };
                        if (method === 'end') return { container: obj, index: obj.length, containerName: this.getNodeString(mem.object) };
                        if (method === 'c_str') return obj;
                        if (method === 'at') {
                            const args = [];
                            for (const arg of call.arguments) args.push(yield* this.evaluate(arg));
                            return obj[args[0]];
                        }
                    } else if (Array.isArray(obj)) {
                        // Vector / Stack / Queue / Deque mocks using JS Array
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (method === 'push_back' || method === 'push') {
                            // Dereference heap pointer if it is an array to avoid storing '#addr' strings for nested arrays (vector<vector<int>>)
                            // But keep it as a pointer string '#addr' if it points to a struct or class (Node*) to avoid circular references.
                            let toPush = args[0];
                            if (typeof toPush === 'string' && toPush.startsWith('#')) {
                                const heapVal = this.heap[toPush];
                                if (Array.isArray(heapVal)) {
                                    toPush = heapVal;
                                }
                            }
                            // Deep copy if pushing an array (vector<vector<int>>)
                            if (Array.isArray(toPush)) {
                                const copied = [...toPush];
                                if ('first' in toPush) (copied as any).first = (toPush as any).first;
                                if ('second' in toPush) (copied as any).second = (toPush as any).second;
                                toPush = copied;
                            }
                            obj.push(toPush);
                            yield this.createTrace(call.line || 0, 'function_call', `Pushed ${safeStringify(toPush)}`);
                            return;
                        }
                        if (method === 'push_front') {
                            const oldElements = [...obj];
                            obj.unshift(args[0]);
                            this.updateIterators(obj, oldElements);
                            yield this.createTrace(call.line || 0, 'function_call', `Pushed ${args[0]} to front`);
                            return;
                        }
                        if (method === 'pop_back' || method === 'pop' || method === 'pop_front') {
                            let val;
                            const oldElements = [...obj];
                            if ((obj as any).__type === 'std::queue' || method === 'pop_front') {
                                val = obj.shift();
                            } else {
                                val = obj.pop();
                            }
                            this.updateIterators(obj, oldElements);
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
                        if (method === 'emplace_back' || method === 'emplace') {
                            const toPush = args.length === 1 ? (Array.isArray(args[0]) ? [...args[0]] : args[0]) : { first: args[0], second: args[1] };
                            obj.push(toPush);
                            yield this.createTrace(call.line || 0, 'function_call', `Emplaced ${safeStringify(toPush)}`);
                            return;
                        }
                        if (method === 'size') return obj.length;
                        if (method === 'empty') return obj.length === 0;
                        if (method === 'top' || method === 'back') return obj[obj.length - 1];
                        if (method === 'front') return (obj as any).__type === 'std::queue' ? obj[0] : obj[0];
                        if (method === 'begin') return { container: obj, index: 0, containerName: this.getNodeString(mem.object) }; // Mock iterator
                        if (method === 'end') return { container: obj, index: obj.length, containerName: this.getNodeString(mem.object) };
                        if (method === 'at') return obj[args[0]];
                        if (method === 'insert') {
                            // insert(pos_iter, val)
                            const idx = (args[0] && args[0].index !== undefined) ? args[0].index : args[0];
                            if (typeof idx === 'number') {
                                const oldElements = [...obj];
                                obj.splice(idx, 0, args[1]);
                                this.updateIterators(obj, oldElements);
                            } else {
                                obj.push(args[0]); // fallback
                            }
                            return;
                        }
                        if (method === 'erase') {
                            const idx = (args[0] && args[0].index !== undefined) ? args[0].index : args[0];
                            if (typeof idx === 'number') {
                                const oldElements = [...obj];
                                obj.splice(idx, 1);
                                this.updateIterators(obj, oldElements);
                            }
                            return;
                        }
                        if (method === 'splice') {
                            // splice(pos_iter, other_list, elem_iter)
                            const posIter = args[0];
                            const otherList = args[1];
                            const elemIter = args[2];
                            
                            const targetIdx = (posIter && posIter.index !== undefined) ? posIter.index : 0;
                            const sourceIdx = (elemIter && elemIter.index !== undefined) ? elemIter.index : -1;
                            
                            if (Array.isArray(otherList) && sourceIdx >= 0 && sourceIdx < otherList.length) {
                                const oldElementsObj = [...obj];
                                const oldElementsOther = [...otherList];
                                
                                const [movedVal] = otherList.splice(sourceIdx, 1);
                                if (movedVal !== undefined) {
                                    obj.splice(targetIdx, 0, movedVal);
                                }
                                
                                this.updateIterators(obj, oldElementsObj);
                                if (otherList !== obj) {
                                    this.updateIterators(otherList, oldElementsOther);
                                }
                            }
                            return;
                        }
                        if (method === 'max_size') return 2147483647;
                    } else if (obj instanceof Set) {
                        // Set Mocks
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (method === 'insert') {
                            // Can be s.insert(val), s.insert(iter_beg, iter_end) or s.insert(initializer_list)
                            if (args.length >= 2 && args[0] && typeof args[0] === 'object' && 'container' in args[0] && 'index' in args[0]) {
                                // Range insert
                                const container = args[0].container;
                                const startIdx = args[0].index;
                                const endIdx = (args[1] && typeof args[1] === 'object' && 'index' in args[1]) ? args[1].index : container.length;
                                if (Array.isArray(container)) {
                                    for (let i = startIdx; i < endIdx; i++) {
                                        obj.add(container[i]);
                                    }
                                } else if (container instanceof Set) {
                                    for (const item of Array.from(container)) {
                                        obj.add(item);
                                    }
                                }
                                yield this.createTrace(call.line || 0, 'function_call', `Inserted range into set`);
                                return;
                            }
                            if (Array.isArray(args[0])) {
                                for (const val of args[0]) {
                                    obj.add(val);
                                }
                                yield this.createTrace(call.line || 0, 'function_call', `Inserted elements into set`);
                                return;
                            }
                            const val = (args[0] && typeof args[0] === 'object' && 'first' in args[0]) ? args[0].first : args[0];
                            const alreadyExists = obj.has(val);
                            const targetName = this.getNodeString(call.callee).split('.')[0];
                            if (alreadyExists) {
                                yield this.createTrace(call.line || 0, 'function_call', `Duplicate insertion of ${val} rejected`, {
                                    dataStructureOp: {
                                        type: 'insert',
                                        target: targetName,
                                        value: val,
                                        isRejected: true
                                    } as any
                                });
                                return { second: false };
                            } else {
                                obj.add(val);
                                yield this.createTrace(call.line || 0, 'function_call', `Inserted ${val} into set`, {
                                    dataStructureOp: {
                                        type: 'insert',
                                        target: targetName,
                                        value: val
                                    }
                                });
                                return { second: true };
                            }
                        }
                        if (method === 'count') {
                            return obj.has(args[0]) ? 1 : 0;
                        }
                        if (method === 'find') {
                            const key = args[0];
                            if (obj.has(key)) {
                                return { container: obj, key: key, isEnd: false, first: key };
                            } else {
                                return { container: obj, isEnd: true };
                            }
                        }
                        if (method === 'erase') {
                            const val = (args[0] && typeof args[0] === 'object' && 'first' in args[0]) ? args[0].first : args[0];
                            obj.delete(val);
                            yield this.createTrace(call.line || 0, 'function_call', `Erased key ${val}`);
                            return;
                        }
                        if (method === 'clear') {
                            obj.clear();
                            yield this.createTrace(call.line || 0, 'function_call', `Cleared set`);
                            return;
                        }
                        if (method === 'size') return obj.size;
                        if (method === 'empty') return obj.size === 0;
                        if (method === 'end') return { container: obj, isEnd: true };
                        if (method === 'begin') {
                            const keys = Array.from(obj.keys());
                            return keys.length > 0 ? { container: obj, key: keys[0], isEnd: false, first: keys[0] } : { container: obj, isEnd: true };
                        }
                    } else if (obj && obj.__type === 'std::priority_queue') {
                        // PriorityQueue Mock
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (method === 'push') {
                            obj.elements.push(args[0]);
                            obj.elements.sort((a: any, b: any) => {
                                let compA = a;
                                let compB = b;
                                if (a && typeof a === 'object') {
                                    if ('first' in a) {
                                        if (a.first !== b.first) return obj.isMinHeap ? a.first - b.first : b.first - a.first;
                                        return obj.isMinHeap ? a.second - b.second : b.second - a.second;
                                    }
                                    if (Array.isArray(a)) {
                                        if (a[0] !== b[0]) return obj.isMinHeap ? a[0] - b[0] : b[0] - a[0];
                                        return obj.isMinHeap ? a[1] - b[1] : b[1] - a[1];
                                    }
                                }
                                return obj.isMinHeap ? compA - compB : compB - compA;
                            });
                            yield this.createTrace(call.line || 0, 'function_call', `Pushed ${safeStringify(args[0])} to priority_queue`);
                            return;
                        }
                        if (method === 'pop') {
                            const val = obj.elements.shift();
                            yield this.createTrace(call.line || 0, 'function_call', `Popped ${safeStringify(val)} from priority_queue`);
                            return;
                        }
                        if (method === 'top') {
                            return obj.elements[0];
                        }
                        if (method === 'size') return obj.elements.length;
                        if (method === 'empty') return obj.elements.length === 0;
                    } else if (obj instanceof Map) {
                        // Map Mocks
                        const args = [];
                        for (const arg of call.arguments) args.push(yield* this.evaluate(arg));

                        if (method === 'insert') {
                            // map.insert({k,v}) or pair
                            const targetName = this.getNodeString(call.callee).split('.')[0];
                            if (args[0] && typeof args[0] === 'object' && 'first' in args[0] && 'second' in args[0]) {
                                const key = args[0].first;
                                const val = args[0].second;
                                const alreadyExists = obj.has(key);
                                if (alreadyExists) {
                                    yield this.createTrace(call.line || 0, 'function_call', `Duplicate insertion of key ${key} rejected`, {
                                        dataStructureOp: {
                                            type: 'insert',
                                            target: targetName,
                                            value: { key, value: val },
                                            isRejected: true
                                        } as any
                                    });
                                } else {
                                    obj.set(key, val);
                                    yield this.createTrace(call.line || 0, 'function_call', `Inserted key ${key}`, {
                                        dataStructureOp: {
                                            type: 'insert',
                                            target: targetName,
                                            value: { key, value: val }
                                        }
                                    });
                                }
                            } else if (args.length >= 2) {
                                const key = args[0];
                                const val = args[1];
                                const alreadyExists = obj.has(key);
                                if (alreadyExists) {
                                    yield this.createTrace(call.line || 0, 'function_call', `Duplicate insertion of key ${key} rejected`, {
                                        dataStructureOp: {
                                            type: 'insert',
                                            target: targetName,
                                            value: { key, value: val },
                                            isRejected: true
                                        } as any
                                    });
                                } else {
                                    obj.set(key, val);
                                    yield this.createTrace(call.line || 0, 'function_call', `Inserted key ${key}`, {
                                        dataStructureOp: {
                                            type: 'insert',
                                            target: targetName,
                                            value: { key, value: val }
                                        }
                                    });
                                }
                            }
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
                        if (method === 'begin') {
                            const keys = Array.from(obj.keys());
                            if (keys.length > 0) {
                                const k = keys[0];
                                const m = obj;
                                return { container: obj, key: k, isEnd: false, first: k, get second() { return m.get(k); } };
                            }
                            return { container: obj, isEnd: true };
                        }
                        if (method === 'clear') {
                            obj.clear();
                            yield this.createTrace(call.line || 0, 'function_call', `Cleared map`);
                            return;
                        }
                        if (method === 'at') {
                            return obj.get(args[0]);
                        }
                        if (method === 'erase') {
                            const val = (args[0] && typeof args[0] === 'object' && 'first' in args[0]) ? args[0].first : args[0];
                            obj.delete(val);
                            yield this.createTrace(call.line || 0, 'function_call', `Erased key ${val}`);
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

                if (callee && callee.__type === 'std::class_method') {
                    // Class method invocation
                    return yield* this.executeFunction(callee.method, args, callee.instance);
                } else if (callee && callee.__type === 'std::closure') {
                    // Lambda/closure invocation
                    return yield* this.executeClosure(callee, args);
                } else if (callee && callee.type === 'FunctionDeclaration') {
                    // User defined function
                    return yield* this.executeFunction(callee, args);
                } else if (typeof callee === 'function') {
                    // Built-in function (if any) or method
                    const res = callee.call(this, ...args);
                    if (res && typeof res.next === 'function' && typeof res[Symbol.iterator] === 'function') {
                        return yield* res;
                    }
                    return res;
                } else if (callee && callee.__type === 'std::vector_push_back') {
                    // Handle push_back
                    const vec = callee.instance;
                    let toPush = args[0];
                    if (typeof toPush === 'string' && toPush.startsWith('#')) {
                        const heapVal = this.heap[toPush];
                        if (Array.isArray(heapVal)) {
                            toPush = heapVal;
                        }
                    }
                    if (Array.isArray(toPush)) {
                        const copied = [...toPush];
                        if ('first' in toPush) (copied as any).first = (toPush as any).first;
                        if ('second' in toPush) (copied as any).second = (toPush as any).second;
                        toPush = copied;
                    }
                    vec.push(toPush);
                    return;
                }
                // ... Handle other mocks
                throw new Error(`Runtime Error: ${call.callee} is not a function`);
            }
            case 'NewExpression': {
                const newExpr = node as NewExpression;
                const address = `#${(this.heapCounter++).toString(16)}`;
                const className = newExpr.className;

                // Evaluate arguments first
                const args = [];
                for (const arg of newExpr.arguments) {
                    args.push(yield* this.evaluate(arg));
                }

                if (className === 'int' || className === 'double' || className === 'float' ||
                    className === 'long' || className === 'uint32_t' || className === 'uint64_t' ||
                    className === 'int32_t' || className === 'int64_t' || className.startsWith('unsigned') ||
                    className.startsWith('long')) {
                    this.heap[address] = args[0] !== undefined ? args[0] : 0;
                } else if (className === 'string' || className === 'std::string') {
                    // string(n, ch) vs string(str)
                    if (args.length === 2 && typeof args[0] === 'number') {
                        this.heap[address] = String(args[1]).repeat(args[0]);
                    } else {
                        this.heap[address] = args[0] !== undefined ? String(args[0]) : "";
                    }
                } else if (isVector(className)) {
                    // Determine default fill value based on inner type
                    const innerTypeMatch = className.match(/vector\s*<(.+)>$/);
                    const innerType = innerTypeMatch ? innerTypeMatch[1].trim() : 'int';
                    const isInnerVector = isVector(innerType);
                    const isInnerString = innerType === 'string' || innerType === 'std::string';
                    const isInnerBool = innerType === 'bool';
                    const getDefault = () => {
                        if (isInnerVector) return [];
                        if (isInnerString) return '';
                        if (isInnerBool) return false;
                        if (isMap(innerType)) return new Map();
                        if (isSet(innerType)) return new Set();
                        return 0;
                    };
                    let vec: any[] = [];
                    if (args.length === 1 && typeof args[0] === 'number') {
                        vec = new Array(args[0]).fill(null).map(() => getDefault());
                    } else if (args.length === 2) {
                        if (typeof args[0] === 'number') {
                            // args[1] could be a heap pointer (from variable)
                            let fillVal = args[1];
                            if (typeof fillVal === 'string' && fillVal.startsWith('#')) {
                                fillVal = this.heap[fillVal];
                            }
                            vec = new Array(args[0]).fill(null).map(() => Array.isArray(fillVal) ? [...fillVal] : fillVal);
                        } else if (args[0] && typeof args[0] === 'object' && 'container' in args[0] && args[1] && typeof args[1] === 'object' && 'container' in args[1]) {
                            const container = args[0].container;
                            const start = args[0].index !== undefined ? args[0].index : args[0].key;
                            const end = args[1].index !== undefined ? args[1].index : args[1].key;
                            if (Array.isArray(container)) {
                                vec = container.slice(start, end);
                            }
                        }
                    }
                    this.heap[address] = vec;
                } else if (isStack(className)) {
                    const st = args[0] && Array.isArray(args[0]) ? [...args[0]] : [];
                    (st as any).__type = 'std::stack';
                    this.heap[address] = st;
                } else if (isQueue(className)) {
                    const q = args[0] && Array.isArray(args[0]) ? [...args[0]] : [];
                    (q as any).__type = 'std::queue';
                    this.heap[address] = q;
                } else if (isDeque(className)) {
                    const dq = args[0] && Array.isArray(args[0]) ? [...args[0]] : [];
                    (dq as any).__type = 'std::deque';
                    this.heap[address] = dq;
                } else if (isPriorityQueue(className)) {
                    let elements: any[] = [];
                    if (args.length === 2 && args[0] && typeof args[0] === 'object' && 'container' in args[0] && args[1] && typeof args[1] === 'object' && 'container' in args[1]) {
                        const container = args[0].container;
                        if (Array.isArray(container)) {
                            const start = args[0].index !== undefined ? args[0].index : 0;
                            const end = args[1].index !== undefined ? args[1].index : container.length;
                            elements = container.slice(start, end);
                        }
                    } else if (args[0] && Array.isArray(args[0])) {
                        elements = [...args[0]];
                    }
                    const isMinHeap = className.includes('greater');
                    elements.sort((a: any, b: any) => {
                        let compA = a;
                        let compB = b;
                        if (a && typeof a === 'object') {
                            if ('first' in a) {
                                if (a.first !== b.first) return isMinHeap ? a.first - b.first : b.first - a.first;
                                return isMinHeap ? a.second - b.second : b.second - a.second;
                            }
                            if (Array.isArray(a)) {
                                if (a[0] !== b[0]) return isMinHeap ? a[0] - b[0] : b[0] - a[0];
                                return isMinHeap ? a[1] - b[1] : b[1] - a[1];
                            }
                        }
                        return isMinHeap ? compA - compB : compB - compA;
                    });
                    this.heap[address] = { __type: 'std::priority_queue', elements, isMinHeap };
                } else if (isMap(className)) {
                    const m = createMapWithValType(className);
                    if (args[0] instanceof Map) {
                        for (const [k, v] of args[0]) m.set(k, v);
                    }
                    this.heap[address] = m;
                } else if (isSet(className)) {
                    const s = new Set();
                    if (args.length === 2 && args[0] && typeof args[0] === 'object' && 'container' in args[0] && args[1] && typeof args[1] === 'object' && 'container' in args[1]) {
                        const container = args[0].container;
                        if (Array.isArray(container)) {
                            const start = args[0].index;
                            const end = args[1].index;
                            for (let i = start; i < end; i++) {
                                s.add(container[i]);
                            }
                        } else if (container instanceof Set) {
                            for (const val of container) s.add(val);
                        }
                    } else if (args[0] instanceof Set) {
                        for (const val of args[0]) s.add(val);
                    }
                    this.heap[address] = s;
                } else if (isType(className, 'pair')) {
                    this.heap[address] = { first: args[0] !== undefined ? args[0] : 0, second: args[1] !== undefined ? args[1] : 0 };
                } else if (isStringStream(className)) {
                    const argVal = args[0] !== undefined ? args[0] : '';
                    const cleanTokens = argVal ? argVal.split(/[\s,]+/).map((t: string) => t.trim()).filter((t: string) => t.length > 0) : [];
                    this.heap[address] = {
                        __type: 'std::stringstream',
                        tokens: cleanTokens,
                        index: 0
                    };
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
                        const instance: any = { __className: newExpr.className };
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
                            if (isPriorityQueue(t)) return { __type: 'std::priority_queue', elements: [], isMinHeap: t.includes('greater') };
                            if (isVector(t) || isStack(t) || isQueue(t) || isDeque(t) || isList(t)) {
                                const arr: any[] = [];
                                if (isList(t)) (arr as any).__type = 'std::list';
                                return arr;
                            }
                            if (isMap(t)) return createMapWithValType(t);
                            if (isSet(t)) return new Set();
                            if (isType(t, 'pair')) return { first: 0, second: 0 };
                            if (isType(t, 'string')) return "";
                            if (isType(t, 'int') || isType(t, 'double') || isType(t, 'float') || isType(t, 'char') || isType(t, 'long')) return 0;
                            return null;
                        };

                        // Initialize members
                        for (const mem of cls.members) {
                            if (mem.type === 'VariableDeclaration') {
                                const decl = mem as VariableDeclaration;
                                let val = createDefaultValue(decl);
                                console.log("DEBUG member initialization:", decl.name, "val =", val);
                                if (decl.init) {
                                    val = yield* this.evaluate(decl.init);
                                }
                                instance[decl.name] = val;
                            } else if (mem.type === 'MultiVariableDeclaration') {
                                const multi = mem as MultiVariableDeclaration;
                                for (const decl of multi.declarations) {
                                    let val = createDefaultValue(decl);
                                    console.log("DEBUG member initialization:", decl.name, "val =", val);
                                    if (decl.init) {
                                        val = yield* this.evaluate(decl.init);
                                    }
                                    instance[decl.name] = val;
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
                let obj = yield* this.evaluate(mem.object);
                let isPointer = false;
                let pointerAddr = '';
                if (typeof obj === 'string' && obj.startsWith('#')) {
                    isPointer = true;
                    pointerAddr = obj;
                    obj = this.heap[obj];
                }

                if (mem.computed) {
                    // Array access
                    if (mem.object.type === 'Identifier' && mem.property.type === 'Identifier') {
                        const objName = (mem.object as Identifier).name;
                        const propName = (mem.property as Identifier).name;
                        this.pointerToContainer.set(propName, objName);
                    }
                    const idx = yield* this.evaluate(mem.property);
                    if (obj instanceof Map) {
                        // Default C++ specific: accessing map[k] inserts default if not found
                        if (!obj.has(idx)) {
                            const valType = (obj as any).__valType || 'int';
                            let defVal: any = 0;
                            if (valType.includes('vector') || valType.includes('stack') || valType.includes('queue') || valType.includes('deque') || valType.includes('list')) {
                                const arr: any[] = [];
                                if (valType.includes('list')) (arr as any).__type = 'std::list';
                                defVal = arr;
                            } else if (valType.includes('map')) {
                                defVal = new Map();
                            } else if (valType.includes('set')) {
                                defVal = new Set();
                            } else if (valType.includes('string')) {
                                defVal = "";
                            } else if (valType.includes('bool')) {
                                defVal = false;
                            }
                            obj.set(idx, defVal);
                        }
                        return obj.get(idx);
                    }
                    const result = obj[idx];
                    if (Array.isArray(obj)) {
                        if (Array.isArray(result) && obj.every(row => Array.isArray(row))) {
                            Object.defineProperty(result, '__parentArray', { value: obj, configurable: true, writable: true });
                            Object.defineProperty(result, '__rowIndex', { value: idx, configurable: true, writable: true });
                        } else {
                            this.trackMatrixAccess(obj, idx);
                        }
                    }
                    return result;
                } else {
                    const prop = (mem.property as Identifier).name;

                    // Class method lookup first!
                    const className = obj?.__className;
                    if (className) {
                        let cls: ClassDeclaration | undefined;
                        try {
                            cls = this.currentEnv().get(className);
                        } catch (e) {}

                        if (cls && cls.type === 'ClassDeclaration') {
                            const method = cls.members.find(
                                m => m.type === 'FunctionDeclaration' && (m as FunctionDeclaration).name === prop
                            ) as FunctionDeclaration | undefined;
                            if (method) {
                                return {
                                    __type: 'std::class_method',
                                    method,
                                    instance: isPointer ? pointerAddr : obj
                                };
                            }
                        }
                    }

                    // Check if obj is pointer
                    if (typeof obj === 'string' && obj.startsWith('#')) {
                        const target = this.heap[obj];
                        return target[prop];
                    }
                    // Check if obj is iterator pointing to container
                    if (obj && typeof obj === 'object' && 'container' in obj && 'index' in obj) {
                        const target = obj.container[obj.index];
                        return target ? target[prop] : undefined;
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
                if (elements.length === 2) {
                    (elements as any).first = elements[0];
                    (elements as any).second = elements[1];
                }
                return elements;
            }
            case 'UpdateExpression': {
                const upd = node as UpdateExpression;
                const op = upd.operator;
                const isInc = op === '++';
                
                if (upd.argument.type === 'Identifier') {
                    const name = (upd.argument as Identifier).name;
                    const env = this.currentEnv();
                    const val = env.get(name);
 
                    // Support iterator increment/decrement (e.g. it++, ++it, it--, --it)
                    if (val && typeof val === 'object' && 'container' in val && 'index' in val) {
                        const newVal = { ...val, index: isInc ? val.index + 1 : val.index - 1 };
                        env.assign(name, newVal);
                        yield this.createTrace(upd.line || 0, 'assignment', `Moved iterator ${name} (${val.index} → ${newVal.index})`);
                        return upd.prefix ? newVal : val;
                    }
                    if (val && typeof val === 'object' && 'container' in val && 'key' in val) {
                        // Map or Set iterator increment/decrement
                        const keys = Array.from((val.container as any).keys ? (val.container as any).keys() : ((val.container as any).values ? (val.container as any).values() : []));
                        const curIdx = keys.indexOf(val.key);
                        if (curIdx !== -1) {
                            const nextIdx = isInc ? curIdx + 1 : curIdx - 1;
                            if (nextIdx >= 0 && nextIdx < keys.length) {
                                const nextKey = keys[nextIdx];
                                const newVal = { ...val, key: nextKey, first: nextKey, get second() { return (val.container as any).get ? (val.container as any).get(nextKey) : nextKey; } };
                                env.assign(name, newVal);
                                yield this.createTrace(upd.line || 0, 'assignment', `Moved iterator ${name} (${val.key} → ${nextKey})`);
                                return upd.prefix ? newVal : val;
                            } else {
                                const newVal = { container: val.container, isEnd: true };
                                env.assign(name, newVal);
                                yield this.createTrace(upd.line || 0, 'assignment', `Moved iterator ${name} to end`);
                                return upd.prefix ? newVal : val;
                            }
                        }
                    }
 
                    const isChar = typeof val === 'string' && val.length === 1;
                    const numVal = isChar ? val.charCodeAt(0) : val;
                    const nextNum = isInc ? numVal + 1 : numVal - 1;
                    const newVal = isChar ? String.fromCharCode(nextNum) : nextNum;
                    env.assign(name, newVal);
                    yield this.createTrace(upd.line || 0, 'assignment', `${name}${op} (${val} → ${newVal})`);
                    return upd.prefix ? newVal : val;
                } else if (upd.argument.type === 'MemberExpression') {
                    const mem = upd.argument as MemberExpression;
                    const obj = yield* this.evaluate(mem.object);
                    const prop = mem.computed ? yield* this.evaluate(mem.property) : (mem.property as Identifier).name;
                    
                    const target = (typeof obj === 'string' && obj.startsWith('#')) ? this.heap[obj] : obj;
                    
                    if (target instanceof Map) {
                        if (!target.has(prop)) {
                            target.set(prop, 0); // Default C++ map entry
                        }
                        const val = target.get(prop);
                        const isChar = typeof val === 'string' && val.length === 1;
                        const numVal = isChar ? val.charCodeAt(0) : val;
                        const nextNum = isInc ? numVal + 1 : numVal - 1;
                        const newVal = isChar ? String.fromCharCode(nextNum) : nextNum;
                        target.set(prop, newVal);
                        yield this.createTrace(upd.line || 0, 'assignment', `${this.getNodeString(mem.object)}[${prop}]${op} (${val} → ${newVal})`);
                        return upd.prefix ? newVal : val;
                    } else {
                        const val = target[prop] !== undefined ? target[prop] : 0;
                        const isChar = typeof val === 'string' && val.length === 1;
                        const numVal = isChar ? val.charCodeAt(0) : val;
                        const nextNum = isInc ? numVal + 1 : numVal - 1;
                        const newVal = isChar ? String.fromCharCode(nextNum) : nextNum;
                        target[prop] = newVal;
                        this.trackMatrixAccess(target, prop);
                        yield this.createTrace(upd.line || 0, 'assignment', `${this.getNodeString(mem.object)}[${prop}]${op} (${val} → ${newVal})`);
                        return upd.prefix ? newVal : val;
                    }
                } else {
                    throw new Error("Update only supported on identifiers and member expressions");
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
                if (unary.operator === '~') {
                    return ~val;
                }
                if (unary.operator === '-') {
                    return -val;
                }
                if (unary.operator === '&') {
                    return val;
                }
                if (unary.operator === '*') {
                    if (val && typeof val === 'object') {
                        if (val.container instanceof Map) {
                            return val;
                        }
                        if (val.container instanceof Set) {
                            return val.key;
                        }
                        if (val.container && val.index !== undefined) {
                            return val.container[val.index];
                        }
                        if ('first' in val) return val.first;
                        if ('second' in val) return val.second;
                    }
                    return val;
                }
                return val;
            }
            case 'FunctionDeclaration': {
                return {
                    __type: 'std::closure',
                    declaration: node,
                    lexicalEnv: this.currentEnv()
                };
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
            astNode?: ASTNode;
            assignmentDetail?: any;
        }
    ): ExecutionTrace {
        const stack: StackFrame[] = [];
        for (let i = 1; i < this.callStack.length; i++) {
            const env = this.callStack[i];
            const funcName = (env as any).functionName;
            const envLocals = this.extractLocals(env);
            
            if (funcName) {
                stack.push({
                    function: funcName,
                    locals: { ...envLocals }
                });
            } else {
                if (stack.length > 0) {
                    const topFrame = stack[stack.length - 1];
                    for (const [k, v] of Object.entries(envLocals)) {
                        if (k === 'this' || k.startsWith('__')) continue;
                        topFrame.locals[k] = v;
                    }
                } else {
                    stack.push({
                        function: 'unknown',
                        locals: { ...envLocals }
                    });
                }
            }
        }

        let finalExplanation = explanation;
        let whatText = vizContext?.what || this.generateWhat(type, explanation);

        if (vizContext?.astNode) {
            try {
                const evalDetail = this.getEvaluationDetail(vizContext.astNode);
                if (evalDetail && evalDetail.expressionCode && evalDetail.valueSubstituted) {
                    const isComplex = ['BinaryExpression', 'CallExpression', 'MemberExpression', 'UnaryExpression', 'UpdateExpression'].includes(vizContext.astNode.type) ||
                                      (evalDetail.expressionCode !== evalDetail.valueSubstituted);
                    if (isComplex) {
                        const resultStr = evalDetail.resultValue !== undefined ? this.formatValue(evalDetail.resultValue) : '';
                        let calcStr = `\n(Calculation: ${evalDetail.expressionCode} → ${evalDetail.valueSubstituted}`;
                        if (resultStr !== '') {
                            calcStr += ` = ${resultStr}`;
                        }
                        calcStr += `)`;
                        whatText += calcStr;
                        finalExplanation += calcStr;
                    }
                }
            } catch (e) {
                console.error("Error evaluating AST node for trace explanation:", e);
            }
        }

        // Generate beginner-friendly three-part explanation
        const visualization: VisualizationHint = {
            nodeId: vizContext?.nodeId || this.currentNodeId,
            pathTaken: vizContext?.pathTaken,
            loopIteration: vizContext?.loopIteration,
            dataStructureOp: vizContext?.dataStructureOp,
            explanation: {
                what: whatText,
                why: vizContext?.why || this.generateWhy(type, explanation),
                next: vizContext?.next || this.generateNext(type)
            }
        };

        const visuals = this.generateVisuals();

        const clonedHeap: Record<string, any> = {};
        for (const [k, v] of Object.entries(this.heap)) {
            if (Array.isArray(v)) {
                const clonedArr = [...v];
                if ((v as any).__type) (clonedArr as any).__type = (v as any).__type;
                clonedHeap[k] = clonedArr;
            } else if (v instanceof Map) {
                const clonedMap = new Map(v);
                if ((v as any).__valType) (clonedMap as any).__valType = (v as any).__valType;
                clonedHeap[k] = clonedMap;
            } else if (v instanceof Set) {
                clonedHeap[k] = new Set(v);
            } else if (v && typeof v === 'object') {
                clonedHeap[k] = { ...v };
            } else {
                clonedHeap[k] = v;
            }
        }

        return {
            line,
            type,
            explanation: finalExplanation,
            stack,
            heap: clonedHeap,
            output: this.outputBuffer,
            visualization,
            visuals,
            assignmentDetail: vizContext?.assignmentDetail
        };
    }

    private generateVisuals(): any | undefined {
        const topEnv = this.currentEnv();
        if (!topEnv) return undefined;

        // Walk up the call stack to collect all visible variables.
        // Top-env locals take priority, but we also look at parent frames
        // (needed when inside a range-for loop scope where the array is in a parent env).
        const collectAllLocals = (): Record<string, any> => {
            const merged: Record<string, any> = {};
            // Walk from outermost frame inward so inner scopes override
            for (const frame of this.callStack) {
                const frameLocals = this.extractLocals(frame);
                for (const [k, v] of Object.entries(frameLocals)) {
                    // Skip internal keys
                    if (k === 'this' || k.startsWith('__')) continue;
                    merged[k] = v;
                }
            }
            return merged;
        };

        const locals = collectAllLocals();
        const globals = this.extractLocals(this.globals);
        // Merge: inner-scope wins over globals
        const allVarsRaw = { ...globals, ...locals };

        // ── Dereference heap pointers ─────────────────────────────────────────
        // Variables like `vector<int> res(n)` are stored as heap addresses
        // (e.g. "#1000").  Resolve them so all downstream detectors see the
        // actual Array / Map / Set value.
        const allVars: Record<string, any> = {};
        for (const [k, v] of Object.entries(allVarsRaw)) {
            if (typeof v === 'string' && v.startsWith('#') && this.heap[v] !== undefined) {
                allVars[k] = this.heap[v];
            } else {
                allVars[k] = v;
            }
        }

        // Extract range-for metadata from top env (if we are in a range-for iteration)
        const topLocalsRaw = this.extractLocals(topEnv);
        const rangeForIndex: number | undefined =
            typeof topLocalsRaw['__rangeForIndex'] === 'number' ? topLocalsRaw['__rangeForIndex'] : undefined;
        const rangeForArrayName: string | undefined =
            typeof topLocalsRaw['__rangeForArray'] === 'string' && topLocalsRaw['__rangeForArray']
                ? topLocalsRaw['__rangeForArray'] : undefined;

        // True recursion: the SAME function name appears more than once in the call stack
        const frameNames = this.callStack.slice(1).map(env => (env as any).functionName || '');
        const hasRecursion = frameNames.length >= 2 &&
            frameNames.some((name, i) => name && frameNames.indexOf(name) !== i);

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

        const isTrieNode = (addr: string): boolean => {
            if (typeof addr !== 'string' || !addr.startsWith('#')) return false;
            const node = this.heap[addr];
            if (!node) return false;
            const hasChildren = 'children' in node || 'child' in node || 'ch' in node || 'childs' in node;
            const hasIsWord = 'isWord' in node || 'isEndOfWord' in node || 'is_word' in node || 'endOfWord' in node || 'end' in node || 'isEnd' in node;
            return hasChildren && hasIsWord;
        };

        const collectedVisuals: any[] = [];

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

                // Collect tree pointers (root, curr, left, right, parent, etc.)
                const pointers: any[] = [];
                for (const [vName, vVal] of Object.entries(allVarsRaw)) {
                    if (typeof vVal === 'string' && visited.has(vVal)) {
                        const lower = vName.toLowerCase();
                        if (lower === 'root' || lower === 'curr' || lower === 'left' || lower === 'right' || lower === 'parent' || lower === 'node') {
                            const color = lower === 'root' ? '#06b6d4' :
                                          lower === 'curr' ? '#f97316' :
                                          lower === 'left' ? '#a855f7' :
                                          lower === 'right' ? '#ec4899' : '#eab308';
                            pointers.push({ name: vName, nodeId: vVal, color });
                        }
                    }
                }

                collectedVisuals.push({
                    type: 'tree',
                    target: name,
                    nodes,
                    currentNodeId: val,
                    activeNodes,
                    visitedNodes: Array.from(visited),
                    pointers
                });
            }
        }

        // 1b. Trie Detection
        const processedTrieStarts = new Set<string>();
        for (const [name, val] of Object.entries(locals)) {
            if (isTrieNode(val)) {
                if (processedTrieStarts.has(val)) continue;

                const nodes: any[] = [];
                const queue: { addr: string; parentId?: string; char: string }[] = [{ addr: val, char: 'ROOT' }];
                const visited = new Set<string>();
                visited.add(val);
                processedTrieStarts.add(val);

                let headIdx = 0;
                while (headIdx < queue.length) {
                    const current = queue[headIdx++];
                    const nodeObj = this.heap[current.addr];
                    if (!nodeObj) continue;

                    const isWord = !!(nodeObj.isWord || nodeObj.isEndOfWord || nodeObj.is_word || nodeObj.endOfWord || nodeObj.end || nodeObj.isEnd);
                    nodes.push({
                        id: current.addr,
                        val: current.char,
                        isWord,
                        parentId: current.parentId
                    });

                    // Retrieve children
                    let childrenEntries: [string, string][] = [];
                    const rawChildren = nodeObj.children || nodeObj.child || nodeObj.ch || nodeObj.childs;
                    if (Array.isArray(rawChildren)) {
                        rawChildren.forEach((childAddr, idx) => {
                            if (childAddr && typeof childAddr === 'string' && childAddr.startsWith('#')) {
                                childrenEntries.push([String.fromCharCode(97 + idx), childAddr]);
                            }
                        });
                    } else if (rawChildren instanceof Map) {
                        for (const [char, childAddr] of rawChildren.entries()) {
                            if (childAddr && typeof childAddr === 'string' && childAddr.startsWith('#')) {
                                childrenEntries.push([String(char), childAddr]);
                            }
                        }
                    } else if (rawChildren && typeof rawChildren === 'object') {
                        for (const [char, childAddr] of Object.entries(rawChildren)) {
                            if (childAddr && typeof childAddr === 'string' && childAddr.startsWith('#')) {
                                childrenEntries.push([String(char), childAddr]);
                            }
                        }
                    }

                    // Sort children alphabetical for neat structure
                    childrenEntries.sort((a, b) => a[0].localeCompare(b[0]));

                    for (const [char, childAddr] of childrenEntries) {
                        if (!visited.has(childAddr)) {
                            visited.add(childAddr);
                            processedTrieStarts.add(childAddr);
                            queue.push({ addr: childAddr, parentId: current.addr, char });
                        }
                    }
                }

                // Collect active pointers pointing to nodes in this Trie
                const pointers: any[] = [];
                const POINTER_COLORS: Record<string, string> = {
                    root: '#06b6d4',
                    curr: '#f97316',
                    node: '#ec4899',
                    temp: '#eab308'
                };
                for (const [vName, vVal] of Object.entries(allVarsRaw)) {
                    if (typeof vVal === 'string' && visited.has(vVal)) {
                        const lower = vName.toLowerCase();
                        let color = '#06b6d4';
                        for (const [key, col] of Object.entries(POINTER_COLORS)) {
                            if (lower.includes(key)) {
                                color = col;
                                break;
                            }
                        }
                        pointers.push({
                            name: vName,
                            nodeId: vVal,
                            color
                        });
                    }
                }

                collectedVisuals.push({
                    type: 'trie',
                    target: name,
                    nodes,
                    pointers
                });
            }
        }

        // 2. Linked List Detection
        const processedListStarts = new Set<string>();
        for (const [name, val] of Object.entries(locals)) {
            if (isListNode(val)) {
                if (processedListStarts.has(val)) continue;

                const nodes: any[] = [];
                let currAddr = val;
                const visited = new Set<string>();
                let hasCycle = false;
                let cycleStartId = undefined;

                while (currAddr && isListNode(currAddr)) {
                    if (visited.has(currAddr)) {
                        hasCycle = true;
                        cycleStartId = currAddr;
                        break;
                    }
                    visited.add(currAddr);
                    processedListStarts.add(currAddr);

                    const currNode = this.heap[currAddr];
                    const nodeVal = currNode.val !== undefined ? currNode.val : currNode.value;

                    // We store next and prev pointers
                    const nextAddr = currNode.next;
                    const prevAddr = currNode.prev;

                    nodes.push({
                        id: currAddr,
                        value: nodeVal,
                        next: nextAddr && isListNode(nextAddr) ? nextAddr : null,
                        prev: prevAddr && isListNode(prevAddr) ? prevAddr : null
                    });

                    if (nextAddr && isListNode(nextAddr)) {
                        currAddr = nextAddr;
                    } else {
                        break;
                    }
                }

                // If cycle exists, make sure the last traversed node's next points back
                if (hasCycle && cycleStartId && nodes.length > 0) {
                    const lastNode = nodes[nodes.length - 1];
                    lastNode.next = cycleStartId;
                }

                // Collect pointers pointing to nodes in this list
                const pointers: any[] = [];
                const POINTER_COLORS: Record<string, string> = {
                    head: '#06b6d4', // cyan
                    tail: '#3b82f6', // blue
                    curr: '#f97316', // orange
                    prev: '#a855f7', // purple
                    next: '#ec4899', // pink
                    slow: '#eab308', // yellow
                    fast: '#22c55e', // green
                    temp: '#ef4444', // red
                    dummy: '#6b7280' // gray
                };

                for (const [vName, vVal] of Object.entries(allVarsRaw)) {
                    if (typeof vVal === 'string' && visited.has(vVal)) {
                        const lower = vName.toLowerCase();
                        let color = '#06b6d4'; // default cyan
                        for (const [key, col] of Object.entries(POINTER_COLORS)) {
                            if (lower.includes(key)) {
                                color = col;
                                break;
                            }
                        }
                        pointers.push({
                            name: vName,
                            nodeId: vVal,
                            color
                        });
                    }
                }

                collectedVisuals.push({
                    type: 'linked_list',
                    target: name,
                    nodes,
                    pointers,
                    hasCycle,
                    cycleStartId
                });
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
            
            // Check for u and v/neighbor/child to highlight the active traversing edge
            const uVal = allVars['u'];
            const vVal = allVars['v'] !== undefined ? allVars['v'] : 
                         allVars['neighbor'] !== undefined ? allVars['neighbor'] : 
                         allVars['child'] !== undefined ? allVars['child'] : undefined;
            if (uVal !== undefined && vVal !== undefined) {
                activeEdges.push({ from: String(uVal), to: String(vVal) });
            }

            for (const [vName, vVal] of Object.entries(locals)) {
                if (typeof vVal === 'number' && vVal >= 0 && vVal < adj.length) {
                    activeNodes.push(String(vVal));
                }
            }

            collectedVisuals.push({
                type: 'graph',
                nodes,
                edges,
                activeNodes,
                visitedNodes,
                activeEdges,
                adjacencyList
            });
        }

        // 4. Matrix (2D Grid) Detection
        for (const [name, val] of Object.entries(allVars)) {
            if (Array.isArray(val) && val.length > 0 && val.every(row => Array.isArray(row))) {
                const rowPointers: Record<string, number> = {};
                const colPointers: Record<string, number> = {};
                const ROW_PTR_NAMES = new Set(['r', 'row', 'x', 'i']);
                const COL_PTR_NAMES = new Set(['c', 'col', 'y', 'j']);

                const numRows = val.length;
                const numCols = val[0]?.length || 0;

                // 1. Collect standard 2D pointer variables
                for (const [vName, vVal] of Object.entries(allVars)) {
                    if (typeof vVal === 'number') {
                        const lower = vName.toLowerCase();
                        if (ROW_PTR_NAMES.has(lower) && vVal >= 0 && vVal < numRows) {
                            // If 'l' also exists as a number, this is likely a 1D binary search (l and r), so avoid misinterpreting 'r' as row pointer!
                            const is1DBinarySearch = allVars['l'] !== undefined || allVars['low'] !== undefined;
                            if (!is1DBinarySearch) {
                                rowPointers[vName] = vVal;
                            }
                        }
                        if (COL_PTR_NAMES.has(lower) && vVal >= 0 && vVal < numCols) {
                            colPointers[vName] = vVal;
                        }
                    }
                }

                // 2. Handle 1D index mapping to 2D coordinates (Low, Mid, High, Left, Right, etc.)
                const ONE_D_INDEX_NAMES = new Set(['mid', 'l', 'r', 'low', 'high', 'left', 'right', 'idx', 'index']);
                if (numCols > 0) {
                    for (const [vName, vVal] of Object.entries(allVars)) {
                        if (typeof vVal === 'number') {
                            const lower = vName.toLowerCase();
                            if (ONE_D_INDEX_NAMES.has(lower)) {
                                const totalCells = numRows * numCols;
                                if (vVal >= 0 && vVal < totalCells) {
                                    const r = Math.floor(vVal / numCols);
                                    const c = vVal % numCols;
                                    rowPointers[`${vName}_row`] = r;
                                    colPointers[`${vName}_col`] = c;
                                }
                            }
                        }
                    }
                }

                // Extract binary search range if present in 1D variables
                let binarySearchRange: { l: number; r: number } | null = null;
                const lowVal = allVars['l'] !== undefined ? allVars['l'] : allVars['low'];
                const highVal = allVars['r'] !== undefined ? allVars['r'] : allVars['high'];
                if (typeof lowVal === 'number' && typeof highVal === 'number') {
                    binarySearchRange = { l: lowVal, r: highVal };
                }

                collectedVisuals.push({
                    type: 'matrix',
                    target: name,
                    rows: numRows,
                    cols: numCols,
                    values: val.map(row => [...row]),
                    rowPointers,
                    colPointers,
                    lastAccessedCell: (val as any).__lastAccessedCell ? { ...(val as any).__lastAccessedCell } : null,
                    visitedCells: (val as any).__visitedCells ? (val as any).__visitedCells.map((c: any) => ({ ...c })) : [],
                    binarySearchRange
                });
            }
        }

        // 5. Stack / Queue / Deque / Priority Queue Detection
        const STACK_NAMES = new Set(['stack', 'st', 'stk', 'mystack']);
        const QUEUE_NAMES = new Set(['queue', 'q', 'qu', 'myqueue', 'bfsqueue', 'pq', 'deque', 'dq']);
        for (const [name, val] of Object.entries(allVars)) {
            if (val && (val as any).__type === 'std::priority_queue') {
                collectedVisuals.push({
                    type: 'priority_queue',
                    target: name,
                    elements: [...(val as any).elements],
                    activeIndices: (val as any).elements.length > 0 ? [0] : [],
                    isMinHeap: (val as any).isMinHeap
                });
                continue;
            }
            if (Array.isArray(val)) {
                const type = (val as any).__type;
                const lower = name.toLowerCase();
                if (lower.includes('heap') || lower === 'pq') {
                    collectedVisuals.push({
                        type: 'priority_queue',
                        target: name,
                        elements: [...val],
                        activeIndices: val.length > 0 ? [0] : [],
                        isMinHeap: lower.includes('min')
                    });
                    continue;
                }
                if (type === 'std::stack' || STACK_NAMES.has(lower)) {
                    collectedVisuals.push({
                        type: 'stack',
                        target: name,
                        elements: [...val],
                        activeIndices: val.length > 0 ? [val.length - 1] : []
                    });
                } else if (type === 'std::queue' || QUEUE_NAMES.has(lower) || type === 'std::deque') {
                    const isDeque = type === 'std::deque' || lower.includes('deque') || lower.includes('dq');
                    collectedVisuals.push({
                        type: isDeque ? 'deque' : 'queue',
                        target: name,
                        elements: [...val],
                        activeIndices: val.length > 0 ? [0] : []
                    });
                }
            }
        }

        // 6. Map / HashMap / Set Detection
        for (const [name, val] of Object.entries(allVars)) {
            if (val instanceof Map) {
                const entries = Array.from(val.entries()).map(([k, v]) => ({ key: k, value: v }));
                collectedVisuals.push({
                    type: 'hash_map',
                    target: name,
                    entries,
                    activeKeys: entries.map(e => e.key)
                });
            } else if (val instanceof Set) {
                const entries = Array.from(val.values()).map(el => ({ key: el, value: '✔' }));
                collectedVisuals.push({
                    type: 'hash_map',
                    target: `${name} (Set)`,
                    entries,
                    activeKeys: entries.map(e => e.key)
                });
            } else if (val && typeof val === 'object' && 'first' in val && 'second' in val) {
                collectedVisuals.push({
                    type: 'hash_map',
                    target: `${name} (pair)`,
                    entries: [
                        { key: 'first', value: val.first },
                        { key: 'second', value: val.second }
                    ],
                    activeKeys: ['first', 'second']
                });
            }
        }

        const POINTER_NAMES_LEFT  = new Set(['i', 'left', 'l', 'low', 'lo', 'start', 'slow']);
        const POINTER_NAMES_RIGHT = new Set(['j', 'right', 'r', 'high', 'hi', 'end', 'fast']);
        const POINTER_NAMES_MID   = new Set(['mid', 'middle', 'm']);
        const POINTER_NAMES_WRITE = new Set(['pos', 'k', 'write', 'wp', 'cur', 'count', 'p', 'idx']);
        const ALL_POINTER_NAMES   = new Set([...POINTER_NAMES_LEFT, ...POINTER_NAMES_RIGHT,
                                             ...POINTER_NAMES_MID, ...POINTER_NAMES_WRITE]);

        const SYSTEM_CONSTANTS = new Set([
            'endl', 'std::endl', 'boolalpha', 'noboolalpha', 
            'string::npos', 'std::string::npos', 
            'INT_MAX', 'INT_MIN', 'std::INT_MAX', 'std::INT_MIN',
            'cout', 'std::cout', 'cin', 'std::cin'
        ]);

        // 7. String as 1D Character Array Visualization
        for (const [name, val] of Object.entries(allVars)) {
            if (typeof val === 'string' && !name.startsWith('__') && !SYSTEM_CONSTANTS.has(name) && !val.startsWith('#')) {
                const charArray = val.split('');
                const pointers: any[] = [];
                const highlightIndices: number[] = [];

                if (rangeForArrayName === name && rangeForIndex !== undefined) {
                    highlightIndices.push(rangeForIndex);
                    pointers.push({
                        name: 'i',
                        index: rangeForIndex,
                        color: 'blue',
                        action: 'move'
                    });
                }

                for (const [vName, vVal] of Object.entries(allVars)) {
                    if (typeof vVal === 'number' && ALL_POINTER_NAMES.has(vName.toLowerCase())) {
                        const assocContainer = this.pointerToContainer.get(vName);
                        if (assocContainer && assocContainer !== name) {
                            continue;
                        }
                        if (vVal >= 0 && vVal < charArray.length) {
                            const lowerPtr = vName.toLowerCase();
                            const color = POINTER_NAMES_LEFT.has(lowerPtr)  ? 'red' :
                                          POINTER_NAMES_RIGHT.has(lowerPtr) ? 'blue' :
                                          POINTER_NAMES_MID.has(lowerPtr)   ? 'green' : 'orange';
                            if (!pointers.some(p => p.index === vVal && p.name === vName.toUpperCase().charAt(0))) {
                                pointers.push({
                                    name: vName.toUpperCase().charAt(0),
                                    index: vVal,
                                    color,
                                    action: 'static'
                                });
                                if (!highlightIndices.includes(vVal)) {
                                    highlightIndices.push(vVal);
                                }
                            }
                        }
                    }
                }

                // Determine sliding window boundary
                let windowRange: [number, number] | undefined = undefined;
                const leftPtr = pointers.find(p => p.name === 'L' || p.name === 'I' || p.name === 'S');
                const rightPtr = pointers.find(p => p.name === 'R' || p.name === 'J' || p.name === 'R'); // 'R' maps to right pointer index
                if (leftPtr && rightPtr) {
                    windowRange = [leftPtr.index, rightPtr.index];
                }

                // If there's no left/right pointer but we have a pointer i and a pattern string s1/p:
                if (!windowRange) {
                    const lowerName = name.toLowerCase();
                    if ((lowerName === 's2' || lowerName === 's') && typeof allVars['i'] === 'number') {
                        const patternVal = allVars['s1'] || allVars['p'];
                        const patternLen = typeof patternVal === 'string' ? patternVal.length : 0;
                        if (patternLen > 0) {
                            const iVal = allVars['i'];
                            if (iVal < patternLen) {
                                // We are in the first loop building the initial window
                                windowRange = [0, iVal];
                            } else {
                                // We are in the main sliding window loop.
                                const currentLineContent = this.sourceLines[this.currentLine - 1]?.trim() || '';
                                const isPermutationInString = this.sourceLines.some(line => line.includes('checkInclusion'));
                                if (isPermutationInString) {
                                    const isAtComparison = currentLineContent.includes('freq1 == freq2') || currentLineContent.includes('==');
                                    if (isAtComparison) {
                                        windowRange = [iVal - patternLen, iVal - 1];
                                    } else {
                                        // The shift has executed: freq2[s2[i] - 'a']++; freq2[s2[i - s1.size()] - 'a']--;
                                        windowRange = [iVal - patternLen + 1, iVal];
                                    }
                                } else {
                                    // For other problems like find-all-anagrams:
                                    // shift happens first in the loop: fs[s[i]-'a']++; fs[s[i-p.size()]-'a']--;
                                    // and then comparison: if (equal(...))
                                    windowRange = [iVal - patternLen + 1, iVal];
                                }
                            }
                            // Clamp window range to valid bounds
                            if (windowRange) {
                                windowRange = [
                                    Math.max(0, Math.min(windowRange[0], val.length - 1)),
                                    Math.max(0, Math.min(windowRange[1], val.length - 1))
                                ];
                            }
                        }
                    }
                }

                collectedVisuals.push({
                    type: 'array_1d',
                    target: `${name.toUpperCase()} (string)`,
                    values: charArray,
                    pointers,
                    highlightIndices,
                    windowRange
                });
            }
        }

        // 8. 1D Array / Vector Detection
        for (const [name, val] of Object.entries(allVars)) {
            // Accept arrays whose elements are primitive (number/string/bool) or null
            const isPrimitive = (el: any) => el === null || typeof el === 'number' || typeof el === 'string' || typeof el === 'boolean';
            if (Array.isArray(val) && val.length >= 0 && val.every(isPrimitive)) {
                const type = (val as any).__type;
                const lower = name.toLowerCase();
                if (type === 'std::stack' || type === 'std::queue' || type === 'std::deque' || type === 'std::list') continue;
                if (STACK_NAMES.has(lower) || QUEUE_NAMES.has(lower)) continue;
                if (val.every(row => Array.isArray(row))) continue; // skip 2D array
                
                // Frequency array optimization:
                // Convert 26-element frequency vectors (freq, count, fp, fs) into high-level compact HashMaps showing only non-zero character counts.
                const isFreqArray = val.length === 26 && 
                                   (lower.includes('freq') || lower.includes('count') || lower === 'fs' || lower === 'fp') &&
                                   val.every(x => typeof x === 'number');
                if (isFreqArray) {
                    const entries: any[] = [];
                    for (let idx = 0; idx < 26; idx++) {
                        const count = val[idx];
                        if (typeof count === 'number' && count > 0) {
                            entries.push({ key: String.fromCharCode(97 + idx), value: count });
                        }
                    }
                    collectedVisuals.push({
                        type: 'hash_map',
                        target: name,
                        entries,
                        activeKeys: entries.map(e => e.key)
                    });
                    continue;
                }

                const pointers: any[] = [];
                const highlightIndices: number[] = [];

                if (rangeForArrayName === name && rangeForIndex !== undefined) {
                    highlightIndices.push(rangeForIndex);
                    pointers.push({
                        name: 'i',
                        index: rangeForIndex,
                        color: 'blue',
                        action: 'move'
                    });
                }

                // Named pointer variables
                for (const [vName, vVal] of Object.entries(allVars)) {
                    if (typeof vVal === 'number' && ALL_POINTER_NAMES.has(vName.toLowerCase())) {
                        const assocContainer = this.pointerToContainer.get(vName);
                        if (assocContainer && assocContainer !== name) {
                            continue; // Only show pointer on its associated container
                        }
                        if (vVal >= 0 && vVal < val.length) {
                            const lowerPtr = vName.toLowerCase();
                            const color = POINTER_NAMES_LEFT.has(lowerPtr)  ? 'red' :
                                          POINTER_NAMES_RIGHT.has(lowerPtr) ? 'blue' :
                                          POINTER_NAMES_MID.has(lowerPtr)   ? 'green' : 'orange';
                            if (!pointers.some(p => p.index === vVal && p.name === vName.toUpperCase().charAt(0))) {
                                pointers.push({
                                    name: vName.toUpperCase().charAt(0),
                                    index: vVal,
                                    color,
                                    action: 'static'
                                });
                                if (!highlightIndices.includes(vVal)) {
                                    highlightIndices.push(vVal);
                                }
                            }
                        }
                    }
                }

                // Determine sliding window boundary
                let windowRange: [number, number] | undefined = undefined;
                const leftPtr = pointers.find(p => p.name === 'L' || p.name === 'I' || p.name === 'S');
                const rightPtr = pointers.find(p => p.name === 'R' || p.name === 'J' || p.name === 'R');
                if (leftPtr && rightPtr) {
                    windowRange = [leftPtr.index, rightPtr.index];
                }

                const isSwapping = this.activeSwapArrayName === name && this.activeSwapIndices;
                collectedVisuals.push({
                    type: 'array_1d',
                    target: name,
                    values: [...val],
                    pointers,
                    highlightIndices,
                    windowRange,
                    ...(isSwapping ? { swapIndices: this.activeSwapIndices } : {})
                });
            }
        }

        // 9. Primitive & Pointer Scope Variables - Render each as an independent visual card!
        const ANS_VAR_NAMES = new Set(['ans', 'result', 'res', 'maxlen', 'maxsum', 'count', 'area', 'profit', 'max_len', 'min_len', 'max_val', 'min_val', 'square']);
        for (const [name, rawVal] of Object.entries(allVarsRaw)) {
            if (SYSTEM_CONSTANTS.has(name)) continue;
            if (name.startsWith('__')) continue;

            // Check if it's a pointer pointing to a heap node (ListNode or TreeNode)
            const val = allVars[name];
            if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Map) && !(val instanceof Set) && typeof rawVal === 'string' && rawVal.startsWith('#')) {
                const node = this.heap[rawVal];
                if (node) {
                    const nodeVal = node.val !== undefined ? node.val : (node.value !== undefined ? node.value : undefined);
                    if (nodeVal !== undefined) {
                        collectedVisuals.push({
                            type: 'hash_map',
                            target: name.toUpperCase(),
                            entries: [{ key: name, value: `Node(${nodeVal})` }],
                            activeKeys: [name]
                        });
                        continue;
                    }
                }
            }

            if (rawVal === null || rawVal === undefined) {
                // Null pointer or uninitialized variable
                // Only show if it's a known pointer or simple variable name (not random internal keys)
                if (['slow', 'fast', 'curr', 'prev', 'next', 'head', 'tail', 'root', 'node', 'temp', 'dummy'].includes(name.toLowerCase())) {
                    collectedVisuals.push({
                        type: 'hash_map',
                        target: name.toUpperCase(),
                        entries: [{ key: name, value: 'nullptr' }],
                        activeKeys: [name]
                    });
                }
                continue;
            }

            if (val && typeof val === 'object') continue;
            if (Array.isArray(val)) continue;
            if (val instanceof Map || val instanceof Set) continue;

            if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
                collectedVisuals.push({
                    type: 'hash_map',
                    target: name.toUpperCase(),
                    entries: [{ key: name, value: val }],
                    activeKeys: [name]
                });
            }
        }


        // Smart Canvas Layout - Type-Based Visual Prioritization
        const getPriorityScore = (v: any): number => {
            if (v.type === 'array_1d') {
                if (v.target.toLowerCase().includes('string')) return 1; // Strings first
                return 2; // Arrays/Vectors second
            }
            if (['matrix', 'tree', 'graph'].includes(v.type)) return 3;
            if (['stack', 'queue', 'deque', 'priority_queue'].includes(v.type)) return 4;
            if (v.type === 'hash_map') {
                if (v.target.toLowerCase().includes('set')) return 5;
                if (v.target.toLowerCase().includes('pair')) return 7;
                // Scope primitives (uppercase targets)
                const isPrimitive = v.entries.length === 1 && String(v.entries[0].key).toUpperCase() === v.target;
                if (isPrimitive) {
                    if (ANS_VAR_NAMES.has(String(v.entries[0].key).toLowerCase())) return 8; // Answer variables
                    if (ALL_POINTER_NAMES.has(String(v.entries[0].key).toLowerCase())) return 9; // Pointer variables
                    return 10; // Other primitives
                }
                return 6; // Standard Maps
            }
            return 100;
        };

        collectedVisuals.sort((a, b) => getPriorityScore(a) - getPriorityScore(b));

        if (collectedVisuals.length > 1) {
            return {
                type: 'multi_visuals',
                visuals: collectedVisuals
            };
        } else if (collectedVisuals.length === 1) {
            return collectedVisuals[0];
        }

        if (hasRecursion) {
            const frames: any[] = [];
            for (let i = 1; i < this.callStack.length; i++) {
                const env = this.callStack[i];
                const funcName = (env as any).functionName;
                const envLocals = this.extractLocals(env);
                
                const args: Record<string, any> = {};
                for (const [k, v] of Object.entries(envLocals)) {
                    if (k === 'this' || k.startsWith('__')) continue;
                    if (v !== null && typeof v === 'object' && !Array.isArray(v)) continue;
                    args[k] = v;
                }

                if (funcName) {
                    frames.push({
                        functionName: funcName,
                        args
                    });
                } else {
                    if (frames.length > 0) {
                        const topFrame = frames[frames.length - 1];
                        Object.assign(topFrame.args, args);
                    } else {
                        frames.push({
                            functionName: 'unknown',
                            args
                        });
                    }
                }
            }
            return {
                type: 'call_stack',
                frames,
                activeFrame: frames.length - 1
            };
        }
        return undefined;
    }


    // Generate "What just happened" — returns the raw explanation with no generic prefix
    private generateWhat(type: ExecutionTrace['type'], explanation: string): string {
        // Return the explanation as-is; calculation detail is appended by createTrace when astNode is present
        return explanation;
    }

    private extractSources(node: any): any[] {
        const sources: any[] = [];
        const self = this;
        function traverse(n: any) {
            if (!n) return;
            if (n.type === 'Identifier') {
                const lower = n.name.toLowerCase();
                if (!['abs', 'std', 'endl', 'cout', 'cin', 'int_max', 'int_min'].includes(lower)) {
                    try {
                        const val = self.currentEnv().get(n.name);
                        if (val !== undefined) {
                            sources.push({ name: n.name, value: val });
                        }
                    } catch (e) {}
                }
            } else if (n.type === 'MemberExpression') {
                if (n.object.type === 'MemberExpression' && n.object.computed && n.computed) {
                    const inner = n.object;
                    if (inner.object.type === 'Identifier') {
                        const arrayName = inner.object.name;
                        try {
                            let rVal: any = undefined;
                            let cVal: any = undefined;
                            if (inner.property.type === 'Identifier') {
                                rVal = self.currentEnv().get(inner.property.name);
                            } else if (inner.property.type === 'Literal') {
                                rVal = inner.property.value;
                            }
                            if (n.property.type === 'Identifier') {
                                cVal = self.currentEnv().get(n.property.name);
                            } else if (n.property.type === 'Literal') {
                                cVal = n.property.value;
                            }
                            if (rVal !== undefined && cVal !== undefined) {
                                let val: any = undefined;
                                const addr = self.currentEnv().get(arrayName);
                                if (typeof addr === 'string' && addr.startsWith('#')) {
                                    val = self.heap[addr]?.[rVal]?.[cVal];
                                } else {
                                    val = self.currentEnv().get(arrayName)?.[rVal]?.[cVal];
                                }
                                sources.push({ name: arrayName, row: rVal, col: cVal, value: val });
                            }
                        } catch (e) {}
                    }
                } else if (n.object.type === 'Identifier') {
                    const arrayName = n.object.name;
                    try {
                        let idxVal: any = undefined;
                        if (n.computed) {
                            if (n.property.type === 'Identifier') {
                                idxVal = self.currentEnv().get(n.property.name);
                            } else if (n.property.type === 'Literal') {
                                idxVal = n.property.value;
                            }
                        } else {
                            idxVal = n.property.type === 'Identifier' ? n.property.name : n.property.value;
                        }
                        if (idxVal !== undefined) {
                            let val: any = undefined;
                            const addr = self.currentEnv().get(arrayName);
                            if (typeof addr === 'string' && addr.startsWith('#')) {
                                  val = self.heap[addr]?.[idxVal];
                            } else {
                                  val = self.currentEnv().get(arrayName)?.[idxVal];
                            }
                            sources.push({ name: arrayName, index: idxVal, value: val });
                        }
                    } catch (e) {}
                }
                return; // Do not traverse inside MemberExpression properties
            }
            for (const key of Object.keys(n)) {
                const child = n[key];
                if (child && typeof child === 'object') {
                    if (Array.isArray(child)) {
                        child.forEach(traverse);
                    } else if (child.type) {
                        traverse(child);
                    }
                }
            }
        }
        traverse(node);
        return sources;
    }

    private extractDest(leftNode: any): any {
        if (!leftNode) return undefined;
        if (leftNode.type === 'Identifier') {
            return { name: leftNode.name };
        } else if (leftNode.type === 'MemberExpression') {
            if (leftNode.object.type === 'MemberExpression' && leftNode.object.computed && leftNode.computed) {
                const inner = leftNode.object;
                if (inner.object.type === 'Identifier') {
                    const arrayName = inner.object.name;
                    let rVal: any = undefined;
                    let cVal: any = undefined;
                    if (inner.property.type === 'Identifier') {
                        rVal = this.currentEnv().get(inner.property.name);
                    } else if (inner.property.type === 'Literal') {
                        rVal = inner.property.value;
                    }
                    if (leftNode.property.type === 'Identifier') {
                        cVal = this.currentEnv().get(leftNode.property.name);
                    } else if (leftNode.property.type === 'Literal') {
                        cVal = leftNode.property.value;
                    }
                    if (rVal !== undefined && cVal !== undefined) {
                        return { name: arrayName, row: rVal, col: cVal };
                    }
                }
            }
            if (leftNode.object.type === 'Identifier') {
                const arrayName = leftNode.object.name;
                let idxVal: any = undefined;
                if (leftNode.computed) {
                    if (leftNode.property.type === 'Identifier') {
                        idxVal = this.currentEnv().get(leftNode.property.name);
                    } else if (leftNode.property.type === 'Literal') {
                        idxVal = leftNode.property.value;
                    }
                } else {
                    idxVal = leftNode.property.type === 'Identifier' ? leftNode.property.name : leftNode.property.value;
                }
                return { name: arrayName, index: idxVal };
            }
        }
        return undefined;
    }

    // Generate state-aware "Why" text based on the actual explanation content
    private generateWhy(type: ExecutionTrace['type'], explanation: string): string {
        switch (type) {
            case 'definition': {
                // e.g. "Declared complement = 15" -> "complement is now 15"
                const m = explanation.match(/^Declared (\S+) = (.+)$/);
                if (m) return `${m[1]} is now ${m[2]}`;
                return explanation;
            }
            case 'assignment': {
                // e.g. "complement = 15" or "nums[i] = 3"
                return explanation;
            }
            case 'condition': {
                const isTrue = /\btrue\b|→\s*true|= true/i.test(explanation);
                const isFalse = /\bfalse\b|→\s*false|= false/i.test(explanation);
                if (isTrue)  return `Condition is TRUE → taking the if-branch`;
                if (isFalse) return `Condition is FALSE → skipping the if-block`;
                return explanation;
            }
            case 'loop_start': {
                const m = explanation.match(/iteration (\d+)/);
                return m ? `Loop body runs — iteration ${m[1]}` : `Loop body runs`;
            }
            case 'loop_continue': {
                const m = explanation.match(/iteration (\d+)/);
                return m ? `Continuing loop — iteration ${m[1]}` : `Continuing loop`;
            }
            case 'loop_end': {
                const m = explanation.match(/(\d+) iteration/);
                return m ? `Loop exits after ${m[1]} iteration(s)` : `Loop condition is false — loop exits`;
            }
            case 'function_call': {
                return explanation;
            }
            case 'return': {
                const m = explanation.match(/Returned (.+)/);
                return m ? `Function returns ${m[1]}` : explanation;
            }
            case 'output': {
                const m = explanation.match(/Output: (.+)/);
                return m ? `Prints: ${m[1]}` : explanation;
            }
            default:
                return explanation;
        }
    }

    // Generate "What will happen next"
    private generateNext(type: ExecutionTrace['type']): string {
        switch (type) {
            case 'definition':
            case 'assignment':
                return `Next statement executes.`;
            case 'condition':
                return `Enter chosen branch.`;
            case 'loop_start':
            case 'loop_continue':
                return `Run loop body.`;
            case 'loop_end':
                return `Continue after loop.`;
            case 'function_call':
                return `Execute function body.`;
            case 'return':
                return `Return to caller.`;
            case 'output':
                return `Next statement executes.`;
            default:
                return `Program continues.`;
        }
    }

    private updateIterators(container: any[], oldElements: any[]) {
        const visited = new Set<any>();
        const visit = (val: any) => {
            if (!val || typeof val !== 'object') return;
            if (visited.has(val)) return;
            visited.add(val);

            if (val.container === container && typeof val.index === 'number') {
                const element = oldElements[val.index];
                if (element !== undefined) {
                    const newIdx = container.indexOf(element);
                    if (newIdx !== -1) {
                        val.index = newIdx;
                    }
                }
            } else if (val instanceof Map) {
                for (const [k, v] of val.entries()) {
                    visit(k);
                    visit(v);
                }
            } else if (val instanceof Set) {
                for (const v of val.values()) {
                    visit(v);
                }
            } else {
                for (const k of Object.keys(val)) {
                    visit(val[k]);
                }
            }
        };

        // Scan call stack environments
        for (const env of this.callStack) {
            for (const v of (env as any).vars.values()) {
                visit(v);
            }
        }
        // Scan globals
        for (const v of (this.globals as any).vars.values()) {
            visit(v);
        }
        // Scan heap
        for (const v of Object.values(this.heap)) {
            visit(v);
        }
    }

    private formatValue(val: any): string {
        if (val === undefined) return 'undefined';
        if (val === null) return 'null';
        if (typeof val === 'string') return `"${val}"`;
        if (typeof val === 'number' || typeof val === 'boolean') return String(val);
        if (val instanceof Map) {
            const entries = Array.from(val.entries()).map(([k, v]) => `${this.formatValue(k)}: ${this.formatValue(v)}`);
            return `{${entries.join(', ')}}`;
        }
        if (val instanceof Set) {
            const elts = Array.from(val.values()).map(e => this.formatValue(e));
            return `{${elts.join(', ')}}`;
        }
        if (Array.isArray(val)) {
            return `[${val.map(e => this.formatValue(e)).join(', ')}]`;
        }
        if (typeof val === 'object') {
            if ('first' in val && 'second' in val) {
                return `{first: ${this.formatValue(val.first)}, second: ${this.formatValue(val.second)}}`;
            }
            if (val.__type === 'std::priority_queue') {
                return `priority_queue([${val.elements.map((e: any) => this.formatValue(e)).join(', ')}])`;
            }
            return safeStringify(val);
        }
        return String(val);
    }

    private getEvaluationDetail(node: ASTNode): { expressionCode: string; valueSubstituted: string; resultValue: any } {
        if (!node) return { expressionCode: '', valueSubstituted: '', resultValue: undefined };

        switch (node.type) {
            case 'Literal': {
                const val = (node as Literal).value;
                const str = typeof val === 'string' ? `"${val}"` : String(val);
                return { expressionCode: str, valueSubstituted: str, resultValue: val };
            }
            case 'Identifier': {
                const name = (node as Identifier).name;
                let val: any = undefined;
                try {
                    val = this.currentEnv().get(name);
                } catch (e) {}
                const valStr = this.formatValue(val);
                return { expressionCode: name, valueSubstituted: valStr, resultValue: val };
            }
            case 'BinaryExpression': {
                const bin = node as BinaryExpression;
                const left = this.getEvaluationDetail(bin.left);
                const right = this.getEvaluationDetail(bin.right);
                
                let resVal: any = undefined;
                try {
                    const op = bin.operator;
                    if (op === '+') resVal = left.resultValue + right.resultValue;
                    else if (op === '-') resVal = left.resultValue - right.resultValue;
                    else if (op === '*') resVal = left.resultValue * right.resultValue;
                    else if (op === '/') resVal = Math.trunc(left.resultValue / right.resultValue);
                    else if (op === '%') resVal = left.resultValue % right.resultValue;
                    else if (op === '==') resVal = left.resultValue === right.resultValue;
                    else if (op === '!=') resVal = left.resultValue !== right.resultValue;
                    else if (op === '<') resVal = left.resultValue < right.resultValue;
                    else if (op === '>') resVal = left.resultValue > right.resultValue;
                    else if (op === '<=') resVal = left.resultValue <= right.resultValue;
                    else if (op === '>=') resVal = left.resultValue >= right.resultValue;
                    else if (op === '&&') resVal = left.resultValue && right.resultValue;
                    else if (op === '||') resVal = left.resultValue || right.resultValue;
                } catch (e) {}

                return {
                    expressionCode: `(${left.expressionCode} ${bin.operator} ${right.expressionCode})`,
                    valueSubstituted: `(${left.valueSubstituted} ${bin.operator} ${right.valueSubstituted})`,
                    resultValue: resVal
                };
            }
            case 'MemberExpression': {
                const mem = node as MemberExpression;
                const obj = this.getEvaluationDetail(mem.object);
                
                let propStr = '';
                let propVal: any = undefined;
                if (mem.computed) {
                    const propDetail = this.getEvaluationDetail(mem.property);
                    propStr = propDetail.expressionCode;
                    propVal = propDetail.resultValue;
                    const propValStr = this.formatValue(propVal);
                    
                    let resVal: any = undefined;
                    try {
                        let target = obj.resultValue;
                        if (typeof target === 'string' && target.startsWith('#')) target = this.heap[target];
                        if (target instanceof Map) {
                            resVal = target.get(propVal);
                        } else {
                            resVal = Array.isArray(target) ? target[propVal] : target?.[propVal];
                        }
                    } catch (e) {}

                    return {
                        expressionCode: `${obj.expressionCode}[${propStr}]`,
                        valueSubstituted: `${obj.valueSubstituted}[${propValStr}]`,
                        resultValue: resVal
                    };
                } else {
                    propStr = (mem.property as Identifier).name;
                    propVal = propStr;

                    let resVal: any = undefined;
                    try {
                        let target = obj.resultValue;
                        if (typeof target === 'string' && target.startsWith('#')) target = this.heap[target];
                        resVal = target?.[propVal];
                    } catch (e) {}

                    return {
                        expressionCode: `${obj.expressionCode}.${propStr}`,
                        valueSubstituted: `${obj.valueSubstituted}.${propStr}`,
                        resultValue: resVal
                    };
                }
            }
            case 'ArrayExpression': {
                const arr = node as ArrayExpression;
                const elDetails = arr.elements.map(el => this.getEvaluationDetail(el));
                const symbolic = `{${elDetails.map(e => e.expressionCode).join(', ')}}`;
                const valued = `{${elDetails.map(e => e.valueSubstituted).join(', ')}}`;
                const resVal = elDetails.map(e => e.resultValue);
                return { expressionCode: symbolic, valueSubstituted: valued, resultValue: resVal };
            }
            case 'CallExpression': {
                const call = node as CallExpression;
                const callee = typeof call.callee === 'string'
                    ? { expressionCode: call.callee, valueSubstituted: call.callee, resultValue: undefined }
                    : this.getEvaluationDetail(call.callee);
                const args = call.arguments.map(arg => this.getEvaluationDetail(arg));
                
                const argsExprStr = args.map(a => a.expressionCode).join(', ');
                const argsValStr = args.map(a => a.valueSubstituted).join(', ');
                
                let resVal: any = undefined;
                try {
                    const calleeCode = callee.expressionCode;
                    if (calleeCode.endsWith('.count')) {
                        const targetMap = calleeCode.substring(0, calleeCode.length - 6);
                        const mapObj = this.currentEnv().get(targetMap);
                        if (mapObj instanceof Map) {
                            resVal = mapObj.has(args[0].resultValue) ? 1 : 0;
                        } else if (mapObj instanceof Set) {
                            resVal = mapObj.has(args[0].resultValue) ? 1 : 0;
                        }
                    } else if (calleeCode.endsWith('.size')) {
                        const targetObj = calleeCode.substring(0, calleeCode.length - 5);
                        const objVal = this.currentEnv().get(targetObj);
                        if (Array.isArray(objVal) || typeof objVal === 'string') {
                            resVal = objVal.length;
                        } else if (objVal instanceof Map || objVal instanceof Set) {
                            resVal = objVal.size;
                        }
                    } else if (calleeCode === 'abs' || calleeCode === 'std::abs') {
                        resVal = Math.abs(args[0].resultValue);
                    } else if (calleeCode === 'stoi' || calleeCode === 'std::stoi') {
                        resVal = parseInt(args[0].resultValue);
                    } else if (calleeCode === 'to_string' || calleeCode === 'std::to_string') {
                        resVal = String(args[0].resultValue);
                    }
                } catch (e) {}

                return {
                    expressionCode: `${callee.expressionCode}(${argsExprStr})`,
                    valueSubstituted: `${callee.valueSubstituted}(${argsValStr})`,
                    resultValue: resVal
                };
            }
            case 'UnaryExpression': {
                const unary = node as any;
                const arg = this.getEvaluationDetail(unary.argument);
                let resVal: any = undefined;
                try {
                    const op = unary.operator;
                    if (op === '!') resVal = !arg.resultValue;
                    else if (op === '~') resVal = ~arg.resultValue;
                    else if (op === '-') resVal = -arg.resultValue;
                } catch (e) {}
                return {
                    expressionCode: `${unary.operator}${arg.expressionCode}`,
                    valueSubstituted: `${unary.operator}${arg.valueSubstituted}`,
                    resultValue: resVal
                };
            }
            case 'UpdateExpression': {
                const upd = node as UpdateExpression;
                const arg = this.getEvaluationDetail(upd.argument);
                return {
                    expressionCode: upd.prefix ? `${upd.operator}${arg.expressionCode}` : `${arg.expressionCode}${upd.operator}`,
                    valueSubstituted: upd.prefix ? `${upd.operator}${arg.valueSubstituted}` : `${arg.valueSubstituted}${upd.operator}`,
                    resultValue: arg.resultValue
                };
            }
            default: {
                return { expressionCode: 'value', valueSubstituted: 'value', resultValue: undefined };
            }
        }
    }

    private getEvaluatedNodeString(node: ASTNode): string {
        if (node.type === 'Identifier') {
            const name = (node as Identifier).name;
            let val: any = undefined;
            try {
                val = this.currentEnv().get(name);
            } catch (e) {}
            return typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean' ? String(val) : name;
        }
        if (node.type === 'MemberExpression') {
            const mem = node as MemberExpression;
            const objStr = this.getEvaluatedNodeString(mem.object);
            if (mem.computed) {
                let propVal: any = '?';
                try {
                    const propDetail = this.getEvaluationDetail(mem.property);
                    propVal = propDetail.resultValue !== undefined ? propDetail.resultValue : '?';
                } catch (e) {}
                return `${objStr}[${propVal}]`;
            } else {
                return `${objStr}.${(mem.property as Identifier).name}`;
            }
        }
        if (node.type === 'Literal') {
            return String((node as Literal).value);
        }
        return 'value';
    }

    private getNodeString(node: ASTNode): string {
        if (node.type === 'Identifier') return (node as Identifier).name;
        if (node.type === 'MemberExpression') {
            const mem = node as MemberExpression;
            const objStr = this.getNodeString(mem.object);
            if (mem.computed) {
                const propStr = mem.property.type === 'Identifier' ? (mem.property as Identifier).name : 
                               (mem.property.type === 'Literal' ? String((mem.property as Literal).value) : '?');
                return `${objStr}[${propStr}]`;
            } else {
                return `${objStr}.${(mem.property as Identifier).name}`;
            }
        }
        return 'value';
    }

    private trackMatrixAccess(target: any, idx: any) {
        if (Array.isArray(target) && '__parentArray' in target) {
            const parent = (target as any).__parentArray;
            const rowIdx = (target as any).__rowIndex;
            const colIdx = Number(idx);
            if (parent && Array.isArray(parent) && !isNaN(colIdx)) {
                const pAny = parent as any;
                pAny.__lastAccessedCell = { r: rowIdx, c: colIdx };
                if (!pAny.__visitedCells) {
                    pAny.__visitedCells = [];
                }
                const alreadyVisited = pAny.__visitedCells.some((cell: any) => cell.r === rowIdx && cell.c === colIdx);
                if (!alreadyVisited) {
                    pAny.__visitedCells.push({ r: rowIdx, c: colIdx });
                }
            }
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
class ContinueException { }

