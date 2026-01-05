
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { Lexer, Parser } from '../engine/languages/cpp/parser';
dotenv.config();

export class AiService {
    private genAI: GoogleGenerativeAI;
    private apiKey: string | undefined;

    // List of models to try in order of preference
    private readonly MODELS = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

    constructor() {
        const key = process.env.GOOGLE_API_KEY;
        this.apiKey = key ? key.trim() : undefined; // Ensure no whitespace

        if (!this.apiKey) {
            console.warn("GOOGLE_API_KEY not found. AI disabled.");
        } else {
            console.log(`AI Initialized. Key length: ${this.apiKey.length}, Starts with: ${this.apiKey.substring(0, 4)}...`);
        }

        this.genAI = new GoogleGenerativeAI(this.apiKey || "mock-key");
    }

    private async generateWithFallback(prompt: string): Promise<any> {
        if (!this.apiKey) throw new Error("No API Key");

        let lastError;

        for (const modelName of this.MODELS) {
            try {
                // console.log(`Attempting with model: ${modelName}`); 
                const model = this.genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                // If we get here, it worked!
                console.log(`Success with model: ${modelName}`);
                return result;
            } catch (error: any) {
                console.warn(`Failed with ${modelName}: ${error.status || error.message}`);
                lastError = error;
                // If 404 (Not Found) or 503 (Service Unavailable), try next.
                // If 401 (Invalid Key), abort immediately.
                if (error.status === 400 || error.status === 401) {
                    throw error;
                }
            }
        }
        throw lastError;
    }


    private getAnalysisPrompt(code: string): string {
        return `
        Analyze the following Algorithm/Code for a beginner student.
        Code:
        ${code}

        Return a JSON object (NO MARKDOWN, JUST JSON) with:
        - title: A short beginner friendly title
        - complexity: Time and Space complexity
        - pattern: The algorithmic pattern used (e.g. "Two Pointers", "Recursion")
        - explanation: A dictionary/map of line numbers to a simple 1-sentence logic explanation.
        - overview: A short paragraph explaining the "Idea".
        `;
    }

    private getFlowchartPrompt(code: string): string {
        return `
        Create a Mermaid.js flowchart (graph TD) for the logic of this code.
        Focus on LOGICAL steps. Group logical blocks.
        Code:
        ${code}

        Return ONLY the raw Mermaid syntax string. No markdown block.
        `;
    }

    public async analyzeCode(code: string): Promise<any> {
        // Mock fallback if no key
        if (!this.apiKey) return this.mockAnalyze(code);

        const prompt = this.getAnalysisPrompt(code);

        try {
            const result = await this.generateWithFallback(prompt);
            const response = result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error: any) {
            console.error("All AI Models Failed. Switching to Mock Analysis.");
            return this.mockAnalyze(code);
        }
    }

    public async generateFlowchart(code: string): Promise<any> {
        if (!this.apiKey) return this.mockFlowchart(code);

        const prompt = this.getFlowchartPrompt(code);

        try {
            const result = await this.generateWithFallback(prompt);
            const response = result.response;
            let text = response.text();
            text = text.replace(/```mermaid/g, '').replace(/```/g, '').trim();
            return {
                markdown: text,
                mapping: {}
            };
        } catch (error: any) {
            console.error("All AI Models Failed. Switching to Mock Flowchart.");
            return this.mockFlowchart(code);
        }
    }

    // --- MOCK GENERATORS ---

    private mockAnalyze(code: string): any {
        return {
            title: "Code Execution (Local)",
            complexity: "Analysis Unavailable (API Error)",
            pattern: "Standard Execution",
            explanation: { "1": "Program starts here." },
            overview: "The backend could not connect to Google AI (404/Quota). This is a simplified local view."
        };
    }

    private mockFlowchart(code: string): any {
        try {
            // 1. Tokenize & Parse
            const lexer = new Lexer(code);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            const program = parser.parse();

            // 2. Build Mermaid Graph
            const graph = new MermaidBuilder();
            graph.addNode('start', '([Start])');

            // We assume 'main' function body is the flow we want
            const main = program.body.find(n => n.type === 'FunctionDeclaration' && (n as any).name === 'main');

            if (main) {
                const lastId = graph.processBlock((main as any).body.body, 'start');
                graph.addEdge(lastId, 'end_node');
            } else {
                // Fallback if no main: process all top level statements that are not func decls?
                // Or just process first function?
                // Let's just create a generic flow
                graph.addNode('info', '[No main() found]');
                graph.addEdge('start', 'info');
                graph.addEdge('info', 'end_node');
            }

            graph.addNode('end_node', '([End])');

            return graph.toJSON();

        } catch (e: any) {
            console.error("Mock Flowchart Generation Failed:", e);
            // Fallback to error node
            return {
                markdown: `graph TD;\nA([Start]) --> B[Error: ${e.message.replace(/["\n]/g, '')}];\nB --> C([End]);`,
                mapping: {}
            };
        }
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

