
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

// Helper Class to build Mermaid Syntax
class MermaidBuilder {
    private nodes: string[] = [];
    private edges: string[] = [];
    private nidCount: number = 0;
    private mapping: Record<string, string> = {}; // Line -> NodeId

    // Generate unique ID
    private nextId(): string {
        return `n${this.nidCount++}`;
    }

    public addNode(id: string, label: string, line?: number): void {
        this.nodes.push(`${id}${label}`);
        if (line) {
            // Map the line to this node. 
            // If multiple nodes on same line, last one wins (usually fine for highlighting active step)
            // Or we could store array. For highlighting, pointing to the 'main' block of the line is enough.
            this.mapping[String(line)] = id;
        }
    }

    public addEdge(from: string, to: string, label?: string): void {
        const arrow = label ? `-->|${label}|` : '-->';
        this.edges.push(`${from} ${arrow} ${to}`);
    }

    public toString(): string {
        return `graph TD;\n${this.nodes.join(';\n')};\n${this.edges.join(';\n')};`;
    }

    public toJSON(): { markdown: string, mapping: Record<string, string> } {
        return {
            markdown: this.toString(),
            mapping: this.mapping
        };
    }

    // Overload
    public processBlock(statements: any[], entryId: string, firstEdgeLabel?: string): string {
        let prevId = entryId;
        let isFirst = true;

        for (const stmt of statements) {
            const nodeId = this.nextId();
            const line = stmt.line;

            if (stmt.type === 'IfStatement') {
                const cond = this.sanitize(this.expressionToString(stmt.test));
                this.addNode(nodeId, `{${cond}?}`, line);
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                const trueStmts = stmt.consequent.type === 'Block' ? stmt.consequent.body : [stmt.consequent];
                const trueEndId = this.processBlock(trueStmts, nodeId, "Yes");

                let falseEndId = nodeId;
                if (stmt.alternate) {
                    const falseStmts = stmt.alternate.type === 'Block' ? stmt.alternate.body : [stmt.alternate];
                    falseEndId = this.processBlock(falseStmts, nodeId, "No");
                }

                const mergeId = this.nextId();
                this.addNode(mergeId, `(( ))`); // No line for merge point?
                this.addEdge(trueEndId, mergeId);
                if (stmt.alternate) {
                    this.addEdge(falseEndId, mergeId);
                } else {
                    this.addEdge(nodeId, mergeId, "No");
                }
                prevId = mergeId;
            }
            else if (stmt.type === 'WhileStatement' || stmt.type === 'ForStatement') {
                const testExpr = stmt.test ? this.expressionToString(stmt.test) : "true";
                const cond = this.sanitize(testExpr);
                this.addNode(nodeId, `{Loop: ${cond}?}`, line);
                this.addEdge(prevId, nodeId, isFirst ? firstEdgeLabel : undefined);

                const bodyStmts = stmt.body.type === 'Block' ? stmt.body.body : [stmt.body];
                const bodyEndId = this.processBlock(bodyStmts, nodeId, "True");
                this.addEdge(bodyEndId, nodeId);

                const exitId = this.nextId();
                this.addNode(exitId, `(( ))`);
                this.addEdge(nodeId, exitId, "False");
                prevId = exitId;
            }
            else {
                let label = this.getStatementLabel(stmt);

                // Stack/Queue Visualization: Use Database Shape [( )]
                if (label.startsWith('Push') || label.startsWith('Pop') || label.startsWith('Insert')) {
                    this.addNode(nodeId, `[("${label}")]`, line);
                }
                // Function Call: Use Subroutine Shape [[ ]]
                else if (label.startsWith('Call')) {
                    this.addNode(nodeId, `[[${label}]]`, line);
                }
                else if (label.startsWith('Return')) {
                    this.addNode(nodeId, `([${label}])`, line);
                }
                else if (label.startsWith('Output') || label.startsWith('Input')) {
                    this.addNode(nodeId, `[/${label}/]`, line);
                }
                else {
                    this.addNode(nodeId, `[${label}]`, line);
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
            // Visualize Stack/Queue operations in expression
            const callee = this.expressionToString(expr.callee);
            if (callee.includes('.push') || callee.includes('.pop') || callee.includes('.top') || callee.includes('.front')) {
                return `${callee}()`;
            }
            return `${callee}()`;
        }
        if (expr.type === 'MemberExpression') {
            return `${this.expressionToString(expr.object)}.${this.expressionToString(expr.property)}`;
        }
        return "...";
    }

    private getStatementLabel(stmt: any): string {
        // Variable Declaration
        if (stmt.type === 'VariableDeclaration') {
            // Check for initialization call
            if (stmt.init && stmt.init.type === 'CallExpression') {
                const callee = this.expressionToString(stmt.init.callee);
                return `Call ${callee} -> ${stmt.name}`;
            }
            return `Set ${stmt.name}`;
        }

        // Output
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'BinaryExpression' && stmt.expression.operator === '<<' && (stmt.expression.left as any).name === 'std::cout') return "Output";

        // Stack/Queue Operations (ExpressionStatement -> CallExpression)
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'CallExpression') {
            const call = stmt.expression;
            const callee = this.expressionToString(call.callee);
            if (callee.includes('.push')) return `Push to ${callee.split('.')[0]}`;
            if (callee.includes('.pop')) return `Pop from ${callee.split('.')[0]}`;
            if (callee.includes('.insert')) return `Insert into ${callee.split('.')[0]}`;
            return `Call ${callee}`;
        }

        // Return
        if (stmt.type === 'ReturnStatement') {
            // Check if return value involves a call (Recursion)
            if (stmt.argument && this.containsCall(stmt.argument)) {
                return `Return & Call`;
            }
            return "Return";
        }

        return stmt.type.replace('Statement', '');
    }

    // Helper to check for nested calls (simple depth check)
    private containsCall(expr: any): boolean {
        if (!expr) return false;
        if (expr.type === 'CallExpression') return true;
        if (expr.type === 'BinaryExpression') return this.containsCall(expr.left) || this.containsCall(expr.right);
        return false;
    }

    private sanitize(str: string): string {
        return str.replace(/"/g, "'").replace(/[\[\]\{\}\(\)]/g, '').substring(0, 30);
    }
}
