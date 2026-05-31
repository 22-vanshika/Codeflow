import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'arranging-coins',
  title: 'Arranging Coins',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/arranging-coins/',
  description: 'You have `n` coins and you want to build a staircase with these coins. The staircase consists of `k` rows where the `i`-th row has exactly `i` coins. The last row of the staircase may be incomplete. Given the integer `n`, return the number of complete rows of the staircase you will build.',
  examples: [
    {
      input: 'n = 5',
      output: '2',
      explanation: 'Because the 3rd row is incomplete, we return 2.'
    }
  ],
  constraints: [
    '1 <= n <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int arrangeCoins(int n) {
        long long low = 0, high = n;
        while (low <= high) {
            long long mid = low + (high - low) / 2;
            long long curr = mid * (mid + 1) / 2;
            if (curr == n) return mid;
            else if (curr < n) low = mid + 1;
            else high = mid - 1;
        }
        return high;
    }
};

int main() {
    Solution sol;
    cout << sol.arrangeCoins(5) << endl; // 2
    cout << sol.arrangeCoins(8) << endl; // 3
    return 0;
}`,
};

export default problem;
