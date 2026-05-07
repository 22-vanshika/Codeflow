import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'jump-game',
  title: 'Jump Game',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  url: 'https://leetcode.com/problems/jump-game/',
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
