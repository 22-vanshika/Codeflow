import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'rotate-array',
  title: 'Rotate Array',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/rotate-array/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};
int main() {
    Solution sol;
    vector<int> nums = {1,2,3,4,5,6,7};
    sol.rotate(nums, 3);
    for (int n : nums) cout << n << " "; // 5 6 7 1 2 3 4
    cout << endl;
    return 0;
}`,
};
export default problem;
