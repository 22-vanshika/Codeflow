import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'subsets',
  title: 'Subsets',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/subsets/',
  description: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set).\n\nThe solution set must not contain duplicate subsets. Return the solution in any order.',
  examples: [
    {
      input: 'nums = [1,2,3]',
      output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]'
    },
    {
      input: 'nums = [0]',
      output: '[[],[0]]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10',
    '-10 <= nums[i] <= 10',
    'All the numbers of nums are unique.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& res) {
        res.push_back(curr);
        for (int i = start; i < (int)nums.size(); i++) {
            curr.push_back(nums[i]);
            backtrack(nums, i + 1, curr, res);
            curr.pop_back();
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> curr;
        backtrack(nums, 0, curr, res);
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1,2,3};
    auto res = sol.subsets(nums);
    for (auto& s : res) {
        cout << "[";
        for (int i = 0; i < (int)s.size(); i++) { cout << s[i]; if (i+1<(int)s.size()) cout << ","; }
        cout << "] ";
    }
    cout << endl;
    return 0;
}`,
};

export default problem;
