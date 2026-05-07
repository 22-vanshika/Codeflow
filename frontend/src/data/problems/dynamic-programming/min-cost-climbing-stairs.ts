import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'min-cost-climbing-stairs',
  title: 'Min Cost Climbing Stairs',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost){
        int n=cost.size();
        for(int i=2;i<n;i++) cost[i]+=min(cost[i-1],cost[i-2]);
        return min(cost[n-1],cost[n-2]);
    }
};
int main(){
    Solution sol;
    vector<int> c={10,15,20};
    cout<<sol.minCostClimbingStairs(c)<<endl; // 15
    return 0;
}`,
};
export default problem;
