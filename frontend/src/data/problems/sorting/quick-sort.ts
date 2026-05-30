import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'quick-sort',
  title: 'Quick Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  url: 'https://en.wikipedia.org/wiki/Quicksort',
  description: 'Implement the Quick Sort algorithm to sort an array of integers in ascending order.',
  examples: [
    {
      input: 'nums = [10, 7, 8, 9, 1, 5]',
      output: '[1, 5, 7, 8, 9, 10]',
      explanation: 'The sorted array is [1, 5, 7, 8, 9, 10].'
    }
  ],
  constraints: [
    '1 <= nums.length <= 100',
    '-100 <= nums[i] <= 100'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
private:
    int partition(vector<int>& nums, int low, int high) {
        int pivot = nums[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (nums[j] < pivot) {
                i++;
                swap(nums[i], nums[j]);
            }
        }
        swap(nums[i + 1], nums[high]);
        return i + 1;
    }

    void quickSortHelper(vector<int>& nums, int low, int high) {
        if (low < high) {
            int pi = partition(nums, low, high);
            quickSortHelper(nums, low, pi - 1);
            quickSortHelper(nums, pi + 1, high);
        }
    }

public:
    vector<int> quickSort(vector<int>& nums) {
        if (nums.empty()) return nums;
        quickSortHelper(nums, 0, nums.size() - 1);
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {10, 7, 8, 9, 1, 5};
    vector<int> res = sol.quickSort(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
