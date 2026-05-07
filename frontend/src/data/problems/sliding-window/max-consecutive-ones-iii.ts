import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'max-consecutive-ones-iii',
  title: 'Max Consecutive Ones III',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestOnes(vector<int>& nums, int k) {
        int l=0, zeros=0, res=0;
        for (int r=0;r<(int)nums.size();r++) {
            if (nums[r]==0) zeros++;
            while (zeros>k) if (nums[l++]==0) zeros--;
            res=max(res,r-l+1);
        }
        return res;
    }
};
int main() {
    Solution sol;
    vector<int> nums={1,1,1,0,0,0,1,1,1,1,0};
    cout<<sol.longestOnes(nums,2)<<endl; // 6
    return 0;
}`,
};
export default problem;
