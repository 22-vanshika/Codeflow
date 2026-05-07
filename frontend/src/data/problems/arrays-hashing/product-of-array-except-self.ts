import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'product-of-array-except-self',
  title: 'Product of Array Except Self',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/product-of-array-except-self/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> res(n, 1);

        // Left prefix products
        int prefix = 1;
        for (int i = 0; i < n; i++) {
            res[i] = prefix;
            prefix *= nums[i];
        }

        // Right suffix products
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= suffix;
            suffix *= nums[i];
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 2, 3, 4};
    auto res = sol.productExceptSelf(nums);
    for (int n : res) cout << n << " "; // 24 12 8 6
    cout << endl;
    return 0;
}`,
};

export default problem;
