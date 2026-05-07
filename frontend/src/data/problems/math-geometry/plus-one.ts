import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'plus-one',
  title: 'Plus One',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/plus-one/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> plusOne(vector<int>& digits){
        for(int i=digits.size()-1;i>=0;i--){
            if(digits[i]<9){digits[i]++;return digits;}
            digits[i]=0;
        }
        digits.insert(digits.begin(),1);
        return digits;
    }
};
int main(){
    Solution sol;
    vector<int> d={1,2,3};
    for(int v:sol.plusOne(d)) cout<<v; // 124
    cout<<endl;
    return 0;
}`,
};
export default problem;
