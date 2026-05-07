import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'sliding-window-maximum',
  title: 'Sliding Window Maximum',
  difficulty: 'Hard',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/sliding-window-maximum/',
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
