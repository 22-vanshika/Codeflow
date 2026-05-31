import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'merge-sort',
  title: 'Merge Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  url: 'https://en.wikipedia.org/wiki/Merge_sort',
  description: 'Implement the Merge Sort algorithm to sort an array of integers in ascending order.',
  examples: [
    {
      input: 'nums = [38, 27, 43, 3, 9, 82, 10]',
      output: '[3, 9, 10, 27, 38, 43, 82]',
      explanation: 'The sorted array is [3, 9, 10, 27, 38, 43, 82].'
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
    void merge(vector<int>& nums, int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;
        vector<int> L(n1), R(n2);
        for (int i = 0; i < n1; i++) L[i] = nums[l + i];
        for (int j = 0; j < n2; j++) R[j] = nums[m + 1 + j];
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                nums[k] = L[i];
                i++;
            } else {
                nums[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) {
            nums[k] = L[i];
            i++;
            k++;
        }
        while (j < n2) {
            nums[k] = R[j];
            j++;
            k++;
        }
    }

    void mergeSortHelper(vector<int>& nums, int l, int r) {
        if (l >= r) return;
        int m = l + (r - l) / 2;
        mergeSortHelper(nums, l, m);
        mergeSortHelper(nums, m + 1, r);
        merge(nums, l, m, r);
    }

public:
    vector<int> mergeSort(vector<int>& nums) {
        if (nums.empty()) return nums;
        mergeSortHelper(nums, 0, nums.size() - 1);
        return nums;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {38, 27, 43, 3, 9, 82, 10};
    vector<int> res = sol.mergeSort(nums);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
