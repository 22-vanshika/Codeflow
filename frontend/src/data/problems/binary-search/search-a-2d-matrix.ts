import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'search-a-2d-matrix',
  title: 'Search a 2D Matrix',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/search-a-2d-matrix/',
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
