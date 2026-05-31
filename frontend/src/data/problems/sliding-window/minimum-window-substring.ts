import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'minimum-window-substring',
  title: 'Minimum Window Substring',
  difficulty: 'Hard',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/minimum-window-substring/',
  description: 'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.\n\nThe testcases will be generated such that the answer is unique.',
  examples: [
    {
      input: 's = "ADOBECODEBANC", t = "ABC"',
      output: '"BANC"',
      explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.'
    },
    {
      input: 's = "a", t = "a"',
      output: '"a"',
      explanation: 'The entire string s is the minimum window.'
    },
    {
      input: 's = "a", t = "aa"',
      output: '""',
      explanation: 'Both \'a\'s from t must be included in the window. Since the largest window of s only has one \'a\', return empty string.'
    }
  ],
  constraints: [
    'm == s.length',
    'n == t.length',
    '1 <= m, n <= 10^5',
    's and t consist of uppercase and lowercase English letters.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string minWindow(string s, string t) {
        unordered_map<char, int> need, window;
        for (char c : t) need[c]++;

        int have = 0, required = need.size();
        int l = 0, minLen = INT_MAX, start = 0;

        for (int r = 0; r < (int)s.size(); r++) {
            window[s[r]]++;
            if (need.count(s[r]) && window[s[r]] == need[s[r]])
                have++;

            while (have == required) {
                if (r - l + 1 < minLen) {
                    minLen = r - l + 1;
                    start = l;
                }
                window[s[l]]--;
                if (need.count(s[l]) && window[s[l]] < need[s[l]])
                    have--;
                l++;
            }
        }
        return minLen == INT_MAX ? "" : s.substr(start, minLen);
    }
};

int main() {
    Solution sol;
    cout << sol.minWindow("ADOBECODEBANC", "ABC") << endl; // "BANC"
    cout << sol.minWindow("a", "a")               << endl; // "a"
    return 0;
}`,
};

export default problem;
