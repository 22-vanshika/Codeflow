import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'task-scheduler',
  title: 'Task Scheduler',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/task-scheduler/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        int freq[26] = {};
        for (char c : tasks) freq[c - 'A']++;
        int maxFreq = *max_element(begin(freq), end(freq));
        int maxCount = count(begin(freq), end(freq), maxFreq);
        return max((int)tasks.size(), (maxFreq - 1) * (n + 1) + maxCount);
    }
};

int main() {
    Solution sol;
    vector<char> tasks = {'A','A','A','B','B','B'};
    cout << sol.leastInterval(tasks, 2) << endl; // 8
    return 0;
}`,
};

export default problem;
