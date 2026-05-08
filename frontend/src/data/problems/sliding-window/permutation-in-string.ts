import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'permutation-in-string',
  title: 'Permutation in String',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/permutation-in-string/',
  description: 'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.\n\nIn other words, return `true` if one of `s1`\'s permutations is the substring of `s2`.',
  examples: [
    {
      input: 's1 = "ab", s2 = "eidbaooo"',
      output: 'true',
      explanation: 's2 contains one permutation of s1 ("ba").'
    },
    {
      input: 's1 = "ab", s2 = "eidboaoo"',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= s1.length, s2.length <= 10^4',
    's1 and s2 consist of lowercase English letters.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.size() > s2.size()) return false;
        vector<int> freq1(26, 0), freq2(26, 0);
        for (char c : s1) freq1[c - 'a']++;
        for (int i = 0; i < (int)s1.size(); i++) freq2[s2[i] - 'a']++;

        for (int i = (int)s1.size(); i < (int)s2.size(); i++) {
            if (freq1 == freq2) return true;
            freq2[s2[i] - 'a']++;
            freq2[s2[i - s1.size()] - 'a']--;
        }
        return freq1 == freq2;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    cout << sol.checkInclusion("ab", "eidbaooo") << endl; // true
    cout << sol.checkInclusion("ab", "eidboaoo") << endl; // false
    return 0;
}`,
};

export default problem;
