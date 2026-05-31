import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'maximum-product-subarray',
  title: 'Maximum Product Subarray',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/maximum-product-subarray/',
  description: 'Given an integer array `nums`, find a **subarray** that has the largest product, and return the product.\n\nThe test cases are generated so that the answer will fit in a **32-bit** integer.',
  examples: [
    {
      input: 'nums = [2,3,-2,4]',
      output: '6',
      explanation: '[2,3] has the largest product 6.'
    },
    {
      input: 'nums = [-2,0,-1]',
      output: '0',
      explanation: 'The result cannot be 2, because [-2,-1] is not a subarray.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 2 * 10^4',
    '-10 <= nums[i] <= 10',
    'The product of any subarray of nums is guaranteed to fit in a 32-bit integer.'
  ],
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
