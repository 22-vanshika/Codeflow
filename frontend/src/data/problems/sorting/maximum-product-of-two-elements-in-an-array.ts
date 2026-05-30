import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'maximum-product-of-two-elements-in-an-array',
  title: 'Maximum Product of Two Elements in an Array',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/',
  description: 'Given the array of integers `nums`, you will choose two different indices `i` and `j` of that array. Return the maximum value of `(nums[i]-1)*(nums[j]-1)`.',
  examples: [
    {
      input: 'nums = [3,4,5,2]',
      output: '12',
      explanation: 'Choosing indices 1 and 2, we get (4-1)*(5-1) = 12.'
    }
  ],
  constraints: [
    '2 <= nums.length <= 500',
    '1 <= nums[i] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int m1 = 0, m2 = 0;
        for (int x : nums) {
            if (x > m1) {
                m2 = m1;
                m1 = x;
            } else if (x > m2) {
                m2 = x;
            }
        }
        return (m1 - 1) * (m2 - 1);
    }
};

int main() {
    Solution sol;
    vector<int> nums = {3, 4, 5, 2};
    cout << sol.maxProduct(nums) << endl; // 12
    return 0;
}`,
};

export default problem;
