import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'third-maximum-number',
  title: 'Third Maximum Number',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/third-maximum-number/',
  description: 'Given an integer array `nums`, return the third distinct maximum number in this array. If the third maximum does not exist, return the maximum number.',
  examples: [
    {
      input: 'nums = [3,2,1]',
      output: '1',
      explanation: 'The first distinct maximum is 3. The second distinct maximum is 2. The third distinct maximum is 1.'
    },
    {
      input: 'nums = [1,2]',
      output: '2',
      explanation: 'The first distinct maximum is 2. The second distinct maximum is 1. The third distinct maximum does not exist, so the maximum (2) is returned.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '-2^31 <= nums[i] <= 2^31 - 1'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int thirdMax(vector<int>& nums) {
        long long first = -2000000000000LL;
        long long second = -2000000000000LL;
        long long third = -2000000000000LL;
        
        for (int x : nums) {
            if (x == first || x == second || x == third) continue;
            if (x > first) {
                third = second;
                second = first;
                first = x;
            } else if (x > second) {
                third = second;
                second = x;
            } else if (x > third) {
                third = x;
            }
        }
        return (third == -2000000000000LL) ? first : third;
    }
};

int main() {
    Solution sol;
    vector<int> a = {3, 2, 1};
    vector<int> b = {1, 2};
    cout << sol.thirdMax(a) << endl; // 1
    cout << sol.thirdMax(b) << endl; // 2
    return 0;
}`,
};

export default problem;
