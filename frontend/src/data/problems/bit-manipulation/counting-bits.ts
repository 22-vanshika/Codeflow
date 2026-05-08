import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'counting-bits',
  title: 'Counting Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/counting-bits/',
  description: 'Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the **number of 1\'s** in the binary representation of `i`.',
  examples: [
    {
      input: 'n = 2',
      output: '[0,1,1]',
      explanation: '0 --> 0\n1 --> 1\n2 --> 10'
    },
    {
      input: 'n = 5',
      output: '[0,1,1,2,1,2]',
      explanation: '0 --> 0\n1 --> 1\n2 --> 10\n3 --> 11\n4 --> 100\n5 --> 101'
    }
  ],
  constraints: [
    '0 <= n <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n){
        vector<int> dp(n+1,0);
        for(int i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);
        return dp;
    }
};

int main(){
    Solution sol;
    for(int v:sol.countBits(5)) cout<<v<<" "; // 0 1 1 2 1 2
    cout<<endl;
    return 0;
}`,
};

export default problem;
