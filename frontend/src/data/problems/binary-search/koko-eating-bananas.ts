import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'koko-eating-bananas',
  title: 'Koko Eating Bananas',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/koko-eating-bananas/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int l = 1, r = *max_element(piles.begin(), piles.end());
        while (l < r) {
            int mid = l + (r - l) / 2;
            long long hours = 0;
            for (int p : piles) hours += (p + mid - 1) / mid;
            if (hours <= h) r = mid;
            else l = mid + 1;
        }
        return l;
    }
};

int main() {
    Solution sol;
    vector<int> piles = {3, 6, 7, 11};
    cout << sol.minEatingSpeed(piles, 8) << endl; // 4
    return 0;
}`,
};

export default problem;
