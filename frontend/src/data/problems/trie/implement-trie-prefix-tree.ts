import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'implement-trie-prefix-tree',
  title: 'Implement Trie (Prefix Tree)',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
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
