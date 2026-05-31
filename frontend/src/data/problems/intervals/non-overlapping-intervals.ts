import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'non-overlapping-intervals',
  title: 'Non-overlapping Intervals',
  difficulty: 'Medium',
  category: 'Intervals',
  url: 'https://leetcode.com/problems/non-overlapping-intervals/',
  description: 'Given an array of intervals `intervals` where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
  examples: [
    {
      input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]',
      output: '1',
      explanation: '[1,3] can be removed and the rest of the intervals are non-overlapping.'
    },
    {
      input: 'intervals = [[1,2],[1,2],[1,2]]',
      output: '2',
      explanation: 'You need to remove two [1,2] to make the rest of the intervals non-overlapping.'
    },
    {
      input: 'intervals = [[1,2],[2,3]]',
      output: '0',
      explanation: 'You don\'t need to remove any of the intervals since they\'re already non-overlapping.'
    }
  ],
  constraints: [
    '1 <= intervals.length <= 10^5',
    'intervals[i].length == 2',
    '-5 * 10^4 <= starti < endi <= 5 * 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b){
            return a[1] < b[1]; // sort by end time
        });
        int count = 0, lastEnd = intervals[0][1];
        for (size_t i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] < lastEnd) count++;
            else lastEnd = intervals[i][1];
        }
        return count;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> iv = {{1,2},{2,3},{3,4},{1,3}};
    cout << sol.eraseOverlapIntervals(iv) << endl; // 1
    return 0;
}`,
};

export default problem;
