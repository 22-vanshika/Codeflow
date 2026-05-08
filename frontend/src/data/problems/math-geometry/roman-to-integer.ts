import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'roman-to-integer',
  title: 'Roman to Integer',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/roman-to-integer/',
  description: 'Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.\n\n| Symbol | Value |\n| :--- | :--- |\n| I | 1 |\n| V | 5 |\n| X | 10 |\n| L | 50 |\n| C | 100 |\n| D | 500 |\n| M | 1000 |\n\nFor example, `2` is written as `II` in Roman numeral, just two ones added together. `12` is written as `XII`, which is simply `X + II`. The number `27` is written as `XXVII`, which is `XX + V + II`.\n\nRoman numerals are usually written largest to smallest from left to right. However, the numeral for four is not `IIII`. Instead, the number four is written as `IV`. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as `IX`. There are six instances where subtraction is used:\n- `I` can be placed before `V` (5) and `X` (10) to make 4 and 9.\n- `X` can be placed before `L` (50) and `C` (100) to make 40 and 90.\n- `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.\n\nGiven a roman numeral, convert it to an integer.',
  examples: [
    {
      input: 's = "III"',
      output: '3',
      explanation: 'III = 3.'
    },
    {
      input: 's = "LVIII"',
      output: '58',
      explanation: 'L = 50, V= 5, III = 3.'
    },
    {
      input: 's = "MCMXCIV"',
      output: '1994',
      explanation: 'M = 1000, CM = 900, XC = 90 and IV = 4.'
    }
  ],
  constraints: [
    '1 <= s.length <= 15',
    's contains only the characters (\'I\', \'V\', \'X\', \'L\', \'C\', \'D\', \'M\').',
    'It is guaranteed that s is a valid roman numeral in the range [1, 3999].'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int romanToInt(string s){
        unordered_map<char,int> val={{'I',1},{'V',5},{'X',10},{'L',50},{'C',100},{'D',500},{'M',1000}};
        int res=0;
        for(int i=0;i<(int)s.size();i++){
            if(i+1<(int)s.size()&&val[s[i]]<val[s[i+1]]) res-=val[s[i]];
            else res+=val[s[i]];
        }
        return res;
    }
};

int main(){
    Solution sol;
    cout<<sol.romanToInt("III")<<endl;    // 3
    cout<<sol.romanToInt("MCMXCIV")<<endl; // 1994
    return 0;
}`,
};

export default problem;
