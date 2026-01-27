import {
    ASTNode, Program, FunctionDeclaration, Block, VariableDeclaration,
    Assignment, BinaryExpression, Identifier, Literal, ReturnStatement,
    IfStatement, WhileStatement, CallExpression, ExpressionStatement,
    ForStatement, UpdateExpression, ClassDeclaration, MemberExpression,
    NewExpression, ThisExpression, ArrayExpression
} from '../../../types';

type TokenType =
    | 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR'
    | 'PUNCTUATION' | 'EOF';

interface Token {
    type: TokenType;
    value: string;
    line: number;
}

export const KEYWORDS = new Set([
    'int', 'string', 'bool', 'void', 'char', 'float', 'double',
    'return', 'if', 'else', 'while', 'for', 'do', 'break', 'continue',
    'true', 'false', 'null',
    'class', 'struct', 'public', 'private', 'protected',
    'new', 'delete', 'this',
    'std', 'vector', 'map', 'set', 'pair', 'stack', 'queue', 'list',
    'using', 'namespace'
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

            // Preprocessor: Skip #include ...
            if (char === '#') {
                while (this.position < this.source.length && this.source[this.position] !== '\n') {
                    this.position++;
                }
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
                if (char === '<' && next === '<') {
                    tokens.push({ type: 'OPERATOR', value: '<<', line: this.line });
                    this.position += 2;
                    continue;
                }
                if (char === '>' && next === '>') {
                    tokens.push({ type: 'OPERATOR', value: '>>', line: this.line });
                    this.position += 2;
                    continue;
                }
                if (char === '-' && next === '>') {
                    tokens.push({ type: 'OPERATOR', value: '->', line: this.line });
                    this.position += 2;
                    continue;
                }
                if (char === ':' && next === ':') { // Scope resolution
                    tokens.push({ type: 'PUNCTUATION', value: '::', line: this.line });
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

            if (['(', ')', '{', '}', ';', ',', '[', ']', '.', ':'].includes(char)) {
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
        const typeToken = this.peek();

        if (typeToken.value === 'class' || typeToken.value === 'struct') {
            return this.parseClassDeclaration();
        }

        // Skip using namespace
        if (typeToken.value === 'using') {
            // consume using namespace std;
            this.consume('KEYWORD', 'using');
            this.consume('KEYWORD', 'namespace');
            // std is a keyword in our set
            if (this.check('KEYWORD', 'std')) {
                this.consume('KEYWORD', 'std');
            } else {
                this.consume('IDENTIFIER');
            }
            this.consume('PUNCTUATION', ';');
            return this.parseTopLevel(); // recurse
        }

        // Look ahead to distinguish global var vs function
        // type name (...) -> Function
        // type name = ...; -> VarDecl
        // complex<type> name ...

        // We need a more robust way to check for Function vs Var.
        // Heuristic: Parse a Type, then an Identifier. 
        // If next is '(', it's function.
        // But parsing type is destructive.
        // We can peek.

        // Standard check: 
        const isFunc = this.isFunctionDeclaration();
        if (isFunc) {
            return this.parseFunctionDeclaration();
        } else {
            return this.parseStatement();
        }
    }

    private isFunctionDeclaration(): boolean {
        // Simple 2-token lookahead is not enough for "vector<int> func()".
        // But for "int main()", peek(2) is '('.
        // "vector<int> main()" -> vector, <, int, >, main, (
        // Let's assume for now Function starts with simple type or we rely on '('.
        // Fix: traverse past matching < > if current is generic.

        let offset = 0;
        if (this.peek(offset).type === 'KEYWORD' || this.peek(offset).type === 'IDENTIFIER') {
            offset++;
            // Check for namespace std::
            if (this.peek(offset).value === '::') {
                offset += 2; // :: ident
            }

            // Check for templates < ... >
            if (this.peek(offset).value === '<') {
                let depth = 1;
                offset++;
                while (offset < this.tokens.length && depth > 0) {
                    if (this.peek(offset).value === '<') depth++;
                    if (this.peek(offset).value === '>') depth--;
                    offset++;
                }
            }

            // Now we should be at Name
            if (this.peek(offset).type === 'IDENTIFIER') {
                offset++;
                if (this.peek(offset).value === '(') return true;
            }
        }
        return false;
    }

    private parseClassDeclaration(): ASTNode {
        const isStruct = this.match('KEYWORD', 'struct');
        if (!isStruct) this.consume('KEYWORD', 'class');

        const name = this.consume('IDENTIFIER').value;
        const members: (VariableDeclaration | FunctionDeclaration)[] = [];

        this.consume('PUNCTUATION', '{');

        while (!this.check('PUNCTUATION', '}') && !this.isAtEnd()) {
            // Handle access specifiers (public: private:)
            if (this.match('KEYWORD', 'public') || this.match('KEYWORD', 'private') || this.match('KEYWORD', 'protected')) {
                this.consume('PUNCTUATION', ':');
                continue;
            }

            // Member can be Var or Func
            if (this.isFunctionDeclaration()) {
                members.push(this.parseFunctionDeclaration());
            } else {
                // Must be var decl. parseStatement parses var decl or other statements. 
                // Inside class, we expect declarations.
                // parseVariableDeclaration expects 'type' string passed in or we start fresh.
                // We should reuse parseVariableDeclaration but it expects us to consume type?
                // Actually parseStatement calls parseVariableDeclaration if it sees type keyword.
                // But members have types that are IDENTIFIERs too.

                const type = this.parseTypeString();
                members.push(this.parseVariableDeclaration(type) as any);
            }
        }
        this.consume('PUNCTUATION', '}');
        this.consume('PUNCTUATION', ';'); // Class decl ends with ;

        return { type: 'ClassDeclaration', name, members, line: this.previous().line } as ClassDeclaration;
    }

    private parseTypeString(): string {
        let type = '';
        if (this.match('KEYWORD', 'std')) {
            type += 'std';
            if (this.match('PUNCTUATION', '::')) {
                type += '::';
                // Consume vector/string/etc
                type += this.advance().value;
            }
        } else if (this.check('IDENTIFIER') || this.check('KEYWORD')) {
            // consume
            type += this.advance().value;
            // Handle std::vector if started with std
        } else {
            type += this.advance().value; // consume whatever
        }

        // Handle ::
        while (this.match('PUNCTUATION', '::')) {
            type += '::';
            type += this.consume('IDENTIFIER').value;
        }

        // Handle templates <...>
        if (this.match('OPERATOR', '<')) {
            type += '<';
            type += this.parseTypeString();
            while (this.match('PUNCTUATION', ',')) {
                type += ', ';
                type += this.parseTypeString();
            }
            this.consume('OPERATOR', '>');
            type += '>';
        }
        return type;
    }

    private parseFunctionDeclaration(): FunctionDeclaration {
        const returnType = this.parseTypeString();
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
        // Check for variable declaration with arbitrary type (Identifier + Name + (= OR ;))
        if (this.isVariableDeclaration()) {
            const type = this.parseTypeString();
            return this.parseVariableDeclarationList(type);
        }
        if (this.check('PUNCTUATION', '{')) {
            return this.parseBlock();
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

    // Helper for isVariableDeclaration
    private isVariableDeclaration(): boolean {
        // Lookahead: Type Name [= or ;]
        // Hard to distinguish "A b;" from "A b()" (function) or "obj.prop" (expr).
        // But at statement level:
        // "Name name;" -> VarDecl
        // "Name name = ...;" -> VarDecl
        // "Name name(...);" -> C++ ctor style var decl?
        // "Name.prop = ..." -> ExprStmt

        const save = this.current;
        try {
            // Try to parse a Type
            // Limitation: Type parsing consumes. We need to rollback/peek.
            // Since we don't have transaction/rollback easily, implement peephole.

            // Simple heuristic: If starts with keyword (int/bool/etc) -> VarDecl.
            if (KEYWORDS.has(this.peek().value) && !['return', 'if', 'while', 'for', 'break'].includes(this.peek().value)) {
                // Excluding control keywords. 
                // Includes 'vector', 'map' if in KEYWORDS.
                return true;
            }

            // If starts with identifier, check next.
            if (this.peek().type === 'IDENTIFIER') {
                // T name;
                // If next is Identifier (name), and next is ; or = or (, it is likely VarDecl.
                // But could be "a * b;" (mult). C++ ambiguity!
                // We mock. Assume Capitalized is Type? No.
                // Assume if followed by name then ;/=, it is decl.

                // Let's rely on parseStatement order.
                // If we fail to parse as Statement constructs, check Expr.
                // But VarDecl IS a statement.

                // Let's peek(1). 
                // ID ID ; -> Decl
                // ID ID = -> Decl
                // ID < ... > ID -> Decl

                let offset = 0;
                // Skip namespace/template
                if (this.peek(offset).type === 'IDENTIFIER' || this.peek(offset).value === 'std') {
                    // Skip type logic...
                    // This is getting complex to implement perfectly without backtracking.
                    // For this task, we can assume:
                    // 1. Prim types handled.
                    // 2. Templates 'vector<...>' handled by check.
                    // 3. Class types 'Point p;' handled.

                    // Logic:
                    // If Token[0] is Type-like and Token[1] is Identifier and Token[2] is ';', '=', or '('.

                    // But 'a b;' could be multiply? No, multiply is binary.
                    // C++: 'a b;' is syntax error if a, b are vars.
                    // So if two IDs follow, it MUST be Type Name.

                    if (this.peek(0).type === 'IDENTIFIER' && this.peek(1).type === 'IDENTIFIER') return true;
                    if (this.peek(0).value === 'std') return true; // std::vector...
                    if (this.peek(0).type === 'IDENTIFIER' && this.peek(1).value === '<') return true; // vector<int>
                }
            }
            return false;
        } finally {
            // this.current = save; // We didn't move.
        }
    }

    private parseForStatement(): ForStatement {
        const line = this.previous().line;
        this.consume('PUNCTUATION', '(');

        // Init
        let init: ASTNode | undefined;
        if (!this.match('PUNCTUATION', ';')) {
            if (this.isVariableDeclaration()) {
                const type = this.parseTypeString();
                init = this.parseVariableDeclaration(type);
            } else {
                init = this.parseExpression();
                if (this.peek().value === ';') this.consume('PUNCTUATION', ';');
            }
        }
        // ... (rest of ForStatement)

        // Test
        let test: ASTNode | undefined;
        if (!this.match('PUNCTUATION', ';')) {
            test = this.parseExpression();
            this.consume('PUNCTUATION', ';');
        }

        // Update (No changes needed usually, but reusing logic)
        let update: ASTNode | undefined;
        if (!this.check('PUNCTUATION', ')')) {
            update = this.parseExpression(); // This handles assignment too
        }
        this.consume('PUNCTUATION', ')');

        const body = this.parseBlock();
        return { type: 'ForStatement', init, test, update, body, line };
    }

    private parseVariableDeclarationList(type: string): ASTNode {
        // Parse: name [= init], name2 [= init2];
        const decls: VariableDeclaration[] = [];

        do {
            const name = this.consume('IDENTIFIER').value;
            let init: ASTNode | undefined;
            if (this.match('OPERATOR', '=')) {
                if (this.check('PUNCTUATION', '{')) {
                    init = this.parseArrayExpression();
                } else {
                    init = this.parseExpression();
                }
            } else if (this.match('PUNCTUATION', '(')) {
                const args: ASTNode[] = [];
                if (!this.check('PUNCTUATION', ')')) {
                    do { args.push(this.parseExpression()); } while (this.match('PUNCTUATION', ','));
                }
                this.consume('PUNCTUATION', ')');
                init = { type: 'NewExpression', className: type, arguments: args, line: this.previous().line } as NewExpression;
            }

            decls.push({ type: 'VariableDeclaration', varType: type, name, init, line: this.previous().line });

        } while (this.match('PUNCTUATION', ','));

        this.consume('PUNCTUATION', ';');

        if (decls.length === 1) return decls[0];

        // Return MultiVariableDeclaration to avoid checking constraints of Blocks (scopes)
        return { type: 'MultiVariableDeclaration', declarations: decls, line: decls[0].line || 0 };
    }

    private parseVariableDeclaration(type: string): ASTNode {
        // Legacy/Singular wrapper
        const node = this.parseVariableDeclarationList(type);
        if (node.type === 'Block') return (node as Block).body[0] as VariableDeclaration;
        return node as VariableDeclaration;
    }

    private parseArrayExpression(): ArrayExpression {
        this.consume('PUNCTUATION', '{');
        const elements: ASTNode[] = [];
        if (!this.check('PUNCTUATION', '}')) {
            do {
                elements.push(this.parseExpression());
            } while (this.match('PUNCTUATION', ','));
        }
        this.consume('PUNCTUATION', '}');
        return { type: 'ArrayExpression', elements, line: this.previous().line };
    }

    private parseAssignment(): Assignment {
        // We need to parse LValue. It could be Identifier or MemberExpression (a.b = 1) or Index (a[0] = 1).
        // parseExpression() usually parses RValues.
        // We can parseExpression(), checking that it is a valid LValue target?
        // Or we parsePrimary and chain MemberAccess.

        const target = this.parseExpression();
        // Check if next is = or compound assignment (+=, -=, *=, /=, etc.)
        if (this.match('OPERATOR', '=') || this.match('OPERATOR', '+=') || this.match('OPERATOR', '-=') ||
            this.match('OPERATOR', '*=') || this.match('OPERATOR', '/=')) {
            const operator = this.previous().value;
            const value = this.parseExpression();
            this.consume('PUNCTUATION', ';');

            // Extract name if simple ID
            let name = '';
            if (target.type === 'Identifier') name = (target as Identifier).name;
            else name = 'Expr'; // Fallback

            // For compound assignments like +=, convert to regular assignment
            // c += a becomes c = c + a
            let finalValue = value;
            if (operator !== '=') {
                const binaryOp = operator.slice(0, -1); // Remove the '=' to get +, -, *, /
                finalValue = {
                    type: 'BinaryExpression',
                    operator: binaryOp,
                    left: target,
                    right: value,
                    line: this.previous().line
                } as BinaryExpression;
            }

            return { type: 'Assignment', name, left: target, value: finalValue, line: this.previous().line };
        }

        throw new Error(`Expected assignment operator '=' at line ${this.previous().line}`);
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
        const consequent = this.parseStatement();
        let alternate: ASTNode | undefined;
        if (this.match('KEYWORD', 'else')) {
            alternate = this.parseStatement();
        }
        return { type: 'IfStatement', test, consequent, alternate, line: this.previous().line } as IfStatement;
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
        let expr = this.parseShift();
        // console.log(`DEBUG: Checking comparison op. Token: ${this.peek().value} Type: ${this.peek().type}`);
        while (this.match('OPERATOR', '<') || this.match('OPERATOR', '>') ||
            this.match('OPERATOR', '<=') || this.match('OPERATOR', '>=')) {
            const operator = this.previous().value;
            const right = this.parseShift();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseShift(): ASTNode {
        let expr = this.parseTerm();
        while (this.match('OPERATOR', '<<') || this.match('OPERATOR', '>>')) {
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
        if (this.match('KEYWORD', 'new')) {
            const className = this.parseTypeString();
            this.consume('PUNCTUATION', '(');
            const args: ASTNode[] = [];
            if (!this.check('PUNCTUATION', ')')) {
                do {
                    args.push(this.parseExpression());
                } while (this.match('PUNCTUATION', ','));
            }
            this.consume('PUNCTUATION', ')');
            return { type: 'NewExpression', className, arguments: args, line: this.previous().line } as NewExpression;
        }
        if (this.match('KEYWORD', 'this')) return { type: 'ThisExpression', line: this.previous().line };

        if (this.match('NUMBER')) {
            return { type: 'Literal', value: parseInt(this.previous().value), valueType: 'int', line: this.previous().line };
        }
        if (this.match('STRING')) {
            return { type: 'Literal', value: this.previous().value, valueType: 'string', line: this.previous().line };
        }

        let expr: ASTNode;
        if (this.match('IDENTIFIER') || this.match('KEYWORD', 'std')) { // Allow std as ID start
            // Rewind a bit? No, we used match.
            // If std, check for ::
            let name = this.previous().value;
            if (name === 'std') {
                if (this.match('PUNCTUATION', '::')) {
                    name += '::' + this.consume('IDENTIFIER').value;
                }
            }

            expr = { type: 'Identifier', name, line: this.previous().line };
        } else if (this.match('PUNCTUATION', '(')) {
            expr = this.parseExpression();
            this.consume('PUNCTUATION', ')');
        } else {
            throw new Error(`Unexpected token ${this.peek().value} at line ${this.peek().line}`);
        }

        // Handle Postfix: .member, ->member, [index], (args)
        while (true) {
            if (this.match('PUNCTUATION', '.')) {
                const prop = this.consume('IDENTIFIER').value;
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: { type: 'Identifier', name: prop, line: this.previous().line },
                    computed: false,
                    line: this.previous().line
                } as MemberExpression;
            } else if (this.match('OPERATOR', '->')) {
                const prop = this.consume('IDENTIFIER').value;
                // Treated same as . for simple interpreter
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: { type: 'Identifier', name: prop, line: this.previous().line },
                    computed: false,
                    line: this.previous().line
                } as MemberExpression;
            } else if (this.match('PUNCTUATION', '[')) {
                const index = this.parseExpression();
                this.consume('PUNCTUATION', ']');
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: index,
                    computed: true,
                    line: this.previous().line
                } as MemberExpression;
            } else if (this.match('PUNCTUATION', '(')) {
                const args: ASTNode[] = [];
                if (!this.check('PUNCTUATION', ')')) {
                    do {
                        args.push(this.parseExpression());
                    } while (this.match('PUNCTUATION', ','));
                }
                this.consume('PUNCTUATION', ')');
                expr = {
                    type: 'CallExpression',
                    callee: expr,
                    arguments: args,
                    line: this.previous().line
                } as CallExpression;
            } else if (this.match('OPERATOR', '++')) {
                expr = {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: expr,
                    prefix: false,
                    line: this.previous().line
                } as UpdateExpression;
            } else if (this.match('OPERATOR', '--')) {
                expr = {
                    type: 'UpdateExpression',
                    operator: '--',
                    argument: expr,
                    prefix: false,
                    line: this.previous().line
                } as UpdateExpression;
            } else {
                break;
            }
        }
        return expr;
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
