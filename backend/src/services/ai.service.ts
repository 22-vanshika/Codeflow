import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { Lexer, Parser } from '../engine/languages/cpp/parser';
dotenv.config();

export class AiService {
    private groq: Groq;
    private apiKey: string | undefined;

    // Use Llama 3.3 for best speed/quality balance (3.1 decommissioned Jan 2025)
    private readonly MODEL = "llama-3.3-70b-versatile";

    constructor() {
        const key = process.env.GROQ_API_KEY;
        this.apiKey = key ? key.trim() : undefined;

        if (!this.apiKey) {
            console.warn("GROQ_API_KEY not found. AI features will use mocks.");
        } else {
            console.log(`AI Initialized (Groq). Key starts with: ${this.apiKey.substring(0, 4)}...`);
        }

        this.groq = new Groq({ apiKey: this.apiKey || "mock-key" });
    }

    private async generateCompletion(prompt: string, jsonMode: boolean = false): Promise<string> {
        if (!this.apiKey) throw new Error("No API Key");

        try {
            const completion = await this.groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: this.MODEL,
                temperature: 0.1,
                max_tokens: 8192,
                response_format: jsonMode ? { type: 'json_object' } : undefined
            });

            return completion.choices[0]?.message?.content || "";
        } catch (error: any) {
            console.error(`Groq API Error: ${error.message}`);
            throw error;
        }
    }

    private getAnalysisPrompt(code: string): string {
        return `
        Analyze this C++ code for a beginner programmer.
        
        Return a JSON object with the following keys:
        - "title": A brief descriptive title for the algorithm/code
        - "timeComplexity": Time complexity in Big-O notation (e.g., "O(N)", "O(N²)", "O(log N)")
        - "spaceComplexity": Space complexity in Big-O notation (e.g., "O(1)", "O(N)")
        - "complexityExplanation": A brief explanation of why the code has this complexity (1-2 sentences)
        - "pattern": The algorithmic pattern used (e.g., "Two Pointers", "Sliding Window", "Recursion", "Iteration")
        - "explanation": A map of line numbers to explanations (e.g., {"5": "This initializes the counter"})
        - "overview": A brief summary of what the code does
        
        Code:
        ${code}
        `;
    }

    private getTracePrompt(code: string, input: string): string {
        return `
        You are a strict C++ execution simulator generating a step-by-step pedagogical trace for a code visualizer (like SWE180 or PythonTutor). 
        You MUST simulate the code LINE-BY-LINE. Do NOT skip any loop iterations. Do NOT summarize steps. Every single time a line of code executes, you must generate a new step.
        
        CRITICAL RULES:
        1. STRICTLY LINE-BY-LINE: If a loop runs 5 times, you must generate steps for the loop condition and loop body 5 times.
        2. NO SKIPPING: Do not summarize "The loop finishes". Trace every exact iteration and comparison.
        3. VARIABLE TRACKING: Update the 'variables' dictionary at every step with the current precise state of local variables.
        4. POINTER VISUALS: If visualizing arrays/graphs, the 'pointers' array MUST continuously update its 'index' or 'nodeId' position to match the current variable state (e.g. if 'i' increments, the pointer for 'i' must have the new index).
        5. HIGHLIGHTING: The 'line' number must accurately reflect the exact line currently executing.
        6. CONDITIONALS: Log conditions being checked before entering if/else blocks.
        
        Input provided to the program (if any cin/scanf/arguments): "${input}"
        
        Determine if the algorithm is dealing with a specific data structure and provide a matching "visuals" object. Supported types:
        - "graph": {type: "graph", nodes: [{id, value, label}], edges: [{from, to, directed, weight}], activeNodes: [], visitedNodes: []}
        - "tree": {type: "tree", nodes: [{id, value, parentId}], activeNodes: [], visitedNodes: []}
        - "stack" | "queue": {type: "stack"|"queue", target: string, elements: any[], pointers: [{name, index, color}], activeIndices: []}
        - "array_1d": {type: "array_1d", target: string, values: any[], pointers: [{name, index, color, action}], highlightIndices: []}
        - "hash_map": {type: "hash_map", target: string, entries: [{key, value}], activeKeys: []}
        
        Return a JSON object matching this TypeScript interface exactly:
        {
            success: boolean;
            pattern?: { name: string; description: string; color: string; };
            totalSteps: number;
            output?: string;
            steps: {
                step: number; 
                line: number; 
                lineContent: string; 
                type: "assignment" | "condition" | "loop_start" | "loop_continue" | "loop_end" | "function_call" | "return" | "comparison";
                variables: Record<string, any>;
                visuals?: object; // Must match one of the schema types described above based on current state
                teacherNote: { what: string; why: string; next: string; };
            }[];
        }

        Code to trace:
        ${code}
        `;
    }

    private getFlowchartPrompt(code: string): string {
        return `
        Create a Mermaid.js flowchart (graph TD) for the logic of this code.
        Return ONLY the mermaid code string. No markdown formatting.
        
        Code:
        ${code}
        `;
    }

    public async analyzeCode(code: string): Promise<any> {
        if (!this.apiKey) return this.mockAnalyze(code);

        const prompt = this.getAnalysisPrompt(code);

        try {
            const text = await this.generateCompletion(prompt, true);
            return JSON.parse(text);
        } catch (error) {
            console.warn("AI Analysis Failed, using mock.");
            return this.mockAnalyze(code);
        }
    }

    public async generateFlowchart(code: string): Promise<any> {
        if (!this.apiKey) return this.mockFlowchart(code);

        const prompt = this.getFlowchartPrompt(code);

        try {
            let text = await this.generateCompletion(prompt, false);
            // Clean markdown if present
            text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
            return {
                markdown: text,
                mapping: {}
            };
        } catch (error) {
            console.warn("AI Flowchart Failed, using mock.");
            return this.mockFlowchart(code);
        }
    }

    public async generateTrace(code: string, input: string): Promise<any> {
        if (!this.apiKey) return this.mockTrace(code);

        const prompt = this.getTracePrompt(code, input);

        try {
            const text = await this.generateCompletion(prompt, true);
            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error("AI Trace Failed:", error);
            return { success: false, error: "AI Trace generation failed." };
        }
    }

    // --- MOCK GENERATORS ---
    private mockAnalyze(code: string): any {
        return {
            title: "Code Analysis (Mock)",
            timeComplexity: "O(N)",
            spaceComplexity: "O(1)",
            complexityExplanation: "Linear time due to single loop, constant space as no additional data structures used.",
            pattern: "Linear Scan",
            explanation: { "1": "Example explanation (AI unavailable)." },
            overview: "Groq API key missing or failed. Using fallback."
        };
    }

    private mockFlowchart(code: string): any {
        return {
            markdown: `graph TD;\nA([Start]) --> B[Process];\nB --> C([End]);`,
            mapping: {}
        };
    }

    private mockTrace(code: string): any {
        return {
            success: false,
            error: "No API Key available to generate trace."
        };
    }
}

