import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-minimum-in-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  description: 'Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times. For example, the array `nums = [0,1,2,4,5,6,7]` might become:\n- `[4,5,6,7,0,1,2]` if it was rotated 4 times.\n- `[0,1,2,4,5,6,7]` if it was rotated 7 times.\n\nNotice that **rotating** an array `[a[0], a[1], a[2], ..., a[n-1]]` 1 time results in the array `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`.\n\nGiven the sorted rotated array `nums` of **unique** elements, return *the minimum element of this array*.\n\nYou must write an algorithm that runs in `O(log n)` time.',
  examples: [
    {
      input: 'nums = [3,4,5,1,2]',
      output: '1',
      explanation: 'The original array was [1,2,3,4,5] rotated 3 times.'
    },
    {
      input: 'nums = [4,5,6,7,0,1,2]',
      output: '0',
      explanation: 'The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.'
    },
    {
      input: 'nums = [11,13,15,17]',
      output: '11',
      explanation: 'The original array was [11,13,15,17] and it was rotated 4 times. '
    }
  ],
  constraints: [
    'n == nums.length',
    '1 <= n <= 5000',
    '-5000 <= nums[i] <= 5000',
    'All the integers of nums are unique.',
    'nums is sorted and rotated between 1 and n times.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = (int)nums.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
};

int main() {
    Solution sol;
    vector<int> nums1 = {3,4,5,1,2};
    vector<int> nums2 = {4,5,6,7,0,1,2};
    cout << sol.findMin(nums1) << endl; // 1
    cout << sol.findMin(nums2) << endl; // 0
    return 0;
}`,
};

export default problem;
