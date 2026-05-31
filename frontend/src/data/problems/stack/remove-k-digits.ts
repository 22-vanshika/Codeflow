import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'remove-k-digits',
  title: 'Remove K Digits',
  difficulty: 'Medium',
  category: 'Stack',
  url: 'https://leetcode.com/problems/remove-k-digits/',
  description: 'Given string num representing a non-negative integer `num`, and an integer `k`, return the smallest possible integer after removing `k` digits from `num`.',
  examples: [
    {
      input: 'num = "1432219", k = 3',
      output: '"1219"',
      explanation: 'Remove the three digits 4, 3, and 2 to form the new number 1219 which is the smallest.'
    },
    {
      input: 'num = "10200", k = 1',
      output: '"200"',
      explanation: 'Remove one digit 1 and the remaining number is 0200 which is 200. Note that the output must not contain leading zeroes.'
    },
    {
      input: 'num = "10", k = 2',
      output: '"0"',
      explanation: 'Remove all the digits from the number and it is left with nothing which is 0.'
    }
  ],
  constraints: [
    '1 <= k <= num.length <= 10^5',
    'num consists of only digits.',
    'num does not have any leading zeros except for the zero itself.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string removeKdigits(string num, int k) {
        string res="";
        for (char c:num) {
            while (k>0&&!res.empty()&&res.back()>c) { res.pop_back(); k--; }
            res+=c;
        }
        while (k-->0 && !res.empty()) res.pop_back();
        size_t start=res.find_first_not_of('0');
        return start==string::npos?"0":res.substr(start);
    }
};

int main() {
    Solution sol;
    cout<<sol.removeKdigits("1432219",3)<<endl; // "1219"
    cout<<sol.removeKdigits("10200",1)<<endl;   // "200"
    return 0;
}`,
};

export default problem;
