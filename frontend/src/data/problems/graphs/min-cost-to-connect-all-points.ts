import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'min-cost-to-connect-all-points',
  title: 'Min Cost to Connect All Points',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/',
  description: 'You are given an array `points` representing the integer coordinates of some points on a 2D-plane, where `points[i] = [xi, yi]`.\n\nThe cost of connecting two points `[xi, yi]` and `[xj, yj]` is the **manhattan distance** between them: `|xi - xj| + |yi - yj|`, where `|val|` is the absolute value of `val`.\n\nReturn the minimum cost to make all points connected. All points are connected if there is **exactly one** simple path between any two points.',
  examples: [
    {
      input: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]',
      output: '20',
      explanation: 'Connect [0,0] with [2,2] (cost 4), [2,2] with [5,2] (cost 3), [5,2] with [7,0] (cost 4), [2,2] with [3,10] (cost 9). Total cost is 20.'
    },
    {
      input: 'points = [[3,12],[-2,5],[-4,1]]',
      output: '18'
    }
  ],
  constraints: [
    '1 <= points.length <= 1000',
    '-10^6 <= xi, yi <= 10^6',
    'All pairs (xi, yi) are distinct.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int minCostConnectPoints(vector<vector<int>>& points){
        int n=points.size(), res=0, edges=0;
        vector<int> dist(n,INT_MAX); dist[0]=0;
        vector<bool> visited(n,false);
        while(edges<n){
            int u=-1;
            for(int i=0;i<n;i++) if(!visited[i]&&(u==-1||dist[i]<dist[u])) u=i;
            visited[u]=true; res+=dist[u]; edges++;
            for(int v=0;v<n;v++) if(!visited[v]){
                int d=abs(points[u][0]-points[v][0])+abs(points[u][1]-points[v][1]);
                dist[v]=min(dist[v],d);
            }
        }
        return res;
    }
};

int main(){
    Solution sol;
    vector<vector<int>> pts={{0,0},{2,2},{3,10},{5,2},{7,0}};
    cout<<sol.minCostConnectPoints(pts)<<endl; // 20
    return 0;
}`,
};

export default problem;
