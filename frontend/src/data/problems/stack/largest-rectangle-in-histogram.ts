import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'largest-rectangle-in-histogram',
  title: 'Largest Rectangle in Histogram',
  difficulty: 'Hard',
  category: 'Stack',
  url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
  description: 'Given an array of integers `heights` representing the histogram\'s bar height where the width of each bar is `1`, return the area of the largest rectangle in the histogram.',
  examples: [
    {
      input: 'heights = [2,1,5,6,2,3]',
      output: '10'
    },
    {
      input: 'heights = [2,4]',
      output: '4'
    }
  ],
  constraints: [
    '1 <= heights.length <= 10^5',
    '0 <= heights[i] <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        stack<int> st;
        int maxArea = 0;
        heights.push_back(0); // sentinel

        for (int i = 0; i < (int)heights.size(); i++) {
            int start = i;
            while (!st.empty() && heights[st.top()] > heights[i]) {
                int idx = st.top(); st.pop();
                maxArea = max(maxArea, heights[idx] * (i - idx));
                start = idx;
            }
            st.push(start);
        }
        return maxArea;
    }
};

int main() {
    Solution sol;
    vector<int> heights = {2,1,5,6,2,3};
    cout << sol.largestRectangleArea(heights) << endl; // 10
    return 0;
}`,
};

export default problem;
