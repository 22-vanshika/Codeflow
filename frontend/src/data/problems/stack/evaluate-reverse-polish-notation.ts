import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'evaluate-reverse-polish-notation',
  title: 'Evaluate Reverse Polish Notation',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<long long> st;
        for (string& t : tokens) {
            if (t == "+" || t == "-" || t == "*" || t == "/") {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                if (t == "+") st.push(a + b);
                else if (t == "-") st.push(a - b);
                else if (t == "*") st.push(a * b);
                else st.push(a / b);
            } else {
                st.push(stoll(t));
            }
        }
        return (int)st.top();
    }
};

int main() {
    Solution sol;
    vector<string> tokens = {"2","1","+","3","*"};
    cout << sol.evalRPN(tokens) << endl; // 9  ((2+1)*3)
    vector<string> tokens2 = {"4","13","5","/","+"};
    cout << sol.evalRPN(tokens2) << endl; // 6
    return 0;
}`,
};

export default problem;
