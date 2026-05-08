import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'binary-search',
  title: 'Binary Search',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/binary-search/',
  description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
  examples: [
    {
      input: 'nums = [-1,0,3,5,9,12], target = 9',
      output: '4',
      explanation: '9 exists in nums and its index is 4'
    },
    {
      input: 'nums = [-1,0,3,5,9,12], target = 2',
      output: '-1',
      explanation: '2 does not exist in nums so return -1'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '-10^4 < nums[i], target < 10^4',
    'All the integers in nums are unique.',
    'nums is sorted in ascending order.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = (int)nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << sol.search(nums, 9) << endl;  // 4
    cout << sol.search(nums, 2) << endl;  // -1
    return 0;
}`,
};

export default problem;
