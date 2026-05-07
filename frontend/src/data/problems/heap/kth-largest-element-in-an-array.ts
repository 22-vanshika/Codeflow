import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'kth-largest-element-in-an-array',
  title: 'Kth Largest Element in an Array',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> minHeap;
        for (int n : nums) {
            minHeap.push(n);
            if ((int)minHeap.size() > k) minHeap.pop();
        }
        return minHeap.top();
    }
};

int main() {
    Solution sol;
    vector<int> nums = {3,2,1,5,6,4};
    cout << sol.findKthLargest(nums, 2) << endl; // 5
    return 0;
}`,
};

export default problem;
