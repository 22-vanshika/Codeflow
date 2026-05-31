import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-peak-element',
  title: 'Find Peak Element',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/find-peak-element/',
  description: 'A peak element is an element that is strictly greater than its neighbors.\n\nGiven a **0-indexed** integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to **any of the peaks**.\n\nYou may imagine that `nums[-1] = nums[n] = -∞`. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.\n\nYou must write an algorithm that runs in `O(log n)` time.',
  examples: [
    {
      input: 'nums = [1,2,3,1]',
      output: '2',
      explanation: '3 is a peak element and your function should return the index number 2.'
    },
    {
      input: 'nums = [1,2,1,3,5,6,4]',
      output: '5',
      explanation: 'Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 1000',
    '-2^31 <= nums[i] <= 2^31 - 1',
    'nums[i] != nums[i + 1] for all valid i.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int l=0, r=nums.size()-1;
        while (l<r) {
            int mid=l+(r-l)/2;
            if (nums[mid]<nums[mid+1]) l=mid+1;
            else r=mid;
        }
        return l;
    }
};

int main() {
    Solution sol;
    vector<int> a={1,2,3,1};
    vector<int> b={1,2,1,3,5,6,4};
    cout<<sol.findPeakElement(a)<<endl; // 2
    cout<<sol.findPeakElement(b)<<endl; // 5
    return 0;
}`,
};

export default problem;
