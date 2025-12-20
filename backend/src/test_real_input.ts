import { Executor } from './languages/cpp/executor';

const code = `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << "Sum: " << a + b << endl;
}
`;

function testInput(input: string, description: string) {
    console.log(`\n--- Test: ${description} [Input: "${input}"] ---`);
    try {
        const executor = new Executor();
        // Pass input to execute
        for (const trace of executor.execute(code, input)) {
            if (trace.type === 'function_call' && trace.explanation.startsWith('Output:')) {
                console.log(trace.explanation);
            }
            if (trace.type === 'function_call' && trace.explanation.startsWith('Input')) {
                console.log(trace.explanation);
            }
        }
        console.log("Execution finished successfully.");
    } catch (e: any) {
        console.log("Execution Failed as expected (or unexpected):");
        console.log(e.message);
    }
}

// 1. Valid Input
testInput("10 20", "Valid Input");

// 2. Missing Input (Should Fail)
testInput("", "Missing Input");

// 3. Partial Input (Should Fail on second read)
testInput("5", "Partial Input");
