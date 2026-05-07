import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'house-robber',
  title: 'House Robber',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/house-robber/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        for (int n : nums) {
            int curr = max(prev1, prev2 + n);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};

int main() {
    Solution sol;
    vector<int> a = {1,2,3,1};
    vector<int> b = {2,7,9,3,1};
    cout << sol.rob(a) << endl; // 4
    cout << sol.rob(b) << endl; // 12
    return 0;
}`,
};

export default problem;
