import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/climbing-stairs/',
  description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
  examples: [
    {
      input: 'n = 2',
      output: '2',
      explanation: 'There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps'
    },
    {
      input: 'n = 3',
      output: '3',
      explanation: 'There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step'
    }
  ],
  constraints: [
    '1 <= n <= 45'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b; b = c;
        }
        return b;
    }
};

int main() {
    Solution sol;
    cout << sol.climbStairs(2) << endl; // 2
    cout << sol.climbStairs(3) << endl; // 3
    cout << sol.climbStairs(5) << endl; // 8
    return 0;
}`,
};

export default problem;
