import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'non-overlapping-intervals',
  title: 'Non-overlapping Intervals',
  difficulty: 'Medium',
  category: 'Intervals',
  url: 'https://leetcode.com/problems/non-overlapping-intervals/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b){
            return a[1] < b[1]; // sort by end time
        });
        int count = 0, end = INT_MIN;
        for (auto& iv : intervals) {
            if (iv[0] >= end) end = iv[1];
            else count++;
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
