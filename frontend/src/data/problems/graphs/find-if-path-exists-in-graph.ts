import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'find-if-path-exists-in-graph',
  title: 'Find if Path Exists in Graph',
  difficulty: 'Easy',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool validPath(int n, vector<vector<int>>& edges, int source, int destination){
        vector<vector<int>> adj(n);
        for(auto&e:edges){adj[e[0]].push_back(e[1]);adj[e[1]].push_back(e[0]);}
        vector<bool> vis(n,false);
        queue<int> q; q.push(source); vis[source]=true;
        while(!q.empty()){
            int u=q.front();q.pop();
            if(u==destination)return true;
            for(int v:adj[u])if(!vis[v]){vis[v]=true;q.push(v);}
        }
        return false;
    }
};
int main(){
    Solution sol;
    vector<vector<int>> e={{0,1},{1,2},{2,0}};
    cout<<boolalpha<<sol.validPath(3,e,0,2)<<endl; // true
    return 0;
}`,
};
export default problem;
