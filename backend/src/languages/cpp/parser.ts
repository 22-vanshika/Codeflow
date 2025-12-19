import {
    ASTNode, Program, FunctionDeclaration, Block, VariableDeclaration,
    Assignment, BinaryExpression, Identifier, Literal, ReturnStatement,
    IfStatement, WhileStatement, CallExpression, ExpressionStatement,
    ForStatement, UpdateExpression
} from '../../types';

type TokenType =
    | 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR'
    | 'PUNCTUATION' | 'EOF';

interface Token {
    type: TokenType;
    value: string;
    line: number;
}

const KEYWORDS = new Set([
    'int', 'string', 'bool', 'void', 'return', 'if', 'else', 'while', 'for', 'true', 'false'
]);

export class Lexer {
    private source: string;
    private position: number = 0;
    private line: number = 1;

    constructor(source: string) {
        this.source = source;
    }

    tokenize(): Token[] {
        const tokens: Token[] = [];
        while (this.position < this.source.length) {
            const char = this.source[this.position];

            if (/\s/.test(char)) {
                if (char === '\n') this.line++;
                this.position++;
                continue;
            }

            if (/[a-zA-Z_]/.test(char)) {
                tokens.push(this.readIdentifier());
                continue;
            }

            if (/[0-9]/.test(char)) {
                tokens.push(this.readNumber());
                continue;
            }

            if (char === '"') {
                tokens.push(this.readString());
                continue;
            }

            // Multi-char operators
            if (['=', '!', '<', '>', '+', '-', '&', '|'].includes(char)) {
                const next = this.source[this.position + 1];
                if (next === '=') {
                    tokens.push({ type: 'OPERATOR', value: char + '=', line: this.line });
                    this.position += 2;
                    continue;
                }
                if ((char === '+' && next === '+') || (char === '-' && next === '-')) {
                    tokens.push({ type: 'OPERATOR', value: char + next, line: this.line });
                    this.position += 2;
                    continue;
                }
            }

            if (['+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '^'].includes(char)) {
                tokens.push({ type: 'OPERATOR', value: char, line: this.line });
                this.position++;
                continue;
            }

            if (['(', ')', '{', '}', ';', ','].includes(char)) {
                tokens.push({ type: 'PUNCTUATION', value: char, line: this.line });
                this.position++;
                continue;
            }

            throw new Error(`Syntax Error: Unexpected character '${char}' at line ${this.line}. (Note: Classes, Vectors, and some operators are not yet supported)`);
        }
        tokens.push({ type: 'EOF', value: '', line: this.line });
        return tokens;
    }

    private readIdentifier(): Token {
        let value = '';
        while (this.position < this.source.length && /[a-zA-Z0-9_]/.test(this.source[this.position])) {
            value += this.source[this.position++];
        }
        const type = KEYWORDS.has(value) ? 'KEYWORD' : 'IDENTIFIER';
        return { type, value, line: this.line };
    }

    private readNumber(): Token {
        let value = '';
        while (this.position < this.source.length && /[0-9]/.test(this.source[this.position])) {
            value += this.source[this.position++];
        }
        return { type: 'NUMBER', value, line: this.line };
    }

    private readString(): Token {
        this.position++; // Skip quote
        let value = '';
        while (this.position < this.source.length && this.source[this.position] !== '"') {
            value += this.source[this.position++];
        }
        this.position++; // Skip closing quote
        return { type: 'STRING', value, line: this.line };
    }
}

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse(): Program {
        const body: ASTNode[] = [];
        while (!this.isAtEnd()) {
            body.push(this.parseTopLevel());
        }
        return { type: 'Program', body, line: 1 };
    }

    private parseTopLevel(): ASTNode {
        // Look ahead to distinguish global var vs function
        // type name (...) -> Function
        // type name = ...; -> VarDecl
        const typeToken = this.peek();
        const nameToken = this.peek(1);
        const afterName = this.peek(2);

        if (afterName.value === '(') {
            return this.parseFunctionDeclaration();
        } else {
            // Assume global variable or statement
            return this.parseStatement();
        }
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        const returnType = this.consume('KEYWORD').value;
        const name = this.consume('IDENTIFIER').value;
        this.consume('PUNCTUATION', '(');
        const params: { name: string; type: string }[] = [];
        if (!this.check('PUNCTUATION', ')')) {
            do {
                const pType = this.consume('KEYWORD').value;
                const pName = this.consume('IDENTIFIER').value;
                params.push({ name: pName, type: pType });
            } while (this.match('PUNCTUATION', ','));
        }
        this.consume('PUNCTUATION', ')');
        const body = this.parseBlock();
        return {
            type: 'FunctionDeclaration',
            name,
            returnType,
            params,
            body,
            line: this.tokens[this.current - 1].line // approximation
        };
    }