import { FlowchartData, FlowchartNodeMetadata } from '../types';

// Helper Class to build Mermaid Syntax with enhanced visualization support
class MermaidBuilder {
    private nodes: string[] = [];
    private edges: string[] = [];
    private nidCount: number = 0;
    private mapping: Record<string, string> = {};                     // Line -> NodeId
    private nodeMetadata: Record<string, FlowchartNodeMetadata> = {}; // NodeId -> Metadata
    private executionOrder: string[] = [];                            // Nodes in visitation order

    // Generate unique ID
    private nextId(): string {
        return `n${this.nidCount++}`;
    }

    public addNode(
        id: string,
        label: string,
        line?: number,
        metadata?: FlowchartNodeMetadata
    ): void {
        this.nodes.push(`${id}${label}`);
        if (line) {
            this.mapping[String(line)] = id;
        }
        if (metadata) {
            this.nodeMetadata[id] = metadata;
        }
        // Add to execution order (will be refined during traversal)
        this.executionOrder.push(id);
    }

    public addEdge(from: string, to: string, label?: string): void {
        const arrow = label ? `-->|${label}|` : '-->';
        this.edges.push(`${from} ${arrow} ${to}`);

        // Track branches in node metadata
        if (label && this.nodeMetadata[from]) {
            if (!this.nodeMetadata[from].branches) {
                this.nodeMetadata[from].branches = [];
            }
            this.nodeMetadata[from].branches!.push({ label, targetNodeId: to });
        }
    }

    public toString(): string {
        return `graph TD;\n${this.nodes.join(';\n')};\n${this.edges.join(';\n')};`;
    }

    public toJSON(): FlowchartData {
        return {
            markdown: this.toString(),
            mapping: this.mapping,
            nodeMetadata: this.nodeMetadata,
            executionOrder: this.executionOrder
        };
    }

