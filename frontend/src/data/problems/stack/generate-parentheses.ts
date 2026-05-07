import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'generate-parentheses',
  title: 'Generate Parentheses',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/generate-parentheses/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    void bt(int open, int close, int n, string& cur, vector<string>& res) {
        if ((int)cur.size()==2*n) { res.push_back(cur); return; }
        if (open<n)  { cur+='('; bt(open+1,close,n,cur,res); cur.pop_back(); }
        if (close<open){ cur+=')'; bt(open,close+1,n,cur,res); cur.pop_back(); }
    }
public:
    vector<string> generateParenthesis(int n) {
        vector<string> res; string cur;
        bt(0,0,n,cur,res); return res;
    }
};
int main() {
    Solution sol;
    for (auto& s:sol.generateParenthesis(3)) cout<<s<<" ";
    cout<<endl;
    return 0;
}`,
};
export default problem;
