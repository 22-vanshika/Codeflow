import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'fibonacci-number',
  title: 'Fibonacci Number',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/fibonacci-number/',
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
