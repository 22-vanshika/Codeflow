import { Executor } from './src/engine/languages/cpp/executor';
import * as fs from 'fs';

const testCases = [
    {
        id: 13,
        name: "String Reversal",
        code: `
int main() {
    string s = "hello";
    string reversed = "";
    int n = 5; 
    for (int i = n - 1; i >= 0; i--) {
        reversed += s[i];
    }
}
        `
    },
    {
        id: 14,
        name: "2D Array Traversal",
        code: `
int main() {
    int matrix[3][3];
    int count = 1;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            matrix[i][j] = count;
            count++;
        }
    }
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        sum += matrix[i][i];
    }
}
        `
    },
    {
        id: 15,
        name: "Fibonacci DP",
        code: `
int main() {
    int n = 6;
    int dp[10];
    dp[0] = 0;
    dp[1] = 1;
    
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
}
        `
    },
    {
        id: 16,
        name: "Valid Parentheses (Stack Sim)",
        code: `
int main() {
    string s = "()(())";
    int stack[10];
    int top = -1;
    bool valid = true;
    
    int len = 6;
    for (int i = 0; i < len; i++) {
        char c = s[i];
        if (c == '(') {
            top++;
            stack[top] = 1;
        } else {
            if (top == -1) {
                valid = false;
                break;
            }
            top--;
        }
    }
    if (top != -1) valid = false;
}
        `
    },
    {
        id: 17,
        name: "Simple Tree Node (Struct)",
        code: `
struct Node {
    int data;
    int left;
    int right;
};

int main() {
    Node tree[5];
    tree[0].data = 10;
    tree[0].left = 1;
    tree[0].right = 2;
    
    tree[1].data = 5;
    tree[1].left = -1;
    tree[1].right = -1;
    
    tree[2].data = 15;
    tree[2].left = -1;
    tree[2].right = -1;
    
    int sum = tree[0].data + tree[1].data + tree[2].data;
}
        `
    }
];

async function runTests() {
    console.log("Starting Advanced Test Suite...");
    const logStream = fs.createWriteStream('test_results_advanced.log');

    let passed = 0;
    let failed = 0;

    for (const test of testCases) {
        console.log(`Testing: ${test.id}. ${test.name}`);
        logStream.write(`\nTesting: ${test.id}. ${test.name}\n`);

        try {
            const executor = new Executor();
            const traceGenerator = executor.execute(test.code);

            // Execute all steps
            for (const trace of traceGenerator) {
                // consuming generator
            }

            console.log("✅ PASSED");
            logStream.write("✅ PASSED\n");
            passed++;
        } catch (e: any) {
            console.log("❌ FAILED");
            console.error(e.message);
            logStream.write("❌ FAILED\n");
            logStream.write(`${e.message}\n`);
            if (e.stack) logStream.write(`${e.stack}\n`);
            failed++;
        }
    }

    console.log(`\nMethod Summary:\nPassed: ${passed}\nFailed: ${failed}`);
    logStream.write(`\nMethod Summary:\nPassed: ${passed}\nFailed: ${failed}\n`);
    logStream.end();
}

runTests();
