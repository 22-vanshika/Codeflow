import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/contains-duplicate/',
  description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
  examples: [
    {
      input: 'nums = [1,2,3,1]',
      output: 'true',
      explanation: 'The element 1 occurs at indices 0 and 3.'
    },
    {
      input: 'nums = [1,2,3,4]',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    '-10^9 <= nums[i] <= 10^9'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (seen.count(n)) return true;
            seen.insert(n);
        }
        return false;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<int> a = {1, 2, 3, 1};
    vector<int> b = {1, 2, 3, 4};
    cout << sol.containsDuplicate(a) << endl; // true
    cout << sol.containsDuplicate(b) << endl; // false
    return 0;
}`,
};

export default problem;
