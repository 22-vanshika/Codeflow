import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'longest-common-subsequence',
  title: 'Longest Common Subsequence',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/longest-common-subsequence/',
  description: 'Given two strings `text1` and `text2`, return the length of their **longest common subsequence**. If there is no common subsequence, return `0`.\n\nA **subsequence** of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.\n- For example, `"ace"` is a subsequence of `"abcde"`.\n\nA **common subsequence** of two strings is a subsequence that is common to both strings.',
  examples: [
    {
      input: 'text1 = "abcde", text2 = "ace"',
      output: '3',
      explanation: 'The longest common subsequence is "ace" and its length is 3.'
    },
    {
      input: 'text1 = "abc", text2 = "abc"',
      output: '3',
      explanation: 'The longest common subsequence is "abc" and its length is 3.'
    },
    {
      input: 'text1 = "abc", text2 = "def"',
      output: '0',
      explanation: 'There is no such common subsequence, so the result is 0.'
    }
  ],
  constraints: [
    '1 <= text1.length, text2.length <= 1000',
    'text1 and text2 consist of only lowercase English characters.'
  ],
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
