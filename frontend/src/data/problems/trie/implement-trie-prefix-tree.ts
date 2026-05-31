import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'implement-trie-prefix-tree',
  title: 'Implement Trie (Prefix Tree)',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
  description: 'A trie (pronounced as "try") or **prefix tree** is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.\n\nImplement the Trie class:\n- `Trie()` Initializes the trie object.\n- `void insert(String word)` Inserts the string `word` into the trie.\n- `boolean search(String word)` Returns `true` if the string `word` is in the trie (i.e., was inserted before), and `false` otherwise.\n- `boolean startsWith(String prefix)` Returns `true` if there is a previously inserted string `word` that has the prefix `prefix`, and `false` otherwise.',
  examples: [
    {
      input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
      output: '[null, null, true, false, true, null, true]',
      explanation: 'Trie trie = new Trie();\ntrie.insert("apple");\ntrie.search("apple");   // return True\ntrie.search("app");     // return False\ntrie.startsWith("app"); // return True\ntrie.insert("app");\ntrie.search("app");     // return True'
    }
  ],
  constraints: [
    '1 <= word.length, prefix.length <= 2000',
    'word and prefix consist only of lowercase English letters.',
    'At most 3 * 10^4 calls in total will be made to insert, search, and startsWith.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Trie {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root=new Node();
public:
    void insert(string word){
        Node* cur=root;
        for(char c:word){int i=c-'a';if(!cur->ch[i])cur->ch[i]=new Node();cur=cur->ch[i];}
        cur->end=true;
    }
    bool search(string word){
        Node* cur=root;
        for(char c:word){int i=c-'a';if(!cur->ch[i])return false;cur=cur->ch[i];}
        return cur->end;
    }
    bool startsWith(string prefix){
        Node* cur=root;
        for(char c:prefix){int i=c-'a';if(!cur->ch[i])return false;cur=cur->ch[i];}
        return true;
    }
};

int main(){
    Trie t; t.insert("apple");
    cout<<boolalpha;
    cout<<t.search("apple")<<endl;   // true
    cout<<t.search("app")<<endl;     // false
    cout<<t.startsWith("app")<<endl; // true
    return 0;
}`,
};

export default problem;
