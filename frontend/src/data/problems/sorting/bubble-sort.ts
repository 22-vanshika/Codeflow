import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'bubble-sort',
  title: 'Bubble Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://en.wikipedia.org/wiki/Bubble_sort',
  description: 'Implement the Bubble Sort algorithm to sort an array of integers in ascending order.',
  examples: [
    {
      input: 'nums = [5, 2, 8, 1, 9]',
      output: '[1, 2, 5, 8, 9]',
      explanation: 'The sorted array is [1, 2, 5, 8, 9].'
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
    vector<int> bubbleSort(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (nums[j] > nums[j + 1]) {
                    swap(nums[j], nums[j + 1]);
                }
            }
        }
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {5, 2, 8, 1, 9};
    vector<int> res = sol.bubbleSort(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
