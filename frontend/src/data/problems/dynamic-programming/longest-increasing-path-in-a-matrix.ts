import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'longest-increasing-path-in-a-matrix',
  title: 'Longest Increasing Path in a Matrix',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/',
  description: 'Given an `m x n` integers `matrix`, return the length of the longest increasing path in `matrix`.\\n\\nFrom each cell, you can either move in four directions: left, right, up, or down. You **may not** move diagonally or move outside the boundary (i.e., wrap-around is not allowed).',
  examples: [
    {
      input: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]',
      output: '4',
      explanation: 'The longest increasing path is [1, 2, 6, 9].'
    },
    {
      input: 'matrix = [[3,4,5],[3,2,6],[2,2,1]]',
      output: '4',
      explanation: 'The longest increasing path is [3, 4, 5, 6]. Moving diagonally is not allowed.'
    }
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[i].length',
    '1 <= m, n <= 200',
    '0 <= matrix[i][j] <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    int m, n;
    int memo[200][200];
    int dfs(vector<vector<int>>& matrix, int i, int j) {
        if (memo[i][j]) return memo[i][j];
        int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
        int res = 1;
        for (auto& d : dirs) {
            int r = i + d[0], c = j + d[1];
            if (r >= 0 && r < m && c >= 0 && c < n && matrix[r][c] > matrix[i][j]) {
                res = max(res, 1 + dfs(matrix, r, c));
            }
        }
        return memo[i][j] = res;
    }
public:
    int longestIncreasingPath(vector<vector<int>>& matrix) {
        m = matrix.size(); n = matrix[0].size();
        memset(memo, 0, sizeof(memo));
        int maxLen = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                maxLen = max(maxLen, dfs(matrix, i, j));
        return maxLen;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> m = {{9,9,4},{6,6,8},{2,1,1}};
    cout << sol.longestIncreasingPath(m) << endl; // 4
    return 0;
}`,
};

export default problem;
