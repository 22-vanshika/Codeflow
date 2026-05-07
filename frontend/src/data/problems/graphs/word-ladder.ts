import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'word-ladder',
  title: 'Word Ladder',
  difficulty: 'Hard',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/word-ladder/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList){
        unordered_set<string> wordSet(wordList.begin(),wordList.end());
        if(!wordSet.count(endWord)) return 0;
        queue<string> q; q.push(beginWord); int steps=1;
        while(!q.empty()){
            int sz=q.size();
            for(int i=0;i<sz;i++){
                string w=q.front();q.pop();
                for(int j=0;j<(int)w.size();j++){
                    char orig=w[j];
                    for(char c='a';c<='z';c++){
                        w[j]=c;
                        if(w==endWord) return steps+1;
                        if(wordSet.count(w)){q.push(w);wordSet.erase(w);}
                        w[j]=orig;
                    }
                }
            }
            steps++;
        }
        return 0;
    }
};
int main(){
    Solution sol;
    vector<string> wl={"hot","dot","dog","lot","log","cog"};
    cout<<sol.ladderLength("hit","cog",wl)<<endl; // 5
    return 0;
}`,
};
export default problem;
