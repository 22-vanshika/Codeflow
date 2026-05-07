import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'find-all-anagrams-in-a-string',
  title: 'Find All Anagrams in a String',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        if (s.size()<p.size()) return {};
        int fp[26]={}, fs[26]={};
        for (char c:p) fp[c-'a']++;
        for (int i=0;i<(int)p.size();i++) fs[s[i]-'a']++;
        vector<int> res;
        if (equal(begin(fp),end(fp),begin(fs))) res.push_back(0);
        for (int i=p.size();i<(int)s.size();i++) {
            fs[s[i]-'a']++;
            fs[s[i-p.size()]-'a']--;
            if (equal(begin(fp),end(fp),begin(fs))) res.push_back(i-p.size()+1);
        }
        return res;
    }
};
int main() {
    Solution sol;
    for (int v:sol.findAnagrams("cbaebabacd","abc")) cout<<v<<" "; // 0 6
    cout<<endl;
    return 0;
}`,
};
export default problem;
