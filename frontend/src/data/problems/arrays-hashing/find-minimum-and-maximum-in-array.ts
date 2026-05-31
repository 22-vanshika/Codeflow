import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-minimum-and-maximum-in-array',
  title: 'Find Minimum and Maximum in Array',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://www.geeksforgeeks.org/maximum-and-minimum-in-an-array/',
  description: 'Given an array of integers, write a function to find the minimum and maximum elements in the array.',
  examples: [
    {
      input: 'nums = [3, 2, 1, 56, 10000, 167]',
      output: '[1, 10000]',
      explanation: 'The minimum is 1 and the maximum is 10000.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    '1 <= nums[i] <= 10^12'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> findMinMax(vector<int>& nums) {
        if (nums.empty()) return {-1, -1};
        int minVal = nums[0];
        int maxVal = nums[0];
        for (int x : nums) {
            if (x < minVal) minVal = x;
            if (x > maxVal) maxVal = x;
        }
        return {minVal, maxVal};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {3, 2, 1, 56, 10000, 167};
    vector<int> res = sol.findMinMax(nums);
    cout << res[0] << " " << res[1] << endl; // 1 10000
    return 0;
}`,
};

export default problem;
