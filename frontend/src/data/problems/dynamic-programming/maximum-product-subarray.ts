import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'maximum-product-subarray',
  title: 'Maximum Product Subarray',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/maximum-product-subarray/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maxProd = nums[0], minProd = nums[0], res = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            int n = nums[i];
            int tempMax = max({n, maxProd * n, minProd * n});
            minProd     = min({n, maxProd * n, minProd * n});
            maxProd = tempMax;
            res = max(res, maxProd);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2,3,-2,4};
    cout << sol.maxProduct(nums) << endl; // 6
    vector<int> nums2 = {-2,0,-1};
    cout << sol.maxProduct(nums2) << endl; // 0
    return 0;
}`,
};

export default problem;
