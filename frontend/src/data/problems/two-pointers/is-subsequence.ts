import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'is-subsequence',
  title: 'Is Subsequence',
  difficulty: 'Easy',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/is-subsequence/',
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
