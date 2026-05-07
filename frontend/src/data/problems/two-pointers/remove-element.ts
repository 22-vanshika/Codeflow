import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'remove-element',
  title: 'Remove Element',
  difficulty: 'Easy',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/remove-element/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int k=0;
        for (int n : nums) if (n!=val) nums[k++]=n;
        return k;
    }
};
int main() {
    Solution sol;
    vector<int> nums={3,2,2,3};
    int k=sol.removeElement(nums,3);
    cout<<k<<endl; // 2
    for (int i=0;i<k;i++) cout<<nums[i]<<" "; // 2 2
    cout<<endl;
    return 0;
}`,
};
export default problem;
