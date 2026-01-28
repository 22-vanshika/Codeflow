import { Executor } from './src/engine/languages/cpp/executor';
import * as fs from 'fs';

const testCases = [
    {
        id: 26,
        name: "Binary Search Tree (BST)",
        code: `
int main() {
    // Simple BST Simulation using Structs
    // Since full pointer support "Node* link" might need parser fix, 
    // we test if basic linking works (as in Test 17).
    
    struct Node {
        int val;
        Node* left;
        Node* right;
    };
    
    Node* root = new Node();
    root->val = 10;
    
    Node* left = new Node();
    left->val = 5;
    root->left = left;
    
    Node* right = new Node();
    right->val = 15;
    root->right = right;
    
    int l = root->left->val; // 5
    int r = root->right->val; // 15
}
        `
    },
    {
        id: 27,
        name: "Graph DFS (Adjacency List)",
        code: `
void dfs(int u, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& path) {
    visited[u] = true;
    path.push_back(u);
    for (int i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        if (!visited[v]) {
            dfs(v, adj, visited, path);
        }
    }
}

int main() {
    vector<vector<int>> adj;
    vector<int> row0; row0.push_back(1); adj.push_back(row0);
    vector<int> row1; row1.push_back(2); adj.push_back(row1);
    vector<int> row2; adj.push_back(row2);
    
    vector<bool> visited;
    visited.push_back(false); visited.push_back(false); visited.push_back(false);
    
    vector<int> path;
    dfs(0, adj, visited, path);
    // path should be {0, 1, 2}
}
        `
    },
    {
        id: 28,
        name: "Graph BFS (Shortest Path)",
        code: `
int main() {
    vector<vector<int>> adj;
    vector<int> r0; r0.push_back(1); adj.push_back(r0);
    vector<int> r1; r1.push_back(2); adj.push_back(r1);
    vector<int> r2; adj.push_back(r2);
    
    queue<int> q;
    q.push(0);
    
    vector<int> dist;
    dist.push_back(0); dist.push_back(-1); dist.push_back(-1);
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        
        for (int i = 0; i < adj[u].size(); i++) {
            int v = adj[u][i];
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
}
        `
    },
    {
        id: 29,
        name: "2D DP (Grid Paths)",
        code: `
int main() {
    int m = 3; 
    int n = 3;
    int dp[3][3];
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 || j == 0) dp[i][j] = 1;
            else dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
}
        `
    },
    {
        id: 30,
        name: "Towers of Hanoi (Recursion)",
        code: `
int moves = 0;
void solve(int n, char from, char to, char aux) {
    if (n == 0) return;
    solve(n-1, from, aux, to);
    moves++;
    solve(n-1, aux, to, from);
}

int main() {
    solve(3, 'A', 'C', 'B'); 
}
        `
    },
    {
        id: 31,
        name: "Nested Structs (Linked Box)",
        code: `
struct Box {
    int id;
    Box* inside;
};

int main() {
    Box* b1 = new Box();
    b1->id = 1;
    
    Box* b2 = new Box();
    b2->id = 2;
    b1->inside = b2;
    
    int innerId = b1->inside->id; // 2
}
        `
    }
];

async function runTests() {
    console.log("Starting Comprehensive Test Suite (Phase 4)...");
    const logStream = fs.createWriteStream('test_results_comprehensive.log');

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
