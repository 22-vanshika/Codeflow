import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-if-path-exists-in-graph',
  title: 'Find if Path Exists in Graph',
  difficulty: 'Easy',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/',
  description: 'There is a **bi-directional** graph with `n` vertices, where each vertex is labeled from `0` to `n - 1`. The edges in the graph are represented as a 2D integer array `edges`, where each `edges[i] = [ui, vi]` denotes a bi-directional edge between vertex `ui` and vertex `vi`. Every vertex pair is connected by **at most one** edge, and no vertex has an edge to itself.\n\nYou want to determine if there is a **valid path** that exists from vertex `source` to vertex `destination`.\n\nGiven `edges` and the integers `n`, `source`, and `destination`, return `true` if there is a **valid path** from `source` to `destination`, or `false` otherwise.',
  examples: [
    {
      input: 'n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2',
      output: 'true',
      explanation: 'There are two paths from vertex 0 to vertex 2:\n- 0 -> 1 -> 2\n- 0 -> 2'
    },
    {
      input: 'n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5',
      output: 'false',
      explanation: 'There is no path from vertex 0 to vertex 5.'
    }
  ],
  constraints: [
    '1 <= n <= 2 * 10^5',
    '0 <= edges.length <= 2 * 10^5',
    'edges[i].length == 2',
    '0 <= ui, vi <= n - 1',
    'ui != vi',
    '0 <= source, destination <= n - 1',
    'There are no duplicate edges.',
    'There are no self edges.'
  ],
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
