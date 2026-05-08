import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'maximal-square',
  title: 'Maximal Square',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/maximal-square/',
  description: 'Given an `m x n` binary `matrix` filled with `0`s and `1`s, find the largest square containing only `1`s and return its area.',
  examples: [
    {
      input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
      output: '4'
    },
    {
      input: 'matrix = [["0","1"],["1","0"]]',
      output: '1'
    },
    {
      input: 'matrix = [["0"]]',
      output: '0'
    }
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[i].length',
    '1 <= m, n <= 300',
    'matrix[i][j] is \'0\' or \'1\'.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix){
        int m=matrix.size(),n=matrix[0].size(),maxSide=0;
        vector<vector<int>> dp(m+1,vector<int>(n+1,0));
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
            if(matrix[i-1][j-1]=='1'){
                dp[i][j]=min({dp[i-1][j],dp[i][j-1],dp[i-1][j-1]})+1;
                maxSide=max(maxSide,dp[i][j]);
            }
        }
        return maxSide*maxSide;
    }
};
int main(){
    Solution sol;
    vector<vector<char>> m={{'1','0','1','0','0'},{'1','0','1','1','1'},{'1','1','1','1','1'},{'1','0','0','1','0'}};
    cout<<sol.maximalSquare(m)<<endl; // 4
    return 0;
}`,
};
export default problem;
