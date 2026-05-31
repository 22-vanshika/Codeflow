import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'n-queens-ii',
  title: 'N-Queens II',
  difficulty: 'Hard',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/n-queens-ii/',
  description: 'The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\\n\\nGiven an integer `n`, return the number of distinct solutions to the **n-queens puzzle**.',
  examples: [
    {
      input: 'n = 4',
      output: '2',
      explanation: 'There are two distinct solutions to the 4-queens puzzle.'
    },
    {
      input: 'n = 1',
      output: '1'
    }
  ],
  constraints: [
    '1 <= n <= 9'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    int count = 0;
    void backtrack(int n, int row, int cols, int diag1, int diag2) {
        if (row == n) {
            count++;
            return;
        }
        int available = ((1 << n) - 1) & (~(cols | diag1 | diag2));
        while (available) {
            int p = available & -available;
            backtrack(n, row + 1, cols | p, (diag1 | p) << 1, (diag2 | p) >> 1);
            available ^= p;
        }
    }
public:
    int totalNQueens(int n) {
        backtrack(n, 0, 0, 0, 0);
        return count;
    }
};

int main() {
    Solution sol;
    cout << sol.totalNQueens(4) << endl; // 2
    return 0;
}`,
};

export default problem;
