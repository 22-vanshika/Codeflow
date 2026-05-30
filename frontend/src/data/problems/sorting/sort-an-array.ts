import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sort-an-array',
  title: 'Sort an Array',
  difficulty: 'Medium',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/sort-an-array/',
  description: 'Given an array of integers `nums`, sort the array in ascending order and return it.',
  examples: [
    {
      input: 'nums = [5, 1, 1, 2, 0, 0]',
      output: '[0, 0, 1, 1, 2, 5]',
      explanation: 'The sorted array is [0, 0, 1, 1, 2, 5].'
    }
  ],
  constraints: [
    '1 <= nums.length <= 5 * 10^4',
    '-5 * 10^4 <= nums[i] <= 5 * 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> sortArray(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {5, 1, 1, 2, 0, 0};
    vector<int> res = sol.sortArray(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
