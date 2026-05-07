import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'two-sum',
  title: 'Two Sum',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/two-sum/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement))
                return {seen[complement], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    auto res = sol.twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl; // [0, 1]
    return 0;
}`,
};

export default problem;
