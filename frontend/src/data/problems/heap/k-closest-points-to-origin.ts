import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'k-closest-points-to-origin',
  title: 'K Closest Points to Origin',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
  description: 'Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance `sqrt((x1 - x2)^2 + (y1 - y2)^2)`.\n\nYou may return the answer in any order. The answer is guaranteed to be unique (except for the order that it is in).',
  examples: [
    {
      input: 'points = [[1,3],[-2,2]], k = 1',
      output: '[[-2,2]]',
      explanation: 'The distance from (1, 3) to the origin is sqrt(10).\nThe distance from (-2, 2) to the origin is sqrt(8).\nSince sqrt(8) < sqrt(10), (-2, 2) is closer to the origin.'
    },
    {
      input: 'points = [[3,3],[5,-1],[-2,4]], k = 2',
      output: '[[-2,4],[3,3]]'
    }
  ],
  constraints: [
    '1 <= k <= points.length <= 10^4',
    '-10^4 <= xi, yi <= 10^4'
  ],
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
