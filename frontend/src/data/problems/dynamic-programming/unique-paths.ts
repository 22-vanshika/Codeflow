import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'unique-paths',
  title: 'Unique Paths',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/unique-paths/',
  description: 'There is a robot on an `m x n` grid. The robot is initially located at the **top-left corner** (i.e., `grid[0][0]`). The robot tries to move to the **bottom-right corner** (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.\n\nGiven the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.',
  examples: [
    {
      input: 'm = 3, n = 7',
      output: '28'
    },
    {
      input: 'm = 3, n = 2',
      output: '3',
      explanation: 'From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:\n1. Right -> Down -> Down\n2. Down -> Down -> Right\n3. Down -> Right -> Down'
    }
  ],
  constraints: [
    '1 <= m, n <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);
        for (int i = 1; i < m; i++)
            for (int j = 1; j < n; j++)
                dp[j] += dp[j - 1];
        return dp[n - 1];
    }
};

int main() {
    Solution sol;
    cout << sol.uniquePaths(3, 7) << endl; // 28
    cout << sol.uniquePaths(3, 2) << endl; // 3
    return 0;
}`,
};

export default problem;
