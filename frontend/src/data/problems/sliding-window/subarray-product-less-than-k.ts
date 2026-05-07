import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'subarray-product-less-than-k',
  title: 'Subarray Product Less Than K',
  difficulty: 'Medium',
  category: 'Sliding Window',
  url: 'https://leetcode.com/problems/subarray-product-less-than-k/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        if (k<=1) return 0;
        int prod=1, l=0, count=0;
        for (int r=0;r<(int)nums.size();r++) {
            prod*=nums[r];
            while (prod>=k) prod/=nums[l++];
            count+=r-l+1;
        }
        return count;
    }
};
int main() {
    Solution sol;
    vector<int> nums={10,5,2,6};
    cout<<sol.numSubarrayProductLessThanK(nums,100)<<endl; // 8
    return 0;
}`,
};
export default problem;
