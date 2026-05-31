import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'fibonacci-number',
  title: 'Fibonacci Number',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/fibonacci-number/',
  description: 'The **Fibonacci numbers**, commonly denoted `F(n)` form a sequence, called the **Fibonacci sequence**, such that each number is the sum of the two preceding ones, starting from `0` and `1`. That is:\\n\\n`F(0) = 0, F(1) = 1`\\n`F(n) = F(n - 1) + F(n - 2)`, for `n > 1`.\\n\\nGiven `n`, calculate `F(n)`.',
  examples: [
    {
      input: 'n = 2',
      output: '1'
    },
    {
      input: 'n = 3',
      output: '2'
    },
    {
      input: 'n = 4',
      output: '3'
    }
  ],
  constraints: [
    '0 <= n <= 30'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int fib(int n){
        if(n<=1) return n;
        int a=0,b=1;
        for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}
        return b;
    }
};
int main(){Solution sol;cout<<sol.fib(10)<<endl;return 0;}`,
};
export default problem;
