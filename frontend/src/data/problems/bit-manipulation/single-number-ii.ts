import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'single-number-ii',
  title: 'Single Number II',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/single-number-ii/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int singleNumber(vector<int>& nums){
        int ones=0, twos=0;
        for(int n:nums){
            ones=(ones^n)&~twos;
            twos=(twos^n)&~ones;
        }
        return ones;
    }
};
int main(){
    Solution sol;
    vector<int> a={2,2,3,2};
    vector<int> b={0,1,0,1,0,1,99};
    cout<<sol.singleNumber(a)<<endl; // 3
    cout<<sol.singleNumber(b)<<endl; // 99
    return 0;
}`,
};
export default problem;
