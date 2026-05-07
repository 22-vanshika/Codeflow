import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'move-zeroes',
  title: 'Move Zeroes',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/move-zeroes/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int pos = 0;
        for (int n : nums) if (n != 0) nums[pos++] = n;
        while (pos < (int)nums.size()) nums[pos++] = 0;
    }
};
int main() {
    Solution sol;
    vector<int> nums = {0,1,0,3,12};
    sol.moveZeroes(nums);
    for (int n : nums) cout << n << " "; // 1 3 12 0 0
    cout << endl;
    return 0;
}`,
};
export default problem;
