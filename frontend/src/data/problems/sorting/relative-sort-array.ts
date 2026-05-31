import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'relative-sort-array',
  title: 'Relative Sort Array',
  difficulty: 'Easy',
  category: 'Sorting',
  url: 'https://leetcode.com/problems/relative-sort-array/',
  description: 'Given two arrays `arr1` and `arr2`, the elements of `arr2` are distinct, and all elements in `arr2` are also in `arr1`. Sort the elements of `arr1` such that the relative ordering of items in `arr1` are the same as in `arr2`. Elements that do not appear in `arr2` should be placed at the end of `arr1` in ascending order.',
  examples: [
    {
      input: 'arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]',
      output: '[2,2,2,1,4,3,3,9,6,7,19]',
      explanation: 'Sorted relative to arr2 order first, then remaining elements in ascending order.'
    }
  ],
  constraints: [
    '1 <= arr1.length, arr2.length <= 1000',
    '0 <= arr1[i], arr2[i] <= 1000'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> relativeSortArray(vector<int>& arr1, vector<int>& arr2) {
        vector<int> count(1001, 0);
        for (int x : arr1) {
            count[x]++;
        }
        vector<int> res;
        for (int x : arr2) {
            while (count[x] > 0) {
                res.push_back(x);
                count[x]--;
            }
        }
        for (int i = 0; i <= 1000; i++) {
            while (count[i] > 0) {
                res.push_back(i);
                count[i]--;
            }
        }
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> arr1 = {2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19};
    vector<int> arr2 = {2, 1, 4, 3, 9, 6};
    vector<int> res = sol.relativeSortArray(arr1, arr2);
    for (int x : res) cout << x << " ";
    cout << endl;
    return 0;
}`,
};

export default problem;
