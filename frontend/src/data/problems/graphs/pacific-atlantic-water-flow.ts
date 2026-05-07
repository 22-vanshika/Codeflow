import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'pacific-atlantic-water-flow',
  title: 'Pacific Atlantic Water Flow',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    void bfs(vector<vector<int>>& h, queue<pair<int,int>>& q, vector<vector<bool>>& vis) {
        int m = h.size(), n = h[0].size();
        int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr>=0 && nr<m && nc>=0 && nc<n && !vis[nr][nc] && h[nr][nc]>=h[r][c]) {
                    vis[nr][nc] = true;
                    q.push({nr, nc});
                }
            }
        }
    }
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int m = heights.size(), n = heights[0].size();
        vector<vector<bool>> pac(m, vector<bool>(n, false));
        vector<vector<bool>> atl(m, vector<bool>(n, false));
        queue<pair<int,int>> pq, aq;
        for (int i = 0; i < m; i++) {
            pq.push({i,0}); pac[i][0] = true;
            aq.push({i,n-1}); atl[i][n-1] = true;
        }
        for (int j = 0; j < n; j++) {
            pq.push({0,j}); pac[0][j] = true;
            aq.push({m-1,j}); atl[m-1][j] = true;
        }
        bfs(heights, pq, pac); bfs(heights, aq, atl);
        vector<vector<int>> res;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (pac[i][j] && atl[i][j]) res.push_back({i, j});
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> h = {{1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}};
    auto res = sol.pacificAtlantic(h);
    for (auto& p : res) cout << "[" << p[0] << "," << p[1] << "] ";
    cout << endl;
    return 0;
}`,
};

export default problem;
