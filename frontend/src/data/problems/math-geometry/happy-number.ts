import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'happy-number',
  title: 'Happy Number',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/happy-number/',
  description: 'Write an algorithm to determine if a number `n` is happy.\n\nA **happy number** is a number defined by the following process:\n- Starting with any positive integer, replace the number by the sum of the squares of its digits.\n- Repeat the process until the number equals 1 (where it will stay), or it **loops endlessly in a cycle** which does not include 1.\n- Those numbers for which this process **ends in 1** are happy.\n\nReturn `true` if `n` is a happy number, and `false` if not.',
  examples: [
    {
      input: 'n = 19',
      output: 'true',
      explanation: '1^2 + 9^2 = 82\n8^2 + 2^2 = 68\n6^2 + 8^2 = 100\n1^2 + 0^2 + 0^2 = 1'
    },
    {
      input: 'n = 2',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= n <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    int sumSq(int n){int s=0;while(n){int d=n%10;s+=d*d;n/=10;}return s;}
public:
    bool isHappy(int n){
        int slow=n,fast=sumSq(n);
        while(fast!=1&&slow!=fast){slow=sumSq(slow);fast=sumSq(sumSq(fast));}
        return fast==1;
    }
};

int main(){
    Solution sol;cout<<boolalpha;
    cout<<sol.isHappy(19)<<endl; // true
    cout<<sol.isHappy(2)<<endl;  // false
    return 0;
}`,
};

export default problem;
