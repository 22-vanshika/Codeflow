import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'house-robber-ii',
  title: 'House Robber II',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/house-robber-ii/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
    int robRange(vector<int>& nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1; prev1 = curr;
        }
        return prev1;
    }
public:
    int rob(vector<int>& nums) {
        if (nums.size() == 1) return nums[0];
        int n = nums.size();
        return max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));
    }
};

int main() {
    Solution sol;
    vector<int> a = {2,3,2};
    vector<int> b = {1,2,3,1};
    cout << sol.rob(a) << endl; // 3
    cout << sol.rob(b) << endl; // 4
    return 0;
}`,
};

export default problem;
