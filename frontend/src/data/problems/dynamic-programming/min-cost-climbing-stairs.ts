import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'min-cost-climbing-stairs',
  title: 'Min Cost Climbing Stairs',
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
  description: 'You are given an integer array `cost` where `cost[i]` is the cost of `ith` step on a staircase. Once you pay the cost, you can either climb one or two steps.\n\nYou can either start from the step with index `0`, or the step with index `1`.\n\nReturn the minimum cost to reach the top of the floor.',
  examples: [
    {
      input: 'cost = [10,15,20]',
      output: '15',
      explanation: 'You will start at index 1.\n- Pay 15 and climb two steps to reach the top.\nThe total cost is 15.'
    },
    {
      input: 'cost = [1,100,1,1,1,100,1,1,100,1]',
      output: '6',
      explanation: 'You will start at index 0.\n- Pay 1 and climb two steps to reach index 2.\n- Pay 1 and climb two steps to reach index 4.\n- Pay 1 and climb two steps to reach index 6.\n- Pay 1 and climb one step to reach index 7.\n- Pay 1 and climb two steps to reach index 9.\n- Pay 1 and climb one step to reach the top.\nThe total cost is 6.'
    }
  ],
  constraints: [
    '2 <= cost.length <= 1000',
    '0 <= cost[i] <= 999'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int minCostClimbingStairs(vector<int>& cost){
        int n=cost.size();
        if (n < 2) return 0;
        vector<int> dp = cost;
        for(int i=2;i<n;i++) dp[i]+=min(dp[i-1],dp[i-2]);
        return min(dp[n-1],dp[n-2]);
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
