import { Lexer, Parser } from '../engine/languages/cpp/parser';

// Validation result with beginner-friendly messages
export interface ValidationResult {
    isValid: boolean;
    canAutoFix: boolean;
    issues: ValidationIssue[];
    fixedCode?: string;
    fixExplanations?: FixExplanation[];
}

export interface ValidationIssue {
    type: 'syntax' | 'missing_main' | 'missing_header' | 'infinite_loop' | 'infinite_recursion' | 'undefined_behavior' | 'runtime_risk';
    severity: 'error' | 'warning' | 'info';
    line?: number;
    message: string;           // Technical message
    beginnerMessage: string;   // Simple, friendly explanation
    canFix: boolean;
}

export interface FixExplanation {
    whatWasWrong: string;
    whyItBlocked: string;
    whatWasChanged: string;
    originalSnippet?: string;
    fixedSnippet?: string;
}

export class CodeValidator {

    /**
     * Validate C++ code and return issues with beginner-friendly explanations.
     * This MUST be called before any visualization attempt.
     */
    public validate(code: string): ValidationResult {
        const issues: ValidationIssue[] = [];

        // Phase 1: Basic checks
        this.checkEmptyCode(code, issues);
        if (issues.some(i => i.severity === 'error')) {
            return { isValid: false, canAutoFix: false, issues };
        }

        // Phase 2: Syntax validation via lexer/parser
        const syntaxResult = this.validateSyntax(code, issues);

        // Phase 3: Check for main() function
        this.checkMainFunction(code, issues);

        // Phase 4: Detect infinite loop/recursion risks
        this.detectInfiniteLoopRisks(code, issues);
        this.detectInfiniteRecursion(code, issues);

        // Phase 5: Check for common missing headers
        this.checkMissingHeaders(code, issues);

        // Determine if we can auto-fix
        const canAutoFix = issues.some(i => i.canFix);
        const hasErrors = issues.some(i => i.severity === 'error');

        // If can auto-fix, generate fixed code
        let fixedCode: string | undefined;
        let fixExplanations: FixExplanation[] | undefined;

        if (canAutoFix && hasErrors) {
            const fixResult = this.generateFixes(code, issues);
            fixedCode = fixResult.fixedCode;
            fixExplanations = fixResult.explanations;
        }

        return {
            isValid: !hasErrors,
            canAutoFix,
            issues,
            fixedCode,
            fixExplanations
        };
    }

    private checkEmptyCode(code: string, issues: ValidationIssue[]): void {
        if (!code || code.trim().length === 0) {
            issues.push({
                type: 'syntax',
                severity: 'error',
                message: 'Empty code provided',
                beginnerMessage: 'There\'s no code to run! Please write some C++ code first.',
                canFix: false
            });
        }
    }

    private validateSyntax(code: string, issues: ValidationIssue[]): boolean {
        // Check if code uses advanced C++ features our parser doesn't support
        const hasAdvancedFeatures = this.detectAdvancedFeatures(code);

        try {
            const lexer = new Lexer(code);
            const tokens = lexer.tokenize();
            const parser = new Parser(tokens);
            parser.parse();
            return true;
        } catch (e: any) {
            const errorMsg = e.message || 'Unknown syntax error';
            const lineMatch = errorMsg.match(/line (\d+)/i);
            const line = lineMatch ? parseInt(lineMatch[1]) : undefined;

            // If code has advanced features, treat parser errors as INFO (not blocking)
            // because our parser is limited and can't handle classes, templates, etc.
            if (hasAdvancedFeatures.isAdvanced) {
                issues.push({
                    type: 'syntax',
                    severity: 'info',  // Downgrade to info, don't block
                    line,
                    message: `Parser limitation: ${errorMsg}`,
                    beginnerMessage: `Your code uses advanced C++ features (${hasAdvancedFeatures.features.join(', ')}) that our visualizer is still learning to understand. We'll try to run it anyway and visualize what we can!`,
                    canFix: false
                });
                return true;  // Return true to allow execution attempt
            }

            // For simple code, treat as error (likely a real mistake)
            issues.push({
                type: 'syntax',
                severity: 'error',
                line,
                message: errorMsg,
                beginnerMessage: this.makeSyntaxErrorFriendly(errorMsg),
                canFix: this.canFixSyntaxError(errorMsg)
            });
            return false;
        }
    }

    /**
     * Detect advanced C++ features that our simple parser doesn't support
     */
    private detectAdvancedFeatures(code: string): { isAdvanced: boolean; features: string[] } {
        const features: string[] = [];

        // Classes
        if (/\bclass\s+\w+/.test(code)) {
            features.push('classes');
        }

        // Structs  
        if (/\bstruct\s+\w+/.test(code)) {
            features.push('structs');
        }

        // Templates (vector<T>, map<K,V>, etc.)
        if (/\b\w+\s*<[^>]+>/.test(code)) {
            features.push('templates');
        }

        // Namespace usage (std::, etc.)
        if (/\w+::\w+/.test(code)) {
            features.push('namespaces');
        }

        // Lambda expressions
        if (/\[[^\]]*\]\s*\([^)]*\)\s*{/.test(code)) {
            features.push('lambdas');
        }

