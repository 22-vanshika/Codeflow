import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'edit-distance',
  title: 'Edit Distance',
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/edit-distance/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minDistance(string w1, string w2){
        int m=w1.size(), n=w2.size();
        vector<vector<int>> dp(m+1,vector<int>(n+1));
        for(int i=0;i<=m;i++) dp[i][0]=i;
        for(int j=0;j<=n;j++) dp[0][j]=j;
        for(int i=1;i<=m;i++)
            for(int j=1;j<=n;j++){
                if(w1[i-1]==w2[j-1]) dp[i][j]=dp[i-1][j-1];
                else dp[i][j]=1+min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]});
            }
        return dp[m][n];
    }
};
int main(){
    Solution sol;
    cout<<sol.minDistance("horse","ros")<<endl; // 3
    cout<<sol.minDistance("intention","execution")<<endl; // 5
    return 0;
}`,
};
export default problem;
