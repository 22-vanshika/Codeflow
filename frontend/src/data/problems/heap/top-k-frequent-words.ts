import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'top-k-frequent-words',
  title: 'Top K Frequent Words',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/top-k-frequent-words/',
  description: 'Given an array of strings `words` and an integer `k`, return the `k` most frequent strings.\n\nReturn the answer **sorted** by the **frequency** from highest to lowest. Sort the words with the same frequency by their **lexicographical order**.',
  examples: [
    {
      input: 'words = ["i","love","leetcode","i","love","coding"], k = 2',
      output: '["i","love"]',
      explanation: '"i" and "love" are the two most frequent words. Note that "i" comes before "love" due to a lower alphabetical order.'
    },
    {
      input: 'words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4',
      output: '["the","is","sunny","day"]',
      explanation: '"the", "is", "sunny" and "day" are the four most frequent words, with the number of occurrence being 4, 3, 2 and 1 respectively.'
    }
  ],
  constraints: [
    '1 <= words.length <= 500',
    '1 <= words[i].length <= 10',
    'words[i] consists of lowercase English letters.',
    'k is in the range [1, The number of unique words[i]]'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<string> topKFrequent(vector<string>& words, int k){
        unordered_map<string,int> freq;
        for(auto&w:words) freq[w]++;
        auto cmp=[&](const string&a,const string&b){
            if (freq[a] != freq[b]) return freq[a] > freq[b];
            return a < b;
        };
        priority_queue<string,vector<string>,decltype(cmp)> pq(cmp);
        for(auto&[w,c]:freq){ 
            pq.push(w); 
            if((int)pq.size()>k) pq.pop(); 
        }
        vector<string> res;
        while(!pq.empty()){res.push_back(pq.top());pq.pop();}
        reverse(res.begin(),res.end());
        return res;
    }
};

int main(){
    Solution sol;
    vector<string> w={"i","love","leetcode","i","love","coding"};
    for(auto&s:sol.topKFrequent(w,2)) cout<<s<<" "; // i love
    cout<<endl;
    return 0;
}`,
};

export default problem;
