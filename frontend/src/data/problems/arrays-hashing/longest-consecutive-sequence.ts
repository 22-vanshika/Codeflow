import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'longest-consecutive-sequence',
  title: 'Longest Consecutive Sequence',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int longest = 0;
        for (int n : numSet) {
            // Only start from the beginning of a sequence
            if (!numSet.count(n - 1)) {
                int length = 1;
                while (numSet.count(n + length)) length++;
                longest = max(longest, length);
            }
        }
        return longest;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {100, 4, 200, 1, 3, 2};
    cout << sol.longestConsecutive(nums) << endl; // 4  (1,2,3,4)
    return 0;
}`,
};

export default problem;
