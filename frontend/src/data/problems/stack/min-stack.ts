import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'min-stack',
  title: 'Min Stack',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/min-stack/',
  description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the `MinStack` class:\n- `MinStack()` initializes the stack object.\n- `void push(int val)` pushes the element `val` onto the stack.\n- `void pop()` removes the element on the top of the stack.\n- `int top()` gets the top element of the stack.\n- `int getMin()` retrieves the minimum element in the stack.\n\nYou must implement a solution with `O(1)` time complexity for each function.',
  examples: [
    {
      input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
      output: '[null,null,null,null,-3,null,0,-2]',
      explanation: 'MinStack minStack = new MinStack();\nminStack.push(-2);\nminStack.push(0);\nminStack.push(-3);\nminStack.getMin(); // return -3\nminStack.pop();\nminStack.top();    // return 0\nminStack.getMin(); // return -2'
    }
  ],
  constraints: [
    '-2^31 <= val <= 2^31 - 1',
    'Methods pop, top and getMin will always be called on non-empty stacks.',
    'At most 3 * 10^4 calls will be made to push, pop, top, and getMin.'
  ],
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
