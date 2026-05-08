import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'search-a-2d-matrix',
  title: 'Search a 2D Matrix',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/search-a-2d-matrix/',
  description: 'Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix`. This matrix has the following properties:\n- Integers in each row are sorted from left to right.\n- The first integer of each row is greater than the last integer of the previous row.',
  examples: [
    {
      input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
      output: 'true'
    },
    {
      input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13',
      output: 'false'
    }
  ],
  constraints: [
    'm == matrix.length',
    'n == matrix[i].length',
    '1 <= m, n <= 100',
    '-10^4 <= matrix[i][j], target <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int l = 0, r = m * n - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            int val = matrix[mid / n][mid % n];
            if (val == target) return true;
            else if (val < target) l = mid + 1;
            else r = mid - 1;
        }
        return false;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<vector<int>> mat = {{1,3,5,7},{10,11,16,20},{23,30,34,60}};
    cout << sol.searchMatrix(mat, 3)  << endl; // true
    cout << sol.searchMatrix(mat, 13) << endl; // false
    return 0;
}`,
};

export default problem;
