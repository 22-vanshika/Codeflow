import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'two-sum-ii-input-array-is-sorted',
  title: 'Two Sum II - Input Array Is Sorted',
  difficulty: 'Medium',
  category: 'Two Pointers',
  url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l=0, r=numbers.size()-1;
        while (l<r) {
            int sum=numbers[l]+numbers[r];
            if (sum==target) return {l+1,r+1};
            else if (sum<target) l++;
            else r--;
        }
        return {};
    }
};
int main() {
    Solution sol;
    vector<int> nums={2,7,11,15};
    auto r=sol.twoSum(nums,9);
    cout<<r[0]<<" "<<r[1]<<endl; // 1 2
    return 0;
}`,
};
export default problem;
