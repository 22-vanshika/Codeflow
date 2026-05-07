import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'minimum-path-sum',
  title: 'Minimum Path Sum',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/minimum-path-sum/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid){
        int m=grid.size(),n=grid[0].size();
        for(int i=0;i<m;i++) for(int j=0;j<n;j++){
            if(i==0&&j==0) continue;
            else if(i==0) grid[i][j]+=grid[i][j-1];
            else if(j==0) grid[i][j]+=grid[i-1][j];
            else grid[i][j]+=min(grid[i-1][j],grid[i][j-1]);
        }
        return grid[m-1][n-1];
    }
};
int main(){
    Solution sol;
    vector<vector<int>> g={{1,3,1},{1,5,1},{4,2,1}};
    cout<<sol.minPathSum(g)<<endl; // 7
    return 0;
}`,
};
export default problem;
