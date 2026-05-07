import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'majority-element',
  title: 'Majority Element',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/majority-element/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = nums[0], count = 1;
        for (int i = 1; i < (int)nums.size(); i++) {
            if (count == 0) { candidate = nums[i]; count = 1; }
            else if (nums[i] == candidate) count++;
            else count--;
        }
        return candidate;
    }
};
int main() {
    Solution sol;
    vector<int> a = {3,2,3};
    cout << sol.majorityElement(a) << endl; // 3
    return 0;
}`,
};
export default problem;
