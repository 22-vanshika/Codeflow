import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'trapping-rain-water',
  title: 'Trapping Rain Water',
  difficulty: 'Hard',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/trapping-rain-water/',
  description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
  examples: [
    {
      input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
      output: '6',
      explanation: 'The elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.'
    },
    {
      input: 'height = [4,2,0,3,2,5]',
      output: '9'
    }
  ],
  constraints: [
    'n == height.length',
    '1 <= n <= 2 * 10^4',
    '0 <= height[i] <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1;
        int maxL = 0, maxR = 0, water = 0;
        while (l < r) {
            if (height[l] <= height[r]) {
                maxL = max(maxL, height[l]);
                water += maxL - height[l];
                l++;
            } else {
                maxR = max(maxR, height[r]);
                water += maxR - height[r];
                r--;
            }
        }
        return water;
    }
};

int main() {
    Solution sol;
    vector<int> height = {0,1,0,2,1,0,1,3,2,1,2,1};
    cout << sol.trap(height) << endl; // 6
    return 0;
}`,
};

export default problem;
