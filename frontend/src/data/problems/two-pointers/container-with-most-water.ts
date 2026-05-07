import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  difficulty: 'Medium',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/container-with-most-water/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, maxWater = 0;
        while (l < r) {
            int water = min(height[l], height[r]) * (r - l);
            maxWater = max(maxWater, water);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxWater;
    }
};

int main() {
    Solution sol;
    vector<int> height = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << sol.maxArea(height) << endl; // 49
    return 0;
}`,
};

export default problem;
