import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'multiply-strings',
  title: 'Multiply Strings',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/multiply-strings/',
  description: 'Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.\n\n**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.',
  examples: [
    {
      input: 'num1 = "2", num2 = "3"',
      output: '"6"'
    },
    {
      input: 'num1 = "123", num2 = "456"',
      output: '"56088"'
    }
  ],
  constraints: [
    '1 <= num1.length, num2.length <= 200',
    'num1 and num2 consist of digits only.',
    'Both num1 and num2 do not contain any leading zero, except the number 0 itself.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    string multiply(string num1, string num2){
        int m=num1.size(),n=num2.size();
        vector<int> pos(m+n,0);
        for(int i=m-1;i>=0;i--) for(int j=n-1;j>=0;j--){
            int mul=(num1[i]-'0')*(num2[j]-'0');
            int p1=i+j,p2=i+j+1,sum=mul+pos[p2];
            pos[p2]=sum%10; pos[p1]+=sum/10;
        }
        string res="";
        for(int d:pos) if(!(res.empty()&&d==0)) res+=to_string(d);
        return res.empty()?"0":res;
    }
};

int main(){
    Solution sol;
    cout<<sol.multiply("2","3")<<endl;   // 6
    cout<<sol.multiply("123","456")<<endl; // 56088
    return 0;
}`,
};

export default problem;
