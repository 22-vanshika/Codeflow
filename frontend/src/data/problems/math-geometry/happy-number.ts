import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'happy-number',
  title: 'Happy Number',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/happy-number/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
    int sumSq(int n){int s=0;while(n){int d=n%10;s+=d*d;n/=10;}return s;}
public:
    bool isHappy(int n){
        int slow=n,fast=sumSq(n);
        while(fast!=1&&slow!=fast){slow=sumSq(slow);fast=sumSq(sumSq(fast));}
        return fast==1;
    }
};
int main(){
    Solution sol;cout<<boolalpha;
    cout<<sol.isHappy(19)<<endl; // true
    cout<<sol.isHappy(2)<<endl;  // false
    return 0;
}`,
};
export default problem;
