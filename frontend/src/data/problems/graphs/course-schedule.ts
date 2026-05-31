import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'course-schedule',
  title: 'Course Schedule',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/course-schedule/',
  description: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`.\n\n- For example, the pair `[0, 1]`, indicates that to take course 0 you have to first take course 1.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.',
  examples: [
    {
      input: 'numCourses = 2, prerequisites = [[1,0]]',
      output: 'true',
      explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.'
    },
    {
      input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
      output: 'false',
      explanation: 'There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.'
    }
  ],
  constraints: [
    '1 <= numCourses <= 2000',
    '0 <= prerequisites.length <= 5000',
    'prerequisites[i].length == 2',
    '0 <= ai, bi < numCourses',
    'All the pairs prerequisites[i] are unique.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    bool hasCycle(int node, vector<vector<int>>& adj, vector<int>& state) {
        if (state[node] == 1) return true;  // in current path
        if (state[node] == 2) return false; // already processed
        state[node] = 1;
        for (int nei : adj[node])
            if (hasCycle(nei, adj, state)) return true;
        state[node] = 2;
        return false;
    }
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) adj[p[1]].push_back(p[0]);
        vector<int> state(numCourses, 0);
        for (int i = 0; i < numCourses; i++)
            if (hasCycle(i, adj, state)) return false;
        return true;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<vector<int>> p1 = {{1,0}};
    cout << sol.canFinish(2, p1) << endl; // true
    vector<vector<int>> p2 = {{1,0},{0,1}};
    cout << sol.canFinish(2, p2) << endl; // false (cycle)
    return 0;
}`,
};

export default problem;
