import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'rotate-array',
  title: 'Rotate Array',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/rotate-array/',
  description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.',
  examples: [
    {
      input: 'nums = [1,2,3,4,5,6,7], k = 3',
      output: '[5,6,7,1,2,3,4]',
      explanation: 'rotate 1 steps to the right: [7,1,2,3,4,5,6]\nrotate 2 steps to the right: [6,7,1,2,3,4,5]\nrotate 3 steps to the right: [5,6,7,1,2,3,4]'
    },
    {
      input: 'nums = [-1,-100,3,99], k = 2',
      output: '[3,99,-1,-100]',
      explanation: 'rotate 1 steps to the right: [99,-1,-100,3]\nrotate 2 steps to the right: [3,99,-1,-100]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    '-2^31 <= nums[i] <= 2^31 - 1',
    '0 <= k <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1,2,3,4,5,6,7};
    sol.rotate(nums, 3);
    for (int n : nums) cout << n << " "; // 5 6 7 1 2 3 4
    cout << endl;
    return 0;
}`,
};

export default problem;
