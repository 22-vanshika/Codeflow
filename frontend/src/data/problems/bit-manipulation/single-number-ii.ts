import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'single-number-ii',
  title: 'Single Number II',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/single-number-ii/',
  description: 'Given an integer array `nums` where every element appears **three times** except for one, which appears **exactly once**. Find the single element and return it.\n\nYou must implement a solution with a linear runtime complexity and use only constant extra space.',
  examples: [
    {
      input: 'nums = [2,2,3,2]',
      output: '3'
    },
    {
      input: 'nums = [0,1,0,1,0,1,99]',
      output: '99'
    }
  ],
  constraints: [
    '1 <= nums.length <= 3 * 10^4',
    '-2^31 <= nums[i] <= 2^31 - 1',
    'Each element in nums appears exactly three times except for one element which appears once.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums){
        int ones=0, twos=0;
        for(int n:nums){
            ones=(ones^n)&~twos;
            twos=(twos^n)&~ones;
        }
        return ones;
    }
};

int main(){
    Solution sol;
    vector<int> a={2,2,3,2};
    vector<int> b={0,1,0,1,0,1,99};
    cout<<sol.singleNumber(a)<<endl; // 3
    cout<<sol.singleNumber(b)<<endl; // 99
    return 0;
}`,
};

export default problem;
