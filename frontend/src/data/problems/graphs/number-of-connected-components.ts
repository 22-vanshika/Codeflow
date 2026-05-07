import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'number-of-connected-components-in-an-undirected-graph',
  title: 'Number of Connected Components in an Undirected Graph',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
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
