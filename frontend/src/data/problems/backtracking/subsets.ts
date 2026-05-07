import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'subsets',
  title: 'Subsets',
  difficulty: 'Medium',
  category: 'Backtracking',
  url: 'https://leetcode.com/problems/subsets/',
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
