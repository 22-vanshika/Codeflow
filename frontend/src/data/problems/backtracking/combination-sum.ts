import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'combination-sum',
  title: 'Combination Sum',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/combination-sum/',
  description: 'Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.\n\nThe same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.\n\nThe test cases are generated such that the number of unique combinations that sum up to `target` is less than 150 combinations for the given input.',
  examples: [
    {
      input: 'candidates = [2,3,6,7], target = 7',
      output: '[[2,2,3],[7]]',
      explanation: '2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.\n7 is a candidate, and 7 = 7.\nThese are the only two combinations.'
    },
    {
      input: 'candidates = [2,3,5], target = 8',
      output: '[[2,2,2,2],[2,3,3],[3,5]]'
    },
    {
      input: 'candidates = [2], target = 1',
      output: '[]'
    }
  ],
  constraints: [
    '1 <= candidates.length <= 30',
    '2 <= candidates[i] <= 40',
    'All elements of candidates are distinct.',
    '1 <= target <= 40'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    void backtrack(vector<int>& candidates, int target, int start,
                   vector<int>& curr, vector<vector<int>>& res) {
        if (target == 0) { res.push_back(curr); return; }
        for (int i = start; i < (int)candidates.size(); i++) {
            if (candidates[i] > target) break;
            curr.push_back(candidates[i]);
            backtrack(candidates, target - candidates[i], i, curr, res);
            curr.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> res;
        vector<int> curr;
        backtrack(candidates, target, 0, curr, res);
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> cands = {2,3,6,7};
    auto res = sol.combinationSum(cands, 7);
    for (auto& v : res) {
        for (int x : v) cout << x << " ";
        cout << endl;
    }
    return 0;
}`,
};

export default problem;
