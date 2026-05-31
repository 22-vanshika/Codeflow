import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'number-of-connected-components-in-an-undirected-graph',
  title: 'Number of Connected Components in an Undirected Graph',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
  description: 'You have a graph of `n` nodes. You are given an integer `n` and an array `edges` where `edges[i] = [ai, bi]` indicates that there is an edge between `ai` and `bi` in the graph.\n\nReturn the number of connected components in the graph.',
  examples: [
    {
      input: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
      output: '2'
    },
    {
      input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]',
      output: '1'
    }
  ],
  constraints: [
    '1 <= n <= 2000',
    '1 <= edges.length <= 5000',
    'edges[i].length == 2',
    '0 <= ai <= bi < n',
    'ai != bi',
    'There are no repeated edges.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    vector<int> parent, rnk;
    int find(int x){return parent[x]==x?x:parent[x]=find(parent[x]);}
    bool unite(int a,int b){
        int pa=find(a),pb=find(b);
        if(pa==pb)return false;
        if(rnk[pa]<rnk[pb])swap(pa,pb);
        parent[pb]=pa;
        if(rnk[pa]==rnk[pb])rnk[pa]++;
        return true;
    }
public:
    int countComponents(int n, vector<vector<int>>& edges){
        parent.clear(); rnk.clear();
        parent.resize(n); rnk.resize(n,0);
        for(int i=0;i<n;i++)parent[i]=i;
        int comp=n;
        for(auto&e:edges)if(unite(e[0],e[1]))comp--;
        return comp;
    }
};

int main(){
    Solution sol;
    vector<vector<int>> e={{0,1},{1,2},{3,4}};
    cout<<sol.countComponents(5,e)<<endl; // 2
    return 0;
}`,
};

export default problem;
