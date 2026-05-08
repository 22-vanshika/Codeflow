import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/number-of-1-bits/',
  description: 'Write a function that takes an unsigned integer and returns the number of \'1\' bits it has (also known as the Hamming weight).',
  examples: [
    {
      input: 'n = 11 (binary: 1011)',
      output: '3'
    },
    {
      input: 'n = 128 (binary: 10000000)',
      output: '1'
    }
  ],
  constraints: [
    'The input must be a binary string of length 32'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        while (n) {
            n &= (n - 1);
            count++;
        }
        return count;
    }
};

int main() {
    Solution sol;
    cout << sol.hammingWeight(11) << endl; // 3
    return 0;
}`,
};

export default problem;
