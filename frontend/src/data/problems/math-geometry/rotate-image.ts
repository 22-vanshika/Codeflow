import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'rotate-image',
  title: 'Rotate Image',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/rotate-image/',
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
