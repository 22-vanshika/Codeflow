import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'next-greater-element-i',
  title: 'Next Greater Element I',
  difficulty: 'Easy',
  category: 'Stack',
  url: 'https://leetcode.com/problems/next-greater-element-i/',
  description: 'The **next greater element** of some element `x` in an array is the **first greater** element that is **to the right** of `x` in the same array.\n\nYou are given two **distinct 0-indexed** integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.\n\nFor each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the **next greater element** of `nums2[j]` in `nums2`. If there is no next greater element, then the answer for this query is `-1`.\n\nReturn an array `ans` of length `nums1.length` such that `ans[i]` is the **next greater element** as described above.',
  examples: [
    {
      input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]',
      output: '[-1,3,-1]',
      explanation: 'The next greater element for each value of nums1 is as follows:\n- 4 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.\n- 1 is underlined in nums2 = [1,3,4,2]. The next greater element is 3.\n- 2 is underlined in nums2 = [1,3,4,2]. There is no next greater element, so the answer is -1.'
    },
    {
      input: 'nums1 = [2,4], nums2 = [1,2,3,4]',
      output: '[3,-1]',
      explanation: 'The next greater element for each value of nums1 is as follows:\n- 2 is underlined in nums2 = [1,2,3,4]. The next greater element is 3.\n- 4 is underlined in nums2 = [1,2,3,4]. There is no next greater element, so the answer is -1.'
    }
  ],
  constraints: [
    '1 <= nums1.length <= nums2.length <= 1000',
    '0 <= nums1[i], nums2[i] <= 10^4',
    'All integers in nums1 and nums2 are unique.',
    'All the integers of nums1 appear in nums2.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        unordered_map<int,int> nextGreater;
        stack<int> st;
        for (int n : nums2) {
            while (!st.empty()&&st.top()<n) { nextGreater[st.top()]=n; st.pop(); }
            st.push(n);
        }
        vector<int> res;
        for (int n : nums1) res.push_back(nextGreater.count(n)?nextGreater[n]:-1);
        return res;
    }
};

int main() {
    Solution sol;
    vector<int> n1={4,1,2}, n2={1,3,4,2};
    for (int v:sol.nextGreaterElement(n1,n2)) cout<<v<<" "; // -1 3 -1
    cout<<endl;
    return 0;
}`,
};

export default problem;
