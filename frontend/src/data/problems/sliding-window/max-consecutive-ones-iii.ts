import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'max-consecutive-ones-iii',
  title: 'Max Consecutive Ones III',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
  description: 'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`\'s in the array if you can flip at most `k` `0`\'s.',
  examples: [
    {
      input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2',
      output: '6',
      explanation: '[1,1,1,0,0,1,1,1,1,1,1]\nBolded numbers were flipped from 0 to 1. The longest subarray is underlined.'
    },
    {
      input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3',
      output: '10'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    'nums[i] is either 0 or 1.',
    '0 <= k <= nums.length'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int l=0, zeros=0, res=0;
        for (int r=0;r<(int)nums.size();r++) {
            if (nums[r]==0) zeros++;
            while (zeros>k) if (nums[l++]==0) zeros--;
            res=max(res,r-l+1);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums={1,1,1,0,0,0,1,1,1,1,0};
    cout<<sol.longestOnes(nums,2)<<endl; // 6
    return 0;
}`,
};

export default problem;
