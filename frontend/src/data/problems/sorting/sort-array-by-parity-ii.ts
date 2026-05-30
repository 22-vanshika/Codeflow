import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sort-array-by-parity-ii',
  title: 'Sort Array By Parity II',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/sort-array-by-parity-ii/',
  description: 'Given an array of integers `nums`, half of the integers in `nums` are odd, and half are even. Sort the array so that whenever `nums[i]` is odd, `i` is odd, and whenever `nums[i]` is even, `i` is even.',
  examples: [
    {
      input: 'nums = [4,2,5,7]',
      output: '[4,5,2,7]',
      explanation: '[4,7,2,5], [2,5,4,7], [2,7,4,5] would also have been accepted.'
    }
  ],
  constraints: [
    '2 <= nums.length <= 2 * 10^4',
    'nums.length is even.',
    'Half of the integers in nums are even.',
    '0 <= nums[i] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> sortArrayByParityII(vector<int>& nums) {
        int n = nums.size();
        int j = 1;
        for (int i = 0; i < n; i += 2) {
            if (nums[i] % 2 == 1) {
                while (nums[j] % 2 == 1) {
                    j += 2;
                }
                swap(nums[i], nums[j]);
            }
        }
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {4, 2, 5, 7};
    vector<int> res = sol.sortArrayByParityII(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
