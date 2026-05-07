import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: '3sum',
  title: '3Sum',
  difficulty: 'Medium',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/3sum/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = (int)nums.size() - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum == 0) {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                } else if (sum < 0) l++;
                else r--;
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    auto res = sol.threeSum(nums);
    for (auto& t : res)
        cout << "[" << t[0] << "," << t[1] << "," << t[2] << "]" << endl;
    return 0;
}`,
};

export default problem;
