import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'insert-interval',
  title: 'Insert Interval',
  difficulty: 'Medium',
  category: 'Intervals',
  url: 'https://leetcode.com/problems/insert-interval/',
  description: 'You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [starti, endi]` represents the start and the end of the `i-th` interval and `intervals` is sorted in ascending order by `starti`.\n\nYou are also given an interval `newInterval = [start, end]` that represents the start and end of another interval.\n\nInsert `newInterval` into `intervals` such that `intervals` is still sorted in ascending order by `starti` and `intervals` still does not have any overlapping intervals (merge overlapping intervals if necessary).\n\nReturn `intervals` after the insertion.',
  examples: [
    {
      input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
      output: '[[1,5],[6,9]]'
    },
    {
      input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]',
      output: '[[1,2],[3,10],[12,16]]',
      explanation: 'Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].'
    }
  ],
  constraints: [
    '0 <= intervals.length <= 10^4',
    'intervals[i].length == 2',
    '0 <= starti <= endi <= 10^5',
    'intervals is sorted by starti in ascending order.',
    'newInterval.length == 2',
    '0 <= start <= end <= 10^5'
  ],
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
