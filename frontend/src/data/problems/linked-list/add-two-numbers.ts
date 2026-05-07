import type { ProblemDefinition } from '../types';
const problem: ProblemDefinition = {
  id: 'add-two-numbers',
  title: 'Add Two Numbers',
  difficulty: 'Medium',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/add-two-numbers/',
  starterCode: `#include <bits/stdc++.h>
using namespace std;
struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0); ListNode* cur=&dummy; int carry=0;
        while(l1||l2||carry){
            int sum=carry+(l1?l1->val:0)+(l2?l2->val:0);
            cur->next=new ListNode(sum%10); cur=cur->next;
            carry=sum/10;
            if(l1)l1=l1->next; if(l2)l2=l2->next;
        }
        return dummy.next;
    }
};
ListNode* make(vector<int>v){ListNode*d=new ListNode(0);ListNode*c=d;for(int x:v){c->next=new ListNode(x);c=c->next;}return d->next;}
void print(ListNode*h){while(h){cout<<h->val;if(h->next)cout<<"->";h=h->next;}cout<<endl;}
int main(){
    Solution sol;
    print(sol.addTwoNumbers(make({2,4,3}),make({5,6,4}))); // 7->0->8
    return 0;
}`,
};
export default problem;
