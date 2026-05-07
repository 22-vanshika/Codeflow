import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'palindrome-number',
  title: 'Palindrome Number',
  difficulty: 'Easy',
  category: 'Math & Geometry',
  url: 'https://leetcode.com/problems/palindrome-number/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool isPalindrome(int x){
        if(x<0||(x%10==0&&x!=0)) return false;
        int rev=0;
        while(x>rev){rev=rev*10+x%10;x/=10;}
        return x==rev||x==rev/10;
    }
};
int main(){
    Solution sol;cout<<boolalpha;
    cout<<sol.isPalindrome(121)<<endl;  // true
    cout<<sol.isPalindrome(-121)<<endl; // false
    return 0;
}`,
};
export default problem;
