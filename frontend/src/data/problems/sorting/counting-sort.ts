import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'counting-sort',
  title: 'Counting Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://en.wikipedia.org/wiki/Counting_sort',
  description: 'Implement the Counting Sort algorithm to sort an array of integers in ascending order.',
  examples: [
    {
      input: 'nums = [4, 2, 2, 8, 3, 3, 1]',
      output: '[1, 2, 2, 3, 3, 4, 8]',
      explanation: 'The sorted array is [1, 2, 2, 3, 3, 4, 8].'
    }
  ],
  constraints: [
    '1 <= nums.length <= 100',
    '-100 <= nums[i] <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> countingSort(vector<int>& nums) {
        if (nums.empty()) return nums;
        int minVal = nums[0], maxVal = nums[0];
        for (int x : nums) {
            if (x < minVal) minVal = x;
            if (x > maxVal) maxVal = x;
        }
        int range = maxVal - minVal + 1;
        vector<int> count(range, 0);
        for (int x : nums) {
            count[x - minVal]++;
        }
        int idx = 0;
        for (int i = 0; i < range; i++) {
            while (count[i] > 0) {
                nums[idx++] = i + minVal;
                count[i]--;
            }
        }
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {4, 2, 2, 8, 3, 3, 1};
    vector<int> res = sol.countingSort(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
