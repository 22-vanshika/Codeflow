import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'course-schedule',
  title: 'Course Schedule',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/course-schedule/',
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
