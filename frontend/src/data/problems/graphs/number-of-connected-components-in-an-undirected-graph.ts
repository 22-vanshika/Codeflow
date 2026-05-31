import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'number-of-connected-components-in-an-undirected-graph',
  title: 'Number of Connected Components in an Undirected Graph',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
  description: 'You have a graph of `n` nodes. You are given an integer `n` and an array `edges` where `edges[i] = [ai, bi]` indicates that there is an edge between `ai` and `bi` in the graph.\\n\\nReturn the number of connected components in the graph.',
  examples: [
    {
      input: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
      output: '2'
    },
    {
      input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]',
      output: '1'
    }
  ],
  constraints: [
    '1 <= n <= 2000',
    '1 <= edges.length <= 5000',
    'edges[i].length == 2',
    '0 <= ai, bi < n',
    'ai != bi',
    'There are no self-loops or repeated edges.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    vector<int> parent;
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n);
        for (int i = 0; i < n; i++) parent[i] = i;
        int count = n;
        for (auto& e : edges) {
            int r1 = find(e[0]);
            int r2 = find(e[1]);
            if (r1 != r2) {
                parent[r1] = r2;
                count--;
            }
        }
        return count;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> e = {{0,1},{1,2},{3,4}};
    cout << sol.countComponents(5, e) << endl; // 2
    return 0;
}`,
};

export default problem;
