import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'network-delay-time',
  title: 'Network Delay Time',
  difficulty: 'Medium',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/network-delay-time/',
  description: 'You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = [ui, vi, wi]`, where `ui` is the source node, `vi` is the target node, and `wi` is the time it takes for a signal to travel from source to target.\n\nWe will send a signal from a given node `k`. Return the **minimum** time it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.',
  examples: [
    {
      input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2',
      output: '2'
    },
    {
      input: 'times = [[1,2,1]], n = 2, k = 1',
      output: '1'
    },
    {
      input: 'times = [[1,2,1]], n = 2, k = 2',
      output: '-1'
    }
  ],
  constraints: [
    '1 <= k <= n <= 100',
    '1 <= times.length <= 6000',
    'times[i].length == 3',
    '1 <= ui, vi <= n',
    'ui != vi',
    '0 <= wi <= 100',
    'All the pairs (ui, vi) are unique. (i.e., no multiple edges)'
  ],
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
