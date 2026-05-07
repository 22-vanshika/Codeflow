import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'minimum-size-subarray-sum',
  title: 'Minimum Size Subarray Sum',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int l=0, sum=0, res=INT_MAX;
        for (int r=0; r<(int)nums.size(); r++) {
            sum+=nums[r];
            while (sum>=target) {
                res=min(res, r-l+1);
                sum-=nums[l++];
            }
        }
        return res==INT_MAX?0:res;
    }
};
int main() {
    Solution sol;
    vector<int> nums={2,3,1,2,4,3};
    cout<<sol.minSubArrayLen(7,nums)<<endl; // 2
    return 0;
}`,
};
export default problem;
