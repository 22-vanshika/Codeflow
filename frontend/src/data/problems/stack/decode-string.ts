import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'decode-string',
  title: 'Decode String',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/decode-string/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string decodeString(string s) {
        stack<int> counts; stack<string> strs;
        string curr=""; int k=0;
        for (char c:s) {
            if (isdigit(c)) k=k*10+(c-'0');
            else if (c=='[') { counts.push(k); strs.push(curr); k=0; curr=""; }
            else if (c==']') {
                int rep=counts.top(); counts.pop();
                string prev=strs.top(); strs.pop();
                for (int i=0;i<rep;i++) prev+=curr;
                curr=prev;
            } else curr+=c;
        }
        return curr;
    }
};
int main() {
    Solution sol;
    cout<<sol.decodeString("3[a]2[bc]")<<endl;   // aaabcbc
    cout<<sol.decodeString("3[a2[c]]")<<endl;     // accaccacc
    return 0;
}`,
};
export default problem;
