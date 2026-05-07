import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'find-minimum-in-rotated-sorted-array',
  title: 'Find Minimum in Rotated Sorted Array',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {
        int l = 0, r = (int)nums.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > nums[r]) l = mid + 1;
            else r = mid;
        }
        return nums[l];
    }
};

int main() {
    Solution sol;
    vector<int> nums1 = {3,4,5,1,2};
    vector<int> nums2 = {4,5,6,7,0,1,2};
    cout << sol.findMin(nums1) << endl; // 1
    cout << sol.findMin(nums2) << endl; // 0
    return 0;
}`,
};

export default problem;
