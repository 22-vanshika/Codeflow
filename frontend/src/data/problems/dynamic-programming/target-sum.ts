import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'target-sum',
  title: 'Target Sum',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/target-sum/',
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
