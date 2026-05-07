import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'permutation-in-string',
  title: 'Permutation in String',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/permutation-in-string/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool checkInclusion(string s1, string s2) {
        if (s1.size() > s2.size()) return false;
        int freq1[26] = {}, freq2[26] = {};
        for (char c : s1) freq1[c - 'a']++;
        for (int i = 0; i < (int)s1.size(); i++) freq2[s2[i] - 'a']++;

        for (int i = (int)s1.size(); i < (int)s2.size(); i++) {
            if (freq1 == freq2) return true; // arrays compare element-wise
            // Actually use std::equal for clarity:
            freq2[s2[i] - 'a']++;
            freq2[s2[i - s1.size()] - 'a']--;
        }
        return equal(begin(freq1), end(freq1), begin(freq2));
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
