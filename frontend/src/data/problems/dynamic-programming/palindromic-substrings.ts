import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'palindromic-substrings',
  title: 'Palindromic Substrings',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/palindromic-substrings/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    int count=0;
    void expand(string&s,int l,int r){
        while(l>=0&&r<(int)s.size()&&s[l]==s[r]){count++;l--;r++;}
    }
public:
    int countSubstrings(string s){
        for(int i=0;i<(int)s.size();i++){expand(s,i,i);expand(s,i,i+1);}
        return count;
    }
};
int main(){
    Solution sol;
    cout<<sol.countSubstrings("abc")<<endl; // 3
    cout<<sol.countSubstrings("aaa")<<endl; // 6
    return 0;
}`,
};
export default problem;
