import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'word-ladder',
  title: 'Word Ladder',
  difficulty: 'Hard',
  category: 'Graphs',
  url: 'https://leetcode.com/problems/word-ladder/',
  description: 'A **transformation sequence** from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that:\n- Every adjacent pair of words differs by a single character.\n- Every `si` for `1 <= i <= k` is in `wordList`. Note that `beginWord` does not need to be in `wordList`.\n- `sk == endWord`.\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the **number of words** in the **shortest transformation sequence** from `beginWord` to `endWord`, or `0` if no such sequence exists.',
  examples: [
    {
      input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
      output: '5',
      explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.'
    },
    {
      input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
      output: '0',
      explanation: 'The endWord "cog" is not in wordList, therefore there is no valid transformation sequence.'
    }
  ],
  constraints: [
    '1 <= beginWord.length <= 10',
    'endWord.length == beginWord.length',
    '1 <= wordList.length <= 5000',
    'wordList[i].length == beginWord.length',
    'beginWord, endWord, and wordList[i] consist of lowercase English letters.',
    'beginWord != endWord',
    'All the words in wordList are unique.'
  ],
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
                    }
                    w[j]=orig;
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
