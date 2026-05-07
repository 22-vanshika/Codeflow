import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'min-stack',
  title: 'Min Stack',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/min-stack/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class MinStack {
    stack<int> st, minSt;
public:
    void push(int val) {
        st.push(val);
        int m = minSt.empty() ? val : min(val, minSt.top());
        minSt.push(m);
    }
    void pop() { st.pop(); minSt.pop(); }
    int top() { return st.top(); }
    int getMin() { return minSt.top(); }
};

int main() {
    MinStack ms;
    ms.push(-2);
    ms.push(0);
    ms.push(-3);
    cout << ms.getMin() << endl; // -3
    ms.pop();
    cout << ms.top()    << endl; // 0
    cout << ms.getMin() << endl; // -2
    return 0;
}`,
};

export default problem;
