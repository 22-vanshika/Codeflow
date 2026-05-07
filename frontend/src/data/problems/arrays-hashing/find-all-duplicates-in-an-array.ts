import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'find-all-duplicates-in-an-array',
  title: 'Find All Duplicates in an Array',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        vector<int> res;
        for (int n : nums) {
            int idx = abs(n) - 1;
            if (nums[idx] < 0) res.push_back(abs(n));
            else nums[idx] = -nums[idx];
        }
        return res;
    }
};
int main() {
    Solution sol;
    vector<int> nums = {4,3,2,7,8,2,3,1};
    for (int v : sol.findDuplicates(nums)) cout << v << " "; // 2 3
    cout << endl;
    return 0;
}`,
};
export default problem;
