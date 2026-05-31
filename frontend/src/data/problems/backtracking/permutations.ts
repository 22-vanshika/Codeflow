import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'permutations',
  title: 'Permutations',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/permutations/',
  description: 'Given an array `nums` of distinct integers, return all the possible permutations. You can return the answer in any order.',
  examples: [
    {
      input: 'nums = [1,2,3]',
      output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'
    },
    {
      input: 'nums = [0,1]',
      output: '[[0,1],[1,0]]'
    },
    {
      input: 'nums = [1]',
      output: '[[1]]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 6',
    '-10 <= nums[i] <= 10',
    'All the integers in nums are unique.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    void backtrack(vector<int>& nums, vector<bool>& used,
                   vector<int>& curr, vector<vector<int>>& res) {
        if ((int)curr.size() == (int)nums.size()) { res.push_back(curr); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true; curr.push_back(nums[i]);
            backtrack(nums, used, curr, res);
            used[i] = false; curr.pop_back();
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> curr;
        vector<bool> used(nums.size(), false);
        backtrack(nums, used, curr, res);
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1,2,3};
    auto res = sol.permute(nums);
    for (auto& p : res) {
        for (int x : p) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
};

export default problem;
