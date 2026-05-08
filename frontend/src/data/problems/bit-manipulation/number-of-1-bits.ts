import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/number-of-1-bits/',
  description: 'Write a function that takes an unsigned integer and returns the number of \'1\' bits it has (also known as the [Hamming weight](http://en.wikipedia.org/wiki/Hamming_weight)).',
  examples: [
    {
      input: 'n = 11 (00000000000000000000000000001011)',
      output: '3',
      explanation: 'The input binary string 00000000000000000000000000001011 has a total of three \'1\' bits.'
    },
    {
      input: 'n = 128 (00000000000000000000000010000000)',
      output: '1'
    }
  ],
  constraints: [
    'The input must be a binary string of length 32.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int hammingWeight(uint32_t n){
        int cnt=0;
        while(n){n&=n-1;cnt++;}
        return cnt;
    }
};

int main(){
    Solution sol;
    cout<<sol.hammingWeight(11)<<endl; // 3 (1011)
    cout<<sol.hammingWeight(128)<<endl; // 1
    return 0;
}`,
};

export default problem;
