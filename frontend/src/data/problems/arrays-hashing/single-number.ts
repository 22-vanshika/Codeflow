import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'single-number',
  title: 'Single Number',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/single-number/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for (int n : nums) res ^= n;
        return res;
    }
};
int main() {
    Solution sol;
    vector<int> a = {2,2,1};
    vector<int> b = {4,1,2,1,2};
    cout << sol.singleNumber(a) << endl; // 1
    cout << sol.singleNumber(b) << endl; // 4
    return 0;
}`,
};
export default problem;
