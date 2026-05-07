import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'unique-paths',
  title: 'Unique Paths',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/unique-paths/',
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
