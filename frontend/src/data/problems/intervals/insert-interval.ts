import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'insert-interval',
  title: 'Insert Interval',
  difficulty: 'Medium',
  category: 'Intervals',
  url: 'https://leetcode.com/problems/insert-interval/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int i = 0, n = intervals.size();
        // Add all intervals before newInterval
        while (i < n && intervals[i][1] < newInterval[0])
            res.push_back(intervals[i++]);
        // Merge overlapping
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.push_back(newInterval);
        // Add rest
        while (i < n) res.push_back(intervals[i++]);
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> iv = {{1,3},{6,9}};
    vector<int> nw = {2,5};
    auto res = sol.insert(iv, nw);
    for (auto& r : res) cout << "[" << r[0] << "," << r[1] << "] "; // [1,5] [6,9]
    cout << endl;
    return 0;
}`,
};

export default problem;
