import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'design-add-and-search-words-data-structure',
  title: 'Design Add and Search Words Data Structure',
  difficulty: 'Medium',
  category: 'Trie',
  url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
  description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string.\n\nImplement the `WordDictionary` class:\n- `WordDictionary()` Initializes the object.\n- `void addWord(word)` Adds `word` to the data structure, it can be matched later.\n- `bool search(word)` Returns `true` if there is any string in the data structure that matches `word` or `false` otherwise. `word` may contain dots `.` where dots can be matched with any letter.',
  examples: [
    {
      input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',
      output: '[null,null,null,null,false,true,true,true]'
    }
  ],
  constraints: [
    '1 <= word.length <= 25',
    'word in addWord consists of lowercase English letters.',
    'word in search consist of \'.\' or lowercase English letters.',
    'There will be at most 2 dots in word for search queries.',
    'At most 10^4 calls will be made to addWord and search.'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class WordDictionary {
    struct Node { Node* ch[26]={}; bool end=false; };
    Node* root=new Node();
    bool dfs(Node* node, string& w, int i){
        if(i==(int)w.size()) return node->end;
        char c=w[i];
        if(c=='.'){
            for(int j=0;j<26;j++) if(node->ch[j]&&dfs(node->ch[j],w,i+1)) return true;
            return false;
        }
        int idx=c-'a';
        return node->ch[idx]&&dfs(node->ch[idx],w,i+1);
    }
public:
    void addWord(string word){
        Node* cur=root;
        for(char c:word){int i=c-'a';if(!cur->ch[i])cur->ch[i]=new Node();cur=cur->ch[i];}
        cur->end=true;
    }
    bool search(string word){ return dfs(root,word,0); }
};

int main(){
    WordDictionary wd;
    wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad");
    cout<<boolalpha;
    cout<<wd.search("pad")<<endl; // false
    cout<<wd.search("bad")<<endl; // true
    cout<<wd.search(".ad")<<endl; // true
    return 0;
}`,
};

export default problem;
