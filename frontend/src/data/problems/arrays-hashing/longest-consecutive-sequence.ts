import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'longest-consecutive-sequence',
  title: 'Longest Consecutive Sequence',
  difficulty: 'Medium',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/longest-consecutive-sequence/',
  description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in `O(n)` time.',
  examples: [
    {
      input: 'nums = [100,4,200,1,3,2]',
      output: '4',
      explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.'
    },
    {
      input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
      output: '9'
    }
  ],
  constraints: [
    '0 <= nums.length <= 10^5',
    '-10^9 <= nums[i] <= 10^9'
  ],
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
