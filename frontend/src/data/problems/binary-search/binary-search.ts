import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'binary-search',
  title: 'Binary Search',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/binary-search/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = (int)nums.size() - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }
};

int main() {
    Solution sol;
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << sol.search(nums, 9) << endl;  // 4
    cout << sol.search(nums, 2) << endl;  // -1
    return 0;
}`,
};

export default problem;
