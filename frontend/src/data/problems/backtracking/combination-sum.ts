import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'combination-sum',
  title: 'Combination Sum',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/combination-sum/',
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
