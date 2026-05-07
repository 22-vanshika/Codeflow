import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'reorganize-string',
  title: 'Reorganize String',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/reorganize-string/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Solution {
public:
    string reorganizeString(string s){
        int freq[26]={};
        for(char c:s) freq[c-'a']++;
        priority_queue<pair<int,char>> pq;
        for(int i=0;i<26;i++) if(freq[i]) pq.push({freq[i],'a'+i});
        string res="";
        while(pq.size()>=2){
            auto[f1,c1]=pq.top();pq.pop();
            auto[f2,c2]=pq.top();pq.pop();
            res+=c1; res+=c2;
            if(f1-1) pq.push({f1-1,c1});
            if(f2-1) pq.push({f2-1,c2});
        }
        if(!pq.empty()){
            if(pq.top().first>1) return "";
            res+=pq.top().second;
        }
        return res;
    }
};
int main(){
    Solution sol;
    cout<<sol.reorganizeString("aab")<<endl; // aba
    cout<<sol.reorganizeString("aaab")<<endl; // ""
    return 0;
}`,
};
export default problem;
