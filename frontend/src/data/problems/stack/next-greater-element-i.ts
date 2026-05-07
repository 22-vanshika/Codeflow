import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'next-greater-element-i',
  title: 'Next Greater Element I',
  difficulty: 'Easy',
  category: 'Stack',
  url: 'https://leetcode.com/problems/next-greater-element-i/',
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
