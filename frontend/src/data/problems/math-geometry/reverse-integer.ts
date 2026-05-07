import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'reverse-integer',
  title: 'Reverse Integer',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/reverse-integer/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int reverse(int x){
        long long res=0;
        while(x){res=res*10+x%10;x/=10;}
        return (res>INT_MAX||res<INT_MIN)?0:(int)res;
    }
};
int main(){
    Solution sol;
    cout<<sol.reverse(123)<<endl;    // 321
    cout<<sol.reverse(-123)<<endl;   // -321
    cout<<sol.reverse(1534236469)<<endl; // 0 (overflow)
    return 0;
}`,
};
export default problem;
