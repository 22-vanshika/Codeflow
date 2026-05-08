import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'max-area-of-island',
  title: 'Max Area of Island',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/max-area-of-island/',
  description: 'You are given an `m x n` binary matrix `grid`. An island is a group of \'1\'s (representing land) connected 4-directionally (horizontal or vertical). You may assume all four edges of the grid are surrounded by water.\n\nThe area of an island is the number of cells with a value 1 in the island.\n\nReturn the maximum area of an island in `grid`. If there is no island, return 0.',
  examples: [
    {
      input: 'grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]',
      output: '6',
      explanation: 'The answer is not 11, because the island must be connected 4-directionally.'
    },
    {
      input: 'grid = [[0,0,0,0,0,0,0,0]]',
      output: '0'
    }
  ],
  constraints: [
    'm == grid.length',
    'n == grid[i].length',
    '1 <= m, n <= 50',
    'grid[i][j] is either 0 or 1.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    int dfs(vector<vector<int>>& grid, int i, int j) {
        if (i < 0 || i >= (int)grid.size() || j < 0 || j >= (int)grid[0].size()
            || grid[i][j] == 0) return 0;
        grid[i][j] = 0;
        return 1 + dfs(grid, i+1, j) + dfs(grid, i-1, j)
                 + dfs(grid, i, j+1) + dfs(grid, i, j-1);
    }
public:
    int maxAreaOfIsland(vector<vector<int>>& grid) {
        int maxArea = 0;
        for (int i = 0; i < (int)grid.size(); i++)
            for (int j = 0; j < (int)grid[0].size(); j++)
                maxArea = max(maxArea, dfs(grid, i, j));
        return maxArea;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> grid = {
        {0,0,1,0,0,0,0,1,0,0,0,0,0},
        {0,0,0,0,0,0,0,1,1,1,0,0,0},
        {0,1,1,0,1,0,0,0,0,0,0,0,0},
        {0,1,0,0,1,1,0,0,1,0,1,0,0},
        {0,1,0,0,1,1,0,0,1,1,1,0,0},
        {0,0,0,0,0,0,0,0,0,0,1,0,0},
        {0,0,0,0,0,0,0,1,1,1,0,0,0},
        {0,0,0,0,0,0,0,1,1,0,0,0,0}
    };
    cout << sol.maxAreaOfIsland(grid) << endl; // 6
    return 0;
}`,
};

export default problem;
