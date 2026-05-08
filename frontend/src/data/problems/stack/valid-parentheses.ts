import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  difficulty: 'Easy',
  category: 'Stack',
  url: 'https://leetcode.com/problems/valid-parentheses/',
  description: 'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
  examples: [
    {
      input: 's = "()"',
      output: 'true'
    },
    {
      input: 's = "()[]{}"',
      output: 'true'
    },
    {
      input: 's = "(]"',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= s.length <= 10^4',
    's consists of parentheses only \'()[]{}\'.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else {
                if (st.empty() || st.top() != pairs[c]) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    cout << sol.isValid("()[]{}") << endl; // true
    cout << sol.isValid("(]")    << endl;  // false
    cout << sol.isValid("{[]}")  << endl;  // true
    return 0;
}`,
};

export default problem;
