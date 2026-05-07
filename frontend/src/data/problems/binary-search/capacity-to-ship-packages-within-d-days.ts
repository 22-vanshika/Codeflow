import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'capacity-to-ship-packages-within-d-days',
  title: 'Capacity To Ship Packages Within D Days',
  difficulty: 'Medium',
  category: 'Binary Search',
  url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    bool canShip(vector<int>& w, int cap, int days) {
        int d=1, curr=0;
        for (int x:w) { if (curr+x>cap) { d++; curr=0; } curr+=x; }
        return d<=days;
    }
public:
    int shipWithinDays(vector<int>& weights, int days) {
        int l=*max_element(weights.begin(),weights.end());
        int r=accumulate(weights.begin(),weights.end(),0);
        while (l<r) {
            int mid=l+(r-l)/2;
            if (canShip(weights,mid,days)) r=mid; else l=mid+1;
        }
        return l;
    }
};
int main() {
    Solution sol;
    vector<int> w={1,2,3,4,5,6,7,8,9,10};
    cout<<sol.shipWithinDays(w,5)<<endl; // 15
    return 0;
}`,
};
export default problem;
