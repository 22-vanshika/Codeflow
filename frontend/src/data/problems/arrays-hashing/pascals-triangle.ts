import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'pascals-triangle',
  title: "Pascal's Triangle",
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/pascals-triangle/',
  description: 'Given an integer `numRows`, return the first `numRows` of Pascal\'s triangle.\n\nIn Pascal\'s triangle, each number is the sum of the two numbers directly above it.',
  examples: [
    {
      input: 'numRows = 5',
      output: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]'
    },
    {
      input: 'numRows = 1',
      output: '[[1]]'
    }
  ],
  constraints: [
    '1 <= numRows <= 30'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> res;
        for (int i = 0; i < numRows; i++) {
            vector<int> row(i+1, 1);
            for (int j = 1; j < i; j++)
                row[j] = res[i-1][j-1] + res[i-1][j];
            res.push_back(row);
        }
        return res;
    }
};

int main() {
    Solution sol;
    for (auto& row : sol.generate(5)) {
        for (int v : row) cout << v << " ";
        cout << endl;
    }
    return 0;
}`,
};

export default problem;
