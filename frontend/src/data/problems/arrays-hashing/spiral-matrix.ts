import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'spiral-matrix',
  title: 'Spiral Matrix',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/spiral-matrix/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        int top=0, bottom=matrix.size()-1, left=0, right=matrix[0].size()-1;
        while (top<=bottom && left<=right) {
            for (int j=left; j<=right; j++) res.push_back(matrix[top][j]); top++;
            for (int i=top; i<=bottom; i++) res.push_back(matrix[i][right]); right--;
            if (top<=bottom) { for (int j=right; j>=left; j--) res.push_back(matrix[bottom][j]); bottom--; }
            if (left<=right) { for (int i=bottom; i>=top; i--) res.push_back(matrix[i][left]); left++; }
        }
        return res;
    }
};
int main() {
    Solution sol;
    vector<vector<int>> m = {{1,2,3},{4,5,6},{7,8,9}};
    for (int v : sol.spiralOrder(m)) cout << v << " "; // 1 2 3 6 9 8 7 4 5
    cout << endl;
    return 0;
}`,
};
export default problem;
