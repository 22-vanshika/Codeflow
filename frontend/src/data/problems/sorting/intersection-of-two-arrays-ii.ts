import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'intersection-of-two-arrays-ii',
  title: 'Intersection of Two Arrays II',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/intersection-of-two-arrays-ii/',
  description: 'Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays and you may return the result in any order.',
  examples: [
    {
      input: 'nums1 = [1,2,2,1], nums2 = [2,2]',
      output: '[2,2]',
      explanation: '2 appears twice in both arrays.'
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
    vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
        unordered_map<int, int> counts;
        for (int x : nums1) {
            counts[x]++;
        }
        vector<int> res;
        for (int x : nums2) {
            if (counts[x] > 0) {
                res.push_back(x);
                counts[x]--;
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums1 = {1, 2, 2, 1};
    vector<int> nums2 = {2, 2};
    vector<int> res = sol.intersect(nums1, nums2);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
