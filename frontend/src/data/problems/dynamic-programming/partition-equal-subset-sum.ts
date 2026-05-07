import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'partition-equal-subset-sum',
  title: 'Partition Equal Subset Sum',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canPartition(vector<int>& nums){
        int sum=accumulate(nums.begin(),nums.end(),0);
        if(sum%2) return false;
        int target=sum/2;
        vector<bool> dp(target+1,false); dp[0]=true;
        for(int n:nums)
            for(int j=target;j>=n;j--)
                dp[j]=dp[j]||dp[j-n];
        return dp[target];
    }
};
int main(){
    Solution sol;
    vector<int> a={1,5,11,5};
    cout<<boolalpha<<sol.canPartition(a)<<endl; // true
    return 0;
}`,
};
export default problem;
