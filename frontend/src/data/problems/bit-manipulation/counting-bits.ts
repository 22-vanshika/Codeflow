import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'counting-bits',
  title: 'Counting Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/counting-bits/',
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
