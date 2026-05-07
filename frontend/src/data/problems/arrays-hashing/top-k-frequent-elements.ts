import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'top-k-frequent-elements',
  title: 'Top K Frequent Elements',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/top-k-frequent-elements/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int n : nums) freq[n]++;

        // Bucket sort by frequency
        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& [num, cnt] : freq)
            buckets[cnt].push_back(num);

        vector<int> res;
        for (int i = (int)buckets.size() - 1; i >= 0 && (int)res.size() < k; i--)
            for (int n : buckets[i])
                res.push_back(n);
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 1, 1, 2, 2, 3};
    auto res = sol.topKFrequent(nums, 2);
    for (int n : res) cout << n << " "; // 1 2
    cout << endl;
    return 0;
}`,
};

export default problem;
