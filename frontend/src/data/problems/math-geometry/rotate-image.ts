import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'rotate-image',
  title: 'Rotate Image',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/rotate-image/',
  description: 'You are given an `n x n` 2D `matrix` representing an image, rotate the image by **90 degrees (clockwise)**.\n\nYou have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.',
  examples: [
    {
      input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
      output: '[[7,4,1],[8,5,2],[9,6,3]]'
    },
    {
      input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
      output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]'
    }
  ],
  constraints: [
    'n == matrix.length == matrix[i].length',
    '1 <= n <= 20',
    '-1000 <= matrix[i][j] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void rotate(vector<vector<int>>& m){
        int n=m.size();
        for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) swap(m[i][j]);
        for(auto&r:m) reverse(r.begin(),r.end());
    }
};

int main(){
    Solution sol;
    vector<vector<int>> m={{1,2,3},{4,5,6},{7,8,9}};
    sol.rotate(m);
    for(auto&r:m){for(int v:r)cout<<v<<" ";cout<<endl;}
    return 0;
}`,
};

export default problem;
