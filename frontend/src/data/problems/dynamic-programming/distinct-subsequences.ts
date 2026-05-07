import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'distinct-subsequences',
  title: 'Distinct Subsequences',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/distinct-subsequences/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int numDistinct(string s, string t){
        int m=s.size(),n=t.size();
        vector<vector<long long>> dp(m+1,vector<long long>(n+1,0));
        for(int i=0;i<=m;i++) dp[i][0]=1;
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
            dp[i][j]=dp[i-1][j];
            if(s[i-1]==t[j-1]) dp[i][j]+=dp[i-1][j-1];
        }
        return (int)dp[m][n];
    }
};
int main(){
    Solution sol;
    cout<<sol.numDistinct("rabbbit","rabbit")<<endl; // 3
    return 0;
}`,
};
export default problem;
