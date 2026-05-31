import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'last-stone-weight',
  title: 'Last Stone Weight',
  difficulty: 'Easy',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/last-stone-weight/',
  description: 'You are given an array of integers `stones` where `stones[i]` is the weight of the `i-th` stone.\n\nWe are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x <= y`. The result of this smash is:\n- If `x == y`, both stones are destroyed.\n- If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`.\n\nAt the end of the game, there is at most one stone left. Return the weight of the last remaining stone. If there are no stones left, return `0`.',
  examples: [
    {
      input: 'stones = [2,7,4,1,8,1]',
      output: '1',
      explanation: 'We combine 7 and 8 to get 1, so the array becomes [2,4,1,1,1].\nWe combine 2 and 4 to get 2, so the array becomes [2,1,1,1].\nWe combine 2 and 1 to get 1, so the array becomes [1,1,1].\nWe combine 1 and 1 to get 0, so the array becomes [1].\nFinally, we return 1.'
    }
  ],
  constraints: [
    '1 <= stones.length <= 30',
    '1 <= stones[i] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        priority_queue<int> maxHeap(stones.begin(), stones.end());
        while (maxHeap.size() > 1) {
            int y = maxHeap.top(); maxHeap.pop();
            int x = maxHeap.top(); maxHeap.pop();
            if (y != x) maxHeap.push(y - x);
        }
        return maxHeap.empty() ? 0 : maxHeap.top();
    }
};

int main() {
    Solution sol;
    vector<int> stones = {2,7,4,1,8,1};
    cout << sol.lastStoneWeight(stones) << endl; // 1
    return 0;
}`,
};

export default problem;
