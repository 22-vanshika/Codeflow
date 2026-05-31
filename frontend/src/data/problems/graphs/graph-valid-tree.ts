import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'graph-valid-tree',
  title: 'Graph Valid Tree',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/graph-valid-tree/',
  description: 'You have a graph of `n` nodes labeled from `0` to `n - 1`. You are given an integer `n` and a list of `edges` where `edges[i] = [ai, bi]` indicates that there is an undirected edge between nodes `ai` and `bi` in the graph.\\n\\nReturn `true` if the edges of the given graph make up a valid tree, and `false` otherwise.',
  examples: [
    {
      input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]',
      output: 'true'
    },
    {
      input: 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= n <= 2000',
    '0 <= edges.length <= 5000',
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
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        parent.resize(n);
        for (int i = 0; i < n; i++) parent[i] = i;
        
        for (auto& e : edges) {
            int root1 = find(e[0]);
            int root2 = find(e[1]);
            if (root1 == root2) return false;
            parent[root1] = root2;
        }
        return true;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> e = {{0,1},{0,2},{0,3},{1,4}};
    cout << boolalpha << sol.validTree(5, e) << endl; // true
    return 0;
}`,
};

export default problem;
