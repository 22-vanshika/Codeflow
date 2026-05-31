import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'reverse-bits',
  title: 'Reverse Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/reverse-bits/',
  description: 'Reverse bits of a given 32 bits unsigned integer.',
  examples: [
    {
      input: 'n = 00000010100101000001111010011100',
      output: '00111001011110000010100101000000',
      explanation: 'The input binary string 00000010100101000001111010011100 represents the unsigned integer 43261596, so return 964176192 which its binary representation is 00111001011110000010100101000000.'
    }
  ],
  constraints: [
    'The input must be a binary string of length 32'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>= 1;
        }
        return res;
    }
};

int main() {
    Solution sol;
    cout << sol.reverseBits(43261596) << endl; // 964176192
    return 0;
}`,
};

export default problem;
