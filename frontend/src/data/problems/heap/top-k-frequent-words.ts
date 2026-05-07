import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'top-k-frequent-words',
  title: 'Top K Frequent Words',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/top-k-frequent-words/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<string> topKFrequent(vector<string>& words, int k){
        unordered_map<string,int> freq;
        for(auto&w:words) freq[w]++;
        auto cmp=[&](const string&a,const string&b){
            return freq[a]!=freq[b]?freq[a]<freq[b]:a>b;
        };
        priority_queue<string,vector<string>,decltype(cmp)> pq(cmp);
        for(auto&[w,c]:freq){ pq.push(w); if((int)pq.size()>k) pq.pop(); }
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