        // References with templates (vector<int>&)
        if (/\w+<[^>]+>\s*&/.test(code)) {
            features.push('template references');
        }

        // Long long type
        if (/\blong\s+long\b/.test(code)) {
            features.push('long long type');
        }

        // Public/private/protected
        if (/\b(public|private|protected)\s*:/.test(code)) {
            features.push('access modifiers');
        }

        // ios::sync, cin.tie, etc.
        if (/\b(ios|cin|cout)\s*::/.test(code) || /\b(cin|cout)\./.test(code)) {
            features.push('IO stream methods');
        }

        return {
            isAdvanced: features.length > 0,
            features
        };
    }

    private checkMainFunction(code: string, issues: ValidationIssue[]): void {
        // Simple check for main() function
        const hasMain = /\b(int|void)\s+main\s*\(/.test(code);

        if (!hasMain) {
            issues.push({
                type: 'missing_main',
                severity: 'error',
                message: 'No main() function found',
                beginnerMessage: 'Every C++ program needs a main() function - that\'s where the program starts running. I didn\'t find one in your code.',
                canFix: true
            });
        }
    }

    private detectInfiniteLoopRisks(code: string, issues: ValidationIssue[]): void {
        // Detect while(true) or while(1) without break
        const infiniteWhile = /while\s*\(\s*(true|1)\s*\)\s*\{[^}]*\}/g;
        let match;

        while ((match = infiniteWhile.exec(code)) !== null) {
            const loopBody = match[0];
            if (!loopBody.includes('break') && !loopBody.includes('return')) {
                issues.push({
                    type: 'infinite_loop',
                    severity: 'warning',
                    message: 'Potential infinite loop detected',
                    beginnerMessage: 'I see a loop that might run forever! It says "while(true)" but I don\'t see a way to stop it (no "break" or "return" inside).',
                    canFix: false
                });
            }
        }

        // Detect for(;;) without break
        if (/for\s*\(\s*;\s*;\s*\)/.test(code)) {
            const hasBreak = /for\s*\(\s*;\s*;\s*\)\s*\{[^}]*break[^}]*\}/.test(code);
            if (!hasBreak) {
                issues.push({
                    type: 'infinite_loop',
                    severity: 'warning',
                    message: 'Potential infinite loop detected (for(;;))',
                    beginnerMessage: 'This "for(;;)" loop will run forever unless there\'s a "break" inside. I don\'t see one!',
                    canFix: false
                });
            }
        }
    }

    private detectInfiniteRecursion(code: string, issues: ValidationIssue[]): void {
        // Find function definitions - simpler pattern that won't match main incorrectly
        const funcPattern = /\b(\w+)\s+(\w+)\s*\([^)]*\)\s*\{/g;
        let match;

        while ((match = funcPattern.exec(code)) !== null) {
            const funcName = match[2];

            // Skip main - it's never recursive in the problematic sense
            if (funcName === 'main') continue;

            // Skip common standard library function-like patterns
            if (['size', 'push_back', 'pop', 'push', 'top', 'front', 'back', 'begin', 'end'].includes(funcName)) continue;

            // Get the function body (rough extraction)
            const startIdx = match.index + match[0].length;
            let braceCount = 1;
            let endIdx = startIdx;

            while (braceCount > 0 && endIdx < code.length) {
                if (code[endIdx] === '{') braceCount++;
                if (code[endIdx] === '}') braceCount--;
                endIdx++;
            }

            const funcBody = code.substring(startIdx, endIdx);

            // Check if function calls itself
            const callsItself = new RegExp(`\\b${funcName}\\s*\\(`).test(funcBody);

            if (callsItself) {
                // Check for base case (if/return before the call, or if containing return)
                const hasBaseCase = /if\s*\([^)]*\)\s*\{?\s*(return|break)/.test(funcBody) ||
                    /if\s*\([^)]*\)\s*return/.test(funcBody);

                if (!hasBaseCase) {
                    issues.push({
                        type: 'infinite_recursion',
                        severity: 'warning',
                        message: `Function ${funcName} may have infinite recursion`,
                        beginnerMessage: `The function "${funcName}" calls itself (that's called recursion), but I don't see an obvious stopping condition. Make sure there's an "if" that returns before calling itself again!`,
                        canFix: false
                    });
                }
            }
        }
    }

    private checkMissingHeaders(code: string, issues: ValidationIssue[]): void {
        const headerChecks = [
            { pattern: /\bvector\s*</, header: '<vector>', friendly: 'vector (dynamic array)' },
            { pattern: /\bstack\s*</, header: '<stack>', friendly: 'stack' },
            { pattern: /\bqueue\s*</, header: '<queue>', friendly: 'queue' },
            { pattern: /\bmap\s*</, header: '<map>', friendly: 'map (dictionary)' },
            { pattern: /\bset\s*</, header: '<set>', friendly: 'set' },
            { pattern: /\bstring\b/, header: '<string>', friendly: 'string' },
            { pattern: /\bcout\b|\bcin\b/, header: '<iostream>', friendly: 'cout/cin (input/output)' },
        ];

        for (const check of headerChecks) {
            if (check.pattern.test(code)) {
                const hasHeader = code.includes(`#include ${check.header}`) ||
                    code.includes('#include <bits/stdc++.h>');

                if (!hasHeader) {
                    issues.push({
                        type: 'missing_header',
                        severity: 'warning',
                        message: `Missing ${check.header} for ${check.friendly}`,
                        beginnerMessage: `You're using ${check.friendly}, but you didn't include the library for it. You need to add "${check.header}" at the top of your code.`,
                        canFix: true
                    });
                }
            }
        }
    }

    private makeSyntaxErrorFriendly(error: string): string {
        // Convert technical errors to beginner-friendly messages
        if (error.includes('Expected')) {
            const expected = error.match(/Expected '([^']+)'/)?.[1];
            if (expected === ';') {
                return 'Oops! It looks like you forgot a semicolon (;) at the end of a line. In C++, most lines need to end with a semicolon.';
            }
            if (expected === ')') {
                return 'There\'s a missing closing parenthesis. Every "(" needs a matching ")".';
            }
            if (expected === '}') {
                return 'There\'s a missing closing brace. Every "{" needs a matching "}".';
            }
            return `Something is missing in your code. The computer expected to see "${expected}" but found something else.`;
        }

        if (error.includes('Unexpected')) {
            return 'There\'s something in your code that doesn\'t belong there. Check for typos or extra characters.';
        }

        if (error.includes('Undefined')) {
            const varName = error.match(/Undefined (?:variable|function) '([^']+)'/)?.[1];
            if (varName) {
                return `The name "${varName}" is used but was never created. Make sure to declare it before using it.`;
            }
        }

        return `There's a problem with your code syntax: ${error}. Don't worry, we can help fix it!`;
    }

    private canFixSyntaxError(error: string): boolean {
        // We can potentially fix simple issues
        if (error.includes("Expected ';'")) return true;
        if (error.includes("Expected '}'")) return true;
        return false;
    }

    private generateFixes(code: string, issues: ValidationIssue[]): { fixedCode: string; explanations: FixExplanation[] } {
        let fixedCode = code;
        const explanations: FixExplanation[] = [];

        for (const issue of issues) {
            if (!issue.canFix) continue;

            switch (issue.type) {
                case 'missing_main':
                    // Wrap code in main if it doesn't have one
                    if (!/\b(int|void)\s+main\s*\(/.test(fixedCode)) {
                        // Check if code has loose statements (not in functions)
                        const wrappedCode = `int main() {\n${fixedCode}\n    return 0;\n}`;
                        explanations.push({
                            whatWasWrong: 'No main() function found',
                            whyItBlocked: 'C++ programs must have a main() function - it\'s the starting point.',
                            whatWasChanged: 'Added a main() function wrapper around your code.',
                            originalSnippet: fixedCode.substring(0, 50) + '...',
                            fixedSnippet: 'int main() {\n    // your code here\n    return 0;\n}'
                        });
                        fixedCode = wrappedCode;
                    }
                    break;

                case 'missing_header':
                    // Add missing header
                    const headerMatch = issue.message.match(/Missing (<[^>]+>)/);
                    if (headerMatch) {
                        const header = headerMatch[1];
                        if (!fixedCode.includes(`#include ${header}`)) {
                            fixedCode = `#include ${header}\n${fixedCode}`;
                            explanations.push({
                                whatWasWrong: `Missing ${header} header`,
                                whyItBlocked: `Without this library, the compiler doesn't know what certain things in your code mean.`,
                                whatWasChanged: `Added #include ${header} at the top.`,
                                fixedSnippet: `#include ${header}`
                            });
                        }
                    }
                    break;
            }
        }

        return { fixedCode, explanations };
    }

    /**
     * Check if code will likely exceed execution limits
     */
    public estimateComplexity(code: string): { safe: boolean; estimatedSteps: number; warning?: string } {
        // Count nested loops
        const loopDepth = this.countNestedLoops(code);

        // Look for large loop bounds
        const largeBounds = code.match(/for\s*\([^;]*;\s*\w+\s*<\s*(\d+)/g);
        let maxBound = 0;
        if (largeBounds) {
            for (const bound of largeBounds) {
                const numMatch = bound.match(/(\d+)/);
                if (numMatch) {
                    maxBound = Math.max(maxBound, parseInt(numMatch[1]));
                }
            }
        }

        const estimatedSteps = Math.pow(maxBound || 10, loopDepth || 1);

        return {
            safe: estimatedSteps < 10000,
            estimatedSteps,
            warning: estimatedSteps > 10000 ?
                `This code might take a while to run (estimated ${estimatedSteps} steps). For visualization, I'll limit execution to 2000 steps.` :
                undefined
        };
    }

    private countNestedLoops(code: string): number {
        // Simple heuristic: count max depth of for/while keywords
        let maxDepth = 0;
        let currentDepth = 0;

        for (const char of code) {
            if (char === '{') currentDepth++;
            if (char === '}') currentDepth--;
            maxDepth = Math.max(maxDepth, currentDepth);
        }

        return Math.min(maxDepth, 5); // Cap at 5
    }
}
