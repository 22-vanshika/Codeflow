import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'best-time-to-buy-and-sell-stock',
  title: 'Best Time to Buy and Sell Stock',
  difficulty: 'Easy',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
  examples: [
    {
      input: 'prices = [7,1,5,3,6,4]',
      output: '5',
      explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
    },
    {
      input: 'prices = [7,6,4,3,1]',
      output: '0',
      explanation: 'In this case, no transactions are done and the max profit = 0.'
    }
  ],
  constraints: [
    '1 <= prices.length <= 10^5',
    '0 <= prices[i] <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX, maxProfit = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
};

int main() {
    Solution sol;
    vector<int> prices = {7, 1, 5, 3, 6, 4};
    cout << sol.maxProfit(prices) << endl; // 5
    return 0;
}`,
};

export default problem;
