import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'sum-of-two-integers',
  title: 'Sum of Two Integers',
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/sum-of-two-integers/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int getSum(int a, int b){
        while(b){
            int carry=(unsigned int)(a&b)<<1;
            a=a^b; b=carry;
        }
        return a;
    }
};
int main(){
    Solution sol;
    cout<<sol.getSum(1,2)<<endl;  // 3
    cout<<sol.getSum(2,3)<<endl;  // 5
    return 0;
}`,
};
export default problem;
