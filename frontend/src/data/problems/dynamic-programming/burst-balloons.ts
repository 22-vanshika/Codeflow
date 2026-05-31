import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'burst-balloons',
  title: 'Burst Balloons',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/burst-balloons/',
  description: 'You are given `n` balloons, indexed from `0` to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. You are asked to burst all the balloons.\\n\\nIf you burst the `i`th balloon, you will get `nums[i - 1] * nums[i] * nums[i + 1]` coins. After the burst, the `i - 1`th and `i + 1`th balloons become adjacent.\\n\\nReturn the maximum coins you can collect by bursting the balloons wisely.',
  examples: [
    {
      input: 'nums = [3,1,5,8]',
      output: '167',
      explanation: 'nums = [3,1,5,8] --> [3,5,8] --> [3,8] --> [8] --> []\\ncoins =  3*1*5    +  3*5*8    +  1*3*8    + 1*8*1   = 167'
    },
    {
      input: 'nums = [1,5]',
      output: '10'
    }
  ],
  constraints: [
    'n == nums.length',
    '1 <= n <= 300',
    '0 <= nums[i] <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxCoins(vector<int>& nums) {
        int n = nums.size();
        vector<int> b(n + 2, 1);
        for (int i = 0; i < n; i++) b[i + 1] = nums[i];
        
        vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));
        for (int len = 1; len <= n; len++) {
            for (int i = 1; i <= n - len + 1; i++) {
                int j = i + len - 1;
                for (int k = i; k <= j; k++) {
                    dp[i][j] = max(dp[i][j], dp[i][k-1] + dp[k+1][j] + b[i-1]*b[k]*b[j+1]);
                }
            }
        }
        return dp[1][n];
    }
};

int main() {
    Solution sol;
    vector<int> n = {3,1,5,8};
    cout << sol.maxCoins(n) << endl; // 167
    return 0;
}`,
};

export default problem;
