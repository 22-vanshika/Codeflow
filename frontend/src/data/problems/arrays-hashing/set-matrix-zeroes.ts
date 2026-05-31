import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'set-matrix-zeroes',
  title: 'Set Matrix Zeroes',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/set-matrix-zeroes/',
  description: 'Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`s. You must do it in place.',
  examples: [
    {
      input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]',
      output: '[[1,0,1],[0,0,0],[1,0,1]]'
    },
    {
      input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]',
      output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]'
    }
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[0].length',
    '1 <= m, n <= 200',
    '-2^31 <= matrix[i][j] <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstRow = false, firstCol = false;
        for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRow = true;
        for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstCol = true;
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
        if (firstRow) for (int j = 0; j < n; j++) matrix[0][j] = 0;
        if (firstCol) for (int i = 0; i < m; i++) matrix[i][0] = 0;
    }
};
int main() {
    Solution sol;
    vector<vector<int>> m = {{1,1,1},{1,0,1},{1,1,1}};
    sol.setZeroes(m);
    for (auto& r : m) { for (int v : r) cout << v << " "; cout << endl; }
    return 0;
}`,
};
export default problem;
