import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'number-of-1-bits',
  title: 'Number of 1 Bits',
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  url: 'https://leetcode.com/problems/number-of-1-bits/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int hammingWeight(uint32_t n){
        int cnt=0;
        while(n){n&=n-1;cnt++;}
        return cnt;
    }
};
int main(){
    Solution sol;
    cout<<sol.hammingWeight(11)<<endl; // 3 (1011)
    cout<<sol.hammingWeight(128)<<endl; // 1
    return 0;
}`,
};
export default problem;
