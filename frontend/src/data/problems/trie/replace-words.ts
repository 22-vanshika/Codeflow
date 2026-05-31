import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'replace-words',
  title: 'Replace Words',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/replace-words/',
  description: 'In English, we have a concept called **root**, which can be followed by some other word to form another longer word - let\'s call this word **derivative**. For example, when the root `"help"` is followed by the word `"ful"`, we can form a derivative `"helpful"`.\n\nGiven a `dictionary` consisting of many **roots** and a `sentence` consisting of words separated by spaces, replace all the derivatives in the sentence with the root forming it. If a derivative can be replaced by more than one root, replace it with the root that has the shortest length.\n\nReturn the `sentence` after the replacement.',
  examples: [
    {
      input: 'dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"',
      output: '"the cat was rat by the bat"'
    },
    {
      input: 'dictionary = ["a","b","c"], sentence = "aadsfasw absbs bbab cadsfafs"',
      output: '"a a b c"'
    }
  ],
  constraints: [
    '1 <= dictionary.length <= 1000',
    '1 <= dictionary[i].length <= 100',
    'dictionary[i] consists of only lowercase English letters.',
    '1 <= sentence.length <= 10^6',
    'sentence consists of only lowercase English letters and spaces.',
    'The number of words in sentence is in the range [1, 1000]',
    'The length of each word in sentence is in the range [1, 1000]'
  ],
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
        root = new TrieNode(); // reset for multiple calls
        for(auto&d:dict){
            TrieNode*cur=root;
            for(char c:d){
                int i=c-'a';
                if(!cur->ch[i]) cur->ch[i]=new TrieNode();
                cur=cur->ch[i];
            }
            cur->end=true;
        }
        string res="", word="";
        stringstream ss(sentence);
        while(ss >> word){
            if(!res.empty()) res+=" ";
            res+=findRoot(word);
        }
        return res;
    }
};

int main(){
    Solution sol;
    vector<string> dict={"cat","bat","rat"};
    cout<<sol.replaceWords(dict,"the cattle was rattled by the battery")<<endl; // the cat was rat by the bat
    return 0;
}`,
};

export default problem;