    private parseBlock(): Block {
        this.consume('PUNCTUATION', '{');
        const body: ASTNode[] = [];
        while (!this.check('PUNCTUATION', '}') && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        this.consume('PUNCTUATION', '}');
        return { type: 'Block', body, line: this.tokens[this.current - 1].line };
    }

    private parseStatement(): ASTNode {
        if (this.match('KEYWORD', 'int') || this.match('KEYWORD', 'string') || this.match('KEYWORD', 'bool')) {
            return this.parseVariableDeclaration(this.previous().value);
        }
        if (this.match('KEYWORD', 'return')) {
            return this.parseReturnStatement();
        }
        if (this.match('KEYWORD', 'if')) {
            return this.parseIfStatement();
        }
        if (this.match('KEYWORD', 'while')) {
            return this.parseWhileStatement();
        }
        if (this.match('KEYWORD', 'while')) {
            return this.parseWhileStatement();
        }
        if (this.match('KEYWORD', 'for')) {
            return this.parseForStatement();
        }
        if (this.check('IDENTIFIER')) {
            // Assignment or Function Call or Update?
            const next = this.peek(1);
            if (next.value === '(') {
                const expr = this.parseExpression();
                this.consume('PUNCTUATION', ';');
                return { type: 'ExpressionStatement', expression: expr, line: expr.line };
            }
            if (next.value === '=' || next.value === '+=') { // Simplified assignment support
                return this.parseAssignment();
            }
            if (next.value === '++' || next.value === '--') {
                const name = this.consume('IDENTIFIER').value;
                const operator = this.consume('OPERATOR').value as '++' | '--';
                this.consume('PUNCTUATION', ';');
                return {
                    type: 'UpdateExpression',
                    operator,
                    argument: { type: 'Identifier', name, line: this.previous().line },
                    prefix: false,
                    line: this.previous().line
                } as UpdateExpression;
            }
        }

        // Fallback expression statement (e.g. i++;)
        const expr = this.parseExpression();
        this.consume('PUNCTUATION', ';');
        return { type: 'ExpressionStatement', expression: expr, line: expr.line };
    }

    private parseForStatement(): ForStatement {
        const line = this.previous().line;
        this.consume('PUNCTUATION', '(');

        // Init
        let init: ASTNode | undefined;
        if (!this.match('PUNCTUATION', ';')) {
            if (this.match('KEYWORD', 'int')) {
                init = this.parseVariableDeclaration('int'); // assuming int for now
                // parseVariableDeclaration consumes ';'
            } else {
                init = this.parseExpression(); // or assignment?
                // check if valid init? 
                // If expression, we need to consume ';'
                if (this.peek().value === ';') this.consume('PUNCTUATION', ';');
                else if (init.type === 'Assignment') {
                    // Assignment parsing consumes ';' already?
                    // parseAssignment consumes ';'.
                }
                // Actually parseVariableDeclaration consumes ';'.
                // parseAssignment consumes ';'.
            }
        }

        // Test
        let test: ASTNode | undefined;
        if (!this.match('PUNCTUATION', ';')) {
            test = this.parseExpression();
            this.consume('PUNCTUATION', ';');
        }

        // Update
        let update: ASTNode | undefined;
        if (!this.check('PUNCTUATION', ')')) {
            // Update often looks like i++ or i = i + 1
            // We need to parse an expression or assignment WITHOUT consuming ';', because loop ends with ')'
            // Existing parseAssignment consumes ';'. We need a variant?
            // Let's implement manually here for simplicity

            if (this.check('IDENTIFIER')) {
                const next = this.peek(1);
                if (next.value === '++' || next.value === '--') {
                    const name = this.consume('IDENTIFIER').value;
                    const operator = this.consume('OPERATOR').value as '++' | '--';
                    update = {
                        type: 'UpdateExpression',
                        operator,
                        argument: { type: 'Identifier', name, line },
                        prefix: false,
                        line
                    } as UpdateExpression;
                } else if (next.value === '=') {
                    // Assignment without semicolon
                    const name = this.consume('IDENTIFIER').value;
                    this.consume('OPERATOR', '=');
                    const val = this.parseExpression();
                    update = { type: 'Assignment', name, value: val, line } as Assignment;
                } else {
                    update = this.parseExpression();
                }
            } else {
                update = this.parseExpression();
            }
        }
        this.consume('PUNCTUATION', ')');

        const body = this.parseBlock();
        return { type: 'ForStatement', init, test, update, body, line };
    }

    private parseVariableDeclaration(type: string): VariableDeclaration {
        const name = this.consume('IDENTIFIER').value;
        let init: ASTNode | undefined;
        if (this.match('OPERATOR', '=')) {
            init = this.parseExpression();
        }
        this.consume('PUNCTUATION', ';');
        return { type: 'VariableDeclaration', varType: type, name, init, line: this.previous().line };
    }

    private parseAssignment(): Assignment {
        const name = this.consume('IDENTIFIER').value;
        this.consume('OPERATOR', '=');
        const value = this.parseExpression();
        this.consume('PUNCTUATION', ';');
        return { type: 'Assignment', name, value, line: this.previous().line };
    }

    private parseReturnStatement(): ReturnStatement {
        let argument: ASTNode | undefined;
        if (!this.check('PUNCTUATION', ';')) {
            argument = this.parseExpression();
        }
        this.consume('PUNCTUATION', ';');
        return { type: 'ReturnStatement', argument, line: this.previous().line };
    }

    private parseIfStatement(): IfStatement {
        this.consume('PUNCTUATION', '(');
        const test = this.parseExpression();
        this.consume('PUNCTUATION', ')');
        const consequent = this.parseBlock();
        let alternate: Block | undefined;
        if (this.match('KEYWORD', 'else')) {
            alternate = this.parseBlock();
        }
        return { type: 'IfStatement', test, consequent, alternate, line: this.previous().line };
    }

    private parseWhileStatement(): WhileStatement {
        this.consume('PUNCTUATION', '(');
        const test = this.parseExpression();
        this.consume('PUNCTUATION', ')');
        const body = this.parseBlock();
        return { type: 'WhileStatement', test, body, line: this.previous().line };
    }

    private parseExpression(): ASTNode {
        return this.parseEquality();
    }

    private parseEquality(): ASTNode {
        let expr = this.parseComparison();
        while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
            const operator = this.previous().value;
            const right = this.parseComparison();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseComparison(): ASTNode {
        let expr = this.parseTerm(); // Change to Term to allow + -
        while (this.match('OPERATOR', '<') || this.match('OPERATOR', '>')) {
            const operator = this.previous().value;
            const right = this.parseTerm();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseTerm(): ASTNode {
        let expr = this.parseFactor();
        while (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
            const operator = this.previous().value;
            const right = this.parseFactor();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseFactor(): ASTNode {
        let expr = this.parsePrimary();
        while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/')) {
            const operator = this.previous().value;
            const right = this.parsePrimary();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parsePrimary(): ASTNode {
        if (this.match('KEYWORD', 'true')) return { type: 'Literal', value: true, valueType: 'bool', line: this.previous().line };
        if (this.match('KEYWORD', 'false')) return { type: 'Literal', value: false, valueType: 'bool', line: this.previous().line };

        if (this.match('NUMBER')) {
            return { type: 'Literal', value: parseInt(this.previous().value), valueType: 'int', line: this.previous().line };
        }
        if (this.match('STRING')) {
            return { type: 'Literal', value: this.previous().value, valueType: 'string', line: this.previous().line };
        }
        if (this.match('IDENTIFIER')) {
            const name = this.previous().value;
            // Check for Call
            if (this.match('PUNCTUATION', '(')) {
                const args: ASTNode[] = [];
                if (!this.check('PUNCTUATION', ')')) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.match('PUNCTUATION', ','));
                }
                this.consume('PUNCTUATION', ')');
                return { type: 'CallExpression', callee: name, arguments: args, line: this.previous().line } as CallExpression;
            }
            return { type: 'Identifier', name, line: this.previous().line };
        }
        if (this.match('PUNCTUATION', '(')) {
            const expr = this.parseExpression();
            this.consume('PUNCTUATION', ')');
            return expr;
        }
        throw new Error(`Unexpected token ${this.peek().value} at line ${this.peek().line}`);
    }

    // Helpers
    private match(type: TokenType, value?: string): boolean {
        if (this.check(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(type: TokenType, value?: string): boolean {
        if (this.isAtEnd()) return false;
        const token = this.peek();
        if (token.type !== type) return false;
        if (value && token.value !== value) return false;
        return true;
    }

    private consume(type: TokenType, value?: string): Token {
        if (this.check(type, value)) return this.advance();
        const found = this.peek();
        throw new Error(`Syntax Error: Expected '${value || type}' but found '${found.value || found.type}' at line ${found.line}. Check for missing semicolons or mismatched braces.`);
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === 'EOF';
    }

    private peek(offset: number = 0): Token {
        if (this.current + offset >= this.tokens.length) return this.tokens[this.tokens.length - 1]; // EOF
        return this.tokens[this.current + offset];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }
}
