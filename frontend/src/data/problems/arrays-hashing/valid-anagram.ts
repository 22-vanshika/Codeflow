import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/valid-anagram/',
  description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
  examples: [
    {
      input: 's = "anagram", t = "nagaram"',
      output: 'true'
    },
    {
      input: 's = "rat", t = "car"',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= s.length, t.length <= 5 * 10^4',
    's and t consist of lowercase English letters.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        int freq[26] = {};
        for (char c : s) freq[c - 'a']++;
        for (char c : t) {
            freq[c - 'a']--;
            if (freq[c - 'a'] < 0) return false;
        }
        return true;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    cout << sol.isAnagram("anagram", "nagaram") << endl; // true
    cout << sol.isAnagram("rat", "car") << endl;         // false
    return 0;
}`,
};

export default problem;
