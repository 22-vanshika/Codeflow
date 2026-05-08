import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'palindrome-number',
  title: 'Palindrome Number',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/palindrome-number/',
  description: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.',
  examples: [
    {
      input: 'x = 121',
      output: 'true',
      explanation: '121 reads as 121 from left to right and from right to left.'
    },
    {
      input: 'x = -121',
      output: 'false',
      explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.'
    },
    {
      input: 'x = 10',
      output: 'false',
      explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.'
    }
  ],
  constraints: [
    '-2^31 <= x <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x){
        if(x<0||(x%10==0&&x!=0)) return false;
        int rev=0;
        while(x>rev){rev=rev*10+x%10;x/=10;}
        return x==rev||x==rev/10;
    }
};

int main(){
    Solution sol;cout<<boolalpha;
    cout<<sol.isPalindrome(121)<<endl;  // true
    cout<<sol.isPalindrome(-121)<<endl; // false
    return 0;
}`,
};

export default problem;
