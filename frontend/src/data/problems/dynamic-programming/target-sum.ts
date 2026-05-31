import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'target-sum',
  title: 'Target Sum',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/target-sum/',
  description: 'You are given an integer array `nums` and an integer `target`.\\n\\nYou want to build an expression out of nums by adding one of the symbols `\'+\'` and `\'-\'` before each integer in nums and then concatenate all the integers.\\n\\nFor example, if `nums = [2, 1]`, you can add a `\'+\'` before `2` and a `\'-\'` before `1` and concatenate them to build the expression `"+2-1"`.\\n\\nReturn the number of different **expressions** that you can build, which evaluates to `target`.',
  examples: [
    {
      input: 'nums = [1,1,1,1,1], target = 3',
      output: '5'
    },
    {
      input: 'nums = [1], target = 1',
      output: '1'
    }
  ],
  constraints: [
    '1 <= nums.length <= 20',
    '0 <= nums[i] <= 1000',
    '0 <= sum(nums[i]) <= 1000',
    '-1000 <= target <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findTargetSumWays(vector<int>& nums, int target){
        unordered_map<int,int> dp; dp[0]=1;
        for(int n:nums){
            unordered_map<int,int> next;
            for(auto&[sum,cnt]:dp){next[sum+n]+=cnt;next[sum-n]+=cnt;}
            dp=next;
        }
        return dp.count(target)?dp[target]:0;
    }
};
int main(){
    Solution sol;
    vector<int> nums={1,1,1,1,1};
    cout<<sol.findTargetSumWays(nums,3)<<endl; // 5
    return 0;
}`,
};
export default problem;
