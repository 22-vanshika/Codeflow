import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'longest-substring-without-repeating-characters',
  title: 'Longest Substring Without Repeating Characters',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int maxLen = 0, start = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            if (lastSeen.count(s[i]) && lastSeen[s[i]] >= start)
                start = lastSeen[s[i]] + 1;
            lastSeen[s[i]] = i;
            maxLen = max(maxLen, i - start + 1);
        }
        return maxLen;
    }
};

int main() {
    Solution sol;
    cout << sol.lengthOfLongestSubstring("abcabcbb") << endl; // 3
    cout << sol.lengthOfLongestSubstring("bbbbb")    << endl; // 1
    cout << sol.lengthOfLongestSubstring("pwwkew")   << endl; // 3
    return 0;
}`,
};

export default problem;
