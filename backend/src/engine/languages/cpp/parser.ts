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
    'std',
    'using', 'namespace',
    'const', 'size_t', 'auto',
    'unsigned', 'signed', 'long', 'short',
    'uint32_t', 'uint64_t', 'int32_t', 'int64_t', 'uint8_t', 'int8_t',
    'uint16_t', 'int16_t'
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

            if (char === '"' || char === "'") {
                tokens.push(this.readString());
                continue;
            }

            // Comments
            if (char === '/') {
                const next = this.source[this.position + 1];
                if (next === '/') {
                    // Single line comment
                    while (this.position < this.source.length && this.source[this.position] !== '\n') {
                        this.position++;
                    }
                    continue;
                }
                if (next === '*') {
                    // Block comment
                    this.position += 2;
                    while (this.position < this.source.length) {
                        if (this.source[this.position] === '*' && this.source[this.position + 1] === '/') {
                            this.position += 2;
                            break;
                        }
                        if (this.source[this.position] === '\n') this.line++;
                        this.position++;
                    }
                    continue;
                }
            }

            // Multi-char operators
            if (['=', '!', '<', '>', '+', '-', '*', '/', '%', '&', '|', '^', ':'].includes(char)) {
                const next = this.source[this.position + 1];
                if (next === '=') {
                    tokens.push({ type: 'OPERATOR', value: char + '=', line: this.line });
                    this.position += 2;
                    continue;
                }
                if (char === '<' && next === '<') {
                    if (this.source[this.position + 2] === '=') {
                        tokens.push({ type: 'OPERATOR', value: '<<=', line: this.line });
                        this.position += 3;
                    } else {
                        tokens.push({ type: 'OPERATOR', value: '<<', line: this.line });
                        this.position += 2;
                    }
                    continue;
                }
                if (char === '>' && next === '>') {
                    if (this.source[this.position + 2] === '=') {
                        tokens.push({ type: 'OPERATOR', value: '>>=', line: this.line });
                        this.position += 3;
                    } else {
                        tokens.push({ type: 'OPERATOR', value: '>>', line: this.line });
                        this.position += 2;
                    }
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
                if (next === '=' && ['+', '-', '*', '/', '%', '&', '|', '^'].includes(char)) {
                    tokens.push({ type: 'OPERATOR', value: char + '=', line: this.line });
                    this.position += 2;
                    continue;
                }
                if (char === '&' && next === '&') {
                    tokens.push({ type: 'OPERATOR', value: '&&', line: this.line });
                    this.position += 2;
                    continue;
                }
                if (char === '|' && next === '|') {
                    tokens.push({ type: 'OPERATOR', value: '||', line: this.line });
                    this.position += 2;
                    continue;
                }
            }

            if (['+', '-', '*', '/', '%', '=', '<', '>', '!', '&', '|', '^', '~'].includes(char)) {
                tokens.push({ type: 'OPERATOR', value: char, line: this.line });
                this.position++;
                continue;
            }

            if (['(', ')', '{', '}', ';', ',', '[', ']', '.', ':', '?'].includes(char)) {
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
        if (this.position < this.source.length && this.source[this.position] === '.' && /[0-9]/.test(this.source[this.position + 1])) {
            value += this.source[this.position++]; // consume '.'
            while (this.position < this.source.length && /[0-9]/.test(this.source[this.position])) {
                value += this.source[this.position++];
            }
        }
        // Consume numeric suffixes: LL, ULL, U, L, F
        while (this.position < this.source.length && /[uUlLfF]/.test(this.source[this.position])) {
            this.position++; // skip suffix
        }
        return { type: 'NUMBER', value, line: this.line };
    }

    private readString(): Token {
        const quoteType = this.source[this.position]; // " or '
        this.position++; // Skip quote
        let value = '';
        while (this.position < this.source.length) {
            const char = this.source[this.position];
            if (char === '\\') {
                this.position++;
                if (this.position < this.source.length) {
                    const esc = this.source[this.position++];
                    if (esc === 'n') value += '\n';
                    else if (esc === 't') value += '\t';
                    else if (esc === '\"') value += '\"';
                    else if (esc === '\'') value += '\'';
                    else if (esc === '\\') value += '\\';
                    else value += '\\' + esc;
                }
            } else if (char === quoteType) {
                break;
            } else {
                value += char;
                this.position++;
            }
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
                    const val = this.peek(offset).value;
                    if (val === '<') depth++;
                    else if (val === '>') depth--;
                    else if (val === '>>') depth -= 2;
                    offset++;
                }
            }

            // Skip pointers/refs
            while (this.peek(offset).value === '*' || this.peek(offset).value === '&') {
                offset++;
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

            // Check for constructor: StructName(...)
            if (this.peek().type === 'IDENTIFIER' && this.peek().value === name && this.peek(1).value === '(') {
                this.consume('IDENTIFIER', name);
                this.consume('PUNCTUATION', '(');
                const params: { name: string; type: string }[] = [];
                if (!this.check('PUNCTUATION', ')')) {
                    do {
                        let pType = this.parseTypeString();
                        const pName = this.consume('IDENTIFIER').value;
                        while (this.match('PUNCTUATION', '[')) {
                            if (this.check('NUMBER')) this.consume('NUMBER');
                            this.consume('PUNCTUATION', ']');
                            pType += '[]';
                        }
                        params.push({ name: pName, type: pType });
                    } while (this.match('PUNCTUATION', ','));
                }
                this.consume('PUNCTUATION', ')');

                // Constructor initializer list: : member1(arg1), member2(arg2)
                const bodyStatements: ASTNode[] = [];
                if (this.match('PUNCTUATION', ':')) {
                    do {
                        const memberName = this.consume('IDENTIFIER').value;
                        this.consume('PUNCTUATION', '(');
                        const expr = this.parseExpression();
                        this.consume('PUNCTUATION', ')');

                        // Construct: this->memberName = expr
                        const thisExpr = { type: 'ThisExpression', line: this.previous().line } as ThisExpression;
                        const memberExpr = {
                            type: 'MemberExpression',
                            object: thisExpr,
                            property: { type: 'Identifier', name: memberName, line: this.previous().line } as Identifier,
                            computed: false,
                            line: this.previous().line
                        } as MemberExpression;

                        bodyStatements.push({
                            type: 'ExpressionStatement',
                            expression: {
                                type: 'Assignment',
                                left: memberExpr,
                                name: memberName,
                                value: expr,
                                line: this.previous().line
                            } as Assignment,
                            line: this.previous().line
                        } as ExpressionStatement);

                    } while (this.match('PUNCTUATION', ','));
                }

                const body = this.parseBlock();
                body.body = [...bodyStatements, ...body.body]; // Prepend initializer assignments!

                members.push({
                    type: 'FunctionDeclaration',
                    name: name, // Save constructor as the struct name
                    returnType: 'void',
                    params,
                    body,
                    line: this.previous().line
                } as any);
                continue;
            }

            // Member can be nested struct/class, Var, or Func
            if (this.check('KEYWORD', 'struct') || this.check('KEYWORD', 'class')) {
                members.push(this.parseClassDeclaration() as any);
            } else if (this.isFunctionDeclaration()) {
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
                type += this.advance().value;
            }
        } else {
            const words: string[] = [];
            if (this.check('KEYWORD', 'const')) {
                words.push(this.advance().value);
            }
            if (this.check('KEYWORD', 'decltype') || this.check('IDENTIFIER', 'decltype')) {
                this.advance();
                this.consume('PUNCTUATION', '(');
                let depth = 1;
                let inner = '';
                while (depth > 0 && !this.check('EOF')) {
                    if (this.check('PUNCTUATION', '(')) depth++;
                    else if (this.check('PUNCTUATION', ')')) depth--;
                    const t = this.advance().value;
                    if (depth > 0) inner += t;
                }
                words.push(`decltype(${inner})`);
            } else if (this.check('KEYWORD') || this.check('IDENTIFIER')) {
                const parts: string[] = [];
                while (this.check('KEYWORD') || this.check('IDENTIFIER')) {
                    const val = this.peek().value;
                    // Support 'unsigned int', 'long long', 'unsigned long long', etc.
                    if (['unsigned', 'signed', 'long', 'short', 'int', 'double', 'char', 'float'].includes(val)) {
                        parts.push(this.advance().value);
                    } else if (parts.length === 0) {
                        parts.push(this.advance().value);
                        // For fixed-width integer types, normalize them to int
                        break;
                    } else {
                        break;
                    }
                }
                words.push(parts.join(' '));
            }
            type = words.join(' ');
        }

        // Handle ::
        while (this.match('PUNCTUATION', '::')) {
            type += '::';
            // Could be identifier or keyword (e.g. std::string::npos)
            if (this.check('IDENTIFIER') || this.check('KEYWORD')) {
                type += this.advance().value;
            }
        }

        // Handle templates <...>
        if (this.match('OPERATOR', '<')) {
            type += '<';
            type += this.parseTypeString();
            while (this.match('PUNCTUATION', ',')) {
                type += ', ';
                type += this.parseTypeString();
            }

            // Handle > or >>
            if (this.check('OPERATOR', '>')) {
                this.consume('OPERATOR', '>');
                type += '>';
            } else if (this.check('OPERATOR', '>>')) {
                this.tokens[this.current].value = '>'; // Change >> to >
                this.tokens.splice(this.current + 1, 0, { type: 'OPERATOR', value: '>', line: this.peek().line });
                this.consume('OPERATOR', '>');
                type += '>';
            } else {
                // Tolerant: if we can't find >, just close gracefully
                type += '>';
            }
        }

        // Handle :: after templates (e.g. list<int>::iterator)
        while (this.match('PUNCTUATION', '::')) {
            type += '::';
            if (this.check('IDENTIFIER') || this.check('KEYWORD')) {
                type += this.advance().value;
            }
        }

        // Handle Pointers/Refs (* or &)
        while (this.check('OPERATOR', '*') || this.check('OPERATOR', '&')) {
            type += this.advance().value;
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
                let pType = this.parseTypeString();
                const pName = this.consume('IDENTIFIER').value;
                while (this.match('PUNCTUATION', '[')) {
                    if (this.check('NUMBER')) this.consume('NUMBER');
                    this.consume('PUNCTUATION', ']');
                    pType += '[]';
                }
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
        if (this.match('KEYWORD', 'for')) {
            return this.parseForStatement();
        }
        if (this.check('KEYWORD', 'struct') || this.check('KEYWORD', 'class')) {
            return this.parseClassDeclaration();
        }
        if (this.match('KEYWORD', 'break')) {
            this.consume('PUNCTUATION', ';');
            // We'll treat break as a minimal specific BreakStatement
            return { type: 'BreakStatement', line: this.previous().line } as any; // Cast as ASTNode
        }
        if (this.match('KEYWORD', 'continue')) {
            this.consume('PUNCTUATION', ';');
            return { type: 'ContinueStatement', line: this.previous().line } as any;
        }
        if (this.match('KEYWORD', 'delete')) {
            const expr = this.parseExpression();
            this.consume('PUNCTUATION', ';');
            return { type: 'DeleteStatement', argument: expr, line: this.previous().line } as any;
        }

        return this.parseExpressionStatement();
    }

    private parseExpressionStatement(): ExpressionStatement {
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
            if (KEYWORDS.has(this.peek().value) && !['return', 'if', 'while', 'for', 'break', 'continue', 'struct', 'class', 'using', 'namespace', 'true', 'false', 'null', 'new', 'delete', 'this'].includes(this.peek().value)) {
                // Excluding control keywords. 
                // Includes 'vector', 'map' if in KEYWORDS.
                return true;
            }

            // If starts with identifier, check next.
            if (this.peek().type === 'IDENTIFIER') {
                // T name;
                const nextVal = this.peek(1).value;
                const nextType = this.peek(1).type;

                // Handle template: vector<int> v;
                if (nextVal === '<') {
                    // ID < ...
                    // Assume it's a type.
                    // It could be comparison: a < b;
                    // But at statement start, likely decl?
                    // "a < b;" is valid expression statement.
                    // "vector<int> v;" is decl.
                    // Use simple heuristic: if it looks like type<...> Name, it's decl.
                    // Checking for matching > and then Identifier.
                    let offset = 2; // after <
                    let depth = 1;
                    while (offset < 100 && depth > 0) { // arbitrary limit
                        const t = this.peek(offset).value;
                        if (t === '<') depth++;
                        else if (t === '>') depth--;
                        else if (t === '>>') depth -= 2;
                        if (this.check('EOF') || this.peek(offset).type === 'EOF') break;
                        offset++;
                    }
                    if (depth === 0) {
                        // We found closing >, check next
                        if (this.peek(offset).type === 'IDENTIFIER') return true;
                    }
                }

                // T name;
                if (nextType === 'IDENTIFIER') {
                    // ID ID -> likely decl.
                    // But could be "obj prop" (invalid syntax unless macro?)
                    // "a b;" -> valid if a is type.
                    return true;
                }

                // T * name; (Pointer)
                if (nextVal === '*' || nextVal === '&') {
                    return true;
                }
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

        // Check if it is a range-based for loop
        let isRangeFor = false;
        let depth = 0;
        for (let i = 0; ; i++) {
            const tok = this.peek(i);
            if (tok.type === 'EOF') break;
            if (tok.type === 'PUNCTUATION' && tok.value === '(') depth++;
            if (tok.type === 'PUNCTUATION' && tok.value === ')') {
                if (depth === 0) break;
                depth--;
            }
            if (depth === 0) {
                if (tok.type === 'PUNCTUATION' && tok.value === ':') {
                    isRangeFor = true;
                    break;
                }
                if (tok.type === 'PUNCTUATION' && tok.value === ';') {
                    break;
                }
            }
        }

        if (isRangeFor) {
            let type = this.parseTypeString();
            while (this.check('OPERATOR', '*') || this.check('OPERATOR', '&')) {
                type += this.advance().value;
            }
            let rangeVariable: any;
            if (this.match('PUNCTUATION', '[')) {
                const names: string[] = [];
                if (!this.check('PUNCTUATION', ']')) {
                    do {
                        // Skip any reference ampersands inside structured binding if present
                        while (this.check('OPERATOR', '&')) {
                            this.advance();
                        }
                        names.push(this.consume('IDENTIFIER').value);
                    } while (this.match('PUNCTUATION', ','));
                }
                this.consume('PUNCTUATION', ']');
                rangeVariable = {
                    type: 'StructuredBindingDeclaration',
                    names,
                    varType: type,
                    line: this.previous().line
                };
            } else {
                const name = this.consume('IDENTIFIER').value;
                rangeVariable = {
                    type: 'VariableDeclaration',
                    name,
                    varType: type,
                    line: this.previous().line
                };
            }

            this.consume('PUNCTUATION', ':');
            const rangeContainer = this.parseExpression();
            this.consume('PUNCTUATION', ')');
            const body = this.parseStatement();
            return {
                type: 'ForStatement',
                init: undefined,
                test: undefined,
                update: undefined,
                body,
                line,
                isRangeFor: true,
                rangeVariable,
                rangeContainer
            } as any;
        }

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

        const body = this.parseStatement();
        return { type: 'ForStatement', init, test, update, body, line };
    }

    private parseVariableDeclarationList(type: string): ASTNode {
        // Intercept structured binding: auto [a, b] = ...;
        let checkType = type;
        const savePos = this.current;
        while (this.check('OPERATOR', '*') || this.check('OPERATOR', '&')) {
            checkType += this.peek().value;
            this.advance();
        }
        if (this.check('PUNCTUATION', '[')) {
            this.consume('PUNCTUATION', '[');
            const names: string[] = [];
            if (!this.check('PUNCTUATION', ']')) {
                do {
                    while (this.check('OPERATOR', '&')) this.advance();
                    names.push(this.consume('IDENTIFIER').value);
                } while (this.match('PUNCTUATION', ','));
            }
            this.consume('PUNCTUATION', ']');
            this.consume('OPERATOR', '=');
            const init = this.parseExpression();
            this.consume('PUNCTUATION', ';');
            return {
                type: 'StructuredBindingDeclaration',
                names,
                varType: checkType,
                init,
                line: this.previous().line
            } as any;
        }
        // Rollback pointers/refs check if it's not structured binding
        this.current = savePos;

        // Parse: name [= init], name2 [= init2];
        // Also supports: name[size] = {...}
        const decls: VariableDeclaration[] = [];

        do {
            let varType = type;
            while (this.check('OPERATOR', '*') || this.check('OPERATOR', '&')) {
                varType += this.advance().value;
            }
            const name = this.consume('IDENTIFIER').value;
            let arraySize: number | undefined;
            let init: ASTNode | undefined;

            // Check for array declaration: int arr[5][5]
            const dimensions: number[] = [];
            while (this.match('PUNCTUATION', '[')) {
                // Parse array size
                if (this.check('PUNCTUATION', ']')) {
                    dimensions.push(0); // empty brackets
                } else if (this.check('NUMBER')) {
                    dimensions.push(parseInt(this.consume('NUMBER').value));
                } else {
                    // Could be expression like arr[n], but for simplicity we'll parse as expression
                    // For visualization, we really want a number to allocate.
                    // If it's an Identifier, we might not know value yet.
                    // Let's assume Expression evaluating to number, but we can't eval here.
                    // We'll store 0 or skip? 
                    // Better: Executor handles sizing? 
                    // We'll try to parse expression and if Literal use value.
                    const sizeExpr = this.parseExpression();
                    if (sizeExpr.type === 'Literal') {
                        dimensions.push((sizeExpr as any).value);
                    } else {
                        dimensions.push(0); // Dynamic size
                    }
                }
                this.consume('PUNCTUATION', ']');
            }
            if (dimensions.length > 0) arraySize = dimensions[0]; // Legacy support for now

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
                init = { type: 'NewExpression', className: varType, arguments: args, line: this.previous().line } as NewExpression;
            }

            decls.push({
                type: 'VariableDeclaration',
                varType: dimensions.length > 0 ? `${varType}${dimensions.map(() => '[]').join('')}` : varType,
                name,
                arrayDimensions: dimensions.length > 0 ? dimensions : undefined,
                init,
                line: this.previous().line
            });

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

    private parseAssignment(): ASTNode {
        const left = this.parseTernary();

        // Check if next is = or compound assignment (+=, -=, *=, /=, %=, &=, |=, ^=, <<=, >>=)
        if (this.match('OPERATOR', '=') || this.match('OPERATOR', '+=') || this.match('OPERATOR', '-=') ||
            this.match('OPERATOR', '*=') || this.match('OPERATOR', '/=') || this.match('OPERATOR', '%=') ||
            this.match('OPERATOR', '&=') || this.match('OPERATOR', '|=') || this.match('OPERATOR', '^=') ||
            this.match('OPERATOR', '<<=') || this.match('OPERATOR', '>>=')) {

            const operator = this.previous().value;
            const value = this.parseAssignment(); // Right-associative

            // Handle simple assignment
            if (operator === '=') {
                let name = '';
                if (left.type === 'Identifier') name = (left as Identifier).name;

                return { type: 'Assignment', name, left, value, line: this.previous().line };
            }

            // Handle compound assignment (+=, etc.)
            // Convert c += a to c = c + a
            const binaryOp = operator.slice(0, -1);
            const binaryExpr = {
                type: 'BinaryExpression',
                operator: binaryOp,
                left,
                right: value,
                line: this.previous().line
            } as BinaryExpression;

            let name = '';
            if (left.type === 'Identifier') name = (left as Identifier).name;

            return { type: 'Assignment', name, left, value: binaryExpr, line: this.previous().line };
        }

        return left;
    }

    private parseTernary(): ASTNode {
        let expr = this.parseLogicalOr();
        if (this.match('PUNCTUATION', '?')) {
            const consequent = this.parseExpression();
            this.consume('PUNCTUATION', ':');
            const alternate = this.parseAssignment(); // ternary is right-associative
            return {
                type: 'ConditionalExpression',
                test: expr,
                consequent,
                alternate,
                line: this.previous().line
            } as any;
        }
        return expr;
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
        const body = this.parseStatement();
        return { type: 'WhileStatement', test, body, line: this.previous().line };
    }

    private parseExpression(): ASTNode {
        return this.parseAssignment();
    }

    private parseLogicalOr(): ASTNode {
        let expr = this.parseLogicalAnd();
        while (this.match('OPERATOR', '||')) {
            const operator = this.previous().value;
            const right = this.parseLogicalAnd();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseLogicalAnd(): ASTNode {
        let expr = this.parseBitwiseOr();
        while (this.match('OPERATOR', '&&')) {
            const operator = this.previous().value;
            const right = this.parseBitwiseOr();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseBitwiseOr(): ASTNode {
        let expr = this.parseBitwiseXor();
        while (this.match('OPERATOR', '|')) {
            const operator = this.previous().value;
            const right = this.parseBitwiseXor();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseBitwiseXor(): ASTNode {
        let expr = this.parseBitwiseAnd();
        while (this.match('OPERATOR', '^')) {
            const operator = this.previous().value;
            const right = this.parseBitwiseAnd();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseBitwiseAnd(): ASTNode {
        let expr = this.parseEquality();
        while (this.match('OPERATOR', '&')) {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
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
        let expr = this.parseUnary();
        while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/') || this.match('OPERATOR', '%')) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expr = { type: 'BinaryExpression', operator, left: expr, right, line: expr.line } as BinaryExpression;
        }
        return expr;
    }

    private parseUnary(): ASTNode {
        if (this.match('OPERATOR', '-') || this.match('OPERATOR', '!') || this.match('OPERATOR', '~') || this.match('OPERATOR', '*') || this.match('OPERATOR', '&') ||
            this.match('OPERATOR', '++') || this.match('OPERATOR', '--')) {
            const operator = this.previous().value;
            const argument = this.parseUnary();
            if (operator === '-') {
                return {
                    type: 'BinaryExpression',
                    operator: '-',
                    left: { type: 'Literal', value: 0, valueType: 'int', line: this.previous().line },
                    right: argument,
                    line: this.previous().line
                } as BinaryExpression;
            }
            if (operator === '!' || operator === '~') {
                return {
                    type: 'UnaryExpression',
                    operator,
                    argument,
                    line: this.previous().line
                } as any;
            }
            if (operator === '*' || operator === '&') {
                return {
                    type: 'UnaryExpression',
                    operator,
                    argument,
                    line: this.previous().line
                } as any;
            }
            if (operator === '++' || operator === '--') {
                return {
                    type: 'UpdateExpression',
                    operator,
                    argument,
                    prefix: true,
                    line: this.previous().line
                } as any;
            }
        }
        return this.parsePrimary();
    }

    private parsePrimary(): ASTNode {
        if (this.check('PUNCTUATION', '[')) {
            this.consume('PUNCTUATION', '[');
            while (!this.check('PUNCTUATION', ']') && !this.check('EOF')) {
                this.advance();
            }
            this.consume('PUNCTUATION', ']');

            this.consume('PUNCTUATION', '(');
            const params: VariableDeclaration[] = [];
            if (!this.check('PUNCTUATION', ')')) {
                do {
                    const pType = this.parseTypeString();
                    let pName = '';
                    while (this.check('OPERATOR', '*') || this.check('OPERATOR', '&')) {
                        this.advance();
                    }
                    pName = this.consume('IDENTIFIER').value;
                    params.push({
                        type: 'VariableDeclaration',
                        name: pName,
                        varType: pType,
                        line: this.previous().line
                    });
                } while (this.match('PUNCTUATION', ','));
            }
            this.consume('PUNCTUATION', ')');

            const body = this.parseBlock();
            return {
                type: 'FunctionDeclaration',
                name: '',
                params,
                body,
                returnType: 'auto',
                line: this.previous().line
            } as any;
        }

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
            const numStr = this.previous().value;
            const numVal = numStr.includes('.') ? parseFloat(numStr) : parseInt(numStr);
            return { type: 'Literal', value: numVal, valueType: numStr.includes('.') ? 'double' : 'int', line: this.previous().line };
        }
        if (this.match('STRING')) {
            return { type: 'Literal', value: this.previous().value, valueType: 'string', line: this.previous().line };
        }
        if (this.check('PUNCTUATION', '{')) {
            return this.parseArrayExpression();
        }

        let expr: ASTNode;
        const nextVal = this.peek().value;
        const isTypeStart = ['vector', 'map', 'unordered_map', 'set', 'unordered_set', 'stack', 'queue', 'deque', 'priority_queue', 'pair', 'string', 'int', 'double', 'float', 'char', 'bool', 'void', 'long', 'size_t', 'unsigned', 'uint32_t', 'uint64_t', 'int32_t', 'int64_t'].includes(nextVal);
        if (this.check('KEYWORD', 'std') || isTypeStart) {
            const typeName = this.parseTypeString();
            expr = { type: 'Identifier', name: typeName, line: this.previous().line };
        } else if (this.match('IDENTIFIER')) {
            expr = { type: 'Identifier', name: this.previous().value, line: this.previous().line };
        } else if (this.match('PUNCTUATION', '(')) {
            // Check if this is a type cast: (type)expr
            // Handles: (int), (double), (long), (long long), (unsigned int), (uint32_t), etc.
            const castTypeKeywords = ['int', 'double', 'float', 'char', 'bool', 'void', 'long', 'unsigned', 'signed', 'short',
                                      'uint32_t', 'uint64_t', 'int32_t', 'int64_t', 'size_t'];
            let isCast = false;
            let castLen = 0;
            if ((this.check('KEYWORD') || this.check('IDENTIFIER')) && castTypeKeywords.includes(this.peek().value)) {
                // Try to find closing )
                let offset = 0;
                while (offset < 10 && this.peek(offset).type !== 'EOF') {
                    const v = this.peek(offset).value;
                    if (v === ')') { castLen = offset; isCast = true; break; }
                    if (!castTypeKeywords.includes(v) && this.peek(offset).type !== 'KEYWORD' && this.peek(offset).type !== 'IDENTIFIER') break;
                    offset++;
                }
            }
            if (isCast) {
                // Consume type tokens until )
                const typeParts: string[] = [];
                while (!this.check('PUNCTUATION', ')')) {
                    typeParts.push(this.advance().value);
                }
                const castType = typeParts.join(' ');
                this.consume('PUNCTUATION', ')');
                const argument = this.parseUnary();
                return {
                    type: 'CastExpression',
                    castType,
                    argument,
                    line: this.previous().line
                } as any;
            }
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
