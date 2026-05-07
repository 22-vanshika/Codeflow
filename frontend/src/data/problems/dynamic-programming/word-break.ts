import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'word-break',
  title: 'Word Break',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/word-break/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> wordSet(wordDict.begin(), wordDict.end());
        int n = s.size();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        for (int i = 1; i <= n; i++)
            for (int j = 0; j < i; j++)
                if (dp[j] && wordSet.count(s.substr(j, i - j))) {
                    dp[i] = true; break;
                }
        return dp[n];
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<string> dict1 = {"leet","code"};
    cout << sol.wordBreak("leetcode", dict1) << endl; // true
    vector<string> dict2 = {"apple","pen"};
    cout << sol.wordBreak("applepenapple", dict2) << endl; // true
    return 0;
}`,
};

export default problem;
