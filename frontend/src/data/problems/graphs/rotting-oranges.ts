import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'rotting-oranges',
  title: 'Rotting Oranges',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/rotting-oranges/',
  description: 'You are given an `m x n` `grid` where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return `-1`.',
  examples: [
    {
      input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
      output: '4'
    },
    {
      input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]',
      output: '-1',
      explanation: 'The orange in the bottom left corner (row 2, column 0) is never rotten, because rotting only happens 4-directionally.'
    },
    {
      input: 'grid = [[0,2]]',
      output: '0',
      explanation: 'Since there are already no fresh oranges at minute 0, the answer is just 0.'
    }
  ],
  constraints: [
    'm == grid.length',
    'n == grid[i].length',
    '1 <= m, n <= 10',
    'grid[i][j] is 0, 1, or 2.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), fresh = 0, minutes = 0;
        queue<pair<int,int>> q;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) q.push({i,j});
                else if (grid[i][j] == 1) fresh++;
            }
        int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
        while (!q.empty() && fresh > 0) {
            int sz = q.size(); minutes++;
            for (int k = 0; k < sz; k++) {
                auto [r, c] = q.front(); q.pop();
                for (auto& d : dirs) {
                    int nr = r+d[0], nc = c+d[1];
                    if (nr>=0 && nr<m && nc>=0 && nc<n && grid[nr][nc]==1) {
                        grid[nr][nc] = 2; fresh--; q.push({nr,nc});
                    }
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> grid = {{2,1,1},{1,1,0},{0,1,1}};
    cout << sol.orangesRotting(grid) << endl; // 4
    return 0;
}`,
};

export default problem;
