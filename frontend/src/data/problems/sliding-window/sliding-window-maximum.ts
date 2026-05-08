import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sliding-window-maximum',
  title: 'Sliding Window Maximum',
  difficulty: 'Hard',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/sliding-window-maximum/',
  description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.',
  examples: [
    {
      input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
      output: '[3,3,5,5,6,7]',
      explanation: 'Window position                Max\n---------------               -----\n[1  3  -1] -3  5  3  6  7       3\n 1 [3  -1  -3] 5  3  6  7       3\n 1  3 [-1  -3  5] 3  6  7       5\n 1  3  -1 [-3  5  3] 6  7       5\n 1  3  -1  -3 [5  3  6] 7       6\n 1  3  -1  -3  5 [3  6  7]      7'
    },
    {
      input: 'nums = [1], k = 1',
      output: '[1]'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^5',
    '-10^4 <= nums[i] <= 10^4',
    '1 <= k <= nums.length'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq; // stores indices
        vector<int> res;
        for (int i=0; i<(int)nums.size(); i++) {
            while (!dq.empty()&&dq.front()<i-k+1) dq.pop_front();
            while (!dq.empty()&&nums[dq.back()]<nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i>=k-1) res.push_back(nums[dq.front()]);
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> nums={1,3,-1,-3,5,3,6,7};
    for (int v:sol.maxSlidingWindow(nums,3)) cout<<v<<" "; // 3 3 5 5 6 7
    cout<<endl;
    return 0;
}`,
};

export default problem;
