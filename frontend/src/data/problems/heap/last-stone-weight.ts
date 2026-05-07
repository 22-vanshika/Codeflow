import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'last-stone-weight',
  title: 'Last Stone Weight',
  difficulty: 'Easy',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/last-stone-weight/',
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
