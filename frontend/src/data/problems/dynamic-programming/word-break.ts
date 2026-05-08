import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'word-break',
  title: 'Word Break',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/word-break/',
  description: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.\n\n**Note** that the same word in the dictionary may be reused multiple times in the segmentation.',
  examples: [
    {
      input: 's = "leetcode", wordDict = ["leet","code"]',
      output: 'true',
      explanation: 'Return true because "leetcode" can be segmented as "leet code".'
    },
    {
      input: 's = "applepenapple", wordDict = ["apple","pen"]',
      output: 'true',
      explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple". Note that you are allowed to reuse a dictionary word.'
    },
    {
      input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= s.length <= 300',
    '1 <= wordDict.length <= 1000',
    '1 <= wordDict[i].length <= 20',
    's and wordDict[i] consist of only lowercase English letters.',
    'All the strings of wordDict are unique.'
  ],
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
