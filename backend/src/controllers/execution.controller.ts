import { WebSocket } from 'ws';
import { ExecutionService } from '../services/execution.service';
import { CompilerService } from '../services/compiler.service';
import { CodeValidator } from '../services/validation.service';
import { TraceService } from '../services/trace.service';
import { ExecutionRequest, ExecutionResponse, ValidationPayload } from '../types';

export class ExecutionController {
    private executionService: ExecutionService;
    private compilerService: CompilerService;
    private codeValidator: CodeValidator;
    private traceService: TraceService;

    constructor() {
        this.executionService = new ExecutionService();
        this.compilerService = new CompilerService();
        this.codeValidator = new CodeValidator();
        this.traceService = new TraceService();
    }

    public handleMessage(ws: WebSocket, message: string) {
        try {
            const msg = JSON.parse(message);

            switch (msg.type) {
                case 'EXECUTE':
                    // This is "Simulate/Visualize"
                    this.handleExecute(ws, msg.payload);
                    break;
                case 'RUN_CODE':
                    // This is "Real Run" (Piston)
                    this.handleRunCode(ws, msg.payload);
                    break;
                case 'VALIDATE':
                    this.handleValidate(ws, msg.payload);
                    break;
                case 'EXECUTE_WITH_FIX':
                    this.handleExecuteWithFix(ws, msg.payload);
                    break;
                case 'TRACE':
                    this.handleTrace(ws, msg.payload);
                    break;
                default:
                    this.sendError(ws, 'Unknown message type');
            }
        } catch (e) {
            console.error('Error handling message:', e);
            this.sendError(ws, 'Invalid message format');
        }
    }

    /**
     * Handle code validation request (Phase 1 of execution)
     */
    private handleValidate(ws: WebSocket, payload: any) {
        try {
            const code = typeof payload === 'string' ? payload : payload.code || '';

            console.log('Validating code...');
            const validation = this.codeValidator.validate(code);
            const complexity = this.codeValidator.estimateComplexity(code);

            const response: ExecutionResponse = {
                type: 'VALIDATION_RESULT',
                payload: {
                    ...validation,
                    complexityWarning: complexity.warning
                } as ValidationPayload
            };

            this.safeSend(ws, response);

        } catch (e: any) {
            console.error('Validation Error:', e);
            this.sendError(ws, this.makeErrorFriendly(e.message || 'Validation failed'));
        }
    }

    /**
     * Handle trace generation request for Blackboard-style visualization
     */
    private handleTrace(ws: WebSocket, payload: any) {
        try {
            const code = typeof payload === 'string' ? payload : payload.code || '';
            const input = typeof payload === 'object' ? (payload.input || '') : '';

            console.log('Generating execution trace...');

            // First validate the code
            const validation = this.codeValidator.validate(code);

            if (!validation.isValid) {
                // Send validation result with fix option
                if (validation.canAutoFix && validation.fixedCode) {
                    this.safeSend(ws, {
                        type: 'TRACE_VALIDATION_NEEDED',
                        payload: {
                            ...validation,
                            message: 'Code needs fixing before we can trace it'
                        }
                    });
                } else {
                    const errorMessages = validation.issues
                        .filter(i => i.severity === 'error')
                        .map(i => i.beginnerMessage)
                        .join('\n\n');
                    this.sendError(ws, errorMessages || 'Code has errors that cannot be automatically fixed.');
                }
                return;
            }

            // Generate trace with input
            const traceResult = this.traceService.generateTrace(code, input);

            this.safeSend(ws, {
                type: 'TRACE_RESULT',
                payload: traceResult
            });

        } catch (e: any) {
            console.error('Trace Error:', e);
            this.sendError(ws, this.makeErrorFriendly(e.message || 'Trace generation failed'));
        }
    }

    /**
     * Handle execution with auto-fixed code (after user permission)
     */
    private async handleExecuteWithFix(ws: WebSocket, payload: any) {
        try {
            const originalCode = payload.originalCode || '';
            const fixedCode = payload.fixedCode || '';
            const input = payload.input || '';

            console.log('Executing with user-approved fixes...');

            // Execute the fixed code
            const result = await this.executionService.execute(fixedCode, input);

            // Include info that this used fixed code
            const response: ExecutionResponse = {
                type: 'EXECUTION_RESULT',
                payload: {
                    ...result,
                    usedFixedCode: true,
                    originalCode
                } as any
            };

            this.safeSend(ws, response);

        } catch (e: any) {
            console.error('Execution Error (fixed code):', e);
            this.sendError(ws, this.makeErrorFriendly(e.message || 'Execution failed'));
        }
    }

