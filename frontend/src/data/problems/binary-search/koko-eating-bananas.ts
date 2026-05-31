import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'koko-eating-bananas',
  title: 'Koko Eating Bananas',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/koko-eating-bananas/',
  description: 'Koko loves to eat bananas. There are `n` piles of bananas, the `ith` pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nKoko likes to eat slowly but still wants to finish eating all the bananas before the guards return.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.',
  examples: [
    {
      input: 'piles = [3,6,7,11], h = 8',
      output: '4'
    },
    {
      input: 'piles = [30,11,23,4,20], h = 5',
      output: '30'
    },
    {
      input: 'piles = [30,11,23,4,20], h = 6',
      output: '23'
    }
  ],
  constraints: [
    '1 <= piles.length <= 10^4',
    'piles.length <= h <= 10^9',
    '1 <= piles[i] <= 10^9'
  ],
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
