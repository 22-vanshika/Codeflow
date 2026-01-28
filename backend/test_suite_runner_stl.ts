import { Executor } from './src/engine/languages/cpp/executor';
import * as fs from 'fs';

const testCases = [
    {
        id: 18,
        name: "String Operations",
        code: `
int main() {
    string s = "Hello";
    s += " World";
    
    // Substring
    string sub = s.substr(0, 5); // "Hello"
    
    // Find
    int pos = s.find("World"); // 6
    
    // Append char
    s += '!';
}
        `
    },
    {
        id: 19,
        name: "Stack Operations",
        code: `
int main() {
    stack<int> st;
    st.push(10);
    st.push(20);
    
    int top1 = st.top(); // 20
    st.pop();
    
    int top2 = st.top(); // 10
    bool isEmpty = st.empty(); // false
    
    st.pop();
    bool emptyNow = st.empty(); // true
}
        `
    },
    {
        id: 20,
        name: "Queue Operations",
        code: `
int main() {
    queue<int> q;
    q.push(1);
    q.push(2);
    
    int f1 = q.front(); // 1
    q.pop();
    
    int f2 = q.front(); // 2
    int sz = q.size(); // 1
}
        `
    },
    {
        id: 21,
        name: "Vector Operations",
        code: `
int main() {
    vector<int> v;
    v.push_back(5);
    v.push_back(10);
    v.push_back(15);
    
    int sz = v.size(); // 3
    int mid = v[1]; // 10
    
    v.pop_back();
    int sz2 = v.size(); // 2
}
        `
    },
    {
        id: 22,
        name: "Map Basic Operations",
        code: `
int main() {
    map<int, string> mp;
    mp[1] = "one";
    mp[2] = "two";
    
    string val = mp[1]; // "one"
    int sz = mp.size(); // 2
    
    mp.erase(1);
    int sz2 = mp.size(); // 1
}
        `
    },
    {
        id: 23,
        name: "Sorting (Vector)",
        code: `
int main() {
    vector<int> v;
    v.push_back(3);
    v.push_back(1);
    v.push_back(2);
    
    sort(v.begin(), v.end());
    // Expected: v = {1, 2, 3}
}
        `
    },
    {
        id: 24,
        name: "Math & Algorithms",
        code: `
int main() {
    int a = 10;
    int b = 20;
    int mx = max(a, b); // 20
    int mn = min(a, b); // 10
}
        `
    },
    {
        id: 25,
        name: "Pair & Tuple",
        code: `
int main() {
    pair<int, int> p;
    p.first = 10;
    p.second = 20;
    
    int sum = p.first + p.second; // 30
}
        `
    }
];

async function runTests() {
    console.log("Starting STL Test Suite...");
    const logStream = fs.createWriteStream('test_results_stl.log');

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
