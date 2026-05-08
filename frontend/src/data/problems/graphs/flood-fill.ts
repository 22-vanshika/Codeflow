import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'flood-fill',
  title: 'Flood Fill',
  difficulty: 'Easy',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/flood-fill/',
  description: 'An `image` is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value of the image.\n\nYou are also given three integers `sr`, `sc`, and `color`. You should perform a **flood fill** on the image starting from the pixel `image[sr][sc]`.\n\nTo perform a **flood fill**, consider the starting pixel, plus any pixels connected **4-directionally** to the starting pixel of the same color as the starting pixel, plus any pixels connected **4-directionally** to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with `color`.\n\nReturn the modified image after performing the flood fill.',
  examples: [
    {
      input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
      output: '[[2,2,2],[2,2,0],[2,0,1]]',
      explanation: 'From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel), all pixels connected by a path of the same color as the starting pixel (i.e., the blue pixels) are colored with the new color. Note the bottom corner is not colored 2, because it is not 4-directionally connected to the starting pixel.'
    },
    {
      input: 'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0',
      output: '[[0,0,0],[0,0,0]]',
      explanation: 'The starting pixel is already colored 0, so no changes are made to the image.'
    }
  ],
  constraints: [
    'm == image.length',
    'n == image[i].length',
    '1 <= m, n <= 50',
    '0 <= image[i][j], color < 2^16',
    '0 <= sr < m',
    '0 <= sc < n'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    void dfs(vector<vector<int>>&img,int i,int j,int orig,int color){
        if(i<0||i>=(int)img.size()||j<0||j>=(int)img[0].size()||img[i][j]!=orig) return;
        img[i][j]=color;
        dfs(img,i+1,j,orig,color);dfs(img,i-1,j,orig,color);
        dfs(img,i,j+1,orig,color);dfs(img,i,j-1,orig,color);
    }
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image,int sr,int sc,int color){
        if(image[sr][sc]!=color) dfs(image,sr,sc,image[sr][sc],color);
        return image;
    }
};

int main(){
    vector<vector<int>> img={{1,1,1},{1,1,0},{1,0,1}};
    Solution sol;
    for(auto&r:sol.floodFill(img,1,1,2)){for(int v:r)cout<<v<<" ";cout<<endl;}
    return 0;
}`,
};

export default problem;
