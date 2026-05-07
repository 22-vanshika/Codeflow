import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'roman-to-integer',
  title: 'Roman to Integer',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/roman-to-integer/',
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
