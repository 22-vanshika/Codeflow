import { Executor } from './languages/cpp/executor';

const code = `
#include <bits/stdc++.h>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + 5 << " " << b << endl;
    
    // Additional Test for Multi-Decl
    int x = 10, y = 20;
    cout << x << " " << y << endl;
}
`;

try {
    console.log('--- Executing User Screenshot Code ---');
    const executor = new Executor();
    let steps = 0;
    for (const trace of executor.execute(code, "5 4")) {
        steps++;
        if (trace.type === 'function_call' && trace.explanation.startsWith('Output:')) {
            console.log(trace.explanation);
        }
        if (trace.type === 'assignment') {
            // console.log(`[Assign] ${trace.explanation}`);
        }
    }
    console.log("Execution finished successfully.");
} catch (e) {
    console.error("Execution Failed:");
    console.error(e);
}
