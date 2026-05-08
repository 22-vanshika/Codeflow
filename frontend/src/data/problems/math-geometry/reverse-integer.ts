import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'reverse-integer',
  title: 'Reverse Integer',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/reverse-integer/',
  description: 'Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, then return `0`.\n\n**Assume the environment does not allow you to store 64-bit integers (signed or unsigned).**',
  examples: [
    {
      input: 'x = 123',
      output: '321'
    },
    {
      input: 'x = -123',
      output: '-321'
    },
    {
      input: 'x = 120',
      output: '21'
    }
  ],
  constraints: [
    '-2^31 <= x <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int reverse(int x){
        int res=0;
        while(x){
            int pop = x % 10;
            x /= 10;
            if (res > INT_MAX/10 || (res == INT_MAX / 10 && pop > 7)) return 0;
            if (res < INT_MIN/10 || (res == INT_MIN / 10 && pop < -8)) return 0;
            res = res * 10 + pop;
        }
        return res;
    }
};

int main(){
    Solution sol;
    cout<<sol.reverse(123)<<endl;    // 321
    cout<<sol.reverse(-123)<<endl;   // -321
    cout<<sol.reverse(1534236469)<<endl; // 0 (overflow)
    return 0;
}`,
};

export default problem;
