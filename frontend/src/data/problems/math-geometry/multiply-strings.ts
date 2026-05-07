import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'multiply-strings',
  title: 'Multiply Strings',
  difficulty: 'Medium',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/multiply-strings/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string multiply(string num1, string num2){
        int m=num1.size(),n=num2.size();
        vector<int> pos(m+n,0);
        for(int i=m-1;i>=0;i--) for(int j=n-1;j>=0;j--){
            int mul=(num1[i]-'0')*(num2[j]-'0');
            int p1=i+j,p2=i+j+1,sum=mul+pos[p2];
            pos[p2]=sum%10; pos[p1]+=sum/10;
        }
        string res="";
        for(int d:pos) if(!(res.empty()&&d==0)) res+=to_string(d);
        return res.empty()?"0":res;
    }
};
int main(){
    Solution sol;
    cout<<sol.multiply("2","3")<<endl;   // 6
    cout<<sol.multiply("123","456")<<endl; // 56088
    return 0;
}`,
};
export default problem;
