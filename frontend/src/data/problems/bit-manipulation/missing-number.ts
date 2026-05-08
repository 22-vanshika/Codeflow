import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'missing-number',
  title: 'Missing Number',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/missing-number/',
  description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
  examples: [
    {
      input: 'nums = [3,0,1]',
      output: '2',
      explanation: 'n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.'
    },
    {
      input: 'nums = [0,1]',
      output: '2',
      explanation: 'n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.'
    },
    {
      input: 'nums = [9,6,4,2,3,5,7,0,1]',
      output: '8',
      explanation: 'n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 8 is the missing number in the range since it does not appear in nums.'
    }
  ],
  constraints: [
    'n == nums.length',
    '1 <= n <= 10^4',
    '0 <= nums[i] <= n',
    'All the numbers of nums are unique.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int missingNumber(vector<int>& nums){
        int n=nums.size(), res=n;
        for(int i=0;i<n;i++) res^=i^nums[i];
        return res;
    }
};

int main(){
    Solution sol;
    vector<int> a={3,0,1};
    vector<int> b={9,6,4,2,3,5,7,0,1};
    cout<<sol.missingNumber(a)<<endl; // 2
    cout<<sol.missingNumber(b)<<endl; // 8
    return 0;
}`,
};

export default problem;
