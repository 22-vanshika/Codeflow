import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'next-permutation',
  title: 'Next Permutation',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/next-permutation/',
  description: 'A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order. The **next permutation** of an array of integers is the next lexicographically greater permutation of its integer. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).',
  examples: [
    {
      input: 'nums = [1,2,3]',
      output: '[1,3,2]'
    },
    {
      input: 'nums = [3,2,1]',
      output: '[1,2,3]'
    },
    {
      input: 'nums = [1,1,5]',
      output: '[1,5,1]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 100',
    '0 <= nums[i] <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size(), i = n-2;
        while (i >= 0 && nums[i] >= nums[i+1]) i--;
        if (i >= 0) {
            int j = n-1;
            while (nums[j] <= nums[i]) j--;
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin()+i+1, nums.end());
    }
};
int main() {
    Solution sol;
    vector<int> nums = {1,2,3};
    sol.nextPermutation(nums);
    for (int n : nums) cout << n << " "; // 1 3 2
    cout << endl;
    return 0;
}`,
};
export default problem;
