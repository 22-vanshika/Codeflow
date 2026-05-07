import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'palindrome-partitioning',
  title: 'Palindrome Partitioning',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/palindrome-partitioning/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    bool isPalin(string&s,int l,int r){while(l<r)if(s[l++]!=s[r--])return false;return true;}
    void bt(string&s,int start,vector<string>&curr,vector<vector<string>>&res){
        if(start==(int)s.size()){res.push_back(curr);return;}
        for(int end=start;end<(int)s.size();end++){
            if(isPalin(s,start,end)){
                curr.push_back(s.substr(start,end-start+1));
                bt(s,end+1,curr,res);
                curr.pop_back();
            }
        }
    }
public:
    vector<vector<string>> partition(string s){
        vector<vector<string>> res; vector<string> curr;
        bt(s,0,curr,res); return res;
    }
};
int main(){
    Solution sol;
    for(auto&v:sol.partition("aab")){for(auto&s:v)cout<<s<<" ";cout<<endl;}
    return 0;
}`,
};
export default problem;
