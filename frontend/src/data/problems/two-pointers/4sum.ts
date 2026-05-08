import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: '4sum',
  title: '4Sum',
  difficulty: 'Medium',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/4sum/',
  description: 'Given an array `nums` of `n` integers, return an array of all the **unique** quadruplets `[nums[a], nums[b], nums[c], nums[d]]` such that:\n- `0 <= a, b, c, d < n`\n- `a, b, c, and d` are **distinct**.\n- `nums[a] + nums[b] + nums[c] + nums[d] == target`\n\nYou may return the answer in **any order**.',
  examples: [
    {
      input: 'nums = [1,0,-1,0,-2,2], target = 0',
      output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]'
    },
    {
      input: 'nums = [2,2,2,2,2], target = 8',
      output: '[ [2,2,2,2] ]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 200',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
        sort(nums.begin(),nums.end());
        vector<vector<int>> res;
        int n=nums.size();
        for (int i=0;i<n-3;i++) {
            if (i>0&&nums[i]==nums[i-1]) continue;
            for (int j=i+1;j<n-2;j++) {
                if (j>i+1&&nums[j]==nums[j-1]) continue;
                int l=j+1,r=n-1;
                while (l<r) {
                    long long s=(long long)nums[i]+nums[j]+nums[l]+nums[r];
                    if (s==target) {
                        res.push_back({nums[i],nums[j],nums[l],nums[r]});
                        while(l<r&&nums[l]==nums[l+1]) l++;
                        while(l<r&&nums[r]==nums[r-1]) r--;
                        l++; r--;
                    } else if (s<target) l++;
                    else r--;
                }
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums={1,0,-1,0,-2,2};
    for (auto& v:sol.fourSum(nums,0))
        cout<<"["<<v[0]<<","<<v[1]<<","<<v[2]<<","<<v[3]<<"] ";
    cout<<endl;
    return 0;
}`,
};

export default problem;
