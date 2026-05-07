import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'missing-number',
  title: 'Missing Number',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/missing-number/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int missingNumber(vector<int>& nums){
        int n=nums.size(), res=n;
        for(int i=0;i<n;i++) res^=i^nums[i];
        return res;
    }
};
int main(){
    Solution sol;
    vector<int> a={3,0,1};
    vector<int> b={9,6,4,2,3,5,7,0,1};
    cout<<sol.missingNumber(a)<<endl; // 2
    cout<<sol.missingNumber(b)<<endl; // 8
    return 0;
}`,
};
export default problem;
