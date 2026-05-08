import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sort-colors',
  title: 'Sort Colors',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/sort-colors/',
  description: 'Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library\'s sort function.',
  examples: [
    {
      input: 'nums = [2,0,2,1,1,0]',
      output: '[0,0,1,1,2,2]'
    },
    {
      input: 'nums = [2,0,1]',
      output: '[0,1,2]'
    }
  ],
  constraints: [
    'n == nums.length',
    '1 <= n <= 300',
    'nums[i] is either 0, 1, or 2.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void sortColors(vector<int>& nums) {
        int lo=0, mid=0, hi=nums.size()-1;
        while (mid<=hi) {
            if      (nums[mid]==0) swap(nums[lo++], nums[mid++]);
            else if (nums[mid]==1) mid++;
            else                   swap(nums[mid], nums[hi--]);
        }
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2,0,2,1,1,0};
    sol.sortColors(nums);
    for (int n : nums) cout << n << " "; // 0 0 1 1 2 2
    cout << endl;
    return 0;
}`,
};

export default problem;
