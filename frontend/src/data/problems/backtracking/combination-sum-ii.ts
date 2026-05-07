import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'combination-sum-ii',
  title: 'Combination Sum II',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/combination-sum-ii/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    void bt(vector<int>&c,int target,int start,vector<int>&curr,vector<vector<int>>&res){
        if(target==0){res.push_back(curr);return;}
        for(int i=start;i<(int)c.size();i++){
            if(i>start&&c[i]==c[i-1]) continue;
            if(c[i]>target) break;
            curr.push_back(c[i]);
            bt(c,target-c[i],i+1,curr,res);
            curr.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target){
        sort(candidates.begin(),candidates.end());
        vector<vector<int>> res; vector<int> curr;
        bt(candidates,target,0,curr,res); return res;
    }
};
int main(){
    Solution sol;
    vector<int> c={10,1,2,7,6,1,5};
    for(auto&v:sol.combinationSum2(c,8)){for(int x:v)cout<<x<<" ";cout<<endl;}
    return 0;
}`,
};
export default problem;
