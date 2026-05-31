import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'majority-element',
  title: 'Majority Element',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/majority-element/',
  description: 'Given an array `nums` of size `n`, return the majority element. The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.',
  examples: [
    {
      input: 'nums = [3,2,3]',
      output: '3'
    },
    {
      input: 'nums = [2,2,1,1,1,2,2]',
      output: '2'
    }
  ],
  constraints: [
    'n == nums.length',
    '1 <= n <= 5 * 10^4',
    '-10^9 <= nums[i] <= 10^9'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = nums[0], count = 1;
        for (int i = 1; i < (int)nums.size(); i++) {
            if (count == 0) { candidate = nums[i]; count = 1; }
            else if (nums[i] == candidate) count++;
            else count--;
        }
        return candidate;
    }
};
int main() {
    Solution sol;
    vector<int> a = {3,2,3};
    cout << sol.majorityElement(a) << endl; // 3
    return 0;
}`,
};
export default problem;
