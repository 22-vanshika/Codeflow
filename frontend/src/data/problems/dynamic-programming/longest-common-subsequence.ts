import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/longest-common-subsequence/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestCommonSubsequence(string t1, string t2){
        int m=t1.size(), n=t2.size();
        vector<vector<int>> dp(m+1,vector<int>(n+1,0));
        for(int i=1;i<=m;i++)
            for(int j=1;j<=n;j++){
                if(t1[i-1]==t2[j-1]) dp[i][j]=dp[i-1][j-1]+1;
                else dp[i][j]=max(dp[i-1][j],dp[i][j-1]);
            }
        return dp[m][n];
    }
};
int main(){
    Solution sol;
    cout<<sol.longestCommonSubsequence("abcde","ace")<<endl; // 3
    cout<<sol.longestCommonSubsequence("abc","abc")<<endl;   // 3
    return 0;
}`,
};
export default problem;
