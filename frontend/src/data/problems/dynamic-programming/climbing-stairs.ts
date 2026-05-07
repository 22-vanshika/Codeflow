import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'climbing-stairs',
  title: 'Climbing Stairs',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/climbing-stairs/',
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
