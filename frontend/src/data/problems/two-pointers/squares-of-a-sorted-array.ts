import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'squares-of-a-sorted-array',
  title: 'Squares of a Sorted Array',
  difficulty: 'Easy',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
  description: 'Given an integer array `nums` sorted in **non-decreasing** order, return *an array of **the squares of each number** sorted in non-decreasing order*.',
  examples: [
    {
      input: 'nums = [-4,-1,0,3,10]',
      output: '[0,1,9,16,100]',
      explanation: 'After squaring, the array becomes [16,1,0,9,100]. After sorting, it becomes [0,1,9,16,100].'
    },
    {
      input: 'nums = [-7,-3,2,3,11]',
      output: '[4,9,9,49,121]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '-10^4 <= nums[i] <= 10^4',
    'nums is sorted in non-decreasing order.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> sortedSquares(vector<int>& nums) {
        int n=nums.size(), l=0, r=n-1;
        vector<int> res(n);
        for (int i=n-1; i>=0; i--) {
            if (abs(nums[l])>=abs(nums[r])) { res[i]=nums[l]*nums[l]; l++; }
            else                             { res[i]=nums[r]*nums[r]; r--; }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums={-4,-1,0,3,10};
    for (int v : sol.sortedSquares(nums)) cout<<v<<" "; // 0 1 9 16 100
    cout<<endl;
    return 0;
}`,
};

export default problem;
