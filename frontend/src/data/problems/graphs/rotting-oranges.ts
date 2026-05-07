import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'rotting-oranges',
  title: 'Rotting Oranges',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/rotting-oranges/',
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
