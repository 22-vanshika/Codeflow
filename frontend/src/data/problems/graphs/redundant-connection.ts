import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'redundant-connection',
  title: 'Redundant Connection',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/redundant-connection/',
  description: 'In this problem, a tree is an **undirected graph** that is connected and has no cycles.\n\nYou are given a graph that started as a tree with `n` nodes labeled from `1` to `n`, with one additional edge added. The added edge has two **different** vertices chosen from `1` to `n`, and was not an edge that already existed. The resulting graph is given as a 2D-array of `edges`. Each element of `edges` is a pair `[ui, vi]` that represents an **undirected** edge between nodes `ui` and `vi`.\n\nReturn an edge that can be removed so that the resulting graph is a tree of `n` nodes. If there are multiple answers, return the answer that occurs last in the input.',
  examples: [
    {
      input: 'edges = [[1,2],[1,3],[2,3]]',
      output: '[2,3]'
    },
    {
      input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]',
      output: '[1,4]'
    }
  ],
  constraints: [
    'n == edges.length',
    '3 <= n <= 1000',
    'edges[i].length == 2',
    '1 <= ui < vi <= n',
    'ui != vi',
    'There are no repeated edges.',
    'The given graph is connected.'
  ],
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
