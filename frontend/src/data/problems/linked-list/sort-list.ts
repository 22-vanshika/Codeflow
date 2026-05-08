import type { ProblemDefinition } from '../types';

const problem: ProblemDefinition = {
  id: 'sort-list',
  title: 'Sort List',
  difficulty: 'Medium',
  category: 'Linked List',
  url: 'https://leetcode.com/problems/sort-list/',
  description: 'Given the `head` of a linked list, return the list after sorting it in **ascending order**.\n\nCan you sort the linked list in `O(n log n)` time and `O(1)` memory (i.e. constant space)?',
  examples: [
    {
      input: 'head = [4,2,1,3]',
      output: '[1,2,3,4]'
    },
    {
      input: 'head = [-1,5,3,4,0]',
      output: '[-1,0,3,4,5]'
    },
    {
      input: 'head = []',
      output: '[]'
    }
  ],
  constraints: [
    'The number of nodes in the list is in the range [0, 5 * 10^4].',
    '-10^5 <= Node.val <= 10^5'
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

struct ListNode{int val;ListNode*next;ListNode(int x):val(x),next(nullptr){}};

class Solution {
    ListNode* merge(ListNode* a, ListNode* b){
        ListNode d(0); ListNode* c=&d;
        while(a&&b){if(a->val<=b->val){c->next=a;a=a->next;}else{c->next=b;b=b->next;}c=c->next;}
        c->next=a?a:b; return d.next;
    }
public:
    ListNode* sortList(ListNode* head) {
        if(!head||!head->next) return head;
        ListNode* slow=head,*fast=head->next;
        while(fast&&fast->next){slow=slow->next;fast=fast->next->next;}
        ListNode* mid=slow->next; slow->next=nullptr;
        return merge(sortList(head),sortList(mid));
    }
};

ListNode* make(vector<int>v){ListNode*d=new ListNode(0);ListNode*c=d;for(int x:v){c->next=new ListNode(x);c=c->next;}return d->next;}
void print(ListNode*h){while(h){cout<<h->val;if(h->next)cout<<"->";h=h->next;}cout<<endl;}

int main(){
    Solution sol;
    print(sol.sortList(make({4,2,1,3}))); // 1->2->3->4
    return 0;
}`,
};

export default problem;
