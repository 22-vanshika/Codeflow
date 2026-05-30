import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-first-and-last-position-of-element-in-sorted-array',
  title: 'Find First and Last Position of Element in Sorted Array',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
  description: 'Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If target is not found in the array, return `[-1, -1]`.',
  examples: [
    {
      input: 'nums = [5,7,7,8,8,10], target = 8',
      output: '[3,4]'
    }
  ],
  constraints: [
    '0 <= nums.length <= 10^5',
    '-10^9 <= nums[i], target <= 10^9',
    'nums is a non-decreasing array.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
private:
    int findBound(vector<int>& nums, int target, bool isFirst) {
        int low = 0, high = nums.size() - 1;
        int ans = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                ans = mid;
                if (isFirst) high = mid - 1;
                else low = mid + 1;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return ans;
    }
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int first = findBound(nums, target, true);
        int last = findBound(nums, target, false);
        return {first, last};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {5, 7, 7, 8, 8, 10};
    vector<int> res = sol.searchRange(nums, 8);
    cout << res[0] << " " << res[1] << endl; // 3 4
    return 0;
}`,
};

export default problem;
