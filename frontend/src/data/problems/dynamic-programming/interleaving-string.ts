import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'interleaving-string',
  title: 'Interleaving String',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/interleaving-string/',
  description: 'Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an **interleaving** of `s1` and `s2`.\\n\\nAn **interleaving** of two strings `s` and `t` is a configuration where they are divided into **non-empty** substrings such that:\\n- `s = s1 + s2 + ... + sn`\\n- `t = t1 + t2 + ... + tm`\\n- `|n - m| <= 1`\\n- The **interleaving** is `s1 + t1 + s2 + t2 + ...` or `t1 + s1 + t2 + s2 + ...`\\n\\nNote: `a + b` is the concatenation of strings `a` and `b`.',
  examples: [
    {
      input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"',
      output: 'true'
    },
    {
      input: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"',
      output: 'false'
    },
    {
      input: 's1 = "", s2 = "", s3 = ""',
      output: 'true'
    }
  ],
  constraints: [
    '0 <= s1.length, s2.length <= 100',
    '0 <= s3.length <= 200',
    's1, s2, and s3 consist of lowercase English letters.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool isInterleave(string s1, string s2, string s3){
        int m=s1.size(),n=s2.size();
        if(m+n!=(int)s3.size()) return false;
        vector<vector<bool>> dp(m+1,vector<bool>(n+1,false));
        dp[0][0]=true;
        for(int i=1;i<=m;i++) dp[i][0]=dp[i-1][0]&&s1[i-1]==s3[i-1];
        for(int j=1;j<=n;j++) dp[0][j]=dp[0][j-1]&&s2[j-1]==s3[j-1];
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)
            dp[i][j]=(dp[i-1][j]&&s1[i-1]==s3[i+j-1])||(dp[i][j-1]&&s2[j-1]==s3[i+j-1]);
        return dp[m][n];
    }
};
int main(){
    Solution sol;
    cout<<boolalpha<<sol.isInterleave("aabcc","dbbca","aadbbcbcac")<<endl; // true
    return 0;
}`,
};
export default problem;
