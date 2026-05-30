import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-target-indices-after-sorting-array',
  title: 'Find Target Indices After Sorting Array',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/find-target-indices-after-sorting-array/',
  description: 'You are given a 0-indexed integer array `nums` and a target element `target`. Find all target indices in `nums` after sorting `nums` in non-decreasing order.',
  examples: [
    {
      input: 'nums = [1,2,5,2,3], target = 2',
      output: '[1,2]',
      explanation: 'After sorting, nums is [1,2,2,3,5]. The indices where nums[i] == 2 are 1 and 2.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 100',
    '1 <= nums[i], target <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> targetIndices(vector<int>& nums, int target) {
        sort(nums.begin(), nums.end());
        vector<int> res;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] == target) {
                res.push_back(i);
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 2, 5, 2, 3};
    vector<int> res = sol.targetIndices(nums, 2);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
