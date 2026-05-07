import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'flood-fill',
  title: 'Flood Fill',
  difficulty: 'Easy',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/flood-fill/',
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
