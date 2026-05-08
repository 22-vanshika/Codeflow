import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'house-robber',
  title: 'House Robber',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/house-robber/',
  description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.',
  examples: [
    {
      input: 'nums = [1,2,3,1]',
      output: '4',
      explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.'
    },
    {
      input: 'nums = [2,7,9,3,1]',
      output: '12',
      explanation: 'Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 100',
    '0 <= nums[i] <= 400'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        for (int n : nums) {
            int curr = max(prev1, prev2 + n);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};

int main() {
    Solution sol;
    vector<int> a = {1,2,3,1};
    vector<int> b = {2,7,9,3,1};
    cout << sol.rob(a) << endl; // 4
    cout << sol.rob(b) << endl; // 12
    return 0;
}`,
};

export default problem;
