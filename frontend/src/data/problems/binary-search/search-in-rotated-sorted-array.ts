import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'search-in-rotated-sorted-array',
  title: 'Search in Rotated Sorted Array',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
  description: 'There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (0-indexed). For example, `[0,1,2,4,5,6,7]` might be rotated at pivot index 3 and become `[4,5,6,7,0,1,2]`.\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
  examples: [
    {
      input: 'nums = [4,5,6,7,0,1,2], target = 0',
      output: '4'
    },
    {
      input: 'nums = [4,5,6,7,0,1,2], target = 3',
      output: '-1'
    },
    {
      input: 'nums = [1], target = 0',
      output: '-1'
    }
  ],
  constraints: [
    '1 <= nums.length <= 5000',
    '-10^4 <= nums[i], target <= 10^4',
    'All values of nums are unique.',
    'nums is an ascending array that is possibly rotated.'
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
            // Left half is sorted
            if (nums[l] <= nums[mid]) {
                if (nums[l] <= target && target < nums[mid]) r = mid - 1;
                else l = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[r]) l = mid + 1;
                else r = mid - 1;
            }
        }
        return -1;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {4,5,6,7,0,1,2};
    cout << sol.search(nums, 0) << endl; // 4
    cout << sol.search(nums, 3) << endl; // -1
    return 0;
}`,
};

export default problem;
