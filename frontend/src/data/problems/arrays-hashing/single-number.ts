import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'single-number',
  title: 'Single Number',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/single-number/',
  description: 'Given a **non-empty** array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
  examples: [
    {
      input: 'nums = [2,2,1]',
      output: '1'
    },
    {
      input: 'nums = [4,1,2,1,2]',
      output: '4'
    },
    {
      input: 'nums = [1]',
      output: '1'
    }
  ],
  constraints: [
    '1 <= nums.length <= 3 * 10^4',
    '-3 * 10^4 <= nums[i] <= 3 * 10^4',
    'Each element in the array appears twice except for one element which appears only once.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for (int n : nums) res ^= n;
        return res;
    }
};
int main() {
    Solution sol;
    vector<int> a = {2,2,1};
    vector<int> b = {4,1,2,1,2};
    cout << sol.singleNumber(a) << endl; // 1
    cout << sol.singleNumber(b) << endl; // 4
    return 0;
}`,
};
export default problem;
