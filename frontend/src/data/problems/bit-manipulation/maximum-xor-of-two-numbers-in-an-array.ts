import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'maximum-xor-of-two-numbers-in-an-array',
  title: 'Maximum XOR of Two Numbers in an Array',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int findMaximumXOR(vector<int>& nums){
        int maxResult=0, mask=0;
        for(int i=31;i>=0;i--){
            mask|=(1<<i);
            unordered_set<int> prefixes;
            for(int n:nums) prefixes.insert(n&mask);
            int candidate=maxResult|(1<<i);
            for(int p:prefixes) if(prefixes.count(candidate^p)){maxResult=candidate;break;}
        }
        return maxResult;
    }
};
int main(){
    Solution sol;
    vector<int> nums={3,10,5,25,2,8};
    cout<<sol.findMaximumXOR(nums)<<endl; // 28
    return 0;
}`,
};
export default problem;
