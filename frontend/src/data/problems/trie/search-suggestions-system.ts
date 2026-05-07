import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'search-suggestions-system',
  title: 'Search Suggestions System',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/search-suggestions-system/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord){
        sort(products.begin(),products.end());
        vector<vector<string>> res;
        int l=0, r=products.size()-1;
        for(int i=0;i<(int)searchWord.size();i++){
            char c=searchWord[i];
            while(l<=r&&((int)products[l].size()<=i||products[l][i]<c)) l++;
            while(l<=r&&((int)products[r].size()<=i||products[r][i]>c)) r--;
            vector<string> suggestions;
            for(int j=l;j<=min(l+2,r);j++) suggestions.push_back(products[j]);
            res.push_back(suggestions);
        }
        return res;
    }
};
int main(){
    Solution sol;
    vector<string> p={"mobile","mouse","moneypot","monitor","mousepad"};
    for(auto&v:sol.suggestedProducts(p,"mouse")){for(auto&s:v)cout<<s<<" ";cout<<endl;}
    return 0;
}`,
};
export default problem;
