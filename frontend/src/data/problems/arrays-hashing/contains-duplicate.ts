import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'contains-duplicate',
  title: 'Contains Duplicate',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  url: 'https://leetcode.com/problems/contains-duplicate/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (seen.count(n)) return true;
            seen.insert(n);
        }
        return false;
    }
};

int main() {
    Solution sol;
    cout << boolalpha;
    vector<int> a = {1, 2, 3, 1};
    vector<int> b = {1, 2, 3, 4};
    cout << sol.containsDuplicate(a) << endl; // true
    cout << sol.containsDuplicate(b) << endl; // false
    return 0;
}`,
};

export default problem;
