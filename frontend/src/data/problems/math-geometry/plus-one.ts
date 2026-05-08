import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'plus-one',
  title: 'Plus One',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/plus-one/',
  description: 'You are given a **large integer** represented as an integer array `digits`, where each `digits[i]` is the `ith` digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading `0`\'s.\n\nIncrement the large integer by one and return the resulting array of digits.',
  examples: [
    {
      input: 'digits = [1,2,3]',
      output: '[1,2,4]',
      explanation: 'The array represents the integer 123. Incrementing by one gives 123 + 1 = 124. Thus, the result should be [1,2,4].'
    },
    {
      input: 'digits = [4,3,2,1]',
      output: '[4,3,2,2]',
      explanation: 'The array represents the integer 4321. Incrementing by one gives 4321 + 1 = 4322. Thus, the result should be [4,3,2,2].'
    },
    {
      input: 'digits = [9]',
      output: '[1,0]',
      explanation: 'The array represents the integer 9. Incrementing by one gives 9 + 1 = 10. Thus, the result should be [1,0].'
    }
  ],
  constraints: [
    '1 <= digits.length <= 100',
    '0 <= digits[i] <= 9',
    'digits does not contain any leading 0\'s.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> plusOne(vector<int>& digits){
        for(int i=digits.size()-1;i>=0;i--){
            if(digits[i]<9){digits[i]++;return digits;}
            digits[i]=0;
        }
        digits.insert(digits.begin(),1);
        return digits;
    }
};

int main(){
    Solution sol;
    vector<int> d={1,2,3};
    for(int v:sol.plusOne(d)) cout<<v; // 124
    cout<<endl;
    return 0;
}`,
};

export default problem;
