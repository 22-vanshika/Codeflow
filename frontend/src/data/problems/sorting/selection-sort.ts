import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'selection-sort',
  title: 'Selection Sort',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://en.wikipedia.org/wiki/Selection_sort',
  description: 'Implement the Selection Sort algorithm to sort an array of integers in ascending order.',
  examples: [
    {
      input: 'nums = [29, 10, 14, 37, 13]',
      output: '[10, 13, 14, 29, 37]',
      explanation: 'The sorted array is [10, 13, 14, 29, 37].'
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
    vector<int> selectionSort(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[minIdx]) {
                    minIdx = j;
                }
            }
            swap(nums[i], nums[minIdx]);
        }
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {29, 10, 14, 37, 13};
    vector<int> res = sol.selectionSort(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
