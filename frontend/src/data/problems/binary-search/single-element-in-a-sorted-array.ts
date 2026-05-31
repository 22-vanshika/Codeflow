import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'single-element-in-a-sorted-array',
  title: 'Single Element in a Sorted Array',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/single-element-in-a-sorted-array/',
  description: 'You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Find this single element that appears only once.',
  examples: [
    {
      input: 'nums = [1,1,2,3,3,4,4,8,8]',
      output: '2'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    '0 <= nums[i] <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int singleNonDuplicate(vector<int>& nums) {
        int low = 0, high = nums.size() - 1;
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (mid % 2 == 1) mid--;
            if (nums[mid] == nums[mid + 1]) {
                low = mid + 2;
            } else {
                high = mid;
            }
        }
        return nums[low];
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 1, 2, 3, 3, 4, 4, 8, 8};
    cout << sol.singleNonDuplicate(nums) << endl; // 2
    return 0;
}`,
};

export default problem;
