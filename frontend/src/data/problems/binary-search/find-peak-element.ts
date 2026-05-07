import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'find-peak-element',
  title: 'Find Peak Element',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/find-peak-element/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int l=0, r=nums.size()-1;
        while (l<r) {
            int mid=l+(r-l)/2;
            if (nums[mid]<nums[mid+1]) l=mid+1;
            else r=mid;
        }
        return l;
    }
};
int main() {
    Solution sol;
    vector<int> a={1,2,3,1};
    vector<int> b={1,2,1,3,5,6,4};
    cout<<sol.findPeakElement(a)<<endl; // 2
    cout<<sol.findPeakElement(b)<<endl; // 5
    return 0;
}`,
};
export default problem;
