
import { AiService } from './src/services/ai.service';
import * as fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const aiService = new AiService();

const testCases = {
    "If_Else": `
        int main() {
            int x = 10;
            if(x > 5) {
                cout << "High";
            } else {
                cout << "Low";
            }
            return 0;
        }
    `,
    "Stack_Ops": `
        #include <stack>
        using namespace std;
        int main() {
            stack<int> s;
            s.push(1);
            s.push(2);
            s.pop();
            return 0;
        }
    `,
    "Recursion": `
        int factorial(int n) {
            if (n <= 1) return 1;
            return n * factorial(n - 1);
        }
        int main() {
            int f = factorial(5);
            return 0;
        }
    `,
    "While_Loop": `
        int main() {
            int i = 0;
            while(i < 5) {
                cout << i;
                i = i + 1;
            }
            return 0;
        }
    `
};

async function runTests() {
    console.log("Starting Flowchart Verification (Focused)...\n");

    // Only run complex cases
    const focused = {
        "Stack_Ops": testCases["Stack_Ops"],
        "Recursion": testCases["Recursion"]
    };

    for (const [name, code] of Object.entries(focused)) {
        console.log(`\n\n=== Testing ${name} ===`);
        try {
            const result = await aiService.generateFlowchart(code);
            const markdown = typeof result === 'string' ? result : result.markdown;

            console.log("--- Mermaid Code Start ---");
            console.log(markdown);
            console.log("--- Mermaid Code End ---");

        } catch (e) {
            console.error(`❌ Crash in ${name}:`, e);
        }
    }
}

runTests();
