import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'two-sum-ii-input-array-is-sorted',
  title: 'Two Sum II - Input Array Is Sorted',
  difficulty: 'Medium',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
  description: 'Given a **1-indexed** array of integers `numbers` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific `target` number. Let these two numbers be `numbers[index1]` and `numbers[index2]` where `1 <= index1 < index2 <= numbers.length`.\n\nReturn the indices of the two numbers, `index1` and `index2`, **added by one** as an integer array `[index1, index2]` of length 2.\n\nThe tests are generated such that there is **exactly one solution**. You **may not** use the same element twice.\n\nYour solution must use only constant extra space.',
  examples: [
    {
      input: 'numbers = [2,7,11,15], target = 9',
      output: '[1,2]',
      explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
    },
    {
      input: 'numbers = [2,3,4], target = 6',
      output: '[1,3]',
      explanation: 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].'
    },
    {
      input: 'numbers = [-1,0], target = -1',
      output: '[1,2]',
      explanation: 'The sum of -1 and 0 is -1. Therefore index1 = 1, index2 = 2. We return [1, 2].'
    }
  ],
  constraints: [
    '2 <= numbers.length <= 3 * 10^4',
    '-1000 <= numbers[i] <= 1000',
    'numbers is sorted in non-decreasing order.',
    '-1000 <= target <= 1000',
    'The tests are generated such that there is exactly one solution.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l=0, r=numbers.size()-1;
        while (l<r) {
            int sum=numbers[l]+numbers[r];
            if (sum==target) return {l+1,r+1};
            else if (sum<target) l++;
            else r--;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums={2,7,11,15};
    auto r=sol.twoSum(nums,9);
    cout<<r[0]<<" "<<r[1]<<endl; // 1 2
    return 0;
}`,
};

export default problem;
