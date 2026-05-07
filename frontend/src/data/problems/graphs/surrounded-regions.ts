import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'surrounded-regions',
  title: 'Surrounded Regions',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/surrounded-regions/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    void dfs(vector<vector<char>>&b,int i,int j){
        int m=b.size(),n=b[0].size();
        if(i<0||i>=m||j<0||j>=n||b[i][j]!='O') return;
        b[i][j]='S';
        dfs(b,i+1,j);dfs(b,i-1,j);dfs(b,i,j+1);dfs(b,i,j-1);
    }
public:
    void solve(vector<vector<char>>& board){
        int m=board.size(),n=board[0].size();
        for(int i=0;i<m;i++){dfs(board,i,0);dfs(board,i,n-1);}
        for(int j=0;j<n;j++){dfs(board,0,j);dfs(board,m-1,j);}
        for(auto&r:board) for(auto&c:r) c=(c=='S'?'O':'X');
    }
};
int main(){
    vector<vector<char>> b={{'X','X','X','X'},{'X','O','O','X'},{'X','X','O','X'},{'X','O','X','X'}};
    Solution sol; sol.solve(b);
    for(auto&r:b){for(char c:r)cout<<c<<" ";cout<<endl;}
    return 0;
}`,
};
export default problem;
