import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'word-search-ii',
  title: 'Word Search II',
  difficulty: 'Hard',
  category: 'Trie',
  url: 'https://leetcode.com/problems/word-search-ii/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct TrieNode { TrieNode* ch[26]={}; string word=""; };
class Solution {
    TrieNode* build(vector<string>& words){
        TrieNode* root=new TrieNode();
        for(auto&w:words){TrieNode*cur=root;for(char c:w){int i=c-'a';if(!cur->ch[i])cur->ch[i]=new TrieNode();cur=cur->ch[i];}cur->word=w;}
        return root;
    }
    void dfs(vector<vector<char>>&b,int i,int j,TrieNode*node,vector<string>&res){
        if(i<0||i>=(int)b.size()||j<0||j>=(int)b[0].size()||b[i][j]=='#') return;
        char c=b[i][j]; int idx=c-'a';
        if(!node->ch[idx]) return;
        node=node->ch[idx];
        if(!node->word.empty()){res.push_back(node->word);node->word="";}
        b[i][j]='#';
        dfs(b,i+1,j,node,res);dfs(b,i-1,j,node,res);dfs(b,i,j+1,node,res);dfs(b,i,j-1,node,res);
        b[i][j]=c;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words){
        TrieNode* root=build(words);
        vector<string> res;
        for(int i=0;i<(int)board.size();i++) for(int j=0;j<(int)board[0].size();j++) dfs(board,i,j,root,res);
        return res;
    }
};
int main(){
    Solution sol;
    vector<vector<char>> b={{'o','a','a','n'},{'e','t','a','e'},{'i','h','k','r'},{'i','f','l','v'}};
    vector<string> words={"oath","pea","eat","rain"};
    for(auto&w:sol.findWords(b,words)) cout<<w<<" ";
    cout<<endl;
    return 0;
}`,
};
export default problem;
