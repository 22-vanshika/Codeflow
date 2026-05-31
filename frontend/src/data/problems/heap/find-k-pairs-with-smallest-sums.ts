import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-k-pairs-with-smallest-sums',
  title: 'Find K Pairs with Smallest Sums',
  difficulty: 'Medium',
  category: 'Heap',
  url: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/',
  description: 'You are given two integer arrays `nums1` and `nums2` sorted in non-decreasing order and an integer `k`.\\n\\nDefine a pair `(u, v)` which consists of one element from `nums1` and one element from `nums2`.\\n\\nReturn the `k` pairs `(u1, v1), (u2, v2), ..., (uk, vk)` with the smallest sums.',
  examples: [
    {
      input: 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3',
      output: '[[1,2],[1,4],[1,6]]',
      explanation: 'The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]'
    },
    {
      input: 'nums1 = [1,1,2], nums2 = [1,2,3], k = 2',
      output: '[[1,1],[1,1]]'
    }
  ],
  constraints: [
    '1 <= nums1.length, nums2.length <= 10^5',
    '-10^9 <= nums1[i], nums2[i] <= 10^9',
    'nums1 and nums2 are sorted in non-decreasing order.',
    '1 <= k <= 10^4'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
        vector<vector<int>> res;
        if (nums1.empty() || nums2.empty() || k <= 0) return res;
        auto cmp = [&](pair<int, int>& a, pair<int, int>& b) {
            return nums1[a.first] + nums2[a.second] > nums1[b.first] + nums2[b.second];
        };
        priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> pq(cmp);
        for (int i = 0; i < min((int)nums1.size(), k); i++) pq.push({i, 0});
        
        while (k-- > 0 && !pq.empty()) {
            auto curr = pq.top(); pq.pop();
            res.push_back({nums1[curr.first], nums2[curr.second]});
            if (curr.second + 1 < (int)nums2.size()) {
                pq.push({curr.first, curr.second + 1});
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> n1 = {1,7,11}, n2 = {2,4,6};
    for (auto& p : sol.kSmallestPairs(n1, n2, 3)) cout << p[0] << "," << p[1] << " ";
    cout << endl; // 1,2 1,4 1,6
    return 0;
}`,
};

export default problem;
