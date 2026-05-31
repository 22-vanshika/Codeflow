import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'k-closest-points-to-origin',
  title: 'K Closest Points to Origin',
  difficulty: 'Medium',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
  description: 'Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.',
  examples: [
    {
      input: 'points = [[1,3],[-2,2]], k = 1',
      output: '[[-2,2]]',
      explanation: 'The distance between (1, 3) and the origin is sqrt(10). The distance between (-2, 2) and the origin is sqrt(8). Since sqrt(8) < sqrt(10), (-2, 2) is closer.'
    }
  ],
  constraints: [
    '1 <= k <= points.length <= 10^4',
    '-10^4 <= xi, yi <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
private:
    int dist(vector<int>& p) {
        return p[0] * p[0] + p[1] * p[1];
    }
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        int n = points.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (dist(points[j]) < dist(points[minIdx])) {
                    minIdx = j;
                }
            }
            swap(points[i], points[minIdx]);
        }
        vector<vector<int>> res;
        for (int i = 0; i < k; i++) {
            res.push_back(points[i]);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<vector<int>> points = {{1, 3}, {-2, 2}};
    vector<vector<int>> res = sol.kClosest(points, 1);
    for (int i = 0; i < res.size(); i++) {
        cout << res[i][0] << " " << res[i][1] << endl;
    }
    return 0;
}`,
};

export default problem;
