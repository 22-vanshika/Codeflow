import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  difficulty: 'Medium',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/container-with-most-water/',
  description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
  examples: [
    {
      input: 'height = [1,8,6,2,5,4,8,3,7]',
      output: '49',
      explanation: 'The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.'
    },
    {
      input: 'height = [1,1]',
      output: '1'
    }
  ],
  constraints: [
    'n == height.length',
    '2 <= n <= 10^5',
    '0 <= height[i] <= 10^4'
  ],
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
