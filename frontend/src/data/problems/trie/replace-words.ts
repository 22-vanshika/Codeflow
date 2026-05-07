import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'replace-words',
  title: 'Replace Words',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/replace-words/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TrieNode { TrieNode* ch[26]={}; bool end=false; };
class Solution {
    TrieNode* root=new TrieNode();
    string findRoot(string& w){
        TrieNode* cur=root;
        for(int i=0;i<(int)w.size();i++){
            int idx=w[i]-'a';
            if(!cur->ch[idx]) return w;
            cur=cur->ch[idx];
            if(cur->end) return w.substr(0,i+1);
        }
        return w;
    }
public:
    string replaceWords(vector<string>& dict, string sentence){
        for(auto&d:dict){TrieNode*cur=root;for(char c:d){int i=c-'a';if(!cur->ch[i])cur->ch[i]=new TrieNode();cur=cur->ch[i];}cur->end=true;}
        string res="", word="";
        sentence+=" ";
        for(char c:sentence){
            if(c==' '){ if(!res.empty())res+=" "; res+=findRoot(word); word=""; }
            else word+=c;
        }
        return res;
    }
};
int main(){
    Solution sol;
    vector<string> dict={"cat","bat","rat"};
    cout<<sol.replaceWords(dict,"the cattle was rattled by the battery")<<endl;
    return 0;
}`,
};
export default problem;
