import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'subsets-ii',
  title: 'Subsets II',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/subsets-ii/',
  description: 'Given an integer array `nums` that may contain duplicates, return all possible **subsets** (the power set). The solution set **must not** contain duplicate subsets. Return the solution in **any order**.',
  examples: [
    {
      input: 'nums = [1,2,2]',
      output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]'
    },
    {
      input: 'nums = [0]',
      output: '[[],[0]]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10',
    '-10 <= nums[i] <= 10'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    void bt(vector<int>&nums,int start,vector<int>&curr,vector<vector<int>>&res){
        res.push_back(curr);
        for(int i=start;i<(int)nums.size();i++){
            if(i>start&&nums[i]==nums[i-1]) continue;
            curr.push_back(nums[i]);
            bt(nums,i+1,curr,res);
            curr.pop_back();
        }
    }
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums){
        sort(nums.begin(),nums.end());
        vector<vector<int>> res; vector<int> curr;
        bt(nums,0,curr,res); return res;
    }
};
int main(){
    Solution sol;
    vector<int> nums={1,2,2};
    for(auto&v:sol.subsetsWithDup(nums)){cout<<"[";for(int i=0;i<(int)v.size();i++){cout<<v[i];if(i+1<(int)v.size())cout<<",";}cout<<"] ";}
    cout<<endl;
    return 0;
}`,
};
export default problem;
