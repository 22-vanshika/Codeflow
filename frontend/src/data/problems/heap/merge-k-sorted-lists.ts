import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'merge-k-sorted-lists',
  title: 'Merge k Sorted Lists',
  difficulty: 'Hard',
  category: 'Heap / Priority Queue',
  url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists){
        auto cmp=[](ListNode*a,ListNode*b){return a->val>b->val;};
        priority_queue<ListNode*,vector<ListNode*>,decltype(cmp)> pq(cmp);
        for(auto l:lists) if(l) pq.push(l);
        ListNode dummy(0); ListNode* cur=&dummy;
        while(!pq.empty()){
            cur->next=pq.top(); pq.pop(); cur=cur->next;
            if(cur->next) pq.push(cur->next);
        }
        return dummy.next;
    }
};
ListNode* make(vector<int>v){ListNode*d=new ListNode(0);ListNode*c=d;for(int x:v){c->next=new ListNode(x);c=c->next;}return d->next;}
void print(ListNode*h){while(h){cout<<h->val;if(h->next)cout<<"->";h=h->next;}cout<<endl;}
int main(){
    Solution sol;
    vector<ListNode*> lists={make({1,4,5}),make({1,3,4}),make({2,6})};
    print(sol.mergeKLists(lists)); // 1->1->2->3->4->4->5->6
    return 0;
}`,
};
export default problem;
