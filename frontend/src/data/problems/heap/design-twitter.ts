import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'design-twitter',
  title: 'Design Twitter',
  difficulty: 'Medium',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/design-twitter/',
  description: 'Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the `10` most recent tweets in the user\'s news feed.\n\nImplement the Twitter class:\n- `Twitter()` Initializes your twitter object.\n- `void postTweet(int userId, int tweetId)` Composes a new tweet with ID `tweetId` by the user `userId`. Each call to this function will be made with a unique `tweetId`.\n- `List<Integer> getNewsFeed(int userId)` Retrieves the `10` most recent tweet IDs in the user\'s news feed. Each item in the news feed must be posted by users who the user followed or by the user themself. Tweets must be **ordered from most recent to least recent**.\n- `void follow(int followerId, int followeeId)` The user with ID `followerId` started following the user with ID `followeeId`.\n- `void unfollow(int followerId, int followeeId)` The user with ID `followerId` stopped following the user with ID `followeeId`.',
  examples: [
    {
      input: '["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]\n[[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]',
      output: '[null, null, [5], null, null, [6, 5], null, [5]]'
    }
  ],
  constraints: [
    '1 <= userId, followerId, followeeId <= 500',
    '0 <= tweetId <= 10^4',
    'All the tweets have unique IDs.',
    'At most 3 * 10^4 calls will be made to postTweet, getNewsFeed, follow, and unfollow.'
  ],
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
    void follow(int f,int e){ if(f!=e) following[f].insert(e); }
    void unfollow(int f,int e){ following[f].erase(e); }
};

int main(){
    Twitter t; t.postTweet(1,5); t.postTweet(1,3);
    for(int v:t.getNewsFeed(1)) cout<<v<<" "; cout<<endl; // 3 5
    return 0;
}`,
};

export default problem;
