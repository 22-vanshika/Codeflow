import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'height-checker',
  title: 'Height Checker',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/height-checker/',
  description: 'A school is trying to take an annual photo of all the students. The students are asked to stand in a single file line in non-decreasing order by height. Return the number of indices where `heights[i] != expected[i]`.',
  examples: [
    {
      input: 'heights = [1,1,4,2,1,3]',
      output: '3',
      explanation: 'heights:  [1,1,4,2,1,3]\nexpected: [1,1,1,2,3,4]\nIndices 2, 4, and 5 do not match.'
    }
  ],
  constraints: [
    '1 <= heights.length <= 100',
    '1 <= heights[i] <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int heightChecker(vector<int>& heights) {
        vector<int> expected = heights;
        sort(expected.begin(), expected.end());
        int count = 0;
        for (int i = 0; i < heights.size(); i++) {
            if (heights[i] != expected[i]) {
                count++;
            }
        }
        return count;
    }
};

int main() {
    Solution sol;
    vector<int> heights = {1, 1, 4, 2, 1, 3};
    cout << sol.heightChecker(heights) << endl; // 3
    return 0;
}`,
};

export default problem;
