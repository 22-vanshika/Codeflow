import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sort-array-by-parity',
  title: 'Sort Array By Parity',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/sort-array-by-parity/',
  description: 'Given an integer array `nums`, move all the even integers at the beginning of the array followed by all the odd integers. Return any array that satisfies this condition.',
  examples: [
    {
      input: 'nums = [3,1,2,4]',
      output: '[2,4,3,1]',
      explanation: 'Outputs like [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 5000',
    '0 <= nums[i] <= 5000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> sortArrayByParity(vector<int>& nums) {
        int i = 0, j = nums.size() - 1;
        while (i < j) {
            if (nums[i] % 2 > nums[j] % 2) {
                swap(nums[i], nums[j]);
            }
            if (nums[i] % 2 == 0) i++;
            if (nums[j] % 2 == 1) j--;
        }
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {3, 1, 2, 4};
    vector<int> res = sol.sortArrayByParity(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
