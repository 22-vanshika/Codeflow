import { Lexer, Parser } from './languages/cpp/parser';

const code = `
int main() {
  int a = 5;
  int b = 10;
  if (a < b) {
    return a;
  }
  return b;
}
`;

try {
    console.log('--- Code ---');
    console.log(code);

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    console.log('\n--- Tokens ---');
    console.log(tokens.map(t => `${t.type}(${t.value})`).join(', '));

    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log('\n--- AST ---');
    console.log(JSON.stringify(ast, null, 2));
} catch (e) {
    console.error(e);
}