    /**
     * Handle "Run Code" request (Real Execution via Piston)
     */
    private async handleRunCode(ws: WebSocket, payload: any) {
        try {
            const code = payload.code || '';
            const input = payload.input || '';
            const language = payload.language || 'cpp';

            console.log(`Running code (${language}) via CompilerService...`);

            // Execute via Piston
            const result = await this.compilerService.execute(language, code, input);

            const response: ExecutionResponse = {
                type: 'RUN_RESULT',
                payload: result
            };

            this.safeSend(ws, response);

        } catch (e: any) {
            console.error('Run Code Error:', e);
            this.sendError(ws, `Failed to run code: ${e.message}`);
        }
    }

    /**
     * Main execution handler - now includes validation phase
     */
    private async handleExecute(ws: WebSocket, payload: any) {
        try {
            let code = "";
            let input = "";

            if (typeof payload === 'string') {
                code = payload;
            } else {
                code = payload.code || "";
                input = payload.input || "";
            }

            console.log(`Executing code length: ${code.length}`);

            // PHASE 1: Validate code first
            const validation = this.codeValidator.validate(code);

            if (!validation.isValid) {
                // Code has errors - check if auto-fixable
                if (validation.canAutoFix && validation.fixedCode) {
                    // Send validation result asking for permission
                    const response: ExecutionResponse = {
                        type: 'VALIDATION_RESULT',
                        payload: {
                            ...validation,
                            complexityWarning: this.codeValidator.estimateComplexity(code).warning
                        } as ValidationPayload
                    };
                    this.safeSend(ws, response);
                    return;
                } else {
                    // Cannot auto-fix - send detailed error
                    const errorMessages = validation.issues
                        .filter(i => i.severity === 'error')
                        .map(i => i.beginnerMessage)
                        .join('\n\n');

                    this.sendError(ws, errorMessages || 'Code has errors that cannot be automatically fixed.');
                    return;
                }
            }

            // PHASE 2: Check for warnings (infinite loop, etc.)
            const warnings = validation.issues.filter(i => i.severity === 'warning');
            if (warnings.length > 0) {
                console.log('Execution warnings:', warnings.map(w => w.message));
            }

            // PHASE 3: Execute code
            const result = await this.executionService.execute(code, input);

            const response: ExecutionResponse = {
                type: 'EXECUTION_RESULT',
                payload: result
            };

            this.safeSend(ws, response);

        } catch (e: any) {
            console.error('Execution Error:', e);
            this.sendError(ws, this.makeErrorFriendly(e.message || 'Execution failed'));
        }
    }

    private sendError(ws: WebSocket, message: string) {
        const response: ExecutionResponse = {
            type: 'ERROR',
            payload: message
        };
        this.safeSend(ws, response);
    }

    private safeSend(ws: WebSocket, data: any) {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(data));
            } catch (e) {
                console.error('Error sending message:', e);
            }
        }
    }

    /**
     * Convert technical error messages to beginner-friendly ones
     */
    private makeErrorFriendly(error: string): string {
        // Syntax errors
        if (error.includes('Expected')) {
            if (error.includes("';'")) {
                return "Oops! It looks like you forgot a semicolon (;) at the end of a line. In C++, most statements need to end with a semicolon.";
            }
            if (error.includes("')'")) {
                return "There's a missing closing parenthesis ')'. Every '(' needs a matching ')'.";
            }
            if (error.includes("'}'")) {
                return "There's a missing closing brace '}'. Every '{' needs a matching '}'.";
            }
        }

        // Runtime errors
        if (error.includes('main') && error.includes('not defined')) {
            return "Your code needs a main() function - that's where C++ programs start running. Try adding: int main() { ... }";
        }

        if (error.includes('Undefined variable')) {
            const varMatch = error.match(/Undefined variable '(\w+)'/);
            if (varMatch) {
                return `You're using "${varMatch[1]}" but haven't created it yet. Variables need to be declared before you use them, like: int ${varMatch[1]} = 0;`;
            }
        }

        if (error.includes('Input stream exhausted')) {
            return "The program tried to read input, but there wasn't enough input provided. Make sure to add input values in the 'Input / Test Case' box below.";
        }

        // Default: return original but softened
        return `Something went wrong: ${error}\n\nDon't worry! This is a learning opportunity. Check your code carefully and try again.`;
    }
}

