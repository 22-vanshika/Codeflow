import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'remove-duplicates-from-sorted-array',
  title: 'Remove Duplicates from Sorted Array',
  difficulty: 'Easy',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int pos=1;
        for (int i=1; i<(int)nums.size(); i++)
            if (nums[i]!=nums[i-1]) nums[pos++]=nums[i];
        return pos;
    }
};
int main() {
    Solution sol;
    vector<int> nums={0,0,1,1,1,2,2,3,3,4};
    int k=sol.removeDuplicates(nums);
    cout<<k<<endl; // 5
    for (int i=0;i<k;i++) cout<<nums[i]<<" "; // 0 1 2 3 4
    cout<<endl;
    return 0;
}`,
};
export default problem;
