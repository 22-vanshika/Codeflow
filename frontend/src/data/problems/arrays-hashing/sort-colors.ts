import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'sort-colors',
  title: 'Sort Colors',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/sort-colors/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int lo=0, mid=0, hi=nums.size()-1;
        while (mid<=hi) {
            if      (nums[mid]==0) swap(nums[lo++], nums[mid++]);
            else if (nums[mid]==1) mid++;
            else                   swap(nums[mid], nums[hi--]);
        }
    }
};
int main() {
    Solution sol;
    vector<int> nums = {2,0,2,1,1,0};
    sol.sortColors(nums);
    for (int n : nums) cout << n << " "; // 0 0 1 1 2 2
    cout << endl;
    return 0;
}`,
};
export default problem;
