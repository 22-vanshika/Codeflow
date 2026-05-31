import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'search-suggestions-system',
  title: 'Search Suggestions System',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/search-suggestions-system/',
  description: 'You are given an array of strings `products` and a string `searchWord`.\n\nDesign a system that suggests at most three product names from `products` after each character of `searchWord` is typed. Suggested products should have common prefix with `searchWord`. If there are more than three suggested products return the three lexicographically minimum products.\n\nReturn a list of lists of the suggested products after each character of `searchWord` is typed.',
  examples: [
    {
      input: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"',
      output: '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]'
    }
  ],
  constraints: [
    '1 <= products.length <= 1000',
    '1 <= products[i].length <= 3000',
    '1 <= searchWord.length <= 1000',
    'All strings of products are unique.',
    'products[i] consists of lowercase English letters.',
    'searchWord consists of lowercase English letters.'
  ],
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