    // Process a block of statements and return the last node ID
    public processBlock(statements: any[], entryId: string, firstEdgeLabel?: string): string {
        let prevId = entryId;
        let isFirst = true;

        for (const stmt of statements) {
            const nodeId = this.nextId();
            const line = stmt.line;

            if (stmt.type === 'IfStatement') {
                // Decision diamond for if/else
                const cond = this.sanitize(this.expressionToString(stmt.test));
                this.addNode(nodeId, `{${cond}?}`, line, {
                    type: 'decision',
                    condition: cond
                });
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                // True branch (consequent)
                const trueStmts = stmt.consequent.type === 'Block' ? stmt.consequent.body : [stmt.consequent];
                const trueEndId = this.processBlock(trueStmts, nodeId, "Yes ✓");

                // False branch (alternate)
                let falseEndId = nodeId;
                if (stmt.alternate) {
                    const falseStmts = stmt.alternate.type === 'Block' ? stmt.alternate.body : [stmt.alternate];
                    falseEndId = this.processBlock(falseStmts, nodeId, "No ✗");
                }

                // Merge point after if/else
                const mergeId = this.nextId();
                this.addNode(mergeId, `(( ))`, undefined, { type: 'merge' });
                this.addEdge(trueEndId, mergeId);
                if (stmt.alternate) {
                    this.addEdge(falseEndId, mergeId);
                } else {
                    this.addEdge(nodeId, mergeId, "No ✗");
                }
                prevId = mergeId;
            }
            else if (stmt.type === 'WhileStatement' || stmt.type === 'ForStatement') {
                // Loop with actual looping arrow
                const testExpr = stmt.test ? this.expressionToString(stmt.test) : "true";
                const cond = this.sanitize(testExpr);

                // Loop condition node (diamond shape)
                this.addNode(nodeId, `{🔄 ${cond}?}`, line, {
                    type: 'loop',
                    condition: cond
                });
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                // Loop body
                const bodyStmts = stmt.body.type === 'Block' ? stmt.body.body : [stmt.body];
                const bodyEndId = this.processBlock(bodyStmts, nodeId, "True ↓");

                // Loop back arrow - this is the key visual for loops!
                this.addEdge(bodyEndId, nodeId, "↩ Repeat");

                // Exit path
                const exitId = this.nextId();
                this.addNode(exitId, `(( ))`, undefined, { type: 'merge' });
                this.addEdge(nodeId, exitId, "False → Exit");
                prevId = exitId;
            }
            else if (stmt.type === 'SwitchStatement') {
                // Switch with fan-out to cases
                const switchExpr = this.sanitize(this.expressionToString(stmt.discriminant));
                this.addNode(nodeId, `{Switch: ${switchExpr}}`, line, {
                    type: 'decision',
                    condition: switchExpr
                });
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                // Create merge point for all cases
                const mergeId = this.nextId();
                this.addNode(mergeId, `(( ))`, undefined, { type: 'merge' });

                // Process each case
                if (stmt.cases && Array.isArray(stmt.cases)) {
                    for (const caseClause of stmt.cases) {
                        const caseLabel = caseClause.test
                            ? `case ${this.expressionToString(caseClause.test)}`
                            : 'default';
                        const caseEndId = this.processBlock(caseClause.consequent || [], nodeId, caseLabel);
                        this.addEdge(caseEndId, mergeId);
                    }
                }
                prevId = mergeId;
            }
            else {
                // Regular statement - determine type and use appropriate shape
                let label = this.getStatementLabel(stmt);
                let metadata: FlowchartNodeMetadata = { type: 'process' };

                // Stack/Queue operations: Use cylinder/database shape
                if (label.startsWith('Push') || label.startsWith('Pop')) {
                    this.addNode(nodeId, `[("📥 ${label}")]`, line, {
                        type: 'data_structure',
                        dataStructure: 'stack'
                    });
                }
                else if (label.startsWith('Enqueue') || label.startsWith('Dequeue')) {
                    this.addNode(nodeId, `[("📤 ${label}")]`, line, {
                        type: 'data_structure',
                        dataStructure: 'queue'
                    });
                }
                else if (label.startsWith('Insert')) {
                    this.addNode(nodeId, `[("➕ ${label}")]`, line, {
                        type: 'data_structure',
                        dataStructure: 'array'
                    });
                }
                // Function Call: Use subroutine shape
                else if (label.startsWith('Call')) {
                    this.addNode(nodeId, `[[📞 ${label}]]`, line, { type: 'call' });
                }
                // Return: Use stadium shape
                else if (label.startsWith('Return')) {
                    this.addNode(nodeId, `([🔙 ${label}])`, line, { type: 'return' });
                }
                // Output/Input: Use parallelogram
                else if (label.startsWith('Output') || label.startsWith('Input')) {
                    this.addNode(nodeId, `[/${label}/]`, line, { type: 'process' });
                }
                // Default process box
                else {
                    this.addNode(nodeId, `[${label}]`, line, { type: 'process' });
                }

                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);
                prevId = nodeId;
            }
            isFirst = false;
        }
        return prevId;
    }

    private expressionToString(expr: any): string {
        if (!expr) return "";
        if (expr.type === 'BinaryExpression') {
            return `${this.expressionToString(expr.left)} ${expr.operator} ${this.expressionToString(expr.right)}`;
        }
        if (expr.type === 'Identifier') return expr.name;
        if (expr.type === 'Literal') {
            if (typeof expr.value === 'string') return `'${expr.value}'`;
            return String(expr.value);
        }
        if (expr.type === 'CallExpression') {
            const callee = this.expressionToString(expr.callee);
            return `${callee}()`;
        }
        if (expr.type === 'MemberExpression') {
            return `${this.expressionToString(expr.object)}.${this.expressionToString(expr.property)}`;
        }
        if (expr.type === 'UpdateExpression') {
            return `${this.expressionToString(expr.argument)}${expr.operator}`;
        }
        return "...";
    }

    private getStatementLabel(stmt: any): string {
        // Variable Declaration
        if (stmt.type === 'VariableDeclaration') {
            if (stmt.init && stmt.init.type === 'CallExpression') {
                const callee = this.expressionToString(stmt.init.callee);
                return `Call ${callee} → ${stmt.name}`;
            }
            if (stmt.init) {
                const val = this.expressionToString(stmt.init);
                return `${stmt.name} = ${this.sanitize(val)}`;
            }
            return `Declare ${stmt.name}`;
        }

        // Assignment
        if (stmt.type === 'Assignment') {
            const target = stmt.left ? this.expressionToString(stmt.left) : stmt.name;
            const val = this.expressionToString(stmt.value);
            return `${target} = ${this.sanitize(val)}`;
        }

        // Output (cout)
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'BinaryExpression' && stmt.expression.operator === '<<') {
            return "Output";
        }

        // Input (cin)
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'BinaryExpression' && stmt.expression.operator === '>>') {
            return "Input";
        }

        // Stack/Queue Operations
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'CallExpression') {
            const call = stmt.expression;
            const callee = this.expressionToString(call.callee);
            if (callee.includes('.push')) return `Push to ${callee.split('.')[0]}`;
            if (callee.includes('.pop')) return `Pop from ${callee.split('.')[0]}`;
            if (callee.includes('.push_back')) return `Push to ${callee.split('.')[0]}`;
            if (callee.includes('.push_front')) return `Enqueue to ${callee.split('.')[0]}`;
            if (callee.includes('.pop_front')) return `Dequeue from ${callee.split('.')[0]}`;
            if (callee.includes('.insert')) return `Insert into ${callee.split('.')[0]}`;
            if (callee.includes('.erase')) return `Remove from ${callee.split('.')[0]}`;
            return `Call ${callee}`;
        }

        // Return
        if (stmt.type === 'ReturnStatement') {
            if (stmt.argument && this.containsCall(stmt.argument)) {
                return `Return & Call`;
            }
            if (stmt.argument) {
                return `Return ${this.sanitize(this.expressionToString(stmt.argument))}`;
            }
            return "Return";
        }

        // Update expression (i++, i--)
        if (stmt.type === 'UpdateExpression') {
            return this.expressionToString(stmt);
        }
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'UpdateExpression') {
            return this.expressionToString(stmt.expression);
        }

        // Process generic ExpressionStatement (avoid empty string)
        if (stmt.type === 'ExpressionStatement') {
            return this.sanitize(this.expressionToString(stmt.expression));
        }

        return stmt.type.replace('Statement', '').replace('Expression', '');
    }

    // Helper to check for nested calls (recursion detection)
    private containsCall(expr: any): boolean {
        if (!expr) return false;
        if (expr.type === 'CallExpression') return true;
        if (expr.type === 'BinaryExpression') return this.containsCall(expr.left) || this.containsCall(expr.right);
        return false;
    }

    private sanitize(str: string): string {
        return str.replace(/"/g, "'").replace(/[\[\]\{\}\(\)]/g, '').substring(0, 25);
    }
}

