import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'is-subsequence',
  title: 'Is Subsequence',
  difficulty: 'Easy',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/is-subsequence/',
  description: 'Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, or `false` otherwise.\n\nA **subsequence** of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).',
  examples: [
    {
      input: 's = "abc", t = "ahbgdc"',
      output: 'true'
    },
    {
      input: 's = "axc", t = "ahbgdc"',
      output: 'false'
    }
  ],
  constraints: [
    '0 <= s.length <= 100',
    '0 <= t.length <= 10^4',
    's and t consist only of lowercase English letters.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isSubsequence(string s, string t) {
        int i=0;
        for (char c : t) if (i<(int)s.size()&&c==s[i]) i++;
        return i==(int)s.size();
    }
};

int main() {
    Solution sol;
    cout<<boolalpha;
    cout<<sol.isSubsequence("abc","ahbgdc")<<endl; // true
    cout<<sol.isSubsequence("axc","ahbgdc")<<endl; // false
    return 0;
}`,
};

export default problem;
