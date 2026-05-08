import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'task-scheduler',
  title: 'Task Scheduler',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/task-scheduler/',
  description: 'Given a characters array `tasks`, representing the tasks a CPU needs to do, where each letter represents a different task. Tasks could be done in any order. Each task is done in one unit of time. For each unit of time, the CPU could complete either one task or just be idle.\\n\\nHowever, there is a non-negative integer `n` that represents the cooldown period between two **same tasks** (the same letter in the array), that is that there must be at least `n` units of time between any two same tasks.\\n\\nReturn the least number of units of time that the CPU will take to finish all the given tasks.',
  examples: [
    {
      input: 'tasks = ["A","A","A","B","B","B"], n = 2',
      output: '8'
    },
    {
      input: 'tasks = ["A","A","A","B","B","B"], n = 0',
      output: '6'
    },
    {
      input: 'tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2',
      output: '16'
    }
  ],
  constraints: [
    '1 <= tasks.length <= 10^4',
    'tasks[i] is upper-case English letter.',
    '0 <= n <= 100'
  ],
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
