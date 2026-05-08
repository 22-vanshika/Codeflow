import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'pow-x-n',
  title: 'Pow(x, n)',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/powx-n/',
  description: 'Implement [pow(x, n)](http://www.cplusplus.com/reference/valarray/pow/), which calculates `x` raised to the power `n` (i.e., `x^n`).',
  examples: [
    {
      input: 'x = 2.00000, n = 10',
      output: '1024.00000'
    },
    {
      input: 'x = 2.10000, n = 3',
      output: '9.26100'
    },
    {
      input: 'x = 2.00000, n = -2',
      output: '0.25000',
      explanation: '2^-2 = 1/2^2 = 1/4 = 0.25'
    }
  ],
  constraints: [
    '-100.0 < x < 100.0',
    '-2^31 <= n <= 2^31 - 1',
    'n is an integer.',
    'Either x is not zero or n > 0.',
    '-10^4 <= x^n <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    double fastPow(double x, long long n){
        if(n==0) return 1.0;
        double half=fastPow(x,n/2);
        return n%2==0?half*half:half*half*x;
    }
public:
    double myPow(double x, int n){
        long long N=n;
        if(N<0){x=1/x;N=-N;}
        return fastPow(x,N);
    }
};

int main(){
    Solution sol;
    cout<<sol.myPow(2.0,10)<<endl;   // 1024
    cout<<sol.myPow(2.1,3)<<endl;    // 9.261
    cout<<sol.myPow(2.0,-2)<<endl;   // 0.25
    return 0;
}`,
};

export default problem;
