import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'coin-change',
  title: 'Coin Change',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/coin-change/',
  description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
  examples: [
    {
      input: 'coins = [1,2,5], amount = 11',
      output: '3',
      explanation: '11 = 5 + 5 + 1'
    },
    {
      input: 'coins = [2], amount = 3',
      output: '-1'
    },
    {
      input: 'coins = [1], amount = 0',
      output: '0'
    }
  ],
  constraints: [
    '1 <= coins.length <= 12',
    '1 <= coins[i] <= 2^31 - 1',
    '0 <= amount <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++)
            for (int c : coins)
                if (c <= i) dp[i] = min(dp[i], dp[i - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
};

int main() {
    Solution sol;
    vector<int> coins1 = {1,5,6,9};
    cout << sol.coinChange(coins1, 11) << endl; // 2  (5+6)
    vector<int> coins2 = {2};
    cout << sol.coinChange(coins2, 3) << endl;  // -1
    return 0;
}`,
};

export default problem;
