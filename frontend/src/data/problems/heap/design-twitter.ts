import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'design-twitter',
  title: 'Design Twitter',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/design-twitter/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
class Twitter {
    int time=0;
    unordered_map<int,vector<pair<int,int>>> tweets; // userId -> [(time, tweetId)]
    unordered_map<int,unordered_set<int>> following;
public:
    void postTweet(int userId,int tweetId){ tweets[userId].push_back({time++,tweetId}); }
    vector<int> getNewsFeed(int userId){
        priority_queue<tuple<int,int,int,int>> pq; // (time, tweetId, userId, idx)
        auto addUser=[&](int uid){
            auto&tw=tweets[uid];
            if(!tw.empty()) pq.push({tw.back().first,tw.back().second,uid,(int)tw.size()-1});
        };
        addUser(userId);
        for(int fid:following[userId]) addUser(fid);
        vector<int> res;
        while(!pq.empty()&&(int)res.size()<10){
            auto[t,tid,uid,idx]=pq.top();pq.pop();
            res.push_back(tid);
            if(idx>0) pq.push({tweets[uid][idx-1].first,tweets[uid][idx-1].second,uid,idx-1});
        }
        return res;
    }
    void follow(int f,int e){ following[f].insert(e); }
    void unfollow(int f,int e){ following[f].erase(e); }
};
int main(){
    Twitter t; t.postTweet(1,5); t.postTweet(1,3);
    for(int v:t.getNewsFeed(1)) cout<<v<<" "; cout<<endl; // 3 5
    return 0;
}`,
};
export default problem;
