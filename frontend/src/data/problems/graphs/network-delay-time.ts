import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'network-delay-time',
  title: 'Network Delay Time',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/network-delay-time/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k){
        vector<vector<pair<int,int>>> adj(n+1);
        for(auto&t:times) adj[t[0]].push_back({t[1],t[2]});
        vector<int> dist(n+1,INT_MAX);
        dist[k]=0;
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<>> pq;
        pq.push({0,k});
        while(!pq.empty()){
            auto[d,u]=pq.top();pq.pop();
            if(d>dist[u]) continue;
            for(auto[v,w]:adj[u]) if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;pq.push({dist[v],v});}
        }
        int mx=*max_element(dist.begin()+1,dist.end());
        return mx==INT_MAX?-1:mx;
    }
};
int main(){
    Solution sol;
    vector<vector<int>> t={{2,1,1},{2,3,1},{3,4,1}};
    cout<<sol.networkDelayTime(t,4,2)<<endl; // 2
    return 0;
}`,
};
export default problem;
