import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'valid-perfect-square',
  title: 'Valid Perfect Square',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/valid-perfect-square/',
  description: 'Given a positive integer `num`, return `true` if `num` is a perfect square or `false` otherwise. A perfect square is an integer that is the square of an integer. In other words, it is the product of some integer with itself. Do not use any built-in library function.',
  examples: [
    {
      input: 'num = 16',
      output: 'true'
    },
    {
      input: 'num = 14',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= num <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isPerfectSquare(int num) {
        if (num < 1) return false;
        long long low = 1, high = num;
        while (low <= high) {
            long long mid = low + (high - low) / 2;
            long long sq = mid * mid;
            if (sq == num) return true;
            else if (sq < num) low = mid + 1;
            else high = mid - 1;
        }
        return false;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    cout << sol.isPerfectSquare(16) << endl; // true
    cout << sol.isPerfectSquare(14) << endl; // false
    return 0;
}`,
};

export default problem;
