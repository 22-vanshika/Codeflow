import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'decode-ways',
  title: 'Decode Ways',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/decode-ways/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int numDecodings(string s) {
        int n = s.size();
        vector<int> dp(n + 1, 0);
        dp[0] = 1;
        dp[1] = s[0] != '0' ? 1 : 0;
        for (int i = 2; i <= n; i++) {
            if (s[i-1] != '0') dp[i] += dp[i-1];
            int two = stoi(s.substr(i-2, 2));
            if (two >= 10 && two <= 26) dp[i] += dp[i-2];
        }
        return dp[n];
    }
};

int main() {
    Solution sol;
    cout << sol.numDecodings("12")  << endl; // 2
    cout << sol.numDecodings("226") << endl; // 3
    cout << sol.numDecodings("06")  << endl; // 0
    return 0;
}`,
};

export default problem;
