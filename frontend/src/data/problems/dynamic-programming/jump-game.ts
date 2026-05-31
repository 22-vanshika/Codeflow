import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'jump-game',
  title: 'Jump Game',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/jump-game/',
  description: 'You are given an integer array `nums`. You are initially positioned at the array\'s **first index**, and each element in the array represents your maximum jump length at that position.\\n\\nReturn `true` if you can reach the last index, or `false` otherwise.',
  examples: [
    {
      input: 'nums = [2,3,1,1,4]',
      output: 'true'
    },
    {
      input: 'nums = [3,2,1,0,4]',
      output: 'false'
    }
  ],
  constraints: [
    '1 <= nums.length <= 10^4',
    '0 <= nums[i] <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool canJump(vector<int>& nums){
        int maxReach=0;
        for(int i=0;i<(int)nums.size();i++){
            if(i>maxReach) return false;
            maxReach=max(maxReach,i+nums[i]);
        }
        return true;
    }
};
int main(){
    Solution sol;
    cout<<boolalpha;
    vector<int> a={2,3,1,1,4};
    vector<int> b={3,2,1,0,4};
    cout<<sol.canJump(a)<<endl; // true
    cout<<sol.canJump(b)<<endl; // false
    return 0;
}`,
};
export default problem;
