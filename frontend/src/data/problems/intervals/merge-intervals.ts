import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'merge-intervals',
  title: 'Merge Intervals',
  difficulty: 'Medium',
  category: 'Intervals',
  url: 'https://leetcode.com/problems/merge-intervals/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res;
        for (auto& iv : intervals) {
            if (!res.empty() && iv[0] <= res.back()[1])
                res.back()[1] = max(res.back()[1], iv[1]);
            else
                res.push_back(iv);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> iv = {{1,3},{2,6},{8,10},{15,18}};
    auto res = sol.merge(iv);
    for (auto& r : res) cout << "[" << r[0] << "," << r[1] << "] "; // [1,6] [8,10] [15,18]
    cout << endl;
    return 0;
}`,
};

export default problem;
