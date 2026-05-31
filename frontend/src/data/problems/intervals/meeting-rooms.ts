import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'meeting-rooms',
  title: 'Meeting Rooms',
  difficulty: 'Easy',
  category: 'Intervals',
  url: 'https://leetcode.com/problems/meeting-rooms/',
  description: 'Given an array of meeting time `intervals` where `intervals[i] = [starti, endi]`, determine if a person could attend all meetings.',
  examples: [
    {
      input: 'intervals = [[0,30],[5,10],[15,20]]',
      output: 'false'
    },
    {
      input: 'intervals = [[7,10],[2,4]]',
      output: 'true'
    }
  ],
  constraints: [
    '0 <= intervals.length <= 10^4',
    'intervals[i].length == 2',
    '0 <= starti < endi <= 10^6'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        if (intervals.empty()) return true;
        sort(intervals.begin(), intervals.end());
        for (int i = 1; i < (int)intervals.size(); i++)
            if (intervals[i][0] < intervals[i-1][1]) return false;
        return true;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<vector<int>> m1 = {{0,30},{5,10},{15,20}};
    cout << sol.canAttendMeetings(m1) << endl; // false
    vector<vector<int>> m2 = {{7,10},{2,4}};
    cout << sol.canAttendMeetings(m2) << endl; // true
    return 0;
}`,
};

export default problem;
