import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'longest-repeating-character-replacement',
  title: 'Longest Repeating Character Replacement',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
  description: 'You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times.\n\nReturn the length of the longest substring containing the same letter you can get after performing the above operations.',
  examples: [
    {
      input: 's = "ABAB", k = 2',
      output: '4',
      explanation: 'Replace the two \'A\'s with two \'B\'s or vice versa.'
    },
    {
      input: 's = "AABABBA", k = 1',
      output: '4',
      explanation: 'Replace the one \'A\' in the middle with \'B\' and form "AABBBBA". The substring "BBBB" has the longest repeating character, which is 4.'
    }
  ],
  constraints: [
    '1 <= s.length <= 10^5',
    's consists of only uppercase English letters.',
    '0 <= k <= s.length'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int characterReplacement(string s, int k) {
        int freq[26]={}, maxFreq=0, l=0, res=0;
        for (int r=0; r<(int)s.size(); r++) {
            maxFreq=max(maxFreq, ++freq[s[r]-'A']);
            while (r-l+1-maxFreq>k) freq[s[l++]-'A']--;
            res=max(res, r-l+1);
        }
        return res;
    }
};

int main() {
    Solution sol;
    cout<<sol.characterReplacement("ABAB",2)<<endl; // 4
    cout<<sol.characterReplacement("AABABBA",1)<<endl; // 4
    return 0;
}`,
};

export default problem;
