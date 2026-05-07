import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'coin-change',
  title: 'Coin Change',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/coin-change/',
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
