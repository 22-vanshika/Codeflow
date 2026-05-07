import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'k-closest-points-to-origin',
  title: 'K Closest Points to Origin',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        // Max-heap of size k
        auto cmp = [](const vector<int>& a, const vector<int>& b) {
            return a[0]*a[0]+a[1]*a[1] < b[0]*b[0]+b[1]*b[1];
        };
        priority_queue<vector<int>, vector<vector<int>>, decltype(cmp)> maxHeap(cmp);
        for (auto& p : points) {
            maxHeap.push(p);
            if ((int)maxHeap.size() > k) maxHeap.pop();
        }
        vector<vector<int>> res;
        while (!maxHeap.empty()) { res.push_back(maxHeap.top()); maxHeap.pop(); }
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> pts = {{1,3},{-2,2}};
    auto res = sol.kClosest(pts, 1);
    for (auto& p : res) cout << "[" << p[0] << "," << p[1] << "]" << endl; // [-2,2]
    return 0;
}`,
};

export default problem;
