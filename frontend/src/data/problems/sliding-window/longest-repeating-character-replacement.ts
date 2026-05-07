import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'longest-repeating-character-replacement',
  title: 'Longest Repeating Character Replacement',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
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
