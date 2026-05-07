import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'remove-k-digits',
  title: 'Remove K Digits',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/remove-k-digits/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string removeKdigits(string num, int k) {
        string res="";
        for (char c:num) {
            while (k>0&&!res.empty()&&res.back()>c) { res.pop_back(); k--; }
            res+=c;
        }
        while (k-->0) res.pop_back();
        int start=res.find_first_not_of('0');
        return start==string::npos?"0":res.substr(start);
    }
};
int main() {
    Solution sol;
    cout<<sol.removeKdigits("1432219",3)<<endl; // "1219"
    cout<<sol.removeKdigits("10200",1)<<endl;   // "200"
    return 0;
}`,
};
export default problem;
