import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'redundant-connection',
  title: 'Redundant Connection',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/redundant-connection/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    vector<int> parent, rank_;
    int find(int x){ return parent[x]==x?x:parent[x]=find(parent[x]); }
    bool unite(int a,int b){
        int pa=find(a),pb=find(b);
        if(pa==pb) return false;
        if(rank_[pa]<rank_[pb]) swap(pa,pb);
        parent[pb]=pa;
        if(rank_[pa]==rank_[pb]) rank_[pa]++;
        return true;
    }
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges){
        int n=edges.size();
        parent.resize(n+1); rank_.resize(n+1,0);
        for(int i=0;i<=n;i++) parent[i]=i;
        for(auto&e:edges) if(!unite(e[0],e[1])) return e;
        return {};
    }
};
int main(){
    Solution sol;
    vector<vector<int>> e={{1,2},{1,3},{2,3}};
    auto r=sol.findRedundantConnection(e);
    cout<<r[0]<<" "<<r[1]<<endl; // 2 3
    return 0;
}`,
};
export default problem;
