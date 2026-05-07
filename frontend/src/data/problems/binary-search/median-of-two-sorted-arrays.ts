import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'median-of-two-sorted-arrays',
  title: 'Median of Two Sorted Arrays',
  difficulty: 'Hard',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
        if (A.size()>B.size()) swap(A,B);
        int m=A.size(), n=B.size(), lo=0, hi=m;
        while (lo<=hi) {
            int i=lo+(hi-lo)/2, j=(m+n+1)/2-i;
            int maxL_A=(i==0?INT_MIN:A[i-1]), minR_A=(i==m?INT_MAX:A[i]);
            int maxL_B=(j==0?INT_MIN:B[j-1]), minR_B=(j==n?INT_MAX:B[j]);
            if (maxL_A<=minR_B&&maxL_B<=minR_A) {
                if ((m+n)%2==0) return (max(maxL_A,maxL_B)+min(minR_A,minR_B))/2.0;
                return max(maxL_A,maxL_B);
            } else if (maxL_A>minR_B) hi=i-1; else lo=i+1;
        }
        return 0;
    }
};
int main() {
    Solution sol;
    vector<int> a={1,3}, b={2};
    cout<<sol.findMedianSortedArrays(a,b)<<endl; // 2.0
    vector<int> c={1,2}, d={3,4};
    cout<<sol.findMedianSortedArrays(c,d)<<endl; // 2.5
    return 0;
}`,
};
export default problem;
