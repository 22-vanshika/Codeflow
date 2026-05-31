import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'intersection-of-two-arrays',
  title: 'Intersection of Two Arrays',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/intersection-of-two-arrays/',
  description: 'Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.',
  examples: [
    {
      input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
      output: '[2]',
      explanation: 'The only common element is 2.'
    }
  ],
  constraints: [
    '1 <= nums1.length, nums2.length <= 1000',
    '0 <= nums1[i], nums2[i] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        unordered_set<int> s1;
        for (int x : nums1) {
            s1.insert(x);
        }
        unordered_set<int> res_set;
        for (int x : nums2) {
            if (s1.count(x)) {
                res_set.insert(x);
            }
        }
        vector<int> res;
        for (int x : res_set) {
            res.push_back(x);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums1 = {1, 2, 2, 1};
    vector<int> nums2 = {2, 2};
    vector<int> res = sol.intersection(nums1, nums2);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
