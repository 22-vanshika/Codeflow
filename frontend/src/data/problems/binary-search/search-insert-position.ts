import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'search-insert-position',
  title: 'Search Insert Position',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/search-insert-position/',
  description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
  examples: [
    {
      input: 'nums = [1,3,5,6], target = 5',
      output: '2'
    },
    {
      input: 'nums = [1,3,5,6], target = 2',
      output: '1'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '-10^4 <= nums[i], target <= 10^4',
    'nums contains distinct values sorted in ascending order.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int low = 0, high = nums.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return low;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 3, 5, 6};
    cout << sol.searchInsert(nums, 5) << endl; // 2
    cout << sol.searchInsert(nums, 2) << endl; // 1
    return 0;
}`,
};

export default problem;
