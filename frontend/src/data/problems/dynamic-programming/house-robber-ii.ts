import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'house-robber-ii',
  title: 'House Robber II',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/house-robber-ii/',
  description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are **arranged in a circle.** That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have a security system connected, and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.',
  examples: [
    {
      input: 'nums = [2,3,2]',
      output: '3',
      explanation: 'You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.'
    },
    {
      input: 'nums = [1,2,3,1]',
      output: '4',
      explanation: 'Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.'
    },
    {
      input: 'nums = [1,2,3]',
      output: '3'
    }
  ],
  constraints: [
    '1 <= nums.length <= 100',
    '0 <= nums[i] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    int robRange(vector<int>& nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1; prev1 = curr;
        }
        return prev1;
    }
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        int n = nums.size();
        return max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));
    }
};

int main() {
    Solution sol;
    vector<int> a = {2,3,2};
    vector<int> b = {1,2,3,1};
    cout << sol.rob(a) << endl; // 3
    cout << sol.rob(b) << endl; // 4
    return 0;
}`,
};

export default problem;
