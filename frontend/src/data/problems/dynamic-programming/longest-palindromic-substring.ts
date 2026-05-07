import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'longest-palindromic-substring',
  title: 'Longest Palindromic Substring',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/longest-palindromic-substring/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    string expand(string&s, int l, int r){
        while(l>=0&&r<(int)s.size()&&s[l]==s[r]){l--;r++;}
        return s.substr(l+1,r-l-1);
    }
public:
    string longestPalindrome(string s){
        string res="";
        for(int i=0;i<(int)s.size();i++){
            string odd=expand(s,i,i), even=expand(s,i,i+1);
            if(odd.size()>res.size()) res=odd;
            if(even.size()>res.size()) res=even;
        }
        return res;
    }
};
int main(){
    Solution sol;
    cout<<sol.longestPalindrome("babad")<<endl; // bab
    cout<<sol.longestPalindrome("cbbd")<<endl;  // bb
    return 0;
}`,
};
export default problem;
