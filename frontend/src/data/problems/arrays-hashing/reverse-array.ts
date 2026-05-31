import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'reverse-array',
  title: 'Reverse Array',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://www.geeksforgeeks.org/program-to-reverse-an-array/',
  description: 'Given an array (or vector) of integers, reverse the elements in-place and return the reversed array.',
  examples: [
    {
      input: 'nums = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      explanation: 'The elements are reversed.'
    }
  ],
  constraints: [
    '1 <= nums.length <= 1000',
    '-10^5 <= nums[i] <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> reverseArray(vector<int>& nums) {
        int i = 0, j = nums.size() - 1;
        while (i < j) {
            swap(nums[i], nums[j]);
            i++;
            j--;
        }
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {1, 2, 3, 4, 5};
    vector<int> res = sol.reverseArray(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
