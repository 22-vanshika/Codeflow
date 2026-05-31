import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'first-bad-version',
  title: 'First Bad Version',
  difficulty: 'Easy',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/first-bad-version/',
  description: 'You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad. Suppose you have `n` versions `[1, 2, ..., n]` and you want to find out the first bad one, which causes all the following ones to be bad. You are given an API `bool isBadVersion(version)` which returns whether `version` is bad. Implement a function to find the first bad version. You should minimize the number of calls to the API.',
  examples: [
    {
      input: 'n = 5, bad = 4',
      output: '4'
    },
    {
      input: 'n = 1, bad = 1',
      output: '1'
    }
  ],
  constraints: [
    '1 <= bad <= n <= 2^31 - 1'
  ],
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
