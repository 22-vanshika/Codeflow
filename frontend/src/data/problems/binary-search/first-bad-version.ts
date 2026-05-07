import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'first-bad-version',
  title: 'First Bad Version',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/first-bad-version/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
// Mock API
int BAD = 4;
bool isBadVersion(int v) { return v >= BAD; }

class Solution {
public:
    int firstBadVersion(int n) {
        int l=1, r=n;
        while (l<r) {
            int mid=l+(r-l)/2;
            if (isBadVersion(mid)) r=mid;
            else l=mid+1;
        }
        return l;
    }
};
int main() {
    Solution sol;
    BAD=4;
    cout<<sol.firstBadVersion(5)<<endl; // 4
    return 0;
}`,
};
export default problem;
