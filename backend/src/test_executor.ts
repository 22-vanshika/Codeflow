import { Executor } from './languages/cpp/executor';

const code = `
int add(int x, int y) {
  return x + y;
}

int main() {
  int a = 5;
  int b = 10;
  int c = add(a, b);
  return c;
}
`;

try {
    console.log('--- Executing Code ---');
    const executor = new Executor();
    const index = 0;
    for (const trace of executor.execute(code)) {
        console.log(`Step ${index}: Line ${trace.line} [${trace.type}] ${trace.explanation}`);
        // console.log(`Stack:`, JSON.stringify(trace.stack));
    }
} catch (e) {
    console.error(e);
}
