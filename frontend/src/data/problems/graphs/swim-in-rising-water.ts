import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'swim-in-rising-water',
  title: 'Swim in Rising Water',
  difficulty: 'Hard',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/swim-in-rising-water/',
  description: 'You are given an `n x n` integer matrix `grid` where each value `grid[i][j]` represents the elevation at that point `(i, j)`.\\n\\nThe rain starts to fall. At time `t`, the depth of the water everywhere is `t`. You can swim from a square to another 4-directionally adjacent square if and only if the elevation of both squares individually are at most `t`. You can swim infinite distances in zero time. Of course, you must stay within the boundaries of the grid during your swim.\\n\\nYou start at the top left square `(0, 0)`. What is the least time until you can reach the bottom right square `(n - 1, n - 1)`?',
  examples: [
    {
      input: 'grid = [[0,2],[1,3]]',
      output: '3',
      explanation: 'At time 0, you are in grid location (0, 0). You cannot go anywhere else because 4-directionally adjacent neighbors have a higher elevation than t = 0. You cannot reach index (1, 1) until time 3, when the maximum of elevations along the path is 3.'
    },
    {
      input: 'grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]',
      output: '16'
    }
  ],
  constraints: [
    'n == grid.length',
    'n == grid[i].length',
    '1 <= n <= 50',
    '0 <= grid[i][j] < n^2',
    'Each value grid[i][j] is unique.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int swimInWater(vector<vector<int>>& grid) {
        int n = grid.size();
        priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> pq;
        pq.push({grid[0][0], 0, 0});
        vector<vector<bool>> visited(n, vector<bool>(n, false));
        visited[0][0] = true;
        int res = 0;
        int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
        
        while (!pq.empty()) {
            auto curr = pq.top(); pq.pop();
            res = max(res, curr[0]);
            if (curr[1] == n-1 && curr[2] == n-1) return res;
            
            for (auto& d : dirs) {
                int r = curr[1] + d[0], c = curr[2] + d[1];
                if (r >= 0 && r < n && c >= 0 && c < n && !visited[r][c]) {
                    visited[r][c] = true;
                    pq.push({grid[r][c], r, c});
                }
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> g = {{0,2},{1,3}};
    cout << sol.swimInWater(g) << endl; // 3
    return 0;
}`,
};

export default problem;
